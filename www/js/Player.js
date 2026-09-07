class Player {
    constructor(name, email) {
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

    static save(name, email){
        const player = new Player(name, email);
        sessionStorage.setItem("player", JSON.stringify(player));
        return player;
    }
}