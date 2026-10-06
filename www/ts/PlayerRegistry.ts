import loggingProxy from './utilities/LoggingProxy.ts';

export const emailsKey: string = "emails";
class PlayerRegistry {
    private emails!: Set<string>;

    private constructor(emails: string[] = []) {
        this.emails = new Set<string>(emails);
    }

    saveEmailsToStorage() {
        const json = JSON.stringify(Array.from(this.emails));
        localStorage.setItem(emailsKey, json);
    }

    static fromStorage(): PlayerRegistry {
        const json = localStorage.getItem(emailsKey);
        const playersArray: string[] = json ? JSON.parse(json) : [];
        return loggingProxy(new PlayerRegistry(playersArray));
    }

    addEmail(email: string) {
        if (this.emails.has(email)) {
            this.emails.delete(email);
        }
        this.emails.add(email);
        this.saveEmailsToStorage();
    }

    getEmails(): string[] {
        return Array.from(this.emails);
    }

    removeEmail(email: string) {
        if (this.emails.has(email)) {
            this.emails.delete(email);
            this.saveEmailsToStorage();
        }
    }
}

const playerRegistry = PlayerRegistry.fromStorage();
export default playerRegistry;