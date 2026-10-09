import must from "../utilities/RequiredField.ts";
import NavController from "../NavController.ts";
import { fireAndForget } from "../utilities/AsyncUtils.ts";

export default class TemplateGameTask {
    private _template: HTMLTemplateElement | null = null;

    constructor(private _navController: NavController) {
        this.initializePage();
    }

    initializePage(): void {
        this._template = must(document.querySelector<HTMLTemplateElement>("#templ8GameTasks"));
    }

    get templateFragment(): DocumentFragment {
        if (!this._template) {
            throw new Error("Template element not found.");
        }

        const fragment = this._template.content.cloneNode(true) as DocumentFragment;
        const gameTasks = must(fragment.querySelector<HTMLElement>(".game-tasks"));
        this.registerGameTaskEvents(gameTasks);
        return fragment;
    }

    registerGameTaskEvents(gameTasks: HTMLElement) {
        gameTasks.addEventListener("click", (event) => {
            if (!event.target) {
                return;
            }

            if (event.target instanceof Element) {
                const clickedElement = event.target.closest('a[data-gametsk]');
                if (!clickedElement) {
                    return;
                }

                const action = must(clickedElement.getAttribute('data-gametsk'));
                console.log(`template game tasks: ${action} clicked.`);
                if (action === "quit") {
                    fireAndForget(
                        this._navController.resetCarouselToWelcome()
                    );
                }
            }
        });
    }
}