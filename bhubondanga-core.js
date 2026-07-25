/* ভুবনডাঙ্গার কবিতা — Unified Core v3
   একক logo, deterministic dates, 4 themes, profile/index pagination, Supabase hybrid sync */
(function(){
'use strict';
const D=document,W=window;
const $=(s,r=D)=>r.querySelector(s), $$=(s,r=D)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
const readJSON=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??f}catch{return f}};
const nativeSet=Storage.prototype.setItem;
const LEAF='<svg class="bhubondanga-leaf" viewBox="0 0 64 64" aria-hidden="true"><path d="M18 51C25 39 34 27 49 13"/><path d="M26 39C17 38 11 33 9 24c9-1 16 3 20 10"/><path d="M34 29c-2-9 1-17 10-22 5 8 3 16-4 23"/><path d="M42 21c3-8 9-13 18-13 0 9-5 16-14 19"/><path d="M20 48c-7 1-13-1-17-7 6-4 13-3 19 2"/></svg>';

function toast(msg){
 let el=$('#bdCoreToast');if(!el){el=D.createElement('div');el.id='bdCoreToast';el.style.cssText='position:fixed;z-index:100000;left:50%;bottom:calc(22px + env(safe-area-inset-bottom));transform:translate(-50%,20px);max-width:min(92vw,560px);padding:11px 15px;border-radius:16px;background:#10213f;color:#f5f8ff;box-shadow:0 15px 42px rgba(0,0,0,.28);font:700 12px/1.55 system-ui;opacity:0;transition:.2s;pointer-events:none;text-align:center';D.body.append(el)}
 el.textContent=msg;el.style.opacity='1';el.style.transform='translate(-50%,0)';clearTimeout(el._t);el._t=setTimeout(()=>{el.style.opacity='0';el.style.transform='translate(-50%,20px)'},2600)
}

/* ---------- one leaf identity ---------- */
function unifyLeaf(){
 const selectors=['.logo','.logo-mark','.sidebar-logo','.desktop-brand-mark','.brand-leaf-emoji','.drawer-leaf','.apn-leaf','.repair-leaf','.desktop-leaf-emblem'];
 $$(selectors.join(',')).forEach(el=>{if(el.dataset.bdLeaf==='1')return;el.dataset.bdLeaf='1';el.classList.add('bhubondanga-leaf-host');el.innerHTML=LEAF});
 $$('img').filter(img=>/logo|leaf|পাতা/i.test((img.alt||'')+' '+(img.className||''))).forEach(img=>{if(img.closest('.post-media,.story-thumb,.avatar-wrap,.author-avatar'))return;const host=D.createElement('span');host.className=(img.className||'')+' bhubondanga-leaf-host';host.innerHTML=LEAF;img.replaceWith(host)});
}

