const CACHE_NAME = 'devops-gurukul-v1';
const ASSETS = [
  '/DevOps-Training/',
  '/DevOps-Training/index.html',
  '/DevOps-Training/css/style.css',
  '/DevOps-Training/js/app.js',
  '/DevOps-Training/js/terminal.js',
  '/DevOps-Training/js/filesystem.js',
  '/DevOps-Training/icons/icon-192.png',
  '/DevOps-Training/icons/icon-512.png'
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
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/DevOps-Training/')))
  );
});
