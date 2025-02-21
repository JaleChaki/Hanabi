import React, { Fragment, useEffect, useRef, useState } from 'react';
import * as signalR from "@microsoft/signalr";
import { MainLayout } from "./MainField/MainLayout";
import { HubConnection } from "@microsoft/signalr";
import { IGameState } from '../SerializationInterfaces/IGameState';
import { IPlayerActions } from './Players/Player';

export const Home = (props: { loginAccessToken: string }) => {
    const [cardsInDeck, setCardsInDeck] = useState(50);
    const [fireworks, setFireworks] = useState(new Array<any>());
    const [informationTokens, setInformationTokens] = useState(8);
    const [fuseTokens, setFuseTokens] = useState(3);
    const [gameState, setGameState] = useState<IGameState>({} as any);
    const playerActions: IPlayerActions = {
        makeHintByColor(nickname, cardcolor) {
            connection.current.invoke("MakeColorHint", nickname, cardcolor);
        },
        makeHintByNumber(nickname, cardNumber) {
            connection.current.invoke("MakeNumberHint", nickname, cardNumber);
        },
        dropCard() { },
        playCard() { }
    }
    const { loginAccessToken } = props;
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
            // TODO: optimize rendering
            // setCardsInDeck(gameState.cardsInDeck);
            // setFireworks(gameState.fireworks);
            // setInformationTokens(gameState.informationTokens);
            // setFuseTokens(gameState.fuseTokens);
            console.log("SetGameState");
            console.log(gameState);
            setGameState(gameState);
            console.log("____________");
        });

        connection.current.on("RequestUpdate", _ => {
            // TODO: optimize rendering
            // setCardsInDeck(gameState.cardsInDeck);
            // setFireworks(gameState.fireworks);
            // setInformationTokens(gameState.informationTokens);
            // setFuseTokens(gameState.fuseTokens);
            console.log("RequestUpdate");
            getGameState();
        });

        connection.current.start().then(getGameState);
    }

    const getGameState = () =>
        _getGameStateUnsafe().catch(function (err) {
            return console.error(err.toString());
        });

    const _getGameStateUnsafe = () =>
        connection.current.invoke("GetGameState");

    if (!Object.prototype.hasOwnProperty.call(gameState, 'fireworks')) {
        return <span>Loading...</span>
    } else {
        return (
            <Fragment>
                <MainLayout gameState={gameState} playerActions={playerActions}></MainLayout>
                <br />
                {/*<div className={"cardsDeck"}>{cardsInDeck}</div>*/}
                {/*{fireworks.map((firework, i) =>*/}
                {/*    <div className={"firework"} key={i}>{firework}</div>*/}
                {/*)}*/}
                {/*<div className={"informationTokens"}>{informationTokens}</div>*/}
                {/*<div className={"fuseTokens"}>{fuseTokens}</div>*/}
                {/*<button onClick={() => getGameState()}>Get game state</button>*/}
                <div className={"cardsDeck"}>{gameState.cardsInDeck}</div>
                {gameState.fireworks.map((firework, i) =>
                    <div className={"firework"} key={`firework-test-${i}`}>{firework}</div>
                )}
                <div className={"informationTokens"}>{gameState.informationTokens}</div>
                <div className={"fuseTokens"}>{gameState.fuseTokens}</div>
                <button onClick={() => getGameState()}>Get game state</button>
            </Fragment>
        );
    }
}
