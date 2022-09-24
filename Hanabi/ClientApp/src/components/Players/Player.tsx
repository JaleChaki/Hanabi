import React, { FC, useState } from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { HeldCard } from "../Card/HeldCard";

import "./Player.scss"

type PlayerProps = {
    info: IPlayer
}

export const Player: FC<PlayerProps> = ({ info: { nick, heldCards } }) => {
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
                        key={`${nick}PlayerCard${i}`}>
                    </HeldCard>
                )}
            </div>
        </div>
    );
}