import React, {Component} from "react";
import "./Card.scss"

export type TrashCanCardProps = {
    cardsInTrash: number;
}

export class TrashCanCard extends Component<{}, TrashCanCardProps> {

    cardsInTrash: number;

    constructor(props: TrashCanCardProps) {
        super(props);
        this.cardsInTrash = props.cardsInTrash;
    }

    render() {
        return (
            <div className="card trash-can-card">
                <div className="deck-card-number">
                    <p>{this.cardsInTrash} in trash</p>
                </div>
            </div>
        );
    }

}