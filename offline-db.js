/* Bhubondanga Offline-First Data Layer v1 */
(function (W) {
  'use strict';
  if (W.BDOffline) return;

  const DB_NAME = 'bhubondanga-offline-v1';
  const DB_VERSION = 1;
  const STORES = { posts: 'posts', actions: 'actions', drafts: 'drafts', meta: 'meta' };
  const nowISO = () => new Date().toISOString();
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `bd-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  let dbPromise;
  let syncing = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORES.posts)) {
          const s = db.createObjectStore(STORES.posts, { keyPath: 'id' });
          s.createIndex('created_at', 'created_at');
          s.createIndex('author_id', 'author_id');
        }
        if (!db.objectStoreNames.contains(STORES.actions)) {
          const s = db.createObjectStore(STORES.actions, { keyPath: 'id' });
          s.createIndex('created_at', 'created_at');
          s.createIndex('state', 'state');
        }
        if (!db.objectStoreNames.contains(STORES.drafts)) {
          const s = db.createObjectStore(STORES.drafts, { keyPath: 'id' });
          s.createIndex('updated_at', 'updated_at');
        }
        if (!db.objectStoreNames.contains(STORES.meta)) db.createObjectStore(STORES.meta, { keyPath: 'key' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function tx(store, mode, fn) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const s = t.objectStore(store);
      let value;
      try { value = fn(s, t); } catch (e) { reject(e); return; }
      t.oncomplete = () => resolve(value);
      t.onerror = () => reject(t.error || new Error('IndexedDB transaction failed'));
      t.onabort = () => reject(t.error || new Error('IndexedDB transaction aborted'));
    });
  }

  function reqPromise(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function put(store, value) { return tx(store, 'readwrite', s => s.put(value)); }
  async function del(store, key) { return tx(store, 'readwrite', s => s.delete(key)); }
  async function get(store, key) {
    const db = await openDB();
    const t = db.transaction(store, 'readonly');
    return reqPromise(t.objectStore(store).get(key));
  }
  async function all(store) {
    const db = await openDB();
    const t = db.transaction(store, 'readonly');
    return reqPromise(t.objectStore(store).getAll());
  }

  function client() {
    return W.BD_SUPABASE || W.supabaseClient || W.bhubondangaSupabase || W.__BD_SUPABASE_CLIENT__ ||
      ((W.supabase && W.supabase.auth && W.supabase.from) ? W.supabase : null);
  }

  async function sessionUser() {
    const c = client();
    try { return (await c?.auth?.getSession?.()).data?.session?.user || null; } catch (_) { return null; }
  }

  async function cachePosts(posts) {
    if (!Array.isArray(posts) || !posts.length) return;
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const t = db.transaction(STORES.posts, 'readwrite');
      const s = t.objectStore(STORES.posts);
      posts.forEach(p => {
        if (!p || p.id == null) return;
        const row = { ...p, id: String(p.id), _cached_at: nowISO() };
        try { s.put(row); } catch (_) { /* ignore malformed post */ }
      });
      t.oncomplete = resolve;
      t.onerror = () => reject(t.error);
    });
  }

  async function getCachedPosts(opts = {}) {
    let rows = await all(STORES.posts);
    const authorId = String(opts.authorId || '').trim();
    if (authorId) rows = rows.filter(p => String(p.author_id || p.authorId || p.user_id || p.userId || p.profile_id || '') === authorId);
    rows = rows.filter(p => !p._deleted && p.status !== 'deleted');
    rows.sort((a, b) => Date.parse(b.created_at || b.updated_at || 0) - Date.parse(a.created_at || a.updated_at || 0));
    const offset = Math.max(0, Number(opts.offset) || 0), size = Math.max(1, Number(opts.size) || 20);
    return rows.slice(offset, offset + size);
  }

  async function cachePost(post) { if (post?.id != null) await cachePosts([post]); return post; }
  async function removeCachedPost(id) { return del(STORES.posts, String(id)); }

  async function queueAction(action) {
    const row = {
      id: action.id || uuid(),
      dedupe_key: action.dedupe_key || null,
      kind: action.kind || 'generic',
      payload: action.payload || {},
      created_at: action.created_at || nowISO(),
      attempts: Number(action.attempts || 0),
      state: 'pending',
      last_error: null
    };
    if (row.dedupe_key) {
      const pending = (await all(STORES.actions)).find(x => x.state === 'pending' && x.dedupe_key === row.dedupe_key);
      if (pending) row.id = pending.id;
    }
    await put(STORES.actions, row);
    W.dispatchEvent(new CustomEvent('bd:offline-queue-change', { detail: { queued: true, action: row } }));
    if (navigator.onLine) Promise.resolve().then(sync).catch(() => {});
    return row;
  }

  async function genericMutation(c, a) {
    const p = a.payload || {}, table = p.table;
    if (!table) throw new Error('Missing table');
    if (a.kind === 'table.insert') return c.from(table).insert(p.row);
    if (a.kind === 'table.upsert') return c.from(table).upsert(p.row, p.options || undefined);
    if (a.kind === 'table.delete') {
      let q = c.from(table).delete();
      for (const [k, v] of Object.entries(p.match || {})) q = q.eq(k, v);
      return q;
    }
    if (a.kind === 'table.update') {
      let q = c.from(table).update(p.row || {});
      for (const [k, v] of Object.entries(p.match || {})) q = q.eq(k, v);
      return q;
    }
    throw new Error(`Unsupported generic operation: ${a.kind}`);
  }

  async function syncPost(c, a, uid) {
    const p = { ...(a.payload || {}) };
    const id = String(p.id || uuid());
    const owner = String(p.author_id || p.user_id || uid || '');
    if (!owner) throw new Error('No authenticated user for queued post');
    const attempts = [
      { id, author_id: owner, country_code:p.country_code||null, country_name:p.country_name||null, region:p.region||null, language_code:p.language_code||null, title:p.title||'', body:p.body||p.content||'', type:p.type||p.category||'normal', status:p.status||'published', template:p.template||null, font:p.font||null, image_url:p.image_url||null, media_url:p.media_url||null, media_type:p.media_type||null, audio_url:p.audio_url||null, video_url:p.video_url||null, composer_mode:p.composer_mode||null, metadata:p.metadata||{} },
      { id, author_id: owner, title:p.title||'', body:p.body||p.content||'', type:p.type||p.category||'normal', status:p.status||'published', template:p.template||null, font:p.font||null, image_url:p.image_url||null, media_url:p.media_url||null, media_type:p.media_type||null, metadata:p.metadata||{} },
      { id, user_id: owner, title:p.title||'', content:p.body||p.content||'', category:p.type||p.category||'normal', status:p.status||'published', template:p.template||null, font:p.font||null, image_url:p.image_url||null, media_url:p.media_url||null, media_type:p.media_type||null, metadata:p.metadata||{} },
      { id, author_id: owner, title:p.title||'', content:p.body||p.content||'', category:p.type||p.category||'normal', status:p.status||'published' }
    ];
    let last;
    for (const row of attempts) {
      const r = await c.from('posts').upsert(row, { onConflict: 'id' });
      if (!r.error) { await cachePost({ ...p, ...row, id }); return; }
      last = r.error;
    }
    throw last || new Error('Post sync failed');
  }

  async function syncComment(c, a, uid) {
    const p = { ...(a.payload || {}) };
    const id = String(p.id || uuid()), owner = p.user_id || p.author_id || uid;
    if (!p.post_id || !owner) throw new Error('Invalid queued comment');
    const attempts = [
      { id, post_id:p.post_id, user_id:owner, content:p.content || p.body || '', parent_id:p.parent_id || null, status:p.status || 'published', media_url:p.media_url || null, created_at:p.created_at || nowISO() },
      { id, post_id:p.post_id, user_id:owner, content:p.content || p.body || '', parent_id:p.parent_id || null, status:p.status || 'published', image_url:p.media_url || p.image_url || null, created_at:p.created_at || nowISO() },
      { id, post_id:p.post_id, user_id:owner, content:p.content || p.body || '', parent_id:p.parent_id || null, status:p.status || 'published', created_at:p.created_at || nowISO() },
      { id, post_id:p.post_id, user_id:owner, content:p.content || p.body || '', created_at:p.created_at || nowISO() }
    ];
    let last;
    for (const row0 of attempts) {
      const row = { ...row0 }; if (!row.parent_id) delete row.parent_id; if (!row.media_url) delete row.media_url; if (!row.image_url) delete row.image_url;
      const r = await c.from('comments').upsert(row, { onConflict: 'id' });
      if (!r.error) return; last = r.error;
    }
    throw last || new Error('Comment sync failed');
  }

  async function syncReaction(c, a, uid) {
    const p = a.payload || {}, postId = String(p.post_id || ''), type = String(p.reaction || p.type || '');
    if (!postId || !uid) throw new Error('Invalid queued reaction');
    for (const table of ['post_reactions', 'reactions']) {
      try {
        const d = await c.from(table).delete().eq('post_id', postId).eq('user_id', uid);
        if (d.error && /relation|does not exist/i.test(String(d.error.message || ''))) continue;
        if (!type) return;
        const variants = table === 'post_reactions'
          ? [{post_id:postId,user_id:uid,reaction:type},{post_id:postId,user_id:uid,reaction_type:type}]
          : [{post_id:postId,user_id:uid,reaction:type},{post_id:postId,user_id:uid,type}];
        for (const row of variants) { const r = await c.from(table).upsert(row, { onConflict:'post_id,user_id' }); if (!r.error) return; }
      } catch (_) {}
    }
    throw new Error('Reaction sync failed');
  }

  async function syncDiary(c, a, uid) {
    const p = { ...(a.payload || {}) };
    p.id = String(p.id || uuid());
    p.user_id = p.user_id || uid;
    const r = await c.from('diary_entries').upsert(p, { onConflict:'id' });
    if (r.error) throw r.error;
  }

  async function perform(c, action, uid) {
    if (action.kind === 'post.create') return syncPost(c, action, uid);
    if (action.kind === 'comment.create') return syncComment(c, action, uid);
    if (action.kind === 'reaction.set') return syncReaction(c, action, uid);
    if (action.kind === 'diary.support' || action.kind === 'diary.draft') return syncDiary(c, action, uid);
    if (action.kind.startsWith('table.')) {
      const r = await genericMutation(c, action);
      if (r?.error) throw r.error;
      return;
    }
    throw new Error(`Unknown queued action: ${action.kind}`);
  }

  async function sync() {
    if (syncing) return syncing;
    if (!navigator.onLine) return { synced: 0, pending: (await all(STORES.actions)).filter(a => a.state === 'pending').length };
    syncing = (async () => {
      const c = client();
      if (!c) return { synced: 0, pending: (await all(STORES.actions)).filter(a => a.state === 'pending').length };
      const user = await sessionUser();
      const uid = user?.id || '';
      let actions = (await all(STORES.actions)).filter(a => a.state === 'pending').sort((a,b) => Date.parse(a.created_at)-Date.parse(b.created_at));
      let synced = 0;
      for (const action of actions) {
        if (!navigator.onLine) break;
        try {
          await perform(c, action, uid);
          await del(STORES.actions, action.id);
          synced++;
        } catch (err) {
          action.attempts = Number(action.attempts || 0) + 1;
          action.last_error = String(err?.message || err || 'sync failed').slice(0, 500);
          action.state = 'pending';
          await put(STORES.actions, action);
          if (/jwt|auth|session|permission|row-level|rls/i.test(action.last_error)) break;
        }
      }
      const pending = (await all(STORES.actions)).filter(a => a.state === 'pending').length;
      W.dispatchEvent(new CustomEvent('bd:offline-sync', { detail: { synced, pending } }));
      return { synced, pending };
    })().finally(() => { syncing = null; });
    return syncing;
  }

  async function putDraft(row) {
    const item = { ...row, id: String(row.id || uuid()), updated_at: nowISO() };
    await put(STORES.drafts, item);
    return item;
  }
  async function getDrafts() { const rows = await all(STORES.drafts); return rows.sort((a,b)=>Date.parse(b.updated_at)-Date.parse(a.updated_at)); }
  async function deleteDraft(id) { return del(STORES.drafts, String(id)); }
  async function setMeta(key, value) { return put(STORES.meta, { key, value, updated_at: nowISO() }); }
  async function getMeta(key) { return (await get(STORES.meta, key))?.value; }
  async function pendingCount() { return (await all(STORES.actions)).filter(a => a.state === 'pending').length; }

  W.BDOffline = Object.freeze({
    init: openDB, uuid, cachePosts, cachePost, getCachedPosts, removeCachedPost,
    queueAction, sync, putDraft, getDrafts, deleteDraft, setMeta, getMeta, pendingCount
  });

  W.addEventListener('online', () => sync().catch(() => {}));
  openDB().catch(() => {});
})(window);
