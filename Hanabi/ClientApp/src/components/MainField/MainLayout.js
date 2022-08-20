import React, {Component} from "react";
import {History} from "./History";
import {Solitaire} from "./Solitaire";

import "./MainLayout.scss"
import {Players} from "../Players/Players";

export class MainLayout extends Component {
    constructor(params) {
        super(params);
        this.players = [{
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
    }

    render() {
        return (
            <div className="main-field">
                <History></History>
                <div className="main-wrapper">
                    <Players players={this.players}></Players>
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
}