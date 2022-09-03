import React from "react";
import {History} from "./History";
import {Players} from "../Players/Players";
import {Solitaire} from "./Solitaire";

import "./MainLayout.scss"
import {TokenStorage} from "../Tokens/TokenStorage";
import {TokenType} from "../Tokens/Token";

export const MainLayout = () => {
    const players = [{
        nickname: 'staziz',
        cards: [
            {number: 1, color: 'green'},
            {number: 2, color: 'red'},
            {number: 3, color: 'yellow'},
            {number: 4, color: 'white'},
            {number: 5, color: 'green'}
        ]
    }, {
        nickname: 'jalechaki',
        cards: [
            {number: 1, color: 'blue'},
            {number: 2, color: 'white'},
            {number: 3, color: 'blue'},
            {number: 4, color: 'red'},
            {number: 5, color: 'yellow'}
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