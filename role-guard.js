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
