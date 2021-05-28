# Curso de PWA (CFE)

## Contenido del Curso

```text
Parte 1: INTRODUCCIÓN A LAS APLICACIONES WEB PROGRESIVAS
Por qué necesitábamos una nueva forma de construir sitios web | Ejemplos de PWA en el mundo real | ¿Qué son las PWA? | Ventajas PWA | Requisitos técnicos de PWA

Parte 2: CREAR UNA EXPERIENCIA DE PANTALLA DE INICIO CON UN MANIFIESTO WEB
La especificación del manifiesto web | Validando archivos de manifiesto web| Polyfiling en la experiencia de pantalla de inicio en iOS y otros navegadores heredados | Microsoft Edge e Internet Explorer |Beneficios sin Polyfils | Probando la experiencia de agregar a la pantalla de inicio en Chrome

Parte 3: ASEGURAR TU SITIO WEB
¿Qué es HTTPS? | Diferentes tipos de certificado SSL | Cómo obtener e instalar un certificado SSL | Migración de un sitio web a HTTPS | Auditoría del sitio para cualquier HTTP:// | Configuración de servidor de redireccionamiento automático de HTTP a HTTPS

Parte 4: SERVICE WORKERS: NOTIFICACIÓN, SINCRONIZACIÓN
El hilo del service worker | Soporte de navegadores para service worker | La API Fetch | Creación de un shell de service worker | El ciclo de vida del service worker | Almacenamiento en caché | Uso de notificaciones push | Sincronización de fondo

Parte 5: ADMINISTRACIÓN DE LA API DE CACHE: GESTIÓN DE ACTIVOS WEB EN UNA APLICACIÓN
Usando la API de Fetch | Respuestas de caché | El objeto caché

Parte 6: PATRONES DE CACHEO DE SERVICE WORKERS
Cómo funciona la caché de service workers | Eventos para service workers | Patrones y estrategias de caching | Templating service workers

Parte 7: OPTIMIZACIÓN PARA EL RENDIMIENTO
La importancia de WPO | Reducción del tamaño de la carga útil de la imagen | El costo de CSS y JavaScript | Indicadores clave de rendimiento | Minificación de scripts| Uso de detección de características para cargar condicionalmente | Polyfils de JavaScript
```

## Herramientas de desarrollo que proveen las PWA

1. Instalar recursos en el caché del navegador para poder accederlos sin conexión.
2. Determinar cuándo se están usando los recursos del caché y cuándo no.
3. Determinar cuándo se pasa a modo "Sin Conexión" y a modo "Con Conexión".
4. Interceptar peticiones especificas a recursos del servidor.
5. Simular respuestas idénticas a las que devolvería el servidor, en caso de que falle.
6. Almacenar peticiones temporales para ofrecer una experiencia fuera de línea (App que funciona sin conexión).

## Herramientas de desarrollo comunes en las Aplicaciones Web

1. Crear elementos web dinámicos (imágenes, formularios, botones, controles, etc).
2. APIs nativas del navegador (acceso a la cámara web, ubicación, audio, etc).
3. Realizar peticiones fetch para consumir servicios web (servicios externos o APIs).
4. Ajustar el diseño de controles y elementos web mediante estilos, reglas y animaciones.

## Herramientas de desarrollo comunes en los Servicios Web

1. Acceder a la base de datos (inserción, actualización, eliminación y consultas).