console.log("Hola soy el service worker");

// window (no existe)
// document (no existe)
// limitado a `self` (el trabajo)

// 1. EVENTO DE INSTALACIÓN
// TODO: Registrar el caché que será usado en la app sin conexión
this.addEventListener("install", (event) => {
  console.log("[Worker] Se procede a instalar...");

  // Evita espera
  this.skipWaiting();

  // TODO: Registrar el caché usado
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
    fetch(event.request).then((response) => {
      if (!response.ok) {
        // El recurso no está disponible (falló la conexión);
        // TODO: Definir una estrategia para responder con un recurso alternativo
        // 1. Fallar
        // 2. Devolver un recurso en caché
        // 3. Devolver un recurso dinámico (datos generados aquí)
        // 4. GUARDAS LAS TAREAS PENDIENTES HASTA QUE HAYA INTERNET
        throw new Error(`Imposible acceder al recurso`);
      }

      return response;
    })
  );
});
