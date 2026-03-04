const CACHE_NAME = 'gt-zakat-v1';
const urlsToCache = [
  '/GT-ZAKAT/',
  '/GT-ZAKAT/index.html',
  '/GT-ZAKAT/css/style.css',
  '/GT-ZAKAT/js/script.js',
  '/GT-ZAKAT/manifest.json',
  '/GT-ZAKAT/GT-ZAKAT-logo/128x128/gt-zakat-logo.png',
  '/GT-ZAKAT/GT-ZAKAT-logo/256x256/gt-zakat-logo.png',
  '/GT-ZAKAT/GT-ZAKAT-logo/512x512/gt-zakat-logo.png',
  '/GT-ZAKAT/pages/zakat-money.html',
  '/GT-ZAKAT/pages/zakat-gold.html',
  '/GT-ZAKAT/pages/zakat-grains.html',
  '/GT-ZAKAT/pages/zakat-salary.html',
  '/GT-ZAKAT/pages/zakat-trade.html',
  '/GT-ZAKAT/pages/zakat-fitrah.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Caching files');
        return cache.addAll(urlsToCache).catch(error => {
          console.log('❌ Failed to cache:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
