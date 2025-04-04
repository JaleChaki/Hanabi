import "./Toast.scss";
import React, { FC, useEffect, useState } from "react";

export enum ToastType {
    Success = "success",
    Error = "error",
    Info = "info",
    Warning = "warning",
}
export type IToastProps = {
    message: string,
    type: ToastType,
    duration?: number,
    isVisible?: boolean,
    onClose?: () => void
}
export const Toast: FC<IToastProps> = ({ message, type, duration = 3000, isVisible = false, onClose }) => {
    const [visible, setVisible] = useState(isVisible);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);
        
        return () => clearTimeout(timer);
    }, [duration]);
    
    useEffect(() => {
        setVisible(isVisible);
        !isVisible && onClose?.();
    }, [isVisible]);

    return (
        <div className={`toast ${type} ${visible ? "visible" : ""}`}>
            {message}
        </div>
    );
}
