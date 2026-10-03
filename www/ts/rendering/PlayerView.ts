import Player from "../Player.ts";
import Players from "../Players.ts";
import must from "../utilities/RequiredField.ts";
import createPlayerCard from "./PlayerDisplay.ts";
import currentGameState from '../GameState.ts';

export default class PlayerView {
    renderPlayerCards(carouselId: string, players: Player[]): void {
        const playerCards = must(document.querySelector(`#${carouselId} .player-cards`)) as HTMLElement;

        playerCards.innerHTML = ""; // Clear previous content
        players.forEach((player) => {
            playerCards.innerHTML += createPlayerCard(player);
        });
    };

    // TODO - move this to class page
    showValidationToast(input: HTMLInputElement, message: string) {
        const rect = input.getBoundingClientRect();

        const messageElement = document.createElement("div");
        messageElement.classList.add("validation-toast");
        messageElement.textContent = message;
        messageElement.style.top = `${rect.top}px`;
        messageElement.style.left = `${rect.right + 12}px`;

        document.body.appendChild(messageElement);

        input.focus();

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}