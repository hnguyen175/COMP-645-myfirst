import Player from "../Player.ts";

class PlayerDisplay{
    static createPlayerCard(player: Player, showStrength = true) : string {
        let playerHtml = `<ons-card class="player-card"><ons-list><ons-list-header>${player.name}</ons-list-header>`;

        Object.entries(player).forEach(([property, value]) => {
            if (property === "name" || property === "email") {
                return;
            }
            if (!showStrength && !(property === "wep" || property === "cls")) {
                return;
            }

            playerHtml += `<ons-list-item class="player-stat">${property.toUpperCase()}: ${value}</ons-list-item>`;
        });

        playerHtml += `</ons-list></ons-card>`;
        return playerHtml;
    }
}

export default PlayerDisplay.createPlayerCard;