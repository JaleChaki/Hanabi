import React, { FC } from "react";
import { Deck } from "../Deck";
import { ICard } from "../../SerializationTypes/ICard";

import "./History.scss"

type HistoryProps = {
    discardPile: Array<ICard>
}

export const History: FC<HistoryProps> = ({ discardPile }) => {
    return (
        <div className="history">
            <figure>
                <figcaption><h4>History</h4></figcaption>
                <ol className="history-list">
                    <li>History 1</li>
                </ol>
            </figure>
            <Deck name="Discard:" cardsInDeck={discardPile?.length} topCardColor={discardPile.at(-1)?.color} topCardNumber={discardPile.at(-1)?.number}/>
        </div>
    )
}