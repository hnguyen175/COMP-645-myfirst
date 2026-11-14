import GameTasks from "../templates/GameTasks.ts";
import must from "../utilities/RequiredField.ts";
import CarouselItem from "./CarouselItem.ts";

export default class Final extends CarouselItem {
  private constructor(carouselItem: HTMLElement) {
    super(carouselItem);
  }

  static async create(): Promise<Final> {
    const element = await this.loadElement("../views/final.html");

    const footer = must(element.querySelector("footer"));
    footer.after(GameTasks.instance.templateFragment);

    return new Final(element);
  }
}
