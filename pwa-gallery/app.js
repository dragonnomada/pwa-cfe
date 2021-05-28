// Recupera el contenedor de la imagen principal
const galleryPrimary = document.querySelector(".gallery-primary");
// Recupera el contenedor de las imágenes pequeñas
const galleryTiles = document.querySelector(".gallery-tiles");

// Crea una función que recibe un arreglo de URLs de imágenes
// y actualiza la galería
function setGalleryImages(pictures) {
  // Transforma cada URL de imagen en una etiqueta HTML
  const images = pictures.map(
    (url) => `<div class="image-tile"><img src="${url}"></div>`
  );

  // Reemplaza el contenido HTML de las imágenes pequeñas por la unión
  // de los las etiquetas HTML de cada imagen
  galleryTiles.innerHTML = images.join("\n");

  // Selecciona todas las imágenes pequeñas y agrega funcionalidad
  document.querySelectorAll(".image-tile>img").forEach((img, index) => {
    // Registra el evento clic sobre la imagen pequeña
    img.addEventListener("click", () => {
      // Reemplaza la imagen principal por una copia de la imagen
      galleryPrimary.innerHTML = img.outerHTML;
    });

    // Selecciona la primer imagen
    if (index === 0) {
      img.click(); // Simulamos dar clic sobre la primer imagen
    }
  });
}

// Podemos mandar a llamar a la función con cualquier arreglo de imágenes
// setGalleryImages([
//   "http://placekitten.com/421",
//   "http://placekitten.com/423",
//   "http://placekitten.com/425"
// ]);

// Creamos una función que controle el registro del service worker
async function app() {
  // Registramos el service worker
  await navigator.serviceWorker.register("worker.js");

  // Obtenemos una lista de imágenes para nuestra galería desde el servidor
  const response = await fetch("https://picsum.photos/v2/list?limit=30");

  // Si la respuesta falla, notificamos
  if (!response.ok) {
    console.log("[App] No se pudo obtener la galeria.");
    return;
  }

  // Obtenemos la lista de imágenes
  const list = await response.json();
  // Obtenemos las urls de cada imagen
  const pictures = list.map((item) => item.download_url);

  console.log("[App] Se han obtenido las imágenes de la gelería", pictures);

  // Actualizamos la galería con las imágenes provistas por el servidor
  setGalleryImages(pictures);
}

app().catch(console.log);
