//Cache polyfil to support cacheAPI in all browsers
importScripts('./js/cache-polyfill.js');
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js'
);

if (workbox) {
  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    workbox.strategies.staleWhileRevalidate()
  );
  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
        })
      ]
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const version = '5.00pwa';
var cacheName = `ssp_${version}`;
var urlsToCache = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/index.html',
  '/img/back-button.png',
  '/img/bg-mobile.png',
  '/img/icon/ssp_192x192.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache
        .addAll(urlsToCache)
        .then(function() {
          console.log(
            '[SW INSTALLED CACHE NAME : ' +
              cacheName +
              ' STATIC ASSETS ADDED TO CACHE ]'
          );
          return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
        })
        .catch(error => {
          console.error('Failed to cache', error);
        });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(thisCacheName) {
            if (thisCacheName !== cacheName) {
              console.log(
                '[SW DELETE OLD CACHE : ' +
                  thisCacheName +
                  ' AND ACTIVATE NEW CACHE : ] ' +
                  cacheName
              );
              return caches.delete(thisCacheName);
            }
          })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (
    event.request.cache === 'only-if-cached' &&
    event.request.mode !== 'same-origin'
  ) {
    return;
  }

  event.respondWith(
    caches
      .open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
