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
import { Token, TokenType } from "../Tokens/Token";
import { PanelPosition, SidePanel } from "../Auxiliary/SidePanel/SidePanel";
import { SidePanelItem } from "../Auxiliary/SidePanel/SidePanelItem";
import { SidePanelContents } from "../Auxiliary/SidePanel/SidePanelContents";

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
        <SidePanel openedStateTitle="Game history" isOpen={false} position={isMobile ? PanelPosition.top : PanelPosition.left}>
            <SidePanelItem compactContent={
                <img src={require("./icons/drawer-hamburger-menu.svg").default} alt="Open game history drawer" />
            } expandedContent={
                <History discardPile={discardPile} />
            } />
            <SidePanelContents>
                <SidePanel openedStateTitle="Game state" isOpen={false} position={PanelPosition.bottom}>
                    <SidePanelItem compactContent={
                        <span>Deck: {cardsInDeck} cards</span>
                    } expandedContent={
                        <Deck name="Deck:" cardsInDeck={cardsInDeck} />
                    } />
                    <SidePanelItem compactContent={
                        <span>Fireworks: {fireworks}</span> // TODO: add fireworks colors
                    } expandedContent={
                        <Solitaire fireworks={fireworks}></Solitaire>
                    } />
                    <SidePanelItem compactContent={
                        <span><Token type={TokenType.Info}/>: {informationTokens}</span>
                    } expandedContent={
                        <TokenStorage type={TokenType.Info} currentCount={informationTokens}></TokenStorage>
                    } />
                    <SidePanelItem compactContent={
                        <span><Token type={TokenType.Fuse}/>: {fuseTokens}</span>
                    } expandedContent={
                        <TokenStorage type={TokenType.Fuse} currentCount={fuseTokens}></TokenStorage>
                    } />
                    <SidePanelContents>
                        <div className="main-wrapper">
                            <Players turnIndex={turnIndex} players={players} actions={playerActions} />
                        </div>
                    </SidePanelContents>
                </SidePanel>
            </SidePanelContents>
        </SidePanel>
    );
}