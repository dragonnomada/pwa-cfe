require("dotenv").config();

const http = require("http");

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const app = express();

app.use(cors());
app.use(formidable());

app.get("/", (request, response) => {
    // /?foo=bar request.query { foo: "bar" }
    response.send("CFE Server v1.0");
});

app.post("/form/demo", (request, response) => {
    // request.fields { username: "batman", password: "robin", ... }
    console.log(request.fields);

    const { username, password } = request.fields;
    
    if (!(/^[a-z\d_-]+$/.test(username))) {
        response.send({
            success: false,
            code: 123,
            error: `El nombre de usuario [${username}] no es válido (minúsculas, números y guiones)`
        });
        return;
    }
    
    const email = `${username}@cfe.com.mx`;

    const data = {
        nombre: username,
        email: email,
        token: password // TODO: Encriptar el password
    };

    connection.query("INSERT INTO usuarios SET ?", data, (error, results, fields) => {
        if (error) {
            response.send({
                success: false,
                error: `No se puede insertar el registro ${email} (${username}) en la base de datos`,
                formId: Math.random().toString(32).slice(2),
                formData: {
                    username,
                    password
                },
                originalError: `${error}`
            });
            return;
        }

        response.send({
            success: true,
            results,
            fields
        });
    });

    // response.send("Formulario recibido");
});

const server = http.createServer(app);

connection.connect((error) => {
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
