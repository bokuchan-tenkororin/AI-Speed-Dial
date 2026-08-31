
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

const grid=document.getElementById('grid'),promptInput=document.getElementById('promptInput'),sendBtn=document.getElementById('sendBtn');
let settings={cols:6,rows:2,icons:DEFAULT_ICONS,enableNewTab:true,enableHome:true,theme:'system',searchEngine:'google_ai',customUrl:'', bookmarkFolderId:null};

function i18n(key, ...args){
  try{
    if (chrome.i18n && chrome.i18n.getMessage){
      const m = chrome.i18n.getMessage(key, args.length?args:undefined);
      if (m) return m;
    }
  }catch(e){}
  const fb={
    options:'⚙️ Settings', add:'Add', dlgTitle:'Add Site', dlgName:'Name', dlgUrl:'URL', dlgIcon:'Icon URL (optional)', cancel:'Cancel', ok:'Add',
    searchPlaceholder:'Search with $1 (Enter)', optGAi:'Google AI Mode', optG:'Google', optBing:'Bing', optDDG:'DuckDuckGo', optCustom:'Custom'
  };
  let s = fb[key]||key;
  if(args && args[0]) s = s.replace('$1', args[0]);
  return s;
}

function getEngineDisplayName(id){
  const map={
    google_ai: i18n('optGAi'),
    google: i18n('optG'),
    bing: i18n('optBing'),
    duckduckgo: i18n('optDDG'),
    custom: i18n('optCustom')
  };
  return map[id]||map.google_ai;
}

// Bookmark helpers
function encodeConfig(obj){
  try{
    const json = JSON.stringify(obj);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return encodeURIComponent(b64);
  }catch(e){
    return encodeURIComponent(JSON.stringify(obj));
  }
}
function decodeConfigFromUrl(url){
  try{
    const idx = url.indexOf('#');
    if (idx===-1) return null;
    let frag = url.substring(idx+1);
    frag = decodeURIComponent(frag);
    try{
      const jsonStr = decodeURIComponent(escape(atob(frag)));
      return JSON.parse(jsonStr);
    }catch{}
    try{
      const jsonStr = atob(frag);
      return JSON.parse(jsonStr);
    }catch{}
    try{
      return JSON.parse(decodeURIComponent(url.substring(idx+1)));
    }catch{}
    return null;
  }catch(e){ return null; }
}

async function findConfigBookmark(folderId){
  try{
    const children = await chrome.bookmarks.getChildren(folderId);
    for(const c of children){
      if(!c.url) continue;
      if(c.title.includes('AI_SPEED_DIAL_CONFIG') || c.url.includes('aispeeddial.local') || c.url.includes('aispeeddial.config')){
        return c;
      }
    }
    for(const c of children){
      if(!c.url || !c.url.includes('#')) continue;
      const dec = decodeConfigFromUrl(c.url);
      if(dec && dec.icons && Array.isArray(dec.icons)) return c;
    }
    return null;
  }catch{ return null; }
}

async function loadFromBookmarkFolder(folderId){
  if(!folderId) return null;
  try{
    const cfgBm = await findConfigBookmark(folderId);
    if(cfgBm){
      const cfg = decodeConfigFromUrl(cfgBm.url);
      if(cfg) return cfg;
    }
    return null;
  }catch(e){ console.warn('loadFromBookmarkFolder failed', e); return null; }
}

async function saveToBookmarkFolder(folderId, fullSettings){
  // 擬似ブックマークのみ：個別ブックマークは作成しない
  if(!folderId) return;
  try{
    const children = await chrome.bookmarks.getChildren(folderId);
    for(const c of children){
      if(c.title.includes('AI_SPEED_DIAL_CONFIG') || (c.url && (c.url.includes('aispeeddial.local') || c.url.includes('aispeeddial.config')))){
        try{ await chrome.bookmarks.remove(c.id); }catch{}
      }
    }
    const encoded = encodeConfig(fullSettings);
    const configUrl = `https://aispeeddial.local/config#${encoded}`;
    const configTitle = i18n('configBookmarkTitle') || '⚙ AI_SPEED_DIAL_CONFIG';
    await chrome.bookmarks.create({parentId: folderId, title: configTitle, url: configUrl});
  }catch(e){ console.error('saveToBookmarkFolder error', e); }
}


