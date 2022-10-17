
/* *********************** */

function showInsertTag() {

  let tagText = tinymce.activeEditor.selection.getNode().textContent;

  tinymce.activeEditor.windowManager.open({
    title: 'Insert Tag',
    size: 'normal',
    body: {
      type: 'panel',
      items: [{ type: 'input', name: 'tag' }],
    },
    initialData: {
      tag: tagText
    },
    buttons: [
      { type: 'cancel', name: 'cancel', text: 'Cancel' },
      { type: 'submit', name: 'save', text: 'Save', primary: true },
    ],
    onSubmit: function (api) {
      let tag = api.getData().tag;

      let tagEl = document.createElement('ins');
      tagEl.classList.add('tag');
      tagEl.textContent = tag;

      let tagHtml = tagEl.outerHTML;

      tinymce.activeEditor.insertContent(tagHtml);

      api.close();
    },
  });
}



/* *********************** */

function showEditBlockMenu() {

  let selectedEl = tinymce.activeEditor.selection.getNode();

  let markup = selectedEl.outerHTML;

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
      tinymce.activeEditor.selection.getNode().outerHTML = markup;
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
  let doc = tinymce.activeEditor.dom.getRoot();

  let headers = doc.querySelectorAll('h1, h2, h3, h4, h5');

  var details = document.createElement('details');
  details.id = 'table-of-contents';
  details.setAttribute('contenteditable', 'false');

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
      anchor.href = '#' + header.id;
      anchor.textContent = ' • ' + header.textContent.trim();

      tocList.append(anchor);
      let br = document.createElement('br');
      tocList.appendChild(br);
    }
  });

  if (innerFlag) {
    return details.innerHTML;
  } else {
    tinymce.activeEditor.dom.remove(tinymce.activeEditor.dom.select('#table-of-contents'));
    editor.insertContent(tocStr);
  }
}

/* *********************** */

function beforeGetContent() {
  let dom = tinymce.activeEditor.dom;

  let toc = dom.get('table-of-contents');

  if (toc) {
    let htmlText = createTableOfContents(true);
    dom.setHTML(toc, htmlText);
  }
}

/* *********************** */

var codeEditor;

function editCode(title, codeText, callback) {
  let editor = tinymce.activeEditor;

  editor.windowManager.open({
    title: title,
    size: 'large',
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
                    mode: 'text/html',
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
      localStorage.setItem('localServer', localServer || '');
      let baseEl = editor.getDoc().querySelector('head base');
      if(baseEl){
        baseEl.href = localServer;
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
    while (node.attributes.length > 0) {
      node.removeAttributeNode(node.attributes[0]);
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
