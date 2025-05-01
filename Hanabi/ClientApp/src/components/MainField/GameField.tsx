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
import { getColorClassName } from "../Card/ColorUtils";
import { FloatingActionButton } from "../Auxiliary/FloatingActionButton";

type GameFieldProps = {
    gameState: IGameState,
    playerActions: IPlayerActions,
    leaveGame: () => {}
}

export const GameField: FC<GameFieldProps> = ({
    gameState: { turnIndex, players, discardPile, informationTokens, fuseTokens, fireworks, cardsInDeck },
    playerActions,
    leaveGame
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
            <SidePanel openedStateTitle="Game history" isOpen={false} position={isMobile ? PanelPosition.top : PanelPosition.left}>
                <SidePanelItem compactContent={
                    <img src={require("./icons/drawer-hamburger-menu.svg").default} alt="Open game history drawer" />
                } expandedContent={
                    <History discardPile={discardPile} key="game-state-history" />
                } />
                <SidePanelContents>
                    <SidePanel openedStateTitle="Game state" isOpen={false} position={PanelPosition.bottom}>
                        <SidePanelItem compactContent={
                            <span>Deck: {cardsInDeck} cards</span>
                        } expandedContent={
                            <Deck name="Deck:" cardsInDeck={cardsInDeck} key="game-state-deck" />
                        } />
                        <SidePanelItem compactContent={
                            <span className="footer-fireworks-item">Fireworks:
                                {fireworks.map((color, index) =>
                                    <span className={getColorClassName(index + 1)} key={`footer-color-${index}`}>{color}</span> // TODO: game mode
                                )}
                            </span>
                        } expandedContent={
                            <Solitaire fireworks={fireworks} key="game-state-solitare" />
                        } />
                        <SidePanelItem compactContent={
                            <span><Token type={TokenType.Info} />: {informationTokens}</span>
                        } expandedContent={
                            <TokenStorage type={TokenType.Info} currentCount={informationTokens} key="game-state-info-token-storage" />
                        } />
                        <SidePanelItem compactContent={
                            <span><Token type={TokenType.Fuse} />: {fuseTokens}</span>
                        } expandedContent={
                            <TokenStorage type={TokenType.Fuse} currentCount={fuseTokens} key="game-state-fuse-token-storage" />
                        } />
                        <SidePanelContents>
                            <div className="main-wrapper">
                                <Players turnIndex={turnIndex} players={players} actions={playerActions} />
                            </div>
                        </SidePanelContents>
                    </SidePanel>
                </SidePanelContents>
            </SidePanel>
            <FloatingActionButton icon={require("./icons/leave.png")} tooltipText="Leave game" onClick={leaveGame} />
        </Fragment>
    );
}