/* ---------- deterministic Asia/Dhaka dates ---------- */
const BN='০১২৩৪৫৬৭৮৯';
const bn=n=>String(n).replace(/\d/g,d=>BN[d]);
const bnMonths=['বৈশাখ','জ্যৈষ্ঠ','আষাঢ়','শ্রাবণ','ভাদ্র','আশ্বিন','কার্তিক','অগ্রহায়ণ','পৌষ','মাঘ','ফাল্গুন','চৈত্র'];
const enMonths=['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
const weekdays=['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
const hijriMonths=['মুহাররম','সফর','রবিউল আউয়াল','রবিউস সানি','জমাদিউল আউয়াল','জমাদিউস সানি','রজব','শাবান','রমজান','শাওয়াল','জিলকদ','জিলহজ'];
function dhakaParts(){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hour12:false,weekday:'short'}).formatToParts(new Date());
 const o={};parts.forEach(p=>o[p.type]=p.value);return {y:+o.year,m:+o.month,d:+o.day,h:(+o.hour)%24};
}
function isLeap(y){return y%4===0&&(y%100!==0||y%400===0)}
function bengaliDate(y,m,d){
 const today=Date.UTC(y,m-1,d), startThis=Date.UTC(y,3,14);let sy=today>=startThis?y:y-1;
 let days=Math.floor((today-Date.UTC(sy,3,14))/86400000);const lens=[31,31,31,31,31,31,30,30,30,30,isLeap(sy+1)?30:29,30];let mi=0;while(mi<11&&days>=lens[mi]){days-=lens[mi];mi++}
 return `${bn(days+1)} ${bnMonths[mi]} ${bn(sy-593)} বঙ্গাব্দ`;
}
function gregorianToHijri(y,m,d){
 let a=Math.floor((14-m)/12), yy=y+4800-a, mm=m+12*a-3;
 let jd=d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;
 let l=jd-1948440+10632,n=Math.floor((l-1)/10631);l=l-10631*n+354;
 let j=(Math.floor((10985-l)/5316))*Math.floor((50*l)/17719)+(Math.floor(l/5670))*Math.floor((43*l)/15238);
 l=l-(Math.floor((30-j)/15))*Math.floor((17719*j)/50)-(Math.floor(j/16))*Math.floor((15238*j)/43)+29;
 let hm=Math.floor((24*l)/709), hd=l-Math.floor((709*hm)/24), hy=30*n+j-30;
 hm=Math.max(1,Math.min(12,hm));return `${bn(hd)} ${hijriMonths[hm-1]} ${bn(hy)} হিজরি`;
}
function greeting(h){return h<5?'শুভ রাত্রি—আপন ভুবনে স্বাগতম':h<12?'শুভ সকাল—আপনার দিনটি ভালো কাটুক':h<17?'শুভ দুপুর—আপনার দিনটি ভালো কাটুক':h<20?'শুভ সন্ধ্যা—আপন ভুবনে স্বাগতম':'শুভ রাত্রি—আপন ভুবনে স্বাগতম'}
function dateData(){const p=dhakaParts(),dt=new Date(Date.UTC(p.y,p.m-1,p.d));return {greeting:greeting(p.h),weekday:weekdays[dt.getUTCDay()],bangla:bengaliDate(p.y,p.m,p.d),hijri:gregorianToHijri(p.y,p.m,p.d),english:`${bn(p.d)} ${enMonths[p.m-1]}, ${bn(p.y)} খ্রিস্টাব্দ`}}
function dateGroupMarkup(x,hidden=false){return `<div class="bd-date-group"${hidden?' aria-hidden="true"':''}><span class="bd-greeting">${esc(x.greeting)}</span><span>✦</span><span>${esc(x.weekday)}</span><span>✦</span><span>${esc(x.bangla)}</span><span>✦</span><span>${esc(x.hijri)}</span><span>✦</span><span>${esc(x.english)}</span></div>`}
function installDates(){
 const x=dateData();
 $$('.date-track').forEach(track=>{track.innerHTML=dateGroupMarkup(x)+dateGroupMarkup(x,true);track.classList.add('bd-date-track')});
 $$('.date-ticker-track').forEach(track=>{track.innerHTML=dateGroupMarkup(x)+dateGroupMarkup(x,true);track.classList.add('bd-date-track')});
 $$('.date-strip').forEach(strip=>{if(strip.closest('.date-ticker'))return;strip.innerHTML=`<div class="bd-date-track">${dateGroupMarkup(x)}${dateGroupMarkup(x,true)}</div>`});
 $$('.greeting').forEach(e=>e.textContent=x.greeting);$$('.weekday-date').forEach(e=>e.textContent=x.weekday);$$('.bangla-date').forEach(e=>e.textContent=x.bangla);$$('.hijri-date').forEach(e=>e.textContent=x.hijri);$$('.gregorian-date').forEach(e=>e.textContent=x.english);
}

