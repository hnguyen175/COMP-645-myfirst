import * as Vitest from 'vitest';
import NavController from '../www/ts/NavController';
import PlayerService from '../www/ts/PlayerService';
import Players from '../www/ts/Players';
import PlayerView from '../www/ts/rendering/PlayerView';
import type { OnsCarouselElement as CarouselElement } from '../www/lib/onsenui';

import loadGameHtml from '../www/views/load-game.html?raw';
import newGameHtml from '../www/views/new-game.html?raw';
import playersHtml from '../www/views/players.html?raw';

const toastMock = Vitest.vi.fn().mockResolvedValue(undefined);

let navController : NavController = null as unknown as NavController;
let playerService : PlayerService = null as unknown as PlayerService;
let playerView : PlayerView = null as unknown as PlayerView;

Vitest.beforeEach(async () => {
    playerService = new PlayerService();
    playerView = new PlayerView();
    navController = new NavController(playerService, playerView);

    Vitest.vi.stubGlobal('ons', {
        notification: {
            toast: toastMock
        }
    });

    // Clear the document body before each test
    document.body.innerHTML = '';
    localStorage.clear();

    Vitest.vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        if (url === "../views/new-game.html") {
            return new Response(newGameHtml);
        }
        if (url === "../views/load-game.html") {
            return new Response(loadGameHtml);
        }
        throw new Error(`Unexpected fetch URL: ${url}`);
    });
    Vitest.vi.stubGlobal("ons", {
        createElement: Vitest.vi.fn((htmlString: string) => {
            const template = document.createElement("template");
            template.innerHTML = htmlString.trim();
            return template.content.firstElementChild! as HTMLElement;
        })
    });

});

Vitest.test("showSection displays the correct section and hides others", () => {
    // Create mock sections
    const section1 = document.createElement('section');
    section1.id = 'section1';
    section1.style.display = 'none';
    document.body.appendChild(section1);

    const section2 = document.createElement('section');
    section2.id = 'section2';
    section2.style.display = 'none';
    document.body.appendChild(section2);

    // Call the function
    NavController.showSection('section1');

    // Assert the correct behavior
    Vitest.expect(section1.style.display).toBe('block');
    Vitest.expect(section2.style.display).toBe('none');
});

Vitest.test("showSection logs an error if no sections are found", () => {
    // Spy on console.error
    const consoleErrorSpy = Vitest.vi.spyOn(console, 'error').mockImplementation(() => {});
    NavController.showSection('section1');
    Vitest.expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
});

Vitest.test("onCarouselPriorDisplayingItem prior displaying players", () => {
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
        <ons-carousel-item id="caiWelcome">
        </ons-carousel-item>
        <ons-carousel-item id="caiPlayers">
        <ons-card id="playerCards"></ons-card>
        </ons-carousel-item>
        </ons-carousel>

        <input type="text" id="inputPlayerName" value="John Doe" />
        <input type="text" id="inputPlayerEmail" value="john.doe@example.com" />
    `;

    const carousel = document.getElementById("carouselNewGame") as unknown as HTMLElement;

    const event = new Event('prechange');
    Object.assign(event, {
        carousel,
        activeIndex: 1,
    });

    const playerServiceSpy = Vitest.vi.spyOn(playerService, 'activePlayers', 'get').mockImplementation(() => {
        return new Players();
    });

    const renderPlayerCardsSpy = Vitest.vi.spyOn(playerView, 'renderPlayerCards').mockImplementation(() => {});

    navController.onCarouselPriorDisplayingItem(event);

    Vitest.expect(renderPlayerCardsSpy).toHaveBeenCalledOnce();
});

Vitest.test("onCarouselPriorDisplayingItem prior displaying players with no active players", () => {
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
        <ons-carousel-item id="caiWelcome">
        </ons-carousel-item>
        <ons-carousel-item id="caiPlayers">
        <ons-card id="playerCards"></ons-card>
        </ons-carousel-item>
        </ons-carousel>
`;
    const carousel = document.getElementById("carouselNewGame") as unknown as HTMLElement;
    const event = new Event('prechange');
    Object.assign(event, {
        carousel,
        activeIndex: 1,
    });

    const playerServiceSpy = Vitest.vi.spyOn(playerService, 'activePlayers', 'get').mockImplementation(() => {
        return null;
    });
    const renderPlayerCardsSpy = Vitest.vi.spyOn(playerView, 'renderPlayerCards').mockImplementation(() => {});

    navController.onCarouselPriorDisplayingItem(event);

    Vitest.expect(renderPlayerCardsSpy).not.toHaveBeenCalled();
});

