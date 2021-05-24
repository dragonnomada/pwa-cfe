// INSTALACIÓN
this.addEventListener("install", () => {
    console.log("[Worker] Instalndome...");

    caches.open("ej3-v1").then((cache) => {
        console.log("[Worker] He abierto el caché ej3-v1");
        console.log("[Worker] Extrae los recursos y guardalos en caché...");
        cache.addAll([
            "/",
            "manifest.json",
            "fondo.jpg",
            // TODO: AGREGAR RECURSOS OFFLINE (estilos, imagenes, logos, scripts, json)
        ]).then(() => {
            console.log("[Worker] He guardado los recursos en cache");
            cache.keys().then((keys) => {
                console.log("CACHE ej3-v1", keys.map(key => key.url));
            });
        });
    });
});

console.log("[Worker] Hola soy el worker");

// PETICIÓN
this.addEventListener("fetch", (event) => {
    console.log("[Worker] El usuario necesita este recurso", event.request.url);

    const request = event.request.clone();

    event.respondWith(
        caches.match(event.request).then((response) => {

            if (!response) {
                // NO ESTÁ EN CACHE
                console.log("No está en el caché", event.request.url);
                // throw new Error(`El recurso ${event.request.url} no está en el caché`);
    
                // FETCH lanza la petición online
                return fetch(request).then((response) => {
                    console.log(response);
                    if (!response.ok && response.status !== 0) {
                        console.log("[Worker] Falló la petición, no se pudo obtener el recurso", event.request.url);
                        // ???
                        return caches.match("fondo.jpg").then(response => {
                            console.log("[Worker] Se devolverá el recurso de caché");
                            return response;
                        });
                    }
    
                    console.log("[Worker] La petición salió bien, se devuelve el recurso de internet");
    
                    return response;
                });
            }
    
            // SI ESTÁ EN CACHÉ
            console.log("Si está en caché");
            return response;
        })
    );
});

