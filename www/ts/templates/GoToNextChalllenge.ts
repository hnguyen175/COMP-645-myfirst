import must from '../utilities/RequiredField.ts';

class GoToNextChallenge {
    private readonly goToNextChallengeFragment: DocumentFragment;

    constructor() {
        this.goToNextChallengeFragment = must(document.querySelector<HTMLTemplateElement>("#templGoToNextChallenge")).content as DocumentFragment;
    }

    get templateFragment(): DocumentFragment {
        const fragment = this.goToNextChallengeFragment.cloneNode(true) as DocumentFragment;

        return fragment;
    }
}

export default new GoToNextChallenge();