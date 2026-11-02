import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import PlayerService from "../PlayerService.ts";
import GameTasks from "../templates/GameTasks.ts";
import loggingProxy from "../utilities/LoggingProxy.ts";
import must from "../utilities/RequiredField.ts";
import BaseBattleChallenge from "./BaseBattleChallenge.ts";
import GoToNextChallenge from "../templates/GoToNextChalllenge.ts";
import PlayerView from "../rendering/PlayerView.ts";
import Player from "../Player.ts";

export default class Mountain extends BaseBattleChallenge {
    constructor(carouselItem: HTMLElement, navController: NavController, playerService: PlayerService, goToNextChallengeTemplate: GoToNextChallenge, playerView: PlayerView, miniBoss: Player) {

        super(carouselItem, navController, playerService, goToNextChallengeTemplate, playerView, miniBoss);
    }

    static async create(navController: NavController, playerService: PlayerService, template: GameTasks, goToNextChallengeTemplate: GoToNextChallenge, miniBoss: Player = new Player(null, null, null, {
        hp: Player.randomStat(50, 100),
        str: Player.randomStat(),
        spd: Player.randomStat(),
        mp: Player.randomMp(),
        luk: Player.randomLuk(),
        wep: "Evil " + Player.randomWeapon(),
        cls: "Dark " + Player.randomClass()
    })): Promise<Mountain> {
        const element = must(await this.loadElement("../views/mountain.html") as HTMLElement);
        const mountain = loggingProxy(new Mountain(element, navController, playerService, goToNextChallengeTemplate, new PlayerView(), miniBoss));

        // const footer = must(mountain.carouselItem.querySelector("footer"));
        // footer.after(template.templateFragment);
        mountain.setupControls(mountain, template);

        return mountain;
    }
}