/* ---------- four themes ---------- */
const THEMES={light:['☀️','লাইট'],medium:['◐','মিডল'],dark:['🌙','ডার্ক'],system:['⚙️','সিস্টেম']};
function selectedTheme(){return localStorage.getItem('bhubondangaThemeChoice')||localStorage.getItem('bhubondangaTheme')||'light'}
function resolvedTheme(choice){if(choice!=='system')return choice;return matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}
function applyTheme(choice,save=true){if(!THEMES[choice])choice='light';if(save){nativeSet.call(localStorage,'bhubondangaThemeChoice',choice);nativeSet.call(localStorage,'bhubondangaTheme',choice)}D.documentElement.dataset.theme=resolvedTheme(choice);D.documentElement.dataset.themeChoice=choice;$$('.bd-theme-option').forEach(b=>b.classList.toggle('active',b.dataset.theme===choice));$$('.bd-theme-current').forEach(e=>e.textContent=THEMES[choice][1]);W.dispatchEvent(new CustomEvent('bhubondanga-theme-change',{detail:{choice,resolved:resolvedTheme(choice)}}))}
function installThemeUI(){
 const backdrop=D.createElement('div');backdrop.className='bd-theme-backdrop';
 const sheet=D.createElement('section');sheet.className='bd-theme-sheet';sheet.setAttribute('aria-label','থিম নির্বাচন');sheet.innerHTML='<div class="bd-theme-grabber"></div><h2>থিম পরিবর্তন</h2><div class="bd-theme-grid">'+Object.entries(THEMES).map(([k,v])=>`<button class="bd-theme-option" type="button" data-theme="${k}"><span>${v[0]}</span>${v[1]}</button>`).join('')+'</div>';
 D.body.append(backdrop,sheet);
 const open=()=>{backdrop.classList.add('open');sheet.classList.add('open')},close=()=>{backdrop.classList.remove('open');sheet.classList.remove('open')};backdrop.onclick=close;
 $$('.bd-theme-option',sheet).forEach(b=>b.onclick=()=>{applyTheme(b.dataset.theme);close()});
 const launcher='<button class="bd-theme-launcher" type="button"><span>◐ থিম পরিবর্তন</span><span class="bd-theme-current"></span></button>';
 const targets=[...$$('.desktop-nav'),...$$('.sidebar-links')];targets.forEach((t,i)=>{if(t.querySelector('.bd-theme-launcher'))return;t.insertAdjacentHTML('beforeend',launcher);t.lastElementChild.addEventListener('click',open)});
 if(!targets.length){const b=D.createElement('button');b.className='bd-theme-launcher';b.style.cssText='position:fixed;z-index:9990;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));width:auto;border-radius:999px;background:var(--bd-card-strong);border:1px solid var(--bd-line);box-shadow:var(--bd-shadow)';b.innerHTML='<span>◐ থিম</span><span class="bd-theme-current"></span>';b.onclick=open;D.body.append(b)}
 applyTheme(selectedTheme(),false);
 matchMedia('(prefers-color-scheme:dark)').addEventListener?.('change',()=>{if(selectedTheme()==='system')applyTheme('system',false)});
}

/* ---------- load more on profile sections ---------- */
function paginator(container,itemSelector,pageSize=20){
 if(!container||container.dataset.bdPaginated==='1')return;container.dataset.bdPaginated='1';let visible=pageSize;
 const wrap=D.createElement('div');wrap.className='bd-more-wrap';const btn=D.createElement('button');btn.type='button';btn.className='bd-more-btn';btn.textContent='আরও দেখুন';wrap.append(btn);container.insertAdjacentElement('afterend',wrap);
 function update(reset=false){if(reset)visible=pageSize;const items=$$(itemSelector,container);items.forEach((el,i)=>el.hidden=i>=visible);btn.hidden=items.length<=visible;btn.textContent='আরও দেখুন';wrap.hidden=items.length===0}
 btn.onclick=()=>{visible+=pageSize;update();const hidden=$$(itemSelector,container).find(x=>x.hidden);if(!hidden)toast('এই বিভাগে আপাতত আর কোনো লেখা নেই।')};
 new MutationObserver(()=>update(true)).observe(container,{childList:true});update(true)
}
function installPagination(){
 paginator($('#profileFeed'),':scope > .post',20);
 paginator($('#titleArchiveList'),':scope > .title-entry',20);
 const indexList=$('#postList'),existing=$('#loadMoreBtn');if(indexList&&!existing)paginator(indexList,':scope > .post',20);
}

