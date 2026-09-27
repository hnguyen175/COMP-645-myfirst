import * as Vitest from "vitest";
import Welcome from "../../www/ts/carousel-items/Welcome";

import welcomeHtml from "../../www/views/welcome.html?raw";
let navControllerMock: any;

Vitest.beforeAll(async () => {
    // Set up the DOM environment for testing
    Vitest.vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        if (url.toString().endsWith("welcome.html")) {
            return new Response(welcomeHtml);
        }
        throw new Error("DOM environment setup is not implemented yet.");
    });

    navControllerMock = {
        onCarouselNewGame: Vitest.vi.fn(),
        onReloadButtonClick: Vitest.vi.fn()
    }

    Vitest.vi.stubGlobal("ons", {
        createElement: (html: string) => {
            const template = document.createElement("template");
            template.innerHTML = html.trim();
            return template.content.firstElementChild as HTMLElement;
        }
    });
});

Vitest.test("Welcome should be properly initialized", async () => {
    const welcome = await Welcome.create(navControllerMock);
    Vitest.expect(welcome).not.toBeNull();

    (welcome.getCarouselItem().querySelector("#btnNewGame") as HTMLButtonElement).click();
    Vitest.expect(navControllerMock.onCarouselNewGame).toHaveBeenCalled();

    (welcome.getCarouselItem().querySelector("#btnReload") as HTMLButtonElement).click();
    Vitest.expect(navControllerMock.onReloadButtonClick).toHaveBeenCalled();

    (welcome.getCarouselItem()).click();
    Vitest.expect(navControllerMock.onCarouselNewGame).not.toHaveBeenCalledTimes(2);
    Vitest.expect(navControllerMock.onReloadButtonClick).not.toHaveBeenCalledTimes(2);
});