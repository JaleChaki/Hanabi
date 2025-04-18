import "./SidePanel.scss";
import React, { Children, FC, isValidElement, MouseEvent, ReactElement, ReactNode, useState } from "react";
import { Drawer } from "../Drawer";
import { SidePanelItem, SidePanelItemProps } from "./SidePanelItem";
import { SidePanelContents } from "./SidePanelContents";

export enum PanelPosition {
    top,
    bottom,
    left,
    right
}
type SidePanelProps = {
    openedStateTitle?: string,
    isOpen?: boolean,
    position?: PanelPosition,
    children?: ReactElement<SidePanelItemProps> | ReactElement<SidePanelItemProps>[]
}

export const SidePanel: FC<SidePanelProps> = ({ openedStateTitle, isOpen, position = PanelPosition.left, children }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(!isOpen);
    const panelItems: ReactElement<SidePanelItemProps>[] = [];
    let mainContent: ReactNode = null;

    Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return;

        if (child.type === SidePanelItem) {
            panelItems.push(child as ReactElement<SidePanelItemProps>);
        } else if (child.type === SidePanelContents) {
            mainContent = child;
        }
    });
    const renderItems = (compact: boolean) => panelItems.map((item, idx) => {
        const { compactContent, expandedContent } = item.props as SidePanelItemProps;
        return compact
            ? <div key={idx} className="side-panel-item">{compactContent}</div>
            : expandedContent;
    });
    return (
        <div className={`side-panel ${isCollapsed ? "collapsed" : ""} position-${PanelPosition[position]}`}>
            <div className="side-panel-items" onClick={() => isCollapsed && setIsCollapsed(false)}>
                {renderItems(true)}
            </div>
            <Drawer title={openedStateTitle}
                isOpen={!isCollapsed}
                position={position}
                onClose={() => setIsCollapsed(true)}>
                {renderItems(false)}
            </Drawer>
            {mainContent &&
                <div className="side-panel-contents">
                    {mainContent}
                </div>
            }
        </div>
    );
};