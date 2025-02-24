import React, { FC } from "react";
import { FireworkCard } from "../Card/FireworkCard";

import "./Solitare.scss"

interface SolitareProps {
    fireworks: Array<number>
}

export const Solitaire: FC<SolitareProps> = ({ fireworks }) => {
    return (
        <div className="fireworks">
            {fireworks.map((cardsPlayed, colorIndex) =>
                <div className="firework" key={colorIndex}>
                    {[...Array(cardsPlayed).keys()].map(cardNumber =>
                        <FireworkCard color={colorIndex + 1} number={cardNumber + 1} key={`color_${colorIndex}+number_${cardNumber}`}/>
                    )}
                </div>
            )}
        </div>
    )
}