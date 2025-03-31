import { ColoredCard, CardProps } from "./ColoredCard";
import { getColorByCode, getColorClassName } from "./ColorUtils";

interface HeldCardProps extends
    Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "color">,
    CardProps {
    colorIsKnown: boolean,
    numberIsKnown: boolean,
    isOwn: boolean
};

export class HeldCard extends ColoredCard<HeldCardProps> {

    numberIsKnown: boolean;
    colorIsKnown: boolean;
    isOwn: boolean;

    constructor(props: HeldCardProps) {
        super(props);
        this.numberIsKnown = props.numberIsKnown;
        this.colorIsKnown = props.colorIsKnown;
        this.isOwn = props.isOwn;
    }

    protected override getWrapperCssClasses(): Array<string> {
        const result = [];
        if (this.colorIsKnown && !this.isOwn)
            result.push("card-color-known");

        if (this.numberIsKnown && !this.isOwn)
            result.push("card-number-known");

        if (!this.isOwn || this.colorIsKnown)
            result.push(getColorClassName(this.color, this.gameMode));

        return result;
    }

    protected override getCardCssClasses(): Array<string> {
        const result = [];
        if (this.isOwn && !this.numberIsKnown)
            result.push("card-unknown-number");

        if (this.isOwn && !this.colorIsKnown)
            result.push("card-unknown-color");

        if (!this.isOwn || this.colorIsKnown)
            result.push("card-" + getColorByCode(this.color, this.gameMode));

        return result;
    }

    protected override getDisplayText(): string {
        if (this.numberIsKnown)
            return this.number.toString();

        if (this.isOwn)
            return "?"

        return this.number.toString();
    }
}