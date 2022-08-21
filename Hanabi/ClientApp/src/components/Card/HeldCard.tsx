import {CardBase, CardProps} from "./CardBase";
import {MouseEventHandler} from "react";

export type HeldCardProps = {
    color: number,
    number: number,
    colorIsKnown: boolean,
    numberIsKnown: boolean,
    isOwn: boolean,
    numberClickHandler?: MouseEventHandler<HTMLElement>,
    colorClickHandler?: MouseEventHandler<HTMLElement>
};

export class HeldCard extends CardBase {

    constructor(props: HeldCardProps) {
        let superProps: CardProps = {
            color: props.color,
            number: props.number,
            color_is_known: props.colorIsKnown,
            number_is_known: props.numberIsKnown,
            is_own: props.isOwn,
            is_deck: false,
            cards_in_deck: 0,
            is_trash_can: false,
            game_mode: "default",
            cards_in_trash: 0,
            is_firework: false,
            number_click_handler: props.numberClickHandler,
            color_click_handler: props.colorClickHandler
        };
        super(superProps);
    }
}