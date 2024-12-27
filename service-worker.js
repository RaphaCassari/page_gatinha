const CACHE_NAME = "romantic-page-cache-v1";
const urlsToCache = [
  "/", // Cache the root of the site
  "/index.html", // Ensure the HTML file is cached
  "/manifest.json", // Cache the manifest file
  //"/styles.css", // (Add other CSS files if separate)
  //"/script.js", // (Add other JS files if separate)
  "/music.mp3", // Cache the music file
  "/fto1.jpg",
  "/fto2.jpg",
  "/fto3.jpg",
  "/fto4.jpg"
];

// Install event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          fetchedResponse => {
            if (!fetchedResponse || fetchedResponse.status !== 200 || fetchedResponse.type !== "basic") {
              return fetchedResponse;
            }

            const responseToCache = fetchedResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchedResponse;
          }
        );
      })
  );
});

// Activate event
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
