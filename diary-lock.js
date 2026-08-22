/* Bhubondanga Personal Lifestyle Diary PIN Lock v1 */
(function (W, D) {
  'use strict';
  if (W.BDDiaryLock) return;
  const ITERATIONS = 310000;
  const CRED_KEY = 'bd-diary-credential-v1';
  const SESSION_KEY = 'bd-diary-session-key-v1';
  const SESSION_EXP = 'bd-diary-session-exp-v1';
  const FAIL_KEY = 'bd-diary-pin-fails-v1';
  const enc = new TextEncoder();

  const client = () => W.BD_SUPABASE || W.supabaseClient || W.bhubondangaSupabase || W.__BD_SUPABASE_CLIENT__ || ((W.supabase?.auth && W.supabase?.from) ? W.supabase : null);
  const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
  const unb64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
  const random = n => crypto.getRandomValues(new Uint8Array(n));
  const uuid = () => W.BDOffline?.uuid?.() || (crypto.randomUUID ? crypto.randomUUID() : `d-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  async function currentUser() {
    const c = client();
    try { return (await c?.auth?.getSession?.()).data?.session?.user || null; } catch (_) { return null; }
  }

  async function derive(pin, salt, iterations = ITERATIONS) {
    const material = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']);
    return crypto.subtle.deriveBits({ name:'PBKDF2', hash:'SHA-256', salt, iterations }, material, 256);
  }
  async function verifier(rawBits) {
    const bytes = new Uint8Array(rawBits.byteLength + 17);
    bytes.set(new Uint8Array(rawBits),0); bytes.set(enc.encode('BD-DIARY-VERIFY-v1'), rawBits.byteLength);
    return b64(await crypto.subtle.digest('SHA-256', bytes));
  }
  function saveSession(rawBits) {
    sessionStorage.setItem(SESSION_KEY, b64(rawBits));
    sessionStorage.setItem(SESSION_EXP, String(Date.now() + 15 * 60 * 1000));
  }
  function clearSession() { sessionStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_EXP); }
  function hasSession() { return !!sessionStorage.getItem(SESSION_KEY) && Number(sessionStorage.getItem(SESSION_EXP)||0) > Date.now(); }
  async function getSessionKey() {
    if (!hasSession()) { clearSession(); return null; }
    try { return crypto.subtle.importKey('raw', unb64(sessionStorage.getItem(SESSION_KEY)), {name:'AES-GCM'}, false, ['encrypt','decrypt']); } catch (_) { return null; }
  }

  function saveLocalCredential(row) { try { localStorage.setItem(CRED_KEY, JSON.stringify(row)); } catch (_) {} }
  function readLocalCredential() { try { return JSON.parse(localStorage.getItem(CRED_KEY)||'null'); } catch (_) { return null; } }

  async function getCredential() {
    const user = await currentUser();
    const c = client();
    if (user?.id && c?.from && navigator.onLine) {
      try {
        const r = await c.from('diary_credentials').select('user_id,salt,verifier,iterations,updated_at').eq('user_id', user.id).maybeSingle();
        if (!r.error && r.data?.salt && r.data?.verifier) { saveLocalCredential(r.data); return r.data; }
      } catch (_) {}
    }
    const local = readLocalCredential();
    if (local && (!user?.id || !local.user_id || String(local.user_id) === String(user.id))) return local;
    return null;
  }

  async function persistCredential(row) {
    saveLocalCredential(row);
    const c = client();
    if (navigator.onLine && c?.from) {
      const r = await c.from('diary_credentials').upsert(row, {onConflict:'user_id'});
      if (!r.error) return true;
    }
    if (W.BDOffline) await W.BDOffline.queueAction({ kind:'table.upsert', dedupe_key:`diary-credential:${row.user_id}`, payload:{table:'diary_credentials', row, options:{onConflict:'user_id'}} });
    return false;
  }

  function failState() { try { return JSON.parse(localStorage.getItem(FAIL_KEY)||'{"n":0,"until":0}'); } catch (_) { return {n:0,until:0}; } }
  function recordFailure() {
    const f = failState(); f.n = Number(f.n||0)+1;
    const delay = f.n < 5 ? 0 : Math.min(5*60*1000, 15000 * Math.pow(2, Math.min(4,f.n-5)));
    f.until = Date.now()+delay; localStorage.setItem(FAIL_KEY,JSON.stringify(f)); return f;
  }
  function clearFailures() { localStorage.removeItem(FAIL_KEY); }

  async function setup(pin) {
    if (!/^.{6,64}$/.test(pin)) throw new Error('PIN must be at least 6 characters.');
    const user = await currentUser();
    if (!user?.id) throw new Error('Please sign in before creating your private diary PIN.');
    const salt = random(16), bits = await derive(pin,salt,ITERATIONS), ver = await verifier(bits);
    const row = { user_id:user.id, salt:b64(salt), verifier:ver, iterations:ITERATIONS, updated_at:new Date().toISOString() };
    await persistCredential(row); saveSession(bits); clearFailures(); return true;
  }

  async function unlock(pin) {
    const f = failState();
    if (Number(f.until||0) > Date.now()) throw new Error(`Locked temporarily. Try again in ${Math.ceil((f.until-Date.now())/1000)} seconds.`);
    const cred = await getCredential();
    if (!cred) return { needsSetup:true };
    const bits = await derive(pin,unb64(cred.salt),Number(cred.iterations||ITERATIONS));
    const ver = await verifier(bits);
    if (ver !== cred.verifier) { recordFailure(); throw new Error('Incorrect PIN.'); }
    saveSession(bits); clearFailures(); return { ok:true };
  }

  async function encryptText(text) {
    const key = await getSessionKey(); if (!key) throw new Error('Diary is locked.');
    const iv = random(12), data = enc.encode(String(text));
    const cipher = await crypto.subtle.encrypt({name:'AES-GCM',iv},key,data);
    return { ciphertext:b64(cipher), iv:b64(iv), encryption_version:'aes-gcm-session-v1' };
  }
  async function decryptText(ciphertext, iv) {
    const key = await getSessionKey(); if (!key) throw new Error('Diary is locked.');
    const plain = await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(iv)},key,unb64(ciphertext));
    return new TextDecoder().decode(plain);
  }

  function modalMarkup(setupMode) {
    const title = setupMode ? 'Create your private diary PIN' : 'Unlock Personal Lifestyle Diary';
    const confirm = setupMode ? '<label>Confirm PIN<input type="password" inputmode="numeric" autocomplete="new-password" data-diary-confirm minlength="6" maxlength="64" required></label>' : '';
    return `<div class="bd-diary-lock" data-diary-lock role="dialog" aria-modal="true" aria-labelledby="bdDiaryLockTitle"><div class="bd-diary-lock-card"><button class="bd-diary-x" type="button" data-diary-close aria-label="Close">×</button><div class="bd-diary-lock-mark">◈</div><h2 id="bdDiaryLockTitle">${title}</h2><p>Use a private PIN with at least 6 characters. It is never displayed in your diary.</p><form data-diary-lock-form><label>Private PIN<input type="password" inputmode="numeric" autocomplete="${setupMode?'new-password':'current-password'}" data-diary-pin minlength="6" maxlength="64" required autofocus></label>${confirm}<div class="bd-diary-lock-status" data-diary-lock-status></div><button class="bd-diary-unlock" type="submit">${setupMode?'Create PIN & Open':'Unlock Diary'}</button></form></div></div>`;
  }

  async function openUnlockModal(opts = {}) {
    if (hasSession()) { opts.onSuccess?.(); return true; }
    D.querySelector('[data-diary-lock]')?.remove();
    const credential = await getCredential();
    const setupMode = !credential;
    D.body.insertAdjacentHTML('beforeend', modalMarkup(setupMode));
    const root=D.querySelector('[data-diary-lock]'), form=root.querySelector('[data-diary-lock-form]'), status=root.querySelector('[data-diary-lock-status]');
    const close=()=>root.remove(); root.querySelector('[data-diary-close]').onclick=close;
    root.addEventListener('click',e=>{if(e.target===root)close()});
    form.onsubmit=async e=>{
      e.preventDefault(); status.textContent='';
      const pin=root.querySelector('[data-diary-pin]').value;
      try {
        if (setupMode) {
          const confirm=root.querySelector('[data-diary-confirm]').value;
          if (pin!==confirm) throw new Error('PIN confirmation does not match.');
          await setup(pin);
        } else await unlock(pin);
        close(); opts.onSuccess?.();
      } catch (err) { status.textContent=String(err?.message||err); }
    };
    return false;
  }

  W.BDDiaryLock = Object.freeze({ ITERATIONS, uuid, setup, unlock, getCredential, hasSession, getSessionKey, encryptText, decryptText, openUnlockModal, clearSession });
})(window, document);
