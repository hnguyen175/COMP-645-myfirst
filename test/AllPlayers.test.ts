import * as Vitest from 'vitest';

Vitest.describe('AllPlayers', () => {
    Vitest.beforeEach(() => {
        Vitest.vi.restoreAllMocks();
        Vitest.vi.resetModules();
        localStorage.clear();
    });

    Vitest.test('addPlayer adds a new player email to the set', async () => {
        const module = await import('../www/ts/AllPlayers');
        const allPlayers = module.default;

        const email = 'a@b.c';
        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        allPlayers.addPlayer(email);

        const allPlayersList = allPlayers.getAllPlayers();
        Vitest.expect(allPlayersList).toContain(email);
        Vitest.expect(setItemSpy).toHaveBeenCalledOnce();
        Vitest.expect(setItemSpy).toHaveBeenCalledWith('lsAllPlayers', JSON.stringify([email]));
    });

    Vitest.test('addPlayer does not add a duplicate player email to the set', async () => {
        const email = 'b@c.d';
        localStorage.setItem('lsAllPlayers', JSON.stringify(['do@not.repeat', email]));
        const module = await import('../www/ts/AllPlayers');
        const allPlayers = module.default;

        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        allPlayers.addPlayer(email);
        Vitest.expect(setItemSpy).not.toHaveBeenCalled();

        const allPlayersList = allPlayers.getAllPlayers();
        Vitest.expect(allPlayersList.filter(e => e === email).length).toBe(1);
    });
});