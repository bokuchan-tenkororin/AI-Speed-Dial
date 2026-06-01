// 新規タブをオプション設定で制御
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['enableNewTab','enableHome'], (d) => {
    if (d.enableNewTab === undefined) chrome.storage.sync.set({ enableNewTab: true });
    if (d.enableHome === undefined) chrome.storage.sync.set({ enableHome: true });
  });
});

async function shouldReplaceNewTab() {
  const { enableNewTab } = await chrome.storage.sync.get('enableNewTab');
  return enableNewTab!== false;
}

async function tryRedirect(tabId, url) {
  if (!url) return;
  const isNewTab = url === 'chrome://newtab/' || url === 'about:blank' || url === 'edge://newtab/';
  if (!isNewTab) return;
  if (await shouldReplaceNewTab()) {
    const target = chrome.runtime.getURL('newtab.html?mode=newtab');
    chrome.tabs.update(tabId, { url: target });
  }
}

chrome.tabs.onCreated.addListener((tab) => {
  tryRedirect(tab.id, tab.pendingUrl || tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading' && changeInfo.url) {
    tryRedirect(tabId, changeInfo.url);
  }
});