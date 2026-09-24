declare const ons: any;

export default class AllPlayersList {
    static renderAllPlayersList(playerListElement: any, players: string[]): void {
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
};