
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

const tbody=document.querySelector('#tbl tbody');
const els={
  theme:document.getElementById('theme'),
  cols:document.getElementById('cols'),
  rows:document.getElementById('rows'),
  newTab:document.getElementById('enableNewTab'),
  home:document.getElementById('enableHome'),
  search:document.getElementById('searchEngine'),
  custom:document.getElementById('customUrl'),
  customBox:document.getElementById('customBox'),
  bookmarkFolder:document.getElementById('bookmarkFolder'),
  refreshFolders:document.getElementById('refreshFolders'),
  bookmarkStatus:document.getElementById('bookmarkStatus')
};

let autoSaveTimer=null;

function i18n(key, ...args){
  try{
    if(chrome.i18n && chrome.i18n.getMessage){
      const m = chrome.i18n.getMessage(key, args.length?args:undefined);
      if(m) return m;
    }
  }catch{}
  const fallback={
    title:'AI Speed Dial Settings', lblTheme:'Theme:', optSystem:'Follow system', optLight:'Light', optDark:'Dark',
    lblCols:'Columns:', lblRows:'Rows:', lblNewTab:'Replace new tab', lblHome:'Replace home button',
    hIcons:'Edit Icons', thOrder:'#', thIcon:'Icon', thName:'Name', thUrl:'URL', thImg:'Image URL', thAct:'Action',
    addBtn:'+ Add', reset:'Reset', del:'Delete',
    lblSearch:'Search Engine:', lblCustom:'Custom URL:', customHelp:'Use %s for query',
    optGAi:'Google AI Mode', optG:'Google', optBing:'Bing', optDDG:'DuckDuckGo', optCustom:'Custom',
    bookmarkSection:'Bookmark Storage', lblBookmarkFolder:'Bookmark Folder:', bookmarkFolderHelp:'Settings will be saved as bookmarks in selected folder. Auto-synced on change and loaded on Chrome startup.',
    btnRefreshFolders:'Refresh', noFolder:'(Not selected - use sync storage)', autoSaveNote:'Changes are saved automatically to sync storage and bookmark folder (if selected). Bookmarks are loaded automatically on Chrome startup.',
    statusSaved:'Saved!', savedToBookmarks:'Saved to bookmarks!', loading:'Loading...', loadedFromBookmarks:'Loaded from bookmarks!'
  };
  return fallback[key]||key;
}

function applyLang(){
  document.getElementById('title').textContent=i18n('title');
  document.getElementById('lblTheme').textContent=i18n('lblTheme');
  document.getElementById('optSystem').textContent=i18n('optSystem');
  document.getElementById('optLight').textContent=i18n('optLight');
  document.getElementById('optDark').textContent=i18n('optDark');
  document.getElementById('lblCols').textContent=i18n('lblCols');
  document.getElementById('lblRows').textContent=i18n('lblRows');
  document.getElementById('lblNewTab').textContent=i18n('lblNewTab');
  document.getElementById('lblHome').textContent=i18n('lblHome');
  document.getElementById('hIcons').textContent=i18n('hIcons');
  document.getElementById('thOrder').textContent=i18n('thOrder');
  document.getElementById('thIcon').textContent=i18n('thIcon');
  document.getElementById('thName').textContent=i18n('thName');
  document.getElementById('thUrl').textContent=i18n('thUrl');
  document.getElementById('thImg').textContent=i18n('thImg');
  document.getElementById('thAct').textContent=i18n('thAct');
  document.getElementById('add').textContent=i18n('addBtn');
  document.getElementById('reset').textContent=i18n('reset');
  document.getElementById('lblSearch').textContent=i18n('lblSearch');
  document.getElementById('lblCustom').textContent=i18n('lblCustom');
  document.getElementById('customHelp').textContent=i18n('customHelp');
  document.getElementById('optGAi').textContent=i18n('optGAi');
  document.getElementById('optG').textContent=i18n('optG');
  document.getElementById('optBing').textContent=i18n('optBing');
  document.getElementById('optDDG').textContent=i18n('optDDG');
  document.getElementById('optCustom').textContent=i18n('optCustom');
  document.getElementById('bookmarkSectionTitle').textContent=i18n('bookmarkSection');
  document.getElementById('bookmarkFolderHelp').textContent=i18n('bookmarkFolderHelp');
  document.getElementById('lblBookmarkFolder').textContent=i18n('lblBookmarkFolder');
  document.getElementById('refreshFolders').textContent=i18n('btnRefreshFolders');
  const note = document.getElementById('autoSaveNote');
  if(note) note.textContent = i18n('autoSaveNote');
  try{
    const uiLang = chrome.i18n.getUILanguage() || navigator.language || 'en';
    document.documentElement.lang = uiLang;
  }catch{}
}

