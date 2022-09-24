import React, {Component, MouseEventHandler, PropsWithChildren} from "react";
import "./Card.scss"
import "../../Colors.scss"

export interface CardProps {
    color: number;
    number: number;
    gameMode?: string;
    numberClickHandler?: MouseEventHandler<HTMLElement>;
    colorClickHandler?: MouseEventHandler<HTMLElement>;
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
        const wrapperCssClasses = ["card-wrapper"].concat(this.getWrapperCssClasses()).join(" ");
        const cardCssClasses = ["card"].concat(this.getCardCssClasses()).join(" ");
        return (
            <div className={wrapperCssClasses}>
                <div className={cardCssClasses}>
                    <div className="card-number" onClick={this.numberClickHandler}>
                        <p>{this.getDisplayText()}</p>
                    </div>
                    <div className="card-color" onClick={this.colorClickHandler}></div>
                </div>
            </div>
        );
    }

    protected abstract getWrapperCssClasses() : Array<string>;

    protected abstract getCardCssClasses() : Array<string>;

    protected abstract getDisplayText() : string;

}