/* Bhubondanga Social Permission Runtime v1 */
(function(W,D){
 'use strict';
 if(W.BDSocialPermissions)return;
 const client=()=>W.BD_SUPABASE||W.supabaseClient||W.bhubondangaSupabase||W.__BD_SUPABASE_CLIENT__||((W.supabase?.auth&&W.supabase?.from)?W.supabase:null);
 const cache=new Map();
 async function decision(action,targetId,{fresh=false}={}){
  targetId=String(targetId||'');if(!targetId)return{allowed:false,requires_approval:false,reason:'invalid_target'};
  const key=`${action}:${targetId}`;if(!fresh&&cache.has(key)&&Date.now()-cache.get(key).at<30000)return cache.get(key).value;
  let c=client();if(!c?.rpc){for(let i=0;i<15&&!c?.rpc;i++){await new Promise(r=>setTimeout(r,120));c=client()}}
  if(!c?.rpc)return{allowed:true,requires_approval:false,reason:'compatibility'};
  try{const r=await c.rpc('social_permission_decision',{p_target:targetId,p_action:String(action)});if(!r.error&&r.data){const v=typeof r.data==='object'?r.data:{allowed:!!r.data};cache.set(key,{at:Date.now(),value:v});return v}}catch(_){}
  return{allowed:true,requires_approval:false,reason:'compatibility'};
 }
 async function requestFollow(targetId){
  const c=client();if(!c?.from)throw new Error('Connection unavailable');const s=(await c.auth.getSession()).data?.session;if(!s?.user)throw new Error('Sign in required');
  const d=await decision('follow',targetId,{fresh:true});if(!d.allowed)return{...d,requested:false};if(!d.requires_approval)return{...d,requested:false};
  const row={requester_id:s.user.id,target_id:targetId,status:'pending',created_at:new Date().toISOString(),updated_at:new Date().toISOString()};
  const r=await c.from('follow_requests').upsert(row,{onConflict:'requester_id,target_id'});if(r.error)throw r.error;return{...d,requested:true};
 }
 function notice(msg){let x=D.querySelector('[data-bd-permission-notice]');if(!x){x=D.createElement('div');x.dataset.bdPermissionNotice='1';x.className='bd-permission-notice';D.body.appendChild(x)}x.textContent=msg;x.classList.add('show');clearTimeout(notice.t);notice.t=setTimeout(()=>x.classList.remove('show'),2600)}
 async function interceptMessage(e){const a=e.target.closest?.('a.bd140-message,a[data-bd-message-target]');if(!a)return;const id=a.dataset.bdMessageTarget||D.body.dataset.bdProfileId||new URL(a.href,location.href).searchParams.get('user')||'';if(!id)return;e.preventDefault();const d=await decision('message',id,{fresh:true});if(d.allowed)location.href=a.href;else notice('This user is not accepting messages from your account.')}
 async function enforcePrivateProfile(){const id=D.body.dataset.bdProfileId;if(!id)return;const d=await decision('profile_view',id,{fresh:true});let lock=D.querySelector('[data-bd-private-profile-lock]');if(d.allowed){lock?.remove();D.body.classList.remove('bd-private-restricted');return}D.body.classList.add('bd-private-restricted');if(!lock){lock=D.createElement('section');lock.dataset.bdPrivateProfileLock='1';lock.className='bd-private-profile-lock';lock.innerHTML='<b>Private Profile</b><span>This member shares full posts only with approved followers.</span>';const feed=D.querySelector('#feed');(feed?.parentElement||D.querySelector('main')||D.body).insertBefore(lock,feed||null)}}
 function start(){D.addEventListener('click',interceptMessage,true);let last='';const mo=new MutationObserver(()=>{const id=D.body.dataset.bdProfileId||'';if(id&&id!==last){last=id;enforcePrivateProfile()}});mo.observe(D.body,{attributes:true,attributeFilter:['data-bd-profile-id'],subtree:false});if(D.body.dataset.bdProfileId)enforcePrivateProfile();W.addEventListener('bd:premium-settings-changed',()=>cache.clear())}
 W.BDSocialPermissions=Object.freeze({decision,requestFollow,enforcePrivateProfile,clear(){cache.clear()}});
 if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(window,document);
