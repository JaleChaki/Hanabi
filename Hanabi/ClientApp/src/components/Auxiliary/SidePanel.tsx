import "./SidePanel.scss";
import React, { Children, FC, isValidElement, MouseEvent, ReactElement, useState } from "react";
import { Drawer } from "./Drawer";
import { SidePanelItemProps } from "./SidePanelItem";

type SidePanelProps = {
    openedStateTitle?: string,
    isOpen?: boolean,
    children?: ReactElement<SidePanelItemProps> | ReactElement<SidePanelItemProps>[]
}

export const SidePanel: FC<SidePanelProps> = ({ openedStateTitle, isOpen, children }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(!isOpen);
    return (
        <div className="side-panel" onClick={() => isCollapsed && setIsCollapsed(false) }>
            {Children.map(children, (child) => {
                if(!isValidElement(child)) return null;
                const { compactContent, expandedContent } = child.props as SidePanelItemProps;
                return isCollapsed
                    ? <div className="side-panel-item">{compactContent}</div>
                    : <Drawer title={openedStateTitle} isOpen={true} onClose={() => setIsCollapsed(true)}>{expandedContent}</Drawer>
                })
            }
        </div>
    );
};