
var buildDateTime = '${buildDateTime}';

if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('/editor/service-worker.js');

    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        console.log('reloading');
        if (refreshing) {
            return;
        }
        refreshing = true;
        window.location.reload();
    });

    navigator.serviceWorker.ready.then(function(){
        console.log('ready');
    });

    async function detectSWUpdate() {

      const registration = await navigator.serviceWorker.ready;

      registration.addEventListener('updatefound', event => {
            tinymce.activeEditor.notificationManager.open({
              text: 'New version found. Updating...',
              type: 'info'
            });
            tinymce.activeEditor.getBody().hidden = true;
      });
    }

    detectSWUpdate();

}

function postMessage(message){
  if(navigator.serviceWorker.controller){
    navigator.serviceWorker.controller.postMessage(message);
  } else {
    console.log('no controller');
  }
}