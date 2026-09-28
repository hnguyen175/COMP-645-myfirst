import must from "../utilities/RequiredField.ts";
import CarouselItem from "./CarouselItem.ts";

export default class Comrades extends CarouselItem {
    constructor(carouselItem: HTMLElement) {
        super(carouselItem);
    }

    static async create(): Promise<Comrades> {
        const element = must(await this.loadElement("../views/players.html"));
        const comrades = new Comrades(element);
        return comrades;
    }
}