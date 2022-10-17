/* *********************** */

var currentHTMLFileHandle = null;
var toOpenHTMLFileHandle = null;

var fileSystemSupport = 'showOpenFilePicker' in window;


/* *********************** */

function newHTMLFile() {
  currentHTMLFileHandle = null;
  newDocument();
  updateWindowTitle('');
}

/* *********************** */

async function openHTMLFile(fileHandle) {

  if(fileSystemSupport == false){
    openHTMLFileFromInput();
    return;
  }

  if (fileHandle) {
    if ((await verifyPermission(fileHandle, true)) === false) {
      console.error(`User did not grant permission to '${fileHandle.name}'`);
      return;
    }
  } else {
    try {
      [fileHandle] = await window.showOpenFilePicker();
    } catch (ex) {
      if (ex.name === 'AbortError') {
        return;
      }
      const msg = 'An error occured trying to open the file.';
      console.error(msg, ex);
      alert(msg);
    }
  }

  if (!fileHandle) {
    return;
  }

  const file = await fileHandle.getFile();

  try {
    let htmlText = await file.text();

    loadDocument(htmlText);

    currentHTMLFileHandle = fileHandle;

    updateWindowTitle(currentHTMLFileHandle.name);
  } catch (ex) {
    const msg = `An error occured reading ${currentHTMLFileHandle.name}`;
    console.error(msg, ex);
    alert(msg);
  }
}

/* *********************** */

async function verifyPermission(fileHandle, withWrite) {
  const opts = {};
  if (withWrite) {
    opts.writable = true;
    opts.mode = 'readwrite';
  }
  if ((await fileHandle.queryPermission(opts)) === 'granted') {
    return true;
  }
  if ((await fileHandle.requestPermission(opts)) === 'granted') {
    return true;
  }
  return false;
}

/* *********************** */

async function saveHTMLFile() {

  if(fileSystemSupport == false){
    saveHTMLFileAsDownload(currentHTMLFileHandle);
    return;
  }

  try {
    if (!currentHTMLFileHandle) {
      return await saveHTMLFileAs();
    }

    if ((await verifyPermission(currentHTMLFileHandle, true)) === false) {
      console.error(`User did not grant permission to '${currentHTMLFileHandle.name}'`);
      return;
    }

    let htmlText = getDocumentHTMLToSave();

    await writeHTMLFile(currentHTMLFileHandle, htmlText);

    documentSaved(currentHTMLFileHandle.name);
  } catch (ex) {
    const msg = 'Unable to save file';
    console.error(msg, ex);
    alert(msg);
  }
}

/* *********************** */

async function saveHTMLFileAs() {

  if(fileSystemSupport == false){
    saveHTMLFileAsDownload();
    return;
  }

  let fileHandle;
  try {
    fileHandle = await getNewHTMLFileHandle();
  } catch (ex) {
    if (ex.name === 'AbortError') {
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }

  try {
    let htmlText = getDocumentHTMLToSave();

    await writeHTMLFile(fileHandle, htmlText);

    currentHTMLFileHandle = fileHandle;

    documentSaved(currentHTMLFileHandle.name);
  } catch (ex) {
    const msg = 'Unable to save file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }
}

/* *********************** */

async function writeHTMLFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

/* *********************** */

function getNewHTMLFileHandle() {
  let dateText = getDateTimeText();

  if (currentHTMLFileHandle) {
    var saveAsHTMLFileHandle = currentHTMLFileHandle;
  } else {
    var saveAsHTMLFileHandle = 'desktop';
  }
  const opts = {
    suggestedName: dateText + '.doc.html',
    startIn: saveAsHTMLFileHandle,
    types: [
      {
        description: 'HTML file',
        accept: { 'text/html': ['.html', '.htm', '.htmd'] },
      },
    ],
    excludeAcceptAllOption: true,
  };
  return window.showSaveFilePicker(opts);
}

/* *********************** */

if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  launchQueue.setConsumer((launchParams) => {
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      toOpenHTMLFileHandle = fileHandle;
    }
  });
}

/* *********************** */

function documentSaved(filename) {
  tinymce.activeEditor.setDirty(false);

  updateWindowTitle(filename);

  tinymce.activeEditor.undoManager.clear();
  tinymce.activeEditor.setDirty(false);
}

/* *********************** */

function updateWindowTitle(filename) {

  if(!filename){
    filename = '';
  }

  let windowTitleEl = document.querySelector('.window-title');

  if (!windowTitleEl) {
    let bottomBar = document.querySelector('.tox-statusbar__text-container');
    windowTitleEl = document.createElement('span');
    windowTitleEl.setAttribute('class', 'window-title');

    let wordcountEl = document.querySelector('.tox-statusbar__wordcount');
    if(wordcountEl){
      wordcountEl.before(windowTitleEl);
    } else {
      bottomBar.append(windowTitleEl);
    }


  }

  if (tinymce.activeEditor.isDirty()) {
    windowTitleEl.setAttribute('style', 'font-style: italic; margin: auto;');
  } else {
    windowTitleEl.setAttribute('style', 'margin: auto;');
  }

  document.title = filename;
  windowTitleEl.textContent = filename;
}


/* *********************** */

function openHTMLFileFromInput(){
  let input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'text/html');

  input.addEventListener('change', function(e){
    let file = e.target.files[0];

    let reader = new FileReader();

    reader.addEventListener('loadend', function(e){

      let htmlText = e.srcElement.result;
      
      loadDocument(htmlText);

      currentHTMLFileHandle = file;

      updateWindowTitle(currentHTMLFileHandle.name);

    });
    
    reader.readAsText(file);
  });

  input.click();

}

/* *********************** */

