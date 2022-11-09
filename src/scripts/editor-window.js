/* *********************** */

// window.addEventListener('contextmenu', function(event) {
//   event.preventDefault();
// }, false);

/* *********************** */


window.addEventListener('keydown', overrideKeyboardEvent, {capture: true});
window.addEventListener('keyup', overrideKeyboardEvent, {capture: true});

function overrideKeyboardEvent(event) {
  let returnVal = true;

  if (event.type == 'keydown') {

    if (event.ctrlKey || event.metaKey) {

      if (!event.shiftKey && event.code === 'KeyO') {
        event.stopPropagation();
        event.preventDefault();
        returnVal = false;

        openHTMLFile();
      }

      if (!event.shiftKey && event.code === 'KeyS') {
        event.stopPropagation();
        event.preventDefault();
        returnVal = false;

        saveHTMLFile();
      }

      if (event.shiftKey && event.code === 'KeyS') {
        event.stopPropagation();
        event.preventDefault();
        returnVal = false;

        saveHTMLFileAs();
      }

      if (event.shiftKey && event.code === 'BracketRight') {
        event.stopPropagation();
        event.preventDefault();
        returnVal = false;

        tinyMCE.execCommand('Indent');
      }

      if (event.shiftKey && event.code === 'BracketLeft') {
        event.stopPropagation();
        event.preventDefault();
        returnVal = false;

        tinyMCE.execCommand('Outdent');
      }

    }
  }

  return returnVal;
}


window.deferredPrompt = {};


window.addEventListener('beforeinstallprompt', e => {

  e.preventDefault();

  let installButtonEl = document.querySelector('#installButton');

  if(installButtonEl){
    return;
  }

  installButtonEl = document.createElement('button');
  installButtonEl.id = 'installButton';
  installButtonEl.setAttribute('unselectable', 'on');
  installButtonEl.setAttribute('class', 'tox-mbtn tox-mbtn--select');
  installButtonEl.setAttribute('style', 'user-select: none;');

  let iconSpanEl = document.createElement('span');
  iconSpanEl.setAttribute('class', 'tox-icon tox-tbtn__icon-wrap');
  iconSpanEl.innerHTML = '<svg width="24" height="24"><path d="M11 5a1 1 0 1 1 2 0v7.16l3.24-3.24 1.42 1.4L12 16l-5.66-5.66 1.42-1.41L11 12.16V5Z"/><path d="M4 14h2v4h12v-4h2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4Z"/></svg>';
  installButtonEl.append(iconSpanEl);

  let labelSpanEl = document.createElement('span');
  labelSpanEl.setAttribute('class', 'tox-mbtn__select-label');
  labelSpanEl.textContent = 'Install';
  installButtonEl.append(labelSpanEl);

  let logoEl = document.querySelector('#logo');

  if(logoEl){
    logoEl.before(installButtonEl);
  } else {
    document.querySelector('.tox-menubar').append(installButtonEl);
  }

  window.deferredPrompt = e;

  installButtonEl.addEventListener('click', e => {
    installButtonEl.style.display = 'none';
    window.deferredPrompt.prompt();
    window.deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        installButtonEl.style.display = 'none';
      } else {
        console.log('User dismissed the prompt');
      }
      window.deferredPrompt = null;
    });
  });

});

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  let installButtonEl = document.querySelector('#installButton');
  if(installButtonEl){
    installButtonEl.style.display = 'none';
  }
}

window.addEventListener('appinstalled', e => {
  console.log("success app install!");
});


// window.onpageshow = window.onpagehide = window.onfocus = window.onblur = function(event){

//   if(document.hasFocus()){
//     document.querySelector('meta[name="theme-color"]').setAttribute('content', '#020887');
//   } else {
//     document.querySelector('meta[name="theme-color"]').setAttribute('content', '#FDFDFD');
//   }

// }