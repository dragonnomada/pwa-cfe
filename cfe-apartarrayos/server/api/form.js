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

async function getFormFields(id_form) {
    return await new Promise((resolve, reject) => {
        const sql = "SELECT * FROM apartarrayos.form_fields where id_form=?;"

        const values = [id_form];

        mysql.connection().query(sql, values, (error, results, fields) => {
            if (error) {
                reject(error);
                return;
            }

            if (results.length === 0) {
                reject(`Error El formulario [${id_form}] no tiene campos`);
                return;
            }

            resolve(results);
        });
    });
}

async function getFormSchema(id_form) {
    return await new Promise((resolve, reject) => {
        const sql = `SELECT * FROM apartarrayos.form where id_form=?;`;

        const values = [id_form];

        mysql.connection().query(sql, values, async (error, results, fields) => {
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
                    error: `No se encuentra el formulario llamado [${id_form}]`
                });
                return;
            }

            const form = results[0];

            // TODO: Agregar los campos del formulario

            try {
                const fields = await getFormFields(id_form);

                resolve({
                    ...form,
                    fields
                });

            } catch (error) {
                reject(error);
            }
        });
    });
}

// Devuelve el esquema (campos) de un formulario
// Entrada: { formName }
// Salida: { id_form, name, title, version, fields: [ { idform_fields, id_form, name, type, default_value, label } ] }
router.get("/api/apartarrayos/form/:name/schema", async (request, response) => {
    const { name } = request.params;

    try {
        const formSchema = await getFormSchema(name);

        response.send({
            success: true,
            schema: formSchema
        });
    } catch (error) {
        response.send({
            success: false,
            error: `Error al consultar los campos del formulario [${name}]`,
            originalError: `${error}`
        });
    }
});

async function createRecord(id_form) {
    return await new Promise((resolve, reject) => {
        const sql = "INSERT INTO apartarrayos.form_records SET ?;"

        const values = {
            id_form,
            created_at: new Date()
        };

        mysql.connection().query(sql, values, (error, result, fields) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result.insertId);
        });
    });
}

async function insertFormFieldValue(id_form, id_record, id_form_field, value) {
    return await new Promise((resolve, reject) => {
        const sql = "INSERT INTO apartarrayos.form_registers SET ?;"

        const values = {
            id_form,
            id_record,
            id_form_field,
            value
        };

        mysql.connection().query(sql, values, (error, result, fields) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result.insertId);
        });
    });
}

async function insertFormRecord(formSchema, fields) {
    // TODO: Insertar el registro en el formulario (bd)

    // 1. CREAR UN REGISTRO (RECORD) (SESIÓN / SUBMIT)

    const recordId = await createRecord(formSchema.id_form);

    console.log({ recordId });

    // 2. AGREGAR LOS VALORES DEL REGISTRO (REGISTER) (A LA SESIÓN)

    const ids = [];

    for (let [fieldName, fieldValue] of Object.entries(fields)) {
        const [field] = formSchema.fields.filter(({ name }) => name === fieldName);

        console.log({ field });

        if (!field) {
            console.log(`El campo ${fieldName} no existe`);
            continue;
        }

        // field.id_form_field
        const formRegisterInsertedId = await insertFormFieldValue(formSchema.id_form, recordId, field.id_form_field, fieldValue);

        ids.push(formRegisterInsertedId);
    }

    return {
        recordId,
        registerIds: ids
    };
}

router.post("/api/apartarrayos/form/:name/submit", async (request, response) => {
    console.log(request.fields);

    const { name } = request.params;

    try {
        const formSchema = await getFormSchema(name);

        const result = await insertFormRecord(formSchema, request.fields);

        response.send({
            success: true,
            result
        });
    } catch (error) {
        response.send({
            success: false,
            error: `Error al consultar los campos del formulario [${name}]`,
            originalError: `${error}`
        });
    }
})

module.exports = router;