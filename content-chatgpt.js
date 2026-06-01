
(async ()=>{
  const {pendingPrompt, pendingAt} = await chrome.storage.local.get(['pendingPrompt','pendingAt']);
  if(!pendingPrompt || !pendingAt || Date.now()-pendingAt > 60000) return;
  await chrome.storage.local.remove(['pendingPrompt','pendingAt']);

  function findInput(){
    return document.querySelector('#prompt-textarea') 
        || document.querySelector('textarea[data-id="root"]')
        || document.querySelector('div[contenteditable="true"]');
  }
  function setText(el, text){
    if(el.tagName==='TEXTAREA' || el.tagName==='INPUT'){
      el.value = text; el.dispatchEvent(new Event('input',{bubbles:true}));
    } else {
      el.focus(); document.execCommand('insertText', false, text);
      el.dispatchEvent(new InputEvent('input',{bubbles:true}));
    }
  }
  function pressEnter(el){
    el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true}));
  }

  let tries=0;
  const timer = setInterval(()=>{
    const el = findInput();
    if(el){
      clearInterval(timer);
      setText(el, pendingPrompt);
      setTimeout(()=> pressEnter(el), 200);
    }
    if(++tries>100) clearInterval(timer);
  },200);
})();
