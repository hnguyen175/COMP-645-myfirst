import Player, { PlayerStats } from "./Player.ts";

export default class MiniBoss extends Player {
    constructor() {
        super();
        Object.assign(this, MiniBoss.miniBossRandomStats());
    }

    private static miniBossRandomStats(): PlayerStats {
        return {
            hp: Player.randomStat(),
            spd: Player.randomStat(),
            str: Player.randomStat(),
            mp: Player.randomMp(50, 100),
            luk: Player.randomLuk(),
            wep: Player.randomWeapon(),
            cls: Player.randomClass(),
        };
    }
}