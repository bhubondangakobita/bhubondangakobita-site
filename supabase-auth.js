/* ভুবনডাঙ্গার কবিতা — Supabase Auth bridge v6.7.1 */
(function (window) {
  'use strict';
  if (window.BhubondangaAuth) return;
  const config = window.BHUBONDANGA_SUPABASE_CONFIG;
  if (!config || !window.supabase?.createClient) {
    console.error('Bhubondanga Auth: Supabase library/config পাওয়া যায়নি।');
    return;
  }
  const client = window.supabase.createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    global: { headers: { 'x-application-name': 'bhubondangakobita-web' } }
  });
  const cleanUsername = value => String(value || '').trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_-]/g, '');
  async function getProfile(userId) {
    if (!userId) return null;
    const { data, error } = await client.from('profiles').select('id,username,display_name,bio,avatar_url,cover_url,location').eq('id', userId).maybeSingle();
    if (error && error.code !== 'PGRST116') console.warn('Profile read:', error.message);
    return data || null;
  }
  async function getRole(userId) {
    if (!userId) return 'user';
    const { data, error } = await client.from('user_roles').select('role,active').eq('user_id', userId).eq('active', true).maybeSingle();
    if (error && error.code !== 'PGRST116') console.warn('Role read:', error.message);
    return data?.role || 'user';
  }
  function bridgeUser(user, role, profile) {
    const meta = user?.user_metadata || {};
    const username = cleanUsername(profile?.username || meta.username || String(user?.email || '').split('@')[0] || user?.id);
    return {
      id: user?.id || '', uid: user?.id || '',
      name: profile?.display_name || meta.full_name || meta.name || username || 'ভুবনডাঙ্গার সদস্য',
      username, email: user?.email || '', role: role || 'user', status: 'active',
      avatar: profile?.avatar_url || meta.avatar_url || meta.picture || '',
      cover: profile?.cover_url || '', bio: profile?.bio || '', location: profile?.location || '',
      loggedIn: true, provider: user?.app_metadata?.provider || 'email',
      createdAt: user?.created_at || new Date().toISOString(), lastLoginAt: new Date().toISOString()
    };
  }
  function saveBridge(user) {
    try { localStorage.setItem('bhubondangaCurrentUser', JSON.stringify(user)); sessionStorage.removeItem('bhubondangaSessionUser'); } catch (_) {}
    return user;
  }
  async function syncUser(user) {
    if (!user) { localStorage.removeItem('bhubondangaCurrentUser'); sessionStorage.removeItem('bhubondangaSessionUser'); return null; }
    const [role, profile] = await Promise.all([getRole(user.id), getProfile(user.id)]);
    return saveBridge(bridgeUser(user, role, profile));
  }

  let sessionPromise = null;
  async function session() {
    if (sessionPromise) return sessionPromise;
    sessionPromise = (async () => {
      try {
        let result = await client.auth.getSession();
        let current = result.data?.session || null;
        if (!current) {
          await new Promise(resolve => setTimeout(resolve, 180));
          result = await client.auth.getSession();
          current = result.data?.session || null;
        }
        if (!current) {
          try {
            const refreshed = await client.auth.refreshSession();
            current = refreshed.data?.session || null;
          } catch (_) {}
        }
        if (current?.user) await syncUser(current.user);
        return current;
      } finally {
        setTimeout(() => { sessionPromise = null; }, 250);
      }
    })();
    return sessionPromise;
  }

  async function signIn(email, password) {
    const result = await client.auth.signInWithPassword({ email: String(email || '').trim(), password });
    if (result.error) throw result.error;
    return { ...result.data, legacyUser: await syncUser(result.data.user) };
  }
  async function signUp({ email, password, fullName, username }) {
    const result = await client.auth.signUp({
      email: String(email || '').trim(), password,
      options: { data: { full_name: fullName, name: fullName, username: cleanUsername(username) } }
    });
    if (result.error) throw result.error;
    return { ...result.data, legacyUser: result.data.session && result.data.user ? await syncUser(result.data.user) : null };
  }
  async function signOut() {
    const { error } = await client.auth.signOut({ scope: 'local' });
    localStorage.removeItem('bhubondangaCurrentUser'); sessionStorage.removeItem('bhubondangaSessionUser');
    if (error) throw error;
  }
  async function current() {
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) return null;
    return { user: data.user, legacyUser: await syncUser(data.user) };
  }
  async function resetPassword(email, redirectTo) {
    const { data, error } = await client.auth.resetPasswordForEmail(String(email || '').trim(), redirectTo ? { redirectTo } : undefined);
    if (error) throw error; return data;
  }
  async function requireRole(roles, redirectTo = 'login.html') {
    const allowed = (Array.isArray(roles) ? roles : [roles]).map(x => String(x).toLowerCase());
    const info = await current();
    if (!info || !allowed.includes(String(info.legacyUser?.role || 'user').toLowerCase())) {
      location.replace(redirectTo + (redirectTo.includes('?') ? '&' : '?') + 'next=' + encodeURIComponent(location.href));
      return null;
    }
    return info;
  }
  client.auth.onAuthStateChange((event, nextSession) => {
    if (event === 'SIGNED_OUT') syncUser(null).catch(() => {});
    else if (nextSession?.user) syncUser(nextSession.user).catch(() => {});
  });
  window.BhubondangaAuth = Object.freeze({ client, cleanUsername, getProfile, getRole, syncUser, session, signIn, signUp, signOut, current, resetPassword, requireRole });
})(window);


/* merged role-guard.js — 50-file launch build */
/* UI role guard. Final authorization is enforced by Supabase RLS/RPC. */
(function (window) {
  'use strict';
  async function requireRole(roles, redirectTo = 'login.html') {
    const allowed = (Array.isArray(roles) ? roles : [roles]).map(x => String(x || '').toLowerCase());
    try {
      const info = await window.BhubondangaAuth?.current?.();
      const role = String(info?.legacyUser?.role || 'user').toLowerCase();
      if (info?.user && allowed.includes(role)) return info;
    } catch (error) { console.warn('Role guard:', error?.message || error); }
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    location.replace(`${redirectTo}${redirectTo.includes('?') ? '&' : '?'}next=${next}`);
    return null;
  }
  window.BhubondangaRoleGuard = Object.freeze({ requireRole });
})(window);

