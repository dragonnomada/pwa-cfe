const version = "1.4";
const cacheName = `cfe-form-${version}`;
const cacheList = ["/", "app.js"];

this.addEventListener("install", async (event) => {
    console.log("[Worker] Inicia la instalación...");

    const install = async () => {
        console.log("[Worker] Abriendo el caché para la versión:", cacheName);
        const cache = await caches.open(cacheName);

        console.log("[Worker] Agregando los recursos al caché:", cacheList);
        await cache.addAll(cacheList);

        console.log("[Worker] Saltando espera...");
        await this.skipWaiting();

        console.log("[Worker] Instalación completa");
    };

    console.log("[Worker] Esperando instalación...");
    await event.waitUntil(
        install().catch((error) => {
            console.warn("[Worker] Error en la instalación", error);
        })
    );
});

this.addEventListener("activate", async (event) => {
    console.log("[Worker] Activando worker (cambiando versión)...");

    const activate = async () => {
        console.log("[Worker] Obteniendo versiones instaladas...");
        const cacheNames = await caches.keys();

        console.log("[Worker] Se eliminarán las versiones previas...");
        for (let name of cacheNames) {
            if (cacheName !== name) {
                console.log("[Worker] Eliminando la versión", name);
                await caches.delete(name);
            }
        }

        console.log("[Worker] Versiones previas eliminadas");
    };

    console.log("[Worker] Esperando activación...");
    await event.waitUntil(
        activate().catch((error) => {
            console.warn("[Worker] Error en la activación", error);
        })
    );
});

this.addEventListener("fetch", event => {

    const resolve = async () => {
        console.log("[Worker] Procesando la petición", event.request.url);

        if (event.request.url === "http://localhost:8080/form/demo") {
            const formData = await event.request.formData();

            console.log("[Worker] Formulario recibido", JSON.stringify(Object.fromEntries(formData)));

            try {
                const serverResponse = await fetch("http://localhost:8080/form/demo", {
                    method: "post",
                    body: formData
                });
                return serverResponse;
            } catch (error) {
                console.log("[Worker] Falló la petición del formulario");

                const data = {
                    success: false,
                    error: "No se pudo enviar el formulario",
                    formData: Object.fromEntries(formData),
                    formId: Math.random().toString(32).slice(2) // 0.1231245r435345 -> 0.af8653324d -> af8653324d
                };

                console.log("[Worker] respuesta generada:", data);

                const parts = [JSON.stringify(data)];

                const blob = new Blob(parts, { type: "application/json" });

                const response = new Response(blob, { status: 200, statusText: "ok" });

                return response;
            }

        }

        // TODO: Resolver la petición
        try {
            const response = await fetch(event.request);
            return response;
        } catch (error) {
            // Error al enviar la petición (sin conexión al servidor)
            throw error;
        }
    };

    event.respondWith(resolve().catch(error => {
        console.warn(`[Worker] Falló resolver la petición`, event.request, error);
    }))

});