import React, {Component} from "react";
import {Player} from "./Player";

import "./Players.scss"

export class Players extends Component {
    constructor(params) {
        super(params);
        
    }

    render() {
        return (
            <div className="players-grid">
                {this.props.players.map((player, i) => <Player info={player} key={i}></Player>)}
            </div>

        )
    }
}