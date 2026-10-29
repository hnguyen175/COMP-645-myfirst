import ShuffleBag from "./utilities/ShuffleBag.ts";

export type PlayerStats = {
    hp: number;
    str: number;
    spd: number;
    mp: number;
    luk: number;
    wep: string;
    cls: string;
};

export default class Player {
    private _name: string;
    private _email: string;
    hp: number = 0;
    str: number = 0;
    spd: number = 0;
    mp: number = 0;
    luk: number = 0;
    wep: string = "";
    cls: string = "";
    private _id: string;

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get id(): string {
        return this._id;
    }

    static arrNames = new ShuffleBag(["Abakor", "Bandala", "Cartin", "Darianne", "Fezzor", "Gizleeni", "Halor", "Ia", "Jeepenn", "Kalindaa", "Lineuss", "Mordana", "Nazzor", "Ortery", "Parto", "Quey", "Rato", "Salana", "Torqq", "Uvala", "Vixtor", "Wylia", "Xex", "Yala", "Zetch"] as const);
    static arrVillainNames = new ShuffleBag(["Azrath", "Belnox", "Craven", "Dravora", "Ezrakk", "Grizmor", "Hexar", "Ivara", "Jorvex", "Kharza", "Maldrin", "Nyxara", "Ozrak", "Raveth", "Skarro", "Thyra", "Vorren", "Xandrak", "Zerith", "Morvane", "Drexil", "Valgora", "Krynn", "Noctra", "Zalthor"] as const);
    static arrWeapons = new ShuffleBag(["Rocks", "Staff", "Dagger", "Mace", "Warhammer", "Sword", "Battle Axe"] as const);
    static arrClasses = new ShuffleBag(["Healer", "Warrior", "Thief", "Knight", "Damsel", "Warlock", "Farmer"] as const);
    static arrLukProbability = [.02, .1, .2, 1] as const;

    static randomStat(min: number = 0, max: number = 100): number {
        const increment = 25;
        const lower = Math.max(1, Math.ceil(min / increment));
        const upper = Math.floor(max / increment);

        if (lower > upper) {
            throw new RangeError("No valid multiple of 25 in range");
        }

        return (Math.floor(Math.random() * (upper - lower + 1)) + lower) * increment;
    }

    static randomMp(min: number = 0, max: number = 100): number {
        return (Math.floor(Math.random() * (max - min) / 10 + 1) * 10) + min;
    }

    static randomLuk(): number {
        const randomValue = Math.random();
        const lukIndex = this.arrLukProbability.findIndex(probability => randomValue <= probability);
        switch (lukIndex) {
            case 0:
                return 10;
            case 1:
                return 3;
            case 2:
                return 2;
            default:
                return 1;
        }
    }

    static randomWeapon(): string {
        return Player.arrWeapons.draw();
    }

    static randomClass(): string {
        return Player.arrClasses.draw();
    }

    constructor(name: string | null = null, email: string | null = null, id: string | null = null, playerStats: PlayerStats | null = null) {
        this._name = (name ?? Player.arrNames.draw());
        this._email = (email ?? this._name.toLowerCase() + "@comp645.com");
        this._id = (id ?? crypto.randomUUID());
        if (playerStats) {
            Object.assign(this, playerStats);
        } else {
            this.hp = Player.randomStat();
            this.spd = Player.randomStat();
            this.str = Player.randomStat();
            this.mp = Player.randomMp();
            this.luk = Player.randomLuk();
            this.wep = Player.randomWeapon();
            this.cls = Player.randomClass();
        }
    }

    public static getVillainPlayer(): Player {
        const randomVillainName = Player.arrVillainNames.draw();
        return new Player(randomVillainName, `${randomVillainName.toLowerCase()}@comp645.com`);
    }

    static fromJSON(data: Partial<Player> & { _name?: string; _email?: string; _id?: string }): Player {
        const player = new Player(data._name ?? null, data._email ?? null, data._id ?? null, {
            hp: data.hp ?? 0,
            str: data.str ?? 0,
            spd: data.spd ?? 0,
            mp: data.mp ?? 0,
            luk: data.luk ?? 0,
            wep: data.wep ?? "",
            cls: data.cls ?? ""
        });
        return player;
    }

    toString(): string {
        return JSON.stringify(this);
    }
}