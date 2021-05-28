console.log("[Worker] CFE Todo Worker v1.0");

const todos = [
    {
        id: "456",
        origin: "online",
        title: "Hola mundo :D",
        checked: true,
        createAt: new Date(),
        updateAt: new Date(),
        editable: true
    }
];

let online = false;

async function addTodo(title) {
    console.log("[Worker] Agregando la tarea", title);

    // TODO: Si hay conexión mandar la tarea al server
    try {
        // TODO: ESTRATEGIA ONLINE
        // 1. Mandar a actualizar (checar) el todo hacia el server
        // 2. Si el server logra marcarlo actualizar localmente el todo
        const response = await fetch(`SERVER_URL/api/todo/${id}/add`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title
            })
        });
        const result = await response.json();
        const { success, todo: newTodo } = result;
        if (!success) {
            throw new Error("No se pudo actualizar el todo");
        }
        todos.push({
            id: newTodo.id,
            origin: "online",
            title: newTodo.title,
            checked: newTodo.checked,
            createAt: newTodo.createAt,
            updateAt: newTodo.updateAt,
            editable: true
        });
    } catch (error) {
        // TODO: ESTRATEGIA LOCAL
        // 1. Verificar que el todo sea local (si se puede)
        // * En caso de que el todo sea remoto (de server) bloquearlo (no se puede) 
        todos.push({
            id: Math.random().toString(32).slice(2),
            origin: "local",
            title,
            checked: false,
            createAt: new Date(),
            updateAt: new Date(),
            editable: true
        });
    }
}

async function selectTodo(id, checked) {
    const [todo] = todos.filter(todo => todo.id === id);

    if (!todo) return;

    try {
        // TODO: ESTRATEGIA ONLINE
        // 1. Mandar a actualizar (checar) el todo hacia el server
        // 2. Si el server logra marcarlo actualizar localmente el todo
        const response = await fetch(`SERVER_URL/api/todo/${id}/checked`);
        const result = await response.json();
        const { success, todo: newTodo } = result;
        if (!success) {
            throw new Error("No se pudo actualizar el todo");
        }
        todo.origin = "online";
        todo.checked = newTodo.checked;
        todo.updateAt = newTodo.updateAt;
    } catch (error) {
        // TODO: ESTRATEGIA LOCAL
        // 1. Verificar que el todo sea local (si se puede)
        // * En caso de que el todo sea remoto (de server) bloquearlo (no se puede) 
        todo.origin = "local";
        todo.checked = checked;
        todo.updateAt = new Date();
    }

}

this.addEventListener("message", async event => {
    const { type, data } = event.data;

    console.log(`[Worker] Trabajo recibido (${type})`);

    if (type === "set-online") {
        online = true;
        event.source.postMessage({
            type: "update-todos",
            data: {
                todos: todos.map(todo => {
                    todo.editable = online ? true : todo.origin === "local";
                    return todo;
                })
            }
        });
    }

    if (type === "set-offline") {
        online = false;
        event.source.postMessage({
            type: "update-todos",
            data: {
                todos: todos.map(todo => {
                    todo.editable = online ? true : todo.origin === "local";
                    return todo;
                })
            }
        });
    }

    if (type === "get-todos") {
        event.source.postMessage({
            type: "update-todos",
            data: {
                todos: todos.map(todo => {
                    todo.editable = online ? true : todo.origin === "local";
                    return todo;
                })
            }
        });
    }

    if (type === "add-todo") {
        const { title } = data;

        await addTodo(title);

        // ACTUALIZA LOS TODOS EN LA INTERFAZ
        event.source.postMessage({
            type: "update-todos",
            data: {
                todos: todos.map(todo => {
                    todo.editable = online ? true : todo.origin === "local";
                    return todo;
                })
            }
        });
    }

    if (type === "select-todo") {
        const { id, checked } = data;

        await selectTodo(id, checked);

        // ACTUALIZA LOS TODOS EN LA INTERFAZ
        event.source.postMessage({
            type: "update-todos",
            data: {
                todos: todos.map(todo => {
                    todo.editable = online ? true : todo.origin === "local";
                    return todo;
                })
            }
        });
    }
});