/* ---------- Supabase hybrid data bridge ---------- */
let sb=null,currentUser=null,bridgeBusy=false;
function normalizeUsername(v){return String(v||'').trim().toLowerCase().replace(/^@/,'').replace(/[^a-z0-9_-]/g,'')}
function legacyUser(){return readJSON('bhubondangaCurrentUser',{})||{}}
function localFeed(){const v=readJSON('bhubondangaHomeUserPosts',[]);return Array.isArray(v)?v:[]}
function mapRemotePost(p){return {id:p.id,type:p.type||'poem',category:p.category||'কবিতা',title:p.title||'শিরোনামহীন লেখা',body:p.body||'',authorName:p.author_name||'ভুবনডাঙ্গার লেখক',authorUsername:p.author_username||'',authorAvatar:p.author_avatar||'',originalAuthor:p.original_author||'',createdAt:p.created_at||new Date().toISOString(),updatedAt:p.updated_at||'',likes:Number(p.likes_count||0),comments:Number(p.comments_count||0),status:p.status||'published',cardStyle:p.card_style||'pearl',supabase:true}}
function stableFeed(v){return JSON.stringify(v.map(x=>[String(x.id),x.updatedAt||x.updated_at||x.createdAt,x.status,x.title,x.comments,x.likes]))}
async function initSupabase(){
 try{sb=W.BhubondangaAuth?.client||((W.supabase&&W.BHUBONDANGA_SUPABASE_CONFIG)?W.supabase.createClient(W.BHUBONDANGA_SUPABASE_CONFIG.url,W.BHUBONDANGA_SUPABASE_CONFIG.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null);if(!sb)return;
  const {data}=await sb.auth.getUser();currentUser=data?.user||null;if(currentUser)await upsertProfile();await syncDownPosts(false);subscribeRealtime();
 }catch(e){console.warn('Bhubondanga Supabase bridge:',e?.message||e)}
}
async function upsertProfile(){if(!currentUser)return;const l=legacyUser(),m=currentUser.user_metadata||{};const username=normalizeUsername(l.username||m.username||String(currentUser.email||'').split('@')[0]||currentUser.id);if(!username)return;await sb.from('profiles').upsert({id:currentUser.id,username,display_name:l.name||m.full_name||m.name||username,bio:$('#profileBio')?.textContent?.trim()||'',avatar_url:l.avatar||m.avatar_url||'',updated_at:new Date().toISOString()},{onConflict:'id'})}
async function syncDownPosts(reload=true){if(!sb||bridgeBusy)return;bridgeBusy=true;try{const {data,error}=await sb.from('posts').select('*').in('status',['published','published_flagged']).order('created_at',{ascending:false}).limit(1000);if(error){if(!/relation .* does not exist/i.test(error.message))console.warn(error.message);return}const remote=(data||[]).map(mapRemotePost),local=localFeed(),by=new Map();remote.forEach(p=>by.set(String(p.id),p));local.forEach(p=>{if(!by.has(String(p.id)))by.set(String(p.id),p)});const merged=[...by.values()].sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)).slice(0,2000);if(stableFeed(merged)!==stableFeed(local)){nativeSet.call(localStorage,'bhubondangaHomeUserPosts',JSON.stringify(merged));try{new BroadcastChannel('bhubondanga-live').postMessage({kind:'feed-updated',source:'supabase'})}catch{}W.dispatchEvent(new CustomEvent('bhubondanga-feed-updated'));if(reload&&!sessionStorage.getItem('bdRemoteReload')){sessionStorage.setItem('bdRemoteReload','1');setTimeout(()=>location.reload(),180)}}}finally{bridgeBusy=false}}
async function syncUpPosts(raw){if(!sb||!currentUser)return;let list;try{list=JSON.parse(raw)}catch{return}if(!Array.isArray(list))return;const l=legacyUser(),username=normalizeUsername(l.username||currentUser.user_metadata?.username||String(currentUser.email||'').split('@')[0]);const own=list.filter(p=>p&&String(normalizeUsername(p.authorUsername||p.user))===String(username)&&!p.demo).slice(0,200);if(!own.length)return;const rows=own.map(p=>({id:String(p.id||('post-'+Date.now())),author_id:currentUser.id,author_username:username,author_name:p.authorName||l.name||username,author_avatar:p.authorAvatar||l.avatar||'',type:p.type||'poem',category:p.category||'কবিতা',title:p.title||'শিরোনামহীন লেখা',body:p.body||'',original_author:p.originalAuthor||'',status:p.status||'published',card_style:p.cardStyle||'pearl',created_at:p.createdAt||new Date().toISOString(),updated_at:new Date().toISOString()}));const {error}=await sb.from('posts').upsert(rows,{onConflict:'id'});if(error)console.warn('Post sync:',error.message)}
async function syncUpComments(raw){if(!sb||!currentUser)return;let list;try{list=JSON.parse(raw)}catch{return}if(!Array.isArray(list))return;const l=legacyUser(),username=normalizeUsername(l.username||String(currentUser.email||'').split('@')[0]);const own=list.filter(c=>c&&normalizeUsername(c.authorUsername||c.username)===username).slice(-300);if(!own.length)return;const rows=own.map(c=>({id:String(c.id),post_id:String(c.postId),author_id:currentUser.id,author_username:username,author_name:c.author||l.name||username,body:c.text||c.body||'',created_at:c.createdAt||new Date().toISOString()}));const {error}=await sb.from('comments').upsert(rows,{onConflict:'id'});if(error)console.warn('Comment sync:',error.message)}
function subscribeRealtime(){if(!sb)return;sb.channel('bhubondanga-public-live').on('postgres_changes',{event:'*',schema:'public',table:'posts'},()=>syncDownPosts(true)).on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:currentUser?`user_id=eq.${currentUser.id}`:undefined},payload=>{toast(payload.new?.message||'নতুন নোটিফিকেশন এসেছে');supportedVibration([80,45,80]);setTimeout(refreshNotificationBadges,80)}).subscribe()}
Storage.prototype.setItem=function(key,value){const result=nativeSet.apply(this,arguments);if(this===localStorage){if(key==='bhubondangaHomeUserPosts')queueMicrotask(()=>syncUpPosts(value));if(key==='bhubondangaIndexComments')queueMicrotask(()=>syncUpComments(value))}return result};
function bindMediaUploads(){['profileFile','coverFile'].forEach(id=>{const input=D.getElementById(id);if(!input)return;input.addEventListener('change',async()=>{const file=input.files?.[0];if(!file||!sb||!currentUser)return;const kind=id==='profileFile'?'avatar':'cover',ext=(file.name.split('.').pop()||'jpg').toLowerCase(),path=`${currentUser.id}/${kind}-${Date.now()}.${ext}`;const {error}=await sb.storage.from('profile-media').upload(path,file,{upsert:true,cacheControl:'3600'});if(error){console.warn(error.message);return}const {data}=sb.storage.from('profile-media').getPublicUrl(path);const patch=kind==='avatar'?{avatar_url:data.publicUrl}:{cover_url:data.publicUrl};await sb.from('profiles').update({...patch,updated_at:new Date().toISOString()}).eq('id',currentUser.id);toast(kind==='avatar'?'প্রোফাইল ছবি Supabase-এ সংরক্ষিত হয়েছে':'কভার ছবি Supabase-এ সংরক্ষিত হয়েছে')})})}