function updateCustom(){els.customBox.style.display=els.search.value==='custom'?'block':'none'}

// Bookmark helpers
function encodeConfig(obj){
  try{
    const json = JSON.stringify(obj);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return encodeURIComponent(b64);
  }catch{
    return encodeURIComponent(JSON.stringify(obj));
  }
}
function decodeConfigFromUrl(url){
  try{
    const idx = url.indexOf('#');
    if(idx===-1) return null;
    let frag = url.substring(idx+1);
    frag = decodeURIComponent(frag);
    try{
      const jsonStr = decodeURIComponent(escape(atob(frag)));
      return JSON.parse(jsonStr);
    }catch{}
    try{ return JSON.parse(atob(frag)); }catch{}
    try{ return JSON.parse(decodeURIComponent(url.substring(idx+1))); }catch{}
    return null;
  }catch{ return null; }
}

async function getAllBookmarkFolders(){
  const tree = await chrome.bookmarks.getTree();
  const folders=[];
  function walk(nodes, path){
    for(const node of nodes){
      if(!node.url){
        const curPath = path ? `${path} / ${node.title}` : node.title;
        if(node.id !== '0'){
          folders.push({id: node.id, title: node.title || '(root)', path: curPath});
        }
        if(node.children) walk(node.children, curPath);
      }
    }
  }
  walk(tree, '');
  folders.sort((a,b)=>a.path.localeCompare(b.path));
  return folders;
}

