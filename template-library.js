/*
 Bhubondanga Template Library v20
 GitHub-root standalone template engine.
 - No embedded template JPG/PNG/SVG files.
 - All frames are CSS + DOM generated at runtime.
 - User-selected photos remain normal post media; template artwork itself has no bitmap dependency.
*/
(()=>{'use strict';
if(window.__BD_TEMPLATE_LIBRARY_V20__) return;
window.__BD_TEMPLATE_LIBRARY_V20__=true;
const D=document,W=window;
const $=(s,r=D)=>r?.querySelector?.(s)||null;
const $$=(s,r=D)=>Array.from(r?.querySelectorAll?.(s)||[]);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
const safe=(s)=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const TYPE_META={
 poem:{label:'কবিতা',accent:'#315f83',accent2:'#789fc0',paper:'#fffdf8'},
 prolap:{label:'প্রলাপ',accent:'#5d4a91',accent2:'#9484c7',paper:'#fcfaff'},
 midnight:{label:'মধ্যরাতের প্রলাপ',accent:'#2b3d78',accent2:'#8a74bd',paper:'#111d3a'},
 letter:{label:'চিঠিপত্র',accent:'#765f42',accent2:'#b89c75',paper:'#fff9ec'},
 environment:{label:'পরিবেশ',accent:'#24724f',accent2:'#73a98c',paper:'#f8fff9'},
 children:{label:'শিশুতোষ',accent:'#3e66a4',accent2:'#db6f93',paper:'#fffcf5'},
 recitation:{label:'আবৃত্তি',accent:'#3b4c62',accent2:'#8b6e78',paper:'#fbfcfe'},
 news:{label:'নিউজ',accent:'#13633f',accent2:'#cb303a',paper:'#fff'},
 discussion:{label:'আলোচনা',accent:'#425d74',accent2:'#6f8795',paper:'#fbfcfd'}
};
const FREE=[
 {key:'bdfree-01',label:'মুক্তা',v:1,free:true,photo:false},
 {key:'bdfree-02',label:'মিন্ট',v:2,free:true,photo:false},
 {key:'bdfree-03',label:'নীল',v:5,free:true,photo:false},
 {key:'bdfree-04',label:'গোলাপি',v:6,free:true,photo:false},
 {key:'bdfree-05',label:'রাত',v:7,free:true,photo:false}
];
const DEFAULT_REGIONS={
 1:{photo:{x:4,y:7,w:34,h:79,shape:'rounded'},title:{x:43,y:16,w:50},body:{x:43,y:34,w:50}},
 2:{photo:{x:5,y:17,w:28,h:42,shape:'circle'},title:{x:38,y:15,w:54},body:{x:38,y:34,w:54}},
 3:{photo:{x:6,y:18,w:34,h:57,shape:'oval'},title:{x:55,y:11,w:38},body:{x:55,y:29,w:38}},
 4:{photo:{x:70,y:7,w:23,h:30,shape:'paper'},title:{x:8,y:17,w:56},body:{x:8,y:34,w:57}},
 5:{photo:null,title:{x:9,y:16,w:82},body:{x:9,y:34,w:82}},
 6:{photo:{x:6,y:9,w:24,h:30,shape:'rounded'},title:{x:35,y:14,w:57},body:{x:35,y:33,w:57}},
 7:{photo:null,title:{x:10,y:18,w:80},body:{x:10,y:38,w:80}},
 8:{photo:null,title:{x:9,y:16,w:82},body:{x:9,y:34,w:82}}
};
const LABELS={
 poem:['ছবির ফ্রেম','লেখকের ছবি','খোলা খাতা','কাগজের চিঠি','পোস্টকার্ড','জলরঙ','নীল রাত','ঐতিহ্য'],
 prolap:['নরম কাগজ','লেখকের ছায়া','খাতার পাতা','ছেঁড়া নোট','শূন্যতা','কুয়াশা','রাত্রির প্রলাপ','পুরোনো কাগজ'],
 midnight:['চাঁদের ফ্রেম','রাত্রির মুখ','নীল খাতা','নিশির কাগজ','নক্ষত্র','রাতের ঢেউ','চাঁদ-কালি','নিশিপত্র'],
 letter:['ছবিসহ চিঠি','প্রাপকের ছবি','খোলা চিঠি','ক্লিপ-পত্র','ডাকটিকিট','নদীপারের চিঠি','নীল খাম','মোমসিল'],
 environment:['প্রকৃতির ছবি','সবুজ বৃত্ত','নদীর খাতা','পাতার নোট','সবুজ পোস্টকার্ড','জল-পাতা','নীল-সবুজ রাত','মাটির কাগজ'],
 children:['ছবির গল্প','শিশুর ছবি','গল্পের বই','কাগজের খেলা','রঙিন পোস্টকার্ড','রামধনু','রাত্রির গল্প','রূপকথার কাগজ'],
 recitation:['মঞ্চের ছবি','শিল্পীর ছবি','স্ক্রিপ্ট খাতা','ক্লিপ স্ক্রিপ্ট','রেকর্ড কার্ড','স্বরলিপি','রাত্রির আবৃত্তি','কাগজ-কলম'],
 news:['স্প্লিট নিউজ','প্রতিবেদক','সম্পাদকীয়','ফটো রিপোর্ট','বুলেটিন','ফিচার','ব্রডকাস্ট','ক্লাসিক'],
 discussion:['ছবিসহ আলোচনা','লেখকের মুখ','নোটবুক','ক্লিপ নোট','কার্ড','মতামত','রাত্রিকালীন','ক্লাসিক']
};
function founder(){
 const i=W.__BD_IDENTITY||{}, s=W.__BD_LIVE_SESSION?.user||{}, m=s.user_metadata||{};
 return W.__BD_NEWS_IS_FOUNDER===true||String(i.role||W.__BD_LIVE_ROLE||m.role||'').toLowerCase()==='founder'||String(i.author_username||m.username||'').replace(/^@/,'').toLowerCase()==='mahmud-sohel'||String(i.author_name||m.full_name||'').trim()==='মাহমুদ সোহেল';
}
function premium(){try{return founder()||!!W.BhubondangaPremiumFonts?.allowed?.()||D.body.classList.contains('is-premium')}catch(_){return founder()}}
function currentType(){return $('input[name="postType"]:checked')?.value||$('#composerForm')?.dataset?.bdChosenType||'poem'}
function variants(type=currentType()){
 const names=LABELS[type]||LABELS.poem;
 return Array.from({length:8},(_,i)=>({key:`bdtpl-${type}-${String(i+1).padStart(2,'0')}`,type,v:i+1,label:names[i]||`${TYPE_META[type]?.label||'কার্ড'} ${i+1}`,free:false,photo:!!DEFAULT_REGIONS[i+1].photo,regions:structuredClone(DEFAULT_REGIONS[i+1])}));
}
function findTemplate(key,type=currentType()){
 const all=[...FREE,...variants(type)]; return all.find(x=>x.key===key)||null;
}
const FONT_OPTIONS=[
 ['serif','Noto Serif Bengali','"Noto Serif Bengali","Tiro Bangla",serif'],
 ['sans','Noto Sans Bengali','"Noto Sans Bengali","Hind Siliguri",sans-serif'],
 ['tiro','Tiro Bangla','"Tiro Bangla","Noto Serif Bengali",serif'],
 ['atma','Atma','"Atma","Noto Sans Bengali",sans-serif'],
 ['galada','Galada','"Galada","Noto Serif Bengali",serif'],
 ['hind','Hind Siliguri','"Hind Siliguri","Noto Sans Bengali",sans-serif']
];
let selectedKey='', coverURL='', dragging=null, live=null, oldComposeStyle=null, customFonts=[];
function stateForm(){return $('#composerForm')}
function makeStyleKey(){
 const f=stateForm(); if(!f||!selectedKey)return 'plain';
 const n=(k,d)=>Math.round(clamp(f.dataset[k]??d,0,100));
 return `${selectedKey}_tx${n('bdTplTitleX',50)}_ty${n('bdTplTitleY',20)}_bx${n('bdTplBodyX',50)}_by${n('bdTplBodyY',55)}_cx${n('bdTplCropX',50)}_cy${n('bdTplCropY',50)}`;
}
function selectedTemplate(){return findTemplate(selectedKey)||FREE.find(x=>x.key===selectedKey)||null}
function installComposeStyleBridge(){
 if(!oldComposeStyle) oldComposeStyle=typeof W.BD58ComposeStyle==='function'?W.BD58ComposeStyle:null;
 W.BD58ComposeStyle=(ctx='index')=>{
   if(ctx==='publisher') return oldComposeStyle?oldComposeStyle(ctx):'plain';
   const f=stateForm();
   if(f?.dataset?.bdTemplateKey) return makeStyleKey();
   return oldComposeStyle?oldComposeStyle(ctx):(f?.querySelector('#cardStyle')?.value||'plain');
 };
}
function styleText(){return `
#bd177CardStudio,#bd19TemplateCanvas,.bd-v11-folder-nav,#bd58TemplatePicker .bd58-template-head,#bd58TemplatePicker .bd58-template-strip{display:none!important}
#bd58TemplatePicker{display:block!important;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important}
#bd58TemplatePicker #bdtplLibrary{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
#bdtplLibrary{font-family:'Noto Sans Bengali','Hind Siliguri',sans-serif;color:var(--text,#173153)}
#bdtplLibrary .bdtpl-head{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:0 0 9px;padding:0 2px}
#bdtplLibrary .bdtpl-head strong{font:800 14px/1.25 'Noto Serif Bengali',serif}.bdtpl-head small{font-size:9px;color:var(--text-soft,#637087)}
.bdtpl-section-title{display:flex;align-items:center;gap:7px;margin:10px 2px 6px;font-size:10px;font-weight:800;color:var(--text-soft,#61708a)}
.bdtpl-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.bdtpl-choice{position:relative;height:108px;padding:0;border:1px solid rgba(79,100,138,.17);border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 5px 14px rgba(45,61,91,.05);color:#173153;touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:border-color .12s,box-shadow .12s,transform .12s}.bdtpl-choice:active{transform:scale(.985)}.bdtpl-choice.active{border-color:#cd5b9f;box-shadow:0 0 0 2px rgba(205,91,159,.16),0 8px 20px rgba(45,61,91,.08)}.bdtpl-choice[aria-disabled="true"]{opacity:.52;filter:saturate(.55)}
.bdtpl-thumb{position:absolute;inset:0;overflow:hidden;background:var(--paper,#fffdf8);color:var(--ink,#173153)}.bdtpl-thumb::before,.bdtpl-card::before{content:"";position:absolute;inset:5%;border:1px solid color-mix(in srgb,var(--accent) 42%,transparent);border-radius:11px;pointer-events:none}.bdtpl-thumb::after,.bdtpl-card::after{content:"ভুবনডাঙ্গার কবিতা";position:absolute;right:6%;bottom:5%;font:700 6px/1 'Noto Serif Bengali',serif;color:color-mix(in srgb,var(--accent) 55%,transparent);letter-spacing:.01em;pointer-events:none}.bdtpl-choice b{position:absolute;z-index:7;left:8px;right:8px;bottom:7px;padding:4px 6px;border-radius:8px;background:rgba(255,255,255,.84);color:#173153;font-size:8px;line-height:1.25;text-align:center;backdrop-filter:blur(4px)}.bdtpl-choice .lock{position:absolute;z-index:8;right:6px;top:6px;width:19px;height:19px;display:grid;place-items:center;border-radius:50%;background:rgba(8,22,40,.78);color:#fff;font-size:9px}
/* 8 CSS-only visual structures */
.bdtpl-v1{background:linear-gradient(90deg,color-mix(in srgb,var(--accent2) 18%,#f9fcff) 0 36%,var(--paper) 36%)}.bdtpl-v1 .mini-photo{display:block;left:7%;top:16%;width:25%;height:56%;border-radius:45%}
.bdtpl-v2{background:radial-gradient(circle at 20% 42%,color-mix(in srgb,var(--accent2) 22%,transparent) 0 20%,transparent 21%),linear-gradient(160deg,var(--paper),color-mix(in srgb,var(--accent2) 5%,var(--paper)))}.bdtpl-v2 .mini-photo{display:block;left:9%;top:24%;width:21%;aspect-ratio:1;border-radius:50%}
.bdtpl-v3{background:linear-gradient(90deg,#f8fbfd 0 49.2%,color-mix(in srgb,var(--accent) 25%,#dce6ed) 49.3% 50.7%,var(--paper) 50.8%)}.bdtpl-v3::before{background:repeating-linear-gradient(180deg,transparent 0 11px,color-mix(in srgb,var(--accent) 9%,transparent) 12px);border:0;left:56%;right:8%;top:16%;bottom:14%}.bdtpl-v3 .mini-photo{display:block;left:10%;top:27%;width:24%;height:41%;border-radius:50%}
.bdtpl-v4{background:linear-gradient(150deg,#fffdf7,#f9f2e8);clip-path:polygon(2% 6%,9% 3%,18% 6%,29% 3%,40% 5%,52% 2%,66% 5%,79% 3%,98% 7%,97% 94%,87% 96%,76% 92%,64% 97%,49% 94%,36% 97%,23% 93%,10% 96%,2% 91%)}.bdtpl-v4 .mini-photo{display:block;right:7%;top:10%;width:21%;height:29%;transform:rotate(4deg);border-radius:5px}
.bdtpl-v5{background:linear-gradient(var(--paper),color-mix(in srgb,var(--accent2) 3%,var(--paper)));box-shadow:inset 0 0 0 4px var(--paper),inset 0 0 0 5px color-mix(in srgb,var(--accent) 34%,transparent)}.bdtpl-v5::before{inset:9%;border-style:dashed}.bdtpl-v5 .stamp{display:block;position:absolute;right:10%;top:13%;width:22%;height:25%;border:2px solid color-mix(in srgb,var(--accent) 33%,transparent);border-radius:4px}
.bdtpl-v6{background:radial-gradient(circle at 86% 13%,color-mix(in srgb,var(--accent2) 16%,transparent),transparent 21%),linear-gradient(180deg,var(--paper) 0 72%,color-mix(in srgb,var(--accent2) 16%,var(--paper)) 72% 82%,color-mix(in srgb,var(--accent) 16%,var(--paper)) 82% 92%,var(--paper) 92%)}.bdtpl-v6 .mini-photo{display:block;left:8%;top:16%;width:22%;height:31%;border-radius:7px}
.bdtpl-v7{background:radial-gradient(circle at 82% 16%,#ffe7a2 0 7%,transparent 7.5%),radial-gradient(circle at 67% 22%,rgba(255,255,255,.7) 0 1px,transparent 1.8px),linear-gradient(145deg,#0d2145,#172850 58%,#332a55);--paper:#14264b;--ink:#fff}.bdtpl-v7::before{border-color:rgba(255,255,255,.19)}.bdtpl-v7::after{color:rgba(255,255,255,.48)}.bdtpl-v7 b{color:#fff!important;background:rgba(8,20,43,.62)!important}
.bdtpl-v8{background:linear-gradient(145deg,#fbf2dc,#fff9ec 52%,#f4e7ce);box-shadow:inset 0 0 0 2px #fbf3e4,inset 0 0 0 3px #bb9a6d}.bdtpl-v8 .wax{display:block;position:absolute;left:8%;bottom:13%;width:22px;height:22px;border-radius:50%;background:#a93234;box-shadow:inset 0 0 0 4px rgba(255,255,255,.12)}
.mini-photo{display:none;position:absolute;border:1px dashed color-mix(in srgb,var(--accent) 42%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--accent2) 12%,#eef6fb),#fff);}
/* composer premium controls */
.bdtpl-tools{display:grid;gap:7px;margin:8px 0;padding:9px;border:1px solid var(--border,rgba(88,105,145,.16));border-radius:14px;background:color-mix(in srgb,var(--surface-strong,#fff) 90%,transparent)}.bdtpl-tools-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.bdtpl-tools-head strong{font-size:10px}.bdtpl-tools-head small{font-size:8px;color:var(--text-soft,#637087)}.bdtpl-tool-row{display:grid;grid-template-columns:minmax(100px,1.3fr) 58px auto auto;gap:6px;align-items:center}.bdtpl-tool-row select,.bdtpl-tool-row input[type="color"],.bdtpl-tool-row button,.bdtpl-upload{height:36px;border:1px solid var(--border,rgba(88,105,145,.17));border-radius:10px;background:var(--surface-solid,#fff);color:var(--text,#173153);padding:0 8px;font-size:10px}.bdtpl-tool-row input[type="color"]{padding:4px;width:58px}.bdtpl-tool-row button{min-width:42px;font-weight:900}.bdtpl-tool-row button.active{background:#1d684f;color:#fff;border-color:transparent}.bdtpl-upload{display:flex;align-items:center;justify-content:center;cursor:pointer;white-space:nowrap}.bdtpl-upload input{display:none}.bdtpl-size{display:flex;align-items:center;gap:6px;font-size:9px}.bdtpl-size input{width:100%}
/* live card */
#bdtplLiveEditor{position:relative;margin:10px 0 12px;border-radius:18px;overflow:hidden;box-shadow:0 8px 24px rgba(34,49,78,.08);isolation:isolate;touch-action:pan-y}.bdtpl-card{position:relative;width:100%;min-height:clamp(230px,52vw,410px);overflow:hidden;background:var(--paper);color:var(--ink);border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);border-radius:18px;--accent:#315f83;--accent2:#789fc0;--paper:#fffdf8;--ink:#173153}.bdtpl-card .bdtpl-decoration{position:absolute;inset:0;pointer-events:none}.bdtpl-leaf{position:absolute;width:30px;height:15px;border-radius:100% 0 100% 0;background:color-mix(in srgb,var(--accent) 70%,#58a66a);opacity:.72;transform:rotate(-28deg)}.bdtpl-leaf.l1{left:5%;top:7%}.bdtpl-leaf.l2{left:9%;top:10%;transform:rotate(25deg) scale(.75)}.bdtpl-leaf.l3{right:5%;bottom:8%;transform:rotate(145deg) scale(.8)}.bdtpl-line{position:absolute;height:1px;background:color-mix(in srgb,var(--accent) 35%,transparent);left:7%;right:7%;bottom:7%}.bdtpl-moon{display:none;position:absolute;right:8%;top:8%;width:42px;height:42px;border-radius:50%;background:#ffe5a0;box-shadow:-12px 2px 0 0 #182a4e}.bdtpl-card.bdtpl-v7 .bdtpl-moon{display:block}.bdtpl-wax{display:none;position:absolute;left:7%;bottom:8%;width:34px;height:34px;border-radius:50%;background:#a62e31;box-shadow:inset 0 0 0 6px rgba(255,255,255,.1)}.bdtpl-card.bdtpl-v8 .bdtpl-wax{display:block}.bdtpl-stamp{display:none;position:absolute;right:7%;top:7%;width:64px;height:46px;border:2px solid color-mix(in srgb,var(--accent) 35%,transparent);border-radius:4px}.bdtpl-card.bdtpl-v5 .bdtpl-stamp{display:block}
.bdtpl-photo{position:absolute;z-index:2;display:grid;place-items:center;overflow:hidden;border:1px dashed color-mix(in srgb,var(--accent) 48%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--accent2) 12%,#eaf3f8),#fff);color:var(--accent);touch-action:none}.bdtpl-photo[data-shape="circle"],.bdtpl-photo[data-shape="oval"]{border-radius:50%}.bdtpl-photo[data-shape="rounded"]{border-radius:14px}.bdtpl-photo[data-shape="paper"]{border-radius:6px;transform:rotate(3deg);box-shadow:0 5px 13px rgba(45,55,70,.08)}.bdtpl-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;user-select:none}.bdtpl-photo span{z-index:2;padding:5px 8px;border-radius:999px;background:rgba(255,255,255,.82);font-size:9px;font-weight:800}.bdtpl-photo.has-image span{opacity:0;transition:opacity .12s}.bdtpl-photo.has-image:active span{opacity:1}
.bdtpl-edit{position:absolute;z-index:4;min-width:80px;max-width:88%;padding:7px 9px;border-radius:9px;outline:0;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--ink);text-shadow:none}.bdtpl-edit[data-kind="title"]{font-size:clamp(18px,4.2vw,30px);font-weight:800;line-height:1.35}.bdtpl-edit[data-kind="body"]{font-size:clamp(13px,2.8vw,18px);line-height:1.75}.bdtpl-edit:focus{background:rgba(255,255,255,.55);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 30%,transparent)}.bdtpl-drag{position:absolute;left:-4px;top:-21px;width:29px;height:22px;border:0;border-radius:8px 8px 0 0;background:color-mix(in srgb,var(--accent) 82%,#1f3147);color:#fff;font:800 11px/1 system-ui;display:grid;place-items:center;cursor:grab;touch-action:none;opacity:.82}.bdtpl-drag:active{cursor:grabbing}.bdtpl-watermark{position:absolute;z-index:5;right:4.5%;bottom:3.5%;font:700 9px/1.2 'Noto Serif Bengali',serif;color:color-mix(in srgb,var(--accent) 58%,transparent);pointer-events:none}.bdtpl-card.bdtpl-v7 .bdtpl-watermark{color:rgba(255,255,255,.48)}
.bdtpl-card.bdtpl-v1{background:linear-gradient(90deg,color-mix(in srgb,var(--accent2) 15%,#f4faff) 0 38%,var(--paper) 38%)}.bdtpl-card.bdtpl-v2{background:radial-gradient(circle at 18% 40%,color-mix(in srgb,var(--accent2) 18%,transparent),transparent 28%),var(--paper)}.bdtpl-card.bdtpl-v3{background:linear-gradient(90deg,#f8fbfd 0 49.3%,color-mix(in srgb,var(--accent) 22%,#dde5eb) 49.4% 50.6%,var(--paper) 50.7%)}.bdtpl-card.bdtpl-v3 .bdtpl-decoration::after{content:"";position:absolute;left:55%;right:7%;top:13%;bottom:11%;background:repeating-linear-gradient(180deg,transparent 0 27px,color-mix(in srgb,var(--accent) 15%,transparent) 28px);pointer-events:none}.bdtpl-card.bdtpl-v4{clip-path:polygon(2% 5%,11% 3%,19% 6%,30% 3%,42% 5%,56% 2%,69% 5%,82% 3%,98% 7%,98% 91%,89% 95%,78% 92%,67% 97%,52% 94%,39% 97%,25% 93%,12% 96%,2% 91%);background:linear-gradient(145deg,#fffdf7,#faf4e9)}.bdtpl-card.bdtpl-v5{box-shadow:inset 0 0 0 4px var(--paper),inset 0 0 0 5px color-mix(in srgb,var(--accent) 34%,transparent)}.bdtpl-card.bdtpl-v6{background:radial-gradient(circle at 87% 12%,color-mix(in srgb,var(--accent2) 13%,transparent),transparent 21%),linear-gradient(180deg,var(--paper) 0 76%,color-mix(in srgb,var(--accent2) 14%,var(--paper)) 76% 84%,color-mix(in srgb,var(--accent) 15%,var(--paper)) 84% 92%,var(--paper) 92%)}.bdtpl-card.bdtpl-v7{--paper:#14264b;--ink:#fff;background:radial-gradient(circle at 80% 15%,#ffe6a0 0 5.5%,transparent 6%),radial-gradient(circle at 68% 20%,rgba(255,255,255,.75) 0 1px,transparent 1.7px),linear-gradient(145deg,#0d2145,#172850 58%,#302850);color:#fff}.bdtpl-card.bdtpl-v7::before{border-color:rgba(255,255,255,.18)}.bdtpl-card.bdtpl-v7 .bdtpl-edit{color:#fff}.bdtpl-card.bdtpl-v8{background:linear-gradient(145deg,#fbf2dc,#fff9ec 52%,#f4e7ce);box-shadow:inset 0 0 0 2px #fbf3e4,inset 0 0 0 3px #b99768}
/* type-specific accent palette */
.bdtpl-type-poem{--accent:#315f83;--accent2:#88abc3;--paper:#fffdf8;--ink:#16304b}.bdtpl-type-prolap{--accent:#5a4989;--accent2:#a094cd;--paper:#fcfaff;--ink:#2d3451}.bdtpl-type-midnight{--accent:#526da9;--accent2:#8c78bd;--paper:#101d3d;--ink:#fff}.bdtpl-type-letter{--accent:#7b6344;--accent2:#bda681;--paper:#fff9ec;--ink:#423423}.bdtpl-type-environment{--accent:#21724e;--accent2:#74ad91;--paper:#f9fff9;--ink:#164631}.bdtpl-type-children{--accent:#436ca6;--accent2:#da7194;--paper:#fffdf6;--ink:#2e4360}.bdtpl-type-recitation{--accent:#374b62;--accent2:#927380;--paper:#fbfcfe;--ink:#26394d}.bdtpl-type-news{--accent:#11673f;--accent2:#d22e38;--paper:#fff;--ink:#101c2d}.bdtpl-type-discussion{--accent:#455f77;--accent2:#78919e;--paper:#fbfcfd;--ink:#25384b}
/* Old staged CSS is extremely specific; this is the final authority. */
#composer[data-bd71-stage="card"] #composerForm{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;height:auto!important;overflow:visible!important}
#composer[data-bd71-stage="card"] #composerForm>[data-bd-compose-panel="card"]{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
#composer[data-bd71-stage="card"] #bd58TemplatePicker{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
#composer[data-bd71-stage="card"] #bdComposeCardNext{display:none!important}
#composer[data-bd71-stage="type"] #composerForm>[data-bd-compose-panel="type"],#composer[data-bd71-stage="write"] #composerForm>[data-bd-compose-panel="write"]{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
#composer[data-bd71-stage="type"] #bdTitleStyleStudio{display:none!important}
#composer[data-bd71-stage="type"] #postTitle{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
#composer[data-bd71-stage="write"] #postBody.bdtpl-native-hidden{position:absolute!important;width:1px!important;height:1px!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;overflow:hidden!important;white-space:nowrap!important}
#composer .bd-v18-compose-shortcuts{display:none!important}
/* keep the five basic font samples compact and independent */
#bd58FontToolbar .bd58-font-chip[data-bd58-font]{width:44px!important;min-width:44px!important;max-width:44px!important;height:44px!important;padding:0!important;border-radius:13px!important;font-size:22px!important;display:grid!important;place-items:center!important}
#bd58FontToolbar .bd58-font-chip[data-bd58-font]::after,#bd58FontToolbar .bd58-font-chip[data-bd58-font]::before{display:none!important}
#bd58FontToolbar .bd179-font-chip{display:none!important}
/* published custom cards; no theme can make their text disappear */
#postList article[class*="style-bdtpl-"] .bdtpl-published-shell{position:relative;isolation:isolate;overflow:hidden;margin:8px 0 4px;border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);border-radius:17px;background:var(--paper)!important;color:var(--ink)!important;min-height:var(--bdtpl-pub-h,230px);padding:0;box-shadow:0 7px 18px rgba(39,54,81,.05)}
#postList article[class*="style-bdtpl-"] .bdtpl-published-shell::before{content:"";position:absolute;inset:4.5%;border:1px solid color-mix(in srgb,var(--accent) 37%,transparent);border-radius:11px;pointer-events:none}#postList article[class*="style-bdtpl-"] .bdtpl-published-shell::after{content:"ভুবনডাঙ্গার কবিতা";position:absolute;z-index:5;right:4%;bottom:3%;font:700 8px/1.2 'Noto Serif Bengali',serif;color:color-mix(in srgb,var(--accent) 55%,transparent)}
#postList article[class*="style-bdtpl-"] .bdtpl-published-shell>.post-title,#postList article[class*="style-bdtpl-"] .bdtpl-published-shell>.post-body{position:absolute!important;z-index:3!important;left:var(--x)!important;top:var(--y)!important;width:var(--w)!important;max-width:var(--w)!important;margin:0!important;padding:0!important;transform:translate(-50%,-50%)!important;background:transparent!important;border:0!important;box-shadow:none!important;color:var(--ink)!important;-webkit-text-fill-color:var(--ink)!important;text-shadow:none!important;overflow:visible!important;height:auto!important;min-height:0!important;max-height:none!important}
#postList article[class*="style-bdtpl-"] .bdtpl-published-shell>.post-title{font-size:clamp(18px,4vw,30px)!important;line-height:1.35!important}#postList article[class*="style-bdtpl-"] .bdtpl-published-shell>.post-title *{color:var(--ink)!important;-webkit-text-fill-color:var(--ink)!important}#postList article[class*="style-bdtpl-"] .bdtpl-published-shell>.post-body{font-size:clamp(13px,2.7vw,17px)!important;line-height:1.75!important;white-space:pre-wrap!important}
#postList article[class*="style-bdtpl-"] .bdtpl-published-shell>.composer-media-render,#postList article[class*="style-bdtpl-"] .bdtpl-published-shell>img.post-media{position:absolute!important;z-index:2!important;left:var(--px)!important;top:var(--py)!important;width:var(--pw)!important;height:var(--ph)!important;transform:translate(-50%,-50%)!important;margin:0!important;border-radius:var(--pr,14px)!important;overflow:hidden!important;object-fit:cover!important;object-position:var(--cx,50%) var(--cy,50%)!important}
#postList article[class*="style-bdtpl-"] .bdtpl-published-shell>.composer-media-render img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:var(--cx,50%) var(--cy,50%)!important}
@media(max-width:760px){.bdtpl-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.bdtpl-choice{height:95px}.bdtpl-tool-row{grid-template-columns:minmax(95px,1fr) 52px 42px}.bdtpl-upload{grid-column:1/-1}.bdtpl-card{min-height:280px}#postList article[class*="style-bdtpl-"] .bdtpl-published-shell{min-height:var(--bdtpl-pub-h,245px)}}
`}
function ensureStyle(){let st=$('#bd-template-library-v20-style');if(st)st.remove();st=D.createElement('style');st.id='bd-template-library-v20-style';st.textContent=styleText();D.head.appendChild(st)}
function applyTypeVars(el,type){const m=TYPE_META[type]||TYPE_META.poem;el.style.setProperty('--accent',m.accent);el.style.setProperty('--accent2',m.accent2);el.style.setProperty('--paper',m.paper);el.classList.add('bdtpl-type-'+type)}
function thumbMarkup(d,type){return `<span class="bdtpl-thumb bdtpl-v${d.v} bdtpl-type-${safe(type)}"><i class="mini-photo"></i><i class="stamp"></i><i class="wax"></i></span><b>${safe(d.label)}</b>`}
function renderPicker(){
 const picker=$('#bd58TemplatePicker'); if(!picker)return;
 let host=$('#bdtplLibrary',picker); if(!host){picker.innerHTML='<div id="bdtplLibrary"></div>';host=$('#bdtplLibrary',picker)}
 const type=currentType(),meta=TYPE_META[type]||TYPE_META.poem,can=premium(),prem=variants(type);
 if(selectedKey&&!FREE.some(x=>x.key===selectedKey)&&!prem.some(x=>x.key===selectedKey))selectedKey='';
 host.innerHTML=`<div class="bdtpl-head"><div><strong>${safe(meta.label)} — টেমপ্লেট</strong><small>GitHub template-library.js • CSS/JS only</small></div><small>${can?'Premium 8 + Free 5':'Free 5'}</small></div>
 <div class="bdtpl-section-title">সাধারণ ব্যবহারকারী • ৫টি</div><div class="bdtpl-grid bdtpl-free-grid">${FREE.map(d=>`<button type="button" class="bdtpl-choice ${selectedKey===d.key?'active':''}" data-bdtpl-key="${d.key}" aria-selected="${selectedKey===d.key}">${thumbMarkup(d,type)}</button>`).join('')}</div>
 <div class="bdtpl-section-title">Premium • ${safe(meta.label)} • ৮টি</div><div class="bdtpl-grid bdtpl-premium-grid">${prem.map(d=>`<button type="button" class="bdtpl-choice ${selectedKey===d.key?'active':''}" data-bdtpl-key="${d.key}" aria-selected="${selectedKey===d.key}" aria-disabled="${can?'false':'true'}">${thumbMarkup(d,type)}${can?'':'<span class="lock">◆</span>'}</button>`).join('')}</div>`;
}
function ensureOption(key){const sel=$('#cardStyle');if(!sel)return;let o=Array.from(sel.options).find(x=>x.value===key);if(!o){o=D.createElement('option');o.value=key;o.textContent=key;sel.appendChild(o)}sel.value=key;sel.dispatchEvent(new Event('change',{bubbles:true}))}
function resetPositions(tpl){const f=stateForm();if(!f||!tpl)return;const r=tpl.regions||DEFAULT_REGIONS[tpl.v]||DEFAULT_REGIONS[5];f.dataset.bdTplTitleX=String(r.title.x+r.title.w/2);f.dataset.bdTplTitleY=String(r.title.y+5);f.dataset.bdTplBodyX=String(r.body.x+r.body.w/2);f.dataset.bdTplBodyY=String(r.body.y+18);f.dataset.bdTplCropX='50';f.dataset.bdTplCropY='50'}
function advanceToTitle(){
 const next=$('#bdComposeCardNext');
 if(next){next.click();return}
 const c=$('#composer'),f=stateForm();if(!c||!f)return;c.dataset.bd71Stage='type';f.hidden=false;$$('[data-bd-compose-panel]',f).forEach(p=>{p.hidden=p.dataset.bdComposePanel!=='type'});requestAnimationFrame(()=>$('#postTitle')?.focus?.({preventScroll:true}))
}
function chooseTemplate(key){
 const type=currentType(),t=findTemplate(key,type); if(!t)return;
 if(!t.free&&!premium()){W.toast?.('এই টেমপ্লেটটি Premium সদস্যদের জন্য।');return}
 selectedKey=t.key;const f=stateForm();if(!f)return;f.dataset.bdTemplateKey=t.key;f.dataset.bdTemplateType=type;resetPositions(t);ensureOption(t.key);installComposeStyleBridge();renderPicker();syncTools();renderLive();setTimeout(advanceToTitle,20)
}
function fontOptions(current='serif'){return FONT_OPTIONS.map(([k,l])=>`<option value="${k}" ${k===current?'selected':''}>${l}</option>`).join('')+customFonts.map(x=>`<option value="${safe(x.key)}" ${x.key===current?'selected':''}>${safe(x.label)}</option>`).join('')}
function fontFamily(key){const b=FONT_OPTIONS.find(x=>x[0]===key);if(b)return b[2];return customFonts.find(x=>x.key===key)?.family||FONT_OPTIONS[0][2]}
function buildTools(kind){
 const f=stateForm(),pre='bdTpl'+(kind==='title'?'Title':'Body'),isP=premium();
 const font=f?.dataset[pre+'Font']||'serif',color=f?.dataset[pre+'Color']||(kind==='title'?'#173153':'#22364e'),bold=f?.dataset[pre+'Bold']==='1',size=Number(f?.dataset[pre+'Size']||(kind==='title'?28:17));
 return `<div class="bdtpl-tools" data-bdtpl-tools="${kind}"><div class="bdtpl-tools-head"><strong>${kind==='title'?'শিরোনাম':'মূল লেখা'} — ফন্ট ও রং</strong><small>${isP?'Premium: ফোন থেকে ফন্টও যোগ করতে পারবেন':'Free: বেসিক ফন্ট'}</small></div><div class="bdtpl-tool-row"><select data-bdtpl-font="${kind}" aria-label="ফন্ট">${fontOptions(font)}</select><input type="color" value="${safe(color)}" data-bdtpl-color="${kind}" aria-label="রং"><button type="button" data-bdtpl-bold="${kind}" class="${bold?'active':''}" aria-label="Bold">B</button>${isP?`<label class="bdtpl-upload">＋ ফোনের ফন্ট<input type="file" accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2" data-bdtpl-font-file="${kind}"></label>`:''}</div><label class="bdtpl-size">সাইজ <input type="range" min="${kind==='title'?18:12}" max="${kind==='title'?54:34}" value="${size}" data-bdtpl-size="${kind}"><output>${size}</output></label></div>`
}
function ensureTools(){
 const title=$('#postTitle'),body=$('#postBody');if(!title||!body)return;
 let tt=$('#bdtplTitleTools');if(!tt){tt=D.createElement('div');tt.id='bdtplTitleTools';title.insertAdjacentElement('afterend',tt)}
 let bt=$('#bdtplBodyTools');if(!bt){bt=D.createElement('div');bt.id='bdtplBodyTools';body.insertAdjacentElement('beforebegin',bt)}
 tt.innerHTML=buildTools('title');bt.innerHTML=buildTools('body');
}
function syncTools(){ensureTools();applyEditorStyles()}
async function importFont(file,kind){
 if(!file||!premium())return;const ext=(file.name.split('.').pop()||'').toLowerCase();if(!['ttf','otf','woff','woff2'].includes(ext)){W.toast?.('TTF, OTF, WOFF বা WOFF2 ফন্ট দিন।');return}
 const key='custom-'+Date.now().toString(36),label=file.name.replace(/\.[^.]+$/,'').slice(0,40),family='BDCustom_'+Date.now().toString(36);
 try{const buf=await file.arrayBuffer();const face=new FontFace(family,buf);await face.load();D.fonts.add(face);customFonts.push({key,label,family:`"${family}","Noto Serif Bengali",serif`});const f=stateForm(),pre='bdTpl'+(kind==='title'?'Title':'Body');f.dataset[pre+'Font']=key;syncTools();renderLive();W.toast?.('ফন্ট যোগ হয়েছে। এই কম্পোজে ব্যবহার হচ্ছে।')}catch(e){console.warn(e);W.toast?.('ফন্টটি লোড করা যায়নি।')}
}
function applyEditorStyles(){
 const f=stateForm();if(!f||!live)return;
 for(const kind of ['title','body']){const pre='bdTpl'+(kind==='title'?'Title':'Body'),el=$(`[data-bdtpl-edit="${kind}"]`,live);if(!el)continue;el.style.fontFamily=fontFamily(f.dataset[pre+'Font']||'serif');el.style.color=f.dataset[pre+'Color']||(kind==='title'?'#173153':'#22364e');el.style.fontWeight=f.dataset[pre+'Bold']==='1'?'800':'400';el.style.fontSize=(Number(f.dataset[pre+'Size']||(kind==='title'?28:17)))+'px'}
}
function liveMarkup(tpl,type){
 const m=TYPE_META[type]||TYPE_META.poem,r=tpl?.regions||DEFAULT_REGIONS[5],photo=r.photo;return `<div class="bdtpl-card bdtpl-v${tpl?.v||5} bdtpl-type-${safe(type)}" data-bdtpl-card><div class="bdtpl-decoration"><i class="bdtpl-leaf l1"></i><i class="bdtpl-leaf l2"></i><i class="bdtpl-leaf l3"></i><i class="bdtpl-line"></i><i class="bdtpl-moon"></i><i class="bdtpl-wax"></i><i class="bdtpl-stamp"></i></div>${photo?`<button type="button" class="bdtpl-photo" data-bdtpl-photo data-shape="${photo.shape}" aria-label="ছবি যোগ/এডজাস্ট করুন"><span>${coverURL?'ছবি টেনে এডজাস্ট করুন':'＋ ছবি যোগ করুন'}</span>${coverURL?`<img src="${coverURL}" alt="" draggable="false">`:''}</button>`:''}<div class="bdtpl-edit" data-bdtpl-edit="title" contenteditable="true" role="textbox" aria-label="শিরোনাম"><button type="button" class="bdtpl-drag" contenteditable="false" data-bdtpl-drag="title" aria-label="শিরোনাম সরান">⋮⋮</button></div><div class="bdtpl-edit" data-bdtpl-edit="body" contenteditable="true" role="textbox" aria-multiline="true" aria-label="মূল লেখা"><button type="button" class="bdtpl-drag" contenteditable="false" data-bdtpl-drag="body" aria-label="লেখা সরান">⋮⋮</button></div><small class="bdtpl-watermark">ভুবনডাঙ্গার কবিতা</small></div>`}
function positionLive(){
 if(!live)return;const f=stateForm(),tpl=selectedTemplate();if(!f||!tpl)return;const r=tpl.regions||DEFAULT_REGIONS[tpl.v];
 const set=(kind,x,y,w)=>{const el=$(`[data-bdtpl-edit="${kind}"]`,live);if(!el)return;el.style.left=(Number(f.dataset['bdTpl'+(kind==='title'?'Title':'Body')+'X'])||x+w/2)+'%';el.style.top=(Number(f.dataset['bdTpl'+(kind==='title'?'Title':'Body')+'Y'])||y+10)+'%';el.style.width=w+'%';el.style.transform='translate(-50%,-50%)'};
 set('title',r.title.x,r.title.y,r.title.w);set('body',r.body.x,r.body.y,r.body.w);
 const p=$('[data-bdtpl-photo]',live);if(p&&r.photo){p.style.left=(r.photo.x+r.photo.w/2)+'%';p.style.top=(r.photo.y+r.photo.h/2)+'%';p.style.width=r.photo.w+'%';p.style.height=r.photo.h+'%';p.style.transform=(r.photo.shape==='paper'?'translate(-50%,-50%) rotate(3deg)':'translate(-50%,-50%)');const img=$('img',p);if(img)img.style.objectPosition=(f.dataset.bdTplCropX||50)+'% '+(f.dataset.bdTplCropY||50)+'%'}
 applyEditorStyles();
}
function renderLive(){
 const f=stateForm(),tpl=selectedTemplate();if(!f||!tpl)return;
 let root=$('#bdtplLiveEditor');if(!root){root=D.createElement('section');root.id='bdtplLiveEditor'}live=root;
 const stage=$('#composer')?.dataset.bd71Stage||'card',type=currentType();
 if(stage==='write'){const panel=$('[data-bd-compose-panel="write"]',f);panel?.insertBefore(root,$('#bdtplBodyTools',panel)||$('#postBody',panel))}else{const panel=$('[data-bd-compose-panel="type"]',f),anchor=$('#bdtplTitleTools',panel)||$('#postTitle',panel);anchor?.insertAdjacentElement('afterend',root)}
 root.innerHTML=liveMarkup(tpl,type);const title=$('[data-bdtpl-edit="title"]',root),body=$('[data-bdtpl-edit="body"]',root);title.childNodes[title.childNodes.length-1]?.remove?.(); // no-op safety
 const t=$('#postTitle')?.value||'শিরোনাম লিখুন';const b=$('#postBody')?.value||'আপনার লেখা এখানে লিখুন…';
 // Preserve drag buttons while setting text.
 const tdrag=$('[data-bdtpl-drag="title"]',root),bdrag=$('[data-bdtpl-drag="body"]',root);title.textContent=t;title.prepend(tdrag);body.textContent=b;body.prepend(bdrag);
 positionLive();
 if(stage==='write')$('#postBody')?.classList.add('bdtpl-native-hidden');else $('#postBody')?.classList.remove('bdtpl-native-hidden');
}
function textOnly(el){const c=el.cloneNode(true);c.querySelectorAll('button').forEach(b=>b.remove());return c.innerText.replace(/^\s+|\s+$/g,'')}
function handleLiveInput(e){const el=e.target.closest?.('[data-bdtpl-edit]');if(!el)return;const kind=el.dataset.bdtplEdit,val=textOnly(el),target=kind==='title'?$('#postTitle'):$('#postBody');if(target&&target.value!==val){target.value=val;target.dispatchEvent(new Event('input',{bubbles:true}))}}
function startDrag(e,kind){if(!premium())return;const f=stateForm(),card=$('[data-bdtpl-card]',live),el=$(`[data-bdtpl-edit="${kind}"]`,live);if(!f||!card||!el)return;const r=card.getBoundingClientRect();dragging={mode:'text',kind,pid:e.pointerId,card,el,r};el.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation()}
function moveDrag(e){if(!dragging)return;const f=stateForm();if(!f)return;if(dragging.mode==='text'){const {r,kind,el}=dragging,x=clamp((e.clientX-r.left)/r.width*100,4,96),y=clamp((e.clientY-r.top)/r.height*100,5,95);f.dataset['bdTpl'+(kind==='title'?'Title':'Body')+'X']=x.toFixed(1);f.dataset['bdTpl'+(kind==='title'?'Title':'Body')+'Y']=y.toFixed(1);el.style.left=x+'%';el.style.top=y+'%';e.preventDefault()}else if(dragging.mode==='photo'){const {r,sx,sy,cx,cy,img}=dragging,x=clamp(cx+(e.clientX-sx)/Math.max(1,r.width)*100,0,100),y=clamp(cy+(e.clientY-sy)/Math.max(1,r.height)*100,0,100);f.dataset.bdTplCropX=x.toFixed(1);f.dataset.bdTplCropY=y.toFixed(1);img.style.objectPosition=x+'% '+y+'%';e.preventDefault()}}
function endDrag(){dragging=null}
function startPhotoDrag(e){const p=e.target.closest?.('[data-bdtpl-photo]'),img=p?.querySelector('img');if(!p||!img||!premium())return;const f=stateForm(),r=p.getBoundingClientRect();dragging={mode:'photo',pid:e.pointerId,r,sx:e.clientX,sy:e.clientY,cx:Number(f.dataset.bdTplCropX||50),cy:Number(f.dataset.bdTplCropY||50),img};p.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation()}
function syncFromInputs(e){if(!selectedKey)return;if(e.target.matches?.('#postTitle,#postBody')){const el=$(`[data-bdtpl-edit="${e.target.id==='postTitle'?'title':'body'}"]`,live);if(el&&D.activeElement!==el){const drag=$('.bdtpl-drag',el);el.textContent=e.target.value||'';if(drag)el.prepend(drag)}}}
function positionToolsFromEvent(e){const kind=e.target.dataset.bdtplFont||e.target.dataset.bdtplColor||e.target.dataset.bdtplBold||e.target.dataset.bdtplSize;if(!kind)return;const f=stateForm(),pre='bdTpl'+(kind==='title'?'Title':'Body');if(e.target.dataset.bdtplFont){f.dataset[pre+'Font']=e.target.value}else if(e.target.dataset.bdtplColor){f.dataset[pre+'Color']=e.target.value}else if(e.target.dataset.bdtplSize){f.dataset[pre+'Size']=e.target.value;e.target.nextElementSibling&&(e.target.nextElementSibling.textContent=e.target.value)}else if(e.target.dataset.bdtplBold){f.dataset[pre+'Bold']=f.dataset[pre+'Bold']==='1'?'0':'1';e.target.classList.toggle('active',f.dataset[pre+'Bold']==='1')}applyEditorStyles()}
function stageChanged(){renderPicker();if(!selectedKey)return;syncTools();renderLive()}
function resetLibrary(){selectedKey='';coverURL&&URL.revokeObjectURL?.(coverURL);coverURL='';const f=stateForm();if(f){delete f.dataset.bdTemplateKey;delete f.dataset.bdTemplateType}$('#postBody')?.classList.remove('bdtpl-native-hidden');$('#bdtplLiveEditor')?.remove();renderPicker()}
function parseClass(card){const c=Array.from(card.classList).find(x=>/^style-bdtpl-/.test(x));if(!c)return null;const m=c.match(/^style-(bdtpl-(poem|prolap|midnight|letter|environment|children|recitation|news|discussion)-(\d{2}))(?:_tx(\d+)_ty(\d+)_bx(\d+)_by(\d+)_cx(\d+)_cy(\d+))?/);if(!m)return null;return{key:m[1],type:m[2],v:Number(m[3]),tx:Number(m[4]||50),ty:Number(m[5]||20),bx:Number(m[6]||50),by:Number(m[7]||55),cx:Number(m[8]||50),cy:Number(m[9]||50)}}
function decoratePublished(card){
 if(!card||card.dataset.bdtplDecorated==='1')return;const info=parseClass(card);if(!info)return;const tpl=variants(info.type).find(x=>x.key===info.key);if(!tpl)return;const title=$('.post-title',card),body=$('.post-body',card);if(!title||!body)return;card.dataset.bdtplDecorated='1';const shell=D.createElement('div');shell.className=`bdtpl-published-shell bdtpl-v${info.v} bdtpl-type-${info.type}`;applyTypeVars(shell,info.type);const media=$('.composer-media-render',card)||$('img.post-media',card);title.before(shell);shell.append(title,body);if(media)shell.append(media);const r=tpl.regions;title.style.setProperty('--x',info.tx+'%');title.style.setProperty('--y',info.ty+'%');title.style.setProperty('--w',r.title.w+'%');body.style.setProperty('--x',info.bx+'%');body.style.setProperty('--y',info.by+'%');body.style.setProperty('--w',r.body.w+'%');if(media&&r.photo){media.style.setProperty('--px',(r.photo.x+r.photo.w/2)+'%');media.style.setProperty('--py',(r.photo.y+r.photo.h/2)+'%');media.style.setProperty('--pw',r.photo.w+'%');media.style.setProperty('--ph',r.photo.h+'%');media.style.setProperty('--pr',r.photo.shape==='circle'?'50%':r.photo.shape==='oval'?'50%':'14px');media.style.setProperty('--cx',info.cx+'%');media.style.setProperty('--cy',info.cy+'%')}else if(media){media.style.display='none'}const len=(title.textContent||'').length+(body.textContent||'').length;const h=clamp(205+Math.ceil(len/95)*34+(media&&r.photo?45:0),230,520);shell.style.setProperty('--bdtpl-pub-h',h+'px')
}
function scanPublished(root=D){if(root.matches?.('article.post,article.bd-live-post'))decoratePublished(root);root.querySelectorAll?.('#postList article.post,#postList article.bd-live-post').forEach(decoratePublished)}
function mount(){
 ensureStyle();installComposeStyleBridge();renderPicker();ensureTools();
 const composer=$('#composer');if(composer&&!composer.__bdtplObs){composer.__bdtplObs=true;new MutationObserver(stageChanged).observe(composer,{attributes:true,attributeFilter:['data-bd71-stage']})}
 scanPublished();
}
// Event authority for this library.
W.addEventListener('pointerup',e=>{
 const choice=e.target.closest?.('[data-bdtpl-key]');if(choice){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();chooseTemplate(choice.dataset.bdtplKey);return}
 const drag=e.target.closest?.('[data-bdtpl-drag]');if(drag){startDrag(e,drag.dataset.bdtplDrag);return}
 const photo=e.target.closest?.('[data-bdtpl-photo]');if(photo){if(photo.querySelector('img'))startPhotoDrag(e);else{e.preventDefault();e.stopPropagation();$('#postImage')?.click()}return}
},true);
D.addEventListener('pointerdown',e=>{const drag=e.target.closest?.('[data-bdtpl-drag]');if(drag)startDrag(e,drag.dataset.bdtplDrag);else if(e.target.closest?.('[data-bdtpl-photo] img'))startPhotoDrag(e)},true);
D.addEventListener('pointermove',moveDrag,true);D.addEventListener('pointerup',endDrag,true);D.addEventListener('pointercancel',endDrag,true);
D.addEventListener('input',e=>{handleLiveInput(e);syncFromInputs(e);positionToolsFromEvent(e)},true);
D.addEventListener('change',async e=>{
 if(e.target.matches?.('input[name="postType"]')){const f=stateForm();if(f)f.dataset.bdChosenType=e.target.value;selectedKey='';delete f?.dataset?.bdTemplateKey;setTimeout(()=>{renderPicker();resetLibrary()},0);return}
 if(e.target.matches?.('[data-bdtpl-font],[data-bdtpl-color],[data-bdtpl-size]'))positionToolsFromEvent(e);
 if(e.target.matches?.('[data-bdtpl-font-file]')){await importFont(e.target.files?.[0],e.target.dataset.bdtplFontFile);e.target.value=''}
 if(e.target.id==='postImage'){const file=e.target.files?.[0];if(file){try{coverURL&&URL.revokeObjectURL(coverURL)}catch(_){}coverURL=URL.createObjectURL(file);renderLive()}}
},true);
D.addEventListener('click',e=>{const b=e.target.closest?.('[data-bdtpl-bold]');if(b){e.preventDefault();positionToolsFromEvent({target:b})}},true);
D.addEventListener('reset',e=>{if(e.target?.id==='composerForm')setTimeout(resetLibrary,0)},true);
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n.nodeType===1)scanPublished(n)}).observe(D.documentElement,{subtree:true,childList:true});
D.addEventListener('bd:three-part-ready',()=>setTimeout(mount,0));D.addEventListener('bd:auth-ready',()=>setTimeout(()=>{renderPicker();syncTools()},30));
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>setTimeout(mount,50),{once:true});else setTimeout(mount,50);
W.BhubondangaTemplateLibrary={version:'20',free:FREE,variants,choose:chooseTemplate,current:()=>selectedKey,composeStyle:makeStyleKey,mount};
})();
