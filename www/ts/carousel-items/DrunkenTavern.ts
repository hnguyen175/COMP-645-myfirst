import CarouselItem from "./CarouselItem.ts";
import must from "../utilities/RequiredField.ts";
import currentGameState from "../GameState.ts";
import Player from "../Player.ts";

export default class DrunkenTavern extends CarouselItem {
    constructor(
        carouselItem: HTMLElement
    ) {
        super(carouselItem);
    }

    static async create(): Promise<DrunkenTavern> {
        const element = must(await this.loadElement("../views/drunken-tavern.html"));
        const drunkadTavern = new DrunkenTavern(element);

        drunkadTavern.registerEvents();
        return drunkadTavern;
    }

    private registerEvents(): void {
        const carouselItem = must(this.getCarouselItem());
        const carouselItemId = must(carouselItem.id);

        carouselItem.addEventListener("click", (event) => {
            const clickedElement = event.target as HTMLElement;
            if (clickedElement.closest(`#${carouselItemId} :is(#btnSTR, #btnSPD, #btnMP)`)) {
                const btnTxt = must(clickedElement.textContent);
                this.drunkenTavernChallenge(btnTxt.trim().toLowerCase() as keyof Player);
                return;
            }
        });
    }

    private drunkenTavernChallenge(challenge: keyof Player): void {
        const players = must(currentGameState.getPlayers()?.players);
        const pickedPlayer = must(players[Math.floor(Math.random() * players.length)]);

        console.log('Challenge - ' + challenge);
        console.log('My player - ' + pickedPlayer['_name'] + " " + pickedPlayer[challenge]);

        const villain = must(currentGameState.getDtkVillain());
        console.log('Villain - ' + villain['_name'] + " " + villain[challenge]);
    }
}