class App {
    static async DeviceReady() {
        console.log("Device is ready");
        // Additional initialization code can go here
    
    const dbWorker = new Worker(
        new URL("./db-worker.js", import.meta.url),
        { type: "module" }
    );

    dbWorker.onmessage = function(event) {
        if (event.data.type === "ready") {
            console.log("SQLite database ready");
        }

        if (event.data.type === "error") {
            console.error(
                "SQLite error:",
                event.data.message
            );
        }
    };

    }
};

await App.DeviceReady();