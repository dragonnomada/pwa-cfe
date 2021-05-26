const formContainer = document.querySelector(".form");

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

    const result = await response.text();

    console.log(`El servidor respondió: ${result}`);
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

function app() {
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
            type: "submit",
            defaultValue: "Enviar"
        }
    ])
}

app();