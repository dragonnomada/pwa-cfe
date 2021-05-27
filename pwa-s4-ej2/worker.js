const version = "v1.0.0"; // WORLD.HOUSE.ROOM

console.log(`[Worker] ${version}`);

// Escuchar los mensajes del cliente (bajo el protocolo { type, payload })
this.addEventListener("message", async event => {
    // PROTOCOLO DE DATOS PARA LOS MENSAJES
    // { type: "<tipo de mensaje>", payload: <data> }

    console.log(`[Worker] Mensaje recibido`, event.data);

    if (event.data.type === "text-analysis") {
        // TODO: Analizar el texto (event.data.payload)
        console.log(`[Worker] Iniciando la tarea (${event.data.taskId})...`);
        const text = event.data.payload;
        const words = text.split(/[\s\r\n\t]+/).length;
        console.log(`[Worker] Hay ${words} palabras`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(`[Worker] Finalizó la tarea (${event.data.taskId})...`);
        // Llamamos de vuelta al cliente (app) que nos envió el mensaje
        event.source.postMessage({
            protocol: event.data.protocol,
            taskId: event.data.taskId,
            result: {
                words
            }
        });
    }
});