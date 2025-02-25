import React, { Fragment, useEffect, useRef, useState } from 'react';
import * as signalR from "@microsoft/signalr";
import { MainLayout } from "./MainField/MainLayout";
import { HubConnection } from "@microsoft/signalr";
import { IGameState } from '../SerializationTypes/IGameState';
import { IPlayerActions } from './Players/Player';

export const Home = (props: { loginAccessToken: string }) => {
    const [gameState, setGameState] = useState<IGameState>({} as any);
    const playerActions: IPlayerActions = {
        makeHintByColor(nickname, cardcolor) {
            connection.current.invoke("MakeColorHint", nickname, cardcolor);
        },
        makeHintByNumber(nickname, cardNumber) {
            connection.current.invoke("MakeNumberHint", nickname, cardNumber);
        },
        playCard(cardIndex) {
            connection.current.invoke("PlayCard", cardIndex);
        },
        dropCard(cardIndex) {
            connection.current.invoke("DropCard", cardIndex);
        },
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
            // TODO: optimize rendering by not returning anything if turn number is the same as in previous state
            setGameState(gameState);
        });

        connection.current.on("RequestUpdate", _ => {
            // TODO: optimize rendering by not returning anything if turn number is the same as in previous state
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
            </Fragment>
        );
    }
}
