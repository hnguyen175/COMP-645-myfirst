import CarouselItem from './CarouselItem.ts';
import must from '../utilities/RequiredField.ts';
import NavController from '../NavController.ts';

export default class Welcome extends CarouselItem {
    constructor(carouselItem: HTMLElement, private readonly navController: NavController) {
        super(carouselItem);
    }

    static async create(navController: NavController) : Promise<Welcome>{
        const element = must(await this.loadElement("../views/welcome.html"));
        const welcome = new Welcome(element, navController);
        welcome.registerEvents();
        return welcome;
    }

    private registerEvents(): void{
        const carouselItem = this.getCarouselItem();
        carouselItem.addEventListener("click", (event) => {
            if ((event.target as HTMLElement).closest("#btnNewGame")){
                this.navController.onCarouselNewGame();
            }
            else if ((event.target as HTMLElement).closest("#btnReload")) {
                this.navController.onReloadButtonClick();
            }
        });
    }
}