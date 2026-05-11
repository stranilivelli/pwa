const staticCacheName = 'site-static-v1';

const assets = [
    './',
    'index.html',
    'style.css',
    'img/profilo_n.jpg',
    'img/hamburger-2-svgrepo-com.svg',
    'img/css3-02-svgrepo-com.svg',
    'img/html5-01-svgrepo-com.svg',
    'img/python-svgrepo-com.svg',
    'img/js01-svgrepo-com.svg',
    'manifest.json',
];

// install event
self.addEventListener('install', evt => {
    console.log('[SW] Installing...');
    self.skipWaiting();
    evt.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                console.log('[SW] Caching static assets...');
                return cache.addAll(assets);
            })
    );
});

// activate event
self.addEventListener('activate', evt => {
    console.log('[SW] Activating...');
    evt.waitUntil(
        clients.claim().then(() => {
            return caches.keys().then(keys => {
                return Promise.all(
                    keys
                        .filter(key => key !== staticCacheName)
                        .map(key => {
                            console.log('[SW] Deleting old cache:', key);
                            return caches.delete(key);
                        })
                );
            });
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    // Ignora richieste non-GET
    if (evt.request.method !== 'GET') return;

    evt.respondWith(
        caches.match(evt.request)
            .then(cacheRes => {
                if (cacheRes) {
                    console.log('[SW] Serving from cache:', evt.request.url);
                    return cacheRes;
                }
                console.log('[SW] Fetching from network:', evt.request.url);
                return fetch(evt.request);
            })
            .catch(() => {
                console.warn('[SW] Fetch failed, serving offline fallback');
                if (evt.request.headers.get('accept').includes('text/html')) {
                    return caches.match('offline.html');
                }
            })
    );
});
