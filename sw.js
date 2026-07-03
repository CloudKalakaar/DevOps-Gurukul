const CACHE_NAME = 'devops-gurukul-v2';
const ASSETS = [
  '/DevOps-Gurukul/',
  '/DevOps-Gurukul/index.html',
  '/DevOps-Gurukul/css/style.css',
  '/DevOps-Gurukul/js/app.js',
  '/DevOps-Gurukul/js/terminal.js',
  '/DevOps-Gurukul/js/filesystem.js',
  '/DevOps-Gurukul/icons/icon-192.png',
  '/DevOps-Gurukul/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Dynamically cache the latest files
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        return response;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('/DevOps-Gurukul/')))
  );
});
