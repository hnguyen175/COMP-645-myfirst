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
            const target = event.target as HTMLElement;
            if (target.id === "btnRoll")
                this.navController.onRollButtonClick();

            if (target.id === "btnClearName")
                this.emptyInput("onsPlayerName");

            if (target.id === "btnClearEmail")
                this.emptyInput("onsPlayerEmail");
        });
    }

    private emptyInput(inputField: string) : void {
        const input = this.getCarouselItem().querySelector(`#${inputField}`) as HTMLInputElement;
        if (input) {
            input.value = "";
            input.focus();
        }
    }
}