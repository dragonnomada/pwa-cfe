const version = "v1.0.5";

const cacheName = `Ej2-${version}`;

const cacheList = [
  "/", 
  "favicon.ico", 
  "manifest.json", 
  "assets/images/logo.png"
];

// 1. EVENTO DE INSTALACIÓN
// TODO: Registrar el caché que será usado en la app sin conexión
this.addEventListener("install", (event) => {
  console.log("[Worker] Se procede a instalar...");

  // Evita espera
  this.skipWaiting();

  // TODO: Registrar el caché usado
  // 1. Abrir el caché con su nombre
  caches.open(cacheName).then((cache) => {
    // 2. Recuperar el caché
    // 3. Agregar los recursos al caché
    cache.addAll(cacheList).then(() => {
      console.log("[Worker] Se agregaron los siguientes recursos al caché");
      cache.keys().then((keys) => {
        console.log(keys);
      });
    }).catch(error => {
      console.log(`Error al registrar los cachés ${error}`);
      console.error(error);
    });
  });
});

// 2. EVENTO DE ACTIVACIÓN
// TODO: Optimizar el caché que está siendo usado en la app
this.addEventListener("activate", (event) => {
  console.log("[Worker] Se ha activado el worker");

  // TODO: Limpiar el caché no usuado
});

// 3. EVENTO DE PETICIÓN
// TODO: Determinar que respuesta se enviará a una petición de recursos
// 1. Fallar
// 2. Cache
// 3. Generado
this.addEventListener("fetch", (event) => {
  console.log("[Worker] Se ha solicitado un recurso externo", event.request);

  // TODO: Intercepta las peticiones web para crear una experiencia offline

  // TODO: GUARDA LA PETECIÓN TEMPORALMENTE (formulario) ANTES DE ENVIARLO

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (!response) {
        console.log(event.request.url, "No está en el caché");
        
        throw new Error(`El recurso no está en caché`);
      }

      console.log(event.request.url, "Extraído desde el caché");

      return response;
    })
  );
});
