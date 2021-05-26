const mysql = require("mysql");

let connection = null;

module.exports = {
    connection: () => connection,
    connect(callback) {
        connection = mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        connection.connect((error) => {
            callback(error, connection);
        });
    }
};