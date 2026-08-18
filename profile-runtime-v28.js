/* Bhubondanga profile compatibility runtime — V54 */
(()=>{'use strict';
if(window.BhubondangaProfileRuntime)return;
let timer=0;
const api={
  version:'v54',
  refresh(){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      document.dispatchEvent(new CustomEvent('bhubondanga:profile-runtime-refresh'));
    },0);
  }
};
window.BhubondangaProfileRuntime=api;
const boot=()=>api.refresh();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pageshow',boot);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)boot()});
})();