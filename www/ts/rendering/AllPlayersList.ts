import PlayerService from "../PlayerService.ts";

export default class AllPlayersList {
    static renderAllPlayersList(playerListElement: ons.OnsSelectElement, players: string[]): void {
        // Remove old player options, but keep the first placeholder option
        while (playerListElement.length > 1) {
            playerListElement.removeChild(playerListElement.lastElementChild!);
        }

        players.forEach(playerEmail => {
            const optionElement = document.createElement("option");
            optionElement.value = playerEmail;
            optionElement.textContent = playerEmail;

            playerListElement?.appendChild(optionElement);
        });
    }

    static renderAllPlayersList2(playerListElement: HTMLElement, players: string[], playerService: PlayerService): void {
        // Remove old player options, but keep the first placeholder option
        while (playerListElement.children.length > 1) {
            playerListElement.removeChild(playerListElement.lastElementChild!);
        }

        players.forEach(playerEmail => {
            const player = playerService.loadPlayers(playerEmail);
            const playerName = player ? player.players[0].name : "Unknown"; // Assuming the first player is the one we want
            const currentScreen = player ? player.currentScreen : "Unknown"; // Assuming the first player is the one we want

            const onsListItem = document.createElement("ons-list-item");
            onsListItem.setAttribute("tappable", "");
            onsListItem.setAttribute("data-email", playerEmail);

            const rowDiv = onsListItem.appendChild(document.createElement("div"));
            rowDiv.classList.add("player-row");

            const nameDiv = rowDiv.appendChild(document.createElement("div"));
            nameDiv.textContent = playerName;

            const emailDiv = rowDiv.appendChild(document.createElement("div"));
            emailDiv.textContent = playerEmail;

            const levelDiv = rowDiv.appendChild(document.createElement("div"));
            levelDiv.textContent = currentScreen; // Placeholder for level info

            playerListElement?.appendChild(onsListItem);
        });
    }
};