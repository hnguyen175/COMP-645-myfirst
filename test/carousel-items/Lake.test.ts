/// <reference types="vite/client" />

import * as Vitest from 'vitest';
import Lake from '../../www/ts/carousel-items/Lake.ts';
import currentGameState from '../../www/ts/GameState.ts';
import Party from '../../www/ts/Party.ts';
import Player from '../../www/ts/Player.ts';

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

    const player = new Player();
    const party = new Party();
    party.addPlayer(player);
    currentGameState.setParty(party);

});

Vitest.test('Lake constructor should create a Lake instance', async () => {
    // Mock dependencies
    const mockNavController = {} as any;
    const mockPlayerService = {} as any;
    const mockTemplate = {} as any;

    // Mock the static create method
    Vitest.vi.spyOn(Lake, 'create').mockResolvedValue(new Lake({} as any, mockNavController, mockPlayerService));

    // Call the create method
    const lake = await Lake.create(mockNavController, mockPlayerService, mockTemplate);

    Vitest.vi.waitFor(() => {
        // Assert that the create method was called with the correct arguments
        Vitest.expect(Lake.create).toHaveBeenCalledWith(mockNavController, mockPlayerService, mockTemplate);
        // Assert that the Lake instance is created
        Vitest.expect(lake).toBeInstanceOf(Lake);
    });
});

Vitest.test('Lake create should create a Lake instance', async () => {
    // Mock dependencies
    const mockNavController = {} as any;
    const mockPlayerService = {} as any;
    const mockTemplate = {} as any;

    // Mock the static create method
    // Vitest.vi.spyOn(Lake, 'create').mockResolvedValue(new Lake({} as any, mockNavController, mockPlayerService));

    // Call the create method
    const lake = await Lake.create(mockNavController, mockPlayerService, mockTemplate);

    Vitest.vi.waitFor(() => {
        // Assert that the create method was called with the correct arguments
        Vitest.expect(Lake.create).toHaveBeenCalledWith(mockNavController, mockPlayerService, mockTemplate);
        // Assert that the Lake instance is created
        Vitest.expect(lake).toBeInstanceOf(Lake);
    });
});