async function load(){
  const d = await chrome.storage.sync.get(['cols','rows','icons','enableNewTab','enableHome','theme','searchEngine','customUrl','bookmarkFolderId']);
  settings.cols=d.cols||6;
  settings.rows=d.rows||2;
  settings.enableNewTab=d.enableNewTab!==false;
  settings.enableHome=d.enableHome!==false;
  settings.theme=d.theme||'system';
  settings.searchEngine=d.searchEngine||'google_ai';
  settings.customUrl=d.customUrl||'';
  settings.bookmarkFolderId = d.bookmarkFolderId || null;
  settings.icons=(Array.isArray(d.icons)&&d.icons.length)?d.icons:DEFAULT_ICONS;
  if(!d.icons||!d.icons.length) await chrome.storage.sync.set({icons:settings.icons});

  if(settings.bookmarkFolderId){
    try{
      const bmData = await loadFromBookmarkFolder(settings.bookmarkFolderId);
      if(bmData){
        if(bmData.icons && bmData.icons.length) settings.icons = bmData.icons;
        if(bmData.cols) settings.cols = bmData.cols;
        if(bmData.rows) settings.rows = bmData.rows;
        if(bmData.theme) settings.theme = bmData.theme;
        if(bmData.searchEngine) settings.searchEngine = bmData.searchEngine;
        if(bmData.customUrl !== undefined) settings.customUrl = bmData.customUrl;
        if(bmData.enableNewTab!==undefined) settings.enableNewTab = bmData.enableNewTab;
        if(bmData.enableHome!==undefined) settings.enableHome = bmData.enableHome;
        // sync back to storage so other parts see it
        await chrome.storage.sync.set({
          icons: settings.icons,
          cols: settings.cols,
          rows: settings.rows,
          theme: settings.theme,
          searchEngine: settings.searchEngine,
          customUrl: settings.customUrl,
          enableNewTab: settings.enableNewTab,
          enableHome: settings.enableHome
        });
      }
    }catch(e){ console.warn('bookmark load failed', e); }
  }

  const need=Math.ceil(settings.icons.length/settings.cols);
  if(need!==settings.rows){
    settings.rows=need;
    await chrome.storage.sync.set({rows:need});
  }
  const mode=new URLSearchParams(location.search).get('mode');
  if(mode==='newtab'&&!settings.enableNewTab){location.replace('about:blank');return}
  if(mode!=='newtab'&&!settings.enableHome){location.replace('https://www.google.com');return}

  document.documentElement.dataset.theme=settings.theme;
  try{
    const uiLang = chrome.i18n.getUILanguage() || navigator.language || 'en';
    document.documentElement.lang = uiLang;
  }catch{ document.documentElement.lang = 'en'; }

  const ename = getEngineDisplayName(settings.searchEngine);
  promptInput.placeholder = i18n('searchPlaceholder', ename);

  document.getElementById('optionsBtn').textContent = i18n('options');
  render();
}

