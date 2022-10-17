var cacheName = '${cacheName}';

var contentToCache = ${files};


self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
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
