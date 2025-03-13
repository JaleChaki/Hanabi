import React, { FC } from "react";
import { HeldCard } from "./Card/HeldCard";

import "./Deck.scss";

type DeckProps = {
    name: string,
    cardsInDeck: number,
    topCardColor?: number,
    topCardNumber?: number
}

export const Deck: FC<DeckProps> = ({ name, cardsInDeck, topCardColor, topCardNumber }) => {
    const realCardsNumber = cardsInDeck > 5 ? 5 : cardsInDeck;
    return(
        <div className="card-deck">
            {name && <p><strong>{name}</strong></p>}
            {[...Array(realCardsNumber).keys()].map(cardIndex => {
                const isTopCard = cardIndex === realCardsNumber - 1;
                return <HeldCard color={isTopCard && topCardColor ? topCardColor : 0} 
                          colorIsKnown={isTopCard && !!topCardColor} 
                          number={isTopCard && topCardNumber ? topCardNumber : 0} 
                          numberIsKnown={isTopCard && !!topCardNumber} 
                          isOwn={true} 
                          key={cardIndex}
                />
            }
            )}
        </div>
    );
}