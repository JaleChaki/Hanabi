import React, { FC, useCallback, useEffect, useState } from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { ICard } from "../../SerializationInterfaces/ICard";
import { HeldCard } from "../Card/HeldCard";
import { CardClickedZone } from "../Card/ColoredCard";
import CardFilterCriteria from "../Card/Utils/CardFilterCriteria";
import { getColorByCode } from "../Card/ColorUtils";

import "./Player.scss"

enum CurrentPlayerMode {
    Hint,
    Play,
    Drop
}

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

export const Player: FC<PlayerProps> = ({ info: { nick, heldCards, isActivePlayer, isSessionOwner }, actions, turnKey }) => {
    const [cardFilter, setCardFilter] = useState<CardFilterCriteria>(new CardFilterCriteria());
    const [currentPlayerMode, setCurrentPlayerMode] = useState<CurrentPlayerMode>(CurrentPlayerMode.Hint);

    const getCardWrapperCssClass = (card: ICard): string => cardFilter.testCard(card) ? "preselected" : "";

    const cardClickedHandler = (card: ICard, cardZone: CardClickedZone): void => {
        switch (currentPlayerMode) {
            case CurrentPlayerMode.Hint:
                if (!isSessionOwner)
                    makeHint(card, cardZone);
                break;
            case CurrentPlayerMode.Play:
                if (isSessionOwner)
                    playCard(card);
                break;
            case CurrentPlayerMode.Drop:
                if (isSessionOwner)
                    dropCard(card);
                break;
            default:
                break;
        }
    }

    const makeHint = (card: ICard, cardZone: CardClickedZone) => {
        const isEqual = cardZone === CardClickedZone.Color || cardZone === CardClickedZone.Number;
        const isColor = cardZone === CardClickedZone.Color; // || cardZone === CardClickedZone.NegateColor; // TODO
        const newFilter = new CardFilterCriteria(isEqual, isColor ? card.color : undefined, !isColor ? card.number : undefined);
        if (cardFilter.equals(newFilter)) {
            const result = window.confirm(`Do you really want to tell player ${nick} ` +
                `their cards with ${isColor ? "color" : "number"} ${isColor ? getColorByCode(card.color) : card.number}?`);
            if (result)
                isColor ? actions.makeHintByColor(nick, card.color) : actions.makeHintByNumber(nick, card.number);
        } else {
            setCardFilter(newFilter);
        }
    }

    const playCard = (card: ICard) => {
        const result = window.confirm(`Do you really want to PLAY the card with ` +
            `color ${card.colorIsKnown ? getColorByCode(card.color) : "unknown"} and ` +
            `number ${card.numberIsKnown ? card.number : "unknown"}?`);
        if(result)
            actions.playCard(card);
    }

    const dropCard = (card: ICard) => {
        const result = window.confirm(`Do you really want to DROP the card with ` +
            `color ${card.colorIsKnown ? getColorByCode(card.color) : "unknown"} and ` +
            `number ${card.numberIsKnown ? card.number : "unknown"}?`);
        if(result)
            actions.playCard(card);
    }

    return (
        <div className={`player ${isActivePlayer ? "current-player" : ""}`}>
            <div className="player-header">
                <p><strong>Nick: </strong>{nick}</p>
                {
                    isActivePlayer ?
                    <div className="actions">
                        <button onClick={() => setCurrentPlayerMode(CurrentPlayerMode.Hint)}>Hint</button>
                        <button onClick={() => setCurrentPlayerMode(CurrentPlayerMode.Play)}>Play</button>
                        <button onClick={() => setCurrentPlayerMode(CurrentPlayerMode.Drop)}>Drop</button>
                    </div>
                    : null
                }
            </div>
            <div className="cards-wrapper">
                {heldCards.map((card, i) =>
                    <HeldCard color={card.color}
                        colorIsKnown={card.colorIsKnown}
                        number={card.number}
                        numberIsKnown={card.numberIsKnown}
                        isOwn={isSessionOwner}
                        wrapperCssClass={getCardWrapperCssClass(card)}
                        className={`card-${i}`}
                        key={`Player${nick}Turn${turnKey}Card${i}`}
                        clickHandler={cardZone => cardClickedHandler(card, cardZone)}>
                    </HeldCard>
                )}
            </div>
        </div>
    );
}