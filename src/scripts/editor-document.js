/* *********************** */

var currentDocument;

/* *********************** */

async function getHTMLTemplate() {
  let htmlText = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title></title>
<link rel="icon" href="data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='4' y='24' font-size='34' fill='%23020887'%3Eh%3C/text%3E%3C/svg%3E">
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

  tinymce.activeEditor.getWin().scroll(0,0);
}

/* *********************** */

function getDocumentHTMLToSave() {

  let headEl = currentDocument.querySelector('head');

  let jsonld = getJsonld(headEl);

  jsonld.dateModified = new Date().toISOString();

  let title = getTitle();

  jsonld.name = title;

  setJsonld(headEl, jsonld);

  let content = tinymce.activeEditor.getContent({ format: 'html' });

  currentDocument.body.innerHTML = content;

  let htmlText = '<!DOCTYPE html>\n' + currentDocument.documentElement.outerHTML;

  htmlText = beautify(htmlText);

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

function getTitle(){

  let title = '';

  let titleEl = currentDocument.querySelector('title');

  if (titleEl) {
    if (titleEl.textContent == '') {
      let h1El = tinymce.activeEditor.getDoc().querySelector('h1');
      if (h1El) {
        title = h1El.textContent.trim();
        titleEl.textContent = title;
      }
    } else {
      title = titleEl.textContent;
    }
  }

  return title;

}


/* *********************** */

function getSuggestedFileName(){

  let filename = '';

  let title = getTitle();
  if(title !== ''){
    filename = title.trim().replaceAll(' ','-').replace(/[^a-z0-9-]/gi, '').replace(/-+/gi,'-').toLowerCase();
  } else {
    filename = getDateTimeText();
  }

  return filename + '.html';


}


/* *********************** */

function getDateTimeText(){

  let dt = new Date();

  let y = dt.getFullYear();
  let m = ((dt.getMonth() + 1) + '').padStart(2, '0');  
  let d = (dt.getDate() + '').padStart(2, '0');
  let h = (dt.getHours() + '').padStart(2, '0');
  let t = (dt.getMinutes() + '').padStart(2, '0');

  let dateTime = y + '-' + m + '-' + d+ '-' + h + '-' +  t;

  return dateTime;

}

