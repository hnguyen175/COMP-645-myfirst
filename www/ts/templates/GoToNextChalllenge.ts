import NavController from '../NavController.ts';
import must from '../utilities/RequiredField.ts';

export default class GoToNextChallenge {
    private _template: HTMLTemplateElement | null = null;

    constructor(private readonly navController: NavController, private readonly nextChallengeName: string) {
    }

    get templateFragment(): DocumentFragment {
        const fragment = must(document.querySelector<HTMLTemplateElement>("#templGoToNextChallenge")).content.cloneNode(true) as DocumentFragment;
        const button = must(fragment.querySelector('.next-challenge-button'));
        button.textContent = `Go to ${this.nextChallengeName}`;

        button.addEventListener('click', () => {
        });

        return fragment;
    }
}