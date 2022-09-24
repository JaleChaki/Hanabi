import { PropsWithChildren } from "react";
import { ColoredCard, CardProps } from "./ColoredCard";
import { getColorByCode } from "./ColorUtils";

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
        let result = [];
        if (this.colorIsKnown && !this.isOwn)
            result.push("card-color-known");

        if (this.numberIsKnown && !this.isOwn)
            result.push("card-number-known");

        result.push("color-" + getColorByCode(this.color, this.gameMode))
        return result;
    }

    protected override getDisplayText(): string {
        if (this.numberIsKnown)
            return this.number.toString();

        if (this.isOwn)
            return "?"

        return this.number.toString();
    }

    protected override getCardCssClasses(): Array<string> {
        if (this.isOwn && !this.colorIsKnown)
            return ["card-unknown-color"];
        return ["card-" + getColorByCode(this.color, this.gameMode)];
    }
}