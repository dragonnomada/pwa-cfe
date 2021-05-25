// Estrategia de Caché - Caché Primero

// 1. Definer el nombre del caché (mediante un versionado)
const version = "1.2";

const cacheName = `S2-Ej1-${version}`;

const cacheList = [
    "/",
    // "manifest.json",
    // "foo.html",
    // "img.jpg",
    // "favicon.ico",
    // "styles.css",
];

this.addEventListener("install", async event => {
    
    console.log("[Worker] Instalando...");

    await this.skipWaiting();

    const cache = await caches.open(cacheName);

    console.log("[Worker] Se ha abierto el caché", cacheName);

    /*
    cache.match(request); // response
    cache.matchAll(request); // [response]
    cache.keys(); // [requests]
    cache.add(request); // fetch + cache.put
    cache.addAll([url]); // [cache.add] 
    cache.put(request, response);
    cache.delete(request); // true - match / false - does not match
    */

    await cache.addAll(cacheList);
});

this.addEventListener("activate", async event => {

    console.log("[Worker] Activando service worker...");

    const deleteOtherCache = async () => {
        const cacheNames = await caches.keys();

        console.log("[Worker] Caches registrados", cacheNames);

        for (let otherCacheName of cacheNames) {
            if (cacheName !== otherCacheName) {
                console.log("[Worker] Eliminando el cache:", otherCacheName);
                await caches.delete(otherCacheName);
            }
        }
    };

    await event.waitUntil(deleteOtherCache());

    console.log("[Worker] Worker activado");

});

this.addEventListener("fetch", async event => {
    console.log("[Worker] Procesando petición...", event.request.url);

    const resolveFetch = async () => {
        const cache = await caches.open(cacheName);

        console.log("[Worker] Buscando petición en caché...");

        const cacheResponse = await cache.match(event.request);

        if (cacheResponse) {
            console.log("[Worker] El recurso si está en caché");

            return cacheResponse;
        }

        // El recurso no está en caché

        console.log("[Worker] El recurso no está en caché, intentando descargarlo...", event.request.url);

        try {
            const response = await fetch(event.request);

            console.log("[Worker] El recurso ha sido descargado");

            // TODO: Determinar si la respuesta descargada se retiene en caché

            return response;

            return;
        } catch (error) {
            console.log("[Worker] Error al descargar el recurso", error);
            // TODO: Crear una respuesta dinámica
            throw new Error(error);
        }
    };

    await event.respondWith(resolveFetch());
});