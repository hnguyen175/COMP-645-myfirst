/// <reference types="vite/client" />

import * as Vitest from 'vitest';
import Lake from '../../www/ts/carousel-items/Lake';
import currentGameState from '../../www/ts/GameState';
import Party from '../../www/ts/Party';
import Player from '../../www/ts/Player';
import PlayerView from '../../www/ts/rendering/PlayerView';
import must from '../../www/ts/utilities/RequiredField';

Vitest.beforeEach(() => {
    Vitest.vi.resetAllMocks();
    Vitest.vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
        const lake = await import('../../www/views/lake.html?raw');
        return new Response(lake.default);
    });

    Vitest.vi.stubGlobal('ons', {
        createElement: Vitest.vi.fn((html: string) => {
            const template = document.createElement('template');
            template.innerHTML = html.trim();
            return template.content.firstElementChild as HTMLElement;
        })
    });

    const player1 = new Player(null, null, null, {
        hp: 50,
        str: 50,
        spd: 50,
        mp: 50,
        luk: 50,
        wep: Player.randomWeapon(),
        cls: Player.randomClass()
    });
    const player2 = new Player(null, null, null, {
        hp: 50,
        str: 50,
        spd: 50,
        mp: 50,
        luk: 50,
        wep: Player.randomWeapon(),
        cls: Player.randomClass()
    });
    const party = new Party();
    party.addPlayer(player1);
    party.addPlayer(player2);
    currentGameState.setParty(party);
});

Vitest.test('Lake constructor should create a Lake instance', async () => {
    // Mock dependencies
    const mockNavController = {} as any;
    const mockPlayerService = {} as any;
    const mockTemplate = {} as any;

    // Mock the static create method
    Vitest.vi.spyOn(Lake, 'create').mockResolvedValue(new Lake({} as any, mockNavController, mockPlayerService, new PlayerView(), new Player()));

    // Call the create method
    const lake = await Lake.create(mockNavController, mockPlayerService, mockTemplate);

    Vitest.vi.waitFor(() => {
        // Assert that the create method was called with the correct arguments
        Vitest.expect(Lake.create).toHaveBeenCalledWith(mockNavController, mockPlayerService, mockTemplate);
        // Assert that the Lake instance is created
        Vitest.expect(lake).toBeInstanceOf(Lake);
    });
});

Vitest.test.each([
    [51],
    [100],
    [150]
])('Lake battle with %i HP mini-boss', async (miniBossHp) => {
    // Mock dependencies
    const mockNavController = {} as any;
    const mockPlayerService = {} as any;
    const mockTemplate = {} as any;
    const miniBoss = new Player(null, null, null, {
        hp: miniBossHp,
        str: Player.randomStat(),
        spd: Player.randomStat(),
        mp: Player.randomMp(),
        luk: Player.randomLuk(),
        wep: "Evil " + Player.randomWeapon(),
        cls: "Dark " + Player.randomClass()
    });

    // Call the create method
    const lake = await Lake.create(mockNavController, mockPlayerService, mockTemplate, miniBoss);

    Vitest.vi.waitFor(() => {
        // Assert that the create method was called with the correct arguments
        // Vitest.expect(Lake.create).toHaveBeenCalledWith(mockNavController, mockPlayerService, mockTemplate, miniBoss);
        // Assert that the Lake instance is created
        Vitest.expect(lake).toBeInstanceOf(Lake);
    });

    const gameParty = must(currentGameState.getParty());
    const initialMiniBossHp = miniBoss.hp;
    const initialPlayerHP = gameParty.players[0].hp;

    // Click the first attack button
    const buttons = lake.carouselItem.querySelectorAll<HTMLElement>('ons-button');
    Vitest.expect(buttons.length).toBeGreaterThan(0);
    buttons[0].click();

    Vitest.vi.waitFor(() => {
        // Assert that the attack button is disabled
        Vitest.expect(buttons[0].hasAttribute('disabled')).toBe(true);
    });

    Vitest.expect(miniBoss.hp).toBe(initialMiniBossHp - gameParty.players[0].str); // boss' HP - player's str (50) = 1
    Vitest.expect(gameParty.players[0].hp).toBe(initialPlayerHP - Math.floor(initialPlayerHP * 0.1)); // player's HP reduced by 10%

    // ensure the ons-list-item has 'row-flash' style applied to it
    const playerStatCell = lake.carouselItem.querySelector('ons-list-item[data-property="hp"]');
    Vitest.expect(playerStatCell?.classList.contains('row-flash')).toBe(true);

    // also esure boss' ons-list-item has 'row-flash' style applied to it
    const bossStatCell = [...lake.carouselItem.querySelectorAll('ons-list-item[data-property="hp"]')].at(-1);
    Vitest.expect(bossStatCell?.classList.contains('row-flash')).toBe(true);

    // verify #pLakeResult has the correct text content
    const resultElement = lake.carouselItem.querySelector('#pLakeResult');
    Vitest.expect(resultElement?.textContent).toContain('Keep fighting');
});

Vitest.test.each([
    [51],
    [150]
] as const)('Lake battle with %i HP mini-boss and multiple players', async (miniBossHp) => {
    // Mock dependencies
    const mockNavController = {} as any;
    const mockPlayerService = {} as any;
    const mockTemplate = {} as any;
    const miniBoss = new Player(null, null, null, {
        hp: miniBossHp,
        str: Player.randomStat(),
        spd: Player.randomStat(),
        mp: Player.randomMp(),
        luk: Player.randomLuk(),
        wep: "Evil " + Player.randomWeapon(),
        cls: "Dark " + Player.randomClass()
    });

    // Call the create method
    const lake = await Lake.create(mockNavController, mockPlayerService, mockTemplate, miniBoss);

    Vitest.vi.waitFor(() => {
        // Assert that the create method was called with the correct arguments
        // Vitest.expect(Lake.create).toHaveBeenCalledWith(mockNavController, mockPlayerService, mockTemplate, miniBoss);
        // Assert that the Lake instance is created
        Vitest.expect(lake).toBeInstanceOf(Lake);
    });

    const gameParty = must(currentGameState.getParty());
    const initialMiniBossHp = miniBoss.hp;
    const initialPlayerHP = gameParty.players[0].hp;

    // Click the first attack button
    const buttons = lake.carouselItem.querySelectorAll<HTMLElement>('ons-button');
    Vitest.expect(buttons.length).toBeGreaterThan(0);
    buttons[0].click();
    // 2nd attack
    buttons[1].click();

    Vitest.vi.waitFor(() => {
        // Assert that the attack button is disabled
        Vitest.expect(buttons[0].hasAttribute('disabled')).toBe(true);
        Vitest.expect(buttons[1].hasAttribute('disabled')).toBe(true);
    });

    const resultElement = lake.carouselItem.querySelector('#pLakeResult');

    // players' strengths win out
    if (miniBossHp < 100) {
        Vitest.expect(miniBoss.hp).toBe(0);
        // verify #pLakeResult has the correct text content
        Vitest.expect(resultElement?.textContent).toContain('You defeated the');
    } else { // mini-boss' HP is still above 0
        // verify #pLakeResult has the correct text content
        Vitest.expect(resultElement?.textContent).toContain('All your party members have attacked!');
        Vitest.expect(gameParty.players[0].hp).toBe(initialPlayerHP - Math.floor(initialPlayerHP * 0.1));
        Vitest.expect(gameParty.players[1].hp).toBe(initialPlayerHP - Math.floor(initialPlayerHP * 0.1));
    }
});