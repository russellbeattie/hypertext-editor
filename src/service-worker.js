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

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') {
    return;
  }
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    if (r) { 
        return r; 
    }
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
  console.log(e);
});
