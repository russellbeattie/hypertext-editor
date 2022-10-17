/* *********************** */

var currentDocument;

/* *********************** */

async function getHTMLTemplate() {
  let htmlText = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src * data: blob:; style-src 'unsafe-inline' *; script-src 'none'; child-src 'none';" />
<title></title>
<link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA10lEQVRIie3VP2pCQRDH8U+CSfQyHiCSJoVExcNYpQu2VjlIihRpUmiVfwjeR0PAWLg2q29976HwBL+wLMzMzm9md9nl1LnIsHfQ3LN2hkkZ0Tb+c4xf9MsIPIUE9UTMMMQs0E0lu0zYFjmKucErekUEinKNF9wfSwAaeMNt7KiVTPiJUWR7tL4g34cQGIcRC2xxqC3K5OgCebboGXcZvg8MUosr0UGywn1UooPzGWyxDHPquY7ZxC5jx64OfsI8LyCwYRobsr7MB7RwlTPxH77wXqKoirMCzd8mEpBQY98AAAAASUVORK5CYII=">
</head>
<body>
</body>
</html>`;

  return htmlText;
}

/* *********************** */

function getJsonld(headEl) {
  let jsonld = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: '',
    description: '',
    author: '',
    dateCreated: '',
    dateModified: '',
  };

  if (!headEl) {
    return jsonld;
  }

  let jsonEl = headEl.querySelector('script[type="application/ld+json"]');

  if (jsonEl) {
    try {
      let docJsonld = JSON.parse(jsonEl.textContent);
      Object.assign(jsonld, docJsonld);
    } catch (e) {}
  }

  let titleEl = headEl.querySelector('title');
  let title = '';
  if (titleEl) {
    title = titleEl.textContent;
  }

  if (jsonld.title == '' && title !== '') {
    jsonld.title = title;
  }

  return jsonld;
}

/* *********************** */

function setJsonld(headEl, jsonld) {
  let textContent = '';

  try {
    textContent = JSON.stringify(jsonld, null, '  ');
  } catch (e) {
    textContent = JSON.stringify(getJsonld(), null, '  ');
  }

  let jsonEl = headEl.querySelector('script[type="application/ld+json"]');

  if (!jsonEl) {
    jsonEl = headEl.ownerDocument.createElement('script');
    jsonEl.setAttribute('type', 'application/ld+json');
    headEl.append(jsonEl);
  }

  jsonEl.textContent = '\n' + textContent + '\n';
}

/* *********************** */

function confirmDocumentChange() {
  tinyMCE.get('textEditor').getBody().focus();

  if (tinymce.activeEditor.isDirty()) {
    return confirm('Unsaved changes. Continue without saving?');
  } else {
    return true;
  }
}

/* *********************** */

async function newDocument() {
  htmlText = await getHTMLTemplate();

  return loadDocument(htmlText);
}

/* *********************** */

async function loadDocument(htmlText) {
  const parser = new DOMParser();

  currentDocument = parser.parseFromString(htmlText, 'text/html');

  let headEl = currentDocument.querySelector('head');

  let cssText = '';

  let stylesEl = headEl.querySelectorAll('style');

  if (stylesEl.length > 0) {
    stylesEl.forEach(function(styleEl){
      cssText = cssText + styleEl.textContent + '\n';
      stylesEl.forEach(function(el){
        el.remove();
      });
    });
  } else {
    cssText = await getDefaultCSSText();
  }

  let styleEl = currentDocument.createElement('style');
  styleEl.textContent = cssText;
  headEl.append(styleEl);

  let currentStyleEl = tinymce.activeEditor.getDoc().querySelector('#mceDefaultStyles');

  if(currentStyleEl){
    currentStyleEl.textContent = '';
  }
  
  tinymce.activeEditor.dom.addStyle(cssText);
  
  let linksEl = headEl.querySelectorAll('link[rel="stylesheet"]');

  linksEl.forEach(function (linkEl) {
    let href = linkEl.getAttribute('href');
    if(href.startsWith('http:')){
      tinymce.activeEditor.dom.loadCSS(href);
    }
  });

  let jsonld = getJsonld(headEl);

   if(jsonld.dateCreated == ''){
      jsonld.dateCreated = new Date().toISOString();
      jsonld.dateModified = new Date().toISOString();
    }

  let author = localStorage.getItem('author');
  if (author !== null) {
    jsonld.author = author;
  }

  setJsonld(headEl, jsonld);

  let bodyText = currentDocument.body.innerHTML;

  tinymce.activeEditor.resetContent(bodyText);

  tinymce.activeEditor.undoManager.clear();
  tinymce.activeEditor.setDirty(false);
}

/* *********************** */

function getDocumentHTMLToSave() {
  let title = '';

  let headEl = currentDocument.querySelector('head');

  let jsonld = getJsonld(headEl);

  jsonld.dateModified = new Date().toISOString();

  let titleEl = headEl.querySelector('title');

  if (titleEl) {
    if (titleEl.textContent == '') {
      let h1 = tinymce.activeEditor.dom.getRoot().querySelector('h1');
      if (h1) {
        title = h1.textContent;
        titleEl.textContent = title;
      }
    } else {
      title = titleEl.textContent;
    }
  }

  jsonld.name = title;

  setJsonld(headEl, jsonld);

  let content = tinymce.activeEditor.getContent({ format: 'html' });

  currentDocument.body.innerHTML = content;

  let htmlText = currentDocument.documentElement.outerHTML;

  return htmlText;
}

/* *********************** */

function getUnformattedHTML(){

  let newDoc = document.implementation.createHTMLDocument();
  newDoc.body.innerHTML = tinymce.activeEditor.getContent({ format: 'html' });

  let htmlText = newDoc.documentElement.outerHTML;

  return htmlText;

}


/* *********************** */

async function getDefaultCSSText(){

  let defaultCSS = localStorage.getItem('defaultCSS');

  if(defaultCSS){
    cssText = defaultCSS;
  } else {
    let response = await fetch('./css/html-document-v1.css');
    if (response.ok) {
      cssText = await response.text();
    }
  }

  return cssText;

}

/* *********************** */

function getCSSText(){
  let styleEl = currentDocument.querySelector('head style');
  if(styleEl){
    return styleEl.textContent;
  } else {
    return '';
  }
}

/* *********************** */

function setCSSText(cssText){
  let styleEl = currentDocument.querySelector('head style');
  if(styleEl && cssText && cssText !== ''){

    styleEl.textContent = cssText.trim();

    tinymce.activeEditor.getDoc().querySelector('#mceDefaultStyles').textContent = cssText.trim();

  }
}

/* *********************** */

function setCSSDefault(){

  tinymce.activeEditor.windowManager.confirm('Use this document\'s CSS for new documents?', (state) => {
    if(state){
      let cssText = getCSSText();
      localStorage.setItem('defaultCSS', cssText);
    }
  });

}

/* *********************** */

async function resetCSSDefault(){
  tinymce.activeEditor.windowManager.confirm('Reset default CSS used for new documents?', (state) => {
    if(state){
        localStorage.removeItem('defaultCSS');
      }
  });
}

/* *********************** */

