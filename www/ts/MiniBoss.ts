import Player, { PlayerStats } from "./Player.ts";

export default class MiniBoss extends Player {
    constructor() {
        const playerStats: PlayerStats = {
            hp: Player.randomStat(50, 100),
            str: Player.randomStat(),
            spd: Player.randomStat(),
            mp: Player.randomMp(),
            luk: Player.randomLuk(),
            wep: "Evil " + Player.randomWeapon(),
            cls: "Dark " + Player.randomClass()
        };
        super(null, null, null, playerStats);
    }
}