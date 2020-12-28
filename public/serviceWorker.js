// Service Worker js-file
// the cache version gets updated every time there is a new deployment
const CACHE_VERSION = 2;
const CURRENT_CACHE = `main-${CACHE_VERSION}`;

// files precached by default(App Shell)
const staticAssets = [
  '/',
  '/index.html',
  '/pages/fallback.html',
  '/src/js/index.js',
  '/src/styles/main.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap',
];

// Precaching static Assets
const precache = () =>
  caches.open(CURRENT_CACHE).then((cache) => {
    cache.addAll(staticAssets);
  });

// Install App Shell and fallback HTML
self.addEventListener('install', (e) => e.waitUntil(precache()));

// On Activate => Cleaning from old cache versions
self.addEventListener('activate', (evt) =>
  evt.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CURRENT_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  )
);

// First we load from network, then look into cash, and if no results => return the fallback
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    fromNetwork(evt.request, 10000).catch((e) => fromCache(evt.request))
  );
  evt.waitUntil(update(evt.request));
});

// fetch the resource from the network
const fromNetwork = (request, timeout) =>
  new Promise((fulfill, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      fulfill(response);
      update(request);
      // when fetching from network, trimming old cache, except static assets
      trimCache(20);
    }, reject);
  });

// fetch the resource from the browser cache
const fromCache = (request) =>
  caches.open(CURRENT_CACHE).then((cache) =>
    cache.match(request).then((matching) => {
      return matching || cache.match('/pages/fallback.html');
    })
  );

// cache the current page to make it available for offline
const update = (request) =>
  caches.open(CURRENT_CACHE).then((cache) =>
    fetch(request).then((response) => {
      const responseClone = response.clone();
      response.blob().then((b) => {
        // validates blob, with size , and filters out fileTypes
        if (isValidToCache(b, 30, 'mp4')) {
          return cache.put(request, responseClone);
        } else console.log('Filtered Out', responseClone.url);
      });
      return;
    })
  );

// size in Kb
const isValidToCache = (blob, size = 30, ...fileType) => {
  if (blob.size <= size * 1000 && !fileType.includes(blob.type.split('/')[1])) {
    return true;
  }
  console.log(`Filtering: size <= ${size} and not "${fileType.join(' || ')}"`);
  return false;
};

const trimCache = (size) => {
  caches.open(CURRENT_CACHE).then((cache) =>
    cache.keys().then((keys) => {
      const keysToDelete = keys
        .filter((key, index) => {
          const url = new URL(key.url);
          const staticLength = staticAssets.length;
          if (
            staticAssets.includes(url.pathname + url.search) ||
            index < size + staticLength
          )
            return false;
          return true;
        })
        .map((key) => {
          return caches.open(CURRENT_CACHE).then((cache) => cache.delete(key));
        });
    })
  );
};

self.addEventListener('sync', (e) => {
  console.log('Background Sync: ');
  console.log('Event tag is: ', e.tag);
});
