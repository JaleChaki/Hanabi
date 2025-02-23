import React, { FC, useCallback, useEffect, useState } from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { ICard } from "../../SerializationInterfaces/ICard";
import { HeldCard } from "../Card/HeldCard";

import "./Player.scss"
import { CardProps } from "reactstrap";
import CardFilterCriteria from "../Card/Utils/CardFilterCriteria";

type PlayerProps = {
    info: IPlayer,
    actions: IPlayerActions,
    turnKey: number
}

export interface IPlayerActions {
    makeHintByColor: (nickname: string, cardcolor: number) => void,
    makeHintByNumber: (nickname: string, cardNumber: number) => void,
    dropCard: Function,
    playCard: Function
}

export const Player: FC<PlayerProps> = ({ info: { nick, heldCards, isCurrentPlayer }, actions, turnKey }) => {
    const [cardFilter, setCardFilter] = useState<CardFilterCriteria>(new CardFilterCriteria());

    const getCardWrapperCssClass = (card: ICard): string => cardFilter.testCard(card) ? "preselected" : "";

    const preselectionClickHandler = (isEqual: boolean, isColor: boolean, card: ICard) => {
        setCardFilter(new CardFilterCriteria(isEqual, isColor ? card.color : undefined, !isColor ? card.number : undefined));
    }

    return (
        <div className={`player ${isCurrentPlayer ? "current-player" : ""}`}>
            <p><strong>Nick: </strong>{nick}</p>
            <div className="cards-wrapper">
                {heldCards.map((card, i) =>
                    <HeldCard color={card.color}
                        colorIsKnown={card.colorIsKnown}
                        number={card.number}
                        numberIsKnown={card.numberIsKnown}
                        isOwn={isCurrentPlayer}
                        wrapperCssClass={getCardWrapperCssClass(card)}
                        className={`card-${i}`}
                        key={`Player${nick}Turn${turnKey}Card${i}`}
                        numberClickHandler={() => actions.makeHintByNumber(nick, card.number)}
                        colorClickHandler={() => actions.makeHintByColor(nick, card.color)}
                        preselectionClickHandler={preselectionClickHandler}>
                    </HeldCard>
                )}
            </div>
        </div>
    );
}