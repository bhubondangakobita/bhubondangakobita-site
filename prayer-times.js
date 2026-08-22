/* Bhubondanga Location-Aware Islamic Ticker v1 */
(function (W, D) {
  'use strict';
  if (W.BDPrayerTimes) return;

  const API = 'https://api.aladhan.com/v1/timings/';
  const CACHE_PREFIX = 'bd-prayer-times-v1:';
  const PREF_KEY = 'bd-prayer-times-enabled-v1';
  let lastData = null;
  let observer = null;
  let renderTimer = 0;

  const client = () => W.BD_SUPABASE || W.supabaseClient || W.bhubondangaSupabase || W.__BD_SUPABASE_CLIENT__ || ((W.supabase?.auth && W.supabase?.from) ? W.supabase : null);
  const todayKey = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  };
  const cleanTime = value => String(value || '').replace(/\s*\([^)]*\)\s*$/,'').trim();

  function isEnabled() {
    try { return localStorage.getItem(PREF_KEY) !== 'false'; } catch (_) { return true; }
  }

  async function religion() {
    try {
      const local = localStorage.getItem('bd-user-religion-v1');
      if (local) return local;
    } catch (_) {}
    const c = client();
    try {
      const user = (await c?.auth?.getSession?.()).data?.session?.user;
      const r = user?.user_metadata?.religion || user?.user_metadata?.bd_religion;
      if (r) { try { localStorage.setItem('bd-user-religion-v1', String(r)); } catch (_) {} return String(r); }
      if (user?.id && c?.from) {
        try{const pref=await c.from('profile_preferences').select('religion_preference,prayer_times_enabled').eq('user_id',user.id).maybeSingle();if(!pref.error&&pref.data?.religion_preference){if(pref.data.prayer_times_enabled===false)localStorage.setItem(PREF_KEY,'false');return String(pref.data.religion_preference)}}catch(_){}
        const q = await c.from('profiles').select('religion').eq('id', user.id).maybeSingle();
        if (!q.error && q.data?.religion) return String(q.data.religion);
      }
    } catch (_) {}
    return '';
  }

  function hijriText(hijri) {
    if (!hijri) return '';
    const day = hijri.day || '', month = hijri.month?.en || hijri.month?.ar || '', year = hijri.year || '';
    return [day, month, year].filter(Boolean).join(' ');
  }

  function segment(data) {
    const loc = W.BDLocalization;
    const lang = loc?.culture?.().lang || D.documentElement.lang || 'en';
    const labels = {
      bn:{h:'হিজরি',s:'সেহরি শেষ / ইমসাক',i:'ইফতার / মাগরিব'},
      en:{h:'Hijri',s:'Sehri ends / Imsak',i:'Iftar / Maghrib'},
      ar:{h:'هجري',s:'الإمساك',i:'الإفطار / المغرب'},
      hi:{h:'हिजरी',s:'सहरी समाप्त / इम्साक',i:'इफ्तार / मग़रिब'},
      ur:{h:'ہجری',s:'سحری ختم / امساک',i:'افطار / مغرب'},
      nl:{h:'Hijri',s:'Einde suhoor / Imsak',i:'Iftar / Maghrib'},
      de:{h:'Hijri',s:'Ende Suhur / Imsak',i:'Iftar / Maghrib'},
      fr:{h:'Hijri',s:'Fin du souhour / Imsak',i:'Iftar / Maghrib'},
      es:{h:'Hijri',s:'Fin de suhur / Imsak',i:'Iftar / Maghrib'},
      it:{h:'Hijri',s:'Fine suhur / Imsak',i:'Iftar / Maghrib'},
      tr:{h:'Hicri',s:'Sahur sonu / İmsak',i:'İftar / Akşam'}
    }[lang] || null;
    const L = labels || {h:'Hijri',s:'Sehri / Imsak',i:'Iftar / Maghrib'};
    const h = hijriText(data.hijri);
    return `<span class="bd-prayer-ticker" data-bd-prayer="1"><b>${L.h}</b> ${escapeHTML(h)} <i>✦</i> <b>${L.s}</b> ${escapeHTML(data.imsak)} <i>✦</i> <b>${L.i}</b> ${escapeHTML(data.maghrib)}</span><i data-bd-prayer-sep="1">✦</i>`;
  }

  function escapeHTML(v) {
    return String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function render(data = lastData) {
    if (!data) return false;
    lastData = data;
    const html = segment(data);
    let count = 0;
    D.querySelectorAll('.bd-date-group,[data-bd46-date],[data-date-ticker-group]').forEach(g => {
      if (g.querySelector('[data-bd-prayer]')) return;
      g.insertAdjacentHTML('afterbegin', html);
      count++;
    });
    return count > 0;
  }

  function watchTicker() {
    if (observer) return;
    observer = new MutationObserver(() => {
      if (!lastData) return;
      clearTimeout(renderTimer);
      renderTimer = setTimeout(() => render(lastData), 20);
    });
    observer.observe(D.documentElement, { childList:true, subtree:true });
  }

  function cacheKey(lat, lon) { return `${CACHE_PREFIX}${todayKey()}:${Number(lat).toFixed(2)}:${Number(lon).toFixed(2)}`; }
  function readCache(lat, lon) {
    try { return JSON.parse(localStorage.getItem(cacheKey(lat,lon)) || 'null'); } catch (_) { return null; }
  }
  function writeCache(lat, lon, value) {
    try { localStorage.setItem(cacheKey(lat,lon), JSON.stringify(value)); } catch (_) {}
  }

  async function fetchTimes(lat, lon, opts = {}) {
    const cached = readCache(lat,lon);
    if (cached && !opts.force) { lastData = cached; render(cached); return cached; }
    const date = todayKey();
    const params = new URLSearchParams({
      latitude:String(lat), longitude:String(lon), latitudeAdjustmentMethod:String(opts.latitudeAdjustmentMethod ?? 3), calendarMethod:'UAQ'
    });
    const method = Number(opts.method ?? localStorage.getItem('bd-prayer-method-v1'));
    if (Number.isFinite(method) && method > 0) params.set('method', String(method));
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    let json;
    try {
      const res = await fetch(`${API}${date}?${params}`, { method:'GET', mode:'cors', credentials:'omit', cache:'no-store', signal:ctrl.signal });
      if (!res.ok) throw new Error(`Prayer API ${res.status}`);
      json = await res.json();
    } finally { clearTimeout(timer); }
    const d = json?.data;
    if (!d?.timings) throw new Error('Prayer data unavailable');
    const out = {
      date, latitude:Number(lat), longitude:Number(lon),
      imsak:cleanTime(d.timings.Imsak), maghrib:cleanTime(d.timings.Maghrib),
      hijri:d.date?.hijri || null, timezone:d.meta?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      fetched_at:new Date().toISOString()
    };
    writeCache(lat,lon,out); lastData=out; render(out); return out;
  }

  function locate(options = {}) {
    return new Promise((resolve,reject) => {
      if (!navigator.geolocation) { reject(new Error('Geolocation unavailable')); return; }
      navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:10000,maximumAge:options.force?0:900000});
    });
  }

  async function requestAndRender(opts = {}) {
    if (!isEnabled() && !opts.force) return null;
    const r = String(opts.religion || await religion()).trim().toLowerCase();
    if (r !== 'muslim' && r !== 'islam' && r !== 'ইসলাম' && r !== 'মুসলিম') return null;
    const pos = await locate(opts);
    return fetchTimes(pos.coords.latitude, pos.coords.longitude, opts);
  }

  async function auto() {
    watchTicker();
    if (!isEnabled()) return;
    const r = String(await religion()).trim().toLowerCase();
    if (!['muslim','islam','ইসলাম','মুসলিম'].includes(r)) return;
    try { await requestAndRender({ religion:r }); } catch (_) { /* permission/API failure must never block app */ }
  }

  W.BDPrayerTimes = Object.freeze({ auto, requestAndRender, fetchTimes, render, religion, setEnabled(v){localStorage.setItem(PREF_KEY, v?'true':'false');}, get last(){return lastData;} });
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', () => setTimeout(auto, 0), { once:true }); else setTimeout(auto,0);
})(window, document);
