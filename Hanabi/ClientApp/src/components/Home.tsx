import React, { Fragment, useEffect, useRef, useState } from 'react';
import * as signalR from "@microsoft/signalr";
import { MainLayout } from "./MainField/MainLayout";
import { HubConnection } from "@microsoft/signalr";
import { IGameState } from '../SerializationTypes/IGameState';
import { IPlayerActions } from './Players/Player';
import { StartScreen } from './StartScreen/StartScreen';
import { Toast, ToastType } from './Auxiliary/Toast';

export const Home = (props: { loginAccessToken: string, userId: string, userNickName: string }) => {
    const [gameState, setGameState] = useState<IGameState>({} as any);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [errorToastMessage, setErrorToastMessage] = useState("Default error message");
    const [errorToastVisible, setErrorToastVisible] = useState(false);
    const playerActions: IPlayerActions = {
        makeHintByColor(id, cardcolor) {
            connection.current.invoke("MakeColorHint", id, cardcolor);
        },
        makeHintByNumber(id, cardNumber) {
            connection.current.invoke("MakeNumberHint", id, cardNumber);
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

        connection.current.on("Error", message => {
            setErrorToastMessage(message ?? "Something went wrong. Please try again later.");
            setErrorToastVisible(true);
        });

        connection.current.start().then(registerPlayer).then(setIsRegistered).then(tryRestoreSession);
    }

    const registerPlayer = () =>
        connection.current.invoke("RegisterPlayer", userNickName).catch(function (err) {
            return console.error(err.toString());
        });

    const tryRestoreSession = () =>
        getGameState().then(setIsPlayerReady).catch(function (err) {
            return console.error(err.toString());
        });

    const createGame = () =>
        connection.current.invoke("CreateGame").catch(function (err) {
            return console.error(err.toString());
        }).then(setIsPlayerReady);

    const joinGame = (gameLink: string) =>
        connection.current.invoke("JoinGame", gameLink).catch(function (err) {
            return console.error(err.toString());
        }).then(setIsPlayerReady);

    const startGame = () =>
        connection.current.invoke("StartGame").catch(function (err) {
            return console.error(err.toString());
        });

    const getGameState = () =>
        connection.current.invoke("GetGameState").catch(function (err) {
            return console.error(err.toString());
        });

    return (
        <Fragment>
            {!isRegistered
                ? <span>Loading...</span>
                : !isPlayerReady
                    ? <StartScreen nickName={userNickName} createGame={createGame} joinGame={joinGame} />
                    : !Object.prototype.hasOwnProperty.call(gameState, 'gameStatus')
                        ? <span>Loading...</span>
                        : <MainLayout gameState={gameState} playerActions={playerActions} startGame={startGame} />
            }
            <Toast message={errorToastMessage} type={ToastType.Error} isVisible={errorToastVisible} onClose={() => setErrorToastVisible(false)} />
        </Fragment>
    )
}
