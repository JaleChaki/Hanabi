import React, { FC, useState } from "react";
import "./StartScreen.scss";

type StartScreenProps = {
    nickName: string,
    createGame: () => void,
    joinGame: () => void,
}

export const StartScreen: FC<StartScreenProps> = ({ nickName, createGame, joinGame }) => {
    const [userName, setUserName] = useState<string>(nickName);
    return(
        <div className="start-screen">
            <label>
                <p>Username:</p>
                <input type="text" className="username" value={userName} onBlur={e => setUserName(e.target.value)} required/>
            </label>
            <div className="start-screen-actions">
                <button onClick={createGame}>
                    <img src={require("./icons/new_game_light.svg").default} alt="Start new game"/>
                </button>
                <button onClick={joinGame}>
                    <img src={require("./icons/join_game.svg").default} alt="Join game"/>
                </button>
            </div>
        </div>
    );
}