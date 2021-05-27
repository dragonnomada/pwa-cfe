const button = document.querySelector("button");

let subscription = null;

async function sendNotification() {
    const response = await fetch("http://localhost:9000/push/send", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subscription
        })
    });

    const { success } = await response.json();

    console.log("SEND", success);
}

button.addEventListener("click", async () => {
    button.disabled = true;

    await sendNotification();

    button.disabled = false;
});

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// function urlBase64ToUint8Array(base64String) {
//     const padding = "=".repeat((4 - base64String.length % 4) % 4); // Mútiplo de 4 bytes
//     const base64 = (base64String + padding)
//         .replace(/\-/g, "+")
//         .replace(/_/g, "/");

//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);

//     for (let i = 0; i < rawData.length; ++i) {
//         outputArray[i] = rawData.charCodeAt(i);
//     }

//     return outputArray;
// }

async function getVapidPublicKey() {
    const response = await fetch("http://localhost:9000/push/vapidPublicKey");

    const { publicKey } = await response.json();

    return publicKey;
}

async function registerNotification(subscription) {
    const response = await fetch("http://localhost:9000/push/register", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subscription
        })
    });

    const { success } = await response.json();

    console.log("REGISTER", success);
}

async function app() {
    const registration = await navigator.serviceWorker.register("worker.js");

    subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
        const publicKey = await getVapidPublicKey();

        const vapidPublicKey = urlBase64ToUint8Array(publicKey);

        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidPublicKey
        });
    }

    // Suscripción lista
    await registerNotification(subscription);
}

app().catch(error => {
    console.error(error);
    console.warn(`Error en la aplicación ${error}`);
});