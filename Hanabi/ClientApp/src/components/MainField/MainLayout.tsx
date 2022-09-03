import React, {FC} from "react";
import {History} from "./History";
import {Players} from "../Players/Players";
import {Solitaire} from "./Solitaire";
import {TokenStorage} from "../Tokens/TokenStorage";
import {TokenType} from "../Tokens/Token";
import {IPlayer} from "../../SerializationInterfaces/IPlayer";
import {IGameState} from "../../SerializationInterfaces/IGameState";

import "./MainLayout.scss"

type MainLayoutProps = {
    gameState: IGameState
}
export const MainLayout: FC<MainLayoutProps> = ({gameState: {players}}) => {
    const players2: Array<IPlayer> = [{
        nick: 'staziz',
        heldCards: [
            {number: 1, color: 3, colorIsKnown: false, numberIsKnown: false},
            {number: 2, color: 1, colorIsKnown: false, numberIsKnown: false},
            {number: 3, color: 4, colorIsKnown: false, numberIsKnown: false},
            {number: 4, color: 5, colorIsKnown: false, numberIsKnown: false},
            {number: 5, color: 3, colorIsKnown: false, numberIsKnown: false}
        ]
    }, {
        nick: 'jalechaki',
        heldCards: [
            {number: 1, color: 2, colorIsKnown: false, numberIsKnown: false},
            {number: 2, color: 5, colorIsKnown: false, numberIsKnown: false},
            {number: 3, color: 2, colorIsKnown: false, numberIsKnown: false},
            {number: 4, color: 1, colorIsKnown: false, numberIsKnown: false},
            {number: 5, color: 4, colorIsKnown: false, numberIsKnown: false}
        ]
    }]

    return (
        <div className="main-field">
            <History></History>
            <div className="main-wrapper">
                <Players players={players}></Players>
                <div className="main-footer">
                    <div className="card-deck"></div>
                    <Solitaire></Solitaire>
                    <div className="token-storages">
                        <TokenStorage type={TokenType.Info} currentCount={8}></TokenStorage>
                        <TokenStorage type={TokenType.Fuse} currentCount={3}></TokenStorage>
                    </div>
                </div>
            </div>
        </div>
    )
}