const version = "1.1";
const cacheName = `gallery-${version}`;
const cacheList = ["/", "app.js", "style.css", "logo.png"];

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

this.addEventListener("fetch", async (event) => {
  console.log("[Worker] Solicitando petición...", event.request.url);

  const resolveFetchResponse = async () => {
    console.log("[Worker] Procesando la respuesta a la petición...");

    // TODO: Procesar la petición
    // Responder con la petición real
    // const response = await fetch(event.request);
    // Crear una respuesta de un recurso en caché
    // const responseCache = cache.match(event.request);
    // Crear una respuesta `falsa` (simulada)
    // const response = new Response(blob, { status: 200 });

    console.log("[Worker] Iniciar la descarga de:", event.request.url);

    console.log("[Worker] Abriendo el caché:", cacheName);
    let cache = await caches.open(cacheName);

    console.log("[Worker] Caché abierto", cache);

    console.log("[Worker] Buscando el recurso en el caché", event.request.url);
    const cacheResponse = await cache.match(event.request);

    if (cacheResponse) {
      console.log("[Worker] El recurso está en caché");
      return cacheResponse; // Devolvemos la respuesta de caché
    }

    console.log("[Worker] El recurso no está en el caché");

    try {
      console.log("[Worker] Intentando descargar el recurso...");
      const response = await fetch(event.request);

      console.log("[Worker] Recurso descargado");
      // TODO: Determinar si el recurso descargado se va a caché

      return response; // Devolvemos el recurso descargado
    } catch (error) {
      console.log("[Worker] Error al descargar el recurso", error);
      if (event.request.url === "https://xpicsum.photos/v2/list?limit=3") {
        console.log("[Worker] Creando un recurso simulado con el logo...");
        //Se crea un arreglo que trae un JSON simulando lo que devolvería el servidor
        const result = [{ download_url: "logo.png" }]; //respuesta falsa mua ja ja
        // Partes que tendrá el recurso (JSON que será convertido en Blob)
        const parts = [JSON.stringify(result)];
        // Blob que serializa las partes de la respuesta (tipo JSON)
        const blob = new Blob(parts, { type: "application/json" });
        // Opciones de la respuesta (status 200 ok / status 404 not found / ...)
        const options = { status: 200, statusText: "success" };
        // Creamos la respuesta falsa a partir del blob
        const response = new Response(blob, options);
        console.log("[Worker] Respuesta simulada creada");

        // Si queremos guardar un response en caché usamos `put`
        // cache.put(event.request, response);
        // Si queremos quitar un caché usamos `delete`
        // cache.delete(event.request);
        // Si queremos recuperar un response guardado en el caché usamos `match`
        // const responseCache = await cache.match(event.request)

        // https://dragonnomada.medium.com

        return response; // Devolvemos la respuesta simulada
      }
    }
  };

  console.log("[Worker] Esperando procesar la respuesta");
  await event.respondWith(
    resolveFetchResponse().catch((error) => {
      console.warn("[Worker] Error al crear la respuesta", error);
    })
  );
});
