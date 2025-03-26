import { IPlayer } from "../../SerializationTypes/IPlayer";
import React, { FC } from "react";
import "./Lobby.scss";

type LobbyProps = {
    players: IPlayer[],
    gameLink: string,
    startGame: () => void
}
export const Lobby: FC<LobbyProps> = ({ players, gameLink, startGame }) => {
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
            <p><span>Room code:</span><input type="text" readOnly value={gameLink}></input><button onClick={copyGameLink}>Copy code</button></p>
            <button disabled={players.length <= 1} onClick={startGame}>Start game</button>
        </div>
    );
}