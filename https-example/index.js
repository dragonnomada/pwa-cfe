const https = require("https");
const fs = require("fs");
const path = require("path");

const options = {
    key: fs.readFileSync(path.join(process.cwd(), "certificado/badillosoft.key")), // La llave del certificado
    // * Se recomienda usar el pem y el bundle en su lugar (más estándar)
    cert: fs.readFileSync(path.join(process.cwd(), "certificado/dc905be3fca66579.crt")), // El certificado principal
    // * Podemos usar el bundle (los certificados concatenados) en su lugar
    ca: [ // Las partes del certificado
        fs.readFileSync(path.join(process.cwd(), "certificado/gd1.crt")),
        fs.readFileSync(path.join(process.cwd(), "certificado/gd2.crt")),
        fs.readFileSync(path.join(process.cwd(), "certificado/gd3.crt")),
    ]
};

const server = https.createServer(options, app); // conecta `app` de `express`