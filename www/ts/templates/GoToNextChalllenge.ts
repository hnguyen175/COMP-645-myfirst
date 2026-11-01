import NavController from '../NavController.ts';
import must from '../utilities/RequiredField.ts';

export default class GoToNextChallenge {
    private _template: HTMLTemplateElement | null = null;

    constructor(private readonly navController: NavController, private readonly nextChallengeName: string) {
    }

    get templateFragment(): DocumentFragment {
        return must(document.querySelector<HTMLTemplateElement>("#templGoToNextChallenge")).content.cloneNode(true) as DocumentFragment;
    }
}