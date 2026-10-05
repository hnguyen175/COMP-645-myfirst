import * as Vitest from 'vitest';

let allPlayers: any;
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

    Vitest.test('addPlayer moves a player email to the end of the set if it already exists', async () => {
        const email = 'b@c.d';
        localStorage.setItem('lsAllPlayers', JSON.stringify([email, 'do@not.repeat']));
        const module = await import('../www/ts/AllPlayers');
        const allPlayers = module.default;

        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        let allPlayersList = allPlayers.getAllPlayers();
        Vitest.expect(allPlayersList.length).toBe(2);
        Vitest.expect(allPlayersList.indexOf(email)).toBe(0);

        allPlayers.addPlayer(email);

        Vitest.expect(setItemSpy).toHaveBeenCalledOnce();

        allPlayersList = allPlayers.getAllPlayers();
        Vitest.expect(allPlayersList.length).toBe(2);
        Vitest.expect(allPlayersList.indexOf(email)).toBe(1);
    });

    Vitest.test('removePlayer removes a player email from the set', async () => {
        const email = 'b@c.d';
        localStorage.setItem('lsAllPlayers', JSON.stringify([email, 'do@not.repeat']));

        const module = await import('../www/ts/AllPlayers');
        const allPlayers = module.default;
        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        let allPlayersList = allPlayers.getAllPlayers();
        Vitest.expect(allPlayersList.length).toBe(2);

        allPlayers.removePlayer(email);

        Vitest.expect(setItemSpy).toHaveBeenCalledOnce();

        allPlayersList = allPlayers.getAllPlayers();
        Vitest.expect(allPlayersList.length).toBe(1);
        Vitest.expect(allPlayersList).not.toContain(email);
    });

    Vitest.test('removePlayer does nothing if the player email does not exist in the set', async () => {
        const email = 'b@c.d';
        localStorage.setItem('lsAllPlayers', JSON.stringify(['a@b.c', 'd@e.f']));
        const module = await import('../www/ts/AllPlayers');
        const allPlayers = module.default;
        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        allPlayers.removePlayer(email);

        Vitest.expect(setItemSpy).not.toHaveBeenCalled();
        Vitest.expect(allPlayers.getAllPlayers().length).toBe(2);
    });
});