import React, {FC} from "react"
import {Token, TokenType} from "./Token";

import "./TokenStorage.scss"

type TokenStorageProps = {
    type: TokenType,
    currentCount: number
}

export const TokenStorage: FC<TokenStorageProps> = ({type, currentCount}) => {
    const maxCount = type === TokenType.Fuse ? 3 : 8;
    if (maxCount < currentCount)
        // TODO: add some error notification?
        currentCount = maxCount
    return (
        <div className="token-storage-wrapper">
            <strong className="token-storage-count">x {currentCount}</strong>
            <div className="token-storage">
                {[...Array(currentCount).keys()].map((i) => {
                    return <Token type={type} key={`${type}Token_${i}`} className={`token-${i} div${i + 1}`}></Token>
                })}
            </div>
        </div>
    )
}