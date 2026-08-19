/* Bhubondanga V71 — Supabase Auth bridge */
(function () {
  'use strict';
  if (window.BhubondangaAuth && window.BhubondangaAuth.version === 'V71') return;

  const cfg = window.BHUBONDANGA_SUPABASE_CONFIG;
  if (!cfg || !window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Bhubondanga Auth V71: Supabase client/config পাওয়া যায়নি।');
    return;
  }

  const existing = window.bdSupabase || window.supabaseClient || window.bhubondangaSupabase || null;
  const client = existing || window.supabase.createClient(cfg.url, cfg.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  window.bdSupabase = window.supabaseClient = window.bhubondangaSupabase = client;

  function cleanText(v) { return String(v ?? '').trim(); }
  function cleanUsername(v) {
    return cleanText(v).toLowerCase().replace(/^@/, '').replace(/[^a-z0-9._-]/g, '').slice(0, 30);
  }
  function localUrl(file, params = {}) {
    const u = new URL(file, location.href);
    Object.entries(params).forEach(([k,v]) => v != null && u.searchParams.set(k, String(v)));
    return u.href;
  }
  function safeNext(raw, fallback = 'index.html') {
    try {
      if (!raw) return fallback;
      const u = new URL(raw, location.href);
      if (u.origin !== location.origin) return fallback;
      const p = (u.pathname.split('/').pop() || '').toLowerCase();
      if (!p.endsWith('.html') && p !== '') return fallback;
      return u.pathname.split('/').pop() + u.search + u.hash;
    } catch (_) { return fallback; }
  }
  function friendlyError(err) {
    const raw = cleanText(err?.message || err);
    if (/invalid login credentials/i.test(raw)) return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।';
    if (/email not confirmed/i.test(raw)) return 'ইমেইল এখনও নিশ্চিত হয়নি। Inbox/Spam থেকে confirmation link খুলুন।';
    if (/user already registered|already been registered|already exists/i.test(raw)) return 'এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট আছে। লগইন করুন।';
    if (/password should be at least/i.test(raw)) return 'পাসওয়ার্ড আরও শক্তিশালী করুন।';
    if (/rate limit|too many/i.test(raw)) return 'অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';
    if (/network|fetch/i.test(raw)) return 'নেটওয়ার্ক সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।';
    return raw || 'কাজটি সম্পন্ন করা যায়নি।';
  }

  async function getRole(uid) {
    if (!uid) return 'user';
    try {
      const r = await client.from('user_roles').select('role,active').eq('user_id', uid).maybeSingle();
      if (!r.error && r.data && r.data.active !== false && r.data.role) return String(r.data.role).toLowerCase();
    } catch (_) {}
    try {
      const r = await client.from('profiles').select('role').eq('id', uid).maybeSingle();
      if (!r.error && r.data?.role) return String(r.data.role).toLowerCase();
    } catch (_) {}
    return 'user';
  }

  async function profile(uid) {
    if (!uid) return null;
    try {
      const r = await client.from('profiles').select('*').eq('id', uid).maybeSingle();
      if (!r.error && r.data) return r.data;
    } catch (_) {}
    return null;
  }

  async function ensureProfile(user) {
    if (!user?.id) return null;
    let p = await profile(user.id);
    if (p) return p;

    const m = user.user_metadata || {};
    const base = cleanUsername(m.username || m.user_name || user.email?.split('@')[0] || 'member') || 'member';
    const row = {
      id: user.id,
      username: (base + '-' + user.id.replace(/-/g,'').slice(0,8)).slice(0, 39),
      display_name: cleanText(m.full_name || m.name || m.display_name || user.email?.split('@')[0] || 'সদস্য'),
      bio: cleanText(m.bio || ''),
      avatar_url: m.avatar_url || m.picture || null,
      location: cleanText(m.location || ''),
      role: 'user',
      updated_at: new Date().toISOString()
    };
    try {
      const r = await client.from('profiles').upsert(row, { onConflict: 'id' }).select('*').maybeSingle();
      if (!r.error && r.data) return r.data;
    } catch (_) {}
    return row;
  }

  function legacyFrom(user, p, role) {
    const m = user?.user_metadata || {};
    const username = cleanUsername(p?.username || m.username || user?.email?.split('@')[0] || user?.id);
    return {
      loggedIn: true,
      id: user?.id || '',
      uid: user?.id || '',
      username,
      name: p?.display_name || m.full_name || m.name || username || 'ভুবনডাঙ্গার সদস্য',
      displayName: p?.display_name || m.full_name || m.name || username || 'ভুবনডাঙ্গার সদস্য',
      email: user?.email || '',
      role: role || p?.role || 'user',
      avatar: p?.avatar_url || m.avatar_url || m.picture || '',
      status: 'active',
      provider: user?.app_metadata?.provider || 'email',
      lastLoginAt: new Date().toISOString()
    };
  }

  async function syncUser(user) {
    if (!user) {
      try {
        localStorage.removeItem('bhubondangaCurrentUser');
        sessionStorage.removeItem('bhubondangaSessionUser');
      } catch (_) {}
      return null;
    }
    const p = await ensureProfile(user);
    const role = await getRole(user.id);
    const legacy = legacyFrom(user, p, role);
    try {
      localStorage.setItem('bhubondangaCurrentUser', JSON.stringify(legacy));
      localStorage.setItem('bd-role', role);
      sessionStorage.removeItem('bhubondangaSessionUser');
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('bd:auth-synced', { detail: { user, profile: p, role, legacyUser: legacy } }));
    return { user, profile: p, role, legacyUser: legacy };
  }

  async function currentSession() {
    const { data, error } = await client.auth.getSession();
    if (error) return null;
    return data.session || null;
  }

  async function current() {
    const s = await currentSession();
    return s?.user ? syncUser(s.user) : null;
  }

  async function signIn(email, password) {
    const { data, error } = await client.auth.signInWithPassword({
      email: cleanText(email).toLowerCase(),
      password: String(password || '')
    });
    if (error) throw error;
    const synced = await syncUser(data.user);
    return { ...data, ...synced };
  }

  async function signUp({ email, password, fullName, username, location: locationText = '', redirectTo }) {
    const normalizedUsername = cleanUsername(username);
    const options = {
      data: {
        full_name: cleanText(fullName),
        name: cleanText(fullName),
        username: normalizedUsername,
        location: cleanText(locationText)
      }
    };
    if (redirectTo) options.emailRedirectTo = redirectTo;

    const { data, error } = await client.auth.signUp({
      email: cleanText(email).toLowerCase(),
      password: String(password || ''),
      options
    });
    if (error) throw error;

    // Do NOT insert profiles from an anonymous signup.
    // The V71 database trigger creates public.profiles + user_roles.
    let synced = null;
    if (data.session?.user) synced = await syncUser(data.session.user);
    return { ...data, synced };
  }

  async function resendConfirmation(email, redirectTo) {
    const options = redirectTo ? { emailRedirectTo: redirectTo } : undefined;
    const { data, error } = await client.auth.resend({
      type: 'signup',
      email: cleanText(email).toLowerCase(),
      options
    });
    if (error) throw error;
    return data;
  }

  async function signOut(scope = 'local') {
    const { error } = await client.auth.signOut({ scope });
    try {
      localStorage.removeItem('bhubondangaCurrentUser');
      localStorage.removeItem('bd-role');
      sessionStorage.removeItem('bhubondangaSessionUser');
    } catch (_) {}
    if (error) throw error;
    window.dispatchEvent(new CustomEvent('bd:auth-signed-out'));
  }

  async function resetPassword(email, redirectTo) {
    const options = redirectTo ? { redirectTo } : undefined;
    const { data, error } = await client.auth.resetPasswordForEmail(cleanText(email).toLowerCase(), options);
    if (error) throw error;
    return data;
  }

  async function updatePassword(password) {
    const { data, error } = await client.auth.updateUser({ password: String(password || '') });
    if (error) throw error;
    return data;
  }

  async function exchangeCode(code) {
    if (!code) return null;
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return data.session || null;
  }

  async function routeForUser(user, requestedNext = '') {
    const role = await getRole(user?.id);
    if (requestedNext) return safeNext(requestedNext, 'index.html');
    if (role === 'founder') return 'founder-profile.html?user=' + encodeURIComponent(user.id);
    if (role === 'admin') return 'admin-profile.html?user=' + encodeURIComponent(user.id);
    return 'profile.html?user=' + encodeURIComponent(user.id);
  }

  client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      try {
        localStorage.removeItem('bhubondangaCurrentUser');
        localStorage.removeItem('bd-role');
      } catch (_) {}
      return;
    }
    if (session?.user && ['INITIAL_SESSION','SIGNED_IN','TOKEN_REFRESHED','USER_UPDATED','PASSWORD_RECOVERY'].includes(event)) {
      setTimeout(() => syncUser(session.user).catch(() => {}), 0);
    }
  });

  window.BhubondangaAuth = Object.freeze({
    version: 'V71',
    client,
    cleanUsername,
    safeNext,
    friendlyError,
    getRole,
    profile,
    ensureProfile,
    syncUser,
    currentSession,
    current,
    signIn,
    signUp,
    resendConfirmation,
    signOut,
    resetPassword,
    updatePassword,
    exchangeCode,
    routeForUser,
    localUrl
  });
})();
