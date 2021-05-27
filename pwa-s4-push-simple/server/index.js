require("dotenv").config();

const http = require("http");

const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");

const webPush = require("web-push");

// VAPID PUBLIC / SECRET

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log("Agrega las siguientes claves a tus variables de entorno");

    const { publicKey, privateKey } = webPush.generateVAPIDKeys();

    console.log(`VAPID_PUBLIC_KEY="${publicKey}"`);
    console.log(`VAPID_PRIVATE_KEY="${privateKey}"`);
    return;
}

webPush.setVapidDetails("https://serviceworke.rs/", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    response.send(`Web Push Server - CFE PWA Course`);
});

app.get("/push/vapidPublicKey", (request, response) => {
    response.send({
        publicKey: process.env.VAPID_PUBLIC_KEY
    });
});

app.post("/push/register", (request, response) => {
    // TODO: VALIDAR LOS DATOS DE REGISTRO DEL USUARIO
    response.send({
        success: true
    });
});

app.post("/push/send", async (request, response) => {
    const { subscription } = request.body;
    const payload = null;
    const options = {
        TTL: 0
    };

    console.log({ subscription });

    try {
        const result = await webPush.sendNotification(subscription, payload, options);

        response.send({
            success: true,
            result
        });
    } catch (error) {
        console.log(error);

        response.send({
            success: false,
            error: `Error al enviar la notificación`,
            originalError: `${error}`
        });
    }

});

const server = http.createServer(app);

const port = process.env.PORT || 9000;
const host = process.env.HOST || "localhost";

server.listen(port, host, () => {
    console.log(`Web Push Server started at http://${host}:${port}`);
})