import React, {useState} from "react";

import "./Player.scss"

export interface IPlayer {
    nickname: string;
    cards: Array<{ number: number, color: string }>
}

export const Player = (props: { info: IPlayer }) => {
    return (
        <div className="player">
            <p><strong>Nick: </strong>{props.info.nickname}</p>
            <ul>
                {props.info.cards.map((card, i) =>
                    <li key={i}>
                        <div className="card-container">
                            <span>{card.number}</span>
                            <div className={`card-square color-${card.color}`}></div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}