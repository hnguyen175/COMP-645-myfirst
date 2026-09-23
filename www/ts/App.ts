import NavController from './NavController.ts';
import loggingProxy from './utilities/LoggingProxy.ts';

declare const ons: any;

export default class App {
    private navController: NavController;

    constructor() {
        this.navController = loggingProxy(new NavController());

        ons.ready(() => this.DeviceReady());
    }

    private async DeviceReady() {
        console.log("Device is ready");
        await this.navController.init();

        await this.initialize();

        //this.InitializeDB();

        this.RegisterEventHandlers();
    }

    private async initialize(){
        await this.navController.loadCarouselItems(
            [
                "views/welcome.html",
                "views/new-game.html",
                // "views/players.html"
            ]
        );
    }

    private InitializeDB() {
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

    private RegisterEventHandlers() {
        document.getElementById("carouselNewGame")?.addEventListener(
            "prechange",
            (event) => this.navController.onCarouselPriorDisplayingItem(event)
        );

        document.getElementById("btnNewGame")?.addEventListener(
            "click",
            (event) => {
                this.navController.onCarouselNewGame(event);
            }
        );

        document.getElementById("btnReload")?.addEventListener(
            "click",
            async (event) => {
                console.log("Reload button clicked");
                this.navController.onReloadButtonClick(event);
            }
        );
    }

    private emptyInput(inputId: string) : void {
        const input = document.getElementById(inputId) as HTMLInputElement || null;
        if (input) {
            input.value = "";
            input.focus();
        }
    }
};

const app = loggingProxy(new App());