import { ICard } from "./ICard";

export interface IPlayer {
    nick: string,
    heldCards: Array<ICard>,
    isCurrentPlayer: boolean
}