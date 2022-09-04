import React, {Component} from "react";
import "./Card.scss"

export type DeckCardProps = {
    cardsInDeck: number;
}

export class DeckCard extends Component<{}, DeckCardProps> {

    cardsInDeck: number;

    constructor(props: DeckCardProps) {
        super(props);
        this.cardsInDeck = props.cardsInDeck;
    }

    render() {
        return (
            <div className="card deck-card">
                <div className="deck-card-number">
                    <p>{this.cardsInDeck} cards left</p>
                </div>
            </div>
        );
    }
}