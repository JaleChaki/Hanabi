import "./Drawer.scss";
import React, { FC, ReactNode } from "react";

type DrawerProps = {
    isOpen?: boolean,
    children?: Array<JSX.Element | ReactNode | null> | any,
    onClose?: () => void
}

export const Drawer: FC<DrawerProps> = ({ isOpen, children, onClose }) => {
    return (
        <div className={`drawer ${isOpen ? "open" : ""}`}>
            <div className="drawer-content">
                <button className="drawer-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}