import React, { FC } from "react";
import { GameStatus } from "../../SerializationTypes/GameStatus";

type GameEndPanelProps = {
    status: GameStatus
    totalScore: number
}
export const GameEndPanel: FC<GameEndPanelProps> = ({ status, totalScore }) => {
    return(
        <div className="game-end-panel">
            <h1>You {status === GameStatus.FlawlessVictory ? "dramatically" : ""} {status === GameStatus.Failure ? "failed!" : "won the game!"}</h1>
            {status !== GameStatus.Failure 
                ? <h2>Congratulations on {status === GameStatus.FlawlessVictory ? "such a tremendous" : ""} success!</h2>
                : null
            }
            {status === GameStatus.Victory
                ? <h3>Your final score is {totalScore}. Try harder next time, and maybe you'll do it even better :)</h3>
                : null
            }
            <h4>Good luck next time!</h4>
        </div>
    );
}