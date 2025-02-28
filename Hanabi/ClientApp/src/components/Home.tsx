import React, { useEffect, useRef, useState } from 'react';
import * as signalR from "@microsoft/signalr";
import { MainLayout } from "./MainField/MainLayout";
import { HubConnection } from "@microsoft/signalr";
import { IGameState } from '../SerializationTypes/IGameState';
import { IPlayerActions } from './Players/Player';
import { StartScreen } from './StartScreen/StartScreen';

export const Home = (props: { loginAccessToken: string, userId: string, userNickName: string }) => {
    const [gameState, setGameState] = useState<IGameState>({} as any);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
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
    const { loginAccessToken, userId, userNickName } = props;
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
            .withAutomaticReconnect()
            .build();

        connection.current.on("SetGameState", (gameState: IGameState) => {
            // TODO: optimize rendering by not returning anything if turn number is the same as in previous state
            setGameState(gameState);
        });

        connection.current.on("RequestUpdate", _ => {
            // TODO: optimize rendering by not returning anything if turn number is the same as in previous state
            getGameState();
        });

        connection.current.start().then(registerPlayer).then(setIsRegistered);
    }

    const registerPlayer = () =>
        connection.current.invoke("RegisterPlayer", userNickName).catch(function (err) {
            return console.error(err.toString());
        });

    const createGame = () =>
        connection.current.invoke("CreateGame").catch(function (err) {
            return console.error(err.toString());
        }).then(setIsPlayerReady);

    const joinGame = () =>
        connection.current.invoke("JoinGame").catch(function (err) {
            return console.error(err.toString());
        });

    const startGame = () =>
        connection.current.invoke("StartGame").catch(function (err) {
            return console.error(err.toString());
        });

    const getGameState = () =>
        connection.current.invoke("GetGameState").catch(function (err) {
            return console.error(err.toString());
        });

    if (!isRegistered) {
        return <span>Loading...</span>
    } else if(!isPlayerReady) {
        return <StartScreen nickName={userNickName} createGame={createGame} joinGame={joinGame}/>
    } else {
        if(!Object.prototype.hasOwnProperty.call(gameState, 'gameStatus'))
            return <span>Loading...</span>
        else
            return <MainLayout gameState={gameState} playerActions={playerActions} startGame={startGame}/>
    }
}
