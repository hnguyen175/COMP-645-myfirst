import CarouselItem from "./CarouselItem.ts";
import must from "../utilities/RequiredField.ts";
import currentGameState from "../GameState.ts";
import Player from "../Player.ts";
import loggingProxy from "../utilities/LoggingProxy.ts";
import TemplateGameTasks from "../templates/TemplateGameTasks.ts";
import PlayerService from "../PlayerService.ts";
import NavController from "../NavController.ts";
import { fireAndForget } from "../utilities/AsyncUtils.ts";

type ChallengeResult = {
    outcome: "win" | "lose" | "tie";
    message: string;
    disableChallengeButtons: ("str" | "spd" | "mp")[];
    pickedPlayer: Player;
}

type ChallengeData = {
    challengeName: string;
    playerChallengeName: string;
    playerChallengeValue: number;
    playerLuk: number;
    villainChallengeName: string;
    villainChallengeValue: number;
    villainLuk: number;
    pickedPlayer: Player;
}

type ChallengeStat = "str" | "spd" | "mp";


export default class DrunkenTavern extends CarouselItem {
    constructor(
        private readonly navController: NavController,
        private readonly playerService: PlayerService,
        carouselItem: HTMLElement
    ) {
        super(carouselItem);
    }

    static async create(navController: NavController, playerService: PlayerService, template: TemplateGameTasks): Promise<DrunkenTavern> {
        const element = must(await this.loadElement("../views/drunken-tavern.html"));
        const drunkadTavern = loggingProxy(new DrunkenTavern(navController, playerService, element));

        const divDurnkenTavern = must(drunkadTavern.carouselItem.querySelector<HTMLElement>("#divDrunkenTavernChallenge"));

        divDurnkenTavern.after(template.templateFragment);

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
                this.drunkenTavernChallenge(btnTxt.trim().toLowerCase() as ChallengeStat);
                return;
            }
        });
    }

    initializePage(): void {
        this.toggleAllChallengeButtons(true);
        this.tieBreakeChallenges = 0;

        const divDrunken = must(this.carouselItem.querySelector("#divDrunken"));
        divDrunken.innerHTML = `Welcome, ${currentGameState.getPlayers()?.players[0]?.name}! Grab some refreshments and chat with the various patrons of our fine establishement.
        <p>In this level, challenge an opponent to who has better STATS. </p> 
        `;

        // // reset the challenge result message
        // const divDrunkenTavernChallenge = must(this.carouselItem.querySelector<HTMLElement>("#divDrunkenTavernChallenge"));
        // divDrunkenTavernChallenge.textContent = "";
    }

    toggleAllChallengeButtons(enable: boolean): void {
        this.toggleChallengeButtons(["str", "spd", "mp"], enable);
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

    private drunkenTavernChallenge(challenge: ChallengeStat): void {
        const challengeResult = this.resolveChallenge(challenge);

        const divDrunkenTavernChallenge = must(this.carouselItem.querySelector<HTMLElement>("#divDrunkenTavernChallenge"));

        divDrunkenTavernChallenge.innerHTML = challengeResult.message;
        this.toggleChallengeButtons(challengeResult.disableChallengeButtons, false);

        if (challengeResult.outcome === "win") {
            this.nextChallenge();
            PlayerService.saveActivePlayers();
            this.updatePlayerCards(challengeResult.pickedPlayer.name, challenge, challengeResult.pickedPlayer[challenge]);

            this.ShowNextChallengeButton();
        }
    }

    private updatePlayerCards(playerName: string, challenge: ChallengeStat, challengeValue: number): void {
        const query = `ons-list-header div.right[data-property="name"]`;
        const all = [...this.carouselItem?.querySelectorAll<HTMLElement>(query)];

        const column = all.find((el) => el.textContent.trim().toUpperCase() === playerName.trim().toUpperCase());

        const challengeQuery = `ons-list-item[data-property="${challenge}"]`;
        const row = column?.closest("ons-list")?.querySelector<HTMLElement>(challengeQuery);
        const updatingCell = must(row?.querySelector(".clsValue")).textContent = challengeValue.toString();
        row?.classList.add("row-flash");
    }

    // private challengeResult: ChallengeResult = null as unknown as ChallengeResult;
    private resolveChallenge(challenge: ChallengeStat): ChallengeResult {
        const pickedPlayer = must(currentGameState.getPlayers()?.draw());

        const villain = must(currentGameState.getDtkVillain());
        const villainChallengeValue = villain[challenge] as number;
        const playerChallengeValue = pickedPlayer[challenge] as number;
        const playerChallengeName = pickedPlayer.name;
        const villainChallengeName = villain.name;
        const challengeName = challenge.toUpperCase();
        const playerLuk = pickedPlayer.luk;
        const villainLuk = villain.luk;
        const villainCls = villain.cls;

        if (playerChallengeValue > villainChallengeValue) {
            const goldEarned = Math.floor(Math.random() * 50) + 50;
            pickedPlayer[challenge] += 5;
            currentGameState.getPlayers()?.addGold(goldEarned);
            return {
                outcome: "win",
                message: `${playerChallengeName} stepped forward to battle the ${villainCls} and <b>WON</b>! Their stat went up 5 more and earned ${goldEarned} gold! Now, continue your quest!`,
                disableChallengeButtons: ["mp", "spd", "str"],
                pickedPlayer: pickedPlayer
            } as ChallengeResult;
        }

        if (playerChallengeValue < villainChallengeValue) {
            return {
                outcome: "lose",
                message: `${playerChallengeName} stepped forward to battle the ${villainCls} and <b>LOST</b> the challenge! Swipe right to go back and try again!`,
                disableChallengeButtons: ["mp", "spd", "str"],
                pickedPlayer: pickedPlayer
            } as ChallengeResult;
        }

        return this.handleTieChallenge({ challengeName, playerChallengeName, playerChallengeValue, villainChallengeName, villainChallengeValue, playerLuk, villainLuk, pickedPlayer });
    }

    private tieBreakeChallenges = 0;
    private handleTieChallenge(challengeData: ChallengeData): ChallengeResult {
        if (challengeData.playerLuk > challengeData.villainLuk) {
            const goldEarned = Math.floor(Math.random() * 50) + 50;
            challengeData.pickedPlayer[challengeData.challengeName.toLowerCase() as ChallengeStat] += 5;
            currentGameState.getPlayers()?.addGold(goldEarned);

            return {
                outcome: "win",
                message: `${challengeData.playerChallengeName} stepped forward to battle the ${challengeData.villainChallengeName} and <b>WON</b>! Their ${challengeData.challengeName} (${challengeData.playerChallengeValue}) matched the villain's, but their superior luck (${challengeData.playerLuk} vs. ${challengeData.villainLuk}) secured the victory! Their stat went up 5 more and they earned ${goldEarned} gold! Now, continue your quest!`,
                disableChallengeButtons: ["str", "spd", "mp"],
                pickedPlayer: challengeData.pickedPlayer
            } as ChallengeResult;
        }

        if (challengeData.playerLuk < challengeData.villainLuk) {
            return {
                outcome: "lose",
                message: `${challengeData.playerChallengeName} stepped forward to battle the ${challengeData.villainChallengeName} and <b>LOST</b> the challenge! Their ${challengeData.challengeName} (${challengeData.playerChallengeValue}) matched the villain's, but their lower luck (${challengeData.playerLuk} vs. ${challengeData.villainLuk}) cost them the victory! Swipe right to go back and try again!`,
                disableChallengeButtons: ["str", "spd", "mp"],
                pickedPlayer: challengeData.pickedPlayer
            } as ChallengeResult;
        }

        this.tieBreakeChallenges++;
        return {
            outcome: "tie",
            message: `${challengeData.playerChallengeName} stepped forward to battle the ${challengeData.villainChallengeName}, but their ${challengeData.challengeName} (${challengeData.playerChallengeValue}) matched the villain's! ${this.tieBreakeChallenges >= 3
                ? `The battle ended in a <b>TIE</b> after 3 attempts! Neither could claim victory! Swipe right to go back and try again!`
                : `The battle remains a <b>TIE</b>! Choose another stat to continue the battle! You have ${3 - this.tieBreakeChallenges} attempts remaining!`
                }`,
            disableChallengeButtons: [challengeData.challengeName.toLowerCase() as ChallengeStat],
            pickedPlayer: challengeData.pickedPlayer
        } as ChallengeResult;
    }

    private nextChallenge(): void {
        const players = must(currentGameState.getPlayers());
        players.currentScreen = "Forest";
    }

    private ShowNextChallengeButton() {
        const divDrunkenTavernChallenge = must(this.carouselItem.querySelector<HTMLElement>("#divDrunkenTavernChallenge"));

        const btnGoToForest = ons.createElement(`<ons-button id="btnGoToForest" class="challenge-button">Go!</ons-button>`) as HTMLElement;

        btnGoToForest.addEventListener("click", () => {
            fireAndForget(this.navController.replaceTavernWithForest());
        });

        divDrunkenTavernChallenge.append(document.createElement('div'), btnGoToForest);
    }
}