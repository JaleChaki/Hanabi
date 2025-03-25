import React, { FC, ReactNode, useEffect } from "react";
import "./Popup.scss";

type PopupProps = {
    title?: string,
    children?: Array<JSX.Element | ReactNode | null> | any,
    isOpen?: boolean,
    onClose?: (returnValue: any) => void
}

export const Popup: FC<PopupProps> = ({ title, children, isOpen, onClose }) => {
    const dialogRef = React.createRef<HTMLDialogElement>();
    useEffect(() => {
        if (isOpen && !dialogRef.current?.open) {
            dialogRef.current?.showModal();
        } else if(dialogRef.current?.open) {
            dialogRef.current?.close();
        }
    }, [isOpen]);
    useEffect(() => {
        const closePopup = () => onClose?.(dialogRef.current?.returnValue === "default" ? null : dialogRef.current?.returnValue);
        dialogRef.current?.addEventListener("close", closePopup);
        return () => dialogRef.current?.removeEventListener("close", closePopup);
    }, [onClose]);
    return (
        <dialog ref={dialogRef} className="popup">
            <div className="popup-header">
                <h4>{title ?? "Default popup value"}</h4>
                <button className="popup-close-button" onClick={() => onClose?.(null)}>X</button>
            </div>
            <div className="popup-content">
                {children}
            </div>
        </dialog>
    )
}