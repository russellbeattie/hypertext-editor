/* *********************** */

var cssToggleState = false;
var toolbarToggleState = (localStorage.getItem('toolbar') === 'true');
var darkModeToggle = (localStorage.getItem('darkMode') === 'true');

let textMenuToggle = (localStorage.getItem('textMenu') === 'true');

toggleTextMenu(textMenuToggle);

let localServer = localStorage.getItem('localServer') || '';

function editorSetup(editor) {

  /* *********************** */

  editor.ui.registry.addIcon('body-icon', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m2 12.3 3.6-3.6 1.1 1.1-2.5 2.5 2.5 2.5-1 1.1zM8.4 6.2h4.3c.7 0 1.2.1 1.7.4.5.3.9.7 1.1 1.1a3 3 0 0 1 0 2.7c-.1.4-.4.7-.7 1 .5.1.9.5 1.1.9.3.4.5 1 .5 1.5 0 .6-.2 1.2-.4 1.7-.3.5-.6.8-1.1 1.1-.5.3-1.1.4-1.8.4H8.4V6.2Zm4.5 9.1c.3 0 .6 0 .8-.2.3-.1.5-.3.6-.5.2-.3.2-.5.2-.9 0-.3 0-.5-.2-.8 0-.2-.3-.4-.5-.5l-.9-.2h-2.7v3.1H13Zm-.3-4.8c.4 0 .8-.1 1-.3.3-.3.4-.6.4-1s-.1-.7-.4-1c-.2-.2-.5-.3-1-.3h-2.4v2.6h2.4ZM17.4 14.8l2.5-2.5-2.5-2.5 1.1-1.1 3.6 3.6-3.6 3.6z"/></svg>');
  editor.ui.registry.addIcon('head-icon', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M1.3 12.3 5 8.7 6 9.8l-2.5 2.5L6 14.8l-1 1.1zM7.7 6.2h1.8v4.5h5.1V6.2h1.8V17h-1.8v-4.6h-5V17H7.6zM18 14.8l2.6-2.5L18 9.8l1.2-1.1 3.6 3.6-3.6 3.6z"/></svg>');
  editor.ui.registry.addIcon('css-icon', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m1 12.3 3.6-3.6 1.1 1-2.5 2.6 2.5 2.5-1.1 1zM12 17.2c-1 0-1.9-.2-2.7-.7a4.6 4.6 0 0 1-1.8-2c-.4-.8-.6-1.8-.6-2.9 0-1.1.2-2.1.6-3 .4-.8 1-1.5 1.8-2 .8-.4 1.7-.6 2.8-.6.8 0 1.5.1 2.2.4.6.3 1.2.7 1.6 1.2.5.5.8 1.1 1 1.8l-1.8.5c-.2-.7-.6-1.2-1-1.6-.6-.4-1.2-.6-2-.6-.7 0-1.3.1-1.8.5a3 3 0 0 0-1.1 1.3c-.3.6-.4 1.3-.4 2.1s.1 1.5.4 2c.2.7.6 1.1 1 1.4.6.4 1.2.5 1.9.5.8 0 1.4-.2 2-.6.4-.4.8-1 1-1.6l1.8.5c-.2.7-.5 1.3-1 1.8-.4.5-1 1-1.6 1.2-.7.3-1.4.4-2.2.4ZM18.3 14.8l2.5-2.5-2.5-2.5 1.1-1.1 3.6 3.6-3.6 3.6z"/></svg>');
  editor.ui.registry.addIcon('docprops-icon', '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M8.3 17.8h7.4v-1.6H8.3Zm0-4h7.4v-1.6H8.3Zm-2 7.7q-.8 0-1.3-.5-.5-.6-.5-1.3V4.3q0-.7.5-1.3.5-.5 1.3-.5h8l5.2 5.3v11.9q0 .8-.5 1.3t-1.3.5Zm7.2-13V4H6.3l-.2.1-.1.2v15.4l.1.2.2.1h11.4l.2-.1.1-.2V8.5ZM6 4v4.5V4v16V4Z"/></svg>');
  editor.ui.registry.addIcon('toolbar-icon', '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 17h4v-4H7Zm0-6h4V7H7Zm6 6h4v-4h-4Zm0-6h4V7h-4Zm-9 9q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm0-2h16V6H4v12Zm0 0V6v12Z"/></svg>');
  editor.ui.registry.addIcon('cssfile-icon', '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M9.8 14.5h1.6l.8-2.3h3.7l.8 2.3h1.5l-3.4-9h-1.6Zm2.9-3.6L14 7.1l1.4 3.8ZM8 18q-.8 0-1.4-.6Q6 16.8 6 16V4q0-.8.6-1.4Q7.2 2 8 2h12q.8 0 1.4.6.6.6.6 1.4v12q0 .8-.6 1.4-.6.6-1.4.6Zm0-2h12V4H8v12Zm-4 6q-.8 0-1.4-.6Q2 20.8 2 20V6h2v14h14v2ZM8 4v12V4Z"/></svg>');
  editor.ui.registry.addIcon('textmenu-icon', '<svg width="24" height="24"><path d="M18 11H6V9h12v2Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2 16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8Zm3 1h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1Z"/></svg>');
  editor.ui.registry.addIcon('export-icon', '<svg width="24" height="24"><path d="m16.95 5.97-1.41 1.41L13 4.85v12.2h-2V4.84L8.46 7.38 7.05 5.97 12 1.02l4.95 4.95Z"/><path d="M5 20.98v-10h4v-2H3v14h18v-14h-6v2h4v10H5Z"/></svg>');
  editor.ui.registry.addIcon('File', '<svg width="24" height="24"><path d="M10 12a1 1 0 1 0 0 2h4a1 1 0 0 0 0-2h-4Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H4Zm16 2H4a1 1 0 0 0-1 1v3h18V5a1 1 0 0 0-1-1ZM3 19v-9h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/></svg>');
  editor.ui.registry.addIcon('Edit', '<svg width="24" height="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.26 2.3a1 1 0 0 0-1.41 0l-.87.87a3 3 0 0 0-3.42.58l-10.6 10.6 5.65 5.67L21.21 9.4a3 3 0 0 0 .6-3.42l.87-.87a1 1 0 0 0 0-1.41l-1.42-1.42ZM17 10.8 10.6 17.2l-2.83-2.83 6.39-6.38L17 10.8ZM18.8 9l1-1a1 1 0 0 0 0-1.41l-1.42-1.41a1 1 0 0 0-1.41 0l-1 .99 2.83 2.83Z"/><path d="m2 22.95 2.12-7.78 5.66 5.66L2 22.95Z"/></svg>');
  editor.ui.registry.addIcon('View', '<svg width="24" height="24"><path d="M3 3h6v2H5v4H3V3ZM3 21h6v-2H5v-4H3v6ZM15 21h6v-6h-2v4h-4v2ZM21 3h-6v2h4v4h2V3Z"/></svg>');
  editor.ui.registry.addIcon('Insert', '<svg width="24" height="24"><path d="M12 6a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5 22a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5Zm-1-3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14Z"/></svg>');
  editor.ui.registry.addIcon('Format', '<svg width="24" height="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.95 3.2a1 1 0 0 0-.95-.57 1 1 0 0 0-.95.58L5.14 15.9a1 1 0 1 0 1.8.84l1.46-3.1h7.2l1.45 3.1a1 1 0 0 0 1.81-.84L12.95 3.2Zm1.72 8.43L12 5.91l-2.67 5.72h5.34Z"/><path d="M6 19.37a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2H6Z"/></svg>');
  editor.ui.registry.addIcon('Tools', '<svg width="24" height="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 5.5h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-12c0-1.1.9-2 2-2h3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3Zm-3-1h-4a1 1 0 0 0-1 1h6a1 1 0 0 0-1-1Zm6 3H4v2h16v-2Zm-16 12v-8h3v2h4v-2h2v2h4v-2h3v8H4Z"/></svg>');
  editor.ui.registry.addIcon('Table', '<svg width="24" height="24"><path d="M4 4h4v4H4V4ZM4 10h4v4H4v-4ZM8 16H4v4h4v-4ZM10 4h4v4h-4V4ZM14 10h-4v4h4v-4ZM10 16h4v4h-4v-4ZM20 4h-4v4h4V4ZM16 10h4v4h-4v-4ZM20 16h-4v4h4v-4Z"/></svg>');
  editor.ui.registry.addIcon('Help', '<svg width="24" height="24"><path d="M11 10.98a1 1 0 1 1 2 0v6a1 1 0 1 1-2 0v-6ZM12 6.05a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z"/></svg>');
  editor.ui.registry.addIcon('Paragraphs', '<svg width="24" height="24"><path d="M8.02 6.98a1 1 0 0 0 0 2h7.95a1 1 0 0 0 0-2H8.02ZM7.02 12a1 1 0 0 1 1-1h7.95a1 1 0 0 1 0 2H8.02a1 1 0 0 1-1-1ZM8.02 15.01a1 1 0 0 0 0 2h7.96a1 1 0 0 0 0-2H8.02Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm3-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></svg>');

  /* *********************** */

  editor.ui.registry.addMenuItem('attributes', {
    icon: 'sourcecode',
    text: 'Attributes',
    onAction: function () {
      showAttributesMenu();
    },
  });

  editor.ui.registry.addButton('attributes', {
    icon: 'sourcecode',
    onAction: function () {
      showAttributesMenu();
    },
  });

  editor.ui.registry.addContextMenu('attributes', {
    update: (element) => (element.nodeName.toLowerCase() == 'body') ? '' : 'attributes'
  });

  /* *********************** */

  editor.ui.registry.addMenuItem('edit-block', {
    icon: 'sourcecode',
    text: 'Edit Block...',
    onAction: function () {
      showEditBlockMenu();
    },
  });

  editor.ui.registry.addButton('edit-block', {
    icon: 'sourcecode',
    onAction: function () {
      showEditBlockMenu();
    },
  });

  editor.ui.registry.addContextMenu('edit-block', {
    update: (element) => (element.nodeName.toLowerCase() == 'body') ? '' : 'edit-block'
  });

  /* *********************** */

  editor.ui.registry.addMenuItem('add-tag', {
    icon: 'addtag',
    text: 'Tag',
    onAction: function () {
      showInsertTag();
    },
  });

  editor.ui.registry.addButton('add-tag', {
    icon: 'addtag',
    onAction: function () {
      showInsertTag();
    },
  });

  editor.ui.registry.addContextMenu('add-tag', {
    update: (element) => !element.classList.contains('tag') ? '' : 'add-tag'
  });

  /* *********************** */

  editor.ui.registry.addSidebar('edit-css', {
    tooltip: 'Edit CSS',
    icon: 'css-icon',
    onShow: function (api) {
      openCSSEditor(editor, api.element());
    }
  });

  editor.ui.registry.addToggleMenuItem('edit-css', {
    icon: 'css-icon',
    text: 'Edit CSS',
    shortcut: 'Meta+Shift+0',
    onAction: function () {
      toggleSidebarCSS();
    }, 
    onSetup: function (api) {
      api.setActive(cssToggleState);
      return () => {};
    },
  });

  /* *********************** */

  editor.ui.registry.addButton('edit-head', {
    icon: 'head-icon',
    onAction: function () {
      editHead();
    },
  });

  editor.ui.registry.addMenuItem('edit-head', {
    icon: 'head-icon',
    text: 'Edit Head...',
    shortcut: 'Meta+Shift+8',
    onAction: function () {
      editHead();
    },
  });

  /* *********************** */

  editor.ui.registry.addButton('edit-body', {
    icon: 'body-icon',
    onAction: function () {
      editBody();
    },
  });

  editor.ui.registry.addMenuItem('edit-body', {
    icon: 'body-icon',
    text: 'Edit Body...',
    shortcut: 'Meta+Shift+9',
    onAction: function () {
      editBody();
    },
  });

  /* *********************** */

  editor.ui.registry.addButton('edit-prefs', {
    icon: 'preferences',
    onAction: function () {
      editPrefs();
    },
  });

  editor.ui.registry.addMenuItem('edit-prefs', {
    icon: 'preferences',
    text: 'Preferences',
    onAction: function () {
      editPrefs();
    },
  });

  /* *********************** */

  editor.ui.registry.addButton('edit-doc-props', {
    icon: 'docprops-icon',
    onAction: function () {
      editDocProps();
    },
  });

  editor.ui.registry.addMenuItem('edit-doc-props', {
    icon: 'docprops-icon',
    text: 'Document Properties',
    onAction: function () {
      editDocProps();
    },
  });

  /* *********************** */

  editor.ui.registry.addButton('add-toc', {
    icon: 'toc',
    onAction: function () {
      createTableOfContents();
    },
  });

  editor.ui.registry.addMenuItem('add-toc', {
    icon: 'toc',
    text: 'Table of Contents',
    onAction: function () {
      createTableOfContents();
    },
  });

  /* *********************** */

  editor.ui.registry.addToggleMenuItem('toggle-textmenu', {
    icon: 'textmenu-icon',
    text: 'Show Text Menu',
    onAction: function () {
      toggleTextMenu();
    },
    onSetup: function (api) {
      api.setActive(textMenuToggle);
      return () => {};
    },
  });

  /* *********************** */

  editor.ui.registry.addToggleMenuItem('toggle-darkmode', {
    icon: 'contrast',
    text: 'Toggle dark mode',
    onAction: function () {
      toggleDarkMode();
    },
    onSetup: function (api) {
      api.setActive(darkModeToggle);
      return () => {};
    },
  });

  /* *********************** */

  editor.ui.registry.addNestedMenuItem('cssfile-menu', {
    icon: 'cssfile-icon',
    text: 'CSS',
    getSubmenuItems: () => [
      {
        type: 'menuitem',
        text: 'Import CSS',
        onAction: function () {
          importCSSFile();
        },
      },
      {
        type: 'menuitem',
        text: 'Export CSS',
        onAction: function () {
          exportCSSFile();
        },
      },
      {
        type: 'menuitem',
        text: 'Save as my default...',
        onAction: function () {
          setCSSDefault();
        },
      },
      {
        type: 'menuitem',
        text: 'Reset default...',
        onAction: function () {
          resetCSSDefault();
        },
      },
    ],
  });


  /* *********************** */

    editor.ui.registry.addToggleMenuItem('visualaid-option', {
      text: 'Show invisible items',
      icon: 'drag',
      onSetup: function(api){
        api.setActive(editor.hasVisual);
      },
      onAction: function(){
        tinyMCE.execCommand('mceToggleVisualAid');
      }
    });

    editor.ui.registry.addButton('visualaid-option', {
      tooltip: 'Visual aids',
      text: 'Visual aids',
      icon: 'drag',
      onAction: function(){
        tinyMCE.execCommand('mceToggleVisualAid');
      }
    });


  /* *********************** */

  editor.ui.registry.addMenuItem('menunew', {
    icon: 'new-document',
    text: 'New',
    onAction: function () {
      if (confirmDocumentChange()) {
        toggleSidebarCSS(false);
        newHTMLFile();
      }
    },
  });

  /* *********************** */

  editor.ui.registry.addMenuItem('menuopen', {
    icon: 'browse',
    text: 'Open',
    shortcut: 'Meta+O',
    onAction: function () {
      if (confirmDocumentChange()) {
        toggleSidebarCSS(false);
        openHTMLFile();
      }
    },
  });

  /* *********************** */

  editor.ui.registry.addMenuItem('menusave', {
    icon: 'save',
    text: 'Save',
    shortcut: 'Meta+S',
    onAction: function () {
      saveHTMLFile();
    },
  });

  /* *********************** */

  editor.ui.registry.addMenuItem('menusaveas', {
    icon: 'save',
    text: 'Save As...',
    shortcut: 'Meta+Shift+S',
    onAction: function () {
      saveHTMLFileAs();
    },
  });

  /* *********************** */

  editor.ui.registry.addMenuItem('blockquotemenu', {
    icon: 'quote',
    text: 'Blockquote',
    onAction: function () {
      tinyMCE.execCommand('mceBlockQuote');
    },
  });

  /* *********************** */

  editor.ui.registry.addMenuItem('unordered', {
    icon: 'unordered-list',
    text: 'Bullet List',
    onAction: function () {
      tinyMCE.execCommand('InsertUnorderedList');
    },
  });

  /* *********************** */

  editor.ui.registry.addMenuItem('ordered', {
    icon: 'ordered-list',
    text: 'Numbered List',
    onAction: function () {
      tinyMCE.execCommand('InsertOrderedList');
    },
  });

  /* *********************** */

  editor.ui.registry.addNestedMenuItem('export', {
    text: 'Export',
    icon: 'export-icon',
    getSubmenuItems: () => [
      {
        type: 'menuitem',
        text: 'Unformatted HTML',
        onAction: function () {
          exportUnformattedHTML();
        },
      },
    ],
  });

  /* *********************** */


  editor.ui.registry.addNestedMenuItem('indentation', {
    text: 'Indentation',
    getSubmenuItems: () => [
      {
        type: 'menuitem',
        icon: 'indent',
        text: 'Indent',
        onAction: function () {
          tinyMCE.execCommand('indent');
        },
      },
      {
        type: 'menuitem',
        icon: 'outdent',
        text: 'Outdent',
        onAction: function () {
          tinyMCE.execCommand('outdent');
        },
      },
    ],
  });

  /* *********************** */

  editor.addShortcut('Meta+Shift+Z', 'Redo', function () {
    tinyMCE.execCommand('Redo');
  });

  editor.addShortcut('Meta+1', 'Heading 1', function () {
    tinyMCE.execCommand('mceToggleFormat', false, 'h1');
  });

  editor.addShortcut('Meta+2', 'Heading 2', function () {
    tinyMCE.execCommand('mceToggleFormat', false, 'h2');
  });

  editor.addShortcut('Meta+3', 'Heading 3', function () {
    tinyMCE.execCommand('mceToggleFormat', false, 'h3');
  });

  editor.addShortcut('Meta+4', 'Heading 4', function () {
    tinyMCE.execCommand('mceToggleFormat', false, 'h4');
  });

  editor.addShortcut('Meta+5', 'Blockquote', function () {
    tinyMCE.execCommand('mceBlockQuote');
  });

  editor.addShortcut('Meta+0', 'Paragraph', function () {
    tinyMCE.execCommand('mceToggleFormat', false, 'p');
  });

  editor.addShortcut('Meta+Shift+K', 'Code', function () {
    tinyMCE.execCommand('mceToggleFormat', false, 'code');
  });

  editor.addShortcut('Meta+D', 'Strikethrough', function () {
    tinyMCE.execCommand('Strikethrough');
  });

  editor.addShortcut('Meta+Shift+O', 'Numbered list', function () {
    tinyMCE.execCommand('InsertOrderedList');
  });

  editor.addShortcut('Meta+Shift+U', 'Bullet list', function () {
    tinyMCE.execCommand('InsertUnorderedList');
  });

  editor.addShortcut('Meta+Shift+T', 'Table', function () {
    tinyMCE.execCommand('mceInsertTable');
  });

  editor.addShortcut('Meta+Shift+I', 'Image', function () {
    tinyMCE.execCommand('mceImage');
  });

  editor.addShortcut('Meta+Shift+L', 'Justify left', function () {
    tinyMCE.execCommand('JustifyLeft');
  });

  editor.addShortcut('Meta+Shift+E', 'Justify center', function () {
    tinyMCE.execCommand('JustifyCenter');
  });

  editor.addShortcut('Meta+Shift+R', 'Justify right', function () {
    tinyMCE.execCommand('JustifyRight');
  });

  editor.addShortcut('Meta+Shift+J', 'Justify none', function () {
    tinyMCE.execCommand('JustifyNone');
  });

  editor.addShortcut('Meta+Shift+F', 'Remove format', function () {
    tinyMCE.execCommand('RemoveFormat');
  });

  editor.addShortcut('Meta+Shift+8', 'Edit Head', function () {
    editHead();
  });

  editor.addShortcut('Meta+Shift+9', 'Edit Body', function () {
    editBody();
  });

  editor.addShortcut('Meta+Shift+0', 'Edit CSS', function () {
    toggleSidebarCSS();
  });


  /* *********************** */

  editor.on('keyup', function (e) {
    overrideKeyboardEvent(e);
  });

  editor.on('keydown', function (e) {
    overrideKeyboardEvent(e);
  });

  /* *********************** */

  editor.on('Dirty', function (event) {
    updateWindowTitle();
  });

  /* *********************** */

  editor.on('init', function () {
    /* *********************** */

   (async function(editor){

     let helpFiles = await getHelpFiles();

      editor.plugins.help.addTab({
        name: 'shortcuts-help',
        title: 'Keyboard Shortcuts',
        items: [{
          type: 'htmlpanel',
          html: helpFiles['shortcuts-help']
        }]
      });
      editor.plugins.help.addTab({
        name: 'images-help',
        title: 'Images Help',
        items: [{
          type: 'htmlpanel',
          html: helpFiles['images-help']
        }]
      });
      editor.plugins.help.addTab({
        name: 'about-help',
        title: 'About Hypertext',
        items: [{
          type: 'htmlpanel',
          html: helpFiles['about-help']
        }]
      });
      editor.plugins.help.addTab({
        name: 'build-version',
        title: 'Build',
        items: [{
          type: 'htmlpanel',
          html: helpFiles['build-version']
        }]
      });

   })(editor);

    /* *********************** */

    editor.on('BeforeGetContent', beforeGetContent());

    /* *********************** */

    toggleDarkMode(darkModeToggle);

    /* *********************** */

    if (toOpenHTMLFileHandle !== null) {
      openHTMLFile(toOpenHTMLFileHandle);
    } else {
      newDocument();
    }

    /* *********************** */

    if(tinymce.Env.deviceType.isDesktop()){

      let logoEl = document.querySelector('#logo');
      if(!logoEl){
        logoEl = document.createElement('a');
        logoEl.href = 'https://www.hypertext.plus';
        logoEl.target = '_blank';
        logoEl.id = 'logo';
        let menubar = document.querySelector('.tox-menubar');
        menubar.append(logoEl);
      }

    }

    /* *********************** */

    window.addEventListener('beforeunload', function (event) {
      if (tinymce.activeEditor.isDirty()) {
        event.preventDefault();
        return (event.returnValue = 'Are you sure you want to exit?');
      }
    });
  });
}
