import * as Vitest from 'vitest';
import gameState from '../www/ts/GameState';
import Players from '../www/ts/Players';

Vitest.test('GameState get and set methods', () => {
    const players = gameState.get()?.players;
    Vitest.expect(players).toBeUndefined();

    const newPlayers = new Players();
    gameState.set(newPlayers);
    Vitest.expect(gameState.get()).toBe(newPlayers);
});