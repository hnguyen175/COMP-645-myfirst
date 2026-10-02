import Players from "./Players.ts";

class GameState{
    constructor(private players: Players | null = null) {}
    get() : Players | null {
        return this.players;
    }
    set(players: Players) {
        this.players = players;
    }
}

export default new GameState();