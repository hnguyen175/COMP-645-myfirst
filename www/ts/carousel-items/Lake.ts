import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import PlayerService from "../PlayerService.ts";
import TemplateGameTasks from "../templates/TemplateGameTasks.ts";
import loggingProxy from "../utilities/LoggingProxy.ts";
import must from "../utilities/RequiredField.ts";
import MiniBoss from "../MiniBoss.ts";
import PlayerView from "../rendering/PlayerView.ts";
import currentGameState from "../GameState.ts";

export default class Lake extends CarouselItem {
    constructor(carouselItem: HTMLElement, private readonly navController: NavController, private readonly playerService: PlayerService, private readonly playerView: PlayerView = new PlayerView(), private readonly miniBoss: MiniBoss = new MiniBoss()) {
        super(carouselItem);
    }

    static async create(navController: NavController, playerService: PlayerService, template: TemplateGameTasks): Promise<Lake> {
        const element = must(await this.loadElement("../views/lake.html") as HTMLElement);
        const lake = loggingProxy(new Lake(element, navController, playerService));

        const footer = must(lake.carouselItem.querySelector("footer"));
        footer.after(template.templateFragment);

        lake.renderPlayers();
        lake.addAttackButtons();

        return lake;
    }

    private renderPlayers(): void {
        this.playerView.renderPlayerCards(this.carouselItem, must(currentGameState?.getParty()?.players), ['wep', 'cls']);
    }

    private addAttackButtons(): void {
        this.carouselItem.querySelectorAll('#caiLake .player-card').forEach(card => {
            const name = card.querySelector('[data-property="name"]')?.textContent; // Get the player's name from the card

            // get the data-player-id attribute from the card
            const playerId = card.getAttribute('data-player-id');

            const attackButton = document.createElement('ons-button');
            // set the attribute data-player-id to the button
            attackButton.setAttribute('data-player-id', playerId ?? '');

            attackButton.textContent = `Attack ${name}`;
            attackButton.addEventListener('click', () => {
                // this.miniBoss.attack(player);
            });
            card.appendChild(attackButton);
        });

        // const players = must(currentGameState?.getParty()?.players);
        // players.forEach((player, index) => {
        //     const btn = document.createElement('button');
        //     btn.textContent = `Attack ${player.name}`;
        //     btn.addEventListener('click', () => {
        //         this.miniBoss.attack(player);
        //     });
        //     this.carouselItem.querySelector('main')?.appendChild(btn);
        // });
    }
}