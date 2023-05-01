import React from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { IPlayerActions, Player } from "./Player";

import "./Players.scss"

export const Players = (props: { players: Array<IPlayer>, actions: IPlayerActions }) => {
    return (
        <div className="players-grid">
            {props.players.map((player, i) =>
                <Player info={player} actions={props.actions} key={i}></Player>)}
        </div>
    )
}