
importScripts('./libs/idb-keyval.js');

var cacheName = '${cacheName}';

var contentToCache = ${files};

self.addEventListener('install', (e) => {
  console.log('Service Worker Install', cacheName);
  self.skipWaiting();
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener('fetch', async (e) => {

  if (e.request.method !== 'GET') {
    return;
  }
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  let url = e.request.url;

  let path = url.replace(self.location.origin + '/editor/', '');

  e.respondWith((async () => {

    if(e.request.referrer.endsWith('editor.html')){

      let dirHandle = await get('dirHandle');  

       if(dirHandle){
        
        let path = url.replace(self.location.origin + '/editor/', '');

        if(path.startsWith('./')){
          path = path.substring(2, path.length);
        }

        let paths = path.split('/');
        let len = paths.length;

        let curDir = dirHandle;

        try {

          for(let i = 0; i < len - 1; i++){
              let dirName = decodeURI(paths[i]);
              curDir = await curDir.getDirectoryHandle(dirName);
          }

          let fileHandle = await curDir.getFileHandle(paths[len -1]);
          let file = await fileHandle.getFile();
          return new Response(file.stream(), {
            headers: {
            'content-type': file.type,
            }
          });
          return;

        } catch(err){

        }

      }

    }

    const r = await caches.match(e.request);
    if (r) {
        return r; 
    }
    // console.log('fetching', url);
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    cache.put(e.request, response.clone());
    return response;

  })());

});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { 
        return; 
      }
      return caches.delete(key);
    }));
  }));
});

self.addEventListener('activate', event => {
    console.log('activated');
    clients.claim();

    caches.keys().then(function(cacheNames){
      for (const key of cacheNames) {
        if (cacheName === key ) {
          continue;
        }
        console.log('deleting cache: ', key);
        caches.delete(key);
      }

    });


});

self.addEventListener('message', async (e) => {

});