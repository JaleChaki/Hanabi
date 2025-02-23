import React, {Component, MouseEventHandler, PropsWithChildren} from "react";
import { ICard } from "../../SerializationInterfaces/ICard";
import "./Card.scss"
import "../../Colors.scss"

export interface CardProps {
    color: number,
    number: number,
    gameMode?: string,
    wrapperCssClass?: string
    numberClickHandler?: MouseEventHandler<HTMLElement>,
    colorClickHandler?: MouseEventHandler<HTMLElement>,
    preselectionClickHandler?: (isEqual: boolean, isColor: boolean, card: ICard) => void
}

export abstract class ColoredCard<P extends CardProps = CardProps> extends Component<P> {

    protected color: number;
    protected number: number;
    protected gameMode: string;
    protected numberClickHandler?: MouseEventHandler<HTMLElement>;
    protected colorClickHandler?: MouseEventHandler<HTMLElement>;

    protected constructor(props: P) {
        super(props);
        this.color = props.color;
        this.number = props.number;
        this.gameMode = props.gameMode || "";
        this.numberClickHandler = props.numberClickHandler;
        this.colorClickHandler = props.colorClickHandler;
    }

    render() {
        const wrapperCssClasses = this.props.wrapperCssClass + " " + ["card-wrapper"].concat(this.getWrapperCssClasses()).join(" ");
        const cardCssClasses = ["card"].concat(this.getCardCssClasses()).join(" ");
        return (
            <div className={wrapperCssClasses}>
                <div className={cardCssClasses}>
                    <div className="card-number" onClick={() => this.props.preselectionClickHandler?.(true, false, this as unknown as ICard)}>
                        <p>{this.getDisplayText()}</p>
                    </div>
                    <div className="card-color" onClick={() => this.props.preselectionClickHandler?.(true, true, this as unknown as ICard)}></div>
                </div>
            </div>
        );
    }

    protected abstract getWrapperCssClasses() : Array<string>;

    protected abstract getCardCssClasses() : Array<string>;

    protected abstract getDisplayText() : string;

}