function saveHTMLFileAsDownload(currentHTMLFileHandle){
  
  let dateText = getDateTimeText();
  
  let filename = dateText + '.doc.html';

  if(currentHTMLFileHandle){
    filename = currentHTMLFileHandle.name;
  } else {
    filename = window.prompt('Save As...', filename);
  }

  if(filename == null){
    return;
  }

  let htmlText = getDocumentHTMLToSave();

  let file = new File([htmlText], '', {type: 'text/html'});

  let anchor = document.createElement('a');
  anchor.href = window.URL.createObjectURL(file);
  anchor.setAttribute('download', filename);
  
  anchor.click();

}

/* *********************** */
/* *********************** */

async function importCSSFile(){
  
  if(fileSystemSupport == false){
    importCSSFileFromInput();
    return;
  }

  let fileHandle;

  try {
      [fileHandle] = await window.showOpenFilePicker();
    } catch (ex) {
      if (ex.name === 'AbortError') {
        return;
      }
      const msg = 'An error occured trying to open the file.';
      console.error(msg, ex);
      alert(msg);
  }
  
  if (!fileHandle) {
    return;
  }

  const file = await fileHandle.getFile();

  try {
    let cssText = await file.text();

    setCSSText(cssText);

  } catch (ex) {
    const msg = `An error occured reading ${currentHTMLFileHandle.name}`;
    console.error(msg, ex);
    alert(msg);
  }


}

/* *********************** */

async function exportCSSFile(){
  
  let dateText = getDateTimeText();

  let suggestedFileName = dateText + '.doc.css';

  let saveAsHTMLFileHandle = 'desktop';

  if (currentHTMLFileHandle) {

    saveAsHTMLFileHandle = currentHTMLFileHandle;
    
    let filename = currentHTMLFileHandle.name;
    if(filename){
      filename = filename.substring(0, filename.lastIndexOf('.')) + '.css';
      suggestedFileName = filename;
    }
  }

  if(fileSystemSupport == false){
    exportCSSFileAsDownload(suggestedFileName);
    return;
  }

  const opts = {
    suggestedName: suggestedFileName,
    startIn: saveAsHTMLFileHandle,
    types: [
      {
        description: 'CSS file',
        accept: { 'text/css': ['.css'] },
      },
    ],
    excludeAcceptAllOption: true,
  };

  try {
    fileHandle = await window.showSaveFilePicker(opts);
  } catch (ex) {
    if (ex.name === 'AbortError') {
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }

  if ((await verifyPermission(fileHandle, true)) === false) {
    console.error(`User did not grant permission to '${fileHandle.name}'`);
    return;
  }

  let cssText = getCSSText();

  const writable = await fileHandle.createWritable();
  await writable.write(cssText);
  await writable.close();

}

/* *********************** */

function importCSSFileFromInput(){

  let input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'text/css');

  input.addEventListener('change', function(e){

    let file = e.target.files[0];

    let reader = new FileReader();

    reader.addEventListener('loadend', function(e){

      let cssText = e.srcElement.result;
      
      setCSSText(cssText);

    });
    
    reader.readAsText(file);
  });

  input.click();


}

/* *********************** */

function exportCSSFileAsDownload(suggestedFileName){

  let filename = window.prompt('Save As...', suggestedFileName);
 
  if(filename == null){
    return;
  }

  let cssText = getCSSText();

  let file = new File([cssText], '', {type: 'text/css'});

  let anchor = document.createElement('a');
  anchor.href = window.URL.createObjectURL(file);
  anchor.setAttribute('download', filename);
  
  anchor.click();

}

/* *********************** */

async function exportUnformattedHTML(){

  let dateText = getDateTimeText();

  let suggestedFileName = dateText + '-unformatted.doc.html';

  let saveAsHTMLFileHandle = 'desktop';

  if (currentHTMLFileHandle) {

    saveAsHTMLFileHandle = currentHTMLFileHandle;
    
    let filename = currentHTMLFileHandle.name;
    if(filename){
      filename = filename.substring(0, filename.lastIndexOf('.')) + '-unformatted.html';
      suggestedFileName = filename;
    }
  }

  if(fileSystemSupport == false){
    exportUnformattedHTMLAsDownload(suggestedFileName);
    return;
  }

  const opts = {
    suggestedName: suggestedFileName,
    startIn: saveAsHTMLFileHandle,
    types: [
      {
        description: 'HTML file',
        accept: { 'text/html': ['.html', '.htm', '.htmd'] },
      },
    ],
    excludeAcceptAllOption: true,
  };

  try {
    fileHandle = await window.showSaveFilePicker(opts);
  } catch (ex) {
    if (ex.name === 'AbortError') {
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }

  if ((await verifyPermission(fileHandle, true)) === false) {
    console.error(`User did not grant permission to '${fileHandle.name}'`);
    return;
  }

  let htmlText = getUnformattedHTML();

  const writable = await fileHandle.createWritable();
  await writable.write(htmlText);
  await writable.close();

}

/* *********************** */

function exportUnformattedHTMLAsDownload(suggestedFileName){

  let filename = window.prompt('Save As...', suggestedFileName);
 
  if(filename == null){
    return;
  }

  let htmlText = getUnformattedHTML();

  let file = new File([htmlText], '', {type: 'text/html'});

  let anchor = document.createElement('a');
  anchor.href = window.URL.createObjectURL(file);
  anchor.setAttribute('download', filename);
  
  anchor.click();

}


/* *********************** */

function getDateTimeText(){

  let dt = new Date();

  let y = dt.getFullYear();
  let m = dt.getMonth() + 1;  
  let d = dt.getDate();
  let h = dt.getHours();
  let t = dt.getMinutes();

  let dateTime = y + '-' + m + '-' + d+ '-' + h + '-' +  t;

  return dateTime;

}
