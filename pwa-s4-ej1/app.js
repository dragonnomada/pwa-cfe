const textEditor = document.querySelector("#text-editor");
const buttonAnalysis = document.querySelector("#button-analysis");
const boxResults = document.querySelector("#box-results");
const boxTasks = document.querySelector("#box-tasks");

buttonAnalysis.addEventListener("click", analize);

function appLock() {
    textEditor.disabled = true;
    buttonAnalysis.disabled = true;
}

function appUnlock() {
    textEditor.disabled = false;
    buttonAnalysis.disabled = false;
}

async function startAnalizeTextByWorker(data) {
    const registration = await navigator.serviceWorker.getRegistration();
    const worker = registration.active;
    
    console.log(worker);

    const taskId = Math.random().toString(32).slice(2);

    worker.postMessage({
        taskId,
        type: "text-analysis",
        payload: data
    });

    return taskId;
}

function displayTasks(tasks) {
    boxTasks.innerHTML = tasks
        .map(task => `
            <div>
                (${task.taskId}) ${task.type} ${task.completed ? "COMPLETADO" : "ESPERANDO..."}
            </div>
        `)
        .join("\n");
}

let tasks = [];

async function waitToFinishAnalizeTextByWorker(taskId) {
    const task = {
        taskId,
        type: "text-analysis",
        completed: false,
        result: null
    };

    // SE AGREGA TAREA (AGREGAR)
    tasks.push(task);

    displayTasks(tasks);

    console.log(tasks);

    while(!task.completed) {
        await new Promise(resolve => setTimeout(resolve, 16));
    }

    // SE COMPLETA TAREA (ELIMINAR)
    tasks = tasks.filter(task => task.taskId !== taskId);

    displayTasks(tasks);

    console.log(tasks);

    return task.result;
}

async function analize() {
    // appLock();

    const taskId = await startAnalizeTextByWorker(textEditor.value);
    
    const result = await waitToFinishAnalizeTextByWorker(taskId);

    console.log("RESULTADO", result);

    appUnlock();
}

navigator.serviceWorker.addEventListener("message", event => {
    // El worker ha enviado un mensaje de vuelta
    console.log("[App] El worker respondió con", event);

    if (event.data.taskId) {
        const [task] = tasks.filter(task => task.taskId === event.data.taskId);
        task.result = event.data.result;
        task.completed = true;
    }
});

async function app() {
    appLock();

    // if ("serviceWorker" in navigator)
    const registration = await navigator.serviceWorker.register("worker.js");

    console.log("[App] Worker registrado", registration);

    const worker = registration.active;

    if (!worker) {
        window.location.reload();
        return;
    }

    worker.postMessage({
        type: "ping",
        payload: 123
    });

    appUnlock();

}

app().catch(error => {
    console.warn(`${error}`);
});