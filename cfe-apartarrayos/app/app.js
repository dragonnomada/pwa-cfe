async function getForms() {
    // TODO: Obtener los formularios del servidor

    const response = await fetch("http://localhost:8080/api/apartarrayos/form");

    if (!response.ok) {
        // El servidor falló
        const error = await response.text();
        throw new Error("Falló el servidor?", error);
    }

    // { success, error?, originalError?, results? }
    const result = await response.json();

    if (!result.success) {
        // TODO: Notificar al usuario que surgió un error al obtener los formularios.
        console.warn(result.error, result.originalError);
        return [];
    }

    return result.results;
}

async function getFormsAndDisplay() {
    // TODO: Obtener los formularios y mostralos

    const forms = await getForms();

    for (let form of forms) {
        await displayForm(form);
    }
}

async function getFormSchema(form) {
    // TODO: Obtener el esquema del servidor

    const response = await fetch(`http://localhost:8080/api/apartarrayos/form/${form.id_form}/schema`);

    if (!response.ok) {
        // El servidor falló
        const error = await response.text();
        throw new Error("Falló el servidor?", error);
    }

    // { success, error?, originalError?, schema? }
    const result = await response.json();

    if (!result.success) {
        // TODO: Notificar al usuario que surgió un error
        console.warn(result.error, result.originalError);
        return [];
    }

    return result.schema;
}

async function buildForm(formSchema) {
    const formNode = document.createElement("form");

    formNode.innerHTML = `
        <h1>${formSchema.title} <small>${formSchema.version}</small></h1>

        <div>
            ${
                formSchema.fields.map(field => {
                    return `
                        <div>
                            <label>${field.label}</label>
                            <input 
                                type="${field.type}" 
                                id="${formSchema.name}-${field.name}" 
                                name="${field.name}" 
                                value="${field.default_value}" 
                            >
                        </div>
                    `;
                }).join("\n")
            }
        </div>
    `;

    return formNode;
}

async function displayForm(form) {
    // TODO: Mostrar el formulario

    const formSchema = await getFormSchema(form);

    const formNode = await buildForm(formSchema);

    document.body.appendChild(formNode);

    // document.body.innerHTML += `${JSON.stringify(formSchema)}`;
}

async function app() {
    // TODO: Registrar el worker

    // TODO: Obtener todos los formularios y pintarlos
    getFormsAndDisplay();
}

app().catch(error => {
    console.warn(`[App] Error`, error);
});