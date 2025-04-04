import React, { FC, useState } from "react";
import "./StartScreen.scss";

type StartScreenProps = {
    nickName: string,
    createGame: () => void,
    joinGame: (gameLink: string) => void,
}

export const StartScreen: FC<StartScreenProps> = ({ nickName, createGame, joinGame }) => {
    const [userName, setUserName] = useState<string>(nickName);
    const gameLinkRegex = new RegExp("^[\\w\\-_]{22}$", "g");

    const onJoinButtonClick = () => {
        const gameLinkEntered = window.prompt("Enter a room code:");
        if(!gameLinkEntered || !gameLinkRegex.test(gameLinkEntered)) {
            alert("You need to ender a valid room code");
        } else {
            joinGame(gameLinkEntered);
        }
        gameLinkRegex.lastIndex = 0;
    }
    return(
        <div className="start-screen">
            <label>
                <p>Username:</p>
                <input type="text" className="username" defaultValue={userName} onBlur={e => setUserName(e.target.value)} required/>
            </label>
            <div className="start-screen-actions">
                <button onClick={createGame}>
                    <img src={require("./icons/new_game_light.svg").default} alt="Start new game"/>
                </button>
                <button onClick={onJoinButtonClick}>
                    <img src={require("./icons/join_game.svg").default} alt="Join game"/>
                </button>
            </div>
        </div>
    );
}