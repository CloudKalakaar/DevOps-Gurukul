const CACHE_NAME = 'sre-survival-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/game.css',
  './js/sound-fx.js',
  './js/filesystem.js',
  './js/packages.js',
  './js/terminal.js',
  './js/labs.js',
  './js/quest-data.js',
  './js/game-engine.js',
  './js/incident-engine.js',
  './js/game-canvas.js',
  './js/game-ui.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
