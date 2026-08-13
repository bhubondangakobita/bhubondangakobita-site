/* Bhubondanga master language-safety + moderation + notification runtime — 2026-08-13 */
(function(W,D){'use strict';
if(W.BhubondangaProfanity?.version==='2026.08.13-final')return;

const TERMS=[
'মাদারচোদ','মাদারচোদা','মাদার চোদ','মাদার চোদা','ভ্যানচোদ','ভ্যাংচোদ','বাঞ্চোদ','বাইঞ্চোদ','বাইনচোদ','বহেনচোদ','বেহেনচোদ','বোকাচোদ','বোকাচোদা',
'খানকির পোলা','খানকির ছেলে','খানকি ছেলে','খানকির পুত','খানকি মাগির পুত','খানকি মাগির ঝি','খানকি','মাগির ছেলে','মাগির পোলা','মাগির পুত','মাগির ঝি','মাগি','মাগী',
'চোদাচুদি','চোদা চুদি','চুদাচুদি','চুতমারানি','চুত মারানি','চুত মারানির পুত','চোদা','চুদি','চুদ','চোদন','গুদখোর','গুদ','বাল','বেশ্যা',
'কুত্তা','কুত্তার বাচ্চা','শুয়োর','শুয়োর','শুয়ার','শুয়ার','শুয়োরের বাচ্চা','শুয়োরের বাচ্চা','শুয়ারের বাচ্চা','শুয়ারের বাচ্চা',
'শালা','শালি','শালী','হারামজাদা','হারামজাদী','হারামির বাচ্চা',
'madarchod','madarchoda','madar chod','madar choda','banchod','bainchod','behenchod','bhenchod','bokachod','bokachoda','khankir pola','khankir chele','khanki chele','khankir put','khanki','magir chele','magir pola','magir put','magi','chodachudi','choda chudi','chutmarani','chut marani','gudkhor','beshya',
'fuck','fuck you','fuck off','fucking','fucker','fuckface','motherfucker','mother fucker','asshole','bitch','son of a bitch','dickhead','bullshit','cunt','cocksucker','slut','whore'
];

const MODERATION_MESSAGE='😄 বস, আপনার লেখাটা অত্যন্ত সুন্দর! তবে লেখার মাঝে কিছু আপত্তিকর শব্দ আমার নজরে পড়েছে। আর আমি যেহেতু গালি ডিটেক্টর, গালি দেখলেই আমার মাথাটা একটু গরম হয়ে যায়! তাই নিজের মাথা বেশি গরম না করে আপনার লেখাটি নিরাপদে Founder ও Admin Panel-এর Review Queue-তে পাঠিয়ে দিচ্ছি। তাঁরা যদি আপনার গালিটা হজম করতে পারেন 😄 এবং মনে করেন—“কবিতার প্রয়োজনে শব্দটি ঠিক আছে”, তাহলে অনুমোদনের পর লেখাটি নিজে থেকেই সব সংশ্লিষ্ট টাইমলাইনে প্রকাশ হয়ে যাবে। চিন্তা করবেন না বস—আপনার লেখা নিরাপদেই আছে। 🌿';
const COMMENT_MESSAGE='😅 গালি ডিটেক্টর ধরে ফেলেছে! শব্দটা একটু ভদ্র করে লিখুন, তারপর মন্তব্যটা পাঠান।';
const APPROVED_MESSAGE='✅ আপনার লেখাটি Founder/Admin অনুমোদন করেছেন। লেখাটি এখন নিজে থেকেই Index, Profile এবং সংশ্লিষ্ট টাইমলাইনে প্রকাশ হয়েছে। 🌿';
const REJECTED_MESSAGE='আপনার লেখাটি Founder/Admin পর্যালোচনা করেছেন, তবে এই সংস্করণটি প্রকাশ করা হয়নি। চাইলে শব্দগুলো একটু সম্পাদনা করে আবার প্রকাশ করতে পারেন। 🌿';

function normalize(v){return String(v||'').normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'').toLocaleLowerCase('bn-BD').replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim()}
function scan(value){
  const s=normalize(value),compact=s.replace(/\s/g,'');if(!s)return{flagged:false,matches:[],severity:'clean'};
  const words=s.split(' '),hits=[];
  for(const raw of TERMS){const n=normalize(raw);if(!n)continue;const nw=n.split(' ');let hit=false;
    if(nw.length===1)hit=words.includes(n);
    else for(let i=0;i<=words.length-nw.length&&!hit;i++)hit=nw.every((w,j)=>words[i+j]===w);
    if(!hit&&n.replace(/\s/g,'').length>=5)hit=compact.includes(n.replace(/\s/g,''));
    if(hit)hits.push(raw);
  }
  const matches=[...new Set(hits)];return{flagged:matches.length>0,matches,severity:matches.length>2?'high':matches.length?'review':'clean'};
}
function client(){return W.bdProductionSupabase||W.bdSupabase||W.supabaseClient||W.bhubondangaSupabase||W.BhubondangaAuth?.client||null}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function localGet(k,f=[]){try{const x=JSON.parse(localStorage.getItem(k)||'null');return x==null?f:x}catch{return f}}
function localPut(k,row,limit=2000){try{const key=x=>String(x?.postId||x?.post_id||x?.post?.id||x?.id||'');const rk=key(row);const a=localGet(k,[]).filter(x=>!rk||key(x)!==rk);a.unshift(row);localStorage.setItem(k,JSON.stringify(a.slice(0,limit)))}catch{}}

async function insertNotification(c,to,payload){
  if(!c||!to)return false;const stamp=new Date().toISOString(),base={actor_id:payload.actor_id||to,type:payload.type||'notification',title:payload.title||'নতুন নোটিফিকেশন',message:payload.message||'',url:payload.url||'',post_id:payload.post_id||undefined,created_at:stamp};
  const variants=[{...base,user_id:to},{...base,recipient_id:to}];
  for(const raw of variants){const row={};Object.keys(raw).forEach(k=>raw[k]!==undefined&&raw[k]!==''&&(row[k]=raw[k]));try{const r=await c.from('notifications').insert(row);if(!r.error)return true}catch{}}
  return false;
}
async function moderatorRows(c){
  if(!c)return[];let rows=[];
  try{const r=await c.from('user_roles').select('user_id,role,active').in('role',['founder','admin']).eq('active',true);if(!r.error)rows=r.data||[]}catch{}
  if(!rows.length)try{const r=await c.from('profiles').select('id,role').in('role',['founder','admin']);if(!r.error)rows=(r.data||[]).map(x=>({user_id:x.id,role:x.role,active:true}))}catch{}
  const seen=new Set();return rows.filter(x=>x.user_id&&!seen.has(String(x.user_id))&&seen.add(String(x.user_id)));
}
function normalizePost(post={}){return{
  id:post.id||post.postId||post.post_id||'',author_id:post.author_id||post.authorId||post.userId||'',author_name:post.author_name||post.authorName||post.userName||'সদস্য',author_username:post.author_username||post.authorUsername||'',title:post.title||'শিরোনামহীন লেখা',body:post.body||post.text||'',type:post.type||'post',category:post.category||post.label||'প্রকাশনা',created_at:post.created_at||post.createdAt||new Date().toISOString()
}}
async function queuePostForModeration(post,terms,forcedClient){
  const c=forcedClient||client(),p=normalizePost(post),matches=(terms&&terms.length?terms:scan(p.title+' '+p.body).matches),stamp=new Date().toISOString();
  if(c&&!p.author_id)try{p.author_id=String((await c.auth?.getSession?.()).data?.session?.user?.id||'')}catch{}
  const localNotice={id:'mod-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),postId:p.id,userId:p.author_id,userName:p.author_name,matchedTerms:[...matches],status:'pending',createdAt:stamp,type:'post_moderation',post:{...p,status:'pending_review'}};
  localPut('bhubondangaAdminModerationQueue',localNotice);localPut('bhubondangaFounderModerationQueue',localNotice);localPut('bhubondangaPendingReviewPosts',{...p,status:'pending_review'});
  localPut('bhubondangaNotifications',{...localNotice,id:'notice-'+Date.now(),type:'moderation',message:MODERATION_MESSAGE,read:false},1000);
  if(!c||!p.id||!p.author_id)return localNotice;
  /* Some legacy category composers only created a local draft. Ensure the canonical post row exists before it enters moderation. */
  try{const ex=await c.from('posts').select('id,status').eq('id',p.id).limit(1).maybeSingle();if(!ex.data){const row={id:p.id,author_id:p.author_id,author_username:p.author_username||'',author_name:p.author_name||'সদস্য',type:p.type||'post',category:p.category||p.type||'প্রকাশনা',title:p.title||'শিরোনামহীন লেখা',body:p.body||'',status:'pending_review',visibility:'public',created_at:p.created_at||stamp};const variants=[row,(()=>{const x={...row};delete x.created_at;return x})(),(()=>{const x={...row};delete x.visibility;delete x.created_at;return x})()];for(const v of variants){const r=await c.from('posts').insert(v);if(!r.error)break}}else if(String(ex.data.status||'')!=='pending_review'){await c.from('posts').update({status:'pending_review'}).eq('id',p.id)}}catch(e){console.warn('Bhubondanga pending post ensure',e?.message||e)}
  try{const exists=await c.from('moderation_queue').select('id').eq('post_id',p.id).eq('status','pending').limit(1).maybeSingle();if(!exists.data){const base={post_id:p.id,submitted_by:p.author_id,matched_terms:[...matches],status:'pending'},snapshot={...p,status:'pending_review'};for(const row of [{...base,type:'post',snapshot},{...base,snapshot},base]){const r=await c.from('moderation_queue').insert(row);if(!r.error)break}}}catch{}
  await insertNotification(c,p.author_id,{actor_id:p.author_id,type:'moderation',title:'😄 গালি ডিটেক্টর রিপোর্ট',message:MODERATION_MESSAGE,url:'notifications.html',post_id:p.id});
  const mods=await moderatorRows(c);for(const m of mods){const role=String(m.role||'').toLowerCase(),url=role==='founder'?'founder-dashboard.html#moderation':'admin-dashboard.html#moderation';await insertNotification(c,m.user_id,{actor_id:p.author_id,type:'moderation_alert',title:'⚠ নতুন লেখা পর্যালোচনায়',message:p.author_name+'-এর “'+p.title+'” লেখায় গালি ডিটেক্টর '+matches.slice(0,4).join(' · ')+' শনাক্ত করেছে।',url,post_id:p.id})}
  return localNotice;
}
async function notifyDecision(postOrUser,decision,forcedClient){const c=forcedClient||client(),p=normalizePost(postOrUser),uid=p.author_id||postOrUser?.submitted_by||postOrUser?.userId;if(!uid)return false;const approved=decision==='approved'||decision==='published';return insertNotification(c,uid,{actor_id:uid,type:'moderation_result',title:approved?'✅ লেখা অনুমোদিত':'লেখা পর্যালোচনা সম্পন্ন',message:approved?APPROVED_MESSAGE:REJECTED_MESSAGE,url:approved&&p.id?'index.html?post='+encodeURIComponent(p.id)+'&source=notification':'notifications.html',post_id:p.id})}

/* Universal comment/reply hard block. No pending comment is created. */
const COMMENT_FORM='.bd31-comment-form,.bd31-reply-form,.bd143-reel-comment-form,.bd-lite-reel-comment-form,.inline-comment-form,.comment-form,[data-comment-form],form[class*="comment"],form[id*="comment"]';
const COMMENT_INPUT='input[type="text"],input:not([type]),textarea,[contenteditable="true"]';
function commentField(el){return !!el?.matches?.(COMMENT_INPUT)&&!!el.closest?.(COMMENT_FORM+',.comment-box,.inline-comments,.comments,[data-comment-panel],.bd143-reel-comments,.bd-lite-reel-comments')}
function valueOf(el){return el?.isContentEditable?(el.textContent||''):(el?.value||'')}
function fieldIn(host){if(!host)return null;return [...host.querySelectorAll(COMMENT_INPUT)].find(commentField)||host.querySelector(COMMENT_INPUT)}
function note(host,matches){if(!host)return;let n=host.querySelector?.(':scope > .bd-master-comment-block');if(!n){n=D.createElement('div');n.className='bd-master-comment-block';n.setAttribute('role','alert');n.style.cssText='margin:7px 0 0;padding:8px 10px;border:1px solid rgba(198,95,131,.25);border-radius:10px;background:rgba(198,95,131,.08);color:var(--red,#b74f70);font-size:11px;line-height:1.55';host.appendChild(n)}n.hidden=false;n.textContent=COMMENT_MESSAGE+(matches.length?' ('+matches.slice(0,3).join(' · ')+')':'')}
function checkComment(el){if(!commentField(el))return[];const m=scan(valueOf(el)).matches,host=el.closest(COMMENT_FORM)||el.closest('.comment-box,.inline-comments,.comments,[data-comment-panel],.bd143-reel-comments,.bd-lite-reel-comments')||el.parentElement;el.setAttribute('aria-invalid',m.length?'true':'false');if(m.length)note(host,m);else host?.querySelector?.(':scope > .bd-master-comment-block')?.remove();return m}
D.addEventListener('input',e=>{if(commentField(e.target))checkComment(e.target)},true);
D.addEventListener('paste',e=>{if(commentField(e.target))setTimeout(()=>checkComment(e.target),0)},true);
D.addEventListener('submit',e=>{const f=e.target;if(!(f instanceof HTMLFormElement)||!f.matches(COMMENT_FORM))return;const field=fieldIn(f),m=field?checkComment(field):[];if(!m.length)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{field.focus({preventScroll:true})}catch{}},true);
D.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.shiftKey||!commentField(e.target))return;const m=checkComment(e.target);if(m.length){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},true);

