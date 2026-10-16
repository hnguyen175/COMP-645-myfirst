import TemplateGameTasks from "../templates/TemplateGameTasks.ts";
import CarouselItem from "./CarouselItem.ts";
import must from "../utilities/RequiredField.ts";
import Player from "../Player.ts";
import currentGameState from "../GameState.ts";
import loggingProxy from "../utilities/LoggingProxy.ts";
// import PlayerView from "../rendering/PlayerView.ts";

type FangornForestCharacter = {
    name: string;
    item: string;
    attribute: string;
};

type FangornForestBoostStats = {
    hp: number;
    mp: number;
};

export default class FangornForest extends CarouselItem {
    constructor(carouselItem: HTMLElement) {
        super(carouselItem);
    }

    static async create(template: TemplateGameTasks): Promise<FangornForest> {
        const element = await this.loadElement("../views/forest.html");
        const forest = loggingProxy(new FangornForest(element));
        await forest.registerEvents();

        const footer = must(forest.carouselItem.querySelector("footer"));
        footer.after(template.templateFragment);

        // this.showPlayerInfo();

        return forest;
    }

    private async registerEvents(): Promise<void> {
        const btnAskForHP = must(this.carouselItem.querySelector("#btnAskForHP"));
        btnAskForHP.addEventListener("click", () => {
            this.grantHealthPoints('hp');
        });

        const btnAskForMP = must(this.carouselItem.querySelector("#btnAskForMP"));
        btnAskForMP.addEventListener("click", () => {
            this.grantHealthPoints("mp");
        });
    }

    private grantHealthPoints(whichHealth: "hp" | "mp"): number {
        const rndFrac = Math.random();
        const players = must(currentGameState?.getPlayers()?.players);
        const bonus = Math.ceil(Player.randomStat() * rndFrac);

        players.forEach(player => {
            if (whichHealth === "hp") {
                player.hp += bonus;
            } else {
                player.mp += bonus;
            }
        });
        return bonus;
    }

    initializePage(): void {
        const playerNameElement = must(this.carouselItem.querySelector("#forestWelcoming"));
        const name = must(currentGameState?.getPlayers()?.players[0]).name;
        const fangornResult = FangornForest.fangornForestStats();

        playerNameElement.innerHTML = /*html*/`Welcome, ${name}! You have reached the ghostly forest. What's that ahead?. <p>You meet ${fangornResult.name} and their ${fangornResult.name} of ${fangornResult.attribute}. </p>`;

        const template = document.createElement('template');
        template.innerHTML = /*html*/`<p>You will ask ${fangornResult.name} to help your quest by granting you some of their ${fangornResult.attribute} from their ${fangornResult.item}!</p>`;

        must(this.carouselItem.querySelector('main')).appendChild(template.content.firstElementChild!);

        // document.createE /*html*/`<p>You will ask ${fangornResult.name} to help your quest by granting you some of their ${fangornResult.attribute} from their ${fangornResult.item}!</p>`;
        // must(this.carouselItem.querySelector('main')).appendChild() += /*html*/`<p>You will ask ${fangornResult.name} to help your quest by granting you some of their ${fangornResult.attribute} from their ${fangornResult.item}!</p>`;
    }

    private static readonly arrFrstChar = [
        ["Adabor", "Bentrax", "Celiz", "Danitark", "Xullix", "Yizzoro", "Zana"],
        ["Secret Book", "Holy Codex", "Lost Parchment", "Gothic Scroll"],
        ["Power", "Wisdon", "Validation", "Insight", "Experience"]
    ];
    private static fangornForestStats(): FangornForestCharacter {
        const randomName = FangornForest.arrFrstChar[0][Math.floor(Math.random() * FangornForest.arrFrstChar[0].length)];
        const randomItem = FangornForest.arrFrstChar[1][Math.floor(Math.random() * FangornForest.arrFrstChar[1].length)];
        const randomAttribute = FangornForest.arrFrstChar[2][Math.floor(Math.random() * FangornForest.arrFrstChar[2].length)];
        // const randomValue = Math.floor(Math.random() * 10) + 1;
        // const rndFrac = Math.random();
        return {
            name: randomName,
            item: randomItem,
            attribute: randomAttribute,
            // hp: Math.ceil(Player.randomStat() * rndFrac),
            // mp: Math.ceil(Player.randomMp() * rndFrac),
        };
    }
}