import React, { FC, useState } from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { HeldCard } from "../Card/HeldCard";

import "./Player.scss"

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
    return (
        <div className="player">
            <p><strong>Nick: </strong>{nick}</p>
            <div className="cards-wrapper">
                {heldCards.map((card, i) =>
                    <HeldCard color={card.color}
                        colorIsKnown={card.colorIsKnown}
                        number={card.number}
                        numberIsKnown={card.numberIsKnown}
                        isOwn={isCurrentPlayer}
                        className={`card-${i}`}
                        key={`Player${nick}Turn${turnKey}Card${i}`}
                        numberClickHandler={() => actions.makeHintByNumber(nick, card.number)}
                        colorClickHandler={() => actions.makeHintByColor(nick, card.color)}>
                    </HeldCard>
                )}
            </div>
        </div>
    );
}