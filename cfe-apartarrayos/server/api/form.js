const { Router, request } = require("express");

const mysql = require("../lib/mysql");

const router = Router();

router.get("/api/apartarrayos/form", (request, response) => {
    const sql = `SELECT * FROM apartarrayos.form`;

    const values = [];

    mysql.connection().query(sql, values, (error, results, fields) => {
        if (error) {
            response.send({
                success: false,
                error: `Error al consultar los formularios`,
                originalError: `${error}`
            });
            return;
        }

        if (results.length === 0) {
            response.send({
                success: false,
                error: `No hay formularios registrados`
            });
            return;
        }

        response.send({
            success: true,
            results
        });
    });
});

// Devuelve el esquema (campos) de un formulario
// Entrada: { formName }
// Salida: { id_form, name, title, version, fields: [ { idform_fields, id_form, name, type, default_value, label } ] }
router.get("/api/apartarrayos/form/:name/schema", (request, response) => {
    const { name } = request.params;

    const sql = `SELECT * FROM apartarrayos.form where id_form=?;`;

    const values = [name];

    mysql.connection().query(sql, values, (error, results, fields) => {
        if (error) {
            response.send({
                success: false,
                error: `Error al consultar el formulario`,
                originalError: `${error}`
            });
            return;
        }

        if (results.length === 0) {
            response.send({
                success: false,
                error: `No se encuentra el formulario llamado [${name}]`
            });
            return;
        }

        const form = results[0];

        // TODO: Agregar los campos del formulario

        const sql = "SELECT * FROM apartarrayos.form_fields where id_form=?;"

        const values = [name];

        mysql.connection().query(sql, values, (error, results, fields) => {
            if (error) {
                response.send({
                    success: false,
                    error: `Error al consultar los campos del formulario [${name}]`,
                    originalError: `${error}`
                });
                return;
            }

            if (results.length === 0) {
                response.send({
                    success: false,
                    error: `Error El formulario [${name}] no tiene campos`
                });
                return;
            }

            response.send({
                success: true,
                schema: {
                    ...form,
                    fields: results
                }
            });
        });

        // console.log(error);
        // console.log(results);
        // console.log(fields);
        // response.send("ok");
    });
});

module.exports = router;