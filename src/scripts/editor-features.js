
function editImage() {
  let initData =  {
    src: {
      value: '',
    },
    alt: '',
    captionText: '',
    caption: false
  };
  
  let update = false;
  let items = [];

  let selectedEl = tinymce.activeEditor.selection.getNode();

  if(selectedEl.nodeName.toLowerCase() == 'figure'){
    selectedEl = selectedEl.querySelector('img');
  }

  if(selectedEl.nodeName.toLowerCase() == 'img'){
    update = true;
    initData.src.value = selectedEl.getAttribute('src') || '';
    initData.alt = selectedEl.getAttribute('alt') || '';
    items = [
        { type: 'urlinput', label: 'Path, URL or Embed Image', name: 'src', filetype: 'image' },
        { type: 'input', label: 'Alt Text', name: 'alt' }
      ];
  } else {
    items = [
        { type: 'urlinput', label: 'Path, URL or Embed Image', name: 'src', filetype: 'image' },
        { type: 'input', label: 'Alt Text', name: 'alt' },
        { type: 'input', label: 'Caption', name: 'captionText' },
        { type: 'checkbox', label: 'Figure with Caption', name: 'caption' },
      ];
  }

  tinymce.activeEditor.windowManager.open({
    title: 'Add / Edit Image',
    size: 'normal',
    body: {
      type: 'panel',
      items: items,
    },
    initialData:initData,
    buttons: [
      { type: 'cancel', name: 'cancel', text: 'Cancel' },
      { type: 'submit', name: 'save', text: 'Save', primary: true },
    ],
    onSubmit: function (api) {
      let data = api.getData();

      let src = data.src.value;
      let alt = data.alt || '';

      if(src == ''){
         api.close();
         return;
      }

      if(update){

        selectedEl.setAttribute('src', src);
        selectedEl.setAttribute('alt', alt);
      
      } else {

        let imgEl = document.createElement('img');
        imgEl.setAttribute('src', src);
        if(data.alt){
          imgEl.setAttribute('alt', alt);
        }

        if (data.caption) {
          let figureEl = document.createElement('figure');
          figureEl.classList.add('image');
          figureEl.setAttribute('contenteditable', 'false');

          let figCaptionEl = document.createElement('figcaption');
          figCaptionEl.textContent = data.captionText || 'Caption';

          figureEl.append(imgEl);
          figureEl.append(figCaptionEl);

          tinymce.activeEditor.insertContent(figureEl.outerHTML);

        } else {
        
          tinymce.activeEditor.insertContent(imgEl.outerHTML);
        
        }

      }
      api.close();
    }
  });
}

/* *********************** */

function editEmbed() {

  let selectedEl = tinymce.activeEditor.selection.getNode();

  // let markup = tinymce.activeEditor.serializer.serialize(tinymce.activeEditor.selection.getNode());
  let update = false;
  let markup = '';

  if(selectedEl.classList.contains('embed')){
    update = true;
    markup = selectedEl.innerHTML;
    // markup = tinymce.activeEditor.selection.getContent();
  } 

  tinymce.activeEditor.windowManager.open({
    title: 'Add / Edit Embed',
    size: 'medium',
    body: {
      type: 'panel',
      items: [{ type: 'textarea', name: 'markup' }],
    },
    initialData: {
      markup: markup,
    },
    buttons: [
      { type: 'cancel', name: 'cancel', text: 'Cancel' },
      { type: 'submit', name: 'save', text: 'Save', primary: true },
    ],
    onSubmit: function (api) {
      let markup = api.getData().markup;

      if(update){
        tinymce.activeEditor.selection.setContent(markup);
      } else {
        let embedEl = document.createElement('div');
        embedEl.classList.add('embed');
        embedEl.setAttribute('contenteditable', 'false');
        embedEl.innerHTML = markup;
        tinymce.activeEditor.selection.setContent(embedEl.outerHTML);
      }

      api.close();
    },
  });
}


/* *********************** */

function showEditBlockMenu() {

  let selectedEl = tinymce.activeEditor.selection.getNode();

  let markup = tinymce.activeEditor.serializer.serialize(tinymce.activeEditor.selection.getNode());

  if(selectedEl.nodeName.toLowerCase() == 'body'){
    markup = selectedEl.innerHTML;
  }

  tinymce.activeEditor.windowManager.open({
    title: 'Edit Block',
    size: 'medium',
    body: {
      type: 'panel',
      items: [{ type: 'textarea', name: 'markup' }],
    },
    initialData: {
      markup: markup,
    },
    buttons: [
      { type: 'cancel', name: 'cancel', text: 'Cancel' },
      { type: 'submit', name: 'save', text: 'Save', primary: true },
    ],
    onSubmit: function (api) {
      let markup = api.getData().markup;
      tinymce.activeEditor.selection.setContent(markup);
      api.close();
    },
  });
}

