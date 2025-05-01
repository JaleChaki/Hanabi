import React, { FC } from "react";
import { IPlayerActions } from "../Players/Player";
import { IGameState } from "../../SerializationTypes/IGameState";

import "./MainLayout.scss"
import { GameStatus } from "../../SerializationTypes/GameStatus";
import { GameEndPanel } from "./GameEndPanel";
import { Lobby } from "./Lobby";
import { GameField } from "./GameField";

type MainLayoutProps = {
    gameState: IGameState,
    playerActions: IPlayerActions,
    startGame: () => {},
    leaveGame: () => {}
}
export const MainLayout: FC<MainLayoutProps> = ({ gameState, playerActions, startGame, leaveGame }) => {
    const { gameStatus, players, gameLink, fireworks } = gameState;

    return (
        <div className="main-field">
            {gameStatus === GameStatus.Pending
                ? <Lobby players={players} gameLink={gameLink} startGame={startGame} leaveGame={leaveGame} />
                : gameStatus === GameStatus.InProgress
                    ? <GameField gameState={gameState} playerActions={playerActions} leaveGame={leaveGame} />
                    : <GameEndPanel status={gameStatus} totalScore={fireworks.reduce((acc, cur) => acc + cur, 0)} />
            }
        </div>
    )
}