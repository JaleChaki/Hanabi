import {CardBase, CardProps} from "./CardBase";

export class TrashCanCard extends CardBase {

    constructor(props: { cardsInTrash: number }) {
        var superProps: CardProps = {
            is_deck: false,
            cards_in_deck: 0,
            color: 0,
            is_own: false,
            cards_in_trash: props.cardsInTrash,
            game_mode: "default",
            is_trash_can: true,
            number: 0,
            number_is_known: false,
            color_is_known: false,
            is_firework: false
        };
        super(superProps);
    }

}