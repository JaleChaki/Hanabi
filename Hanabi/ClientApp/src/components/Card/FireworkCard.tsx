import { ColoredCard } from "./ColoredCard";
import { getColorByCode, getColorClassName } from "./ColorUtils";

export type FireworkCardProps = {
    color: number;
    number: number;
}

export class FireworkCard extends ColoredCard {

    constructor(props: FireworkCardProps) {
        super(props);
    }

    protected override getWrapperCssClasses(): Array<string> {
        return [getColorClassName(this.color, this.gameMode)];
    }

    protected override getCardCssClasses(): Array<string> {
        return ["card-" + getColorByCode(this.color, this.gameMode)];
    }

    protected override getDisplayText(): string {
        return this.number.toString();
    }

}