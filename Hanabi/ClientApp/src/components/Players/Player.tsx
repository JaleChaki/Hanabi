import React, { FC, useState } from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { HeldCard } from "../Card/HeldCard";

import "./Player.scss"

type PlayerProps = {
    info: IPlayer,
    actions: IPlayerActions
}

export interface IPlayerActions {
    makeHintByColor: (nickname: string, cardcolor: number) => void,
    makeHintByNumber: (nickname: string, cardNumber: number) => void,
    dropCard: Function,
    playCard: Function
}

export const Player: FC<PlayerProps> = ({ info: { nick, heldCards }, actions }) => {
    return (
        <div className="player">
            <p><strong>Nick: </strong>{nick}</p>
            <div className="cards-wrapper">
                {heldCards.map((card, i) =>
                    <HeldCard color={card.color}
                        colorIsKnown={card.colorIsKnown}
                        number={card.number}
                        numberIsKnown={card.colorIsKnown}
                        isOwn={false}
                        className={`card-${i}`}
                        key={`${nick}PlayerCard${i}`}
                        numberClickHandler={() => actions.makeHintByNumber(nick, card.number)}
                        colorClickHandler={() => actions.makeHintByColor(nick, card.color)}>
                    </HeldCard>
                )}
            </div>
        </div>
    );
}