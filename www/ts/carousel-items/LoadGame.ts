import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import must from "../utilities/RequiredField.ts";
import AllPlayersList from "../rendering/AllPlayersList.ts";
import PlayerService from "../PlayerService.ts";

export default class LoadGame extends CarouselItem{
    constructor(carouselItem: HTMLElement, private readonly navController: NavController, private readonly playerService : PlayerService){
        super(carouselItem);
    }

    static async create(navController: NavController, playerService: PlayerService): Promise<LoadGame>{
        const element = must(await this.loadElement("../views/load-game.html"));
        const loadGame = new LoadGame(element, navController, playerService);
        loadGame.registerEvents();
        loadGame.loadPlayers();
        return loadGame;
    }

    loadPlayers(){
        const listPlayers = must(this.getCarouselItem().querySelector("#selPlayers") as any);
        AllPlayersList.renderAllPlayersList(listPlayers, this.playerService.listPlayersFromStorage());
    }

    private registerEvents(): void{
        const carouselItem = this.getCarouselItem();
        carouselItem.addEventListener("click", (event) => {
            if ((event.target as HTMLElement).closest("#btnLoadGame"))
                this.navController.onLoadGameButtonClick(event);
        });

        carouselItem.addEventListener("change", (event) => {
            if ((event.target as HTMLElement).closest("#lstPlayers")){
                const btnLoadGame = must(document.getElementById("btnLoadGame")) as any;
                btnLoadGame.removeAttribute("disabled");
            }
        });
    }
}