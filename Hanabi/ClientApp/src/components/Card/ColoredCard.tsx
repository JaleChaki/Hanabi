import React, {Component, MouseEventHandler, PropsWithChildren} from "react";
import { ICard } from "../../SerializationTypes/ICard";
import "./Card.scss"
import "../../Colors.scss"

export enum CardClickedZone {
    Color,
    // NegateColor // TODO
    Number,
    // NeagteNumber, // TODO
}

export interface CardProps {
    color: number,
    number: number,
    gameMode?: string,
    wrapperCssClass?: string
    clickHandler?: (zone: CardClickedZone) => void
}

export abstract class ColoredCard<P extends CardProps = CardProps> extends Component<P> {

    protected color: number;
    protected number: number;
    protected gameMode: string;

    protected constructor(props: P) {
        super(props);
        this.color = props.color;
        this.number = props.number;
        this.gameMode = props.gameMode || "";
    }

    render() {
        const wrapperCssClasses = this.props.wrapperCssClass + " " + ["card-wrapper"].concat(this.getWrapperCssClasses()).join(" ");
        const cardCssClasses = ["card"].concat(this.getCardCssClasses()).join(" ");
        return (
            <div className={wrapperCssClasses}>
                <div className={cardCssClasses}>
                    <div className="card-number" onClick={() => this.props.clickHandler?.(CardClickedZone.Number)}>
                        <p>{this.getDisplayText()}</p>
                    </div>
                    <div className="card-color" onClick={() => this.props.clickHandler?.(CardClickedZone.Color)}></div>
                </div>
            </div>
        );
    }

    protected abstract getWrapperCssClasses() : Array<string>;

    protected abstract getCardCssClasses() : Array<string>;

    protected abstract getDisplayText() : string;

}