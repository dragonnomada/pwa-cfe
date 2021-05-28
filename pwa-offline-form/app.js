const title = document.querySelector("h1");
const button = document.querySelector("button");
const code = document.querySelector("code");

button.addEventListener("click", async () => {
  const formData = new FormData();

  formData.append("foo", "bar");

  console.warn("POST");
  const response = await fetch("api/form", {
    method: "post",
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded"
    // },
    body: formData
  });

  // if (!response.ok) {
  //   const error = await response.text();
  //   console.log(error);
  //   return;
  // }

  const result = await response.json();

  code.innerHTML = JSON.stringify(result, null, 2);
});

window.addEventListener("online", (event) => {
  title.innerHTML = "EN LÍNEA";
});

window.addEventListener("offline", (event) => {
  title.innerHTML = "SIN CONEXIÓN";
});

async function app() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("worker.js");

    navigator.serviceWorker.addEventListener("controllerchange", (event) => {
      console.log("[controllerchange] Ha cambiado el controllador", event);
    });

    navigator.serviceWorker.controller.addEventListener(
      "statechange",
      function () {
        console.log(
          "[controllerchange][statechange] Ha cambiado el estado",
          this.state
        );

        title.innerHTML =
          this.state === "activated" ? "Activado" : "No activado";
      }
    );
  }
}

app().catch(console.error);