function render(){
 grid.style.gridTemplateColumns=`repeat(${settings.cols},minmax(120px,1fr))`; 
 grid.innerHTML='';
 let dragFrom = null;

 settings.icons.forEach((it,i)=>{
   const d=document.createElement('div');
   d.className='tile';
   d.draggable=true;
   d.dataset.idx=i;
   d.innerHTML=`<img src="${it.icon}"><span>${it.name}</span>`;
   d.onclick=()=>chrome.tabs.update({url:it.url});

   d.ondragstart=e=>{
     dragFrom = i;
     e.dataTransfer.setData('text/plain', String(i));
     e.dataTransfer.effectAllowed='move';
     requestAnimationFrame(()=>d.classList.add('dragging'));
   };
   d.ondragend=()=>{
     d.classList.remove('dragging');
     dragFrom = null;
     document.querySelectorAll('.tile').forEach(t=>t.classList.remove('drag-over'));
   };
   d.ondragover=e=>{
     e.preventDefault();
     e.dataTransfer.dropEffect='move';
     if(dragFrom!==null && dragFrom!==i){
       d.classList.add('drag-over');
     }
   };
   d.ondragleave=()=>{
     d.classList.remove('drag-over');
   };
   d.ondrop=async e=>{
     e.preventDefault();
     d.classList.remove('drag-over');
     const raw = e.dataTransfer.getData('text/plain');
     const from = parseInt(raw,10);
     const to = parseInt(d.dataset.idx,10);
     if(isNaN(from)||isNaN(to)||from===to) return;
     const a=[...settings.icons];
     const [moved] = a.splice(from,1);
     a.splice(to,0,moved);
     settings.icons=a;
     const need=Math.ceil(a.length/settings.cols);
     if(need!==settings.rows) settings.rows=need;
     await chrome.storage.sync.set({icons:a,rows:settings.rows});
     if(settings.bookmarkFolderId){
       try{ await saveToBookmarkFolder(settings.bookmarkFolderId, settings); }catch{}
     }
     render();
   };
   grid.appendChild(d);
 });

 grid.ondragover=e=>e.preventDefault();
 grid.ondrop=async e=>{
   if(e.target!==grid) return;
   const raw=e.dataTransfer.getData('text/plain');
   const from=parseInt(raw,10);
   if(isNaN(from)) return;
   const a=[...settings.icons];
   if(from<0||from>=a.length) return;
   const [moved]=a.splice(from,1);
   a.push(moved);
   settings.icons=a;
   await chrome.storage.sync.set({icons:a,rows:Math.ceil(a.length/settings.cols)});
   if(settings.bookmarkFolderId){
     try{ await saveToBookmarkFolder(settings.bookmarkFolderId, settings); }catch{}
   }
   render();
 };

 const p=document.createElement('div');
 p.className='tile plus';
 p.innerHTML=`<div style="font-size:36px;opacity:.6;line-height:48px">+</div><span>${i18n('add')}</span>`;
 p.onclick=showAdd;
 grid.appendChild(p);
}

function showAdd(){
 document.getElementById('addDialog')?.remove();
 const o=document.createElement('div');o.id='addDialog';
 o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999';
 o.innerHTML=`<div style="background:var(--card);color:var(--text);padding:20px;border-radius:16px;width:340px">
  <h3 style="margin:0 0 12px">${i18n('dlgTitle')}</h3>
  <label>${i18n('dlgName')}<br><input id="n" style="width:100%;padding:8px;margin-top:4px"></label><br><br>
  <label>${i18n('dlgUrl')}<br><input id="u" placeholder="https://example.com" style="width:100%;padding:8px;margin-top:4px"></label><br><br>
  <label>${i18n('dlgIcon')}<br><input id="i" style="width:100%;padding:8px;margin-top:4px"></label><br><br>
  <div style="text-align:right"><button id="c">${i18n('cancel')}</button> <button id="o">${i18n('ok')}</button></div>
 </div>`; document.body.appendChild(o);
 const n=o.querySelector('#n'),u=o.querySelector('#u'),i=o.querySelector('#i'); n.focus();
 o.querySelector('#c').onclick=()=>o.remove();
 o.querySelector('#o').onclick=async()=>{
   const name=n.value.trim();
   let url=u.value.trim();
   if(!name||!url)return;
   if(!/^https?:\/\//i.test(url))url='https://'+url;
   let icon=i.value.trim();
   if(!icon){
     try{icon=`https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`}catch{}
   }
   settings.icons.push({name,url,icon});
   const need=Math.ceil(settings.icons.length/settings.cols);
   if(need!==settings.rows)settings.rows=need;
   await chrome.storage.sync.set({icons:settings.icons,rows:settings.rows});
   if(settings.bookmarkFolderId){
     try{ await saveToBookmarkFolder(settings.bookmarkFolderId, settings); }catch{}
   }
   o.remove();render();
 };
}

async function sendPrompt(){
  const q=promptInput.value.trim();
  if(!q)return;
  let url;
  switch(settings.searchEngine){
    case'google':url=`https://www.google.com/search?q=${encodeURIComponent(q)}`;break;
    case'bing':url=`https://www.bing.com/search?q=${encodeURIComponent(q)}`;break;
    case'duckduckgo':url=`https://duckduckgo.com/?q=${encodeURIComponent(q)}`;break;
    case'custom':url=(settings.customUrl||'').replace('%s',encodeURIComponent(q));if(!url)url=`https://www.google.com/search?q=${encodeURIComponent(q)}`;break;
    default:url=`https://www.google.com/search?q=${encodeURIComponent(q)}&udm=50`;
  }
  location.href=url;
}
sendBtn.onclick=sendPrompt;
promptInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendPrompt()}});
document.getElementById('optionsBtn').onclick=()=>chrome.runtime.openOptionsPage();
load();
