require("dotenv").config();

const https = require("https");
const http = require("http");

module.exports = (handler) => {
    if (/https/i.test(process.env.PROTOCOL)) {
        // TODO: Armar `options` (certificado)
        return https.createServer(options, handler);
    }
    
    return http.createServer(handler);
};

