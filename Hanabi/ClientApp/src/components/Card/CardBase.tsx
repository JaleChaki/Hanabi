import React, {MouseEvent, MouseEventHandler} from "react";
import {Component} from "react";
import "./Card.scss"
import "../../Colors.scss"

export type CardProps = {
    color: number;
    number: number;
    color_is_known: boolean;
    number_is_known: boolean;
    is_trash_can: boolean;
    cards_in_trash: number;
    is_deck: boolean;
    cards_in_deck: number;
    game_mode: string;
    is_own: boolean;
    is_firework: boolean;
    number_click_handler?: MouseEventHandler<HTMLElement>;
    color_click_handler?: MouseEventHandler<HTMLElement>;
}

export class CardBase extends Component<{}, CardProps> {

    color: number;
    number: number;
    color_is_known: boolean;
    number_is_known: boolean;
    is_trash_can: boolean;
    cards_in_trash: number;
    is_deck: boolean;
    cards_in_deck: number;
    game_mode: string;
    is_own: boolean;
    is_firework: boolean;
    number_click_handler?: MouseEventHandler<HTMLElement>;
    color_click_handler?: MouseEventHandler<HTMLElement>;

    protected constructor(props: CardProps) {
        super(props);
        this.color = props.color;
        this.number = props.number;
        this.color_is_known = props.color_is_known;
        this.number_is_known = props.number_is_known;
        this.is_trash_can = props.is_trash_can;
        this.cards_in_trash = props.cards_in_trash;
        this.is_deck = props.is_deck;
        this.cards_in_deck = props.cards_in_deck;
        this.game_mode = props.game_mode;
        this.is_own = props.is_own;
        this.is_firework = props.is_firework;
        this.number_click_handler = props.number_click_handler;
        this.color_click_handler = props.color_click_handler;
    }

    render() {
        if(this.is_deck)
            return this.renderDeck();
        if(this.is_trash_can)
            return this.renderTrashCan();
        return this.renderHeldCard();
    }

    private renderDeck() {
        return (
            <div className="card deck-card">
                <div className="deck-card-number">
                    <p>{this.cards_in_deck} cards left</p>
                </div>
            </div>
        );
    }

    private renderTrashCan() {
        return (
            <div className="card trash-can-card">
                <div className="deck-card-number">
                    <p>{this.cards_in_trash} in trash</p>
                </div>
            </div>
        );
    }

    private renderHeldCard() {
        const wrapperCssClasses = ["card-wrapper", this.getCssClassByKnowledge(), this.getBgCssClassByColor()].join(" ");
        const cardCssClasses = ["card", this.getCssClassByColor()].join(" ");
        const displayNumber = this.getDisplayNumber();
        return (
            <div className={wrapperCssClasses}>
                <div className={cardCssClasses}>
                    <div className="card-number" onClick={this.number_click_handler}>
                        <p>{displayNumber}</p>
                    </div>
                    <div className="card-color" onClick={this.color_click_handler}></div>
                </div>
            </div>
        );
    }

    private getCssClassByColor() {
        if(this.is_own && !this.color_is_known)
            return "card-unknown-color";

        if(this.color === 1)
            return "card-red";
        if(this.color === 2)
            return "card-blue";
        if(this.color === 3)
            return "card-green";
        if(this.color === 4)
            return "card-yellow";
        if(this.color === 5)
            return "card-violet";
        if(this.color === 6)
            return "card-white";
        if(this.color === 6 && this.game_mode === "rainbow")
            return "card-rainbow";
        return "card-unknown-color";
    }

    private getBgCssClassByColor() {
        if(this.color === 1)
            return "color-red";
        if(this.color === 2)
            return "color-blue";
        if(this.color === 3)
            return "color-green";
        if(this.color === 4)
            return "color-yellow";
        if(this.color === 5)
            return "color-violet";
        if(this.color === 6)
            return "color-white";
        if(this.color === 6 && this.game_mode === "rainbow")
            return "color-rainbow";
        return "color-unknown";
    }

    private getCssClassByKnowledge() {
        if(this.is_own || this.is_firework)
            return "";

        let result = [];
        if(this.color_is_known)
            result.push("card-color-known");

        if(this.number_is_known)
            result.push("card-number-known");

        return result.join(" ");
    }

    private getDisplayNumber() {
        if(this.number_is_known)
            return this.number;

        if(this.is_own)
            return "?"

        return this.number;
    }

}