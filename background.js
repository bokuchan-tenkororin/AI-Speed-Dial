// background.js - pseudo bookmark only (CONFIGのみ保存、個別ブックマークは作成しない)
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['enableNewTab','enableHome','theme','searchEngine','bookmarkFolderId'], (d) => {
    const toSet = {};
    if (d.enableNewTab === undefined) toSet.enableNewTab = true;
    if (d.enableHome === undefined) toSet.enableHome = true;
    if (d.theme === undefined) toSet.theme = 'system';
    if (d.searchEngine === undefined) toSet.searchEngine = 'google_ai';
    if (d.bookmarkFolderId === undefined) toSet.bookmarkFolderId = null;
    if (Object.keys(toSet).length) chrome.storage.sync.set(toSet);
  });
  setTimeout(()=> syncFromBookmarksOnStartup(), 1000);
});
chrome.runtime.onStartup.addListener(() => { syncFromBookmarksOnStartup(); });
syncFromBookmarksOnStartup();

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
    const idx = url.indexOf('#'); if(idx===-1) return null;
    let frag = url.substring(idx+1); frag = decodeURIComponent(frag);
    try{ const jsonStr = decodeURIComponent(escape(atob(frag))); return JSON.parse(jsonStr); }catch{}
    try{ return JSON.parse(atob(frag)); }catch{}
    try{ return JSON.parse(decodeURIComponent(url.substring(idx+1))); }catch{}
    return null;
  }catch{ return null; }
}
async function findConfigBookmark(folderId){
  try{
    const children = await chrome.bookmarks.getChildren(folderId);
    for(const c of children){
      if(!c.url) continue;
      if(c.title.includes('AI_SPEED_DIAL_CONFIG') || c.url.includes('aispeeddial.local') || c.url.includes('aispeeddial.config')) return c;
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
    if(cfgBm){ const cfg = decodeConfigFromUrl(cfgBm.url); if(cfg) return cfg; }
    return null;
  }catch(e){ console.warn('loadFromBookmarkFolder failed', e); return null; }
}
async function saveToBookmarkFolder(folderId, fullSettings){
  // 擬似ブックマークのみ保存：ウェブページの個別ブックマークは作成しない
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
    let configTitle = '⚙ AI_SPEED_DIAL_CONFIG';
    try{ const msg = chrome.i18n.getMessage('configBookmarkTitle'); if(msg) configTitle = msg; }catch{}
    await chrome.bookmarks.create({parentId: folderId, title: configTitle, url: configUrl});
    console.log('[AI Speed Dial] Saved pseudo bookmark to folder', folderId);
  }catch(e){ console.error('saveToBookmarkFolder error', e); }
}
async function syncFromBookmarksOnStartup(){
  try{
    const {bookmarkFolderId} = await chrome.storage.sync.get('bookmarkFolderId');
    if(!bookmarkFolderId) return;
    try{ await chrome.bookmarks.get(bookmarkFolderId); }catch{ return; }
    const data = await loadFromBookmarkFolder(bookmarkFolderId);
    if(data){
      const toSet={};
      if(data.icons) toSet.icons = data.icons;
      if(data.cols) toSet.cols = data.cols;
      if(data.rows) toSet.rows = data.rows;
      if(data.theme) toSet.theme = data.theme;
      if(data.searchEngine) toSet.searchEngine = data.searchEngine;
      if(data.customUrl!==undefined) toSet.customUrl = data.customUrl;
      if(data.enableNewTab!==undefined) toSet.enableNewTab = data.enableNewTab;
      if(data.enableHome!==undefined) toSet.enableHome = data.enableHome;
      if(Object.keys(toSet).length){
        await chrome.storage.sync.set(toSet);
        console.log('[AI Speed Dial] Auto loaded from pseudo bookmark', bookmarkFolderId);
      }
    }
  }catch(e){ console.warn('syncFromBookmarksOnStartup error', e); }
}
async function shouldReplaceNewTab() {
  const { enableNewTab } = await chrome.storage.sync.get('enableNewTab');
  return enableNewTab !== false;
}
async function tryRedirect(tabId, url) {
  if (!url) return;
  const isNewTab = url === 'chrome://newtab/' || url === 'about:blank' || url === 'edge://newtab/';
  if (!isNewTab) return;
  if (await shouldReplaceNewTab()) {
    const target = chrome.runtime.getURL('newtab.html?mode=newtab');
    try { chrome.tabs.update(tabId, { url: target }); } catch(e){}
  }
}
chrome.tabs.onCreated.addListener((tab) => { tryRedirect(tab.id, tab.pendingUrl || tab.url); });
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading' && changeInfo.url) { tryRedirect(tabId, changeInfo.url); }
});
