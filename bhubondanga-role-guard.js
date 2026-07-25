/* ভুবনডাঙ্গা secure dashboard route guard.
   UI access is verified against Supabase Auth + public.user_roles. Sensitive writes still require RLS. */
(function(){'use strict';
 const root=document.documentElement;
 function reveal(){root.classList.remove('bd-auth-pending')}
 function redirect(){const next=encodeURIComponent(location.pathname.split('/').pop()+location.search);location.replace('login.html?next='+next)}
 async function run(){
  const allowed=(document.body?.dataset.allowedRoles||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(!allowed.length){reveal();return}
  for(let i=0;i<50&&!window.BhubondangaAuth;i++)await new Promise(r=>setTimeout(r,80));
  if(!window.BhubondangaAuth){redirect();return}
  try{const info=await window.BhubondangaAuth.current();if(!info||!allowed.includes(info.legacyUser?.role)){redirect();return}reveal()}catch{redirect()}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 setTimeout(()=>{if(root.classList.contains('bd-auth-pending'))redirect()},9000)
})();