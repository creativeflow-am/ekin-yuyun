const CACHE_NAME = 'jurnal-yuyun-v8';
const urlsToCache = [
  './',
  './logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network First strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      // Network success: update cache and return response
      const responseClone = response.clone();

      // Only cache same-origin GET requests to prevent API/CORS issues
      if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
      }

      return response;
    }).catch(() => {
      // Network failure: fallback to cache
      return caches.match(event.request);
    })
  );
});