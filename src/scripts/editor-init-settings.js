/* *********************** */
  
  let contentCSSUrl = './css/doc-wrapper.css';
  let skinName = './css/hypertext-skin';

  let content_css = new URL(contentCSSUrl, window.location.href).toString();
  let skin_url = new URL(skinName, window.location.href).toString();
  let theme_url = new URL('./scripts/hypertext-theme.js', window.location.href).toString();
  let model_url = new URL('./scripts/hypertext-model.js', window.location.href).toString();


let editorInitSettings = {
  selector: '#textEditor',
  document_base_url: localServer,
  content_css: content_css,
  skin_url: skin_url,
  theme_url: theme_url,
  min_height: 1088,
  max_width: 816,

  model_url: model_url,

  setup: editorSetup,

  plugins: ['anchor', 'autolink', 'autosave', 'codesample', 'help', 'insertdatetime', 'link', 'lists', 'searchreplace', 'table', 'visualblocks', 'visualchars', 'wordcount'],

  contextmenu: 'undo redo | link anchor | forecolor backcolor | image | table | attributes | edit-tag',

  toolbar: false,

  menubar: 'file edit view insert format blocks tools help',

  menu: {
    file: { title: 'File', items: 'menunew menuopen | menusave menusaveas | cssfile-menu | edit-doc-props | restoredraft | preview print ' },
    edit: { title: 'Edit', items: 'undo redo | cut copy paste selectall | pastetext | searchreplace' },
    view: { title: 'View', items: 'visualaid-option visualchars visualblocks | toggle-textmenu toggle-darkmode | wordcount' },
    insert: { title: 'Insert', items: 'link image embed codesample hr add-toc | inserttable | anchor | unordered ordered | insertdatetime' },
    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat forecolor backcolor | removeformat ' },
    blocks: { title: 'Paragraphs', items: 'styles | indentation align' },
    tools: { title: 'Tools', items: 'edit-prefs | edit-head edit-body edit-css edit-block edit-tag | run-macro ' },
    help: { title: 'Help', items: 'help' },
  },

  style_formats: [
    { title: 'Headings', items: [
      { title: 'Heading 1', format: 'h1' },
      { title: 'Heading 2', format: 'h2' },
      { title: 'Heading 3', format: 'h3' },
      { title: 'Heading 4', format: 'h4' },
      { title: 'Heading 5', format: 'h5' },
    ]},
    { title: 'Blocks', items: [
      { title: 'Paragraph', format: 'p' },
      { title: 'Blockquote', format: 'blockquote' },
      { title: 'Pre', format: 'pre' }
    ]}
  ],

  block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote; Pre=pre',

  valid_elements: '*[*]',
  extended_valid_elements : "a[class|name|href|target|title|rel],script[*],iframe[*],img[class|src|alt|title|width|height|align|name],object[*],embed[*]",


  // protect: [/<script>[\s\S]*?<\/script>/g],


  formats: {
    bold: { inline: 'strong' },
    italic: { inline: 'em' },
    underline: { inline: 'u' },
    strikethrough: { inline: 's' },
    main: { block: 'main', wrapper: true, merge_siblings: true, deep: true, remove: 'none' },
  },

  mobile: {
    menubar: 'file edit view insert format blocks tools help',
  },

  help_tabs: ['shortcuts-help', 'images-help', 'about-help', 'build-version'],

  add_unload_trigger: true,
  allow_html_in_named_anchor: true,
  automatic_uploads: false,
  autosave_ask_before_unload: true,
  autosave_restore_when_empty: false,
  autosave_retention: '3600m',
  body_id: 'doc',
  branding: false,
  browser_spellcheck: true,
  contextmenu_never_use_native: false,
  convert_urls: false,
  elementpath: true,
  end_container_on_empty_block: true,
  entity_encoding: 'raw',
  file_picker_types: 'image media',
  font_family_formats: '',
  font_size_formats: '',
  format_empty_lines: true,
  height: '100vh',
  image_advtab: false,
  image_caption: true,
  image_title: true,
  image_description: false,
  image_dimensions: false,
  image_uploadtab: false,
  images_reuse_filename: true,
  images_upload_url: '',
  importcss_append: true,
  indent_use_margin: false,
  indentation: '2rem',
  insertdatetime_element: false,
  insertdatetime_formats: ['%A %B %d, %Y - %I:%M %p', '%A %B %d, %Y', '%B %d, %Y', '%D', '%Y-%m-%d', '%Y-%m-%d %I:%M %p'],
  keep_styles: false,
  line_height_formats: '',
  link_context_toolbar: true,
  link_default_target: '_blank',
  link_quicklink: true,
  link_target_list: false,
  link_title: false,
  media_alt_source: false,
  media_dimensions: false,
  media_live_embeds: true,
  noneditable_class: 'tag',
  paste_block_drop: false,
  paste_data_images: true,
  paste_preprocess: pastePreprocess,
  paste_remove_styles_if_webkit: true,
  paste_merge_formats: false,
  promotion: false,
  quickbars_insert_toolbar: false,
  relative_urls: true,
  resize: false,
  resize_img_proportional: true,
  schema: 'html5-strict',
  smart_paste: true,
  style_formats_autohide: false,
  style_formats_merge: false,
  table_advtab: true,
  table_appearance_options: false,
  table_cell_advtab: false,
  table_clone_elements: 'strong em a p',
  table_header_type: 'section',
  table_resize_bars: true,
  table_row_advtab: true,
  table_sizing_mode: 'relative',
  table_style_by_css: true,
  table_tab_navigation: true,
  table_use_colgroups: false,
  target_list: false,
  theme: 'silver',
  toolbar_mode: 'floating',
  typeahead_urls: false,
  verify_html: false,
  visual: false,

  allow_html_data_urls: true,
  allow_svg_data_urls: true,

  file_picker_callback: filePicker,

  // init_instance_callback: (editor) => {
  //   editor.on('ExecCommand', (e) => {
  //     console.log(`The ${e.command} command was fired.`);
  //   });
  // }

 text_patterns: [
    {start: '#', format: 'h1'},
    {start: '##', format: 'h2'},
    {start: '###', format: 'h3'},
    {start: '####', format: 'h4'},
    {start: '#####', format: 'h5'},
    {start: '*', end: '*', format: 'italic'},
    {start: '_', end: '_', format: 'italic'},
    {start: '**', end: '**', format: 'bold'},
    {start: '***', end: '***', format: 'bold+italic'},
    {start: '~~', end: '~~', format: 'strikethrough'},
    {start: '1. ', cmd: 'InsertOrderedList'},
    {start: '* ', cmd: 'InsertUnorderedList'},
    {start: '- ', cmd: 'InsertUnorderedList'},
    {start: '> ', cmd: 'mceBlockQuote'},
    {start: '`', end: '`', format: 'code'},
    {start: '---', replacement: '<hr/>'},
  ]


};
