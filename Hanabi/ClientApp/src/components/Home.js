import React, {Component} from 'react';
import * as signalR from "@microsoft/signalr";

export class Home extends Component {
    static displayName = Home.name;
    connection;

    constructor() {
        super();
        this.state = {
            cardsInDeck: 1488,
            fireworks: [],
            informationTokens: 8,
            fuseTokens: 3
        }
        this.getGameState = this.getGameState.bind(this);
        this.initHubConnection = this.initHubConnection.bind(this);
    }

    componentDidMount() {
        this.initHubConnection();
    }

    initHubConnection() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/gamehub", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();

        this.connection.on("SetGameState", gameState => {
            this.setState(gameState);
        });

        this.connection.start().then(() => {
            this.getGameState();
        }).catch(function (err) {
            return console.error(err.toString());
        });

    }

    getGameState() {
        this.connection.invoke("GetGameState").catch(function (err) {
            return console.error(err.toString());
        });
    }

    render() {
        return (
            <div>
                <div className={"cardsDeck"}>{this.state.cardsInDeck}</div>
                {this.state.fireworks.map((firework, i) => 
                    <div className={"firework"} key={i}>{firework}</div>
                )}
                <div className={"informationTokens"}>{this.state.informationTokens}</div>
                <div className={"fuseTokens"}>{this.state.fuseTokens}</div>
                <button onClick={this.getGameState}>Get game state</button>
            </div>
        );
    }
}