/* *********************** */

function showAttributesMenu() {
  const editor = tinymce.activeEditor;
  editor.windowManager.open({
    title: 'Edit Attributes',
    body: {
      type: 'panel',
      items: [
        { type: 'input', name: 'name', label: 'Tag Name', enabled: false },
        { type: 'input', name: 'classesText', label: 'Classes' },
        { type: 'input', name: 'styleText', label: 'Style' },
        { type: 'input', name: 'id', label: 'ID' },
      ],
    },
    buttons: [
      { type: 'cancel', name: 'cancel', text: 'Cancel' },
      { type: 'submit', name: 'save', text: 'Save', primary: true },
    ],
    initialData: {
      name: ' <' + editor.selection.getNode().nodeName.toLowerCase() + '>',
      id: editor.selection.getNode().id,
      classesText: editor.selection.getNode().getAttribute('class') || '',
      styleText: editor.selection.getNode().getAttribute('style') || '',
    },
    onSubmit: function (api) {
      let node = editor.selection.getNode();
      node.id = api.getData().id.trim();
      node.setAttribute('class', api.getData().classesText.trim());
      node.setAttribute('style', api.getData().styleText.trim());
      api.close();
    },
  });
}

/* *********************** */

function createTableOfContents(innerFlag) {
  let doc = tinymce.activeEditor.getDoc();

  let headers = doc.querySelectorAll('h1, h2, h3, h4, h5');

  var details = document.createElement('details');
  details.id = 'table-of-contents';
  details.setAttribute('contenteditable', 'false');
  details.setAttribute('open', 'true');

  var summary = document.createElement('summary');
  summary.textContent = 'Table of Contents';
  details.appendChild(summary);

  var tocList = document.createElement('p');
  details.appendChild(tocList);

  headers.forEach((header, index) => {
    header.id =
      header.textContent
        .trim()
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '') + '-header';

    if (header.textContent.trim() !== '') {
      let level = parseInt(header.tagName.substr(-1));

      let anchor = document.createElement('a');
      anchor.setAttribute('class', 'toc-level-' + level);
      anchor.setAttribute('style', 'padding-left: ' + level + 'ch;');
      anchor.href = '#' + header.id;
      anchor.textContent = ' • ' + header.textContent.trim();

      tocList.append(anchor);
      let br = document.createElement('br');
      tocList.appendChild(br);
    }
  });

  if (innerFlag) {
    tinymce.activeEditor.dom.replace(details, tinymce.activeEditor.dom.select('#table-of-contents'));
  } else {
    tinymce.activeEditor.dom.remove(tinymce.activeEditor.dom.select('#table-of-contents'));
    tinymce.activeEditor.selection.setContent(details.outerHTML);
  }
}

/* *********************** */

function beforeGetContent() {
  let dom = tinymce.activeEditor.dom;

  let toc = dom.get('table-of-contents');

  if (toc) {
    createTableOfContents(true);
  }
}

/* *********************** */

async function runMacro(){

  let scriptText = await getScript();

  if(scriptText){
    try {
      let scriptEl = document.createElement('script');
      scriptEl.textContent = scriptText;

      tinymce.activeEditor.getDoc().head.append(scriptEl);
    } catch (e){
      alert('Script Error: ' + e.name + ' ' + e.message);

    }

  }

}


/* *********************** */

var codeEditor;

