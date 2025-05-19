const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
    '/pwa3/',
    '/pwa3/index.html',
    '/pwa3/js/app.js',
    '/pwa3/css/style.css',
    '/pwa3/img/hb.svg',
    '/pwa3/img/me.png',
    '/pwa3/img/paone_3d.jpg',
    '/pwa3/img/profilo_n.jpg',
    '/pwa3/js/ui.js',
    '/pwa3/manifest.json',
    '/pwa3/favicon.ico',
    // Aggiungi anche le icone PWA
];

// install event
self.addEventListener('install', evt => {
    console.log('Service worker installing...');
    evt.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                console.log('Caching shell assets...');
                return cache.addAll(assets);
            })
            .catch(err => {
                console.error('Cache add all error:', err);
                // Continua comunque l'installazione
            })
    );
});

// activate event
self.addEventListener('activate', evt => {
    console.log('Service worker activating...');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request)
            .then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    // Cache dinamica per le risorse non in cache statica
                    return caches.open(dynamicCacheName).then(cache => {
                        if (evt.request.url.indexOf('http') === 0) { // Solo URL HTTP
                            cache.put(evt.request.url, fetchRes.clone());
                        }
                        return fetchRes;
                    });
                });
            }).catch(() => {
                // Qui puoi restituire una pagina di fallback se richiedi HTML
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pwa3/offline.html'); // Crea una pagina offline.html
                }
            })
    );
});
