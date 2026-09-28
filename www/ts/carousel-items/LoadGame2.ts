import PlayerService from "../PlayerService.ts";
import CarouselItem from "./CarouselItem.ts";
import must from "../utilities/RequiredField.ts";
import AllPlayersList from "../rendering/AllPlayersList.ts";

export default class LoadGame2 extends CarouselItem {
  constructor(
    carouselItem: HTMLElement,
    private readonly playerService: PlayerService,
  ) {
    super(carouselItem);
  }

  static async create(playerService: PlayerService): Promise<LoadGame2> {
    const element = await this.loadElement("../views/load-game2.html");
    const loadGame2 = new LoadGame2(element, playerService);
    loadGame2.loadPlayers();

    loadGame2.registerEvents();
    return loadGame2;
  }

  private registerEvents(): void {
    const carouselItem = must(this.getCarouselItem());
    const list = must(carouselItem.querySelector<HTMLElement>("#onslPlayers"));

    list.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const listItem = target.closest("ons-list-item");
      if (listItem) {
        const email = listItem.getAttribute("data-email");
        if (email) {
          console.log(`Selected player email: ${email}`);
        }
      }

      list.querySelectorAll("ons-list-item").forEach((item) => {
        item.classList.remove("selected");
      });
      listItem?.classList.add("selected");
    });
  }

  loadPlayers(): void {
    // Implementation for loading players
    const allPlayers = must(this.playerService.listPlayersFromStorage());
    const onsList = must(
      this.getCarouselItem().querySelector<HTMLElement>("#onslPlayers"),
    );

    AllPlayersList.renderAllPlayersList2(
      onsList,
      allPlayers,
      this.playerService,
    );
  }
}
