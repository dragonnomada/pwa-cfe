const todoInputEdit = document.querySelector(".todo-edit-container input");
const todoAddButton = document.querySelector(".todo-button-container button");
const connectionIcon = document.querySelector(".connection-icon");
const todoContainer = document.querySelector(".todos-container");

todoInputEdit.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTodo();
    }
});

todoAddButton.addEventListener("click", () => {
    addTodo();
});

async function addTodo() {
    const registration = await navigator.serviceWorker.getRegistration();
    const worker = registration.active;

    worker.postMessage({
        type: "add-todo",
        data: {
            title: todoInputEdit.value
        }
    });
}

function createTodo({ id, origin, title, checked, createAt, updateAt, editable }) {

    const node = document.createElement("div");

    node.className = "todo-item";

    node.innerHTML = `
        <div class="todo-checkbox">
            <input ${!editable && "disabled"} type="checkbox" ${checked ? "checked" : ""}>
        </div>

        <div class="todo-content">

            <div class="todo-title">
                <span>${title} (${origin})</span>
            </div>
            
            <div class="todo-subtitle">
                <div class="spacing"></div>
                <div class="todo-dates">
                    <div class="todo-subtitle-padding todo-create-at">
                        <span>Creado: ${new Date(createAt).toLocaleString()}</span>
                    </div>
                    <div class="todo-subtitle-padding todo-update-at">
                        <span>Actualizado: ${new Date(updateAt).toLocaleString()}</span>
                    </div>
                </div>
                <div class="spacing"></div>
            </div>

        </div>

        <div class="todo-tools">
            <div class="todo-tool todo-action-delete">
                <button ${!editable && "disabled"}>Eliminar</button>
            </div>
        </div>
    `;

    const checkbox = node.querySelector(".todo-checkbox input");
    const deleteButton = node.querySelector(".todo-action-delete button");

    checkbox.addEventListener("change", async () => {
        lock();
        // Ejecutar la tarea de seleccionar el todo
        // TODO: Avisarle al worker que el todo con `id` se va a actualizar
        const registration = await navigator.serviceWorker.getRegistration();
        const worker = registration.active;

        worker.postMessage({
            type: "select-todo",
            data: {
                id,
                checked: checkbox.checked
            }
        });
        // const taskId = await task.start({ type: "select-todo", data: { id } });
        // const checked = await task.wait(taskId);
        // checkbox.checked = checked;
        unlock();
    });

    function lock() {
        checkbox.disabled = true;
        deleteButton.disabled = true;
    }

    function unlock() {
        checkbox.disabled = false;
        deleteButton.disabled = false;
    }

    return node;

}

function updateTodos(todos) {
    console.log("[App] Actualizando todos", todos);

    todoContainer.innerHTML = !todos || todos.length === 0 ?
        "<span>Sin cosas por hacer</span>" : "";

    for (let todoItem of todos) {
        const todoNode = createTodo(todoItem);
        todoContainer.appendChild(todoNode);
    }
}

navigator.serviceWorker.addEventListener("message", async event => {
    const { type, data } = event.data;

    if (type === "update-todos") {
        const { todos } = data;

        updateTodos(todos);
    }
});

window.addEventListener("online", async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const worker = registration.active;

    worker.postMessage({
        type: "set-online",
        data: {}
    });
});

window.addEventListener("offline", async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const worker = registration.active;

    worker.postMessage({
        type: "set-offline",
        data: {}
    });
});

async function app() {
    updateTodos([]);

    const registration = await navigator.serviceWorker.register("worker.js");

    const worker = registration.active;

    if (!worker) {
        window.location.reload();
        return;
    }

    worker.postMessage({
        type: "get-todos",
        data: {}
    });

    console.log("[App] Worker registrado");
}

app().catch(error => {
    console.warn(`[App] Error ${error}`);
    console.error(error);
})