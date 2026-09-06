class App {
    static async DeviceReady() {
        console.log("Device is ready");

        const dbWorker = new Worker(
            "./js/DatabaseService.js",
            { type: "module" });

        dbWorker.onmessage = function (event) {
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

document.addEventListener("DOMContentLoaded", App.DeviceReady, false);