require("dotenv").config();

const http = require("http");

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const mysql = require("./lib/mysql");
const apiForm = require("./api/form");

const app = express();

app.use(cors());
app.use(formidable());
app.use(apiForm);

app.get("/", (request, response) => {
    // /?foo=bar request.query { foo: "bar" }
    response.send("CFE Server v1.0");
});

const server = http.createServer(app);

mysql.connect((error, connection) => {
    if (error) {
        console.error("Error al conectarse", error.stack);
        return;
    }

    console.log("Conectado con el id:", connection.threadId);

    server.listen(process.env.PORT || 8080, process.env.HOST || "localhost", () => {
        console.log(`CFE Server v1.0 Started at http://localhost:8080/`);
    });
});

// server.listen(8080, () => {
//     console.log(`CFE Server v1.0 Started at http://localhost:8080/`);
// });