function editCode(title, codeText, callback) {
  let editor = tinymce.activeEditor;

  let mode = 'text/html';
  if(title.includes('Tag')){
    mode = 'text/javascript';
  }

  let size = 'large';
  if(title.includes('Block')){
    size = 'medium';
  }

  editor.windowManager.open({
    title: title,
    size: size,
    body: {
      type: 'panel',
      items: [
        {
          type: 'customeditor',
          name: 'codeEditorText',
          tag: 'div',
          init: function (e) {
            e.id = 'visual-code-editor';
            e.setAttribute('style', 'display: flex; width: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; cursor: text !important');
            return new Promise((resolve) => {
              resolve({
                setValue(s) {
                  codeEditor = CodeMirror(e, {
                    autoCloseBrackets: true,
                    autoCloseTags: true,
                    autofocus: true,
                    bothTags: true,
                    dragDrop: false,
                    extraKeys: { 'Ctrl-Space': 'autocomplete', 'Ctrl-J': 'toMatchingTag' },
                    indentUnit: 2,
                    indentWithTabs: false,
                    lineNumbers: true,
                    lineWrapping: true,
                    matchBrackets: true,
                    mode: mode,
                    saveCursorPosition: true,
                    styleActiveLine: true,
                    tabSize: 2,
                    viewportMargin: Infinity,
                    value: s,
                  });
                  codeEditor.setSize('100%', 'auto');
                },
                getValue() {
                  return codeEditor.getValue();
                },
                destroy() {
                  e.parentNode.remove(e);
                },
              });
            });
          },
        },
      ],
    },
    buttons: [
      { type: 'cancel', name: 'cancel', text: 'Cancel' },
      { type: 'submit', name: 'save', text: 'Save', primary: true },
    ],
    initialData: {
      codeEditorText: codeText,
    },
    onSubmit: function (api) {
      callback(api.getData().codeEditorText);
      api.close();
    },
  });
}

/* *********************** */

function editBlock(){

  let selectedEl = tinymce.activeEditor.selection.getNode();

  // let markup = selectedEl.outerHTML;

  let blockContentHTML = tinymce.activeEditor.serializer.serialize(tinymce.activeEditor.selection.getNode());

  if(selectedEl.nodeName.toLowerCase() == 'body'){
    blockContentHTML = selectedEl.innerHTML;
  }

  editCode('Edit Block', blockContentHTML, function (returnText) {
      
      if(blockContentHTML !== ''){
        // tinymce.activeEditor.selection.setContent(returnText);
        tinymce.activeEditor.dom.setOuterHTML(tinymce.activeEditor.selection.getNode(), returnText);
      } else {
        tinymce.activeEditor.insertContent(returnText);
      }

  });


}


/* *********************** */

function editTag(){

  let tagText = '';

  let origNode = tinymce.activeEditor.selection.getNode();

  let tagContentHTML = '';
  if(origNode.classList.contains('tag')){
    tagContentHTML = tinymce.activeEditor.serializer.serialize(tinymce.activeEditor.selection.getNode());
  }

  if(tagContentHTML !== ''){
    var templateEl = document.createElement('template');
    templateEl.innerHTML = tagContentHTML;
    let tagEl = templateEl.content.firstChild;

    tagText = tagEl.textContent;
  }

  editCode('Edit Tag', tagText, function (returnText) {
      
      let tagEl = document.createElement('pre');
      tagEl.classList = origNode.classList;
      tagEl.classList.add('tag');
      tagEl.setAttribute('contenteditable', 'false');
      tagEl.id = origNode.id;
      tagEl.setAttribute('style', 'display:none;');
      tagEl.textContent = returnText.trim();

      let tagText = tagEl.outerHTML;

      if(tagContentHTML !== ''){
        tinymce.activeEditor.selection.setContent(tagText);
      } else {
        tinymce.activeEditor.insertContent(tagText);
      }

  });
}

/* *********************** */

function editHead() {
  let headEl = currentDocument.querySelector('head');

  let styleEl = headEl.querySelector('style');
  let styleHTML = '';
  if (styleEl) {
    styleHTML = styleEl.outerHTML;
  }

  let headCopyEl = headEl.cloneNode(true);
  headCopyEl.removeChild(headCopyEl.querySelector('style'));

  let headText = headCopyEl.innerHTML.trim();

  headText = html_beautify(headText);

  editCode('Edit Head', headText, function (returnText) {
    headEl.innerHTML = returnText + '\n\n' + styleHTML;
  });
}

/* *********************** */

function editBody() {
  let editor = tinymce.activeEditor;

  let bodyText = editor.getContent({ format: 'html' });

  currentDocument.body.innerHTML = bodyText;

  let htmlText = currentDocument.body.innerHTML;

  htmlText = html_beautify(htmlText);

  editCode('Edit Body', htmlText, function (returnText) {

    currentDocument.body.innerHTML = returnText;

    let htmlText = currentDocument.body.innerHTML;

    editor.setContent(htmlText, { format: 'html' });
  });
}

/* *********************** */

