const SERVER_URL = "http://localhost:8080";

console.log("ACTIALIZA");

async function getForms() {
    // TODO: Obtener los formularios del servidor

    const response = await fetch(`${SERVER_URL}/api/apartarrayos/form`);

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

    const response = await fetch(`${SERVER_URL}/api/apartarrayos/form/${form.id_form}/schema`);

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

function collectFormData(formNode) {
    // TODO: Extraer los datos del formulario

    const formData = new FormData(formNode);
    return Object.fromEntries(formData);
}

async function submitForm(formData) {
    // TODO: Envia el formulario al del servidor

    const response = await fetch(`${SERVER_URL}/api/apartarrayos/form/${formData.id_form}/submit`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        // El servidor falló
        const error = await response.text();
        throw new Error("Falló el servidor?", error);
    }

    // { success, error?, originalError?, schema? }
    const result = await response.json();

    console.log("result", result);

    if (!result.success) {
        // TODO: Notificar al usuario que surgió un error
        console.warn(result.error, result.originalError);
        return false;
    }

    alert("Formulario Eviado");

    return true;
}

async function buildForm(formSchema) {
    const formNode = document.createElement("form");

    formNode.action = "#";

    formNode.innerHTML = `
        <h1>${formSchema.title} <small>${formSchema.version}</small></h1>

        <div>
            <input type="hidden" id="id_form" name="id_form" value="${formSchema.id_form}" >
            <input type="hidden" id="name" name="name" value="${formSchema.name}" >

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

        <div>   
            <input type="button" class="form-btn-reset" value="Reiniciar">
            <input type="button" class="form-btn-submit" value="Enviar">
        </div>
    `;

    // const formNode = formNode.querySelector("form");
    const btnReset = formNode.querySelector(".form-btn-reset");
    const btnSubmit = formNode.querySelector(".form-btn-submit");

    // console.log(formContainerNode.outerHTML);

    async function submit() {
        // TODO: RECOLECTAR LOS DATOS DEL FORMULARIO
        const formData = collectFormData(formNode);

        console.log(JSON.stringify(formData));

        // TODO: Enviar los datos del formulario al server

        btnReset.disabled = true;
        btnSubmit.disabled = true;

        await submitForm(formData).catch(error => {
            console.warn(`Error al enviar el formulario`, error);
        });

        btnReset.disabled = false;
        btnSubmit.disabled = false;
    };

    formNode.addEventListener("submit", event => {
        console.log("SUBMIT", formNode);

        event.preventDefault();
        event.stopPropagation();
    });

    btnReset.addEventListener("click", async event => {
        console.log("RESETEANDO...", formSchema);
        const newFormContainerNode = await buildForm(formSchema);
        console.log(newFormContainerNode, formNode);
        formNode.parentElement.replaceChild(newFormContainerNode, formNode);
    });

    btnSubmit.addEventListener("click", event => {
        console.log("hola", formNode);
        event.preventDefault();
        submit();
    });

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