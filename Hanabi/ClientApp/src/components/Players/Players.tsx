import React from "react";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { IPlayerActions, Player } from "./Player";

import "./Players.scss"

export const Players = (props: { turnIndex: number, players: Array<IPlayer>, actions: IPlayerActions }) => {
    const getTurnKey = (playerIndex: number): number => playerIndex * 1000 + props.turnIndex; 
    return (
        <div className="players-grid">
            {props.players.map((player, i) =>
                <Player info={player} actions={props.actions} turnKey={getTurnKey(i)} key={getTurnKey(i)}></Player>)}
        </div>
    )
}