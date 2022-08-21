import {CardBase, CardProps} from "./CardBase";

export class FireworkCard extends CardBase {

    constructor(props: { color: number, number: number }) {
        let superProps: CardProps = {
            is_deck: false,
            cards_in_deck: 0,
            color: props.color,
            is_own: false,
            cards_in_trash: 0,
            game_mode: "default",
            is_trash_can: false,
            number: props.number,
            number_is_known: true,
            color_is_known: true,
            is_firework: true
        }
        super(superProps);
    }

}