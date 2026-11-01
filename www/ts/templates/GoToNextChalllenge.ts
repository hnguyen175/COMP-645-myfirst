import NavController from '../NavController.ts';
import { fireAndForget } from '../utilities/AsyncUtils.ts';
import must from '../utilities/RequiredField.ts';

export default class GoToNextChallenge {
    private _template: HTMLTemplateElement | null = null;

    constructor(private readonly navController: NavController, private readonly nextChallengeName: string) {
        const nextChallengeButton = document.querySelector<HTMLElement>("#btnNextChallenge");
    }

    get templateFragment(): DocumentFragment {
        const fragment = must(document.querySelector<HTMLTemplateElement>("#templGoToNextChallenge")).content.cloneNode(true) as DocumentFragment;
        const nextChallengeButton = must(fragment.querySelector<HTMLElement>(".next-challenge-button"));

        return fragment;
    }
}