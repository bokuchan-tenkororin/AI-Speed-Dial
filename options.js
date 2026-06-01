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
 ja:{title:"AI Speed Dial \u8a2d\u5b9a",lblLang:"\u8a00\u8a9e:",lblTheme:"\u30c6\u30fc\u30de:",optSystem:"\u30b7\u30b9\u30c6\u30e0\u8a2d\u5b9a\u306b\u5408\u308f\u305b\u308b",optLight:"\u30e9\u30a4\u30c8\u30e2\u30fc\u30c9",optDark:"\u30c0\u30fc\u30af\u30e2\u30fc\u30c9",lblCols:"\u6a2a\u306e\u6570:",lblRows:"\u7e26\u306e\u6570:",lblNewTab:"\u65b0\u898f\u30bf\u30d6\u3092\u7f6e\u304d\u63db\u3048\u308b",lblHome:"\u30db\u30fc\u30e0\u30dc\u30bf\u30f3\u3092\u7f6e\u304d\u63db\u3048\u308b",hIcons:"\u30a2\u30a4\u30b3\u30f3\u7de8\u96c6",thOrder:"\u9806",thIcon:"\u30a2\u30a4\u30b3\u30f3",thName:"\u540d\u524d",thUrl:"URL",thImg:"\u753b\u50cfURL",thAct:"\u64cd\u4f5c",add:"+ \u8ffd\u52a0",reset:"\u521d\u671f\u5316",save:"\u4fdd\u5b58",del:"\u524a\u9664",lblSearch:"\u691c\u7d22\u30a8\u30f3\u30b8\u30f3:",lblCustom:"\u30ab\u30b9\u30bf\u30e0URL:",customHelp:"%s \u3092\u691c\u7d22\u8a9e\u306b\u7f6e\u304d\u63db\u3048\u307e\u3059",optGAi:"Google AI\u30e2\u30fc\u30c9",optG:"Google",optBing:"Bing",optDDG:"DuckDuckGo",optCustom:"\u30ab\u30b9\u30bf\u30e0"},
 en:{title:"AI Speed Dial Settings",lblLang:"Language:",lblTheme:"Theme:",optSystem:"Follow system",optLight:"Light",optDark:"Dark",lblCols:"Columns:",lblRows:"Rows:",lblNewTab:"Replace new tab",lblHome:"Replace home button",hIcons:"Edit Icons",thOrder:"#",thIcon:"Icon",thName:"Name",thUrl:"URL",thImg:"Image URL",thAct:"Action",add:"+ Add",reset:"Reset",save:"Save",del:"Delete",lblSearch:"Search Engine:",lblCustom:"Custom URL:",customHelp:"Use %s for query",optGAi:"Google AI Mode",optG:"Google",optBing:"Bing",optDDG:"DuckDuckGo",optCustom:"Custom"},
 th:{title:"\u0e01\u0e32\u0e23\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32 AI Speed Dial",lblLang:"\u0e20\u0e32\u0e29\u0e32:",lblTheme:"\u0e18\u0e35\u0e21:",optSystem:"\u0e15\u0e32\u0e21\u0e23\u0e30\u0e1a\u0e1a",optLight:"\u0e42\u0e2b\u0e21\u0e14\u0e2a\u0e27\u0e48\u0e32\u0e07",optDark:"\u0e42\u0e2b\u0e21\u0e14\u0e21\u0e37\u0e14",lblCols:"\u0e08\u0e33\u0e19\u0e27\u0e19\u0e04\u0e2d\u0e25\u0e31\u0e21\u0e19\u0e4c:",lblRows:"\u0e08\u0e33\u0e19\u0e27\u0e19\u0e41\u0e16\u0e27:",lblNewTab:"\u0e41\u0e17\u0e19\u0e17\u0e35\u0e48\u0e41\u0e17\u0e47\u0e1a\u0e43\u0e2b\u0e21\u0e48",lblHome:"\u0e41\u0e17\u0e19\u0e17\u0e35\u0e48\u0e1b\u0e38\u0e48\u0e21\u0e2b\u0e19\u0e49\u0e32\u0e41\u0e23\u0e01",hIcons:"\u0e41\u0e01\u0e49\u0e44\u0e02\u0e44\u0e2d\u0e04\u0e2d\u0e19",thOrder:"\u0e25\u0e33\u0e14\u0e31\u0e1a",thIcon:"\u0e44\u0e2d\u0e04\u0e2d\u0e19",thName:"\u0e0a\u0e37\u0e48\u0e2d",thUrl:"URL",thImg:"URL \u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e",thAct:"\u0e01\u0e32\u0e23\u0e01\u0e23\u0e30\u0e17\u0e33",add:"+ \u0e40\u0e1e\u0e34\u0e48\u0e21",reset:"\u0e23\u0e35\u0e40\u0e0b\u0e47\u0e15",save:"\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01",del:"\u0e25\u0e1a",lblSearch:"\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e21\u0e37\u0e2d\u0e04\u0e49\u0e19\u0e2b\u0e32:",lblCustom:"URL \u0e41\u0e1a\u0e1a\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e40\u0e2d\u0e07:",customHelp:"\u0e43\u0e0a\u0e49 %s \u0e41\u0e17\u0e19\u0e04\u0e33\u0e04\u0e49\u0e19",optGAi:"Google AI Mode",optG:"Google",optBing:"Bing",optDDG:"DuckDuckGo",optCustom:"\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e40\u0e2d\u0e07"}
};
const tbody=document.querySelector('#tbl tbody');
const els={lang:document.getElementById('lang'),theme:document.getElementById('theme'),cols:document.getElementById('cols'),rows:document.getElementById('rows'),newTab:document.getElementById('enableNewTab'),home:document.getElementById('enableHome'),search:document.getElementById('searchEngine'),custom:document.getElementById('customUrl'),customBox:document.getElementById('customBox')};
let curLang='ja';
function t(k){return (I18N[curLang]||I18N.en)[k]||k}
function applyLang(){
 document.getElementById('title').textContent=t('title');
 document.getElementById('lblLang').textContent=t('lblLang');
 document.getElementById('lblTheme').textContent=t('lblTheme');
 document.getElementById('optSystem').textContent=t('optSystem');
 document.getElementById('optLight').textContent=t('optLight');
 document.getElementById('optDark').textContent=t('optDark');
 document.getElementById('lblCols').textContent=t('lblCols');
 document.getElementById('lblRows').textContent=t('lblRows');
 document.getElementById('lblNewTab').textContent=t('lblNewTab');
 document.getElementById('lblHome').textContent=t('lblHome');
 document.getElementById('hIcons').textContent=t('hIcons');
 document.getElementById('thOrder').textContent=t('thOrder');
 document.getElementById('thIcon').textContent=t('thIcon');
 document.getElementById('thName').textContent=t('thName');
 document.getElementById('thUrl').textContent=t('thUrl');
 document.getElementById('thImg').textContent=t('thImg');
 document.getElementById('thAct').textContent=t('thAct');
 document.getElementById('add').textContent=t('add');
 document.getElementById('reset').textContent=t('reset');
 document.getElementById('save').textContent=t('save');
 document.getElementById('lblSearch').textContent=t('lblSearch');
 document.getElementById('lblCustom').textContent=t('lblCustom');
 document.getElementById('customHelp').textContent=t('customHelp');
 document.getElementById('optGAi').textContent=t('optGAi');
 document.getElementById('optG').textContent=t('optG');
 document.getElementById('optBing').textContent=t('optBing');
 document.getElementById('optDDG').textContent=t('optDDG');
 document.getElementById('optCustom').textContent=t('optCustom');
 document.documentElement.lang=curLang;
}
function updateCustom(){els.customBox.style.display=els.search.value==='custom'?'block':'none'}
async function load(){
 const d=await chrome.storage.sync.get(['cols','rows','icons','enableNewTab','enableHome','theme','lang','searchEngine','customUrl']);
 curLang=d.lang||'ja'; els.lang.value=curLang; applyLang();
 els.cols.value=d.cols||6; els.rows.value=d.rows||2;
 els.newTab.checked=d.enableNewTab!==false; els.home.checked=d.enableHome!==false;
 els.theme.value=d.theme||'system'; document.documentElement.dataset.theme=els.theme.value;
 els.search.value=d.searchEngine||'google_ai'; els.custom.value=d.customUrl||''; updateCustom();
 render(d.icons&&d.icons.length?d.icons:DEFAULT_ICONS);
}
function render(a){tbody.innerHTML='';a.forEach((it,i)=>{const tr=document.createElement('tr');tr.dataset.i=i;tr.innerHTML=`<td>${i+1}</td><td><img src="${it.icon}"></td><td><input value="${it.name}"></td><td><input value="${it.url}" style="width:200px"></td><td><input value="${it.icon}" style="width:200px"></td><td><button data-a="up">^</button><button data-a="down">v</button><button data-a="del">${t('del')}</button></td>`;tbody.appendChild(tr)})}
function get(){return[...tbody.querySelectorAll('tr')].map(r=>({name:r.children[2].firstChild.value,url:r.children[3].firstChild.value,icon:r.children[4].firstChild.value}))}
document.getElementById('reset').onclick=()=>render(DEFAULT_ICONS);
document.getElementById('save').onclick=async()=>{await chrome.storage.sync.set({cols:+els.cols.value,rows:+els.rows.value,enableNewTab:els.newTab.checked,enableHome:els.home.checked,theme:els.theme.value,lang:els.lang.value,searchEngine:els.search.value,customUrl:els.custom.value,icons:get()});window.close()};
els.theme.onchange=()=>{document.documentElement.dataset.theme=els.theme.value};
els.lang.onchange=()=>{curLang=els.lang.value;applyLang();render(get())};
els.search.onchange=updateCustom;
tbody.onclick=e=>{const a=e.target.dataset.a;if(!a)return;const r=e.target.closest('tr'),i=+r.dataset.i,g=get();if(a==='del')g.splice(i,1);if(a==='up'&&i>0)[g[i-1],g[i]]=[g[i],g[i-1]];if(a==='down'&&i<g.length-1)[g[i+1],g[i]]=[g[i],g[i+1]];render(g)};
load();