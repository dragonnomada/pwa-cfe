const version = "1.7";
const cacheName = `offline-demo-${version}`;
const cacheList = ["/", "app.js"];

this.addEventListener("install", (event) => {
  const install = async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(cacheList);
    await this.skipWaiting();
    console.log(cacheName);
  };

  event.waitUntil(
    install().catch((error) => {
      console.warn(`[Worker] Error en la instalación`, error);
    })
  );
});

this.addEventListener("activate", (event) => {
  const activate = async () => {
    const cacheNames = await caches.keys();
    for (let name of cacheNames) {
      if (name !== cacheName) {
        await caches.delete(name);
      }
    }
    await this.clients.claim();
  };

  event.waitUntil(
    activate().catch((error) => {
      console.warn(`[Worker] Error en la activación`, error);
    })
  );
});

async function successResponse(response) {
  console.log("success response");
  const data = await response.json();
  const result = {
    success: true,
    data
  };
  const parts = [JSON.stringify(result)];
  const blob = new Blob(parts, { type: "application/json" });
  return new Response(blob, { status: 200, statusText: "ok" });
}

async function failResponse(error) {
  console.log("error response");
  const result = {
    success: false,
    error: `${error}`
  };
  const parts = [JSON.stringify(result)];
  const blob = new Blob(parts, { type: "application/json" });
  const response = new Response(blob, { status: 500, statusText: "fail" });
  return response;
}

this.addEventListener("fetch", (event) => {
  const resolve = async () => {
    const cache = await caches.open(cacheName);
    const cacheResponse = await cache.match(event.request);
    if (cacheResponse) return cacheResponse;

    if (event.request.url.indexOf("api/form") > 0) {
      console.log("form", event.request);
      // event.request.arrayBuffer();
      // event.request.blob();
      // event.request.json();
      // event.request.text();
      // event.request.formData();
      const formData = await event.request.formData();
      console.log("form body", Object.fromEntries(formData));
    }

    try {
      const serverResponse = await fetch(event.request);
      return await successResponse(serverResponse);
    } catch (error) {
      return await failResponse(error);
    }
  };

  event.respondWith(
    resolve().catch((error) => {
      console.warn(`[Worker] Error en la petición`, error);
    })
  );
});
