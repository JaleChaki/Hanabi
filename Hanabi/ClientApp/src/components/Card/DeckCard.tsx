import {CardBase, CardProps} from "./CardBase";

export class DeckCard extends CardBase {

    constructor(props: { cardsInDeck: number }) {
        let superProps: CardProps = {
            is_deck: true,
            cards_in_deck: props.cardsInDeck,
            color: 0,
            is_own: false,
            cards_in_trash: 0,
            game_mode: "default",
            is_trash_can: false,
            number: 0,
            number_is_known: false,
            color_is_known: false,
            is_firework: false
        };
        super(superProps);
    }
}