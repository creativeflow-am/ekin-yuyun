const CACHE_NAME = 'jurnal-yuyun-v11';
const STATIC_ASSETS = [
  '/',
  '/logo.svg',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  // Langsung ambil alih kontrol tanpa menunggu
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        // Hapus semua cache lama setiap kali versi SW diperbarui
        cacheNames.map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// NETWORK ONLY dengan Fallback Cache
// Ini memastikan ketika user melakukan refresh biasa (ada internet), 
// browser akan selalu mengambil versi terbaru dari server.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => {
      // Hanya gunakan cache jika user sedang OFFLINE
      return caches.match(event.request);
    })
  );
});