import Player from "../Player.ts";

class PlayerDisplay {
    static createPlayerCard(player: Player, showStrength = true): string {
        const playerDesc = player.toString();
        let playerHtml = `<ons-card class="player-card"><ons-list><ons-list-header class="list-item__icon"><div class="left"><img src="${PlayerDisplay.createImgUrl(player)}" alt="Player avatar" class="avatar"></div><div class="right">${player.name}</div></ons-list-header>`;

        Object.entries(player).forEach(([property, value]) => {
            // ignore properties that start with an underscore (private properties)
            if (property.startsWith("_")) {
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

    private static createImgUrl(player: Player): string {
        return `https://api.dicebear.com/10.x/pixel-art/svg?seed=${encodeURIComponent(player.id)}&size=20`;
    }
}

export default PlayerDisplay.createPlayerCard;