import Player from "./Player.ts";

export default class Players {
    // private key: string;
    // private currentScreen: string;
    questCompleted: boolean = false;
    players: Player[];

    constructor() {
        this.players = [];
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    addDefaultPlayers() {
        this.players.push(Player.getDefaultPlayer());
        this.players.push(Player.getDefaultPlayer());
    }

    savePlayersToSessionStorage() {
        const json = JSON.stringify(this);
        console.log("Saving players to session storage:", json);
        sessionStorage.setItem(this.players[0]?.email, json);
    }

    static loadPlayersFromSessionStorage(email: string) : Players | null {
        const savedPlayers = sessionStorage.getItem(email);
        if (savedPlayers) {
            const playersData = JSON.parse(savedPlayers) as Players;
            return playersData;
        }
        return null;
    }
};