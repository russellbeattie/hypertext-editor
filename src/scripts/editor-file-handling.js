/* *********************** */

var currentHTMLFileHandle = null;
var toOpenHTMLFileHandle = null;
var dirHandle = null;

var fileSystemSupport = 'showOpenFilePicker' in window;

/* *********************** */

function getFileSystemSupport(){
  return fileSystemSupport;
}

/* *********************** */

async function deleteWorkingFolder(){
  dirHandle = null;
  await del('dirHandle');
}

/* *********************** */

async function getWorkingFolder(){

  dirHandle = await get('dirHandle');

  if(dirHandle){
    return dirHandle.name;
  } else {
    return '';
  }

}

/* *********************** */

async function verifyWorkingFolder(){

  dirHandle = await get('dirHandle');

  if(dirHandle){

    if ((await verifyPermission(dirHandle, true)) === false) {
      console.error(`User did not grant permission to '${dirHandle.name}'`);
      await del('dirHandle');
    }
  
  }

}



/* *********************** */

async function setWorkingFolder(){

  try {
    dirHandle = await window.showDirectoryPicker({mode: 'readwrite'});

    await set('dirHandle', dirHandle);

  } catch(err){
    console.log(err);
  }
}

/* *********************** */

async function getFileList(dir, handles){

  if(!handles){
    handles = {};
  }

  for await (const entry of dir.values()) {

    if(entry.name.startsWith('.') == true){
      continue;
    }

    if (entry.kind !== 'file') {
        handles = await getFileList(entry, handles);
        continue;
    }

    let filepath = entry.name;
    let relativePaths = await dirHandle.resolve(entry);
    if (relativePaths !== null) {
      filepath = relativePaths.join('/');
    }

    handles[filepath] = entry;

  }

  return handles;

}

/* *********************** */

async function getLocalFile(filename){

  dirHandle = await get('dirHandle');

  if(dirHandle){
    let fileHandles = await getFileList(dirHandle);
    
    let filepath = null;
    
    let paths = Object.keys(fileHandles);
    
    for(let i = 0; i < paths.length; i++){
      let path = paths[i];
      if(path.includes(filename)){
        filepath = path;
        break;
      }
    }
     
     if(filepath){
          
        let fileHandle = fileHandles[filepath];
        let file = await fileHandle.getFile();

        return {
          filepath: filepath,
          file: file
        };
    } 
  }

  return null;

}

/* *********************** */

async function getImage(){

  dirHandle = await get('dirHandle');

  try {
      const opts = {
        startIn: dirHandle,
        types: [
          {
            description: 'Images',
            accept: {
              'image/*': ['.png', '.gif', '.jpeg', '.jpg']
            }
          },
        ],
        excludeAcceptAllOption: true,
      };

    let fileHandle; 

    [fileHandle] = await window.showOpenFilePicker(opts);
    
    
    let filename = fileHandle.name;
    let relativePaths = await dirHandle.resolve(fileHandle);
    if (relativePaths !== null) {
      filename = relativePaths.join('/');
    }

    return filename;

  } catch(err){
    console.err(err);
  }
}

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

      const opts = {
        types: [
          {
            description: 'HTML file',
            accept: { 'text/html': ['.html', '.htm', '.htmd'] },
          },
        ],
        excludeAcceptAllOption: true,
      };


      [fileHandle] = await window.showOpenFilePicker(opts);
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

  if (currentHTMLFileHandle) {
    var saveAsHTMLFileHandle = currentHTMLFileHandle;
  } else {
    var saveAsHTMLFileHandle = 'desktop';
  }
  const opts = {
    suggestedName: getSuggestedFileName(),
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
  
  let filename = getSuggestedFileName();

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
      
      const opts = {
        types: [
          {
            description: 'CSS file',
            accept: { 'text/css': ['.css'] },
          },
        ],
        excludeAcceptAllOption: true,
      };


      [fileHandle] = await window.showOpenFilePicker(opts);
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

  let suggestedFileName = getSuggestedFileName().replace('.html') + '.css';

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

  let suggestedFileName = 'unformatted' + getSuggestedFileName();

  let saveAsHTMLFileHandle = 'desktop';

  if (currentHTMLFileHandle) {

    saveAsHTMLFileHandle = currentHTMLFileHandle;
    
    let filename = currentHTMLFileHandle.name;
    if(filename){
      filename = 'unformatted' + filename;
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

async function getScript(){

  if(fileSystemSupport == false){
    let scriptText = await getScriptFromInput();
    return scriptText;
  }

  const opts = {
    types: [
      {
        description: 'JavaScript file',
        accept: { 'text/javascript': ['.js'] },
      },
    ],
    excludeAcceptAllOption: true,
  };

  let fileHandle;

  try {
      [fileHandle] = await window.showOpenFilePicker(opts);
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
    let scriptText = await file.text();

    return scriptText;

  } catch (ex) {
    const msg = `An error occured reading ${currentHTMLFileHandle.name}`;
    console.error(msg, ex);
    alert(msg);
  }

}

/* *********************** */

function getScriptFromImport(){

  return new Promise ((resolve, reject) => {

    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'text/css');

    input.addEventListener('change', function(e){

      let file = e.target.files[0];

      let reader = new FileReader();

      reader.addEventListener('loadend', function(e){

        let scriptText = e.srcElement.result;
        
        resolve(scriptText);

      });

      reader.addEventListener('error', function(e){
        reject();
      });

      reader.addEventListener('abort', function(e){
        reject();
      });
      
      reader.readAsText(file);
    });

    input.click();

  });

}

/* *********************** */


