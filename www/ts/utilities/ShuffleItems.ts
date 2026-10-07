import must from "./RequiredField.ts";

export default function shuffleItems<T>(items: readonly T[]): T[] {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export class RandomItemPicker<T> {
    private items: T[];
    private lastPickedItem: T | null = null;

    constructor(private originalItems: readonly T[]) {
        this.items = shuffleItems(originalItems);
        must(this.items.length > 0, "The originalItems array must contain at least one item.");
    }

    // Guarantees no consecutive duplicate picks
    // when originalItems contains at least 2 unique items.
    public getRandomItem(): T {
        if (this.items.length === 1) {
            this.lastPickedItem = this.items.pop()!;
            return this.lastPickedItem;
        }

        let pickedItem: T;
        if (this.items.length === 0) {
            this.items = shuffleItems(this.originalItems);
            pickedItem = this.items.pop()!;
            if (pickedItem === this.lastPickedItem) {
                this.items.unshift(pickedItem);
                pickedItem = this.items.pop()!;
            }
        } else {
            pickedItem = this.items.pop()!;
        }

        this.lastPickedItem = pickedItem;

        return pickedItem;
    }
}