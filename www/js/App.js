import NavController from './NavController.js';

export default class App {
    static {
        document.addEventListener("DOMContentLoaded", App.DeviceReady);
    }

    static async DeviceReady() {
        console.log("Device is ready");

        App.InitializeDB();

        App.RegisterEventHandlers();
    }

    static InitializeDB() {
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

    static RegisterEventHandlers() {
        document.addEventListener(
            "keydown",
            NavController.navigateCarousel
        );

        document.getElementById("carouselNewGame").addEventListener(
            "prechange",
            NavController.onCarouselPlayersPreChange
        );

        document.getElementById("carouselNewGame").addEventListener(
            "postchange",
            NavController.onCarouselNewGamePostChange
        );

        document.getElementById("btnNewGame").addEventListener(
            "click",
            NavController.navigateCarousel
        );
    }

};
