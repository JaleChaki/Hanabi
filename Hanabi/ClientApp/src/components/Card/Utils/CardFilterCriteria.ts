import { ICard } from "../../../SerializationInterfaces/ICard";

export default class CardFilterCriteria {
    public equals: boolean; 
    public color?: number;
    public number?: number;
    isEmpty: boolean;
    public constructor(equals?: boolean, color?: number, number?: number) {
        this.isEmpty = equals === undefined;
        this.equals = equals === undefined ? false: equals;
        this.color = color;
        this.number = number;
    }

    public testCard(card: ICard): boolean {
        if(this.isEmpty) return false;
        if(this.equals) {
            if(this.color !== undefined) return card.color === this.color;
            if(this.number !== undefined) return card.number === this.number;
            return false;
        } else {
            if(this.color !== undefined) return card.color !== this.color;
            if(this.number !== undefined) return card.number !== this.number;
            return false;
        }
    }
}