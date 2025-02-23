import { ICard } from "../../../SerializationInterfaces/ICard";

export default class CardFilterCriteria {
    public isEqual: boolean; 
    public color?: number;
    public number?: number;
    isEmpty: boolean;
    public constructor(equals?: boolean, color?: number, number?: number) {
        this.isEmpty = equals === undefined;
        this.isEqual = equals === undefined ? false: equals;
        this.color = color;
        this.number = number;
    }

    public testCard(card: ICard): boolean {
        if(this.isEmpty) return false;
        if(this.isEqual) {
            if(this.color !== undefined) return card.color === this.color;
            if(this.number !== undefined) return card.number === this.number;
            return false;
        } else {
            if(this.color !== undefined) return card.color !== this.color;
            if(this.number !== undefined) return card.number !== this.number;
            return false;
        }
    }

    public equals(other: CardFilterCriteria): boolean {
        return this.isEmpty && this.isEmpty === other.isEmpty 
            || this.isEqual === other.isEqual 
                && this.color === other.color
                && this.number === other.number;
    }
}