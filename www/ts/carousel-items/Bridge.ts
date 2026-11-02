import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import PlayerService from "../PlayerService.ts";
import GameTasks from "../templates/GameTasks.ts";
import loggingProxy from "../utilities/LoggingProxy.ts";
import must from "../utilities/RequiredField.ts";
import BaseBattleChallenge from "./BaseBattleChallenge.ts";
import GoToNextChallenge from "../templates/GoToNextChalllenge.ts";
import Player from "../Player.ts";
import PlayerView from "../rendering/PlayerView.ts";

export default class Bridge extends BaseBattleChallenge {
    constructor(carouselItem: HTMLElement, navController: NavController, playerService: PlayerService, goToNextChallengeTemplate: GoToNextChallenge, playerView: PlayerView, miniBoss: Player) {
        super(carouselItem, navController, playerService, new GoToNextChallenge(navController, ""), playerView, miniBoss);
    }

    static async create(navController: NavController, playerService: PlayerService, template: GameTasks, goToNextChallenge: GoToNextChallenge, miniBoss: Player = new Player(null, null, null, {
        hp: Player.randomStat(50, 100),
        str: Player.randomStat(),
        spd: Player.randomStat(),
        mp: Player.randomMp(),
        luk: Player.randomLuk(),
        wep: "Evil " + Player.randomWeapon(),
        cls: "Dark " + Player.randomClass()
    })): Promise<Bridge> {
        const element = must(await this.loadElement("../views/bridge.html") as HTMLElement);
        const bridge = loggingProxy(new Bridge(element, navController, playerService, goToNextChallenge, new PlayerView(), miniBoss));

        // const footer = must(bridge.carouselItem.querySelector("footer"));
        // footer.after(template.templateFragment);
        bridge.setupControls(bridge, template);

        return bridge;
    }
}