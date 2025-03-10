import { GameStatus } from "./GameStatus";
import { IPlayer } from "./IPlayer";

export interface IGameState {
    cardsInDeck: number,
    fireworks: Array<number>,
    informationTokens: number,
    fuseTokens: number,
    players: Array<IPlayer>,
    turnIndex: number,
    gameStatus: GameStatus,
    gameLink: string
}