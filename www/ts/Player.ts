export default class Player {
    name: string;
    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }

    static load(){
        const saved = sessionStorage.getItem("player");
        if(saved){
            const player = JSON.parse(saved);
            const p = new Player(player.name, player.email);
            return p;
        }
    }

    static save(name: string, email: string){
        const player = new Player(name, email);
        sessionStorage.setItem("player", JSON.stringify(player));
        return player;
    }
}