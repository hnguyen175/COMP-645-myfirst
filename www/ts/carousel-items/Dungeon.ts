import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import PlayerService from "../PlayerService.ts";
import must from "../utilities/RequiredField.ts";
import GameTasks from "../templates/GameTasks.ts";
import PlayerView from "../rendering/PlayerView.ts";
import currentGameState from "../GameState.ts";
import { fireAndForget } from "../utilities/AsyncUtils.ts";

export default class Dungeon extends CarouselItem {
  private constructor(
    carouselItem: HTMLElement,
    private readonly navController: NavController,
    private readonly playerService: PlayerService,
    private readonly playerView: PlayerView = new PlayerView(),
    private timer: number = 10
  ) {
    super(carouselItem);
  }

  static async create(
    navController: NavController,
    playerService: PlayerService,
  ): Promise<Dungeon> {
    const element = must(await this.loadElement("../views/dungeon.html"));
    const dungeon = new Dungeon(element, navController, playerService);

    dungeon.playerView.renderPlayerCards(
      dungeon.carouselItem,
      must(currentGameState?.getParty()?.players)
    );

    const divDunChallenge = must(dungeon.carouselItem.querySelector("#divDungeonChallenge"));
    divDunChallenge.innerHTML = `Use your "<strong>${currentGameState.getParty()?.inventory}</strong>" in the nick of time before the roof collapses upon your party and escape with your ${currentGameState.getParty()?.earnedGold} Gold. Let us hope your ${currentGameState.getParty()?.averageLuk()} Luk holds out!`;

    const footer = must(dungeon.carouselItem.querySelector("footer"));
    footer.after(GameTasks.instance.templateFragment);

    const timer = dungeon.timerSetup();

    dungeon.registerEvents(timer);

    return dungeon;
  }

  private registerEvents(timer: number): void {
    const actionButton = must(this.carouselItem.querySelector<HTMLButtonElement>("#btnDunAction"));
    actionButton.addEventListener("click", () => {
      window.clearInterval(timer);
      actionButton.disabled = true;
      fireAndForget(this.navController.createNextChallenge(this));
    }, { once: true });
  }

  private timerSetup(): number {
    const spDunTimer = must(this.carouselItem.querySelector("#spDunTimer"));
    spDunTimer.innerHTML = this.timer.toString();
    const timer = window.setInterval(() => {
      this.timer--;
      spDunTimer.innerHTML = this.timer.toString();
      if (this.timer <= 0) {
        window.clearInterval(timer);
        const actionButton = must(this.carouselItem.querySelector<HTMLButtonElement>("#btnDunAction"));
        actionButton.disabled = true;
        must(this.carouselItem.querySelector("#pDunEnemy")).innerHTML = "The roof has collapsed! You have failed to escape in time.";
      }
    }, 1000);
    return timer;
  }
}