async function populateBookmarkFolders(selectedId){
  const folders = await getAllBookmarkFolders();
  els.bookmarkFolder.innerHTML='';
  const optNone = document.createElement('option');
  optNone.value='';
  optNone.textContent=i18n('noFolder');
  els.bookmarkFolder.appendChild(optNone);
  folders.forEach(f=>{
    const opt=document.createElement('option');
    opt.value=f.id;
    opt.textContent=f.path || f.title;
    if(f.id===selectedId) opt.selected=true;
    els.bookmarkFolder.appendChild(opt);
  });
  if(selectedId){
    els.bookmarkFolder.value=selectedId;
  }
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
      if(dec && dec.icons) return c;
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


function render(a){tbody.innerHTML='';a.forEach((it,i)=>{const tr=document.createElement('tr');tr.dataset.i=i;tr.innerHTML=`<td>${i+1}</td><td><img src="${it.icon}"></td><td><input class="icon-name" value="${it.name.replace(/"/g,'&quot;')}"></td><td><input class="icon-url" value="${it.url.replace(/"/g,'&quot;')}" style="width:200px"></td><td><input class="icon-img" value="${it.icon.replace(/"/g,'&quot;')}" style="width:200px"></td><td><button data-a="up">^</button><button data-a="down">v</button><button data-a="del">${i18n('del')}</button></td>`;tbody.appendChild(tr)})}

function get(){return[...tbody.querySelectorAll('tr')].map(r=>({name:r.querySelector('.icon-name').value,url:r.querySelector('.icon-url').value,icon:r.querySelector('.icon-img').value}))}

function getFullSettings(){
  return {
    cols:+els.cols.value,
    rows:+els.rows.value,
    enableNewTab:els.newTab.checked,
    enableHome:els.home.checked,
    theme:els.theme.value,
    searchEngine:els.search.value,
    customUrl:els.custom.value,
    icons:get(),
    bookmarkFolderId: els.bookmarkFolder.value || null
  };
}

async function autoSave(){
  if(autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(async ()=>{
    const full = getFullSettings();
    await chrome.storage.sync.set({
      cols:full.cols,
      rows:full.rows,
      enableNewTab:full.enableNewTab,
      enableHome:full.enableHome,
      theme:full.theme,
      searchEngine:full.searchEngine,
      customUrl:full.customUrl,
      icons:full.icons,
      bookmarkFolderId: full.bookmarkFolderId
    });
    document.getElementById('status').textContent=i18n('statusSaved');
    setTimeout(()=>document.getElementById('status').textContent='',1500);

    if(full.bookmarkFolderId){
      try{
        els.bookmarkStatus.textContent=i18n('savedToBookmarks');
        await saveToBookmarkFolder(full.bookmarkFolderId, full);
        setTimeout(()=>els.bookmarkStatus.textContent='',2000);
      }catch(e){
        console.error(e);
        els.bookmarkStatus.textContent='Error: '+e.message;
      }
    }
  }, 400);
}

async function load(){
  applyLang();
  const d=await chrome.storage.sync.get(['cols','rows','icons','enableNewTab','enableHome','theme','searchEngine','customUrl','bookmarkFolderId']);
  els.cols.value=d.cols||6;
  els.rows.value=d.rows||2;
  els.newTab.checked=d.enableNewTab!==false;
  els.home.checked=d.enableHome!==false;
  els.theme.value=d.theme||'system';
  document.documentElement.dataset.theme=els.theme.value;
  els.search.value=d.searchEngine||'google_ai';
  els.custom.value=d.customUrl||'';
  updateCustom();
  const icons = (d.icons&&d.icons.length)?d.icons:DEFAULT_ICONS;
  render(icons);
  const folderId = d.bookmarkFolderId || null;
  await populateBookmarkFolders(folderId);

  // auto load from bookmarks on options open if folder set (reflect Chrome startup behavior)
  if(folderId){
    try{
      els.bookmarkStatus.textContent=i18n('loading');
      const bmData = await loadFromBookmarkFolder(folderId);
      if(bmData){
        // if bookmark has newer data, show it (optional: only if icons differ)
        // we do not auto overwrite UI unless user wants, but to implement auto load on startup, background already synced.
        // Here we just indicate loaded.
        els.bookmarkStatus.textContent=i18n('loadedFromBookmarks');
        setTimeout(()=>els.bookmarkStatus.textContent='',2000);
      }else{
        els.bookmarkStatus.textContent='';
      }
    }catch{}
  }

  // attach auto save listeners
  ['change','input'].forEach(ev=>{
    els.theme.addEventListener(ev, autoSave);
    els.cols.addEventListener(ev, autoSave);
    els.rows.addEventListener(ev, autoSave);
    els.newTab.addEventListener(ev, autoSave);
    els.home.addEventListener(ev, autoSave);
    els.search.addEventListener(ev, ()=>{ updateCustom(); autoSave(); });
    els.custom.addEventListener(ev, autoSave);
  });
  tbody.addEventListener('input', (e)=>{
    if(e.target.matches('input')) autoSave();
  });
}

document.getElementById('reset').onclick=async()=>{
  render(DEFAULT_ICONS);
  await autoSave();
};

document.getElementById('add').onclick=async()=>{
  const cur=get();
  cur.push({name:"New Site",url:"https://example.com",icon:"https://www.google.com/s2/favicons?domain=example.com&sz=128"});
  render(cur);
  await autoSave();
};

els.theme.onchange=()=>{document.documentElement.dataset.theme=els.theme.value};
els.refreshFolders.onclick=async()=>{
  const cur = els.bookmarkFolder.value || null;
  await populateBookmarkFolders(cur);
};
els.bookmarkFolder.onchange=async()=>{
  // when folder changes, save immediately and try to load config from new folder
  const newFolderId = els.bookmarkFolder.value || null;
  await chrome.storage.sync.set({bookmarkFolderId: newFolderId});
  if(newFolderId){
    try{
      els.bookmarkStatus.textContent=i18n('loading');
      const data = await loadFromBookmarkFolder(newFolderId);
      if(data){
        if(data.icons) render(data.icons);
        if(data.cols) els.cols.value=data.cols;
        if(data.rows) els.rows.value=data.rows;
        if(data.theme){ els.theme.value=data.theme; document.documentElement.dataset.theme=data.theme; }
        if(data.searchEngine) els.search.value=data.searchEngine;
        if(data.customUrl!==undefined) els.custom.value=data.customUrl;
        if(data.enableNewTab!==undefined) els.newTab.checked=data.enableNewTab;
        if(data.enableHome!==undefined) els.home.checked=data.enableHome;
        updateCustom();
        // save merged to storage
        await chrome.storage.sync.set({
          cols:+els.cols.value,
          rows:+els.rows.value,
          theme:els.theme.value,
          searchEngine:els.search.value,
          customUrl:els.custom.value,
          icons:get(),
          enableNewTab:els.newTab.checked,
          enableHome:els.home.checked
        });
        els.bookmarkStatus.textContent=i18n('loadedFromBookmarks');
        setTimeout(()=>els.bookmarkStatus.textContent='',2000);
      }else{
        els.bookmarkStatus.textContent='';
      }
    }catch(e){
      els.bookmarkStatus.textContent='Error: '+e.message;
    }
  }else{
    els.bookmarkStatus.textContent='';
  }
};

tbody.onclick=e=>{
  const a=e.target.dataset.a;
  if(!a)return;
  const r=e.target.closest('tr'),i=+r.dataset.i,g=get();
  if(a==='del')g.splice(i,1);
  if(a==='up'&&i>0)[g[i-1],g[i]]=[g[i],g[i-1]];
  if(a==='down'&&i<g.length-1)[g[i+1],g[i]]=[g[i],g[i+1]];
  render(g);
  autoSave();
};

load();
