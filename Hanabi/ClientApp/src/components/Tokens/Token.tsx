import React, { FC } from "react"

import "./Token.scss"

export enum TokenType {
    Info,
    Fuse
}
interface TokenProps {
    type: TokenType,
    className?: string
}

export const Token : FC<TokenProps> = ({type, className}) => {
    const imageName = type === TokenType.Fuse ? "fuse_token" : "info_token";
    return (
        <img src={require(`./icons/${imageName}.svg`)} className={`token-icon rounded-circle ${className}`} alt={imageName}/>
    )
}