/* ---------- sticky profile category fallback + live notification badges ---------- */
function installStickyProfileTabs(){
 const wrap=$('.profile-tabs-sticky');if(!wrap)return;
 const marker=D.createElement('span');marker.className='bd-sticky-marker';marker.style.cssText='position:absolute;top:-1px;left:0;width:1px;height:1px;pointer-events:none';wrap.prepend(marker);
 try{new IntersectionObserver(([entry])=>wrap.classList.toggle('is-stuck',!entry.isIntersecting),{threshold:[1]}).observe(marker)}catch{}
}
function supportedVibration(pattern){try{if('vibrate' in navigator)navigator.vibrate(pattern)}catch{}}
function currentLegacy(){return readJSON('bhubondangaCurrentUser',{})||{}}
function localUnreadNotifications(){
 const u=currentLegacy(),keys=['bhubondangaNotifications'];
 if(u.role==='founder')keys.push('bhubondangaFounderNotifications');
 if(u.role==='admin'||u.role==='founder')keys.push('bhubondangaAdminNotifications');
 if(u.username)keys.push('bhubondangaEditorNotifications-'+u.username);
 const seen=new Set();let n=0;
 keys.forEach(k=>{const a=readJSON(k,[]);if(!Array.isArray(a))return;a.forEach(x=>{const id=String(x?.id||x?.createdAt||Math.random());if(seen.has(id))return;seen.add(id);if(x&&x.unread!==false&&x.read!==true)n++})});return n;
}
function badgeTargets(){
 const targets=[];
 const fixed=$$('#notificationBadge,.notification-badge,[data-notification-badge]');fixed.forEach(x=>targets.push(x));
 $$('a[href*="notifications.html"],a[href="notifications.html"]').forEach(a=>{a.dataset.bdNotificationLink='1';let b=a.querySelector('#notificationBadge,.notification-badge,[data-notification-badge],.bd-live-badge');if(!b){b=D.createElement('b');b.setAttribute('aria-live','polite');a.append(b)}b.classList.add('bd-live-badge');targets.push(b)});
 return [...new Set(targets)];
}
async function refreshNotificationBadges(){
 let count=localUnreadNotifications();
 try{if(sb&&currentUser){const {count:c,error}=await sb.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',currentUser.id).eq('unread',true);if(!error&&Number.isFinite(c))count=c}}catch{}
 badgeTargets().forEach(b=>{b.textContent=count>99?'99+':String(count);b.hidden=count<1;b.setAttribute('aria-label',`${count}টি অপঠিত নোটিফিকেশন`)})
}
function installNotificationUI(){
 badgeTargets();refreshNotificationBadges();
 W.addEventListener('storage',e=>{if(/Notification/i.test(e.key||''))refreshNotificationBadges()});
 try{const ch=new BroadcastChannel('bhubondanga-live');ch.addEventListener('message',e=>{if(/notification/i.test(e.data?.kind||'')){refreshNotificationBadges();supportedVibration([65,35,65])}})}catch{}
 W.addEventListener('bhubondanga-notification',()=>{refreshNotificationBadges();supportedVibration([65,35,65])});
}

function start(){unifyLeaf();installDates();installThemeUI();installPagination();installStickyProfileTabs();installNotificationUI();bindMediaUploads();initSupabase().then(()=>refreshNotificationBadges());setInterval(installDates,60000);setInterval(refreshNotificationBadges,45000)}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
