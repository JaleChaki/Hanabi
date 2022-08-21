import React, {useEffect, useRef, useState} from 'react';
import * as signalR from "@microsoft/signalr";
import {MainLayout} from "./MainField/MainLayout";
import {HubConnection} from "@microsoft/signalr";

export interface IGameState {
    cardsInDeck: number,
    fireworks: Array<any>,
    informationTokens: number,
    fuseTokens: number
}

export const Home = (props: { loginAccessToken: string }) => {
    const [cardsInDeck, setCardsInDeck] = useState(50);
    const [fireworks, setFireworks] = useState(new Array<any>());
    const [informationTokens, setInformationTokens] = useState(8);
    const [fuseTokens, setFuseTokens] = useState(3);
    const {loginAccessToken} = props;
    const connection: React.MutableRefObject<HubConnection> = useRef({} as any);

    useEffect(() => {
        initHubConnection();
    }, []);

    const initHubConnection = () => {
        connection.current = new signalR.HubConnectionBuilder()
            .withUrl("/gamehub", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => loginAccessToken
            })
            .build();

        connection.current.on("SetGameState", (gameState: IGameState) => {
            setCardsInDeck(gameState.cardsInDeck);
            setFireworks(gameState.fireworks);
            setInformationTokens(gameState.informationTokens);
            setFuseTokens(gameState.fuseTokens);
        });

        connection.current.start().then(() => {
            getGameState();
        }).catch(function (err) {
            return console.error(err.toString());
        });

    }

    const getGameState = () => {
        connection.current.invoke("GetGameState").catch(function (err) {
            return console.error(err.toString());
        });
    }

    return (
        <div>
            <MainLayout></MainLayout>
            <div className={"cardsDeck"}>{cardsInDeck}</div>
            {fireworks.map((firework, i) =>
                <div className={"firework"} key={i}>{firework}</div>
            )}
            <div className={"informationTokens"}>{informationTokens}</div>
            <div className={"fuseTokens"}>{fuseTokens}</div>
            <button onClick={() => getGameState()}>Get game state</button>
        </div>
    );
}
