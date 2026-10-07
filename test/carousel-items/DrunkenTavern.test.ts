import * as Vitest from 'vitest';
import DrunkenTavern from '../../www/ts/carousel-items/DrunkenTavern';
import must from '../../www/ts/utilities/RequiredField';
import Players from '../../www/ts/Players';
import Player from '../../www/ts/Player';
import currentGameState from '../../www/ts/GameState';
import PlayerService from '../../www/ts/PlayerService';

const drunkenTavernHtml = '../../www/views/drunken-tavern.html?raw';

let playerService: PlayerService = null as unknown as PlayerService;
let gameStateMock: unknown;

Vitest.beforeAll(async () => {
    // Mock the fetch function to return the HTML content for the specified URLs
    Vitest.vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        if (url.toString().endsWith("../views/drunken-tavern.html")) {
            const drunkenTavern = await import(drunkenTavernHtml);
            return new Response(drunkenTavern.default);
        }
        throw new Error(`Unexpected URL: ${url}`);
    });

    Vitest.vi.stubGlobal('ons', {
        createElement: (html: string) => {
            const template = document.createElement('template');
            template.innerHTML = html.trim();
            return template.content.firstElementChild as HTMLElement;
        }
    });
    playerService = new PlayerService();

    gameStateMock = Vitest.vi.spyOn(currentGameState, 'getPlayers').mockImplementation(() => {
        const players = new Players();
        players.addPlayer(Player.createRandomPlayer());

        playerService.savePlayers(players.players[0].name, players.players[0].email);
        const villain = playerService.createVillain();

        return players;
    });
});

Vitest.test('DrunkenTavern should be properly initialized', async () => {
    const dkt = await DrunkenTavern.create();
    Vitest.expect(dkt).not.toBeNull();
    Vitest.expect(dkt.getCarouselItem()).not.toBeNull();
});

Vitest.test('DrunkenTavern should handle click events on challenge buttons', async () => {
    const dkt = await DrunkenTavern.create();
    dkt.initializeRandomPlayerPicker();

    Vitest.expect(dkt).not.toBeNull();
    Vitest.expect(dkt.getCarouselItem()).not.toBeNull();

    const btnSTR = must(dkt.getCarouselItem().querySelector<HTMLElement>('#btnSTR'));
    Vitest.expect(btnSTR).not.toBeNull();

    btnSTR.click();
    Vitest.expect(gameStateMock).toHaveBeenCalledTimes(1);
    Vitest.expect(currentGameState.getDtkVillain()).not.toBeNull();
    Vitest.expect(currentGameState.getPlayers()).not.toBeNull();
});

Vitest.test('DrunkenTavern should handle click events when clicked element is not a challenge button', async () => {
    const dkt = await DrunkenTavern.create();
    Vitest.expect(dkt).not.toBeNull();
    Vitest.expect(dkt.getCarouselItem()).not.toBeNull();
    const nonButtonElement = must(dkt.getCarouselItem().querySelector<HTMLElement>('#divDrunkenTavernVillain'));

    const gameStateMock = Vitest.vi.spyOn(currentGameState, 'getPlayers').mockImplementation(() => {
        return null; // This should not be called in this test
    });

    nonButtonElement.click();

    Vitest.expect(gameStateMock).not.toHaveBeenCalled();
});