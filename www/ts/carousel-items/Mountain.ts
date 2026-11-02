import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import PlayerService from "../PlayerService.ts";
import GameTasks from "../templates/GameTasks.ts";
import loggingProxy from "../utilities/LoggingProxy.ts";
import must from "../utilities/RequiredField.ts";
import BaseBattleChallenge from "./BaseBattleChallenge.ts";
import PlayerView from "../rendering/PlayerView.ts";
import Player from "../Player.ts";
import RandomGenerator from "../utilities/RandomGenerator.ts";
import currentGameState from "../GameState.ts";

export default class Mountain extends BaseBattleChallenge {
    constructor(carouselItem: HTMLElement, navController: NavController, playerService: PlayerService, playerView: PlayerView, miniBoss: Player) {

        super(carouselItem, navController, playerService, playerView, miniBoss);
    }

    static async create(navController: NavController, playerService: PlayerService, template: GameTasks, miniBoss: Player = new Player(null, null, null, {
        hp: RandomGenerator.randomStat(11, 101, 1),
        spd: RandomGenerator.villainRandomStat(),
        str: RandomGenerator.villainRandomStat(),
        mp: RandomGenerator.villainRandomStat(),
        luk: RandomGenerator.randomLuk(),
        wep: "Evil " + RandomGenerator.randomWeapon(),
        cls: "Dark " + RandomGenerator.randomClass()
    })): Promise<Mountain> {
        const element = must(await this.loadElement("../views/mountain.html") as HTMLElement);
        const mountain = loggingProxy(new Mountain(element, navController, playerService, new PlayerView(), miniBoss));

        // const footer = must(mountain.carouselItem.querySelector("footer"));
        // footer.after(template.templateFragment);
        mountain.setupControls(mountain, template);

        return mountain;
    }

    protected awardStatsToPlayers(): void {
        const party = must(currentGameState.getParty());
        party.players.forEach(player => {
            player.luk += (RandomGenerator.randomStat(50, 60, 1) / 100);
            player.spd += RandomGenerator.randomStat(10, 25, 1);
        });
        party.addGold(RandomGenerator.randomStat(111, 222, 1));
    }
}