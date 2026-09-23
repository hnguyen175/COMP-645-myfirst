import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import must from "../utilities/RequiredField.ts"

export default class NewGame extends CarouselItem {
    constructor(carouselItem : HTMLElement, private readonly navController: NavController){
        super(carouselItem);
    }

    static async create(navController: NavController): Promise<NewGame>{
        const element = must(await this.loadElement("../views/new-game.html"));
        const newGame = new NewGame(element, navController);
        newGame.registerEvents();
        return newGame;
    }

    private registerEvents(): void {
        this.getCarouselItem().addEventListener("click", (event) => {
            if ((event.target as HTMLElement).closest("#btnRoll"))
                this.navController.onRollButtonClick(event);
        });
    }
}