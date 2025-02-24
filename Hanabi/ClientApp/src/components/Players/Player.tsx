import React, { FC, useCallback, useEffect, useState } from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { ICard } from "../../SerializationInterfaces/ICard";
import { HeldCard } from "../Card/HeldCard";
import { CardClickedZone } from "../Card/ColoredCard";
import CardFilterCriteria from "../Card/Utils/CardFilterCriteria";
import { getColorByCode } from "../Card/ColorUtils";

import "./Player.scss"
import { ActivePlayerMode } from "./Players";

type PlayerProps = {
    info: IPlayer,
    actions: IPlayerActions,
    turnKey: number,
    activePlayerMode: ActivePlayerMode,
    onActivePlayerModeChanged: (mode: ActivePlayerMode) => void
}

export interface IPlayerActions {
    makeHintByColor: (nickname: string, cardcolor: number) => void,
    makeHintByNumber: (nickname: string, cardNumber: number) => void,
    dropCard: (cardIndex: number) => void,
    playCard: (cardIndex: number) => void
}

export const Player: FC<PlayerProps> = ({ info: { nick, heldCards, isActivePlayer, isSessionOwner }, actions, turnKey, activePlayerMode, onActivePlayerModeChanged: activePlayerModeChanged }) => {
    const [cardFilter, setCardFilter] = useState<CardFilterCriteria>(new CardFilterCriteria());
    

    const getCardWrapperCssClass = (card: ICard): string => cardFilter.testCard(card) ? "preselected" : "";

    const cardClickedHandler = (card: ICard, cardZone: CardClickedZone): void => {
        switch (activePlayerMode) {
            case ActivePlayerMode.Hint:
                if (!isSessionOwner)
                    makeHint(card, cardZone);
                break;
            case ActivePlayerMode.Play:
                if (isSessionOwner)
                    playCard(card);
                break;
            case ActivePlayerMode.Drop:
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
            actions.playCard(heldCards.indexOf(card));
    }

    const dropCard = (card: ICard) => {
        const result = window.confirm(`Do you really want to DROP the card with ` +
            `color ${card.colorIsKnown ? getColorByCode(card.color) : "unknown"} and ` +
            `number ${card.numberIsKnown ? card.number : "unknown"}?`);
        if(result)
            actions.playCard(heldCards.indexOf(card));
    }

    return (
        <div className={`player ${isActivePlayer && isSessionOwner ? "current-player" : ""}`}>
            <div className="player-header">
                <p><strong>Nick: </strong>{nick}</p>
                {
                    isActivePlayer && isSessionOwner ?
                    <div className="actions">
                        <button onClick={() => activePlayerModeChanged(ActivePlayerMode.Hint)}>Hint</button>
                        <button onClick={() => activePlayerModeChanged(ActivePlayerMode.Play)}>Play</button>
                        <button onClick={() => activePlayerModeChanged(ActivePlayerMode.Drop)}>Drop</button>
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