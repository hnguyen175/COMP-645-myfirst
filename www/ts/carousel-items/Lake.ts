import NavController from '../NavController.ts';
import Player from '../Player.ts';
import PlayerService from '../PlayerService.ts';
import PlayerView from '../rendering/PlayerView.ts';
import GameTasks from '../templates/GameTasks.ts';
import GoToNextChallenge from '../templates/GoToNextChalllenge.ts';
import loggingProxy from '../utilities/LoggingProxy.ts';
import must from '../utilities/RequiredField.ts';
import BaseBattleChallenge from './BaseBattleChallenge.ts'

export default class Lake extends BaseBattleChallenge {

    public constructor(carouselItem: HTMLElement, navController: NavController, playerService: PlayerService, goToNextChallengeTemplate: GoToNextChallenge, playerView: PlayerView, miniBoss: Player) {
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
    })): Promise<Lake> {

        const element = must(await this.loadElement("../views/lake.html") as HTMLElement);
        const lake = loggingProxy(new Lake(element, navController, playerService, goToNextChallengeTemplate, new PlayerView(), miniBoss));

        lake.setupControls(lake, template);

        return lake;
    }
}
