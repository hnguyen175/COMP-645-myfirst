import * as Vitest from 'vitest';
import PlayerService from '../www/ts/PlayerService';
import Player from '../www/ts/Player';

let playerService: PlayerService;
Vitest.beforeEach(() => {
    playerService = new PlayerService();
    localStorage.clear();
});

Vitest.test("savePlayers saves a player to session storage", () => {
    const name = "John Doe";
    const email = "john.doe@somewhere.com";
    playerService.savePlayers(name, email);

    const savedPlayers = PlayerService.loadPlayers(email);

    Vitest.expect(savedPlayers).not.toBeNull();
    Vitest.expect(savedPlayers?.players[0]?.name).toBe(name);
    Vitest.expect(savedPlayers?.players[0]?.email).toBe(email);
});

// Vitest.test("loadMainPlayer returns null when no player is saved", () => {
//     const player = playerService.loadMainPlayer();
//     Vitest.expect(player).toBeNull();
// });

// Vitest.test("loadMainPlayer returns the saved player", () => {
//     const name = "John Doe";
//     const email = "john.doe@somewhere.com";
//     playerService.savePlayers(name, email);
//     const player = playerService.loadMainPlayer();
//     Vitest.expect(player).not.toBeNull();
//     Vitest.expect(player?.name).toBe(name);
//     Vitest.expect(player?.email).toBe(email);
// });