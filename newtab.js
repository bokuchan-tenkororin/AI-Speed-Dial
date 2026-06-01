const DEFAULT_ICONS=[
 {name:"ChatGPT",url:"https://chatgpt.com/",icon:"https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128"},
 {name:"Copilot",url:"https://copilot.microsoft.com/",icon:"https://copilot.microsoft.com/favicon.ico"},
 {name:"Gemini",url:"https://gemini.google.com/",icon:"https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128"},
 {name:"Claude",url:"https://claude.ai/",icon:"https://www.google.com/s2/favicons?domain=claude.ai&sz=128"},
 {name:"GenSpark",url:"https://www.genspark.ai/",icon:"https://www.google.com/s2/favicons?domain=genspark.ai&sz=128"},
 {name:"Manus",url:"https://manus.im/",icon:"https://www.google.com/s2/favicons?domain=manus.im&sz=128"},
 {name:"Perplexity",url:"https://www.perplexity.ai/",icon:"https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128"},
 {name:"Grok",url:"https://grok.com/",icon:"https://www.google.com/s2/favicons?domain=grok.com&sz=128"},
 {name:"Meta AI",url:"https://meta.ai/",icon:"https://www.google.com/s2/favicons?domain=meta.ai&sz=128"},
 {name:"Mistral",url:"https://chat.mistral.ai/",icon:"https://www.google.com/s2/favicons?domain=mistral.ai&sz=128"},
 {name:"Qwen",url:"https://chat.qwen.ai/",icon:"https://www.google.com/s2/favicons?domain=chat.qwen.ai&sz=128"},
 {name:"DeepSeek",url:"https://chat.deepseek.com/",icon:"https://www.google.com/s2/favicons?domain=chat.deepseek.com&sz=128"}
];
const I18N={
 ja:{options:"\u2699\ufe0f \u8a2d\u5b9a",add:"\u8ffd\u52a0",dlgTitle:"\u30b5\u30a4\u30c8\u3092\u8ffd\u52a0",dlgName:"\u540d\u524d",dlgUrl:"URL",dlgIcon:"\u30a2\u30a4\u30b3\u30f3URL\uff08\u4efb\u610f\uff09",cancel:"\u30ad\u30e3\u30f3\u30bb\u30eb",ok:"\u8ffd\u52a0"},
 en:{options:"\u2699\ufe0f Settings",add:"Add",dlgTitle:"Add Site",dlgName:"Name",dlgUrl:"URL",dlgIcon:"Icon URL (optional)",cancel:"Cancel",ok:"Add"},
 th:{options:"\u2699\ufe0f \u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32",add:"\u0e40\u0e1e\u0e34\u0e48\u0e21",dlgTitle:"\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e40\u0e27\u0e47\u0e1a\u0e44\u0e0b\u0e15\u0e4c",dlgName:"\u0e0a\u0e37\u0e48\u0e2d",dlgUrl:"URL",dlgIcon:"URL \u0e44\u0e2d\u0e04\u0e2d\u0e19 (\u0e44\u0e21\u0e48\u0e08\u0e33\u0e40\u0e1b\u0e47\u0e19)",cancel:"\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01",ok:"\u0e40\u0e1e\u0e34\u0e48\u0e21"}
};
const ENGINE_NAMES={google_ai:{ja:"Google AI\u30e2\u30fc\u30c9",en:"Google AI Mode",th:"Google AI Mode"},google:{ja:"Google",en:"Google",th:"Google"},bing:{ja:"Bing",en:"Bing",th:"Bing"},duckduckgo:{ja:"DuckDuckGo",en:"DuckDuckGo",th:"DuckDuckGo"},custom:{ja:"\u30ab\u30b9\u30bf\u30e0",en:"Custom",th:"\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e40\u0e2d\u0e07"}};
const grid=document.getElementById('grid'),promptInput=document.getElementById('promptInput'),sendBtn=document.getElementById('sendBtn');
let settings={cols:6,rows:2,icons:DEFAULT_ICONS,enableNewTab:true,enableHome:true,theme:'system',lang:'ja',searchEngine:'google_ai',customUrl:''};
function t(k){return (I18N[settings.lang]||I18N.en)[k]||k}
async function load(){
 const d=await chrome.storage.sync.get(['cols','rows','icons','enableNewTab','enableHome','theme','lang','searchEngine','customUrl']);
 settings.cols=d.cols||6; settings.rows=d.rows||2; settings.enableNewTab=d.enableNewTab!==false; settings.enableHome=d.enableHome!==false;
 settings.theme=d.theme||'system'; settings.lang=d.lang||'ja'; settings.searchEngine=d.searchEngine||'google_ai'; settings.customUrl=d.customUrl||'';
 settings.icons=(Array.isArray(d.icons)&&d.icons.length)?d.icons:DEFAULT_ICONS;
 if(!d.icons||!d.icons.length) await chrome.storage.sync.set({icons:settings.icons});
 const need=Math.ceil(settings.icons.length/settings.cols); if(need!==settings.rows){settings.rows=need;await chrome.storage.sync.set({rows:need})}
 const mode=new URLSearchParams(location.search).get('mode');
 if(mode==='newtab'&&!settings.enableNewTab){location.replace('about:blank');return}
 if(mode!=='newtab'&&!settings.enableHome){location.replace('https://www.google.com');return}
 document.documentElement.dataset.theme=settings.theme; document.documentElement.lang=settings.lang;
 const ename=(ENGINE_NAMES[settings.searchEngine]||ENGINE_NAMES.google_ai)[settings.lang]||'Google AI Mode';
 if(settings.lang==='ja'){promptInput.placeholder=`${ename}\u3067\u691c\u7d22 (Enter)`}else if(settings.lang==='th'){promptInput.placeholder=`\u0e04\u0e49\u0e19\u0e2b\u0e32\u0e14\u0e49\u0e27\u0e22 ${ename} (Enter)`}else{promptInput.placeholder=`Search with ${ename} (Enter)`}
 const hint=document.querySelector('.hint'); if(hint) hint.style.display='none';
 document.getElementById('optionsBtn').textContent=t('options');
 render();
}
function render(){
 grid.style.gridTemplateColumns=`repeat(${settings.cols},minmax(120px,1fr))`; grid.innerHTML='';
 settings.icons.forEach((it,i)=>{
   const d=document.createElement('div');d.className='tile';d.draggable=true;d.dataset.idx=i;
   d.innerHTML=`<img src="${it.icon}"><span>${it.name}</span>`; d.onclick=()=>chrome.tabs.update({url:it.url});
   d.ondragstart=e=>{e.dataTransfer.setData('text/plain',i);d.classList.add('dragging')}; d.ondragend=()=>d.classList.remove('dragging'); d.ondragover=e=>e.preventDefault();
   d.ondrop=async e=>{e.preventDefault();const f=+e.dataTransfer.getData('text/plain'),to=+d.dataset.idx,a=[...settings.icons];[a[f],a[to]]=[a[to],a[f]];settings.icons=a;await chrome.storage.sync.set({icons:a});render()};
   grid.appendChild(d);
 });
 const p=document.createElement('div');p.className='tile plus';p.innerHTML=`<div style="font-size:36px;opacity:.6;line-height:48px">+</div><span>${t('add')}</span>`;p.onclick=showAdd;grid.appendChild(p);
}
function showAdd(){
 document.getElementById('addDialog')?.remove(); const o=document.createElement('div');o.id='addDialog';
 o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999';
 o.innerHTML=`<div style="background:var(--card);color:var(--text);padding:20px;border-radius:16px;width:340px">
  <h3 style="margin:0 0 12px">${t('dlgTitle')}</h3>
  <label>${t('dlgName')}<br><input id="n" style="width:100%;padding:8px;margin-top:4px"></label><br><br>
  <label>${t('dlgUrl')}<br><input id="u" placeholder="https://example.com" style="width:100%;padding:8px;margin-top:4px"></label><br><br>
  <label>${t('dlgIcon')}<br><input id="i" style="width:100%;padding:8px;margin-top:4px"></label><br><br>
  <div style="text-align:right"><button id="c">${t('cancel')}</button> <button id="o">${t('ok')}</button></div>
 </div>`; document.body.appendChild(o);
 const n=o.querySelector('#n'),u=o.querySelector('#u'),i=o.querySelector('#i'); n.focus();
 o.querySelector('#c').onclick=()=>o.remove();
 o.querySelector('#o').onclick=async()=>{const name=n.value.trim();let url=u.value.trim();if(!name||!url)return;if(!/^https?:\/\//i.test(url))url='https://'+url;let icon=i.value.trim();if(!icon){try{icon=`https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`}catch{}}settings.icons.push({name,url,icon});const need=Math.ceil(settings.icons.length/settings.cols);if(need!==settings.rows)settings.rows=need;await chrome.storage.sync.set({icons:settings.icons,rows:settings.rows});o.remove();render();};
}
async function sendPrompt(){const q=promptInput.value.trim();if(!q)return;let url;switch(settings.searchEngine){case'google':url=`https://www.google.com/search?q=${encodeURIComponent(q)}`;break;case'bing':url=`https://www.bing.com/search?q=${encodeURIComponent(q)}`;break;case'duckduckgo':url=`https://duckduckgo.com/?q=${encodeURIComponent(q)}`;break;case'custom':url=(settings.customUrl||'').replace('%s',encodeURIComponent(q));if(!url)url=`https://www.google.com/search?q=${encodeURIComponent(q)}`;break;default:url=`https://www.google.com/search?q=${encodeURIComponent(q)}&udm=50`;}location.href=url;}
sendBtn.onclick=sendPrompt; promptInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendPrompt()}});
document.getElementById('optionsBtn').onclick=()=>chrome.runtime.openOptionsPage(); load();