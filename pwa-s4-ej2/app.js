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

async function startAnalizeText(data) {
    const taskId = await task.start({ 
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

async function waitToFinishAnalizeText(taskId) {
    const result = await task.wait(taskId, {
        onAdded() {
            console.log("AGREGADO");
            displayTasks(task.tasks);
        },
        onCompleted(_, tasks) {
            console.log("COMPLETADO");
            displayTasks(task.tasks);
        }
    });

    return result;
}

async function analize() {
    // appLock();

    const taskId = await startAnalizeText(textEditor.value);
    
    const result = await waitToFinishAnalizeText(taskId);

    console.log("RESULTADO", result);

    appUnlock();
}

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

    appUnlock();

}

app().catch(error => {
    console.warn(`${error}`);
});