Vitest.test("onCarouselPriorDisplayingItem prior displaying Welcome", () => {
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
        <ons-carousel-item id="caiWelcome">
        </ons-carousel-item>
        <ons-carousel-item id="caiPlayers">
        </ons-carousel-item>
        </ons-carousel>

        <input type="text" id="inputPlayerName" value="John Doe" />
        <input type="text" id="inputPlayerEmail" value="john.doe@example.com" />
    `;

    const carousel = document.getElementById("carouselNewGame") as unknown as HTMLElement;

    const event = new Event('prechange');
    Object.assign(event, {
        carousel,
        activeIndex: 0,
    });

    Vitest.vi.spyOn(playerService, 'savePlayers').mockImplementation((name: string, email: string) : Players => {return new Players();});
    const consoleErrorSpy = Vitest.vi.spyOn(console, 'error').mockImplementation(() => {});

    navController.onCarouselPriorDisplayingItem(event);

    Vitest.expect(playerService.savePlayers).not.toHaveBeenCalled();
    Vitest.expect(consoleErrorSpy).not.toHaveBeenCalled();
});

Vitest.test("onCarouselNewGame navigates to next carousel item", async () => {
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
        </ons-carousel>
        <ons-button class="btn js-load-game" id="btnNewGame">New Game</ons-button>
        `;
    await navController.init();
    await navController.loadCarouselItem([navController.newGame]);

    const carousel = document.getElementById("carouselNewGame") as unknown as CarouselElement;
    Object.defineProperty(carousel, 'next', {
        value: Vitest.vi.fn(),
    });

    const btnNewGame = document.getElementById("btnNewGame") as unknown as HTMLElement;
    btnNewGame.addEventListener(
        "click",
        async () => navController.onCarouselNewGame()
    );

    await btnNewGame.click();

    Vitest.expect(carousel.next).toHaveBeenCalledOnce();
});

Vitest.test("Carousel element is not found during init throws an error", async () => {
    document.body.innerHTML = `
        <ons-card>
            <ons-button class="btn js-load-game" id="btnNewGame">New Game</ons-button>
        </ons-card>
        `;
    Vitest.vi.spyOn(console, 'error').mockImplementation(() => {});

    await Vitest.expect(navController.init()).rejects.toThrow("Carousel element not found.");
});

Vitest.test("onRollButtonClick with invalid player info shows toast notification", async () => {
    const playerViewMock = {
        showValidationToast: Vitest.vi.fn().mockResolvedValue(undefined)
    };
    const navController = new NavController(playerService, playerViewMock as unknown as PlayerView);

    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
            <ons-carousel-item id="caiWelcome">
                <h2>Welcome</h2>
            </ons-carousel-item>
            <ons-carousel-item id="caiPlayers">
                <h2>Players</h2>
            </ons-carousel-item>
            <ons-carousel-item id="caiNewGame">
                <h2>New Game</h2>
            </ons-carousel-item>
        </ons-carousel>
        <ons-button class="btn js-roll" id="btnRoll">Roll</ons-button>
        <input id="inputPlayerName">
        <input id="inputPlayerEmail" value="john.doe.example.com">
    `;

    navController.init();

    await navController.onRollButtonClick();

    Vitest.expect(
        playerViewMock.showValidationToast.mock.calls.map(
            ([input, message]) => [input.id, message]
        )
    ).toEqual([
        ["inputPlayerName", "Player name is required."],
        ["inputPlayerEmail", "Invalid email format."]
    ]);
});

Vitest.test("onRollButtonClick with missing input fields logs an error and does not call toast", async () => {
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>   
        <ons-carousel-item id="caiWelcome">
            <h2>Welcome</h2>
        </ons-carousel-item>
        <ons-carousel-item id="caiPlayers">
            <h2>Players</h2>
        </ons-carousel-item>
        <ons-carousel-item id="caiNewGame">
            <h2>New Game</h2>
        </ons-carousel-item>
    </ons-carousel>
    <ons-button class="btn js-roll" id="btnRoll">Roll</ons-button>
    `;

    navController.init();

    const btnRoll = document.getElementById("btnRoll") as unknown as HTMLElement;
    btnRoll.addEventListener(
        "click",
        () => navController.onRollButtonClick()
    );

    Vitest.vi.spyOn(console, 'error').mockImplementation(() => {});

    btnRoll.click();

    Vitest.expect(console.error).toHaveBeenCalled();
    Vitest.expect(toastMock).not.toHaveBeenCalled();
});

