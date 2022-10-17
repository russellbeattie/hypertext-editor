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
