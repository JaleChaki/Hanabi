import { IPlayer } from "../../SerializationTypes/IPlayer";
import React, { FC } from "react";
import "./Lobby.scss";
import { ShareButton } from "../Auxiliary/ShareButton";

type LobbyProps = {
    players: IPlayer[],
    gameLink: string,
    startGame: () => void,
    leaveGame: () => void
}
export const Lobby: FC<LobbyProps> = ({ players, gameLink, startGame, leaveGame }) => {
    const copyGameLink = () => {
        navigator.clipboard.writeText(gameLink);
    }

    return (
        <div className="lobby">
            <p>Players already joined:</p>
            <ul>
                {players.map(p =>
                    <li key={p.id}>{p.nick}</li>
                )}
            </ul>
            <p>
                <label htmlFor="room-code-input">Room code:</label><input id="room-code-input" type="text" readOnly value={gameLink}></input>
                <button onClick={copyGameLink}>Copy code</button>
                <ShareButton title="Hanabi" text="Join me in Hanabi!" url={gameLink} />
            </p>
            <div className="actions">
                <button disabled={players.length <= 1 || players.length > 5} onClick={startGame}>Start game</button>
                <button className="warning" onClick={leaveGame}>Leave game</button>
            </div>
        </div>
    );
}