const formContainer = document.querySelector(".form");
const messageContainer = document.querySelector(".message");

const sendAllButton = document.querySelector("#send-all");

// navigator.onLine = true | false

window.addEventListener("online", async () => {
    alert("Ya hay conexión a internet");
    // TODO: Enviar todos los formularios

    await sendAllTemporalForms();
});

window.addEventListener("offline", () => {
    alert("Se perdió la conexión a internet");
});

async function sendAllTemporalForms () {
    temporalFormsContainer.innerHTML = "";

    const temporalForms = JSON.parse(localStorage.getItem("temporal-forms") || "[]");

    localStorage.setItem("temporal-forms", "[]");

    for (let form of temporalForms) {
        const formData = new FormData();

        for (let [key, value] of Object.entries(form.data)) {
            formData.append(key, value);
        }

        await submitForm(formData);
    }
}

sendAllButton.addEventListener("click", sendAllTemporalForms);

function createField(field) {
    const node = document.createElement("div");

    node.innerHTML = `
        <div class="form-field">
            <label>${field.label || ""}</label>
            <input id="${field.name || Math.random().toString(32)}" name="${field.name || "unknown"}" type="${field.type || "text"}" value="${field.defaultValue || ""}" >
        </div>
    `;

    // TODO: Lógica del nodo

    return node;
}

async function submitForm(formData) {
    const response = await fetch("http://localhost:8080/form/demo", {
        method: "post",
        body: formData
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    // { success: true|false, error?, results?, fields? }
    const result = await response.json();

    if (!result.success) {
        console.warn(result.originalError);

        // DETERMINAR SI EL FORMULARIO NO SE PUDO ENVIAR
        if (result.formId) {
            // TODO: Almacenar temporalmente el formulario
            const temporalForms = JSON.parse(localStorage.getItem("temporal-forms") || "[]");

            console.log("formularios pendientes", temporalForms);

            temporalForms.push({
                id: result.formId,
                data: result.formData
            });

            localStorage.setItem("temporal-forms", JSON.stringify(temporalForms));

            updateTemporalForms();
        }

        messageContainer.innerHTML = `
            <pre><code>${result.error}</code></pre>
        `;

        return;
    }

    messageContainer.innerHTML = `
        <pre><code>Formulario enviado correctamente</code></pre>
    `;

    console.log(`El servidor respondió:`, result);
}

function createForm(fields) {

    // fields = [ { name: "usuario", label: "Usuario", type: "text", defaultValue: "" }, { type: "submit" } ]
    console.log("Campos", fields);

    formContainer.innerHTML = "";

    for (let field of fields) {
        const htmlNodeField = createField(field);

        formContainer.appendChild(htmlNodeField);
    }

    const form = document.createElement("form");

    // SUSTITUYE EL FORMULARIO CONSTRUIDO POR EL VIRTUAL
    formContainer.parentElement.replaceChild(form, formContainer);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(form);

        console.log("Recibiendo formulario", Object.fromEntries(formData));

        // Enviar el formulario a nuestro servidor
        submitForm(formData).then(result => {
            // SUSTITUYE EL FORMULARIO VIRTUAL POR EL CONSTRUIDO
            form.parentElement.replaceChild(formContainer, form);
            createForm(fields);
        }).catch(error => {
            console.warn(`Falló el envio del formulario al servidor (${error})`);
        });
    });

    form.appendChild(formContainer);
}

const temporalFormsContainer = document.querySelector(".temporal-forms");

function updateTemporalForms() {
    // TODO: Ver si hay formularios pendientes y mostrarlos
    const temporalForms = JSON.parse(localStorage.getItem("temporal-forms") || "[]");

    temporalFormsContainer.innerHTML = "";

    const nodes = temporalForms.map(form => {
        const node = document.createElement("div");

        node.innerHTML = `
            <div class="temporal-form">
                <span>(${form.id}) [${form.data.username}]</span>
                <button>editar</button>
            </div>
        `;

        const button = node.querySelector("button");

        button.addEventListener("click", () => {
            document.querySelector("#username").value = form.data.username;
            document.querySelector("#password").value = form.data.password;

            const newTemporalForms = temporalForms.filter(_form => _form.id !== form.id);

            localStorage.setItem("temporal-forms", JSON.stringify(newTemporalForms));

            updateTemporalForms();
        });

        return node;
    })

    for (let node of nodes) {
        temporalFormsContainer.appendChild(node);
    }
}

async function app() {
    await navigator.serviceWorker.register("worker.js");

    updateTemporalForms();

    createForm([
        {
            name: "username",
            label: "Usuario",
            type: "text",
            defaultValue: "example"
        },
        {
            name: "password",
            label: "Contraseña",
            type: "password",
        },
        {
            name: "comentarios",
            label: "Comentarios",
            type: "comments",
        },
        {
            type: "submit",
            defaultValue: "Enviar"
        }
    ])
}

app();