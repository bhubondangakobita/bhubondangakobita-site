/* Bhubondanga Premium Settings Controller v1 */
(function(W,D){
 'use strict';
 if(W.BDPremiumSettings)return;
 const KEY='bd-premium-settings-v1';
 const DEFAULTS={
  gift_box_enabled:true,gift_box_public:true,profile_private:false,message_policy:'everyone',follow_policy:'everyone',follow_approval:false,
  birthday_timeline_policy:'followers',poke_policy:'followers',tag_policy:'followers',mention_policy:'everyone',friend_request_policy:'everyone',
  emergency_alerts:true,humanitarian_alerts:true,security_alerts:true,login_alerts:true,birthday_notifications:true,poke_notifications:true,mention_notifications:true,tag_notifications:true,
  newsfeed_language:'bn',ticker_country:'BD',prayer_times_enabled:true,prayer_calculation_method:'auto',
  gender_visibility:'private',religion_visibility:'private',online_status_visibility:'followers',activity_status_visibility:'followers',search_engine_profile:false,
  profile_download_permission:'nobody',timeline_post_review:true
 };
 let state={...DEFAULTS};let timer=0;
 const client=()=>W.BD_SUPABASE||W.supabaseClient||W.bhubondangaSupabase||W.__BD_SUPABASE_CLIENT__||((W.supabase?.auth&&W.supabase?.from)?W.supabase:null);
 function localRead(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return{}}}
 function localWrite(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}}
 async function user(){try{return(await client()?.auth?.getSession?.()).data?.session?.user||null}catch(_){return null}}
 function setControl(el,v){if(el.type==='checkbox')el.checked=!!v;else el.value=v==null?'':String(v)}
 function getControl(el){return el.type==='checkbox'?el.checked:el.value}
 function apply(){D.querySelectorAll('[data-premium-key]').forEach(el=>{const k=el.dataset.premiumKey;if(k in state)setControl(el,state[k])})}
 function mirror(){
  try{
   localStorage.setItem('bd-newsfeed-language-v1',state.newsfeed_language);localStorage.setItem('bd-ui-language-v2',state.newsfeed_language);
   localStorage.setItem('bd-ticker-country-v1',state.ticker_country);localStorage.setItem('bd-prayer-times-enabled-v1',String(!!state.prayer_times_enabled));if(state.prayer_calculation_method&&state.prayer_calculation_method!=='auto')localStorage.setItem('bd-prayer-method-v1',String(state.prayer_calculation_method));else localStorage.removeItem('bd-prayer-method-v1');
  }catch(_){}
  W.BDLocalization?.setLanguage?.(state.newsfeed_language);
  W.BDLocalization?.setRegion?.(state.ticker_country);
  W.BDPrayerTimes?.setEnabled?.(!!state.prayer_times_enabled);
  W.dispatchEvent(new CustomEvent('bd:gift-settings-changed',{detail:{enabled:state.gift_box_enabled,public:state.gift_box_public}}));
  W.dispatchEvent(new CustomEvent('bd:premium-settings-changed',{detail:{...state}}));
 }
 async function load(){
  state={...DEFAULTS,...localRead()};
  const u=await user(),c=client();
  if(u?.id&&c?.from&&navigator.onLine){
   try{const r=await c.from('profile_preferences').select('*').eq('user_id',u.id).maybeSingle();if(!r.error&&r.data){const remote=r.data.premium_preferences&&typeof r.data.premium_preferences==='object'?{...r.data,...r.data.premium_preferences}:r.data;for(const k of Object.keys(DEFAULTS))if(remote[k]!=null)state[k]=remote[k]}}catch(_){}
  }
  localWrite();apply();mirror();return state;
 }
 async function persist(){
  localWrite();mirror();
  const u=await user();if(!u?.id)return;
  const row={user_id:u.id,...Object.fromEntries(Object.keys(DEFAULTS).map(k=>[k,state[k]])),premium_preferences:{...state},updated_at:new Date().toISOString()};
  const c=client();
  if(navigator.onLine&&c?.from){try{const r=await c.from('profile_preferences').upsert(row,{onConflict:'user_id'});if(!r.error)return}catch(_){}}
  W.BDOffline?.queueAction?.({kind:'table.upsert',dedupe_key:`profile-preferences:${u.id}`,payload:{table:'profile_preferences',row,options:{onConflict:'user_id'}}}).catch(()=>{});
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(persist,350)}
 function bind(){
  D.addEventListener('change',e=>{const el=e.target.closest?.('[data-premium-key]');if(!el)return;state[el.dataset.premiumKey]=getControl(el);schedule()});
  D.addEventListener('click',e=>{const b=e.target.closest?.('[data-premium-save]');if(!b)return;persist();const old=b.textContent;b.textContent='Saved';setTimeout(()=>b.textContent=old,1200)});
 }
 W.BDPremiumSettings=Object.freeze({load,persist,get(){return{...state}},set(k,v){if(k in DEFAULTS){state[k]=v;apply();schedule()}}});
 bind();if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',load,{once:true});else load();
})(window,document);
