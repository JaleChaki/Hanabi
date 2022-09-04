import {MouseEventHandler} from "react";
import {ColoredCard, CardProps} from "./ColoredCard";
import {getColorByCode} from "./ColorUtils";

export type HeldCardProps = {
    color: number,
    number: number,
    colorIsKnown: boolean,
    numberIsKnown: boolean,
    isOwn: boolean,
    gameMode: string;
    numberClickHandler?: MouseEventHandler<HTMLElement>,
    colorClickHandler?: MouseEventHandler<HTMLElement>
};

export class HeldCard extends ColoredCard {

    numberIsKnown: boolean;
    colorIsKnown: boolean;
    isOwn: boolean;

    constructor(props: HeldCardProps) {
        let superProps: CardProps = {
            color: props.color,
            number: props.number,
            gameMode: props.gameMode,
            numberClickHandler: props.numberClickHandler,
            colorClickHandler: props.colorClickHandler
        };
        super(superProps);
        this.numberIsKnown = props.numberIsKnown;
        this.colorIsKnown = props.colorIsKnown;
        this.isOwn = props.isOwn;
    }

    protected override getWrapperCssClasses() : Array<string> {
        let result = [];
        if(this.colorIsKnown && !this.isOwn)
            result.push("card-color-known");

        if(this.numberIsKnown && !this.isOwn)
            result.push("card-number-known");

        result.push("color-" + getColorByCode(this.color, this.gameMode))
        return result;
    }

    protected override getDisplayText(): string {
        if(this.numberIsKnown)
            return this.number.toString();

        if(this.isOwn)
            return "?"

        return this.number.toString();
    }

    protected override getCardCssClasses(): Array<string> {
        if(this.isOwn && !this.colorIsKnown)
            return ["card-unknown-color"];
        return ["card-" + getColorByCode(this.color, this.gameMode)];
    }
}