import { GameStatus } from "./GameStatus";
import { ICard } from "./ICard";
import { IPlayer } from "./IPlayer";

export interface IGameState {
    cardsInDeck: number,
    fireworks: Array<number>,
    informationTokens: number,
    fuseTokens: number,
    players: Array<IPlayer>,
    discardPile: Array<ICard>,
    turnIndex: number,
    gameStatus: GameStatus,
    gameLink: string
}