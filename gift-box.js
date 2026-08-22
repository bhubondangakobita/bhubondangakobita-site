/* Bhubondanga Anonymous Gift Box v1 */
(function (W, D) {
  'use strict';
  if (W.BDGiftBox) return;

  const ENDPOINT = W.BD_GIFT_API || '/api/gifts/create';
  const statusCache = new Map();
  const injected = new WeakSet();
  let observer;

  const client = () => W.BD_SUPABASE || W.supabaseClient || W.bhubondangaSupabase || W.__BD_SUPABASE_CLIENT__ || ((W.supabase?.auth && W.supabase?.from) ? W.supabase : null);
  const loc = () => W.BDLocalization?.culture?.() || {lang:'en',locale:'en-GB',currency:'GBP',giftHelp:"If a writer's work speaks to you, you can send them a gift.",giftTitle:'Send a gift',giftAnonymous:'Your identity is not shown to the writer.'};
  const esc = v => String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  async function me() {
    try { return (await client()?.auth?.getSession?.()).data?.session || null; } catch (_) { return null; }
  }

  function amountSet(currency) {
    const map = {
      BDT:[20000,50000,100000,200000], INR:[10000,25000,50000,100000], PKR:[50000,100000,200000,500000],
      AED:[500,1000,2500,5000], SAR:[500,1000,2500,5000], TRY:[5000,10000,20000,50000],
      EUR:[200,500,1000,2000], GBP:[200,500,1000,2000], USD:[200,500,1000,2000]
    };
    return map[currency] || map.EUR;
  }

  function formatMinor(minor,currency) {
    try { return new Intl.NumberFormat(loc().locale,{style:'currency',currency}).format(minor/100); } catch (_) { return `${currency} ${(minor/100).toFixed(2)}`; }
  }

  async function visibleFor(receiverId) {
    receiverId = String(receiverId||'');
    if (!receiverId) return false;
    if (statusCache.has(receiverId)) return statusCache.get(receiverId);
    const promise = (async()=>{
      const s=await me(); if (String(s?.user?.id||'')===receiverId) return false;
      let c=client(); if(!c?.rpc){for(let i=0;i<20&&!c?.rpc;i++){await new Promise(r=>setTimeout(r,150));c=client();}if(!c?.rpc)return false;}
      try {
        const r=await c.rpc('gift_box_status',{p_receiver:receiverId});
        if (!r.error) return r.data === true || r.data?.enabled === true || r.data?.gift_box_status === true;
      } catch (_) {}
      return false;
    })();
    statusCache.set(receiverId,promise);
    const v=await promise; statusCache.set(receiverId,v); return v;
  }

  function targetId(el) {
    const article=el.closest?.('[data-author-id]');
    if (article?.dataset.authorId) return article.dataset.authorId;
    const tagged=el.closest?.('[data-user-id],[data-profile-id],[data-bd-profile-id]') || D.querySelector('[data-profile-user-id],[data-profile-id],[data-bd-profile-id]');
    if (tagged) return tagged.dataset.userId || tagged.dataset.profileId || tagged.dataset.profileUserId || tagged.dataset.bdProfileId || '';
    const u=new URL(location.href), q=u.searchParams.get('user')||u.searchParams.get('id')||u.searchParams.get('uid');
    return q||'';
  }

  function buttonHTML(receiverId) {
    const c=loc(), help=c.giftHelp || W.BDLocalization?.t?.('culture.giftHelp') || 'Send a gift';
    return `<button class="bd-gift-box-btn" type="button" data-bd-gift-box data-receiver-id="${esc(receiverId)}" title="${esc(help)}" aria-label="${esc(help)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16v10H4zM3 7h18v4H3zM12 7v13M7.5 7C5.6 7 5 5.9 5 4.8 5 3.6 6 3 7 3c2.2 0 4 2.4 5 4M16.5 7C18.4 7 19 5.9 19 4.8 19 3.6 18 3 17 3c-2.2 0-4 2.4-5 4"/></svg><span class="bd-gift-box-tip">${esc(help)}</span></button>`;
  }

  async function injectFeed(root=D) {
    const heads=[...root.querySelectorAll?.('.bd-post-head')||[]];
    for (const head of heads) {
      if (injected.has(head) || head.querySelector('[data-bd-gift-box]')) continue;
      injected.add(head);
      const id=targetId(head); if (!id || !await visibleFor(id)) continue;
      const more=head.querySelector('.bd-more');
      if (more) more.insertAdjacentHTML('beforebegin',buttonHTML(id)); else head.insertAdjacentHTML('beforeend',buttonHTML(id));
    }
  }

  async function resolveSpecialProfileId() {
    let id=targetId(D.body); if (id) return id;
    const path=location.pathname.toLowerCase();
    const c=client(); if (!c?.from) return '';
    if (path.includes('founder-profile')) {
      for (const table of ['user_roles','profiles']) {
        try {
          const q=table==='user_roles' ? await c.from(table).select('user_id').eq('role','founder').limit(1) : await c.from(table).select('id').eq('role','founder').limit(1);
          const row=q.data?.[0]; id=row?.user_id||row?.id||''; if(id)return id;
        } catch(_){}
      }
    }
    return '';
  }

  async function injectProfile() {
    const host=D.querySelector('.bd140-profile-actions,.profile-actions,.hero-actions,.profile-action-buttons');
    if (!host || host.querySelector('[data-bd-gift-box]')) return;
    const id=await resolveSpecialProfileId(); if (!id || !await visibleFor(id)) return;
    host.insertAdjacentHTML('beforeend',buttonHTML(id));
  }

  function closeModal(){D.querySelector('[data-bd-gift-modal]')?.remove();}
  async function openModal(receiverId) {
    const c=loc();let currency=c.currency||'EUR';try{const hc=JSON.parse(localStorage.getItem('bd-home-country-v1')||'{}'),m={BD:'BDT',IN:'INR',PK:'PKR',AE:'AED',SA:'SAR',TR:'TRY',GB:'GBP',US:'USD',NL:'EUR',DE:'EUR',FR:'EUR',ES:'EUR',IT:'EUR',BE:'EUR',AT:'EUR',IE:'EUR',PT:'EUR',GR:'EUR',FI:'EUR'};currency=m[String(hc.countryCode||'').toUpperCase()]||currency}catch(_){}const amounts=amountSet(currency);
    closeModal();
    D.body.insertAdjacentHTML('beforeend',`<div class="bd-gift-modal" data-bd-gift-modal role="dialog" aria-modal="true" aria-labelledby="bdGiftTitle"><section class="bd-gift-card"><button type="button" class="bd-gift-close" data-bd-gift-close aria-label="Close">×</button><div class="bd-gift-symbol">◇</div><h2 id="bdGiftTitle">${esc(c.giftTitle||'Send a gift')}</h2><p>${esc(c.giftHelp||'')}</p><small>${esc(c.giftAnonymous||'')}</small><div class="bd-gift-amounts">${amounts.map((a,i)=>`<button type="button" data-gift-amount="${a}" class="${i===1?'selected':''}">${esc(formatMinor(a,currency))}</button>`).join('')}</div><div class="bd-gift-status" data-bd-gift-status></div><button class="bd-gift-pay" type="button" data-bd-gift-pay>Continue securely</button><p class="bd-gift-legal">The receiver never receives your sender identity. Payment and platform providers may retain sender information for fraud prevention, refunds, tax, and legal compliance.</p></section></div>`);
    const root=D.querySelector('[data-bd-gift-modal]'), status=root.querySelector('[data-bd-gift-status]');
    let chosen=amounts[1]||amounts[0];
    root.querySelector('[data-bd-gift-close]').onclick=closeModal;
    root.addEventListener('click',e=>{if(e.target===root)closeModal()});
    root.querySelectorAll('[data-gift-amount]').forEach(b=>b.onclick=()=>{root.querySelectorAll('[data-gift-amount]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');chosen=Number(b.dataset.giftAmount)});
    root.querySelector('[data-bd-gift-pay]').onclick=async e=>{
      const btn=e.currentTarget; status.textContent=''; btn.disabled=true;
      try {
        const s=await me(); if(!s?.access_token)throw new Error('Please sign in to send a gift.');
        const res=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${s.access_token}`},body:JSON.stringify({receiver_id:receiverId,amount_minor:chosen,currency,return_url:location.href})});
        const out=await res.json().catch(()=>({}));
        if(!res.ok||!out.url)throw new Error(out.error||'Gift checkout is unavailable.');
        location.assign(out.url);
      }catch(err){status.textContent=String(err?.message||err);btn.disabled=false;}
    };
  }

  function clickHandler(e) {
    const b=e.target.closest?.('[data-bd-gift-box]');
    if(!b)return; e.preventDefault(); e.stopPropagation(); openModal(b.dataset.receiverId);
  }

  function scan(root=D){injectFeed(root);injectProfile();}
  function start(){
    D.addEventListener('click',clickHandler,true); scan();
    observer=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)scan(n)});
    observer.observe(D.body,{childList:true,subtree:true});
    W.addEventListener('bd:gift-settings-changed',()=>{statusCache.clear();D.querySelectorAll('[data-bd-gift-box]').forEach(x=>x.remove());scan()});
  }

  W.BDGiftBox=Object.freeze({scan,openModal,visibleFor,clearCache(){statusCache.clear();}});
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(window,document);
