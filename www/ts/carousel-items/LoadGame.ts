import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import must from "../utilities/RequiredField.ts";

export default class LoadGame extends CarouselItem{
    constructor(carouselItem: HTMLElement, private readonly navController: NavController){
        super(carouselItem);
    }

    static async create(navController: NavController): Promise<LoadGame>{
        const element = must(await this.loadElement("../views/load-game.html"));
        const loadGame = new LoadGame(element, navController);
        loadGame.registerEvents();
        return loadGame;
    }

    private registerEvents(): void{
        this.getCarouselItem().addEventListener("click", (event) => {
            if ((event.target as HTMLElement).closest("#btnLoadGame"))
                this.navController.onLoadGameButtonClick(event);
        });

        this.getCarouselItem().addEventListener("change", (event) => {
            const btnLoadGame = must(document.getElementById("btnLoadGame")) as any;
            if ((event.target as HTMLElement & {
                selectedIndex: number;
            }).selectedIndex > 0)
                btnLoadGame.removeAttribute("disabled");
            else{
                btnLoadGame.setAttribute("disabled");
            }
        })
    }
}