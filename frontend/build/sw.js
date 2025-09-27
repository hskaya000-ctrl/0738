// Service Worker for Freelancer Finans Takip
const CACHE_NAME = 'finans-takip-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // API endpoints için cache stratejisi ayrı olacak
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache açıldı');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: Cache açılırken hata:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache'de varsa cache'den döndür
        if (response) {
          return response;
        }

        // API istekleri için özel handling
        if (event.request.url.includes('/api/')) {
          return fetch(event.request)
            .then((response) => {
              // API başarılıysa normal response döndür
              if (response.ok) {
                return response;
              }
              
              // API başarısızsa offline mesajı döndür
              return new Response(
                JSON.stringify({ 
                  error: 'Çevrimdışı moddasınız. Veriler localStorage\'dan yükleniyor.',
                  offline: true 
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            })
            .catch(() => {
              // Network tamamen başarısızsa offline response
              return new Response(
                JSON.stringify({ 
                  error: 'Çevrimdışı moddasınız. Veriler localStorage\'dan yükleniyor.',
                  offline: true 
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        }

        // Diğer istekler için normal fetch
        return fetch(event.request)
          .catch(() => {
            return caches.match('/');
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for when connection returns
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Sync function to send offline data when online
function syncData() {
  return new Promise((resolve) => {
    // Bu fonksiyon localStorage'daki pending data'yı server'a gönderir
    console.log('Service Worker: Veriler senkronize ediliyor...');
    // Gerçek implementation main app'de olacak
    resolve();
  });
}