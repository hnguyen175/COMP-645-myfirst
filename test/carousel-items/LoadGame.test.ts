import * as Vitest from "vitest";
import LoadGame from "../../www/ts/carousel-items/LoadGame";

Vitest.beforeAll(async () => {
    // Set up the DOM environment for testing
    Vitest.vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        if (url.toString().endsWith("load-game.html")) {
            const loadGameHtml = await import("../../www/views/load-game.html?raw");
            return new Response(loadGameHtml.default);
        }
        throw new Error("DOM environment setup is not implemented yet.");
    });

    Vitest.vi.stubGlobal("ons", {
        createElement: (html: string) => {
            const template = document.createElement("template");
            template.innerHTML = html.trim();
            return template.content.firstElementChild as HTMLElement;
        }
    });
});

Vitest.test("LoadGame should be properly initialized", async () => {
    const navControllerMock = {
        onLoadGameButtonClick: Vitest.vi.fn(),
    }

    const playerServiceMock = {
        listPlayersFromStorage: Vitest.vi.fn(() => ["Player1", "Player2"]),
    }

    const loadGame = await LoadGame.create(navControllerMock as any, playerServiceMock as any);
    Vitest.expect(loadGame).not.toBeNull();

    (loadGame.getCarouselItem().querySelector("#btnLoadGame") as HTMLButtonElement).click();
    Vitest.expect(navControllerMock.onLoadGameButtonClick).toHaveBeenCalled();

    // Check the player selection
    const listPlayers = loadGame.getCarouselItem().querySelector<ons.OnsSelectElement>("#selPlayers");
    Vitest.expect(listPlayers).not.toBeNull();
    Vitest.expect(listPlayers!.options.length).toBe(3); // 2 players + 1 disabled option

    // Simulate selecting a player
    listPlayers!.selectedIndex = 1;
    listPlayers!.dispatchEvent(new Event("change", { bubbles: true }));

    const btnLoadGame = loadGame.getCarouselItem().querySelector("#btnLoadGame");
    Vitest.expect(btnLoadGame).not.toBeNull();
    Vitest.expect(btnLoadGame!.disabled).toBe(true);

    // Simulate clicking the carousel item to ensure no additional calls are made
    (loadGame.getCarouselItem()).click();
    Vitest.expect(navControllerMock.onLoadGameButtonClick).not.toHaveBeenCalledTimes(2);

    // simulate change event on the carousel item to ensure no additional calls are made
    (loadGame.getCarouselItem()).dispatchEvent(new Event("change", { bubbles: true }));
    Vitest.expect(navControllerMock.onLoadGameButtonClick).not.toHaveBeenCalledTimes(2);
});