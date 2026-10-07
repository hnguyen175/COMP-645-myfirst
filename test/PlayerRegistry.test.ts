import * as Vitest from 'vitest';
import playerRegistry from '../www/ts/PlayerRegistry.ts';
import { emailsKey } from '../www/ts/PlayerRegistry.ts';

Vitest.describe('PlayerRegistry', () => {
    Vitest.beforeEach(async () => {
        Vitest.vi.restoreAllMocks();
        Vitest.vi.resetModules();
        localStorage.clear();
    });

    Vitest.test('addEmail adds a new player email to the set', async () => {
        const module = await import('../www/ts/PlayerRegistry');
        const playerRegistry = module.default;

        const email = 'a@b.c';
        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        playerRegistry.addEmail(email);

        const allPlayersList = playerRegistry.getEmails();
        Vitest.expect(allPlayersList).toContain(email);
        Vitest.expect(setItemSpy).toHaveBeenCalledOnce();
        Vitest.expect(setItemSpy).toHaveBeenCalledWith(emailsKey, JSON.stringify([email]));
    });

    Vitest.test('addEmail moves a player email to the end of the set if it already exists', async () => {
        const email = 'b@c.d';
        localStorage.setItem(emailsKey, JSON.stringify([email, 'do@not.repeat']));
        const module = await import('../www/ts/PlayerRegistry');
        const playerRegistry = module.default;

        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        let allPlayersList = playerRegistry.getEmails();
        Vitest.expect(allPlayersList.length).toBe(2);
        Vitest.expect(allPlayersList.indexOf(email)).toBe(0);

        playerRegistry.addEmail(email);

        Vitest.expect(setItemSpy).toHaveBeenCalledOnce();

        allPlayersList = playerRegistry.getEmails();
        Vitest.expect(allPlayersList.length).toBe(2);
        Vitest.expect(allPlayersList.indexOf(email)).toBe(1);
    });

    Vitest.test('removeEmail removes a player email from the set', async () => {
        const email = 'b@c.d';
        localStorage.setItem(emailsKey, JSON.stringify([email, 'do@not.repeat']));
        const module = await import('../www/ts/PlayerRegistry');
        const playerRegistry = module.default;
        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        let allPlayersList = playerRegistry.getEmails();
        Vitest.expect(allPlayersList.length).toBe(2);

        playerRegistry.removeEmail(email);

        Vitest.expect(setItemSpy).toHaveBeenCalledOnce();

        allPlayersList = playerRegistry.getEmails();
        Vitest.expect(allPlayersList.length).toBe(1);
        Vitest.expect(allPlayersList).not.toContain(email);
    });

    Vitest.test('removeEmail does nothing if the player email does not exist in the set', async () => {
        const email = 'b@c.d';
        localStorage.setItem(emailsKey, JSON.stringify(['a@b.c', 'd@e.f']));
        const module = await import('../www/ts/PlayerRegistry');
        const playerRegistry = module.default;
        const setItemSpy = Vitest.vi.spyOn(Storage.prototype, 'setItem');

        playerRegistry.removeEmail(email);

        Vitest.expect(setItemSpy).not.toHaveBeenCalled();
        Vitest.expect(playerRegistry.getEmails().length).toBe(2);
    });
});