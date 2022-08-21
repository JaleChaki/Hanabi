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
            <div className="cards-wrapper">
            {props.info.cards.map((card, i) =>
                <div className={`playing-card card-${i}`} key={i}>
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