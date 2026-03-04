// service-worker.js - أنشئ هذا الملف في المجلد الرئيسي (GT-ZAKAT/)
const CACHE_NAME = 'gt-zakat-v1';
const urlsToCache = [
  '/GT-ZAKAT/',
  '/GT-ZAKAT/index.html',
  '/GT-ZAKAT/css/style.css',
  '/GT-ZAKAT/js/script.js',
  '/GT-ZAKAT/manifest.json',
  '/GT-ZAKAT/GT-ZAKAT-logo/128x128/gt-zakat-logo.png',
  '/GT-ZAKAT/GT-ZAKAT-logo/192x192/gt-zakat-logo.png',
  '/GT-ZAKAT/GT-ZAKAT-logo/256x256/gt-zakat-logo.png',
  '/GT-ZAKAT/GT-ZAKAT-logo/512x512/gt-zakat-logo.png',
  '/GT-ZAKAT/pages/zakat-money.html',
  '/GT-ZAKAT/pages/zakat-gold.html',
  '/GT-ZAKAT/pages/zakat-grains.html',
  '/GT-ZAKAT/pages/zakat-salary.html',
  '/GT-ZAKAT/pages/zakat-trade.html',
  '/GT-ZAKAT/pages/zakat-fitrah.html'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ فتح الذاكرة المؤقتة وتخزين الملفات');
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل الـ Service Worker وتنظيف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف الكاش القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// استراتيجية الجلب: من الكاش أولاً، ثم من الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الملف في الكاش، أرسله
        if (response) {
          return response;
        }
        // إذا لم يوجد، اذهب إلى الشبكة
        return fetch(event.request).then(
          networkResponse => {
            // تحقق من أن الاستجابة صالحة
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // خزن النسخة الجديدة في الكاش
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          }
        );
      })
  );
});
