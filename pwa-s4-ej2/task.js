function task() {

}

task.protocol = "task-protocol";

task.tasks = [];

task.start = async protocol => {
    const registration = await navigator.serviceWorker.getRegistration();
    const worker = registration.active;

    const taskId = Math.random().toString(32).slice(2);

    worker.postMessage({
        ...protocol,
        protocol: task.protocol,
        taskId,
    });

    const currentTask = {
        ...protocol,
        protocol: task.protocol,
        taskId,
        completed: false,
        result: null,
    };

    // SE AGREGA TAREA (AGREGAR)
    task.tasks.push(currentTask);

    return taskId;
};

task.wait = async (taskId, { onAdded, onCompleted, onUpdated }) => {
    const [currentTask] = task.tasks.filter(someTask => someTask.taskId === taskId)
    
    if (typeof onAdded === "function") {
        onAdded(currentTask);
    }

    while (!currentTask.completed) {
        if (typeof onUpdated === "function") {
            onUpdated(currentTask);
        }

        await new Promise(resolve => setTimeout(resolve, 16));
    }

    // SE COMPLETA TAREA (ELIMINAR)
    task.tasks = task.tasks.filter(someTask => someTask.taskId !== taskId);

    if (typeof onCompleted === "function") {
        onCompleted(currentTask, task.tasks);
    }

    return currentTask.result;
};

// ESCURCHAR LOS MENSAJES DEL WORKER (BAJO NUESTRO PROTOCOLO DE DATOS)
navigator.serviceWorker.addEventListener("message", event => {
    console.log("[App] El worker ha respondido", event);

    const data = event.data;

    if (typeof data !== "object" || data instanceof Array) return;

    const { protocol, taskId, result } = data;

    if (protocol !== task.protocol) return;

    const [currentTask] = task.tasks.filter(someTask => someTask.taskId === taskId);

    if (!currentTask) return;

    currentTask.result = result;

    currentTask.completed = true;
});

