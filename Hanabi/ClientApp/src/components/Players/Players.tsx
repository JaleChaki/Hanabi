import React, { useState } from "react";
import { IPlayer } from "../../SerializationTypes/IPlayer";
import { IPlayerActions, Player } from "./Player";

import "./Players.scss"

export enum ActivePlayerMode {
    Hint,
    Play,
    Drop
}

export const Players = (props: { turnIndex: number, players: Array<IPlayer>, actions: IPlayerActions }) => {
    const getTurnKey = (playerIndex: number): number => playerIndex * 1000 + props.turnIndex;
    const [activePlayerMode, setActivePlayerMode] = useState<ActivePlayerMode>(ActivePlayerMode.Hint);
    return (
        <div className="players-grid">
            {props.players.map((player, i) =>
                <Player info={player} 
                        actions={props.actions} 
                        turnKey={getTurnKey(i)} 
                        key={getTurnKey(i)}
                        activePlayerMode={activePlayerMode}
                        onActivePlayerModeChanged={setActivePlayerMode}/>
                )}
        </div>
    )
}