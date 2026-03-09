// This service worker immediately clears all old caches and unregisters itself.
// This is a fix for the stale cache issue causing the white screen.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(cacheNames.map(name => caches.delete(name)))
        ).then(() => self.registration.unregister())
    );
});
