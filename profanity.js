/* ভুবনডাঙ্গা Bengali safety review detector v1 */
(function(W){'use strict';
const TERMS=['হারামজাদা','মাদারচোদ','বেশ্যা','খানকি','চুদ','শুয়োরের বাচ্চা'];
const normalize=t=>String(t||'').normalize('NFKC').toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\s+/g,' ').trim();
function scan(text){const n=normalize(text),matches=TERMS.filter(x=>n.includes(normalize(x)));return{flagged:matches.length>0,matches,severity:matches.length>2?'high':matches.length?'review':'clean'};}
function warning(form,result){let box=form.querySelector('.bd-review-warning');if(!box){box=document.createElement('div');box.className='bd-review-warning';box.setAttribute('role','status');form.prepend(box);}box.textContent='ভাষার মধ্যে আপত্তিকর বা আক্রমণাত্মক অংশ পাওয়া গেছে। আপনি সম্পাদনা করতে পারেন; অপরিবর্তিত রাখলে প্রকাশনাটি পর্যালোচনায় যাবে।';box.hidden=!result.flagged;form.dataset.moderationFlag=result.flagged?'pending_review':'';}
function attach(root=document){root.querySelectorAll('form').forEach(form=>{if(form.dataset.bdSafety==='ready')return;const fields=[...form.querySelectorAll('textarea,input[type="text"]')].filter(x=>!x.matches('[type="search"]'));if(!fields.length)return;form.dataset.bdSafety='ready';fields.forEach(f=>f.addEventListener('input',()=>warning(form,scan(fields.map(x=>x.value).join(' ')))));form.addEventListener('submit',()=>warning(form,scan(fields.map(x=>x.value).join(' '))),true);});}
W.BhubondangaProfanity=Object.freeze({scan,attach});
})(window);