// VestHub Service Worker - Cache Purge & Network Forwarder
// Automatically invalidates old caches (like study-app-cache-v1) and yields control to VitePWA

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('[SW Purge] Removendo cache legado:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      // Auto-unregister this worker so vite-plugin-pwa manages PWA assets cleanly
      return self.registration.unregister();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Always fetch fresh from network for all requests to prevent stale index.html
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
