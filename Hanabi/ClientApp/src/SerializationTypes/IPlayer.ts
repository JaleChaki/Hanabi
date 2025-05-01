import { ICard } from "./ICard";

export interface IPlayer {
    id: string,
    nick: string,
    heldCards: Array<ICard>,
    isActivePlayer: boolean,
    isSessionOwner: boolean,
    isConnected: boolean,
    isIntentionallyDisconnected: boolean
}