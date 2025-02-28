import React, { FC } from "react";
import { History } from "./History";
import { Players } from "../Players/Players";
import { Solitaire } from "./Solitaire";
import { TokenStorage } from "../Tokens/TokenStorage";
import { TokenType } from "../Tokens/Token";
import { IPlayer } from "../../SerializationTypes/IPlayer";
import { IPlayerActions } from "../Players/Player";
import { IGameState } from "../../SerializationTypes/IGameState";

import "./MainLayout.scss"
import { GameStatus } from "../../SerializationTypes/GameStatus";
import { GameEndPanel } from "./GameEndPanel";
import { HeldCard } from "../Card/HeldCard";

type MainLayoutProps = {
    gameState: IGameState,
    playerActions: IPlayerActions,
    startGame: () => {}
}
export const MainLayout: FC<MainLayoutProps> = ({ 
        gameState: { turnIndex, players, informationTokens, fuseTokens, fireworks, gameStatus, cardsInDeck }, 
        playerActions,
        startGame 
    }) => {

    return (
        <div className="main-field">
            <History></History>
            {gameStatus === GameStatus.Pending ?
                <div>
                    <p>Players already joined:</p>
                    <ul>
                        {players.map(p => 
                            <li>{p.nick}</li>
                        )}
                    </ul>
                    <button onClick={startGame}>Start game</button>
                </div>
                : gameStatus === GameStatus.InProgress
                    ? <div className="main-wrapper">
                        <Players turnIndex={turnIndex} players={players} actions={playerActions} ></Players>
                        <div className="main-footer">
                            <div className="card-deck">
                                <p><strong>Deck:</strong></p>
                                {[...Array(cardsInDeck > 5 ? 5 : cardsInDeck).keys()].map(cardIndex =>
                                    <HeldCard color={0} colorIsKnown={false} number={0} numberIsKnown={false} isOwn={true} key={cardIndex} />
                                )}
                            </div>
                            <Solitaire fireworks={fireworks}></Solitaire>
                            <div className="token-storages">
                                <TokenStorage type={TokenType.Info} currentCount={informationTokens}></TokenStorage>
                                <TokenStorage type={TokenType.Fuse} currentCount={fuseTokens}></TokenStorage>
                            </div>
                        </div>
                    </div>
                    : <div className="main-wrapper">
                        <GameEndPanel status={gameStatus} totalScore={fireworks.reduce((acc, cur) => acc + cur, 0)}/>
                    </div>
            }
        </div>
    )
}