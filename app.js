/* Bhubondanga Premium Runtime v1 */
(function (W, D) {
  'use strict';
  if (W.__BD_PREMIUM_RUNTIME_V1__) return;
  W.__BD_PREMIUM_RUNTIME_V1__ = true;

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (!/^https?:$/.test(location.protocol)) return;
    navigator.serviceWorker.register('service-worker.js', {scope:'./'}).catch(() => {});
  }

  function offlineBadge() {
    let el=D.querySelector('[data-bd-connectivity]');
    if(!el){
      el=D.createElement('div');el.className='bd-connectivity';el.dataset.bdConnectivity='1';el.setAttribute('aria-live','polite');D.body.appendChild(el);
    }
    const online=navigator.onLine;
    el.textContent=online?'':'Offline · changes will sync automatically';
    el.classList.toggle('show',!online);
  }

  async function persistRegistrationPreferences() {
    if(!navigator.onLine)return;
    const c=W.BD_SUPABASE||W.supabaseClient||W.bhubondangaSupabase||W.__BD_SUPABASE_CLIENT__||((W.supabase?.auth&&W.supabase?.from)?W.supabase:null);if(!c?.auth?.getSession||!c?.from)return;
    try{const u=(await c.auth.getSession()).data?.session?.user;if(!u?.id)return;const religion=localStorage.getItem('bd-user-religion-v1')||u.user_metadata?.religion||'',gender=localStorage.getItem('bd-user-gender-v1')||u.user_metadata?.gender||'';if(!religion&&!gender)return;await c.from('profile_preferences').upsert({user_id:u.id,religion_preference:religion||null,gender_preference:gender||null,prayer_times_enabled:religion==='Muslim',updated_at:new Date().toISOString()},{onConflict:'user_id'});const profile={};if(religion)profile.religion=religion;if(gender)profile.gender=gender;if(localStorage.getItem('bd-user-religion-custom-v1'))profile.religion_custom=localStorage.getItem('bd-user-religion-custom-v1');if(localStorage.getItem('bd-user-gender-custom-v1'))profile.gender_custom=localStorage.getItem('bd-user-gender-custom-v1');if(Object.keys(profile).length)await c.from('profiles').update(profile).eq('id',u.id)}catch(_){}
  }

  async function syncSoon() {
    if (!navigator.onLine || !W.BDOffline) return;
    try {
      const result=await W.BDOffline.sync();
      if(result?.synced>0){
        const el=D.querySelector('[data-bd-connectivity]');
        if(el){el.textContent=`Synced ${result.synced} offline change${result.synced===1?'':'s'}`;el.classList.add('show');setTimeout(()=>{if(navigator.onLine)el.classList.remove('show')},2200)}
      }
    } catch (_) {}
  }

  function removeMidnightFromMainCompose(root=D) {
    root.querySelectorAll?.('[data-category-choice="midnight"]').forEach(el=>el.remove());
    root.querySelectorAll?.('select').forEach(sel=>{
      const isCompose=sel.closest('.bdc-root,.composer,[data-compose-root]'); if(!isCompose)return;
      [...sel.options].forEach(o=>{if(String(o.value).toLowerCase()==='midnight'||/মধ্যরাতের প্রলাপ/.test(o.textContent||''))o.remove()});
    });
  }

  function diaryButtonHTML(){
    const label=W.BDLocalization?.culture?.().diary||'Personal Lifestyle Diary';
    return `<button class="bd-diary-entry" type="button" data-bd-diary-entry><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h10a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 3v18M11 8h4M11 12h4"/></svg><span><b>${label}</b><small>Private · PIN protected</small></span><i>›</i></button>`;
  }

  function enhanceCompose(root=D) {
    removeMidnightFromMainCompose(root);
    root.querySelectorAll?.('.bdc-card').forEach(card=>{
      if(card.querySelector('[data-bd-diary-entry]'))return;
      const collapsed=card.querySelector('.bdc-collapsed');
      if(!collapsed)return;
      collapsed.insertAdjacentHTML('beforeend',diaryButtonHTML());
    });
  }

  async function openDiary() {
    const go=()=>location.assign('diary.html');
    if(W.BDDiaryLock?.openUnlockModal) await W.BDDiaryLock.openUnlockModal({onSuccess:go});
    else location.assign('diary.html');
  }

  function cacheEventPost(e){const p=e?.detail?.post||e?.detail?.data||e?.detail;if(p?.id)W.BDOffline?.cachePost?.(p).catch(()=>{});}

  function startObserver(){
    const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)enhanceCompose(n)});
    mo.observe(D.body,{childList:true,subtree:true});
  }

  function start(){
    registerSW(); offlineBadge(); enhanceCompose(); startObserver();
    W.BDOffline?.init?.().then(()=>{if(navigator.onLine)setTimeout(syncSoon,900)}).catch(()=>{});
    D.addEventListener('click',e=>{const b=e.target.closest?.('[data-bd-diary-entry]');if(!b)return;e.preventDefault();e.stopPropagation();openDiary();},true);
    W.addEventListener('online',()=>{offlineBadge();setTimeout(syncSoon,150)});
    W.addEventListener('offline',offlineBadge);
    ['bd:post-published','bd:post-created','bd:post-updated','bd:canonical-post-sync'].forEach(name=>W.addEventListener(name,cacheEventPost));
    W.addEventListener('bd:languagechange',()=>enhanceCompose());
    setTimeout(syncSoon,2500);setTimeout(persistRegistrationPreferences,3200);
  }

  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(window,document);
