import "./GameField.scss";
import { Drawer } from "../Auxiliary/Drawer";
import React, { FC, Fragment, ReactNode, useEffect, useState } from "react";
import { History } from "./History";
import { Players } from "../Players/Players";
import { Deck } from "../Deck";
import { Solitaire } from "./Solitaire";
import { TokenStorage } from "../Tokens/TokenStorage";
import { IGameState } from "../../SerializationTypes/IGameState";
import { IPlayerActions } from "../Players/Player";
import { TokenType } from "../Tokens/Token";
import { SidePanel } from "../Auxiliary/SidePanel";
import { SidePanelItem } from "../Auxiliary/SidePanelItem";

type GameFieldProps = {
    gameState: IGameState,
    playerActions: IPlayerActions,
}

export const GameField: FC<GameFieldProps> = ({ 
        gameState: { turnIndex, players, discardPile, informationTokens, fuseTokens, fireworks, cardsInDeck },
        playerActions
    }) => {
    const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
    React.useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isMobile = screenWidth < 768; // TODO: change sidebar position

    return (
        <Fragment>
            <SidePanel openedStateTitle="Game history" isOpen={false}>
                <SidePanelItem compactContent={
                    <img src={require("./icons/drawer-hamburger-menu.svg").default} alt="Open game history drawer"/>
                } expandedContent={
                    <History discardPile={discardPile}/>
                }/>
            </SidePanel>
            <div className="main-wrapper">
                <Players turnIndex={turnIndex} players={players} actions={playerActions} ></Players>
                <div className="main-footer">
                    <Deck name="Deck:" cardsInDeck={cardsInDeck}/>
                    <Solitaire fireworks={fireworks}></Solitaire>
                    <div className="token-storages">
                        <TokenStorage type={TokenType.Info} currentCount={informationTokens}></TokenStorage>
                        <TokenStorage type={TokenType.Fuse} currentCount={fuseTokens}></TokenStorage>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}