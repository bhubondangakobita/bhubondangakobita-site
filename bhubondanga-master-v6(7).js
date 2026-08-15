/* ================================================================
   BHUBONDANGA — ONE CANONICAL MASTER FILE
   Direct-upload filename: bhubondanga-master-v6(7).js
   Build: 8.0.0
   Index ownership rule: feed.html owns composer/comments/reactions/reels.
   This master owns cross-page sidebars/auth/theme/notifications and support UI.
   ================================================================ */
(() => {
  'use strict';
  if (window.__BHUBONDANGA_CANONICAL_MASTER_FILE__ === '8.0.0') return;
  window.__BHUBONDANGA_CANONICAL_MASTER_FILE__ = '8.0.0';

/* BHUBONDANGA CANONICAL MASTER V8.0.0 — SINGLE OWNER / NATIVE INDEX DELEGATION / SIDEBARS / AUTH / NOTIFICATIONS */
(() => {
  'use strict';
  if (window.BhubondangaMaster?.canonical === true) return;
  const D=document, W=window;
  const $=(s,c=D)=>c.querySelector(s), $$=(s,c=D)=>Array.from(c.querySelectorAll(s));
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=v=>{v=String(v??'').trim();return /^(null|undefined|nan)$/i.test(v)?'':v};
  const isUuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||''));
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const INDEX_NATIVE_RUNTIME=page==='index.html';
  const REACTIONS={like:['👍','লাইক'],love:['❤️','ভালোবাসা'],care:['🥰','যত্ন'],sad:['😢','দুঃখ'],haha:['😂','হাহা'],wow:['😮','বিস্ময়'],angry:['😡','রাগ']};
  function reactionVisual(type,cls=''){const t=REACTIONS[type]?type:'like',src=W.BD52_REACTION_SRC?.[t]||'';return src?`<img class="bd-master-rx-img ${cls}" src="${src}" alt="" draggable="false" decoding="async">`:`<span class="bd-master-rx-fallback ${cls}">${REACTIONS[t][0]}</span>`;}
  const PRIVATE=new Set(['messages.html','notifications.html','settings.html','archive.html','memories.html','profile.html?tab=activity','edit-profile.html','founder-dashboard.html','admin-dashboard.html']);
  const SIDEBAR_PAGES=new Set(['about.html', 'profile.html?tab=activity', 'archive.html', 'bhubondangar-lekhok.html', 'complaint.html', 'complaint.html', 'contact.html', 'policy.html?section=copyright', 'policy.html?section=creative-work', 'discussion-post.html', 'discussion.html', 'edit-profile.html', 'environment.html', 'famous-poet-profile.html', 'famous-poet.html', 'famous-poet.html', 'famous-quotes.html', 'favorite-authors.html', 'founder-profile.html', 'humanitarian-notice.html', 'humanitarian-request.html', 'letter.html', 'madhyorater-prolap.html', 'memories.html', 'messages.html', 'profile.html?user=me', 'notifications.html', 'poem.html', 'poet-details.html', 'poem.html', 'poet-profile.html', 'policy.html', 'post-details.html', 'privacy-security-policy.html', 'profile.html', 'admin-profile.html', 'recitation.html', 'recitation.html', 'complaint.html', 'admin-dashboard.html?tab=review', 'search.html', 'settings.html', 'small-prolap.html', 'famous-quotes.html', 'famous-quotes.html', 'letter.html', 'today-poem.html', 'today-prolap.html', 'famous-quotes.html']);
  const state={client:null,session:null,me:null,profile:null,channels:[],enhanceTimer:null,holdTimer:null,holdOpened:false,storyRows:[],storyOwner:null,promoPosts:[],stabilityReady:false};

  function client(){
    if(state.client)return state.client;
    state.client=W.BhubondangaAuth?.client||W.bdSupabase||W.supabaseClient||W.bhubondangaSupabase||null;
    if(!state.client&&W.supabase?.createClient){
      const c=W.BHUBONDANGA_SUPABASE_CONFIG||{url:'https://ihjiisysrwgxxkuywuhc.supabase.co',publishableKey:'sb_publishable_2ofR9FO078M1Eu-m0Q8FLg_WqN6iIxz'};
      try{state.client=W.supabase.createClient(c.url,c.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},global:{headers:{'x-application-name':'bhubondanga-master-canonical-v8'}}});}catch(e){console.warn(e)}
    }
    if(state.client){W.bdSupabase=W.supabaseClient=W.bhubondangaSupabase=state.client;}
    return state.client;
  }
  function toast(message){
    let t=$('#bdMasterToast');if(!t){t=D.createElement('div');t.id='bdMasterToast';t.className='bd-master-toast';D.body.appendChild(t)}
    t.textContent=clean(message)||'কাজটি সম্পন্ন হয়নি';t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),3000);
  }

  function injectMasterStyles(){
    if($('#bdMasterV67Styles'))return;
    const style=D.createElement('style');style.id='bdMasterV67Styles';style.textContent=`
      .bd-fb-counts{min-height:38px;padding:8px 4px;border-bottom:1px solid var(--line,rgba(100,110,150,.18));display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--soft,#65748a);font:500 12px var(--font-ui,system-ui)}
      .bd-fb-summary,.bd-fb-comment-count{border:0;background:transparent;color:inherit;padding:2px 0;display:flex;align-items:center;gap:7px;font:inherit}
      .bd-fb-summary .emoji{width:22px;height:22px;margin-right:-5px;display:inline-grid;place-items:center;line-height:1}.bd-master-rx-img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}.bd-fb-summary .bd-master-rx-img{width:22px;height:22px}
      .bd-fb-summary-label{margin-left:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:min(42vw,320px)}
      .bd-facebook-action-row{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:2px!important;padding:4px 0!important;border-bottom:0!important}
      .bd-facebook-action-row.bd-three-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      .bd-fb-react-wrap{position:relative;min-width:0}
      .bd-fb-react-button,.bd-facebook-action-row>button,.bd-facebook-action-row>.bd-fb-react-wrap>button{width:100%;min-height:46px;border:0;border-radius:8px;display:flex;align-items:center;justify-content:center;gap:8px;background:transparent;color:var(--soft,#5f6f85);font:650 14px var(--font-ui,system-ui)}
      .bd-fb-react-button:hover,.bd-fb-react-button.active,.bd-facebook-action-row>button:hover{background:var(--surface3,#f3f5f8)}
      .bd-fb-react-button.active{color:#1877f2}.bd-fb-react-button.active .bd-react-symbol{transform:none}
      .bd-react-symbol{width:24px;height:24px;display:grid;place-items:center;font-size:0;line-height:1}.bd-action-icon{width:22px;height:22px;display:grid;place-items:center}.bd-action-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.bd-react-label{white-space:nowrap}
      .bd-fb-react-picker{position:absolute;left:0;bottom:50px;z-index:250;display:none;align-items:center;gap:3px;padding:7px 8px;border:1px solid var(--line,rgba(90,100,140,.2));border-radius:999px;background:var(--surface2,#fff);box-shadow:0 12px 36px rgba(25,35,70,.28)}
      .bd-fb-react-picker.open{display:flex;animation:bdReactionIn .16s ease-out}
      .bd-fb-react-picker button{width:43px;height:43px;padding:4px;border:0;border-radius:50%;display:grid;place-items:center;background:transparent;font-size:0;transition:background .14s ease}.bd-fb-react-picker button .bd-master-rx-img{width:35px;height:35px}
      .bd-fb-react-picker button:hover,.bd-fb-react-picker button:active{transform:none;background:var(--surface3,#f4f5f8)}
      @keyframes bdReactionIn{from{opacity:0;transform:translateY(8px) scale(.94)}to{opacity:1;transform:none}}
      .bd-fb-comments{display:none;padding:8px 14px 14px;border-top:1px solid var(--line,rgba(90,100,140,.18));background:transparent}
      .bd-fb-comments.open{display:block}.bd-fb-comment-list{display:grid;gap:9px}
      .bd-fb-comment{display:grid;grid-template-columns:38px minmax(0,1fr) 30px;gap:8px;align-items:start}
      .bd-fb-comment-avatar{width:38px;height:38px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:linear-gradient(135deg,#756ee6,#aa6ed8);color:#fff;font-weight:700}
      .bd-fb-comment-avatar img{width:100%;height:100%;object-fit:cover}
      .bd-fb-comment-bubble{padding:2px 2px 8px;border-radius:0;background:transparent;color:var(--text,#172d49);font-size:13px;line-height:1.6;overflow-wrap:anywhere;border-bottom:1px solid var(--line,rgba(90,100,140,.13))}
      .bd-fb-comment-bubble strong{display:block;margin-bottom:1px;font:700 12px var(--font-ui,system-ui)}.bd-fb-comment-bubble time{display:block;margin-top:3px;color:var(--muted,#8a96aa);font-size:10px}
      .bd-fb-comment-hide{width:30px;height:30px;border:0;border-radius:50%;background:transparent;color:var(--muted,#8a96aa)}
      .bd-fb-comment-compose{margin-top:10px;display:grid;grid-template-columns:38px minmax(0,1fr) 42px;gap:7px;align-items:end}
      .bd-fb-comment-compose textarea{min-width:0;min-height:42px;max-height:140px;padding:10px 12px;border:1px solid var(--line,rgba(90,100,140,.18));border-radius:12px;resize:none;outline:0;background:var(--surface3,#f0f2f5);font-size:16px;line-height:1.35}
      .bd-fb-comment-compose button{width:42px;height:42px;border:0;border-radius:12px;background:#1877f2;color:#fff;font-size:18px}
      .bd-fb-pending{padding:10px;color:var(--muted,#8a96aa);text-align:center;font-size:12px}
      .bd-facebook-action-row,.bd-fb-counts,.bd-fb-comments{overflow-anchor:none;contain:layout style}
      .bd-fb-react-picker{contain:layout paint;will-change:opacity;transform:translateZ(0)}
      .bd-cross-media{position:relative;overflow:hidden;border-radius:14px;background:#05070b}.bd-cross-media video{display:block;width:100%;max-height:min(58vh,520px);object-fit:contain;background:#05070b;transition:max-height .18s ease,height .18s ease}.bd-inline-reel .bd-cross-media{width:min(100%,430px);margin-inline:auto;background:#000}.bd-inline-reel .bd-cross-media video{width:100%;height:min(78dvh,760px);max-height:min(78dvh,760px);aspect-ratio:9/16;object-fit:contain;background:#000}.bd-inline-reel{overflow-anchor:none}.bd-love-burst{position:absolute;left:50%;top:50%;z-index:60;transform:translate(-50%,-50%);pointer-events:none;font-size:72px;line-height:1;animation:bdLoveBurst .55s ease both}.bd-love-burst img{width:78px;height:78px;object-fit:contain}@keyframes bdLoveBurst{0%{opacity:0;transform:translate(-50%,-50%) scale(.45)}35%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}100%{opacity:0;transform:translate(-50%,-58%) scale(.96)}}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) .bd-fb-comment-bubble{color:#f5f7ff}:is(html[data-theme="dark"],html[data-bd-theme="dark"]) .bd-fb-comment-compose textarea{color:#f5f7ff;background:rgba(255,255,255,.06)}
      .bd-master-edge{position:fixed;top:56%;z-index:1800;width:18px!important;height:58px!important;padding:0!important;border:1px solid rgba(118,108,228,.3)!important;display:none;place-items:center;background:linear-gradient(180deg,#f5f0ff,#8b6df0)!important;color:#fff!important;box-shadow:0 8px 22px rgba(70,55,160,.24);font-size:14px!important;line-height:1!important}
      .bd-master-edge.left{left:0;border-radius:0 10px 10px 0!important}.bd-master-edge.right{right:0;border-radius:10px 0 0 10px!important}
      .bd-master-drawer-shade{position:fixed;inset:0;z-index:1790;display:none;background:rgba(6,12,25,.35)}.bd-master-drawer-shade.open-left,.bd-master-drawer-shade.open-right{display:block}
      .bd-master-mobile-drawer{position:absolute;top:0;bottom:0;width:min(360px,72vw);padding:48px 10px 20px;overflow:auto;background:var(--surface2,#fff);transition:transform .22s ease}.bd-master-mobile-drawer.left{left:0;transform:translateX(-102%)}.bd-master-mobile-drawer.right{right:0;transform:translateX(102%)}
      .bd-master-drawer-shade.open-left .bd-master-mobile-drawer.left,.bd-master-drawer-shade.open-right .bd-master-mobile-drawer.right{transform:none}.bd-master-drawer-close{position:absolute;top:8px;right:8px;width:36px;height:36px;border:0;border-radius:50%;background:var(--surface3,#eef1f6);font-size:22px}
      .profile-center .post-card{overflow:hidden!important}.profile-center .post-media{background:#eef1f6!important}.profile-center .post-media img,.profile-center .post-media video{width:100%!important;max-height:min(54vh,460px)!important;object-fit:contain!important;background:#0a0a0a}
      .profile-center .bd-profile-avatar-update .post-media{max-height:420px!important;overflow:hidden!important}.profile-center .bd-profile-avatar-update .post-media img{width:100%!important;height:420px!important;max-height:420px!important;object-fit:cover!important;object-position:center!important}.profile-center .bd-profile-cover-update .post-media{max-height:300px!important;overflow:hidden!important}.profile-center .bd-profile-cover-update .post-media img{width:100%!important;height:auto!important;aspect-ratio:16/7;max-height:300px!important;object-fit:cover!important}
      .profile-compose-form:not([hidden]){position:fixed!important;left:50%!important;top:50%!important;z-index:2850!important;width:min(620px,calc(100vw - 24px))!important;max-height:calc(100dvh - 32px)!important;margin:0!important;padding:16px!important;overflow:auto!important;border:1px solid var(--line,rgba(90,100,140,.18))!important;border-radius:18px!important;background:var(--surface2,#fff)!important;box-shadow:0 0 0 100vmax rgba(6,12,25,.58),0 24px 70px rgba(0,0,0,.28)!important;transform:translate(-50%,-50%)!important}
      .profile-compose-grid{display:grid!important;grid-template-columns:1fr!important;gap:10px!important}.profile-compose-grid input,.profile-compose-grid select,.profile-compose-grid textarea{width:100%!important;min-width:0!important}.profile-compose-grid textarea{min-height:180px!important}
      body.bd-compose-open{overflow:hidden!important}
      @media(max-width:760px){.bd-master-edge{display:grid}.bd-fb-react-picker{position:fixed;left:50%;bottom:calc(76px + env(safe-area-inset-bottom));transform:translateX(-50%);max-width:calc(100vw - 18px)}.bd-fb-react-picker.open{display:flex;animation:bdReactionMobileIn .14s ease-out}.bd-fb-react-picker button{width:39px;height:39px;font-size:25px}.bd-fb-react-button,.bd-facebook-action-row>button,.bd-facebook-action-row>.bd-fb-react-wrap>button{min-height:44px;font-size:13px}.bd-react-symbol,.bd-action-icon{font-size:21px}.bd-fb-comment-compose textarea{font-size:16px}.profile-center .post-card{border-radius:15px!important}.profile-center .post-inner{padding:12px!important}.profile-center .post-title{font-size:23px!important;line-height:1.35!important}.profile-center .post-body{font-size:14px!important;line-height:1.8!important}.profile-center .post-media{margin:10px -12px 0!important}.profile-center .post-media img,.profile-center .post-media video{max-height:min(48vh,400px)!important}.profile-center .bd-profile-avatar-update .post-media{max-height:340px!important}.profile-center .bd-profile-avatar-update .post-media img{height:340px!important;max-height:340px!important;aspect-ratio:1/1!important}.profile-center .bd-profile-cover-update .post-media,.profile-center .bd-profile-cover-update .post-media img{max-height:240px!important}.bd-master-mobile-drawer{width:min(330px,78vw)}}

      @keyframes bdReactionMobileIn{from{opacity:0}to{opacity:1}}
      /* V6.9.0: reserve social-count height so first reaction/comment never pushes the feed. */
      .bd-fb-counts.bd-social-empty{visibility:hidden!important;pointer-events:none!important}
      /* V6.9.0: global width guards; no horizontal overshoot or viewport shake. */
      html,body{max-width:100%!important;overflow-x:clip!important}
      :where(main,.center,.profile-center,.layout,.shell,.feed,.feed-column,.post-card,.post,.glass,.card,.timeline-card,.profile-card){min-width:0}
      img,video,canvas,svg{max-width:100%}
      /* V6.9.0 dark lock: dark means a dark surface, never pale glass with white text. */
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]){color-scheme:dark;--page:#07111f;--page-bg:#07111f;--bg:#07111f;--surface:#0d1b2d;--surface2:#102238;--surface3:#14283f;--surface-strong:#102238;--surface-solid:#0d1b2d;--text:#f4f7ff;--ink:#f4f7ff;--text-soft:#c6d1e4;--soft:#c6d1e4;--muted:#9aabc3;--line:rgba(174,194,226,.17);--border:rgba(174,194,226,.17)}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) body{background:#07111f!important;color:#f4f7ff!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :where(.glass,.card,.post-card,.post,.timeline-card,.toc,.hero,.editor,.sources,.profile-card,.profile-section,.bio-card,.menu-card,.side-card,.content-card,.info-card,.panel,.section-card,.bd9-card,.bd-master-mobile-drawer){background:linear-gradient(145deg,rgba(15,30,50,.97),rgba(9,21,37,.96))!important;color:#f4f7ff!important;border-color:rgba(174,194,226,.17)!important;box-shadow:0 16px 42px rgba(0,0,0,.25)!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :where(h1,h2,h3,h4,h5,h6,.post-title,.event h3,.lead,.event p,.notice,.timeline-card p,.timeline-card h3,.bio-card p,.profile-section p,.side-link,.nav-link,.bd9-card,.bd9-card p,.bd9-menu a,.bd-fb-comment-bubble){color:#f4f7ff!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :where(p,small,time,.muted,.soft,.sub,.meta,.post-meta,.event p,.sources p,.toc a){color:#b9c6da!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :where(input,textarea,select,.field,.edit-entry,.btn:not(.primary),.top-actions a,.top-actions button){background:#12243a!important;color:#f4f7ff!important;border-color:rgba(174,194,226,.19)!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :where(.top,.site-header,.date-bar,.topnav,.profile-appbar,.header,.nav,.ticker,.drawer-head){background:rgba(7,17,31,.94)!important;color:#f4f7ff!important;border-color:rgba(174,194,226,.15)!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) .timeline-card::before{border-color:#0b1a2b!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) .year{background:rgba(63,176,141,.15)!important;color:#8fe2c5!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) .source{color:#aab8ff!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) .glass::after{opacity:.035!important}

      /* V6.9 ROOT-CAUSE STABILITY LOCK -------------------------------------------------
         One canonical native reaction surface. No manual reaction scrolling. No cropped
         reaction artwork. Dark ordinary posts use one quiet blue-glass family. */
      html{scroll-behavior:auto!important}
      :is(article[data-post],article[data-post-id],article.post,.post-card[data-post],.post-card[data-post-id],.bd-live-post,[data-post-card],[data-bd-post-id]){
        scroll-margin:0!important;will-change:auto!important;backface-visibility:visible!important
      }
      :is(article[data-post],article[data-post-id],article.post,.post-card[data-post],.post-card[data-post-id],.bd-live-post,[data-post-card],[data-bd-post-id]):not(.bd104-news-post){transform:none!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :is(article[data-post],article[data-post-id],article.post,.post-card[data-post],.post-card[data-post-id],.bd-live-post,[data-post-card],[data-bd-post-id]):not(.bd104-news-post){
        background:radial-gradient(circle at 88% 8%,rgba(105,112,226,.13),transparent 38%),linear-gradient(145deg,rgba(12,30,52,.985) 0%,rgba(17,39,67,.982) 55%,rgba(29,35,73,.974) 100%)!important;
        background-color:#0d2037!important;color:#f5f8ff!important;border-color:rgba(163,187,225,.19)!important;
        box-shadow:0 12px 32px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.035)!important
      }
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :is(article[data-post],article[data-post-id],article.post,.post-card[data-post],.post-card[data-post-id],.bd-live-post,[data-post-card],[data-bd-post-id]):not(.bd104-news-post) :is(.post-inner,.post-content,.post-body,.body,.post-text,.post-caption,.post-meta,.post-head,.post-card-head){
        background-color:transparent!important;color:inherit
      }
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :is(article[data-post],article[data-post-id],article.post,.post-card[data-post],.post-card[data-post-id],.bd-live-post,[data-post-card],[data-bd-post-id]):not(.bd104-news-post) :is(.composer-media-render,.bd-post-writing-card):not(:has(img)):not(:has(video)){
        background:linear-gradient(145deg,rgba(10,27,48,.96),rgba(23,40,70,.95))!important;background-color:#102a48!important;
        border-color:rgba(163,187,225,.16)!important;color:#f5f8ff!important
      }
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :is(article[data-post],article[data-post-id],article.post,.post-card[data-post],.post-card[data-post-id],.bd-live-post,[data-post-card],[data-bd-post-id]):not(.bd104-news-post) :is(h1,h2,h3,h4,.post-title,.post-body,.post-text,.body,.author-name,strong){color:#f5f8ff!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) :is(article[data-post],article[data-post-id],article.post,.post-card[data-post],.post-card[data-post-id],.bd-live-post,[data-post-card],[data-bd-post-id]):not(.bd104-news-post) :is(p,small,time,.muted,.meta,.post-meta){color:#b7c6db!important}

      /* Keep the social row dimension stable; the summary slot exists before first react. */
      .bd31-social,.bd31-summary,.bd31-actions,[data-bd31-react-main],[data-bd31-react-summary],#bd64ReactionTray{overflow-anchor:none!important}
      .bd31-social,.bd31-actions{contain:layout style!important}
      .bd31-summary{min-height:29px!important;box-sizing:border-box!important}
      .bd31-action,[data-bd31-react-main]{transform:none!important;animation:none!important;transition-property:color,background-color,border-color!important}
      .bd31-action:active,[data-bd31-react-main]:active{transform:none!important}

      /* Approved reaction PNGs are displayed as the original art — never a circular crop/sprite. */
      .bd31-main-reaction{width:32px!important;height:30px!important;min-width:32px!important;max-width:32px!important;flex:0 0 32px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:visible!important;contain:none!important;border:0!important;border-radius:0!important}
      .bd31-main-reaction :is(.bd64-icon,.bd105-rx-art,.bd31-r){width:auto!important;height:30px!important;min-width:0!important;max-width:none!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:visible!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
      .bd31-main-reaction :is(img,.bd52-reaction-img),.bd31-main-reaction>.bd52-reaction-img,.bd31-main-reaction>img{display:block!important;width:auto!important;height:28px!important;min-width:0!important;max-width:none!important;max-height:28px!important;object-fit:contain!important;object-position:center!important;border:0!important;border-radius:0!important;clip-path:none!important;overflow:visible!important;transform:none!important;filter:drop-shadow(0 2px 3px rgba(0,0,0,.13))!important}
      .bd31-stack{display:inline-flex!important;align-items:center!important;gap:2px!important;overflow:visible!important}
      .bd31-stack>:is(.bd31-mini,.bd105-rx-art,.bd31-r,.bd52-reaction-img,img){width:auto!important;height:20px!important;min-width:0!important;max-width:none!important;flex:0 0 auto!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;clip-path:none!important;overflow:visible!important;background:transparent!important;transform:none!important;box-shadow:none!important}
      .bd31-stack :is(img,.bd52-reaction-img){display:block!important;width:auto!important;height:20px!important;min-width:0!important;max-width:none!important;max-height:20px!important;object-fit:contain!important;border:0!important;border-radius:0!important;clip-path:none!important;transform:none!important;filter:none!important}

      /* Modern glass tray; fixed position only, no GPU translate/scale that can flicker on iOS. */
      #bd64ReactionTray,#bd64ReactionTray.bd64-exact-reference{width:auto!important;height:auto!important;max-width:calc(100vw - 14px)!important;display:none!important;align-items:center!important;justify-content:center!important;gap:4px!important;padding:7px 9px!important;border:1px solid rgba(125,143,188,.22)!important;border-radius:999px!important;background:rgba(244,248,255,.86)!important;background-image:linear-gradient(145deg,rgba(255,255,255,.84),rgba(235,241,255,.78))!important;box-shadow:0 14px 34px rgba(14,23,53,.22),inset 0 1px 0 rgba(255,255,255,.72)!important;backdrop-filter:blur(18px) saturate(145%)!important;-webkit-backdrop-filter:blur(18px) saturate(145%)!important;overflow:visible!important;contain:layout style!important;transform:none!important;will-change:auto!important;animation:none!important}
      #bd64ReactionTray.open,#bd64ReactionTray.bd64-exact-reference.open{display:flex!important;animation:none!important;transform:none!important}
      :is(html[data-theme="dark"],html[data-bd-theme="dark"]) #bd64ReactionTray{background:rgba(13,30,52,.90)!important;background-image:linear-gradient(145deg,rgba(21,43,72,.92),rgba(19,31,61,.90))!important;border-color:rgba(171,190,227,.20)!important;box-shadow:0 16px 36px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.055)!important}
      #bd64ReactionTray button,#bd64ReactionTray.bd64-exact-reference button{width:43px!important;height:43px!important;min-width:43px!important;min-height:43px!important;flex:0 0 43px!important;padding:2px!important;margin:0!important;border:0!important;border-radius:50%!important;background:transparent!important;overflow:visible!important;transform:none!important;animation:none!important;transition:background-color .12s ease!important}
      #bd64ReactionTray button:hover,#bd64ReactionTray button:focus-visible,#bd64ReactionTray button:active{transform:none!important;background:rgba(114,137,206,.10)!important}
      #bd64ReactionTray button .bd64-icon,#bd64ReactionTray.bd64-exact-reference button .bd64-icon{display:flex!important;align-items:center!important;justify-content:center!important;width:auto!important;height:39px!important;min-width:0!important;max-width:none!important;overflow:visible!important;transform:none!important}
      #bd64ReactionTray .bd64-icon img,#bd64ReactionTray .bd52-reaction-img{display:block!important;width:auto!important;height:38px!important;min-width:0!important;max-width:none!important;max-height:38px!important;object-fit:contain!important;border:0!important;border-radius:0!important;clip-path:none!important;overflow:visible!important;transform:none!important;filter:drop-shadow(0 2px 3px rgba(0,0,0,.12))!important}
      @media(max-width:390px){#bd64ReactionTray,#bd64ReactionTray.bd64-exact-reference{gap:2px!important;padding:6px 7px!important}#bd64ReactionTray button,#bd64ReactionTray.bd64-exact-reference button{width:40px!important;height:40px!important;min-width:40px!important;min-height:40px!important;flex-basis:40px!important}#bd64ReactionTray button .bd64-icon,#bd64ReactionTray .bd64-icon img,#bd64ReactionTray .bd52-reaction-img{height:36px!important;max-height:36px!important}}

      /* Native profile/category edge handles win. Master edge is only a fallback. */
      body.bd-native-left-edge #bdMasterLeftEdge,body.bd-native-right-edge #bdMasterRightEdge{display:none!important}
      body.bd-drawer-open{overflow:hidden!important;touch-action:none}
    `;D.head.appendChild(style);
  }


  function applyThemeLock(){
    let mode='';
    try{mode=localStorage.getItem('bd-theme')||localStorage.getItem('bhubondangaTheme')||D.documentElement.dataset.theme||''}catch{mode=D.documentElement.dataset.theme||''}
    if(!['light','middle','dark'].includes(mode))mode=D.documentElement.dataset.theme||'light';
    if(mode==='dark')D.documentElement.dataset.theme='dark';
    else if(mode==='middle')D.documentElement.dataset.theme='middle';
    else if(!D.documentElement.dataset.theme)D.documentElement.dataset.theme='light';
    try{localStorage.setItem('bd-theme',D.documentElement.dataset.theme);localStorage.setItem('bhubondangaTheme',D.documentElement.dataset.theme)}catch{}
    const meta=$('meta[name="theme-color"]');if(meta)meta.content=D.documentElement.dataset.theme==='dark'?'#07111f':'#f5f7fb';
  }
  function nativeEdge(side){
    const sels=side==='left'?['#leftEdge','.edge.left','[data-left]','.left-edge','.drawer-edge.left','[data-drawer="left"]']:['#rightEdge','.edge.right','[data-right]','.right-edge','.drawer-edge.right','[data-drawer="right"]'];
    return sels.some(sel=>{const el=$(sel);return !!el&&el.id!==(side==='left'?'bdMasterLeftEdge':'bdMasterRightEdge')});
  }
  function installStabilityLock(){
    if(state.stabilityReady)return;state.stabilityReady=true;
    const markEdges=()=>{const l=nativeEdge('left'),r=nativeEdge('right');D.body?.classList.toggle('bd-native-left-edge',l);D.body?.classList.toggle('bd-native-right-edge',r);if(l)$('#bdMasterLeftEdge')?.remove();if(r)$('#bdMasterRightEdge')?.remove()};
    markEdges();
    let raf=0;W.addEventListener('resize',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(markEdges)},{passive:true});
    D.addEventListener('focusin',e=>{if(e.target.matches?.('input,textarea,select,[contenteditable="true"]'))return;},{passive:true});
  }

  function localRead(k,f){try{const x=JSON.parse(localStorage.getItem(k));return x??f}catch{return f}}
  function localWrite(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}return v}
  function formatDate(v){try{return new Intl.DateTimeFormat('bn-BD',{timeZone:'Asia/Dhaka',day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(v))}catch{return''}}
  function profileHref(p){if(!p)return'profile.html?user=me';const role=String(p.role||'').toLowerCase(),u=String(p.username||'').toLowerCase(),n=p.display_name||'';if(role==='founder'||u==='mahmud-sohel'||n==='মাহমুদ সোহেল')return'founder-profile.html?user='+encodeURIComponent(p.id||u||'mahmud-sohel');if(role==='admin')return'admin-profile.html?user='+encodeURIComponent(p.id||u);return'profile.html?user='+encodeURIComponent(p.id||u||'me')}
  function avatar(p,cls=''){const name=clean(p?.display_name||p?.author_name||p?.username)||'ভ';return p?.avatar_url||p?.author_avatar?`<span class="${cls}"><img src="${esc(p.avatar_url||p.author_avatar)}" alt=""></span>`:`<span class="${cls}">${esc(name.slice(0,1))}</span>`}
  async function profile(id){
    const c=client();if(!id)return null;
    if(id==='me')return state.me;
    if(!c)return null;
    try{
      let q=c.from('profiles').select('*');q=isUuid(id)?q.eq('id',id):q.eq('username',String(id).replace(/^@/,'').toLowerCase());
      const r=await q.maybeSingle();if(!r.error&&r.data)return r.data;
      let pq=c.from('promo_profiles').select('*').eq('active',true);pq=String(id).startsWith('promo-')?pq.eq('id',id):pq.eq('username',String(id).replace(/^@/,'').toLowerCase());
      const pr=await pq.maybeSingle();return pr.error?null:pr.data;
    }catch{return null}
  }
  async function auth(){
    const c=client();if(!c)return null;
    try{
      state.session=await W.BhubondangaAuth?.session?.()||null;
      if(!state.session){const r=await c.auth.getSession();state.session=r.data?.session||null;}
      if(state.session){state.me=await profile(state.session.user.id)||{id:state.session.user.id,display_name:state.session.user.user_metadata?.full_name||state.session.user.email?.split('@')[0]||'সদস্য',username:state.session.user.user_metadata?.username||state.session.user.email?.split('@')[0]||'',avatar_url:state.session.user.user_metadata?.avatar_url||'',role:'user'};localWrite('bhubondangaCurrentUser',{...state.me,loggedIn:true,uid:state.me.id,name:state.me.display_name,avatar:state.me.avatar_url});}
      return state.session;
    }catch(e){console.warn('Auth session:',e);return null}
  }
  async function guard(){
    if(!PRIVATE.has(page))return true;
    if(state.session)return true;
    const next=location.pathname.split('/').pop()+location.search+location.hash;
    location.replace('login.html?next='+encodeURIComponent(next));return false;
  }
  function loginLink(next=location.href){return'login.html?next='+encodeURIComponent(next)}

  // Exact Index sidebar information, reused across logged-in application pages.
  function leftSidebarHTML(){
    const logged=!!state.session,me=state.me||{};
    const auth=logged?`<section class="bd9-card bd-r6-auth-card"><div class="bd-master-account">${avatar(me,'bd-master-account-avatar')}<h3>${esc(me.display_name||'ভুবনডাঙ্গার সদস্য')}</h3><p>@${esc(me.username||'member')}</p><div class="bd-master-actions"><a class="primary" href="${esc(profileHref(me))}">আমার প্রোফাইল</a><a href="edit-profile.html">সম্পাদনা</a></div></div></section>`:`<section class="bd9-card bd-r6-auth-card"><div class="bd-r6-auth-title"><span>🌿</span><b>আপন ভুবনে প্রবেশ</b></div><p class="bd-r6-auth-copy">লেখা প্রকাশ, মন্তব্য, বার্তা ও নিজের সাহিত্যিক ভুবন সংরক্ষণ করতে লগইন করুন।</p><div class="bd-r6-auth-actions"><a class="primary" href="login.html">লগইন</a><a href="register.html">নিবন্ধন</a></div></section>`;
    return `<div class="bd9-sidebar-stack"><section class="bd9-card bd9-identity"><a aria-label="ভুবনডাঙ্গার কবিতা হোম" class="bd9-leaf" href="index.html">🌿</a><h3><a href="${logged?esc(profileHref(me)):'index.html'}">আপন ভুবন</a></h3><p>আপনার লেখা, পাঠ ও সাহিত্যিক পথচলার নিজস্ব জায়গা।</p><div class="bd9-quote">“আপনার ক্ষতগুলোকে জ্ঞানে পরিণত করুন।”</div></section>${auth}<section class="bd9-card bd9-discovery"><div class="bd9-title"><h3>আজকের সাহিত্যপথ</h3><small>নির্বাচিত</small></div><nav class="bd9-menu"><a href="poem.html"><span>✒</span><b>আজকের কবিতা</b><i>›</i></a><a href="famous-quotes.html"><span>❝</span><b>মনীষীদের বাণী</b><i>›</i></a><a href="bhubondangar-lekhok.html"><span>◌</span><b>নতুন লেখকদের চিনুন</b><i>›</i></a></nav></section><section class="bd9-card"><div class="bd9-title"><h3>ভুবনের দরজা</h3><small>${logged?'ব্যক্তিগত':'উন্মুক্ত'}</small></div><nav class="bd9-menu">${logged?`<a href="${esc(profileHref(me))}"><span>◉</span><b>আমার প্রোফাইল</b><i>›</i></a><a href="messages.html"><span>▣</span><b>মেসেঞ্জার</b><i>›</i></a><a href="notifications.html"><span>♢</span><b>নোটিফিকেশন</b><i>›</i></a><a href="archive.html"><span>▱</span><b>আর্কাইভ</b><i>›</i></a><a href="memories.html"><span>◴</span><b>মেমোরিজ</b><i>›</i></a><a href="settings.html"><span>⚙</span><b>সেটিংস</b><i>›</i></a>`:''}<a href="discussion.html"><span>◌</span><b>সাহিত্য আলোচনা</b><i>›</i></a><a href="environment.html"><span>🌱</span><b>পরিবেশের কথা</b><i>›</i></a><a href="humanitarian-notice.html"><span>♡</span><b>মানবিক আবেদন</b><i>›</i></a></nav></section><section class="bd9-card"><div class="bd9-title"><h3>গ্লাস থিম</h3><small>সরাসরি পরিবর্তন</small></div><div class="bd9-palettes"><button data-bd-palette="pearl">মুক্তা</button><button data-bd-palette="moon">নীল জ্যোৎস্না</button><button data-bd-palette="lavender">ল্যাভেন্ডার</button><button data-bd-palette="rose">অরোরা</button></div><div class="bd9-modes"><button data-bd-mode="light">লাইট</button><button data-bd-mode="middle">মিডল</button><button data-bd-mode="dark">ডার্ক</button></div></section><section class="bd9-card bd9-contact"><a href="founder-profile.html">জরুরি প্রয়োজনে মাহমুদ সোহেলের সঙ্গে যোগাযোগ করুন</a></section></div>`;
  }
  function rightSidebarHTML(){
    const me=state.me||{};
    return `<div class="bd9-sidebar-stack">${state.session?`<section class="bd9-card bd-master-right-card bd-master-account">${avatar(me,'bd-master-account-avatar')}<h3>${esc(me.display_name||'সদস্য')}</h3><p>@${esc(me.username||'member')}</p><div class="bd-master-shortcuts"><a href="${esc(profileHref(me))}">প্রোফাইল</a><a href="messages.html">বার্তা</a><a href="notifications.html">নোটিফিকেশন</a><a href="settings.html">সেটিংস</a></div><button class="bd-master-logout" data-bd-logout>লগআউট</button></section>`:''}<section class="bd9-card"><div class="bd9-title"><h3>সক্রিয় লেখক</h3><small>সবুজ বাতি</small></div><div class="bd9-writers" data-bd-active-writers><div class="bd9-empty">সক্রিয় সদস্য লোড হচ্ছে…</div></div></section><section class="bd9-card"><div class="bd9-title"><h3>সহায়তা ও আস্থা</h3><small>গুরুত্বপূর্ণ</small></div><nav class="bd9-menu"><a href="humanitarian-notice.html"><span>＋</span><b>যাচাইকৃত মানবিক নোটিস</b><i>›</i></a><a href="about.html"><span>🌿</span><b>আমাদের সম্পর্কে</b><i>›</i></a><a href="contact.html"><span>✉</span><b>যোগাযোগ</b><i>›</i></a><a href="complaint.html"><span>⚑</span><b>অভিযোগ ও রিপোর্ট</b><i>›</i></a><a href="privacy-security-policy.html"><span>◇</span><b>গোপনীয়তা ও নিরাপত্তা</b><i>›</i></a><a href="policy.html"><span>§</span><b>নীতিমালা</b><i>›</i></a></nav></section><section class="bd9-card bd9-note">সাধারণ সাহিত্যিক লেখা সরাসরি প্রকাশিত হয়। মানবিক আবেদন যাচাইয়ের পর অগ্রাধিকার পায়।</section></div>`;
  }
  function renderSidebars(){
    if(page==='index.html'||!SIDEBAR_PAGES.has(page))return;
    const profileSides=$$('.profile-shell>.profile-side');
    const left=profileSides[0]||$('#leftSidebar')||$('#leftSide')||$('.sidebar.left-col')||$('.side.left')||$('.left-sidebar')||$('.sidebar.left');
    const right=profileSides[1]||$('#rightSidebar')||$('#rightSide')||$('.sidebar.right-col')||$('.side.right')||$('.right-sidebar')||$('.sidebar.right');
    if(left){left.innerHTML=leftSidebarHTML();left.classList.add('bd-index-sidebar-copy','left')}
    if(right){right.innerHTML=rightSidebarHTML();right.classList.add('bd-index-sidebar-copy','right')}
    const hasNativeLeft=nativeEdge('left'),hasNativeRight=nativeEdge('right');
    D.body.classList.toggle('bd-native-left-edge',hasNativeLeft);D.body.classList.toggle('bd-native-right-edge',hasNativeRight);
    $('#bdMasterLeftSidebar')?.remove();$('#bdMasterRightSidebar')?.remove();D.body.classList.remove('bd-master-fixed-sidebars');
    if(!hasNativeLeft&&left&&!$('#bdMasterLeftEdge')){const b=D.createElement('button');b.id='bdMasterLeftEdge';b.className='bd-master-edge left';b.type='button';b.textContent='›';b.setAttribute('aria-label','বাম সাইডবার খুলুন');D.body.appendChild(b)}
    if(!hasNativeRight&&right&&!$('#bdMasterRightEdge')){const b=D.createElement('button');b.id='bdMasterRightEdge';b.className='bd-master-edge right';b.type='button';b.textContent='‹';b.setAttribute('aria-label','ডান সাইডবার খুলুন');D.body.appendChild(b)}
    if($('#bdMasterLeftEdge')||$('#bdMasterRightEdge'))initSidebarDrawers();else $('#bdMasterDrawerShade')?.remove();
    loadActiveWriters();
  }
  function initSidebarDrawers(){
    if($('#bdMasterDrawerShade')||(!$('#bdMasterLeftEdge')&&!$('#bdMasterRightEdge')))return;
    const shade=D.createElement('div');shade.id='bdMasterDrawerShade';shade.className='bd-master-drawer-shade';shade.innerHTML=`<aside class="bd-master-mobile-drawer left"><button class="bd-master-drawer-close">×</button>${leftSidebarHTML()}</aside><aside class="bd-master-mobile-drawer right"><button class="bd-master-drawer-close">×</button>${rightSidebarHTML()}</aside>`;D.body.appendChild(shade);
    const close=()=>{shade.classList.remove('open-left','open-right');D.body.classList.remove('bd-drawer-open')};
    $('#bdMasterLeftEdge')?.addEventListener('click',()=>{shade.classList.remove('open-right');shade.classList.add('open-left');D.body.classList.add('bd-drawer-open')},{passive:true});
    $('#bdMasterRightEdge')?.addEventListener('click',()=>{shade.classList.remove('open-left');shade.classList.add('open-right');D.body.classList.add('bd-drawer-open')},{passive:true});
    shade.addEventListener('click',e=>{if(e.target===shade||e.target.closest('.bd-master-drawer-close'))close()});
    W.addEventListener('popstate',close,{passive:true});
  }
  async function loadActiveWriters(){
    const hosts=$$('[data-bd-active-writers]');if(!hosts.length)return;
    const c=client();let rows=[];if(c){try{const q=await c.from('profiles').select('id,username,display_name,avatar_url,role').neq('id',state.me?.id||'00000000-0000-0000-0000-000000000000').order('updated_at',{ascending:false}).limit(7);if(!q.error)rows=q.data||[]}catch{}}
    const html=rows.length?rows.map(p=>`<a class="bd-master-writer" href="${esc(profileHref(p))}">${avatar(p,'bd-master-writer-avatar')}<span><strong>${esc(p.display_name||p.username)}</strong><small>${p.role==='founder'?'প্রতিষ্ঠাতা':'সদস্য'}</small></span><i></i></a>`).join(''):'<div class="bd9-empty">এখন কোনো বাস্তব সক্রিয় লেখক দেখা যাচ্ছে না।</div>';
    hosts.forEach(h=>h.innerHTML=html);
  }

  // Facebook-style reaction/comment enhancement for both Index and Profile cards.
  function cardId(card){return clean(card?.dataset?.post||card?.dataset?.postId||card?.querySelector('[data-id]')?.dataset?.id)}
  function enhanceCard(card){
    if(!card||card.dataset.bdMasterEnhanced)return;
    /* CANONICAL: Index owns its social DOM in feed.html. Never replace it here. */
    if(INDEX_NATIVE_RUNTIME){card.dataset.bdMasterEnhanced='native-index';return}
    const id=cardId(card);if(!id)return;card.dataset.bdPostId=id;if(card.querySelector(':scope > .bd31-social,[data-bd31-social]')){card.dataset.bdMasterEnhanced='native';return}card.dataset.bdMasterEnhanced='1';const cardTitle=clean(card.querySelector('.post-title,h2,h3')?.textContent);if(/প্রোফাইল ছবি পরিবর্তন/.test(cardTitle))card.classList.add('bd-profile-avatar-update');if(/কভার ছবি পরিবর্তন/.test(cardTitle))card.classList.add('bd-profile-cover-update');
    const actions=card.querySelector('.post-actions,.post-action-row');if(!actions)return;actions.classList.add('bd-facebook-action-row');if(String(id).startsWith('promo-')&&['founder','admin','moderator'].includes(String(state.me?.role||'').toLowerCase())&&!card.querySelector('[data-bd-delete-promo]')){const head=card.querySelector('.post-head,.post-card-head')||card;head.insertAdjacentHTML('beforeend',`<button type="button" class="bd-promo-delete" data-bd-delete-promo="${esc(id)}" title="ডেমো পোস্ট সরান">×</button>`) }
    const old=actions.querySelector('[data-action="love"],[data-action="react"],[data-live-like]');
    if(old){
      const wrap=D.createElement('div');wrap.className='bd-fb-react-wrap';wrap.innerHTML=`<button class="bd-fb-react-button" data-bd-react-main="${esc(id)}" type="button" aria-label="লাইক বা অন্য প্রতিক্রিয়া দিন"><span class="bd-react-symbol">👍</span><span class="bd-react-label">লাইক</span></button><div class="bd-fb-react-picker" role="menu" aria-label="প্রতিক্রিয়া বেছে নিন">${Object.entries(REACTIONS).map(([r,m])=>`<button type="button" data-bd-reaction="${r}" aria-label="${m[1]}" title="${m[1]}">${reactionVisual(r)}</button>`).join('')}</div>`;old.replaceWith(wrap);
    }
    const commentBtn=actions.querySelector('[data-action="comment"],[data-action="comments"],[data-comment]');if(commentBtn){commentBtn.dataset.bdCommentToggle=id;commentBtn.removeAttribute('data-action');commentBtn.removeAttribute('data-comment');commentBtn.innerHTML='<span class="bd-action-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15a4 4 0 0 1-4 4H8l-5 3v-7a4 4 0 0 1-1-3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"></path></svg></span><span>মন্তব্য</span>'}
    const shareBtn=actions.querySelector('[data-action="share"],[data-live-share]');if(shareBtn){shareBtn.classList.add('bd-fb-share-button');shareBtn.innerHTML='<span class="bd-action-icon">↗</span><span>শেয়ার</span>'}
    const saveBtn=actions.querySelector('[data-action="save"],[data-live-save]');if(saveBtn){saveBtn.classList.add('bd-fb-save-button');const menuBox=card.querySelector('.post-menu:not(button)');if(menuBox){saveBtn.classList.remove('action-btn','action');saveBtn.classList.add('bd-profile-menu-save');saveBtn.innerHTML='▱ পোস্ট সেভ করুন';menuBox.appendChild(saveBtn)}else{saveBtn.remove()}actions.classList.add('bd-three-actions')}
    const legacyCounts=card.querySelector('.post-counts,.reaction-counts');if(legacyCounts)legacyCounts.hidden=true;
    let counts=card.querySelector('.bd-fb-counts');if(!counts){counts=D.createElement('div');counts.className='bd-fb-counts';counts.innerHTML='<button type="button" class="bd-fb-summary" aria-label="প্রতিক্রিয়ার সারাংশ"></button><button type="button" class="bd-fb-comment-count" data-bd-comment-toggle="'+esc(id)+'">০ মন্তব্য</button>';const footer=card.querySelector('.post-footer')||actions;footer.parentNode.insertBefore(counts,footer)}
    const oldBox=card.querySelector('.comment-box,.comments');if(oldBox)oldBox.hidden=true;
    if(!card.querySelector('.bd-fb-comments')){
      const sec=D.createElement('section');sec.className='bd-fb-comments';sec.dataset.bdComments=id;sec.innerHTML=`<div class="bd-fb-comment-list"><div class="bd-fb-pending">মন্তব্য লোড হচ্ছে…</div></div><form class="bd-fb-comment-compose" data-bd-comment-form="${esc(id)}">${avatar(state.me,'bd-fb-comment-avatar')}<textarea maxlength="5000" placeholder="মন্তব্য লিখুন…" ${state.session?'':'disabled'}></textarea><button type="submit" title="মন্তব্য করুন">➤</button></form>`;card.appendChild(sec);
    }
    refreshPostSocial(card).catch(()=>{});
  }
  function enhanceCards(){if(INDEX_NATIVE_RUNTIME)return;$$('article[data-post],article[data-post-id],.post-card[data-post-id]').forEach(enhanceCard)}
  function scheduleEnhance(){clearTimeout(state.enhanceTimer);state.enhanceTimer=setTimeout(enhanceCards,40)}
  async function socialRows(id){
    const c=client();let reactions=[],comments=[];
    if(c){
      try{const rpc=await c.rpc('get_post_social',{target_post:String(id)});if(!rpc.error&&rpc.data){reactions=rpc.data.reactions||[];comments=rpc.data.comments||[];}}
      catch(_){}
      if(!reactions.length&&!comments.length){try{const promo=String(id).startsWith('promo-'),ct=promo?'promo_comments':'comments';if(promo){const [r,cm]=await Promise.all([c.from('promo_reactions').select('*').eq('post_id',id),c.from(ct).select('*').eq('post_id',id).eq('status','published').is('deleted_at',null).order('created_at',{ascending:true})]);if(!r.error)reactions=r.data||[];if(!cm.error)comments=cm.data||[]}else{const [a,b,cm]=await Promise.all([c.from('post_reactions').select('*').eq('post_id',id),c.from('reactions').select('*').eq('post_id',id),c.from(ct).select('*').eq('post_id',id).eq('status','published').is('deleted_at',null).order('created_at',{ascending:true})]);const merged=[];for(const row of [...(a.error?[]:(a.data||[])),...(b.error?[]:(b.data||[]))]){const k=String(row.user_id||row.id||'');const i=merged.findIndex(x=>String(x.user_id||x.id||'')===k);if(i<0)merged.push(row);else if(!a.error&&i>=0)merged[i]=merged[i]||row}reactions=merged;if(!cm.error)comments=cm.data||[]}}catch(_){}}
    }
    if(!reactions.length)reactions=localRead('bd-master-reactions',[]).filter(x=>String(x.post_id)===String(id));
    if(!comments.length)comments=localRead('bd-master-comments',[]).filter(x=>String(x.post_id)===String(id)&&!x.deleted_at);
    return{reactions,comments};
  }
  async function authorProfiles(ids){
    const c=client();if(!c||!ids.length)return new Map();try{const r=await c.from('profiles').select('id,username,display_name,avatar_url').in('id',[...new Set(ids.filter(isUuid))]);return new Map((r.data||[]).map(p=>[p.id,p]))}catch{return new Map()}
  }
  async function refreshPostSocial(card){
    const id=cardId(card);if(!id||!card.isConnected)return;const {reactions,comments}=await socialRows(id);const grouped={};reactions.forEach(x=>grouped[x.reaction]=(grouped[x.reaction]||0)+1);const top=Object.entries(grouped).sort((a,b)=>b[1]-a[1]).slice(0,3);const mine=reactions.find(x=>x.user_id===state.me?.id);const m=mine?REACTIONS[mine.reaction]:null;
    const main=card.querySelector('[data-bd-react-main]');if(main){main.classList.toggle('active',!!mine);main.querySelector('.bd-react-symbol').innerHTML=reactionVisual(mine?.reaction||'like','main');main.querySelector('.bd-react-label').textContent=m?.[1]||'লাইক'}
    const summary=card.querySelector('.bd-fb-summary');if(summary){const rpm=await authorProfiles(reactions.map(x=>x.user_id)),named=reactions.map(x=>rpm.get(x.user_id)?.display_name).filter(Boolean),total=reactions.length,bnTotal=new Intl.NumberFormat('bn-BD').format(total),lead=named[0]||'';let label='';if(total===1)label=lead||'১ জন';else if(total>1)label=lead?`${lead} + ${new Intl.NumberFormat('bn-BD').format(total-1)}`:`${bnTotal} জন`;summary.innerHTML=(top.map(([r])=>`<span class="emoji">${reactionVisual(r,'summary')}</span>`).join('')||'')+(label?`<span class="bd-fb-summary-label">${esc(label)}</span>`:'');summary.hidden=!total}
    const count=card.querySelector('.bd-fb-comment-count');if(count){count.textContent=`${new Intl.NumberFormat('bn-BD').format(comments.length)} মন্তব্য`;count.hidden=!comments.length}const counts=card.querySelector('.bd-fb-counts');if(counts){counts.hidden=false;counts.classList.toggle('bd-social-empty',!reactions.length&&!comments.length);}
    const list=card.querySelector('.bd-fb-comment-list');if(list){
      const hidden=new Set(localRead('bd-hidden-comments',[]).map(String)),visible=comments.filter(x=>!hidden.has(String(x.id))),pm=await authorProfiles(visible.map(x=>x.author_id));
      list.innerHTML=visible.length?visible.map(x=>{const p=pm.get(x.author_id)||{display_name:x.author_name||'সদস্য',avatar_url:x.author_avatar||''};return `<div class="bd-fb-comment" data-comment-id="${esc(x.id)}">${avatar(p,'bd-fb-comment-avatar')}<div class="bd-fb-comment-bubble"><strong><a href="${esc(profileHref(p))}">${esc(p.display_name||x.author_name||'সদস্য')}</a></strong>${esc(x.body)}<time>${formatDate(x.created_at)}</time></div><button class="bd-fb-comment-hide" data-bd-hide-comment="${esc(x.id)}" title="শুধু আমার জন্য লুকান">•••</button></div>`}).join(''):'<div class="bd-fb-pending">এখনও কোনো মন্তব্য নেই—প্রথম মন্তব্যটি লিখুন।</div>';
    }
  }
  async function react(id,reaction){
    if(!state.session){location.href=loginLink();return}const c=client();
    try{
      if(c){let handled=false;try{const rpc=await c.rpc('toggle_post_reaction',{target_post:String(id),chosen_reaction:reaction});if(!rpc.error)handled=true;}catch(_){}if(!handled){const tables=String(id).startsWith('promo-')?['promo_reactions']:['post_reactions','reactions'];let lastErr=null;for(const table of tables){try{const old=await c.from(table).select('reaction').eq('post_id',id).eq('user_id',state.me.id).maybeSingle();let r;if(old.data?.reaction===reaction)r=await c.from(table).delete().eq('post_id',id).eq('user_id',state.me.id);else r=await c.from(table).upsert({post_id:id,user_id:state.me.id,reaction},{onConflict:'post_id,user_id'});if(!r.error){handled=true;break}lastErr=r.error}catch(err){lastErr=err}}if(!handled&&lastErr)throw lastErr}}
      else{let rows=localRead('bd-master-reactions',[]),old=rows.find(x=>x.post_id===id&&x.user_id===state.me.id);rows=rows.filter(x=>!(x.post_id===id&&x.user_id===state.me.id));if(old?.reaction!==reaction)rows.push({post_id:id,user_id:state.me.id,reaction,created_at:new Date().toISOString()});localWrite('bd-master-reactions',rows)}
      const card=$(`[data-bd-post-id="${CSS.escape(String(id))}"]`);if(card)await refreshPostSocial(card);
    }catch(e){toast(e.message||'প্রতিক্রিয়া সংরক্ষণ হয়নি')}
  }
  async function addComment(id,body){
    if(!state.session){location.href=loginLink();return}body=body.trim();if(!body)return;
    const safety=W.BhubondangaProfanity?.scan?.(body)||{flagged:false};const row={id:crypto.randomUUID(),post_id:id,author_id:state.me.id,author_username:state.me.username||'',author_name:state.me.display_name||'সদস্য',author_avatar:state.me.avatar_url||'',body,status:safety.flagged?'pending_review':'published'};
    try{const c=client();if(c){const table=String(id).startsWith('promo-')?'promo_comments':'comments';const r=await c.from(table).insert(row);if(r.error)throw r.error}else{const a=localRead('bd-master-comments',[]);a.push({...row,created_at:new Date().toISOString()});localWrite('bd-master-comments',a)}if(safety.flagged)toast('মন্তব্যটি পর্যালোচনার জন্য পাঠানো হয়েছে');const card=$(`[data-bd-post-id="${CSS.escape(String(id))}"]`);if(card)await refreshPostSocial(card)}catch(e){toast(e.message||'মন্তব্য প্রকাশ হয়নি')}
  }
  function stableAnchor(card){let sc=card?.parentElement;while(sc&&sc!==D.body&&sc!==D.documentElement){const cs=getComputedStyle(sc);if(/auto|scroll/.test(cs.overflowY)&&sc.scrollHeight>sc.clientHeight+2)break;sc=sc.parentElement}const win=!sc||sc===D.body||sc===D.documentElement;return{sc:win?null:sc,y:win?(W.scrollY||D.documentElement.scrollTop||0):sc.scrollTop,top:card?.getBoundingClientRect?.().top||0}}
  function restoreAnchor(){/* V6.9: intentionally no programmatic scroll correction */}
  function loveBurst(card){if(!card)return;const old=card.querySelector('.bd-love-burst');old?.remove();const b=D.createElement('span');b.className='bd-love-burst';b.innerHTML=reactionVisual('love');card.style.position=card.style.position||'relative';card.appendChild(b);setTimeout(()=>b.remove(),620)}
  function crossMediaEvents(){let last={card:null,t:0};D.addEventListener('pointerup',async e=>{if(e.pointerType==='mouse'&&e.button!==0)return;const card=e.target.closest('article[data-post-id],article[data-post],.post-card[data-post-id],[data-bd-post-id]');if(!card)return;const id=cardId(card);if(!id)return;const now=Date.now(),interactive=e.target.closest('button,a,input,textarea,select,label');if(interactive)return;const media=e.target.closest('video,.post-media,.bd-cross-media');const body=e.target.closest('.post-body,.body,.post-media,.bd-cross-media,video');if(!body)return;if(last.card===card&&now-last.t<330){last={card:null,t:0};e.preventDefault();if(card.querySelector('.bd31-social,[data-bd31-social]'))return;await react(id,'love');loveBurst(card);return}last={card,t:now};if(media){const v=media.matches('video')?media:media.querySelector('video');if(v){card.classList.toggle('bd-inline-reel');v.setAttribute('playsinline','');v.controls=true;if(card.classList.contains('bd-inline-reel')){try{await v.play()}catch{}}}}},{passive:false,capture:true});}
  function socialEvents(){
    D.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-bd-react-main]');if(!b)return;clearTimeout(state.holdTimer);state.holdOpened=false;state.holdTimer=setTimeout(()=>{const p=b.parentElement.querySelector('.bd-fb-react-picker');$$('.bd-fb-react-picker.open').forEach(x=>x!==p&&x.classList.remove('open'));p?.classList.add('open');state.holdOpened=true},420)},true);
    for(const ev of ['pointerup','pointercancel'])D.addEventListener(ev,()=>clearTimeout(state.holdTimer),true);
    D.addEventListener('click',async e=>{
      const rb=e.target.closest('[data-bd-reaction]');if(rb){e.preventDefault();e.stopImmediatePropagation();const card=rb.closest('[data-bd-post-id]'),id=cardId(card);rb.closest('.bd-fb-react-picker')?.classList.remove('open');await react(id,rb.dataset.bdReaction);return}
      const main=e.target.closest('[data-bd-react-main]');if(main){e.preventDefault();e.stopImmediatePropagation();if(state.holdOpened){state.holdOpened=false;return}const card=main.closest('[data-bd-post-id]');await react(main.dataset.bdReactMain,'like');return}
      const toggle=e.target.closest('[data-bd-comment-toggle]');if(toggle){e.preventDefault();e.stopImmediatePropagation();const card=toggle.closest('[data-bd-post-id]'),sec=card?.querySelector('.bd-fb-comments');sec?.classList.toggle('open');if(sec?.classList.contains('open'))sec.querySelector('textarea')?.focus({preventScroll:true});return}
      const hide=e.target.closest('[data-bd-hide-comment]');if(hide){e.preventDefault();e.stopImmediatePropagation();const a=localRead('bd-hidden-comments',[]).map(String);if(!a.includes(hide.dataset.bdHideComment))a.push(hide.dataset.bdHideComment);localWrite('bd-hidden-comments',a);await refreshPostSocial(hide.closest('[data-bd-post-id]'));return}
      const promoDelete=e.target.closest('[data-bd-delete-promo]');if(promoDelete){e.preventDefault();e.stopImmediatePropagation();if(!confirm('এই স্থায়ী demo পোস্টটি বন্ধ করবেন?'))return;const c=client(),r=await c.from('promo_posts').update({active:false}).eq('id',promoDelete.dataset.bdDeletePromo);if(r.error)throw r.error;toast('Demo পোস্টটি বন্ধ করা হয়েছে');await loadPromoBridge();return}
      if(!e.target.closest('.bd-fb-react-picker'))$$('.bd-fb-react-picker.open').forEach(x=>x.classList.remove('open'));
    },true);
    D.addEventListener('submit',async e=>{const f=e.target.closest('[data-bd-comment-form]');if(!f)return;e.preventDefault();e.stopImmediatePropagation();const t=f.querySelector('textarea'),body=t.value.trim();if(!body)return;t.disabled=true;await addComment(f.dataset.bdCommentForm,body);t.value='';t.disabled=false;t.focus({preventScroll:true})},true);
  }
  function subscribeSocial(){const c=client();if(!c)return;try{const ch=c.channel('bd-master-social-'+page).on('postgres_changes',{event:'*',schema:'public',table:'post_reactions'},p=>{const id=p.new?.post_id||p.old?.post_id;if(id)refreshPostSocial($(`[data-bd-post-id="${CSS.escape(String(id))}"]`))}).on('postgres_changes',{event:'*',schema:'public',table:'reactions'},p=>{const id=p.new?.post_id||p.old?.post_id;if(id)refreshPostSocial($(`[data-bd-post-id="${CSS.escape(String(id))}"]`))}).on('postgres_changes',{event:'*',schema:'public',table:'comments'},p=>{const id=p.new?.post_id||p.old?.post_id;if(id)refreshPostSocial($(`[data-bd-post-id="${CSS.escape(String(id))}"]`))}).on('postgres_changes',{event:'*',schema:'public',table:'promo_reactions'},p=>{const id=p.new?.post_id||p.old?.post_id;if(id)refreshPostSocial($(`[data-bd-post-id="${CSS.escape(String(id))}"]`))}).on('postgres_changes',{event:'*',schema:'public',table:'promo_comments'},p=>{const id=p.new?.post_id||p.old?.post_id;if(id)refreshPostSocial($(`[data-bd-post-id="${CSS.escape(String(id))}"]`))}).on('postgres_changes',{event:'*',schema:'public',table:'promo_posts'},loadPromoBridge).subscribe();state.channels.push(ch)}catch(e){console.warn(e)}
  }

  async function loadPromoBridge(){
    const c=client();if(!c)return[];try{const [pp,pr]=await Promise.all([c.from('promo_posts').select('*').eq('active',true).order('created_at',{ascending:false}),c.from('promo_profiles').select('*').eq('active',true)]);if(pp.error||pr.error)throw pp.error||pr.error;const pm=new Map((pr.data||[]).map(x=>[x.id,x]));state.promoPosts=(pp.data||[]).map(x=>{const a=pm.get(x.profile_id)||{};return{...x,author_id:a.id||x.profile_id,author_username:a.username||'',author_name:a.display_name||'ভুবনডাঙ্গার লেখক',author_avatar:a.avatar_url||'',author_role:a.role||'user',status:'published',demo:true}});W.__BD_PROMO_POSTS=state.promoPosts;D.dispatchEvent(new Event('bd:supabase-posts'));scheduleEnhance();return state.promoPosts}catch(e){console.warn('Promo content:',e);return[]}
  }

  // Index composer: real Storage upload + database insert, with no page reload.
  function mediaFile(){return $('#postImage')?.files?.[0]||$('#postAudio')?.files?.[0]||$('#postVideo')?.files?.[0]||null}
  async function upload(file,bucket='post-media'){
    if(!file)return{url:'',type:''};const c=client();if(!c||!state.me)return{url:URL.createObjectURL(file),type:file.type};const ext=(file.name.split('.').pop()||'bin').toLowerCase(),path=`${state.me.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;const r=await c.storage.from(bucket).upload(path,file,{contentType:file.type,upsert:false});if(r.error)throw r.error;return{url:c.storage.from(bucket).getPublicUrl(path).data.publicUrl,type:file.type};
  }
  function typeCategory(t){return({poem:'কবিতা',prolap:'ছোট কথার প্রলাপ',letter:'চিঠিপত্র',letters:'চিঠিপত্র',recitation:'আবৃত্তি',environment:'পরিবেশ',discussion:'আলোচনা',children:'শিশুতোষ',midnight:'মধ্যরাতের প্রলাপ'})[t]||'কবিতা'}
  async function publishIndex(form){
    if(!state.session){location.href=loginLink();return}const type=form.querySelector('[name=postType]:checked')?.value||'poem',title=$('#postTitle')?.value.trim(),body=$('#postBody')?.value.trim();if(!title||!body)throw new Error('শিরোনাম ও লেখা পূরণ করুন');if(type==='midnight'&&String(state.me.role).toLowerCase()!=='founder')throw new Error('মধ্যরাতের প্রলাপে শুধু মাহমুদ সোহেল প্রকাশ করতে পারবেন।');
    const file=mediaFile(),up=await upload(file,'post-media'),safety=W.BhubondangaProfanity?.scan?.(`${title} ${body}`)||{flagged:false};const row={id:'post-'+Date.now()+'-'+Math.random().toString(36).slice(2,9),author_id:state.me.id,author_username:state.me.username||'',author_name:state.me.display_name||'সদস্য',author_avatar:state.me.avatar_url||'',type,category:typeCategory(type),title,body,original_author:$('#ownWork')?.checked?'':($('#originalAuthor')?.value.trim()||''),media_url:up.url,media_type:up.type,media_caption:$('#postMediaCaption')?.value.trim()||'',card_style:$('#cardStyle')?.value||'pearl',visibility:'public',status:safety.flagged?'pending_review':'published'};
    const c=client();if(c){const r=await c.from('posts').insert(row).select().single();if(r.error){if(String(r.error.message).toLowerCase().includes('duplicate')||r.error.code==='23505')throw new Error('এই কবিতাটি মূল কবিতা হিসেবে আগে থেকেই সংরক্ষিত আছে। আবৃত্তি বা সমালোচনা হিসেবে প্রকাশ করতে পারবেন।');throw r.error}row.created_at=r.data.created_at}else{const a=localRead('bhubondangaPosts',[]);a.unshift({...row,created_at:new Date().toISOString()});localWrite('bhubondangaPosts',a)}
    if(safety.flagged)toast('লেখাটি পর্যালোচনার জন্য পাঠানো হয়েছে');else toast('পোস্ট প্রকাশিত হয়েছে—Index, Profile ও Archive-এ দেখা যাবে');
    form.reset();$('#postMediaPreview')&&( $('#postMediaPreview').innerHTML='', $('#postMediaPreview').hidden=true);$('#postMediaCaption')&&($('#postMediaCaption').hidden=true);form.hidden=true;$('#composerPrompt')&&( $('#composerPrompt').hidden=false);
    await injectNewestPost(row);return row;
  }
  async function injectNewestPost(row){
    // Existing Index realtime loader owns the feed. Push into its known bridge and nudge it without reload.
    W.__BD_SUPABASE_POSTS=Array.isArray(W.__BD_SUPABASE_POSTS)?W.__BD_SUPABASE_POSTS:[];W.__BD_SUPABASE_POSTS=W.__BD_SUPABASE_POSTS.filter(x=>String(x.id)!==String(row.id));W.__BD_SUPABASE_POSTS.unshift(row);
    D.dispatchEvent(new CustomEvent('bhubondanga:post-created',{detail:row}));
    setTimeout(()=>{const list=$('#postList');if(list&&!list.querySelector(`[data-post="${CSS.escape(String(row.id))}"]`)){location.hash='';D.dispatchEvent(new Event('bd-refresh-feed'))}},80);
  }
  function composerEvents(){
    const form=$('#composerForm');if(!form)return;
    form.addEventListener('submit',async e=>{e.preventDefault();e.stopImmediatePropagation();const b=form.querySelector('[type=submit]');b.disabled=true;const old=b.textContent;b.textContent='প্রকাশ হচ্ছে…';try{await publishIndex(form)}catch(err){toast(err.message||'পোস্ট প্রকাশ হয়নি')}finally{b.disabled=false;b.textContent=old||'প্রকাশ করুন'}},true);
  }

  // Story Touch and Magic Touch.
  async function targetProfile(){
    const q=new URLSearchParams(location.search),u=q.get('user');if(page==='founder-profile.html')return await profile('mahmud-sohel')||state.me;if(page==='admin-profile.html'&&u)return await profile(u);return u?await profile(u):state.me;
  }
  function touchDoors(){
    if(!['profile.html','founder-profile.html','admin-profile.html'].includes(page)||$('#bdTouchLaunchers'))return;
    const actions=$('.profile-actions');if(!actions)return;const wrap=D.createElement('div');wrap.id='bdTouchLaunchers';wrap.className='bd-touch-launchers';wrap.innerHTML='<button class="bd-touch-launch story" data-bd-open-story>স্টোরি টাচ</button><button class="bd-touch-launch magic" data-bd-open-magic>ম্যাজিক টাচ</button>';actions.insertAdjacentElement('afterend',wrap);
    D.body.insertAdjacentHTML('beforeend',`<div class="bd-touch-door story" id="bdStoryDoor"><div class="bd-touch-panel"><header class="bd-touch-head"><div><strong>স্টোরি টাচ</strong><small>২৪ ঘণ্টার গল্প, sliding flow ও Messenger reaction</small></div><button class="bd-touch-close" data-bd-close-door>×</button></header><div class="bd-touch-content" data-bd-story-content></div></div></div><div class="bd-touch-door magic" id="bdMagicDoor"><div class="bd-touch-panel"><header class="bd-touch-head"><div><strong>ম্যাজিক টাচ</strong><small>প্রিয় লেখক, প্রিয় কবিতা, বন্ধু ও উন্মুক্ত Dashboard</small></div><button class="bd-touch-close" data-bd-close-door>×</button></header><div class="bd-touch-content" data-bd-magic-content></div></div></div>`);
  }
  async function loadStories(){
    const c=client();let rows=[];if(c){try{await c.rpc('archive_expired_stories');const r=await c.from('stories').select('*').order('created_at',{ascending:false}).limit(150);if(!r.error)rows=r.data||[];const ids=[...new Set(rows.map(x=>x.owner_id))];const pm=await authorProfiles(ids);rows.forEach(x=>x.owner=pm.get(x.owner_id)||{id:x.owner_id,display_name:'সদস্য'})}catch(e){console.warn(e)}}
    const now=Date.now();state.storyRows=rows.filter(x=>!x.archived_at&&new Date(x.expires_at).getTime()>now);state.storyArchive=rows.filter(x=>x.owner_id===state.me?.id&&(x.archived_at||new Date(x.expires_at).getTime()<=now));return state.storyRows;
  }
  function storyCard(s,archived=false){return `<button class="bd-story-card${archived?' archived':''}" data-bd-story-id="${esc(s.id)}" style="${s.media_url?`background-image:url('${esc(s.media_url)}');background-size:cover;background-position:center`:''}">${avatar(s.owner,'avatar')}<span class="copy"><strong>${esc(s.owner?.display_name||'সদস্য')}</strong><small>${esc(s.caption||(archived?'আর্কাইভ স্টোরি':'স্টোরি দেখুন'))}</small></span></button>`}
  async function openStoryDoor(){
    const door=$('#bdStoryDoor'),host=$('[data-bd-story-content]');if(!door||!host)return;door.classList.add('open');const rows=await loadStories();const owner=await targetProfile();state.storyOwner=owner;const mine=state.me?.id===owner?.id,archive=mine?(state.storyArchive||[]):[];
    host.innerHTML=`${mine?`<form class="bd-story-upload" data-bd-story-upload><input type="file" accept="image/*,video/*" required><select name="visibility"><option value="public">Public</option><option value="followers">Followers</option><option value="private">Private</option></select><input name="caption" placeholder="স্টোরির ক্যাপশন"><button type="submit">স্টোরি শেয়ার</button></form>`:''}<div class="bd-story-flow"><div class="bd-story-track">${rows.map(storyCard).join('')}${rows.length>1?rows.map(storyCard).join(''):''}</div></div>${!rows.length?'<div class="bd-fb-pending">এখন কোনো সক্রিয় স্টোরি নেই।</div>':''}${mine?`<section class="bd-story-archive"><h3>আপনার ২৪ ঘণ্টার Story Archive</h3><div class="bd-story-archive-grid">${archive.length?archive.map(x=>storyCard(x,true)).join(''):'<div class="bd-fb-pending">আর্কাইভে এখন কোনো স্টোরি নেই।</div>'}</div></section>`:''}<div data-bd-story-view></div>`;
  }
  async function viewStory(id){
    const all=[...(state.storyRows||[]),...(state.storyArchive||[])],s=all.find(x=>String(x.id)===String(id)),host=$('[data-bd-story-view]');if(!s||!host)return;const media=String(s.media_type).startsWith('video')?`<video controls autoplay playsinline src="${esc(s.media_url)}"></video>`:`<img src="${esc(s.media_url)}" alt="স্টোরি">`,active=!s.archived_at&&new Date(s.expires_at).getTime()>Date.now();
    host.innerHTML=`<div class="bd-story-viewer"><div class="bd-story-view-media">${media}</div><aside class="bd-story-view-side"><h3>${esc(s.owner?.display_name||'সদস্য')}</h3><p>${esc(s.caption||'')}</p><small>${formatDate(s.created_at)}${active?'':' · আর্কাইভ'}</small>${state.session&&active&&s.owner_id!==state.me.id?`<div class="bd-story-reactions">${Object.entries(REACTIONS).map(([r,m])=>`<button data-bd-story-react="${r}" data-story="${esc(s.id)}" title="${m[1]}">${m[0]}</button>`).join('')}</div><p>প্রতিক্রিয়াটি Messenger-এ পৌঁছাবে। কথোপকথনের অনুমতি না থাকলে ১২ ঘণ্টার request তৈরি হবে।</p>`:''}</aside></div>`;
    host.closest('.bd-touch-content')?.scrollTo({top:Math.max(0,host.offsetTop-12),behavior:'smooth'});const c=client();if(c&&state.session&&active&&s.owner_id!==state.me.id)c.from('story_views').upsert({story_id:s.id,viewer_id:state.me.id},{onConflict:'story_id,viewer_id'}).then(()=>{});
  }
  async function storyUpload(form){const file=form.querySelector('input[type=file]').files[0];if(!file)return;const up=await upload(file,'stories'),row={owner_id:state.me.id,media_url:up.url,media_type:file.type.startsWith('video')?'video':'image',caption:form.caption.value.trim(),visibility:form.visibility.value,expires_at:new Date(Date.now()+86400000).toISOString()};const c=client();if(!c)throw new Error('Story-এর জন্য Supabase সংযোগ প্রয়োজন');const r=await c.from('stories').insert(row);if(r.error)throw r.error;toast('স্টোরি ২৪ ঘণ্টার জন্য প্রকাশিত হয়েছে');await openStoryDoor()}
  async function reactStory(id,r){if(!state.session){location.href=loginLink();return}const c=client();if(!c)return;const x=await c.rpc('react_to_story',{target_story:id,chosen_reaction:r});if(x.error)throw x.error;const status=x.data?.status||x.data?.request?.status;if(status==='blocked')toast('এই সদস্য বার্তার অনুমতি বন্ধ রেখেছেন');else toast(status==='sent'?'স্টোরি reaction Messenger-এ পৌঁছেছে':'Reaction পাঠানো হয়েছে; Messenger permission request ১২ ঘণ্টা সক্রিয় থাকবে')}
  async function followPeople(owner){
    const c=client();if(!c||!owner||!isUuid(owner.id))return{followers:[],following:[]};
    const [fr,fg]=await Promise.all([c.from('follows').select('follower_id').eq('following_id',owner.id),c.from('follows').select('following_id').eq('follower_id',owner.id)]);const followerIds=(fr.data||[]).map(x=>x.follower_id),followingIds=(fg.data||[]).map(x=>x.following_id),ids=[...new Set([...followerIds,...followingIds])];const pm=await authorProfiles(ids);return{followers:followerIds.map(id=>pm.get(id)).filter(Boolean),following:followingIds.map(id=>pm.get(id)).filter(Boolean)};
  }
  function peopleList(rows,empty){return rows.length?rows.slice(0,24).map(p=>`<a class="bd-friend-row" href="${esc(profileHref(p))}">${avatar(p,'avatar')}<span><strong>${esc(p.display_name||p.username||'সদস্য')}</strong><small>@${esc(p.username||'member')}</small></span><b>›</b></a>`).join(''):`<div class="bd-fb-pending">${empty}</div>`}
  async function openMagicDoor(){
    const door=$('#bdMagicDoor'),host=$('[data-bd-magic-content]');if(!door||!host)return;door.classList.add('open');const owner=await targetProfile();if(!owner){host.innerHTML='<div class="bd-fb-pending">প্রোফাইল পাওয়া যায়নি।</div>';return}const c=client(),mine=state.me?.id===owner.id;let pref={magic_visibility:'friends',favorite_authors:[],favorite_poems:[]},prefReadable=false,friends=[],posts=[],people={followers:[],following:[]},activities=[];
    if(c&&!String(owner.id).startsWith('promo-')){try{const [pr,fr,ps,fl,ac]=await Promise.all([c.from('profile_preferences').select('*').eq('user_id',owner.id).maybeSingle(),c.rpc('get_mutual_friends',{target_user:owner.id}),c.from('posts').select('id,type,title,status').eq('author_id',owner.id).in('status',['published','published_flagged']),followPeople(owner),mine?c.from('activity_logs').select('*').eq('actor_id',owner.id).order('created_at',{ascending:false}).limit(20):Promise.resolve({data:[]})]);if(pr.data){pref=pr.data;prefReadable=true}if(!fr.error)friends=fr.data||[];if(!ps.error)posts=ps.data||[];people=fl;if(!ac.error)activities=ac.data||[]}catch(e){console.warn(e)}}else if(String(owner.id).startsWith('promo-')){posts=(state.promoPosts||[]).filter(x=>x.profile_id===owner.id)}
    const detailsVisible=mine||prefReadable||friends.some(x=>x.id===state.me?.id),bn=n=>new Intl.NumberFormat('bn-BD').format(n||0),favorites=arr=>Array.isArray(arr)&&arr.length?arr.map(x=>`<div class="bd-favorite-item">${esc(typeof x==='string'?x:(x.title||x.name||''))}</div>`).join(''):'<div class="bd-fb-pending">এখনও কিছু যোগ করা হয়নি।</div>';
    const activity=activities.length?`<section class="bd-magic-card bd-activity-log"><h3>Activity Log — শুধু আপনার জন্য</h3>${activities.map(x=>`<div class="bd-activity-row"><span>${esc(x.action)}</span><small>${formatDate(x.created_at)}</small></div>`).join('')}</section>`:'';
    host.innerHTML=`<div class="bd-magic-grid"><section class="bd-magic-card"><h3>উন্মুক্ত Dashboard</h3><div class="bd-magic-stats"><div class="bd-magic-stat"><strong>${bn(posts.length)}</strong><small>প্রকাশিত লেখা</small></div><div class="bd-magic-stat"><strong>${bn(posts.filter(x=>x.type==='poem').length)}</strong><small>কবিতা</small></div><div class="bd-magic-stat"><strong>${bn(people.followers.length)}</strong><small>Followers</small></div><div class="bd-magic-stat"><strong>${bn(people.following.length)}</strong><small>Following</small></div><div class="bd-magic-stat"><strong>${bn(friends.length)}</strong><small>পারস্পরিক বন্ধু</small></div><div class="bd-magic-stat"><strong>${bn(posts.filter(x=>x.type==='edited').length)}</strong><small>সম্পাদিত কাজ</small></div></div><div class="bd-public-connections"><details open><summary>Followers · ${bn(people.followers.length)}</summary><div class="bd-friend-grid">${peopleList(people.followers,'এখনও কোনো follower নেই।')}</div></details><details><summary>Following · ${bn(people.following.length)}</summary><div class="bd-friend-grid">${peopleList(people.following,'এখনও কাউকে follow করা হয়নি।')}</div></details></div></section><section class="bd-magic-card"><h3>ম্যাজিক টাচের ব্যক্তিগত অংশ</h3>${detailsVisible?`<h3 class="bd-subhead">বন্ধু তালিকা</h3><div class="bd-friend-grid">${peopleList(friends,'দুইজন পরস্পরকে follow করলে এখানে বন্ধু হিসেবে দেখা যাবে।')}</div><h3 class="bd-subhead">প্রিয় লেখক</h3><div class="bd-favorites">${favorites(pref.favorite_authors)}</div><h3 class="bd-subhead">প্রিয় কবিতা</h3><div class="bd-favorites">${favorites(pref.favorite_poems)}</div>`:'<div class="bd-fb-pending">মালিক এই অংশটি ব্যক্তিগত অথবা শুধু পারস্পরিক বন্ধুদের জন্য রেখেছেন। Dashboard, Followers ও Following সবার জন্য উন্মুক্ত।</div>'}${mine?`<form class="bd-magic-control" data-bd-magic-form><select name="visibility"><option value="public" ${pref.magic_visibility==='public'?'selected':''}>Public — সবাই দেখবে</option><option value="friends" ${pref.magic_visibility==='friends'?'selected':''}>Friends — পারস্পরিক বন্ধুরা</option><option value="private" ${pref.magic_visibility==='private'?'selected':''}>Private — শুধু আমি</option></select><input name="authors" value="${esc((pref.favorite_authors||[]).map(x=>typeof x==='string'?x:(x.name||x.title||'')).join(', '))}" placeholder="প্রিয় লেখক—কমা দিয়ে লিখুন"><input name="poems" value="${esc((pref.favorite_poems||[]).map(x=>typeof x==='string'?x:(x.title||x.name||'')).join(', '))}" placeholder="প্রিয় কবিতা—কমা দিয়ে লিখুন"><button class="bd-magic-save" type="submit">Magic Touch সংরক্ষণ</button></form>`:''}</section>${activity}</div>`;
  }
  async function saveMagic(form){const c=client();if(!c)throw new Error('Supabase সংযোগ প্রয়োজন');const authors=form.authors.value.split(',').map(x=>x.trim()).filter(Boolean),poems=form.poems.value.split(',').map(x=>x.trim()).filter(Boolean);const r=await c.from('profile_preferences').upsert({user_id:state.me.id,magic_visibility:form.visibility.value,favorite_authors:authors,favorite_poems:poems,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(r.error)throw r.error;toast('Magic Touch সংরক্ষিত হয়েছে');await openMagicDoor()}
  function profileFacebookEvents(){
    if(!['profile.html','founder-profile.html','admin-profile.html'].includes(page))return;
    D.addEventListener('click',async e=>{
      const view=e.target.closest('[data-view-as]');if(view){e.preventDefault();const on=D.body.classList.toggle('bd-view-as-mode');view.textContent=on?'← মালিক হিসেবে ফিরুন':'◉ View as';$$('[data-owner-only]').forEach(x=>x.hidden=on);$$('[data-visitor-only]').forEach(x=>x.hidden=!on);toast(on?'প্রোফাইল এখন দর্শকের মতো দেখাচ্ছে':'মালিকের নিয়ন্ত্রণ ফিরে এসেছে');return}
      const menu=e.target.closest('[data-profile-menu-toggle]');if(menu){e.preventDefault();e.stopPropagation();$('[data-profile-action-menu]')?.classList.toggle('open');return}
      if(!e.target.closest('[data-profile-action-menu]'))$('[data-profile-action-menu]')?.classList.remove('open');
    },true);
  }

  function touchEvents(){
    D.addEventListener('click',async e=>{try{if(e.target.closest('[data-bd-open-story]')){await openStoryDoor();return}if(e.target.closest('[data-bd-open-magic]')){await openMagicDoor();return}if(e.target.closest('[data-bd-close-door]')||e.target.classList.contains('bd-touch-door')){e.target.closest('.bd-touch-door')?.classList.remove('open');return}const sc=e.target.closest('[data-bd-story-id]');if(sc){await viewStory(sc.dataset.bdStoryId);return}const sr=e.target.closest('[data-bd-story-react]');if(sr){await reactStory(sr.dataset.story,sr.dataset.bdStoryReact);return}}catch(err){toast(err.message||'কাজটি সম্পন্ন হয়নি')}},true);
    D.addEventListener('submit',async e=>{try{const sf=e.target.closest('[data-bd-story-upload]');if(sf){e.preventDefault();await storyUpload(sf);return}const mf=e.target.closest('[data-bd-magic-form]');if(mf){e.preventDefault();await saveMagic(mf);return}}catch(err){toast(err.message||'সংরক্ষণ হয়নি')}},true);
  }

  // Cover photo drag/reposition editor.
  function coverEditor(){
    if(!['profile.html','founder-profile.html','admin-profile.html'].includes(page)||$('#bdCoverEditor'))return;const cover=$('[data-profile-cover]');if(!cover)return;
    const ownerBtn=$('[data-cover-file]')?.closest('label');if(ownerBtn)ownerBtn.insertAdjacentHTML('afterend','<button class="cover-edit bd-cover-reposition" type="button" data-bd-cover-reposition>↕ কভার ঠিক করুন</button>');
    D.body.insertAdjacentHTML('beforeend','<div class="bd-cover-editor" id="bdCoverEditor"><div class="bd-cover-editor-panel"><div class="bd-cover-stage"><img alt="কভার"></div><div class="bd-cover-editor-actions"><button data-bd-cover-reset>Reset</button><button data-bd-cover-cancel>বাতিল</button><button class="primary" data-bd-cover-save>সংরক্ষণ</button></div></div></div>');
    const editor=$('#bdCoverEditor'),stage=editor.querySelector('.bd-cover-stage'),img=editor.querySelector('img');let x=50,y=50,drag=null;
    const apply=()=>{stage.style.setProperty('--cover-x',x+'%');stage.style.setProperty('--cover-y',y+'%')};
    D.addEventListener('click',async e=>{if(e.target.closest('[data-bd-cover-reposition]')){const src=cover.querySelector('img')?.src;if(!src)return toast('আগে একটি কভার ছবি দিন');img.src=src;x=Number(state.profile?.cover_position_x||50);y=Number(state.profile?.cover_position_y||50);apply();editor.classList.add('open')}if(e.target.closest('[data-bd-cover-cancel]'))editor.classList.remove('open');if(e.target.closest('[data-bd-cover-reset]')){x=y=50;apply()}if(e.target.closest('[data-bd-cover-save]')){const c=client();if(c&&state.me){const r=await c.from('profiles').update({cover_position_x:x,cover_position_y:y,updated_at:new Date().toISOString()}).eq('id',state.me.id);if(r.error)return toast(r.error.message)}cover.style.backgroundPosition=`${x}% ${y}%`;const ci=cover.querySelector('img');if(ci)ci.style.objectPosition=`${x}% ${y}%`;editor.classList.remove('open');toast('কভার অবস্থান সংরক্ষিত হয়েছে')}},true);
    stage.addEventListener('pointerdown',e=>{drag={sx:e.clientX,sy:e.clientY,x,y};stage.setPointerCapture(e.pointerId)});stage.addEventListener('pointermove',e=>{if(!drag)return;x=Math.max(0,Math.min(100,drag.x+(e.clientX-drag.sx)/stage.clientWidth*100));y=Math.max(0,Math.min(100,drag.y+(e.clientY-drag.sy)/stage.clientHeight*100));apply()});stage.addEventListener('pointerup',()=>drag=null);stage.addEventListener('pointercancel',()=>drag=null);
  }

  // Message permission requests, 12-hour expiry and stable session.
  function setMessagePermission(result,person){
    const form=$('[data-message-form]'),input=$('[data-message-input]'),host=$('[data-messages]');let box=$('#bdMessagePermission');if(!box){box=D.createElement('div');box.id='bdMessagePermission';box.className='bd-message-pending';form?.parentNode?.insertBefore(box,form)}
    const status=result?.status||'pending',locked=status!=='accepted';if(input)input.disabled=locked;if(form)$$('button,input',form).forEach(x=>x.disabled=locked);
    if(status==='pending'){const until=result.expires_at?formatDate(result.expires_at):'১২ ঘণ্টা';box.hidden=false;box.textContent=`${person?.display_name||'এই সদস্য'}-এর অনুমতির অপেক্ষায়। অনুরোধ ${until} পর্যন্ত সক্রিয় থাকবে।`;if(host)host.innerHTML='<div class="msg-empty"><div><div style="font-size:52px">🔐</div><h2>বার্তার অনুমতি প্রয়োজন</h2><p>গ্রহণ না করা পর্যন্ত কোনো বার্তা পাঠানো যাবে না। ১২ ঘণ্টা পরে অনুরোধ স্বয়ংক্রিয়ভাবে বাতিল হবে।</p></div></div>'}
    else if(status==='blocked'){box.hidden=false;box.textContent=`${person?.display_name||'এই সদস্য'} বার্তার অনুমতি বন্ধ রেখেছেন।`;if(host)host.innerHTML='<div class="msg-empty"><div><div style="font-size:52px">⛔</div><h2>বার্তা পাঠানো যাবে না</h2><p>এই সদস্য কথোপকথনের অনুমতি বন্ধ রেখেছেন।</p></div></div>'}
    else{box.hidden=true;if(input)input.disabled=false;if(form)$$('button,input',form).forEach(x=>x.disabled=false)}
  }
  async function messageRequests(){
    if(page!=='messages.html'||!state.session)return;const c=client();if(!c)return;let host=$('#bdMessageRequests');if(!host){host=D.createElement('section');host.id='bdMessageRequests';host.className='bd-message-request-box';const list=$('[data-conversations]');list?.parentNode?.insertBefore(host,list)}
    try{await c.rpc('expire_message_requests');const r=await c.from('message_requests').select('*').eq('recipient_id',state.me.id).eq('status','pending').gt('expires_at',new Date().toISOString()).order('created_at',{ascending:false});if(r.error)throw r.error;const rows=r.data||[],pm=await authorProfiles(rows.map(x=>x.requester_id));host.hidden=!rows.length;host.innerHTML=rows.length?`<strong>বার্তার অনুমতি চেয়েছেন</strong>${rows.map(x=>{const p=pm.get(x.requester_id)||{display_name:'একজন সদস্য'};return `<div class="bd-message-request-row" data-request="${esc(x.id)}"><p><b>${esc(p.display_name)}</b><br>${esc(x.intro_message||'আপনার সঙ্গে কথা বলতে চান।')}<br><small>${formatDate(x.expires_at)} পর্যন্ত</small></p><div class="bd-message-request-actions"><button class="accept" data-bd-request-action="accept">গ্রহণ</button><button data-bd-request-action="decline">প্রত্যাখ্যান</button><button data-bd-request-action="block">Block</button></div></div>`}).join('')}`:''}catch(e){console.warn(e)}
  }
  async function respondRequest(id,decision){const c=client();if(!c)return;const r=await c.rpc('respond_to_message_request',{request_id:id,decision});if(r.error)throw r.error;toast(decision==='accept'?'বার্তার অনুমতি দেওয়া হয়েছে':'অনুরোধটি বন্ধ করা হয়েছে');await messageRequests()}
  function messageEvents(){D.addEventListener('click',async e=>{const b=e.target.closest('[data-bd-request-action]');if(!b)return;e.preventDefault();try{await respondRequest(b.closest('[data-request]').dataset.request,b.dataset.bdRequestAction)}catch(err){toast(err.message)}},true)}

  // Notification badge and realtime request/message notifications.
  async function notificationsBadge(){
    if(!state.session)return;const c=client();if(!c)return;try{const r=await c.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',state.me.id).eq('unread',true);const n=r.count||0;$$('a[href*="notifications.html"]').forEach(a=>{let b=a.querySelector('.bd-notification-badge');if(!b&&n){b=D.createElement('span');b.className='bd-notification-badge';a.appendChild(b)}if(b){b.textContent=new Intl.NumberFormat('bn-BD').format(n);b.hidden=!n}})}catch{}
  }
  function subscribeNotifications(){const c=client();if(!c||!state.session)return;try{const ch=c.channel('bd-master-notifications').on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:`user_id=eq.${state.me.id}`},notificationsBadge).on('postgres_changes',{event:'*',schema:'public',table:'message_requests',filter:`recipient_id=eq.${state.me.id}`},()=>{notificationsBadge();messageRequests()}).subscribe();state.channels.push(ch)}catch(e){console.warn(e)}}

  async function enhanceArchive(){
    if(page!=='archive.html'||!state.session)return;const c=client(),host=$('#archiveList');if(!c||!host)return;
    try{await c.rpc('archive_expired_stories');const [pr,sr]=await Promise.all([c.from('posts').select('id,title,type,category,created_at,updated_at,status').eq('author_id',state.me.id).eq('status','archived').order('updated_at',{ascending:false}),c.from('stories').select('*').eq('owner_id',state.me.id).or(`archived_at.not.is.null,expires_at.lte.${new Date().toISOString()}`).order('created_at',{ascending:false})]);if(pr.error)throw pr.error;if(sr.error)throw sr.error;const posts=pr.data||[],stories=sr.data||[];host.dataset.bdDbArchive='1';host.innerHTML=[...posts.map(x=>`<article class="bd-db-archive-row"><div><span class="bd-archive-kind">${esc(x.category||x.type||'পোস্ট')}</span><h3>${esc(x.title||'শিরোনামহীন লেখা')}</h3><small>${formatDate(x.created_at)}</small></div><div><button data-bd-restore-post="${esc(x.id)}">Restore</button><button class="danger" data-bd-delete-post="${esc(x.id)}">Delete</button></div></article>`),...stories.map(x=>`<article class="bd-db-archive-row"><div><span class="bd-archive-kind">Story</span><h3>${esc(x.caption||'আর্কাইভ স্টোরি')}</h3><small>${formatDate(x.created_at)}</small></div><div><button data-bd-restore-story="${esc(x.id)}">২৪ ঘণ্টার জন্য Restore</button><button class="danger" data-bd-delete-story="${esc(x.id)}">Delete</button></div></article>`)].join('')||'<div class="bd-fb-pending">আপনার Supabase archive এখন খালি।</div>';const pc=$('#archivedPostCount'),sc=$('#archivedStoryCount');if(pc)pc.textContent=new Intl.NumberFormat('bn-BD').format(posts.length);if(sc)sc.textContent=new Intl.NumberFormat('bn-BD').format(stories.length)}catch(e){console.warn('Archive:',e);host.insertAdjacentHTML('afterbegin','<div class="bd-fb-pending">Online archive লোড করা যায়নি; স্থানীয় archive নিচে রাখা হয়েছে।</div>')}
  }
  function archiveEvents(){D.addEventListener('click',async e=>{const rp=e.target.closest('[data-bd-restore-post]'),dp=e.target.closest('[data-bd-delete-post]'),rs=e.target.closest('[data-bd-restore-story]'),ds=e.target.closest('[data-bd-delete-story]');if(!rp&&!dp&&!rs&&!ds)return;e.preventDefault();e.stopImmediatePropagation();const c=client();if(!c)return;try{let r;if(rp)r=await c.from('posts').update({status:'published',deleted_at:null,updated_at:new Date().toISOString()}).eq('id',rp.dataset.bdRestorePost).eq('author_id',state.me.id);if(dp){if(!confirm('এই পোস্ট স্থায়ীভাবে মুছে ফেলবেন?'))return;r=await c.from('posts').delete().eq('id',dp.dataset.bdDeletePost).eq('author_id',state.me.id)}if(rs)r=await c.from('stories').update({archived_at:null,expires_at:new Date(Date.now()+86400000).toISOString()}).eq('id',rs.dataset.bdRestoreStory).eq('owner_id',state.me.id);if(ds){if(!confirm('এই Story স্থায়ীভাবে মুছে ফেলবেন?'))return;r=await c.from('stories').delete().eq('id',ds.dataset.bdDeleteStory).eq('owner_id',state.me.id)}if(r?.error)throw r.error;toast('Archive আপডেট হয়েছে');await enhanceArchive()}catch(err){toast(err.message||'Archive পরিবর্তন হয়নি')}},true)}
  async function enhanceSettings(){
    if(page!=='settings.html'||!state.session||$('#bdMasterSettings'))return;const c=client();if(!c)return;let pref={magic_visibility:'friends',story_archive_visibility:'private',message_permission_required:true,notification_preferences:{reactions:true,comments:true,follows:true,messages:true,stories:true}};try{const r=await c.from('profile_preferences').select('*').eq('user_id',state.me.id).maybeSingle();if(r.data)pref={...pref,...r.data,notification_preferences:{...pref.notification_preferences,...(r.data.notification_preferences||{})}}}catch{}
    const host=$('.center')||$('.center-wrap')||$('main');if(!host)return;const card=D.createElement('section');card.id='bdMasterSettings';card.className='glass hero bd-master-settings';card.innerHTML=`<h2>ব্যক্তিগত, Magic Touch ও বার্তা সেটিংস</h2><form data-bd-master-settings><label>Magic Touch visibility<select name="magic"><option value="public" ${pref.magic_visibility==='public'?'selected':''}>Public</option><option value="friends" ${pref.magic_visibility==='friends'?'selected':''}>পারস্পরিক বন্ধু</option><option value="private" ${pref.magic_visibility==='private'?'selected':''}>শুধু আমি</option></select></label><label>Story archive visibility<select name="story"><option value="public" ${pref.story_archive_visibility==='public'?'selected':''}>Public</option><option value="friends" ${pref.story_archive_visibility==='friends'?'selected':''}>পারস্পরিক বন্ধু</option><option value="private" ${pref.story_archive_visibility==='private'?'selected':''}>শুধু আমি</option></select></label><label class="bd-setting-lock"><input type="checkbox" checked disabled> নতুন কেউ বার্তা পাঠানোর আগে ১২ ঘণ্টার permission নেবে</label><fieldset><legend>Notification</legend>${[['reactions','Reaction'],['comments','Comment'],['follows','Follow'],['messages','Message'],['stories','Story']].map(([k,l])=>`<label><input type="checkbox" name="${k}" ${pref.notification_preferences[k]!==false?'checked':''}> ${l}</label>`).join('')}</fieldset><p>আপনি নিজে Logout না করা পর্যন্ত Supabase session নিরাপদে সংরক্ষিত ও auto-refresh থাকবে।</p><button class="more" type="submit">সেটিংস সংরক্ষণ</button></form>`;host.appendChild(card);
  }
  function settingsEvents(){D.addEventListener('submit',async e=>{const f=e.target.closest('[data-bd-master-settings]');if(!f)return;e.preventDefault();e.stopImmediatePropagation();const c=client();if(!c)return;const notifications={reactions:f.reactions.checked,comments:f.comments.checked,follows:f.follows.checked,messages:f.messages.checked,stories:f.stories.checked};const r=await c.from('profile_preferences').upsert({user_id:state.me.id,magic_visibility:f.magic.value,story_archive_visibility:f.story.value,message_permission_required:true,notification_preferences:notifications,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(r.error)return toast(r.error.message);toast('সেটিংস সংরক্ষিত হয়েছে')},true)}
  async function maintenance(){const c=client();if(!c)return;try{await c.rpc('archive_expired_stories');if(state.session)await c.rpc('expire_message_requests')}catch{}}

  function themeEvents(){D.addEventListener('click',async e=>{const mode=e.target.closest('[data-bd-mode]')?.dataset.bdMode;if(mode){D.documentElement.dataset.theme=mode;try{localStorage.setItem('bd-theme',mode);localStorage.setItem('bhubondangaTheme',mode)}catch{}const meta=$('meta[name="theme-color"]');if(meta)meta.content=mode==='dark'?'#07111f':'#f5f7fb'}const pal=e.target.closest('[data-bd-palette]')?.dataset.bdPalette;if(pal){D.documentElement.dataset.palette=pal;localStorage.setItem('bhubondangaGlassTheme',pal)}if(e.target.closest('[data-bd-logout]')){await client()?.auth.signOut({scope:'local'});localStorage.removeItem('bhubondangaCurrentUser');location.href='index.html'}},true)}
  function copyProtection(){D.addEventListener('contextmenu',e=>{if(e.target.closest('.post-body,.post-title,.post-card,[data-post-card]')&&!e.target.closest('input,textarea,[contenteditable=true]'))e.preventDefault()},true);D.addEventListener('copy',e=>{if(e.target.closest('.post-body,.post-title,.post-card,[data-post-card]')&&!e.target.closest('input,textarea,[contenteditable=true]')){e.preventDefault();toast('লেখকের অনুমতি ছাড়া এই লেখা কপি করা যাবে না')}} ,true)}
  function installObserver(){const obs=new MutationObserver(scheduleEnhance);obs.observe(D.documentElement,{subtree:true,childList:true});scheduleEnhance()}

  async function boot(){
    applyThemeLock();injectMasterStyles();installStabilityLock();await auth();if(!(await guard()))return;
    // make profile cover position available to editor
    if(['profile.html','founder-profile.html','admin-profile.html'].includes(page))state.profile=await targetProfile();
    await loadPromoBridge();renderSidebars();touchDoors();coverEditor();
    /* CANONICAL OWNERSHIP: feed.html is the ONLY Index owner for reaction/comment/reels/composer. */
    if(!INDEX_NATIVE_RUNTIME){socialEvents();crossMediaEvents();composerEvents();installObserver();subscribeSocial()}
    profileFacebookEvents();touchEvents();messageEvents();archiveEvents();settingsEvents();themeEvents();copyProtection();subscribeNotifications();await maintenance();await notificationsBadge();await messageRequests();await enhanceArchive();await enhanceSettings();setInterval(()=>maintenance().then(()=>{messageRequests();notificationsBadge()}),60000);
    W.addEventListener('pageshow',async e=>{if(e.persisted){await auth();notificationsBadge();scheduleEnhance()}});
    client()?.auth.onAuthStateChange?.((_event,session)=>{state.session=session;auth().then(()=>{renderSidebars();notificationsBadge()})});
  }
  W.BhubondangaMaster=Object.freeze({version:'8.0.0',canonical:true,indexDelegated:INDEX_NATIVE_RUNTIME,client,auth,toast,setMessagePermission,refreshPostSocial,react,openStoryDoor,openMagicDoor});
  W.__BD_MASTER_INDEX_DELEGATED__=INDEX_NATIVE_RUNTIME;
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>boot().catch(e=>{console.error(e);toast(e.message)}),{once:true});else boot().catch(e=>{console.error(e);toast(e.message)});
})();


/* =====================================================================
   BHUBONDANGA CANONICAL VISUAL LAYER — NIGHT SILVER / REACTION ART / COMPOSER STUDIO
   Visual consistency only. It does not create duplicate Index feeds, social owners, or scroll locks.
   ===================================================================== */
(() => {
  'use strict';
  if (window.__BD_V710__) return; window.__BD_V710__=1;
  const D=document,W=window,$=(s,c=D)=>c.querySelector(s),$$=(s,c=D)=>Array.from(c.querySelectorAll(s));
  const rx=['like','love','care','sad','haha','wow','angry'];
  const labels={like:'লাইক',love:'ভালোবাসা',care:'যত্ন',sad:'দুঃখ',haha:'হাহা',wow:'বিস্ময়',angry:'রাগ'};
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const client=()=>W.BhubondangaMaster?.client?.()||W.BhubondangaAuth?.client||W.bdSupabase||W.supabaseClient||null;
  const css=`
  :root{--bd7-night:#061223;--bd7-night2:#0a1c34;--bd7-card:#0d2441;--bd7-card2:#112c4b;--bd7-line:rgba(205,224,255,.15);--bd7-silver:#eef5ff;--bd7-muted:#aabbd2;--bd7-blue:#7fc7ff;--bd7-violet:#aa8cff}
  html[data-theme="dark"],html[data-bd-theme="dark"],body[data-theme="dark"]{color-scheme:dark;background:#061223!important}
  :is(html[data-theme="dark"],html[data-bd-theme="dark"],body[data-theme="dark"]) body{background:radial-gradient(circle at 50% -16%,rgba(89,113,202,.22),transparent 37%),linear-gradient(155deg,#061223 0%,#08182d 53%,#0b1730 100%)!important;color:#eef5ff!important}
  /* Dark means dark. Never allow pearl/white literary cards to survive in dark mode. */
  :is(html[data-theme="dark"],html[data-bd-theme="dark"],body[data-theme="dark"]) :is(.glass,.card,.post,.post-card,article[data-post],article[data-post-id],[data-post-card],[data-bd-post-id],.composer,.composer-body,.profile-card,.profile-hero,.hero,.panel,.widget,.side-card,.stat-card,.bd104-news-post,.style-pearl,.style-aurora,.style-lavender,[class*="style-tpl"],[class*="style-lite"],.bd58-template-preview,.bd-lite-template-preview,.bd7-literary-card){background:linear-gradient(145deg,rgba(13,36,65,.96),rgba(9,27,50,.97))!important;background-color:#0d2441!important;border-color:var(--bd7-line)!important;color:#eef5ff!important;box-shadow:0 14px 42px rgba(0,0,0,.22)!important}
  :is(html[data-theme="dark"],html[data-bd-theme="dark"],body[data-theme="dark"]) :is(.post-title,.post-body,.post-text,.body,h1,h2,h3,h4,h5,strong,b,.author-name,.bd7-literary-title,.bd7-literary-body){color:#f6f9ff!important;text-shadow:none!important}
  :is(html[data-theme="dark"],html[data-bd-theme="dark"],body[data-theme="dark"]) :is(p,small,time,.muted,.meta,.post-meta,.subtitle,.hint){color:#aebed4!important}
  :is(html[data-theme="dark"],html[data-bd-theme="dark"],body[data-theme="dark"]) :is(input,textarea,select){background:#0a1c34!important;color:#f6f9ff!important;border-color:rgba(211,227,255,.17)!important}
  :is(html[data-theme="dark"],html[data-bd-theme="dark"],body[data-theme="dark"]) ::placeholder{color:#7f94ae!important;opacity:1}

  /* V7.1: desktop layout is owned by the responsive controller below.
     Never globally clamp every .shell/.sidebar: that caused section/profile breakage. */
  @media(min-width:1021px){
    :is(.bd-master-edge,#bdMasterLeftEdge,#bdMasterRightEdge,#bdMasterDrawerShade){display:none!important}
  }
  @media(max-width:1020px){body{overflow-x:hidden!important}}

  /* Modern reaction art: actual SVG/IMG, never pseudo-question-mark sprites. */
  .bd31-r::before,.bd31-r::after,.bd64-icon::before,.bd64-icon::after,[class*="reaction"]::before,[class*="reaction"]::after{content:none!important;display:none!important}
  .bd7-rx-art,.bd52-reaction-img,.bd-master-rx-img{display:block!important;object-fit:contain!important;object-position:center!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;filter:none!important;clip-path:none!important;transform:none!important;pointer-events:none!important}
  .bd31-r .bd7-rx-art,.bd31-r .bd52-reaction-img,.bd31-r .bd-master-rx-img{width:31px!important;height:31px!important}
  .bd31-summary .bd7-rx-art,.bd-fb-summary .bd7-rx-art{width:22px!important;height:22px!important}
  .bd31-main-reaction,.bd31-r,.bd64-icon{overflow:visible!important;background:transparent!important;border-radius:0!important;clip-path:none!important}
  .bd31-social,.bd31-actions,.bd31-summary,.bd-fb-counts,.bd-facebook-action-row{overflow-anchor:none!important;contain:layout style!important}
  .bd31-action,.bd-fb-react-button,[data-bd31-react-main],[data-bd-react-main]{transform:none!important;animation:none!important;touch-action:manipulation!important}
  .bd31-action:active,.bd-fb-react-button:active,[data-bd31-react-main]:active,[data-bd-react-main]:active{transform:none!important}

  /* One compact literary card: title belongs inside; height follows <=10 lines. */
  .bd7-literary-parent{background:linear-gradient(145deg,rgba(12,34,61,.98),rgba(14,27,52,.98))!important;background-color:#0d2441!important;border-color:rgba(205,224,255,.15)!important;color:#f3f7ff!important}.bd7-literary-parent :is(.post-head,.author-meta,.post-title,.post-body,.post-text,h1,h2,h3,h4,strong,b){color:#f4f8ff!important}.bd7-literary-parent :is(small,time,.muted,.meta){color:#aabbd2!important}.bd7-literary-card{background:linear-gradient(145deg,rgba(10,29,53,.96),rgba(18,30,55,.96))!important;color:#f4f8ff!important;margin:10px 0 8px;padding:clamp(20px,4.4vw,38px);min-height:210px;max-height:430px;border:1px solid rgba(170,196,235,.20);border-radius:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:17px;overflow:hidden;transition:none!important}
  .bd7-literary-title{margin:0!important;font-size:clamp(20px,3.2vw,30px)!important;line-height:1.25!important;text-align:center!important;max-width:94%}
  .bd7-literary-title a{color:inherit!important;text-decoration:none!important}
  .bd7-literary-body{margin:0!important;white-space:pre-wrap!important;font-size:clamp(17px,2.35vw,22px)!important;line-height:1.78!important;text-align:center!important;max-width:min(92%,680px);display:block!important;overflow:visible!important;max-height:none!important}
  .bd7-normal-post .post-title,.bd7-normal-post .post-body{position:static!important;transform:none!important}

  /* Composer studio is hidden until writing starts. */
  .bd58-font-toolbar,.bd58-template-picker,.bd58-template-strip,.bd-lite-template-strip,#bd58FontToolbar,#bd58TemplatePicker,[id*="font-template-system"],[id*="bd58Template"],[id*="bd58Font"]{display:none!important}
  .bd7-studio{display:none;margin:10px 0 12px;padding:12px;border:1px solid rgba(170,198,235,.18);border-radius:17px;background:linear-gradient(145deg,rgba(12,32,58,.94),rgba(18,38,69,.93));color:#edf5ff}
  .bd7-studio.open{display:block}
  .bd7-studio-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px}.bd7-studio-head strong{font-size:14px}.bd7-studio-head small{color:#a9bad0}
  .bd7-card-strip{display:flex;gap:10px;overflow-x:auto;overscroll-behavior-inline:contain;scroll-snap-type:x proximity;padding:3px 2px 9px;-webkit-overflow-scrolling:touch;touch-action:pan-x}.bd7-card-strip::-webkit-scrollbar{height:4px}
  .bd7-card-option{flex:0 0 116px;height:76px;border-radius:15px;border:1px solid rgba(207,224,255,.18);background:linear-gradient(145deg,#0e2847,#142f51);color:#dce9f8;display:flex;align-items:end;padding:9px;font-weight:800;scroll-snap-align:start;user-select:none}.bd7-card-option[data-style="aurora"]{background:radial-gradient(circle at 25% 15%,rgba(122,119,255,.36),transparent 40%),linear-gradient(145deg,#0d2747,#15234a)}.bd7-card-option[data-style="lavender"]{background:linear-gradient(145deg,#17284b,#312657)}.bd7-card-option[data-style="blue"]{background:linear-gradient(145deg,#092c50,#113a5f)}.bd7-card-option[data-style="ink"]{background:linear-gradient(145deg,#08131f,#18283c)}.bd7-card-option[data-style="mist"]{background:linear-gradient(145deg,#12314b,#1b3859)}.bd7-card-option[data-style="midnight"]{background:linear-gradient(145deg,#091329,#1a1743)}.bd7-card-option[data-style="normal"]{background:linear-gradient(145deg,#0b1b30,#10243d)}.bd7-card-option.selected{outline:2px solid #b9d9ff;outline-offset:2px}
  .bd7-font-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding-top:7px}.bd7-font-row select,.bd7-code-row input{min-height:42px;border:1px solid rgba(202,222,255,.16);border-radius:12px;background:#0a1c34;color:#f4f8ff;padding:0 11px}.bd7-font-row button,.bd7-code-row button{min-height:42px;border-radius:12px;border:1px solid rgba(202,222,255,.18);background:#112c4b;color:#f4f8ff;padding:0 13px;font-weight:800}.bd7-code-row{display:flex;gap:7px;flex-wrap:wrap;padding-top:8px}.bd7-code-row input{flex:1;min-width:170px}.bd7-font-upload{display:none}
  .bd7-lines{margin-left:auto;color:#9fb3cc;font-size:12px}.bd7-lines.warn{color:#ffd28a}
  .bd7-winner-strip{margin:0 0 12px;padding:10px 13px;border:1px solid rgba(211,226,255,.16);border-radius:15px;background:linear-gradient(135deg,rgba(157,177,209,.12),rgba(90,121,176,.10));display:flex;gap:9px;align-items:center;color:inherit}.bd7-winner-medal{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#f6fbff,#9eafc7);color:#0a1730;font-weight:1000}.bd7-month-medal{display:inline-flex;align-items:center;gap:4px;margin-left:5px;padding:2px 7px;border-radius:999px;background:rgba(214,228,250,.13);border:1px solid rgba(214,228,250,.20);font-size:10px;color:#dceaff}
  .bd7-notice-focus{outline:2px solid rgba(127,199,255,.72)!important;outline-offset:4px!important}
  `;
  const style=D.createElement('style');style.id='bd-v710-lock';style.textContent=css;D.head.appendChild(style);

  function keyFrom(el){
    if(!el)return''; const d=el.dataset||{}; let k=d.bdReaction||d.bd31TrayPick||d.pick||d.bd24Pick||d.bd64Pick||d.reaction||d.react||'';
    if(rx.includes(k))return k;
    const c=String(el.className||''); for(const x of rx)if(new RegExp('(?:^|[-_ ])'+x+'(?:$|[-_ ])','i').test(c))return x;
    const t=(el.getAttribute?.('title')||el.getAttribute?.('aria-label')||el.textContent||'').toLowerCase();
    const pairs={like:/লাইক|like/,love:/ভালোবাসা|love|heart/,care:/যত্ন|care/,sad:/দুঃখ|sad/,haha:/হাহা|haha|laugh/,wow:/বিস্ময়|wow/,angry:/রাগ|angry/};
    return rx.find(x=>pairs[x].test(t))||'';
  }
  function art(k,cls=''){const src=W.BD52_REACTION_SRC?.[k];return src?`<img class="bd7-rx-art ${cls}" src="${src}" alt="${labels[k]||''}" draggable="false" decoding="async">`:''}
  function repairReactionArt(root=D){
    const candidates=$$('.bd31-r,[data-bd31-tray-pick],[data-pick],[data-bd-reaction],[data-bd24-pick],[data-bd64-pick],.bd31-main-reaction',root);
    for(const el of candidates){const k=keyFrom(el)||keyFrom(el.closest?.('[data-reaction],[class*="reaction"]'));if(!k)continue;const holder=el.matches('.bd31-main-reaction')?el:(el.querySelector('.bd31-r,.bd64-icon')||el);const img=holder.querySelector('img.bd7-rx-art,img.bd52-reaction-img,img.bd-master-rx-img');if(img){if(W.BD52_REACTION_SRC?.[k]&&img.src!==W.BD52_REACTION_SRC[k])img.src=W.BD52_REACTION_SRC[k];continue}const a=art(k);if(a){if(holder.children.length===0||/^[?\s\uFFFD❤️👍🥰😢😂😮😡]+$/.test(holder.textContent||''))holder.innerHTML=a;else holder.insertAdjacentHTML('afterbegin',a)}}
  }
  let raf=0;function scheduleRepair(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;repairReactionArt();if(page!=='index.html')normalizeLiteraryCards()})}

  function postCard(el){return el?.closest?.('article[data-post],article[data-post-id],.post-card[data-post-id],[data-bd-post-id],[data-post-card],article.post')||null}
  function postId(card){return String(card?.dataset?.bdPostId||card?.dataset?.postId||card?.dataset?.post||card?.getAttribute?.('data-post-id')||card?.getAttribute?.('data-post')||'')}

  /* CANONICAL: VISUAL-ONLY reaction layer.
     Do not capture native reaction clicks here. The page's canonical social engine owns
     tap/hold/select/double-tap so one gesture can never reach two reaction engines. */

  async function recordShare(id,channel='native'){const c=client();if(!c||!id)return;try{await c.rpc('record_post_share',{target_post:String(id),share_channel:String(channel)})}catch{}}
  W.addEventListener('click',e=>{const b=e.target.closest?.('[data-action="share"],[data-live-share],[data-bd31-share],[data-bd-share]');if(!b)return;const card=postCard(b),id=postId(card);if(id)recordShare(id,navigator.share?'native':'copy')},true);

  /* Real post view counter: once per tab/session per post, after meaningful visibility. */
  const seen=new Set(); let io;
  function installViews(){if(io||!('IntersectionObserver'in W))return;io=new IntersectionObserver(entries=>{for(const en of entries){if(!en.isIntersecting||en.intersectionRatio<.55)continue;const c=en.target,id=postId(c);if(!id||seen.has(id))continue;seen.add(id);setTimeout(async()=>{if(!c.isConnected)return;const r=c.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;try{await client()?.rpc('record_post_view',{target_post:String(id),viewer_key:'session:'+((W.__BD_LIVE_SESSION?.user?.id)||(()=>{let k=sessionStorage.getItem('bd7-viewer');if(!k){k=(crypto.randomUUID&&crypto.randomUUID())||String(Date.now());sessionStorage.setItem('bd7-viewer',k)}return k})())})}catch{}},700)}} ,{threshold:[.55]});$$('article[data-post],article[data-post-id],.post-card[data-post-id],[data-bd-post-id],[data-post-card]').forEach(x=>io.observe(x))}

  const CARD_STYLES=[['normal','সাধারণ'],['blue','নীল কাচ'],['aurora','অরোরা'],['lavender','ল্যাভেন্ডার'],['ink','কালি রাত'],['mist','ব্লু মিস্ট'],['midnight','মধ্যরাত']];
  const fontState={key:'site',url:'',family:'inherit',allowed:false,loaded:false};
  W.BD7ComposeFontKey=()=>fontState.key; W.BD7ComposeFontUrl=()=>fontState.url;
  const oldCompose=W.BD58ComposeStyle;
  W.BD58ComposeStyle=(ctx)=>{const f=$('#composerForm');if(f?.dataset.bd7CardStyle)return f.dataset.bd7CardStyle;return oldCompose?oldCompose(ctx):'normal'};
  function countLines(text){const raw=String(text||'').trim();if(!raw)return 0;let n=0;for(const line of raw.split(/\n/))n+=Math.max(1,Math.ceil([...line].length/44));return n}
  function studioForm(){return $('#composerForm')}
  async function resolveFontAccess(){const c=client();const role=String(W.__BD_IDENTITY?.role||'').toLowerCase();if(['founder','admin'].includes(role)){fontState.allowed=true;return true}try{const r=await c?.rpc('get_my_font_access');fontState.allowed=!!(r?.data?.allowed??r?.data===true);return fontState.allowed}catch{return false}}
  async function loadMyFonts(select){if(fontState.loaded||!fontState.allowed)return;fontState.loaded=true;const c=client(),uid=W.__BD_LIVE_SESSION?.user?.id||W.BhubondangaAuth?.session?.user?.id;if(!c||!uid)return;try{const r=await c.from('user_fonts').select('id,font_name,font_family,font_url').eq('user_id',uid).eq('active',true).order('created_at',{ascending:false});for(const x of r.data||[]){const o=D.createElement('option');o.value='user:'+x.id;o.textContent=x.font_name||x.font_family||'নিজস্ব ফন্ট';o.dataset.url=x.font_url||'';o.dataset.family=x.font_family||x.font_name||'CustomFont';select.appendChild(o)}}catch{}}
  async function uploadFont(file,select){if(!file||!fontState.allowed)return;const c=client(),uid=W.__BD_LIVE_SESSION?.user?.id||W.BhubondangaAuth?.session?.user?.id;if(!c||!uid)return;const ext=(file.name.split('.').pop()||'woff2').toLowerCase();if(!['woff','woff2','ttf','otf'].includes(ext))return alert('WOFF/WOFF2/TTF/OTF ফন্ট দিন');const path=`${uid}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;const up=await c.storage.from('user-fonts').upload(path,file,{upsert:false,contentType:file.type||undefined});if(up.error)return alert(up.error.message);const pub=c.storage.from('user-fonts').getPublicUrl(path).data.publicUrl;const fam='BDCustom'+Date.now();const ins=await c.from('user_fonts').insert({user_id:uid,font_name:file.name.replace(/\.[^.]+$/,''),font_family:fam,font_url:pub,storage_path:path,active:true}).select().single();if(ins.error)return alert(ins.error.message);fontState.loaded=false;await loadMyFonts(select);select.value='user:'+ins.data.id;select.dispatchEvent(new Event('change',{bubbles:true}))}
  function buildStudio(){const form=studioForm();if(!form||$('#bd7ComposerStudio'))return;form.dataset.bd7CardStyle='normal';const box=D.createElement('section');box.id='bd7ComposerStudio';box.className='bd7-studio';box.innerHTML=`<div class="bd7-studio-head"><strong>লেখার কার্ড ও ফন্ট</strong><span class="bd7-lines">০/১০ লাইন</span></div><div class="bd7-card-strip" aria-label="কার্ড বাছাই">${CARD_STYLES.map(([k,l],i)=>`<button type="button" class="bd7-card-option ${i?'':'selected'}" data-style="${k}">${l}</button>`).join('')}</div><div class="bd7-font-row"><select id="bd7Font"><option value="site">সাইটের মূল ফন্ট</option><option value="serif">বাংলা সেরিফ</option><option value="sans">বাংলা স্যান্স</option></select><button type="button" id="bd7UploadBtn" hidden>নিজস্ব ফন্ট যোগ করুন</button><input class="bd7-font-upload" id="bd7FontFile" type="file" accept=".woff,.woff2,.ttf,.otf"></div><div class="bd7-code-row" id="bd7CodeRow"><input id="bd7AccessCode" placeholder="ফন্ট অ্যাপ্রুভাল কোড"><button type="button" id="bd7Redeem">কোড চালু করুন</button></div>`;
    const first=form.firstElementChild;form.insertBefore(box,first||null);
    const body=$('#postBody'),title=$('#postTitle'),sel=$('#bd7Font'),fontRow=box.querySelector('.bd7-font-row'),upload=$('#bd7UploadBtn'),file=$('#bd7FontFile'),codeRow=$('#bd7CodeRow');fontRow.hidden=true;
    let drag=false,startX=0;const strip=box.querySelector('.bd7-card-strip');strip.addEventListener('pointerdown',e=>{drag=false;startX=e.clientX},{passive:true});strip.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-startX)>8)drag=true},{passive:true});strip.addEventListener('click',e=>{const b=e.target.closest('.bd7-card-option');if(!b||drag){drag=false;e.preventDefault();return}strip.querySelectorAll('.bd7-card-option').forEach(x=>x.classList.toggle('selected',x===b));form.dataset.bd7CardStyle=b.dataset.style;previewCard(b.dataset.style)},true);
    function previewCard(styleKey){for(const el of [body,title])if(el)el.dataset.bd7Preview=styleKey}
    function lineUpdate(){const n=countLines(body?.value);const l=box.querySelector('.bd7-lines');l.textContent=`${Math.min(n,10)}/১০ লাইন${n>10?' — সাধারণ পোস্ট':''}`;l.classList.toggle('warn',n>10);if(n>10){form.dataset.bd7CardStyle='normal';strip.querySelectorAll('.bd7-card-option').forEach(x=>x.classList.toggle('selected',x.dataset.style==='normal'))}}
    body?.addEventListener('input',lineUpdate);lineUpdate();
    const open=async()=>{box.classList.add('open');const ok=await resolveFontAccess();fontRow.hidden=!ok;upload.hidden=!ok;codeRow.hidden=ok;if(ok)await loadMyFonts(sel)};for(const x of [body,title])x?.addEventListener('focus',open,{once:false});$('#composerPrompt')?.addEventListener('click',()=>setTimeout(open,0));
    sel.addEventListener('change',()=>{const o=sel.selectedOptions[0],v=sel.value;let fam='inherit',url='';if(v==='serif')fam='"Noto Serif Bengali",serif';else if(v==='sans')fam='"Noto Sans Bengali",sans-serif';else if(v.startsWith('user:')){url=o.dataset.url||'';fam=o.dataset.family||('BDUser'+v.slice(5));if(url){const st=D.createElement('style');st.textContent=`@font-face{font-family:${JSON.stringify(fam)};src:url(${JSON.stringify(url)}) format("woff2");font-display:swap}`;D.head.appendChild(st)}}fontState.key=v;fontState.url=url;fontState.family=fam;for(const x of [body,title])if(x)x.style.fontFamily=fam});
    upload.addEventListener('click',()=>file.click());file.addEventListener('change',()=>uploadFont(file.files?.[0],sel));
    $('#bd7Redeem')?.addEventListener('click',async()=>{const code=$('#bd7AccessCode')?.value.trim();if(!code)return;const c=client();const r=await c?.rpc('redeem_font_access_code',{p_code:code});if(r?.error)return alert(r.error.message);fontState.allowed=true;fontState.loaded=false;fontRow.hidden=false;upload.hidden=false;codeRow.hidden=true;await loadMyFonts(sel);alert('ফন্ট অ্যাক্সেস চালু হয়েছে')});
  }

  function normalizeLiteraryCards(){
    const cards=$$('article[data-post],article[data-post-id],.post-card[data-post-id],[data-bd-post-id],[data-post-card],article.post');
    for(const card of cards){if(card.classList.contains('bd104-news-post')||card.dataset.bd7CardDone==='normal')continue;const body=card.querySelector('.post-body,.body,.post-text');const title=card.querySelector('.post-title');if(!body||!title)continue;const n=countLines(body.textContent);if(n>10){card.classList.add('bd7-normal-post');card.dataset.bd7CardDone='normal';continue}if(card.querySelector(':scope > .bd7-literary-card'))continue;const styleName=(card.className.match(/style-([\w-]+)/)||[])[1]||'';if(!styleName||/none|plain|normal/.test(styleName))continue;const wrap=D.createElement('div');wrap.className='bd7-literary-card';title.parentNode.insertBefore(wrap,title);wrap.append(title);wrap.append(body);title.classList.add('bd7-literary-title');body.classList.add('bd7-literary-body');card.classList.add('bd7-literary-parent');card.dataset.bd7CardDone='card'}
  }

  async function monthlyWinner(){const c=client();if(!c)return;try{await c.rpc('refresh_monthly_contributor_award')}catch{}try{const r=await c.from('monthly_contributor_awards').select('*').order('month_start',{ascending:false}).limit(1).maybeSingle();const x=r.data;if(!x)return;const center=$('.center-col,.profile-center,.center-feed,.center');if(center&&!$('#bd7WinnerStrip')&&['index.html','profile.html','founder-profile.html','admin-profile.html'].includes(page)){const s=D.createElement('div');s.id='bd7WinnerStrip';s.className='bd7-winner-strip';s.innerHTML=`<span class="bd7-winner-medal">1</span><span><b>মাসের সাহিত্য-সহযোগী</b><br><small>${String(x.winner_name||x.winner_username||'সদস্য')} · ${Number(x.contribution_count||0)} সম্পাদনা/সংযোজন</small></span>`;const composer=$('#composer');(composer?.parentNode||center).insertBefore(s,composer?.nextSibling||center.firstChild)}const uname=String(x.winner_username||'').replace(/^@/,'').toLowerCase();if(uname){$$('a[href*="profile"]').forEach(a=>{const h=decodeURIComponent(a.getAttribute('href')||'').toLowerCase();if(!h.includes(uname)||a.parentElement?.querySelector('.bd7-month-medal'))return;a.insertAdjacentHTML('afterend','<span class="bd7-month-medal">◇ মাসের সেরা</span>')})}}catch{}}

  function deepLink(){const id=new URLSearchParams(location.search).get('post');if(!id)return;let tries=0;const go=()=>{const card=$(`[data-bd-post-id="${CSS.escape(id)}"],[data-post-id="${CSS.escape(id)}"],[data-post="${CSS.escape(id)}"]`);if(card){card.scrollIntoView({block:'center',behavior:'auto'});card.classList.add('bd7-notice-focus');setTimeout(()=>card.classList.remove('bd7-notice-focus'),2200);return}if(++tries<20)setTimeout(go,250)};setTimeout(go,350)}

  function boot7(){if(page!=='index.html'){buildStudio();normalizeLiteraryCards()}repairReactionArt();installViews();monthlyWinner();deepLink();const mo=new MutationObserver(()=>{scheduleRepair();installViews()});mo.observe(D.body||D.documentElement,{subtree:true,childList:true});}
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot7,{once:true});else boot7();
})();


/* V7.1 custom-font hydration: one batched DB read for newly rendered cards. */
(() => {
  'use strict';
  const D=document,W=window,done=new Set(),faceDone=new Set(); let timer=0;
  const client=()=>W.BhubondangaMaster?.client?.()||W.BhubondangaAuth?.client||null;
  const cards=()=>Array.from(D.querySelectorAll('article[data-post],article[data-post-id],.post-card[data-post-id],[data-bd-post-id],[data-post-card]'));
  const idOf=c=>String(c.dataset.bdPostId||c.dataset.postId||c.dataset.post||c.getAttribute('data-post-id')||c.getAttribute('data-post')||'');
  function apply(c,key,url){if(!c||!url)return;const fam='BDPostFont_'+String(key||idOf(c)).replace(/[^a-zA-Z0-9_-]/g,'_');if(!faceDone.has(url)){faceDone.add(url);const st=D.createElement('style');st.textContent=`@font-face{font-family:${JSON.stringify(fam)};src:url(${JSON.stringify(url)});font-display:swap}`;D.head.appendChild(st)}c.style.setProperty('--bd7-post-font',fam);c.querySelectorAll('.post-title,.post-body,.bd7-literary-title,.bd7-literary-body').forEach(x=>x.style.setProperty('font-family',fam,'important'))}
  async function hydrate(){timer=0;const batch=[];for(const c of cards()){const id=idOf(c);if(!id||done.has(id))continue;const u=c.dataset.fontUrl||'';if(u){done.add(id);apply(c,c.dataset.fontKey,u)}else batch.push([id,c])}if(!batch.length)return;const c=client();if(!c)return;const ids=batch.map(x=>x[0]).slice(0,80);try{const r=await c.from('posts').select('id,font_key,font_url').in('id',ids);const map=new Map((r.data||[]).map(x=>[String(x.id),x]));for(const [id,el] of batch){if(!ids.includes(id))continue;done.add(id);const x=map.get(id);if(x?.font_url){el.dataset.fontKey=x.font_key||'';el.dataset.fontUrl=x.font_url;apply(el,x.font_key,x.font_url)}}}catch{}}
  function schedule(){clearTimeout(timer);timer=setTimeout(hydrate,180)}
  const boot=()=>{hydrate();new MutationObserver(schedule).observe(D.body,{subtree:true,childList:true})};
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


/* =====================================================================
   BHUBONDANGA MASTER V7.1 — DESKTOP RESPONSIVE ENGINE
   Scope: injected Index-style rails on cross pages only.
   Mobile/native profile layouts remain owned by their page CSS.
   ===================================================================== */
(() => {
  'use strict';
  if (window.__BD_MASTER_DESKTOP_710__) return;
  window.__BD_MASTER_DESKTOP_710__ = 1;
  const D=document,W=window;
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const style=D.createElement('style');
  style.id='bd-master-desktop-v710';
  style.textContent=`
  :root{
    --bd710-side-card:rgba(255,255,255,.88);
    --bd710-side-line:rgba(103,124,176,.18);
    --bd710-side-text:var(--text,#203753);
    --bd710-side-soft:var(--text-soft,var(--soft,#677991));
    --bd710-side-shadow:0 12px 28px rgba(33,52,95,.09),inset 0 1px 0 rgba(255,255,255,.76);
  }
  html[data-theme="dark"]{
    --bd710-side-card:rgba(13,34,61,.97);
    --bd710-side-line:rgba(173,197,237,.16);
    --bd710-side-text:#eff6ff;
    --bd710-side-soft:#9fb2ca;
    --bd710-side-shadow:0 15px 36px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.045);
  }

  /* The copied sidebar now carries its own complete styling on EVERY page. */
  .bd-index-sidebar-copy{box-sizing:border-box!important;min-width:0!important;max-width:none!important;overflow-x:hidden!important;contain:inline-size!important}
  .bd-index-sidebar-copy *{box-sizing:border-box}
  .bd-index-sidebar-copy img{max-width:100%}
  .bd-index-sidebar-copy .bd9-sidebar-stack{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:9px!important;min-width:0!important;width:100%!important;padding:0 1px 10px!important}
  .bd-index-sidebar-copy .bd9-card{width:100%!important;min-width:0!important;max-width:100%!important;margin:0!important;padding:10px!important;overflow:hidden!important;border:1px solid var(--bd710-side-line)!important;border-radius:16px!important;background:linear-gradient(155deg,var(--bd710-side-card),rgba(239,246,255,.76))!important;color:var(--bd710-side-text)!important;box-shadow:var(--bd710-side-shadow)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
  html[data-theme="dark"] .bd-index-sidebar-copy .bd9-card{background:linear-gradient(155deg,rgba(15,37,65,.98),rgba(8,25,47,.98) 58%,rgba(20,25,52,.96))!important}
  .bd-index-sidebar-copy .bd9-identity{text-align:center!important;padding:12px 10px!important}
  .bd-index-sidebar-copy .bd9-leaf{width:44px!important;height:44px!important;margin:0 auto 6px!important;border-radius:14px!important;display:grid!important;place-items:center!important;background:rgba(255,255,255,.72)!important;font:27px/1 "Apple Color Emoji","Segoe UI Emoji",sans-serif!important;text-decoration:none!important}
  html[data-theme="dark"] .bd-index-sidebar-copy .bd9-leaf{background:rgba(25,48,72,.82)!important}
  .bd-index-sidebar-copy .bd9-identity h3{margin:0!important;font-size:16px!important;line-height:1.25!important}.bd-index-sidebar-copy .bd9-identity h3 a{color:inherit!important;text-decoration:none!important}
  .bd-index-sidebar-copy .bd9-identity p{margin:4px 0 0!important;color:var(--bd710-side-soft)!important;font-size:9px!important;line-height:1.55!important}
  .bd-index-sidebar-copy .bd9-quote{margin-top:8px!important;padding:7px 8px!important;border-left:3px solid var(--primary,#7a7fdc)!important;border-radius:0 9px 9px 0!important;background:rgba(122,127,220,.075)!important;color:var(--bd710-side-soft)!important;font-size:8px!important;line-height:1.55!important;text-align:left!important}
  .bd-index-sidebar-copy .bd9-title{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:7px!important;margin-bottom:6px!important}.bd-index-sidebar-copy .bd9-title h3{margin:0!important;font-size:11px!important;line-height:1.3!important}.bd-index-sidebar-copy .bd9-title small{color:var(--bd710-side-soft)!important;font-size:7px!important}
  .bd-index-sidebar-copy .bd9-menu{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:4px!important}
  .bd-index-sidebar-copy .bd9-menu a,.bd-index-sidebar-copy .bd9-menu button{width:100%!important;min-width:0!important;min-height:39px!important;padding:5px 7px!important;border:1px solid rgba(111,129,178,.13)!important;border-radius:10px!important;display:grid!important;grid-template-columns:28px minmax(0,1fr) auto!important;align-items:center!important;gap:7px!important;background:rgba(255,255,255,.55)!important;color:var(--bd710-side-soft)!important;text-decoration:none!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.60)!important;font-size:8.8px!important;text-align:left!important;overflow:hidden!important}
  html[data-theme="dark"] .bd-index-sidebar-copy .bd9-menu a,html[data-theme="dark"] .bd-index-sidebar-copy .bd9-menu button{background:rgba(18,39,67,.72)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important}
  .bd-index-sidebar-copy .bd9-menu span:first-child{width:28px!important;height:28px!important;min-width:28px!important;border-radius:8px!important;display:grid!important;place-items:center!important;font-size:12px!important;overflow:hidden!important}.bd-index-sidebar-copy .bd9-menu b{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}.bd-index-sidebar-copy .bd9-menu i{font-style:normal!important}
  .bd-index-sidebar-copy .bd9-palettes{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important}.bd-index-sidebar-copy .bd9-modes{margin-top:5px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important}
  .bd-index-sidebar-copy .bd9-palettes button,.bd-index-sidebar-copy .bd9-modes button{min-width:0!important;min-height:32px!important;padding:5px!important;border:1px solid var(--bd710-side-line)!important;border-radius:9px!important;background:rgba(255,255,255,.54)!important;color:var(--bd710-side-soft)!important;font-size:7.7px!important;font-weight:800!important;white-space:normal!important}
  html[data-theme="dark"] .bd-index-sidebar-copy .bd9-palettes button,html[data-theme="dark"] .bd-index-sidebar-copy .bd9-modes button{background:rgba(21,43,73,.82)!important}
  .bd-index-sidebar-copy .bd9-contact a{display:block!important;color:var(--primary,#7a7fdc)!important;font-size:8.5px!important;font-weight:800!important;line-height:1.65!important;text-decoration:none!important}.bd-index-sidebar-copy .bd9-note,.bd-index-sidebar-copy .bd9-empty{color:var(--bd710-side-soft)!important;font-size:8px!important;line-height:1.65!important}.bd-index-sidebar-copy .bd9-writers{display:grid!important;gap:5px!important}

  /* Critical fix: profile photos in copied rails are AVATARS, never rail backgrounds. */
  .bd-index-sidebar-copy .bd-master-account{display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;grid-auto-rows:auto!important;column-gap:9px!important;row-gap:2px!important;align-items:center!important;text-align:left!important;min-width:0!important}
  .bd-index-sidebar-copy .bd-master-account-avatar{grid-column:1!important;grid-row:1 / span 2!important;width:48px!important;height:48px!important;min-width:48px!important;max-width:48px!important;min-height:48px!important;max-height:48px!important;aspect-ratio:1/1!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:linear-gradient(135deg,#657bd8,#8a68d6)!important;color:#fff!important;font-size:18px!important;line-height:1!important}
  .bd-index-sidebar-copy .bd-master-account-avatar>img,.bd-index-sidebar-copy img.bd-master-account-avatar{display:block!important;width:48px!important;height:48px!important;min-width:48px!important;max-width:48px!important;min-height:48px!important;max-height:48px!important;aspect-ratio:1/1!important;object-fit:cover!important;object-position:center!important;border-radius:50%!important;margin:0!important;padding:0!important;position:static!important;inset:auto!important;transform:none!important}
  .bd-index-sidebar-copy .bd-master-account>h3{grid-column:2!important;margin:0!important;min-width:0!important;font-size:11px!important;line-height:1.3!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;color:var(--bd710-side-text)!important}.bd-index-sidebar-copy .bd-master-account>p{grid-column:2!important;margin:0!important;min-width:0!important;color:var(--bd710-side-soft)!important;font-size:7.5px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  .bd-index-sidebar-copy .bd-master-actions,.bd-index-sidebar-copy .bd-master-shortcuts{grid-column:1 / -1!important;width:100%!important;margin-top:7px!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important}.bd-index-sidebar-copy .bd-master-actions a,.bd-index-sidebar-copy .bd-master-shortcuts a{min-width:0!important;min-height:32px!important;border:1px solid var(--bd710-side-line)!important;border-radius:9px!important;display:grid!important;place-items:center!important;padding:5px!important;color:var(--bd710-side-text)!important;text-decoration:none!important;font-size:8px!important;font-weight:800!important;text-align:center!important;background:rgba(255,255,255,.40)!important}.bd-index-sidebar-copy .bd-master-actions a.primary{background:linear-gradient(135deg,var(--primary,#777bda),var(--primary-2,#9e78df))!important;color:#fff!important;border-color:transparent!important}
  html[data-theme="dark"] .bd-index-sidebar-copy .bd-master-actions a,html[data-theme="dark"] .bd-index-sidebar-copy .bd-master-shortcuts a{background:rgba(20,43,73,.74)!important}
  .bd-index-sidebar-copy .bd-master-logout{grid-column:1 / -1!important;width:100%!important;min-height:32px!important;margin-top:5px!important;border:1px solid rgba(224,110,130,.22)!important;border-radius:9px!important;background:rgba(196,76,99,.08)!important;color:#cc5872!important;font-size:8px!important;font-weight:800!important}

  .bd-index-sidebar-copy .bd-master-writer{width:100%!important;min-width:0!important;display:grid!important;grid-template-columns:34px minmax(0,1fr) 8px!important;gap:8px!important;align-items:center!important;padding:6px!important;border:1px solid rgba(111,129,178,.11)!important;border-radius:11px!important;background:rgba(255,255,255,.36)!important;color:inherit!important;text-decoration:none!important;overflow:hidden!important}.bd-index-sidebar-copy .bd-master-writer-avatar{width:34px!important;height:34px!important;min-width:34px!important;max-width:34px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:linear-gradient(135deg,#6680d7,#8b6bd7)!important;color:#fff!important;font-size:12px!important}.bd-index-sidebar-copy .bd-master-writer-avatar>img,.bd-index-sidebar-copy img.bd-master-writer-avatar{width:34px!important;height:34px!important;min-width:34px!important;max-width:34px!important;object-fit:cover!important;object-position:center!important;border-radius:50%!important;position:static!important;transform:none!important}.bd-index-sidebar-copy .bd-master-writer>span{min-width:0!important}.bd-index-sidebar-copy .bd-master-writer strong{display:block!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:8.8px!important}.bd-index-sidebar-copy .bd-master-writer small{display:block!important;margin-top:2px!important;color:var(--bd710-side-soft)!important;font-size:7px!important}.bd-index-sidebar-copy .bd-master-writer>i{width:7px!important;height:7px!important;border-radius:50%!important;background:#43b889!important}
  html[data-theme="dark"] .bd-index-sidebar-copy .bd-master-writer{background:rgba(19,40,68,.60)!important}

  /* Desktop: slim rails + flexible center. Never let either rail fill the viewport. */
  @media(min-width:1021px){
    html.bd-master-desktop body{overflow-x:hidden!important}
    html.bd-master-desktop #bdMasterLeftEdge,html.bd-master-desktop #bdMasterRightEdge,html.bd-master-desktop #bdMasterDrawerShade,html.bd-master-desktop .bd-master-edge{display:none!important}
    html.bd-master-desktop .bd-master-three-col-shell{width:min(1550px,calc(100% - 24px))!important;max-width:1550px!important;margin-inline:auto!important;display:grid!important;grid-template-columns:minmax(190px,220px) minmax(0,1fr) minmax(200px,235px)!important;gap:12px!important;align-items:stretch!important;justify-content:stretch!important;overflow-x:hidden!important}
    html.bd-master-desktop .bd-master-three-col-shell>.bd-master-left-rail,html.bd-master-desktop .bd-master-three-col-shell>.bd-master-right-rail{width:auto!important;min-width:0!important;max-width:none!important;left:auto!important;right:auto!important;transform:none!important;margin:0!important;overflow-x:hidden!important}
    html.bd-master-desktop .bd-master-three-col-shell>.bd-master-center-rail{width:auto!important;max-width:none!important;min-width:0!important;margin:0!important}
  }
  @media(min-width:1280px){html.bd-master-desktop .bd-master-three-col-shell{grid-template-columns:220px minmax(0,1fr) 235px!important}}
  @media(min-width:1540px){html.bd-master-desktop .bd-master-three-col-shell{grid-template-columns:230px minmax(0,1fr) 245px!important}}

  /* Mobile/tablet: no desktop rail rule leaks in. The page's native drawers win. */
  @media(max-width:1020px){
    html.bd-master-mobile .bd-master-three-col-shell{max-width:100%!important}
    html.bd-master-mobile .bd-index-sidebar-copy{contain:none!important}
    .bd-master-mobile-drawer .bd-master-account-avatar{width:44px!important;height:44px!important;max-width:44px!important;min-width:44px!important}
    .bd-master-mobile-drawer .bd-master-account-avatar>img{width:44px!important;height:44px!important;max-width:44px!important;min-width:44px!important;object-fit:cover!important}
  }
  `;
  D.head.appendChild(style);

  const desktopMQ=W.matchMedia('(min-width:1021px)');
  let raf=0;
  function commonShell(left,right){
    if(!left||!right)return null;
    if(left.parentElement===right.parentElement)return left.parentElement;
    const candidates=['.shell','.layout','.page-shell','.main-layout','.page-grid'];
    for(const sel of candidates){const s=left.closest(sel);if(s&&s.contains(right))return s}
    return null;
  }
  function classify(){
    raf=0;
    const desktop=desktopMQ.matches;
    D.documentElement.classList.toggle('bd-master-desktop',desktop);
    D.documentElement.classList.toggle('bd-master-mobile',!desktop);
    if(page!=='index.html'){
      const left=D.querySelector('#leftSidebar'),right=D.querySelector('#rightSidebar');
      const shell=commonShell(left,right);
      if(shell&&left&&right){
        shell.classList.add('bd-master-three-col-shell');
        left.classList.add('bd-master-left-rail');
        right.classList.add('bd-master-right-rail');
        const children=Array.from(shell.children);
        const center=children.find(el=>el!==left&&el!==right&&(el.matches?.('main,.center,.center-col,.feed,.center-feed,.page-main')||!el.matches?.('aside,.sidebar')));
        center?.classList.add('bd-master-center-rail');
      }
    }
    if(desktop){
      D.body?.classList.remove('bd-drawer-open');
      const shade=D.getElementById('bdMasterDrawerShade');
      shade?.classList.remove('open-left','open-right');
    }
  }
  function schedule(){if(raf)return;raf=W.requestAnimationFrame(classify)}
  const boot=()=>{
    classify();
    try{desktopMQ.addEventListener('change',schedule)}catch{desktopMQ.addListener?.(schedule)}
    W.addEventListener('resize',schedule,{passive:true});
    new MutationObserver(schedule).observe(D.body||D.documentElement,{subtree:true,childList:true});
  };
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

})();
