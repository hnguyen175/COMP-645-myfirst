import Player from "./Player.ts";
import Players from "./Players.ts";

class GameState{
    constructor(private players: Players | null = null,
        private dktVillain: Player | null = null
    ) {}
    getPlayers() : Players | null {
        return this.players;
    }
    setPlayers(players: Players) {
        this.players = players;
    }
    getDtkVillain() : Player | null {
        return this.dktVillain;
    }
    setDtkVillain(villain: Player) {
        this.dktVillain = villain;
    }
}

export default new GameState();