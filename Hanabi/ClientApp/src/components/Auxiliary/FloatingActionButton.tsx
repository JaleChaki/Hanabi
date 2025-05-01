import React, { FC } from "react";
import "./FloatingActionButton.scss";

type FloatingActionButtonProps = {
    icon: any,
    disabled?: boolean,
    tooltipText?: string,
    onClick: () => void
}
export const FloatingActionButton: FC<FloatingActionButtonProps> = ({ icon, disabled, tooltipText, onClick }) => {
    return (
        <button className="floating-action-button" title={tooltipText} onClick={onClick} disabled={disabled}>
            <img className="floating-action-button-icon" src={icon} alt={tooltipText} />
        </button>
    );
}