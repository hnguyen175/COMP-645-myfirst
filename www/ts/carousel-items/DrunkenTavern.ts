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
        const carouselItem = must(this.carouselItem);
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

    initializePage(): void {
        this.currentPlayers = must(currentGameState.getPlayers()?.players);
        const randomPlayerRange = Array.from({ length: this.currentPlayers.length }, (_, i) => i);
        this.randomPlayerPicker = new RandomItemPicker(randomPlayerRange);
        this.toggleAllChallengeButtons(true);
        // const divDrunkenTavernChallenge = must(this.carouselItem.querySelector<HTMLElement>("#divDrunkenTavernChallenge"));
        // divDrunkenTavernChallenge.textContent = "";
    }

    // grey out a particular challenge button
    toggleChallengeButtons(challenges: string[], enable: boolean): void {
        const carouselItem = must(this.carouselItem);
        challenges.forEach((challenge) => {
            const challengeButton = must(carouselItem.querySelector<HTMLElement>(`#btn${challenge.toUpperCase()}`));
            if (enable) {
                challengeButton.removeAttribute("disabled");
            } else {
                challengeButton.setAttribute("disabled", "true");
            }
        });
    };

    toggleAllChallengeButtons(enable: boolean): void {
        this.toggleChallengeButtons(["str", "spd", "mp"], enable);
    }

    private tieBreakeChallenges = 0;
    private drunkenTavernChallenge(challenge: keyof Player): void {
        const pickedPlayer = must(this.currentPlayers[this.randomPlayerPicker.getRandomItem()]);
        const divDrunkenTavernChallenge = must(this.carouselItem.querySelector<HTMLElement>("#divDrunkenTavernChallenge"));
        divDrunkenTavernChallenge.textContent = "";

        const villain = must(currentGameState.getDtkVillain());
        const villainChallengeValue = villain[challenge];
        const playerChallengeValue = pickedPlayer[challenge];
        const playerChallengeName = pickedPlayer.name;
        const villainChallengeName = villain.name;
        const challengeName = challenge.toUpperCase();

        if (playerChallengeValue > villainChallengeValue) {
            divDrunkenTavernChallenge.textContent = `${playerChallengeName} has won the challenge! ${playerChallengeName}'s ${challengeName} (${playerChallengeValue}) is greater than the ${villainChallengeName}'s  (${villainChallengeValue}).`;
            this.toggleAllChallengeButtons(false);
            return;
        }

        if (playerChallengeValue < villainChallengeValue) {
            divDrunkenTavernChallenge.textContent = `${playerChallengeName} has lost the challenge! Your ${challengeName} (${playerChallengeValue}) is less than the ${villainChallengeName}'s  (${villainChallengeValue}).`;
            this.toggleAllChallengeButtons(false);
            return;
        }

        // tie, let's compare the luck
        const villainLuck = villain.luk;
        const playerLuck = pickedPlayer.luk;

        if (playerLuck > villainLuck) {
            divDrunkenTavernChallenge.textContent = `${playerChallengeName} has won the challenge! ${playerChallengeName}'s LUK (${playerLuck}) is greater than the ${villainChallengeName}'s LUK (${villainLuck}).`;
        } else {
            this.toggleChallengeButtons([challenge], false);
            divDrunkenTavernChallenge.textContent += `It's a tie for ${playerChallengeName} (${challengeName}: ${playerChallengeValue})! Let's try again! You have ${3 - ++this.tieBreakeChallenges} more attempts to break the tie.`;
        }
    }
}