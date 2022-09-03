import React, {FC, useState} from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";

import "./Player.scss"

type PlayerProps = {
    info: IPlayer
}

export const Player: FC<PlayerProps> = ({info: {nick, heldCards}}) => {
    return (
        <div className="player">
            <p><strong>Nick: </strong>{nick}</p>
            <div className="cards-wrapper">
                {heldCards.map((card, i) =>
                    <div className={`playing-card card-${i}`} key={`${nick}PlayerCard${i}`}>
                        <div className="card-container">
                            <span>{card.number}</span>
                            <div className={`card-square color-${card.color}`}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}