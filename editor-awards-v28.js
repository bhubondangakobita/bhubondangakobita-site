/* Bhubondanga compatibility runtime — V54 */
(()=>{'use strict';
if(window.BhubondangaEditorAwards)return;
const api={
  version:'v54',
  refresh(root=document){
    try{
      root.querySelectorAll('[data-editor-award],[data-award]').forEach(el=>{
        el.setAttribute('data-award-ready','1');
      });
    }catch(_){}
    document.dispatchEvent(new CustomEvent('bhubondanga:editor-awards-refreshed'));
  }
};
window.BhubondangaEditorAwards=api;
const boot=()=>api.refresh(document);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('bhubondanga:feed-rendered',()=>api.refresh(document));
})();