/* One Facebook-like arrival sound/vibration engine for actual new notification rows only. */
let audioCtx=null,pendingSound=false,lastNotify='';
function primeAudio(){try{const C=W.AudioContext||W.webkitAudioContext;if(!C)return;if(!audioCtx)audioCtx=new C();if(audioCtx.state==='suspended')audioCtx.resume();if(pendingSound&&audioCtx.state==='running'){pendingSound=false;playTone()}}catch{}}
function playTone(){try{primeAudio();if(!audioCtx||audioCtx.state!=='running'){pendingSound=true;return}const now=audioCtx.currentTime,g=audioCtx.createGain();g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.065,now+.012);g.gain.exponentialRampToValueAtTime(.0001,now+.34);g.connect(audioCtx.destination);[[784,0,.17],[1046,.10,.20]].forEach(([f,delay,dur])=>{const o=audioCtx.createOscillator();o.type='sine';o.frequency.value=f;o.connect(g);o.start(now+delay);o.stop(now+delay+dur)})}catch{}}
function notifyPulse(row={}){const key=String(row.id||row.created_at||row.title+'|'+row.message);if(key&&key===lastNotify)return;lastNotify=key;try{navigator.vibrate?.([65,30,65])}catch{}playTone();try{W.dispatchEvent(new CustomEvent('bd:new-notification',{detail:row}))}catch{}}
['pointerdown','touchstart','keydown'].forEach(ev=>W.addEventListener(ev,primeAudio,{once:true,capture:true,passive:true}));
async function bootNotification(){if(W.__BD_NOTIFY_SOUND_ENGINE__)return;W.__BD_NOTIFY_SOUND_ENGINE__=true;let c=null;for(let i=0;i<45&&!c;i++){c=client();if(!c)await new Promise(r=>setTimeout(r,160))}if(!c?.auth)return;try{const uid=String((await c.auth.getSession()).data?.session?.user?.id||'');if(!uid)return;c.channel('bd-master-notify-'+uid+'-'+Math.random().toString(36).slice(2)).on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications'},p=>{const r=p.new||{},to=String(r.recipient_id||r.user_id||r.to_user_id||'');if(!to||to===uid)notifyPulse(r)}).subscribe()}catch(e){console.warn('Bhubondanga notification engine',e)}}

function attach(root=D){root.querySelectorAll?.('form').forEach(form=>{if(form.matches(COMMENT_FORM))return;const fields=[...form.querySelectorAll('textarea,input[type="text"]')].filter(x=>!x.matches('[type="search"]'));if(!fields.length||form.dataset.bdSafety==='ready')return;form.dataset.bdSafety='ready';const run=()=>{const r=scan(fields.map(x=>x.value).join(' '));form.dataset.moderationFlag=r.flagged?'pending_review':''};fields.forEach(f=>f.addEventListener('input',run));run()})}

const API=Object.freeze({version:'2026.08.13-final',terms:Object.freeze(TERMS.slice()),normalize,scan,attach,commentMessage:COMMENT_MESSAGE,moderationMessage:MODERATION_MESSAGE,approvedMessage:APPROVED_MESSAGE,rejectedMessage:REJECTED_MESSAGE,queuePostForModeration,notifyDecision,insertNotification,moderatorRows,notifyPulse});
W.BhubondangaProfanity=API;W.BhubondangaModerationScan=v=>scan(v).matches;W.BHUBONDANGA_BLOCKED_TERMS=TERMS.slice();
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>{attach();bootNotification()},{once:true});else{attach();bootNotification()}
})(window,document);
