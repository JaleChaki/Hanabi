import React from "react";
import {IPlayer} from "../../SerializationInterfaces/IPlayer";
import {Player} from "./Player";

import "./Players.scss"

export const Players = (props: { players: Array<IPlayer> }) => {
    return (
        <div className="players-grid">
            {props.players.map((player, i) => <Player info={player} key={i}></Player>)}
        </div>
    )
}