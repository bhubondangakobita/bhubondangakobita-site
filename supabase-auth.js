/* ভুবনডাঙ্গার কবিতা — Supabase Auth bridge (Phase 1) */
(function () {
  'use strict';

  const config = window.BHUBONDANGA_SUPABASE_CONFIG;
  if (!config || !window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Bhubondanga Auth: Supabase client/config পাওয়া যায়নি।');
    return;
  }

  const client = window.supabase.createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  function cleanUsername(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/^@/, '')
      .replace(/[^a-z0-9_-]/g, '');
  }

  async function getRole(userId) {
    if (!userId) return 'user';
    const { data, error } = await client
      .from('user_roles')
      .select('role, active')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Bhubondanga Auth: role পড়া যায়নি। সাধারণ user ধরা হয়েছে।', error.message);
      return 'user';
    }
    return data && data.active !== false && data.role ? data.role : 'user';
  }

  function makeLegacyUser(user, role) {
    const metadata = user?.user_metadata || {};
    const emailName = String(user?.email || '').split('@')[0];
    const username = cleanUsername(metadata.username || metadata.user_name || emailName || user?.id);
    return {
      id: user?.id || '',
      uid: user?.id || '',
      name: metadata.full_name || metadata.name || username || 'ভুবনডাঙ্গার সদস্য',
      username,
      email: user?.email || '',
      role: role || 'user',
      status: 'active',
      avatar: metadata.avatar_url || metadata.picture || '',
      loggedIn: true,
      provider: user?.app_metadata?.provider || 'email',
      createdAt: user?.created_at || new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
  }

  function saveLegacyUser(legacyUser) {
    try {
      localStorage.setItem('bhubondangaCurrentUser', JSON.stringify(legacyUser));
      sessionStorage.removeItem('bhubondangaSessionUser');
    } catch (error) {
      console.warn('Bhubondanga Auth: local session bridge save হয়নি।', error);
    }
    return legacyUser;
  }

  async function syncUser(user) {
    if (!user) {
      localStorage.removeItem('bhubondangaCurrentUser');
      sessionStorage.removeItem('bhubondangaSessionUser');
      return null;
    }
    const role = await getRole(user.id);
    return saveLegacyUser(makeLegacyUser(user, role));
  }

  async function signIn(email, password) {
    const result = await client.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    const legacyUser = await syncUser(result.data.user);
    return { ...result.data, legacyUser };
  }

  async function signUp({ email, password, fullName, username }) {
    const result = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          name: fullName,
          username: cleanUsername(username)
        }
      }
    });
    if (result.error) throw result.error;
    let legacyUser = null;
    if (result.data.session && result.data.user) legacyUser = await syncUser(result.data.user);
    return { ...result.data, legacyUser };
  }

  async function signOut() {
    const { error } = await client.auth.signOut();
    localStorage.removeItem('bhubondangaCurrentUser');
    sessionStorage.removeItem('bhubondangaSessionUser');
    if (error) throw error;
  }

  async function current() {
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;
    const legacyUser = await syncUser(data.user);
    return { user: data.user, legacyUser };
  }

  async function resetPassword(email, redirectTo) {
    const options = redirectTo ? { redirectTo } : undefined;
    const { data, error } = await client.auth.resetPasswordForEmail(email, options);
    if (error) throw error;
    return data;
  }

  async function requireRole(allowedRoles, redirectTo = 'login.html') {
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const info = await current();
    if (!info || !allowed.includes(info.legacyUser.role)) {
      location.replace(redirectTo);
      return null;
    }
    return info;
  }

  window.BhubondangaAuth = Object.freeze({
    client,
    getRole,
    syncUser,
    signIn,
    signUp,
    signOut,
    current,
    resetPassword,
    requireRole
  });
})();
