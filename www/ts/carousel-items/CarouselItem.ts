import must from "../utilities/RequiredField.ts";

export default abstract class CarouselItem {
    private readonly _resetContent: string;

    constructor(private readonly _carouselItem: HTMLElement) {
        this._resetContent = this.carouselItem.querySelector<HTMLElement>(".cls-reset-content")?.innerHTML ?? "";
    }

    static async loadElement(htmlPath: string): Promise<HTMLElement> {

        const response = await fetch(htmlPath);
        const html = await response.text();

        return ons.createElement(html.trim());
    }

    get carouselItem(): HTMLElement {
        return this._carouselItem;
    }

    resetContent(): void {
        const resetContentElement = must(this.carouselItem.querySelector<HTMLElement>(".cls-reset-content"));
        resetContentElement.innerHTML = this._resetContent;
    }

    toString(): string {
        return `name: ${this.constructor.name}, id: ${this.carouselItem.id}`;
    }
}