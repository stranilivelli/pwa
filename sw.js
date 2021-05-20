const staticCacheName = 'site-static-v6';
const assets = [
    '/portfolio5',
    'index.html',
    'about.html',
    'css/style.css',
    'css/img/galaxy.jpg',
    'img/andrea_n.jpg',
    'img/adobe-photoshop-cs6-logo-svgrepo-com.svg',
    'img/arte-e-tecnologia-paone.jpg',
    'img/black_spiderman_n.jpg',
    'img/devilman_n.jpg',
    'img/hb.svg',
    'img/profilo_n.jpg',
    'js/ui.js',
    'js/app.js',
    'pdf/extra-large.pdf',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-brands-400.woff2',
    'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Montserrat:wght@400;700;900&display=swap',
];
// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
      caches.match(evt.request).then(cacheRes =>{
          return cacheRes || fetch(evt.request);
      })
  )
});