function editDocProps() {
  let editor = tinymce.activeEditor;

  let headEl = currentDocument.documentElement.querySelector('head');

  let jsonld = getJsonld(headEl);

  let initialData = Object.assign({}, jsonld);

  if (initialData.dateCreated) {
    let localDate = new Date(initialData.dateCreated);
    initialData.dateCreated = localDate.toLocaleString(Intl.Locale, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  editor.windowManager.open({
    title: 'Edit Document Properties',
    body: {
      type: 'panel',
      items: [
        { type: 'input', label: 'Title', name: 'name' },
        { type: 'input', label: 'Description', name: 'description' },
        { type: 'input', label: 'Author', name: 'author' },
        { type: 'input', label: 'Created', name: 'dateCreated' },
      ],
    },
    buttons: [
      { type: 'cancel', name: 'cancel', text: 'Cancel' },
      { type: 'submit', name: 'save', text: 'Save', primary: true },
    ],
    initialData: initialData,
    onSubmit: function (api) {
      let data = api.getData();
      let titleEl = headEl.querySelector('title');
      titleEl.textContent = data.name;

      if (data.dateCreated) {
        try {
          let isoDate = new Date(data.dateCreated);
          data.dateCreated = isoDate.toISOString();
        } catch (e) {
          data.dateCreated = jsonld.dateCreated || '';
        }
      }

      jsonld.name = data.name;
      jsonld.description = data.description;
      jsonld.author = data.author;
      jsonld.dateCreated = data.dateCreated;

      setJsonld(headEl, jsonld);

      localStorage.setItem('author', data.author);

      api.close();
    },
  });
}


/* *********************** */

function editPrefs() {

  let editor = tinymce.activeEditor;

  let initialData = {
    author: localStorage.getItem('author') || '',
    localServer: localStorage.getItem('localServer') || '',
  }

  editor.windowManager.open({
    title: 'Edit App Preferences',
    body: {
      type: 'panel',
      items: [
        { type: 'input', label: 'Author', name: 'author' },
        { type: 'input', label: 'Doc Base URL', 'placeholder': 'http://localhost:3000/', name: 'localServer' },
      ],
    },
    buttons: [
      { type: 'cancel', name: 'cancel', text: 'Cancel' },
      { type: 'submit', name: 'save', text: 'Save', primary: true },
    ],
    initialData: initialData,
    onSubmit: function (api) {
      let data = api.getData();
      
      let localServer = data.localServer || '';

      if( localServer !== '' && localServer.endsWith('/') == false){
        localServer = localServer + '/';
      }

      let currentLocalServer = localStorage.getItem('localServer') || '';


      localStorage.setItem('author', data.author) || '';

      if(localServer == ''){
        localStorage.removeItem('localServer');
      } else {
        localStorage.setItem('localServer', localServer);
      }
      let baseEl = editor.getDoc().querySelector('head base');
      if(baseEl){
        if(localServer == ''){
          baseEl.remove();
        } else {
          baseEl.href = localServer;
        }
      }



      if(localServer !== currentLocalServer){
        editor.execCommand('mceCleanup');
      }
      api.close();
    },
  });
}


/* *********************** */

let cssCodeEditor = null;

function openCSSEditor(editor, wrapperEl) {
  let styleEl = currentDocument.documentElement.querySelector('style');

  let cssText = styleEl.textContent.trim();

  let cssEditorEl = document.querySelector('#css-editor');

  if (cssEditorEl !== null && cssCodeEditor !== null) {
    cssCodeEditor.setValue(cssText);
  } else {
    wrapperEl.innerHTML = `<div id="css-wrapper">
    <div id="css-header" class="tox-dialog__title">
      <span>Edit CSS</span>
      <div class="tox-icon" onclick="toggleSidebarCSS();">
        <svg width="24" height="24" focusable="false"><path d="M17.3 8.2 13.4 12l3.9 3.8a1 1 0 0 1-1.5 1.5L12 13.4l-3.8 3.9a1 1 0 0 1-1.5-1.5l3.9-3.8-3.9-3.8a1 1 0 0 1 1.5-1.5l3.8 3.9 3.8-3.9a1 1 0 0 1 1.5 1.5Z" fill-rule="evenodd"></path></svg>
      </div>
    </div>
    <div id="css-editor"></div>
    </div>`;
    let cssEditorEl = document.querySelector('#css-editor');

    let cssCodeEditor = CodeMirror(cssEditorEl, {
      autoCloseBrackets: true,
      autoCloseTags: true,
      bothTags: true,
      dragDrop: false,
      extraKeys: { 'Ctrl-Space': 'autocomplete', 'Ctrl-J': 'toMatchingTag' },
      indentUnit: 2,
      indentWithTabs: false,
      lineNumbers: false,
      lineWrapping: true,
      matchBrackets: true,
      mode: 'text/css',
      saveCursorPosition: true,
      styleActiveLine: true,
      tabSize: 2,
      viewportMargin: Infinity,
      value: cssText,
    });

    cssCodeEditor.setSize('100%', '100%');

    cssCodeEditor.on('changes', function (cm) {
      let newCSSText = cm.getValue();
      styleEl.textContent = newCSSText.trim();
      tinymce.activeEditor.getDoc().querySelector('#mceDefaultStyles').textContent = '';
      tinymce.activeEditor.dom.addStyle(newCSSText);
      tinymce.activeEditor.setDirty(true);

      
    });
  }
}


/* *********************** */

async function getHelpFiles() {
  let files = {};

  let errorText = '<p>Help files not loaded...</p>';

  let response;

  response = await fetch('./help/shortcuts-help.html');
  if (response.ok) {
    files['shortcuts-help'] = await response.text();
  } else {
    files['shortcuts-help'] = errorText;
  }

  response = await fetch('./help/about-help.html');
  if (response.ok) {
    files['about-help'] = await response.text();
  } else {
    files['about-help'] = errorText;
  }

  response = await fetch('./help/images-help.html');
  if (response.ok) {
    files['images-help'] = await response.text();
  } else {
    files['images-help'] = errorText;
  }

  files['build-version'] = '<p> Build Date: ' + new Date(buildDateTime).toLocaleString() + '</p>';

  return files;
}

/* *********************** */

function pastePreprocess(editor, args) {
  let el = document.createElement('div');
  el.innerHTML = args.content;
  walkDOM(el, cleanNode);

  let content = el.innerHTML;

  content = content.replaceAll('<br />', '<p>');
  content = content.replaceAll('<div', '<p');
  content = content.replaceAll('</div>', '</p>');

  args.content = content;
}

function walkDOM(node, func) {
  cleanNode(node);
  node = node.firstChild;
  while (node) {
    walkDOM(node, func);
    node = node.nextSibling;
  }
}

function cleanNode(node) {
  if (node.attributes) {
    let atts = node.attributes;
    let count = atts.length;
    let names = [];
    for(let x = 0; x < count; x++){
      names.push(atts[x].name);
    }
    for(let i = 0; i < names.length; i++){
      let name = names[i];
      if(name == 'height' || name == 'width'){
        node.removeAttribute(name);
      }
      if(name == 'style'){
          let style = node.style;
          for (let y = 0; y < style.length; ++y) {
              let item = style.item(y);
              if(item == 'font-family' || item  == 'font-style' || item == 'width' || item == 'height'){
                node.style[item] = null;
              }
          }
      }
    }
  }
}


/* *********************** */

function filePicker(callback, value, meta) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');

  input.addEventListener('change', function (e) {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const id = 'blobid' + new Date().getTime();
      const blobCache = tinymce.activeEditor.editorUpload.blobCache;
      const base64 = reader.result.split(',')[1];
      const blobInfo = blobCache.create(id, file, base64);
      blobCache.add(blobInfo);

      callback(blobInfo.blobUri(), {filename: file.name});
    });
    reader.readAsDataURL(file);
  });

  input.click();
}

/* *********************** */

function toggleSidebarCSS(flag) {

  if(flag === false && flag == cssToggleState){
    return;
  }

  cssToggleState = !cssToggleState;

  tinymce.activeEditor.execCommand('ToggleSidebar', false, 'edit-css');
 
}



/* *********************** */

function toggleDarkMode(flag){
  let editor = tinymce.activeEditor;

  if(flag === true || flag === false){
    darkModeToggle = flag;
  } else {
    darkModeToggle = !darkModeToggle;
  }

  localStorage.setItem('darkMode', darkModeToggle + '');

  if (darkModeToggle) {
    editor.getDoc().documentElement.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
  } else {
    editor.getDoc().documentElement.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-mode');
  }

}

/* *********************** */

function toggleTextMenu(flag){

  if(flag === true || flag === false){
    textMenuToggleState = flag;
  } else {
    textMenuToggleState = !textMenuToggleState;
  }

  localStorage.setItem('textMenu', textMenuToggleState + '');

  if (textMenuToggleState) {
    document.documentElement.classList.add('file-menu');
  } else {
    document.documentElement.classList.remove('file-menu');
  }

}
