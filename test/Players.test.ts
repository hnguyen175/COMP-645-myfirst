import * as Vitest from 'vitest';

import Players from '../www/ts/Players';
import Player from '../www/ts/Player';
import PlayerService from '../www/ts/PlayerService';

Vitest.beforeEach(() => {
    localStorage.clear();
});

Vitest.test("addPlayer adds a player to the players array", () => {
    const players = new Players();
    const player = Player.getDefaultPlayer();
    players.addPlayer(player);
    Vitest.expect(players.players.length).toBe(1);
    Vitest.expect(players.players[0]).toEqual(player);
});

Vitest.test("addDefaultPlayers adds two default players to the players array", () => {
    const players = new Players();
    players.addDefaultPlayers();
    Vitest.expect(players.players.length).toBe(2);
});

Vitest.test("savePlayersToSessionStorage saves players to session storage", () => {
    const players = new Players();
    const player1 = Player.getDefaultPlayer();
    const player2 = Player.getDefaultPlayer();
    players.addPlayer(player1);
    players.addPlayer(player2);
    players.savePlayersToSessionStorage();
    // const savedPlayers = localStorage.getItem("players");
    const savedPlayers = PlayerService.loadPlayers(player1.email);
    Vitest.expect(savedPlayers).not.toBeNull();
    Vitest.expect(savedPlayers!.players.length).toBe(2);
    Vitest.expect(savedPlayers!.players[0]).toEqual(player1);
    Vitest.expect(savedPlayers!.players[1]).toEqual(player2);
});

Vitest.test("loadPlayersFromSessionStorage loads players from session storage", () => {
    const players = new Players();
    const player1 = Player.getDefaultPlayer();
    const player2 = Player.getDefaultPlayer();
    players.addPlayer(player1);
    players.addPlayer(player2);
    players.savePlayersToSessionStorage();
    const newPlayers = PlayerService.loadPlayers(player1.email) as Players;
    Vitest.expect(newPlayers.players.length).toBe(2);
    Vitest.expect(newPlayers.players[0]).toEqual(player1);
    Vitest.expect(newPlayers.players[1]).toEqual(player2);
});

Vitest.test("loadPlayersFromSessionStorage does not throw error when no players are saved", () => {
    Vitest.expect(() => PlayerService.loadPlayers("nonexistent@example.com")).not.toThrow();
    const players = PlayerService.loadPlayers("nonexistent@example.com");
    Vitest.expect(players).toBeNull();
});

Vitest.test("loadPlayersFromSessionStorage from invalid JSON does not throw error", () => {
    localStorage.setItem("nonexistent@example.com", "[]");
    Vitest.expect(() => Players.loadPlayersFromSessionStorage("nonexistent@example.com")).not.toThrow();
});