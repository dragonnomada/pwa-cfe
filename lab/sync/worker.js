this.addEventListener("sync", event => {
    console.log("[Worker] Sync", event.tag);
});