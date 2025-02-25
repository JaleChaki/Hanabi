﻿import React, { FC } from "react";
import { History } from "./History";
import { Players } from "../Players/Players";
import { Solitaire } from "./Solitaire";
import { TokenStorage } from "../Tokens/TokenStorage";
import { TokenType } from "../Tokens/Token";
import { IPlayer } from "../../SerializationTypes/IPlayer";
import { IPlayerActions } from "../Players/Player";
import { IGameState } from "../../SerializationTypes/IGameState";

import "./MainLayout.scss"
import { GameStatus } from "../../SerializationTypes/GameStatus";
import { GameEndPanel } from "./GameEndPanel";

type MainLayoutProps = {
    gameState: IGameState,
    playerActions: IPlayerActions
}
export const MainLayout: FC<MainLayoutProps> = ({ gameState: { turnIndex, players, informationTokens, fuseTokens, fireworks, gameStatus }, playerActions }) => {

    return (
        <div className="main-field">
            <History></History>
            {gameStatus === GameStatus.InProgress
                ? <div className="main-wrapper">
                    <Players turnIndex={turnIndex} players={players} actions={playerActions} ></Players>
                    <div className="main-footer">
                        <div className="card-deck"></div>
                        <Solitaire fireworks={fireworks}></Solitaire>
                        <div className="token-storages">
                            <TokenStorage type={TokenType.Info} currentCount={informationTokens}></TokenStorage>
                            <TokenStorage type={TokenType.Fuse} currentCount={fuseTokens}></TokenStorage>
                        </div>
                    </div>
                </div>
                : <div className="main-wrapper">
                    <GameEndPanel status={gameStatus} totalScore={fireworks.reduce((acc, cur) => acc + cur, 0)}/>
                </div>
            }
        </div>
    )
}