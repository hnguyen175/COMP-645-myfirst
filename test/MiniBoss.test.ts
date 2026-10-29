import * as Vitest from "vitest";
import MiniBoss from "../www/ts/MiniBoss";

Vitest.test("MiniBoss constructor initializes properties correctly", () => {
    const miniBoss = new MiniBoss();

    Vitest.expect(miniBoss.hp).toBeGreaterThanOrEqual(50);
    Vitest.expect(miniBoss.str).toBeGreaterThan(0);
    Vitest.expect(miniBoss.spd).toBeGreaterThan(0);
    Vitest.expect(miniBoss.mp).toBeGreaterThan(0);
    Vitest.expect(miniBoss.luk).toBeGreaterThan(0);
    Vitest.expect(miniBoss.wep).toMatch(/^Evil /);
    Vitest.expect(miniBoss.cls).toMatch(/^Dark /);
});