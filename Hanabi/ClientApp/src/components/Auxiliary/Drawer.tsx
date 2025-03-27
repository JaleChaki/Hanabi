import "./Drawer.scss";
import React, { FC, ReactNode } from "react";

type DrawerProps = {
    title?: string,
    isOpen?: boolean,
    children?: Array<JSX.Element | ReactNode | null> | any,
    onClose?: () => void
}

export const Drawer: FC<DrawerProps> = ({ title, isOpen, children, onClose }) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose?.();
        }
    };
    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);
    return (
        <div className={`drawer ${isOpen ? "open" : ""}`}>
            <div className="drawer-header">
                <button className="drawer-close-button" onClick={onClose}>X</button>
                <h4 className="drawer-title">{title ?? "Default drawer title"}</h4>
            </div>
            <div className="drawer-content">
                {children}
            </div>
            <div className="drawer-overlay" onClick={onClose}></div>
        </div>
    );
}