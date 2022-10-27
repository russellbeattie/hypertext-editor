
const fs = require('fs');
const del = require('del');
const glob = require('glob');
const gulp = require('gulp');
const copy = require('gulp-copy');
const connect = require('gulp-connect');

const SRC_DIR = 'src';
const DEST_DIR = 'build/editor';

function clean() {
  return del(['build/**', 'tmp/**']);
}

function copyStatic() {
  const filesToCopy = [
    `${SRC_DIR}/*.html`,
    `${SRC_DIR}/load-sw.js`,
    `${SRC_DIR}/assets/**/*`,
    `${SRC_DIR}/help/**/*`,
    `${SRC_DIR}/css/**/*`,
    `${SRC_DIR}/scripts/**/*`,
    `${SRC_DIR}/libs/**/*`,
    `${SRC_DIR}/manifest.json`
  ];
  return gulp.src(filesToCopy)
      .pipe(copy(DEST_DIR, {prefix: 1}));
}

function copyLibs() {
  let base = './node_modules';
  const filesToCopy = [
    `${base}/tinymce/plugins/anchor/plugin.js`,
    `${base}/tinymce/plugins/autolink/plugin.js`,
    `${base}/tinymce/plugins/autosave/plugin.js`,
    `${base}/tinymce/plugins/codesample/plugin.js`,
    `${base}/tinymce/plugins/help/plugin.js`,
    `${base}/tinymce/plugins/insertdatetime/plugin.js`,
    `${base}/tinymce/plugins/link/plugin.js`,
    `${base}/tinymce/plugins/lists/plugin.js`,
    `${base}/tinymce/plugins/searchreplace/plugin.js`,
    `${base}/tinymce/plugins/table/plugin.js`,
    `${base}/tinymce/plugins/visualblocks/plugin.js`,
    `${base}/tinymce/plugins/visualchars/plugin.js`,
    `${base}/tinymce/plugins/wordcount/plugin.js`,
    `${base}/tinymce/models/dom/model.js`,
    `${base}/tinymce/icons/default/icons.js`,
    `${base}/tinymce/tinymce.js`
  ];
  return gulp.src(filesToCopy)
      .pipe(copy(`${DEST_DIR}/libs`, {prefix: 1}));
}


function createManifest(cb) {
  let files = glob.sync(`./**`, {cwd: DEST_DIR, nodir: true, nomount: true});
  files.unshift('./service-worker.js');
  files.unshift('./');
  files.sort();

  let fileString = JSON.stringify(files, null, ' ');

  let buildDateTime = (new Date()).toISOString();

  let sw = fs.readFileSync(`${SRC_DIR}/service-worker.js`).toString();
  sw = sw.replace('${cacheName}', buildDateTime);
  sw = sw.replace('${files}', fileString);

  fs.writeFileSync(`${DEST_DIR}/service-worker.js`, sw);

  let loadSw = fs.readFileSync(`${SRC_DIR}/load-sw.js`).toString();
  loadSw = loadSw.replace('${buildDateTime}', buildDateTime);

  fs.writeFileSync(`${DEST_DIR}/load-sw.js`, loadSw);


  cb();
}

function serveDev() {
  gulp.watch(`${SRC_DIR}/**`, { events: 'all' }, function(cb) {
    exports.build();
    cb();
  });
  exports.build();
  return connect.server({root: 'build', host: '0.0.0.0'});
}


exports.clean = clean;
exports.serve = serveDev;

exports.build = gulp.series(
  clean,
  copyLibs,
  copyStatic,
  createManifest
);

exports.buildProd = gulp.series(
  clean,
  copyLibs,
  copyStatic,
  createManifest
);

