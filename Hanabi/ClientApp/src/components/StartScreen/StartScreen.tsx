import React, { FC, useState } from "react";
import "./StartScreen.scss";

type StartScreenProps = {
    nickName: string
}

export const StartScreen: FC<StartScreenProps> = ({ nickName }) => {
    const [userName, setUserName] = useState<string>(nickName);
    return(
        <div className="start-screen">
            <label>
                <p>Username:</p>
                <input type="text" className="username" value={userName} onChange={e => setUserName(e.target.value)} required/>
            </label>
            <div className="start-screen-actions">
                <button><img src={require("./icons/new_game_light.svg").default} alt="Start new game"/></button>
                <button><img src={require("./icons/join_game.svg").default} alt="Join game"/></button>
            </div>
        </div>
    );
}