export default abstract class CarouselItem {
    constructor (private readonly carouselItem : HTMLElement) {
    }
    
    static async loadElement(htmlPath: string): Promise<HTMLElement> {

        const response = await fetch(htmlPath);
        const html = await response.text();

        return ons.createElement(html.trim());
    }

    getCarouselItem() : HTMLElement{
        return this.carouselItem;
    }

    toString() : string {
        return `name: ${this.constructor.name}, id: ${this.carouselItem.id}`;
    }
}