Vitest.test.each([
    ["", "Player email is required."],
    ["John Doe", "Invalid email format."]
])("onRollButtonClick with %s email and %s validation message shows appropriate toast", async (email, expectedMessage) => {
// Vitest.test("onRollButtonClick with valid name, invalid email shows toast for email only", async () => {
    const playerViewMock = {
        showValidationToast: Vitest.vi.fn().mockResolvedValue(undefined)
    };
    const navController = new NavController(playerService, playerViewMock as unknown as PlayerView);
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
            <ons-carousel-item id="caiWelcome">
                <h2>Welcome</h2>
            </ons-carousel-item>
            <ons-carousel-item id="caiPlayers">
                <h2>Players</h2>
            </ons-carousel-item>
            <ons-carousel-item id="caiNewGame">
                <h2>New Game</h2>
            </ons-carousel-item>
        </ons-carousel>
        <ons-button class="btn js-roll" id="btnRoll">Roll</ons-button>
        <input id="inputPlayerName" value="John Doe">
        <input id="inputPlayerEmail" value="${email}">
    `;

    navController.init();

    await navController.onRollButtonClick(new Event('click'));

    Vitest.expect(playerViewMock.showValidationToast).toHaveBeenCalledWith(
        document.getElementById("inputPlayerEmail"),
        expectedMessage
    );
});

Vitest.test("onRollButtonClick with %s email and %s vaildation message shows appropriate toast", async () => {
    const playerViewMock = {
        showValidationToast: Vitest.vi.fn().mockResolvedValue(undefined)
    };
    const navController = new NavController(playerService, playerViewMock as unknown as PlayerView);
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
            <ons-carousel-item id="caiWelcome">
                <h2>Welcome</h2>
            </ons-carousel-item>
            <ons-carousel-item id="caiPlayers">
                <h2>Players</h2>
            </ons-carousel-item>
            <ons-carousel-item id="caiNewGame">
                <h2>New Game</h2>
            </ons-carousel-item>
        </ons-carousel>
        <ons-button class="btn js-roll" id="btnRoll">Roll</ons-button>
        <input id="inputPlayerName">
        <input id="inputPlayerEmail" value="a@b.c">
    `;

    await navController.init();

    await navController.onRollButtonClick();

    Vitest.expect(playerViewMock.showValidationToast).toHaveBeenCalledWith(
        document.getElementById("inputPlayerName"),
        "Player name is required."
    );
});

Vitest.test("onLoadGameButtonClick with no lstPlayers element throw error", async () => {
    document.body.innerHTML = `
    `;
    navController.onLoadGameButtonClick();
    await Vitest.expect(navController.onLoadGameButtonClick()).rejects.toThrow();
});

Vitest.test("onLoadGameButtonClick with lstPlayers element but no selected value logs an error", async () => {
    document.body.innerHTML = `
        <ons-select id="lstPlayers">
            <select>
                <option value="">Select a player</option>
            </select>
        </ons-select>
    `;
    const consoleErrorSpy = Vitest.vi.spyOn(console, 'error').mockImplementation(() => {});

    await navController.onLoadGameButtonClick();

    Vitest.expect(consoleErrorSpy).toHaveBeenCalled();
});

