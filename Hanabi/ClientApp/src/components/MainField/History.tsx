import React, { FC } from "react";
import { Deck } from "../Deck";
import { ICard } from "../../SerializationTypes/ICard";

import "./History.scss"
import { Popup } from "../Auxiliary/Popup";
import { HeldCard } from "../Card/HeldCard";

type HistoryProps = {
    discardPile: Array<ICard>
}

export const History: FC<HistoryProps> = ({ discardPile }) => {
    const [isDiscardPilePopupOpen, setIsDiscardPilePopupOpen] = React.useState(false);
    return (
        <div className="history">
            <figure>
                <figcaption><h4>History</h4></figcaption>
                <ol className="history-list">
                    <li>History 1</li>
                </ol>
            </figure>
            <Deck name="Discard:" 
                  cardsInDeck={discardPile?.length} 
                  topCardColor={discardPile.at(-1)?.color} 
                  topCardNumber={discardPile.at(-1)?.number}
                  onClick={() => setIsDiscardPilePopupOpen(true)}
            />
            <Popup isOpen={isDiscardPilePopupOpen} onClose={() => setIsDiscardPilePopupOpen(false)}>
                <div className="cards-wrapper">
                    {discardPile.map((card, i) =>
                        <HeldCard color={card.color}
                            colorIsKnown={card.colorIsKnown}
                            number={card.number}
                            numberIsKnown={card.numberIsKnown}
                            isOwn={false}
                            key={`DiscardPileCard${i}`}>
                        </HeldCard>
                    )}
                </div>
            </Popup>
        </div>
    )
}