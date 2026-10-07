import CarouselItem from "./CarouselItem.ts";
import must from "../utilities/RequiredField.ts";
import currentGameState from "../GameState.ts";
import Player from "../Player.ts";
import shuffleItems from "../utilities/ShuffleItems.ts";
import { RandomItemPicker } from "../utilities/ShuffleItems.ts";
import loggingProxy from "../utilities/LoggingProxy.ts";

export default class DrunkenTavern extends CarouselItem {
    constructor(
        carouselItem: HTMLElement
    ) {
        super(carouselItem);
    }

    static async create(): Promise<DrunkenTavern> {
        const element = must(await this.loadElement("../views/drunken-tavern.html"));
        const drunkadTavern = loggingProxy(new DrunkenTavern(element));

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

    private randomPlayerPicker: RandomItemPicker<number> = null as unknown as RandomItemPicker<number>;
    private currentPlayers: Player[] = [];

    initializeRandomPlayerPicker(): void {
        this.currentPlayers = must(currentGameState.getPlayers()?.players);
        const randomPlayerRange = Array.from({ length: this.currentPlayers.length }, (_, i) => i);
        this.randomPlayerPicker = new RandomItemPicker(randomPlayerRange);
    }

    private drunkenTavernChallenge(challenge: keyof Player): void {
        const pickedPlayer = must(this.currentPlayers[this.randomPlayerPicker.getRandomItem()]);

        console.log('Challenge - ' + challenge);
        console.log('My player - ' + pickedPlayer['_name'] + " " + pickedPlayer[challenge]);

        const villain = must(currentGameState.getDtkVillain());
        console.log('Villain - ' + villain['_name'] + " " + villain[challenge]);
    }
}