// Vitest.test("onLoadGameButtonClick with lstPlayers element and selected value calls loadPlayers", async () => {
//     document.body.innerHTML = `
//     <carousel id="carouselNewGame" swipeable auto-scroll>
//         <select id="lstPlayers">
//                 <option value="a@b.c" selected>a@b.c</option>
//         </select>
//     </carousel>
//     `;
//     navController.init();
//     // document.getElementById("lstPlayers")?.querySelector("select")?.setAttribute("value", "a@b.c");

//     const carousel = document.getElementById("carouselNewGame") as unknown as CarouselElement;

//     const swipeableSetter = Vitest.vi.fn();
//     Object.defineProperties(carousel, {
//         swipeable: {
//             set: swipeableSetter
//         },
//         'next': {
//         value: Vitest.vi.fn()
//         }
//     });

//     const playerServiceMock = Vitest.vi.spyOn(playerService, 'loadPlayers').mockImplementation((email: string) : Players | null => {
//         return new Players();
//     });

//     await navController.onLoadGameButtonClick();

//     Vitest.expect(playerServiceMock).toHaveBeenCalledWith("a@b.c");
//     Vitest.expect(swipeableSetter).toHaveBeenCalledWith(true);
//     Vitest.expect(carousel.next).toHaveBeenCalledOnce();
// });

Vitest.test("onReloadButtonClick calls loadCarouselItems and navigates to next item", async () => {
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
            <ons-carousel-item id="caiWelcome">
                <h1>Welcome</h1>
            </ons-carousel-item>
        </ons-carousel>
    `;
    await navController.init();

    const loadCarouselItemsMock = Vitest.vi.spyOn(navController, 'loadCarouselItems').mockResolvedValue(undefined);
    const carousel = document.getElementById("carouselNewGame") as unknown as CarouselElement;
    const nextMock = Vitest.vi.fn();
    Object.defineProperty(carousel, 'next', {
        value: nextMock
    });

    await navController.onReloadButtonClick();

    Vitest.expect(nextMock).toHaveBeenCalledOnce();
});

Vitest.test("loadCarouselItems removes all carousel items except welcome", async () => {
    document.body.innerHTML = `
        <ons-carousel id="carouselNewGame" swipeable auto-scroll>
            <ons-carousel-item id="caiWelcome">
                <h1>Welcome</h1>
            </ons-carousel-item>
        </ons-carousel>
    `;
            // <ons-carousel-item id="caiWelcome">
            //     <h1>Welcome</h1>
            // </ons-carousel-item>
            // <ons-carousel-item id="caiLoadGame">
            //     <h1>Load Game</h1>
            // </ons-carousel-item>
            // <ons-carousel-item id="caiPlayers">
            //     <h1>Players</h1>
            // </ons-carousel-item>
    await navController.init();

    // Vitest.vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
    //     if (url === "views/load-game.html") {
    //         return new Response(loadGameHtml);
    //     }
    //     if (url === "views/players.html") {
    //         return new Response(playersHtml);
    //     }
    //     throw new Error(`Unexpected fetch URL: ${url}`);
    // });

    // Object.assign(ons, {
    //     createElement: Vitest.vi.fn().mockImplementation((htmlString: string) => {
    //         const template = document.createElement("template");
    //         template.innerHTML = htmlString.trim();

    //         return template.content.firstElementChild!;
    //     })
    // });
    const carousel = document.getElementById("carouselNewGame") as unknown as CarouselElement;

    // await navController.loadCarouselItems([
    //     "views/load-game.html",
    //     "views/players.html"
    // ]);
    await navController.loadCarouselItem([
        navController.newGame,
        navController.loadGame
    ]);

    const items = carousel.querySelectorAll("ons-carousel-item");
    Vitest.expect(items.length).toBe(3); // welcome + 2 new items
    Vitest.expect(fetch).toHaveBeenCalledTimes(2);
});