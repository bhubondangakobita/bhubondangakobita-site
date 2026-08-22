/* Bhubondanga Personal Lifestyle Diary v1 */
(function(W,D){
 'use strict';
 const $=s=>D.querySelector(s), esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
 const client=()=>W.BD_SUPABASE||W.supabaseClient||W.bhubondangaSupabase||W.__BD_SUPABASE_CLIENT__||((W.supabase?.auth&&W.supabase?.from)?W.supabase:null);
 const uuid=()=>W.BDOffline?.uuid?.()||(crypto.randomUUID?crypto.randomUUID():`diary-${Date.now()}-${Math.random().toString(36).slice(2)}`);
 let user=null, busy=false;

 function status(msg,type=''){const e=$('[data-diary-status]');if(!e)return;e.textContent=msg;e.dataset.type=type;clearTimeout(status.t);status.t=setTimeout(()=>{if(e.textContent===msg)e.textContent=''},5000)}
 async function session(){try{user=(await client()?.auth?.getSession?.()).data?.session?.user||null;return user}catch(_){return null}}

 async function saveLocal(row){return W.BDOffline?.putDraft?.({...row,_diary:true})}
 async function remoteUpsert(row){
  const c=client();if(navigator.onLine&&c?.from){const r=await c.from('diary_entries').upsert(row,{onConflict:'id'});if(!r.error)return true;}
  return false;
 }

 async function saveDraft(){
  if(busy)return;const title=$('#diaryTitle').value.trim(),body=$('#diaryBody').value.trim();if(!title&&!body){status('Write something before saving.','error');return}
  if(!user)await session();if(!user){status('Sign in to use your private diary.','error');return}
  busy=true;try{
   const id=uuid(),payload=await W.BDDiaryLock.encryptText(JSON.stringify({title,body}));
   const row={id,user_id:user.id,is_draft:true,algorithm_eligible:false,title_plaintext:null,content_plaintext:null,ciphertext:payload.ciphertext,iv:payload.iv,encryption_version:payload.encryption_version,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};
   await saveLocal({...row,local_kind:'draft'});
   const ok=await remoteUpsert(row);
   if(!ok)await W.BDOffline?.queueAction?.({kind:'diary.draft',dedupe_key:`diary:${id}`,payload:row});
   $('#diaryTitle').value='';$('#diaryBody').value='';status(ok?'Private draft saved.':'Private draft saved offline — it will sync automatically.','success');await renderEntries();
  }catch(err){status(String(err?.message||err),'error')}finally{busy=false}
 }

 async function submitSupport(){
  if(busy)return;const title=$('#diaryTitle').value.trim(),body=$('#diaryBody').value.trim();if(!body){status('Write what you want support with first.','error');return}
  if(!user)await session();if(!user){status('Sign in to use Personal Life support.','error');return}
  busy=true;try{
   const id=uuid(),row={id,user_id:user.id,is_draft:false,algorithm_eligible:true,title_plaintext:title||'Personal Life',content_plaintext:body,ciphertext:null,iv:null,encryption_version:null,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};
   await saveLocal({...row,local_kind:'support'});
   const ok=await remoteUpsert(row);
   if(!ok)await W.BDOffline?.queueAction?.({kind:'diary.support',dedupe_key:`diary:${id}`,payload:row});
   $('#diaryTitle').value='';$('#diaryBody').value='';status(ok?'Submitted only to the Personal Life support workflow.':'Saved offline — support submission will sync when you are online.','success');await renderEntries();
  }catch(err){status(String(err?.message||err),'error')}finally{busy=false}
 }

 async function remoteEntries(){
  const c=client();if(!navigator.onLine||!c?.from||!user?.id)return[];
  try{const r=await c.from('diary_entries').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(100);return r.error?[]:(r.data||[])}catch(_){return[]}
 }
 async function localEntries(){try{return(await W.BDOffline?.getDrafts?.()||[]).filter(x=>x._diary&&(!user?.id||String(x.user_id)===String(user.id)))}catch(_){return[]}}
 async function decode(row){
  if(row.is_draft){try{const x=JSON.parse(await W.BDDiaryLock.decryptText(row.ciphertext,row.iv));return{title:x.title||'Private Draft',body:x.body||''}}catch(_){return{title:'Private Draft',body:'🔒 Unlock required to read this draft.'}}}
  return{title:row.title_plaintext||'Personal Life Support',body:row.content_plaintext||''};
 }
 async function deleteEntry(id){
  if(!user?.id)return;try{await W.BDOffline?.deleteDraft?.(id)}catch(_){}
  const c=client();if(navigator.onLine&&c?.from){try{await c.from('diary_entries').delete().eq('id',id).eq('user_id',user.id)}catch(_){}}
  else await W.BDOffline?.queueAction?.({kind:'table.delete',dedupe_key:`diary-delete:${id}`,payload:{table:'diary_entries',match:{id,user_id:user.id}}});
  await renderEntries();
 }
 async function renderEntries(){
  const box=$('[data-diary-list]');if(!box)return;box.innerHTML='<div class="bd-diary-empty">Loading…</div>';
  const [remote,local]=await Promise.all([remoteEntries(),localEntries()]),map=new Map();
  [...local,...remote].forEach(x=>map.set(String(x.id),x));
  const rows=[...map.values()].sort((a,b)=>Date.parse(b.created_at||b.updated_at||0)-Date.parse(a.created_at||a.updated_at||0));
  if(!rows.length){box.innerHTML='<div class="bd-diary-empty">No diary entries yet.</div>';return}
  const rendered=[];
  for(const row of rows){const d=await decode(row),pending=!!local.find(x=>String(x.id)===String(row.id))&&!remote.find(x=>String(x.id)===String(row.id));rendered.push(`<article class="bd-diary-item" data-diary-id="${esc(row.id)}"><div class="bd-diary-item-head"><div><span class="${row.is_draft?'draft':'support'}">${row.is_draft?'Private Draft':'Personal Life Support'}</span><h3>${esc(d.title)}</h3></div><button type="button" data-diary-delete="${esc(row.id)}" aria-label="Delete">×</button></div><p>${esc(d.body).replace(/\n/g,'<br>')}</p><footer>${esc(new Date(row.created_at||row.updated_at).toLocaleString())}${pending?' · Pending sync':''}</footer></article>`)}
  box.innerHTML=rendered.join('');
 }

 async function requireUnlock(){
  if(W.BDDiaryLock?.hasSession?.())return true;
  await W.BDDiaryLock?.openUnlockModal?.({onSuccess:()=>{renderEntries();$('#diaryBody')?.focus()}});return W.BDDiaryLock?.hasSession?.()||false;
 }

 async function start(){
  await W.BDOffline?.init?.().catch(()=>{});await session();
  if(!user){status('Sign in to open your private diary.','error');return}
  await requireUnlock();if(!W.BDDiaryLock?.hasSession?.())return;
  $('#saveDiaryDraft').onclick=saveDraft;$('#submitDiarySupport').onclick=submitSupport;
  D.addEventListener('click',e=>{const b=e.target.closest?.('[data-diary-delete]');if(b&&confirm('Delete this diary entry?'))deleteEntry(b.dataset.diaryDelete)});
  W.addEventListener('online',()=>{W.BDOffline?.sync?.().then(renderEntries).catch(()=>{})});
  W.addEventListener('bd:offline-sync',renderEntries);await renderEntries();
 }
 if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(window,document);
