import React from "react";
import {History} from "./History";
import {Players} from "../Players/Players";
import {Solitaire} from "./Solitaire";

import "./MainLayout.scss"

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
                    <div className="info-tokens"></div>
                    <div className="fuse-tokens"></div>
                </div>
            </div>
        </div>
    )
}