import CarouselItem from "./CarouselItem.ts";
import NavController from "../NavController.ts";
import PlayerService from "../PlayerService.ts";
import TemplateGameTasks from "../templates/TemplateGameTasks.ts";
import loggingProxy from "../utilities/LoggingProxy.ts";
import must from "../utilities/RequiredField.ts";
import PlayerView from "../rendering/PlayerView.ts";
import currentGameState from "../GameState.ts";
import Player from "../Player.ts";

export default class Lake extends CarouselItem {
    private readonly miniBoss: Player = new Player(null, null, null, {
        hp: Player.randomStat(50, 100),
        str: Player.randomStat(),
        spd: Player.randomStat(),
        mp: Player.randomMp(),
        luk: Player.randomLuk(),
        wep: "Evil " + Player.randomWeapon(),
        cls: "Dark " + Player.randomClass()
    });

    constructor(carouselItem: HTMLElement, private readonly navController: NavController, private readonly playerService: PlayerService, private readonly playerView: PlayerView = new PlayerView()) {
        super(carouselItem);
    }

    static async create(navController: NavController, playerService: PlayerService, template: TemplateGameTasks): Promise<Lake> {
        const element = must(await this.loadElement("../views/lake.html") as HTMLElement);
        const lake = loggingProxy(new Lake(element, navController, playerService));

        const footer = must(lake.carouselItem.querySelector("footer"));
        footer.after(template.templateFragment);

        lake.renderPlayers();
        lake.addAttackButtons();

        lake.playerView.renderPlayerCardsByName(lake.carouselItem, "divLakeVillain", [lake.miniBoss], ['hp', 'wep', 'cls']);

        return lake;
    }

    private renderPlayers(): void {
        this.playerView.renderPlayerCards(this.carouselItem, must(currentGameState?.getParty()?.players), ['hp', 'wep', 'cls']);
    }

    private addAttackButtons(): void {
        this.carouselItem.querySelectorAll('.player-card').forEach(card => {
            const name = card.querySelector('[data-property="name"]')?.textContent; // Get the player's name from the card

            // get the data-player-id attribute from the card
            const playerId = must(card.getAttribute('data-player-id'));

            const attackButton = document.createElement('ons-button');
            // set the attribute data-player-id to the button
            attackButton.setAttribute('data-player-id', playerId);

            attackButton.textContent = `Attack ${name}`;
            attackButton.addEventListener('click', () => {
                // Handle the attack logic here
                void this.executeAttack(name, playerId, attackButton);
            });
            card.appendChild(attackButton);
        });
    }

    private async executeAttack(name: string | undefined, playerId: string, attackButton: HTMLElement) {
        // You can add more logic here to handle the attack, such as updating the game state, etc.
        const statValue = must(this.carouselItem.querySelector(`[data-player-id="${playerId}"] .clsValue`)?.textContent);
        console.log(`Player ${name} (ID: ${playerId}) - stat: ${statValue} is attacking the mini-boss!`);

        // disable the button after click
        attackButton.setAttribute('disabled', 'true');

        this.applyDamageToPlayer(playerId);

        // reduce miniboss by the player's stat value
        const damage = this.applyDamageToBoss(statValue);

        console.log(`Mini-boss HP reduced by ${damage}. New HP: ${this.miniBoss.hp}`);

        await this.updateBattleResult(name, damage);
    }

    private async updateBattleResult(name: string | undefined, damage: number) {
        const lakeResult = must(this.carouselItem.querySelector('#pLakeResult'));
        if (this.miniBoss.hp <= 0) {

            await this.handleVictoryResult(lakeResult);
        } else {
            // any player left?
            this.updateBattleMessage(lakeResult, name, damage);
        }
    }

    private updateBattleMessage(lakeResult: Element, name: string | undefined, damage: number) {
        if (this.carouselItem.querySelector('ons-button:not([disabled])')) {
            lakeResult.textContent = `Player ${name} attacked the mini-boss for ${damage} damage! ${this.miniBoss.name}'s HP is now ${this.miniBoss.hp}. Keep fighting and choose another party member!`;
        } else {
            lakeResult.textContent = `All your party members have attacked! The mini-boss still has ${this.miniBoss.hp} HP left. You need to strategize and try again!`;
        }
    }

    private async handleVictoryResult(lakeResult: Element) {
        const tmpGold = Math.floor(Math.random() * (1234 - 999 + 1)) + 999;
        currentGameState.getParty()?.addGold(tmpGold);

        lakeResult.textContent = `You defeated the ${this.miniBoss.name}! and earned ${tmpGold.toLocaleString()} Gold!`;

        this.carouselItem.querySelectorAll('ons-button').forEach(button => {
            button.setAttribute('disabled', 'true');
        });

        await this.navController.createNextChallenge(this);
    }

    private applyDamageToBoss(statValue: string) {
        const damage = parseInt(statValue);
        this.miniBoss.hp = Math.max(this.miniBoss.hp - damage, 0); // Ensure HP doesn't go below 0

        const bossStatCell = must(this.carouselItem.querySelector('#divLakeVillain .clsValue'));
        bossStatCell.textContent = this.miniBoss.hp.toString();

        const listItem = must(bossStatCell.closest<HTMLElement>('ons-list-item'));
        listItem.classList.remove('row-flash');
        void listItem.offsetWidth; // Trigger reflow to restart the animation
        listItem.classList.add('row-flash');
        return damage;
    }

    private applyDamageToPlayer(playerId: string) {
        currentGameState.getParty()?.players.forEach(player => {
            if (player.id === playerId) {
                player.hp -= Math.floor(player.hp * 0.5); // reduce the player's HP by 50%

                const playerStatCell = must(this.carouselItem.querySelector(`[data-player-id="${playerId}"] .clsValue`));
                playerStatCell.textContent = player.hp.toString();
                const listItem = must(playerStatCell.closest('ons-list-item'));
                listItem.classList.add('row-flash');
            }
        });
    }
}