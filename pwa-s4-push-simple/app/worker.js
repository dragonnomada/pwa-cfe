console.log("[Worker] Leído");

this.addEventListener("push", async event => {

    console.log("[Worker] Mostrando notificación");

    const sendNotification = async () => {
        await this.registration.showNotification("Título CFE PWA", {
            body: "Hola mundo CFE" // Obtener el mensaje de alguna forma (postMessage / sincrozación)
        });
    };

    await event.waitUntil(
        sendNotification()
    );

    console.log("[Worker] Notificación desplegada");

});