const version = "1.0";

const cacheName = `my-app-${version}`;

const cacheList = [
    "/",
    "favicon.ico",
    "manifest.json",
    "app.js",
    "styles.js"
];

this.addEventListener("install", event => {

    const install = async () => {
        // TODO: Install Worker (Cache)

        const cache = await caches.open(cacheName);

        await cache.addAll(cacheList);

        await this.skipWaiting();
    };

    event.waitUntil(install().catch(error => {
        console.warn(`[Worker] Install Error`, error);
    }));

});