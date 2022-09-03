import React, {FC, useState} from "react";

import "./Player.scss"

export interface IPlayer {
    nickname: string;
    cards: Array<{ number: number, color: string }>
}

type PlayerProps = {
    info: IPlayer
}

export const Player: FC<PlayerProps> = ({info: {nickname, cards}}) => {
    return (
        <div className="player">
            <p><strong>Nick: </strong>{nickname}</p>
            <div className="cards-wrapper">
                {cards.map((card, i) =>
                    <div className={`playing-card card-${i}`} key={`${nickname}PlayerCard${i}`}>
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