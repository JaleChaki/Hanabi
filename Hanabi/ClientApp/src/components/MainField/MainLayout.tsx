import React, { FC } from "react";
import { History } from "./History";
import { Players } from "../Players/Players";
import { Solitaire } from "./Solitaire";
import { TokenStorage } from "../Tokens/TokenStorage";
import { TokenType } from "../Tokens/Token";
import { IPlayer } from "../../SerializationInterfaces/IPlayer";
import { IPlayerActions } from "../Players/Player";
import { IGameState } from "../../SerializationInterfaces/IGameState";

import "./MainLayout.scss"

type MainLayoutProps = {
    gameState: IGameState,
    playerActions: IPlayerActions
}
export const MainLayout: FC<MainLayoutProps> = ({ gameState: { turnIndex, players, informationTokens, fuseTokens, fireworks }, playerActions }) => {

    return (
        <div className="main-field">
            <History></History>
            <div className="main-wrapper">
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
        </div>
    )
}