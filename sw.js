var CACHE = 'v2:static';

// On install, cache some resources.
self.addEventListener('install', function(evt) {
    console.log('The service worker is being installed.');

    // Wait until promise resolves
    evt.waitUntil(precache());
});

// On fetch, return from cache
self.addEventListener('fetch', function(evt) {
    console.log('The service worker is serving the asset.');
    evt.respondWith(fromCache(evt.request));
});

// Opens cache and loads breakout.js and index.html into cache
// And then uses them to in requests in future
function precache() {
    return caches.open(CACHE).then(function(cache) {
        return cache.addAll([
            './breakout.js',
            './'
        ]);
    });
}

// When a resource is requested respond only from service worker.
// This strategy is cache only.
// It can be changed to Cache First by replace Promise.reject('no-match') with a network request
// that'll fetch the requested resource and maybe put it in cache
function fromCache(request) {
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            return matching || Promise.reject('no-match');
        });
    });
}