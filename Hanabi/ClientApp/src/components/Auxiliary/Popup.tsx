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
        } else if (dialogRef.current?.open) {
            dialogRef.current?.close();
        }
    }, [isOpen]);
    useEffect(() => {
        const closePopup = () => onClose?.(dialogRef.current?.returnValue === "default" ? null : dialogRef.current?.returnValue);
        dialogRef.current?.addEventListener("close", closePopup);
        return () => dialogRef.current?.removeEventListener("close", closePopup);
    }, [onClose]);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose?.(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);
    useEffect(() => {
        let isDragging = false;
        var offset = { x: 0, y: 0 };
        const handlePointerDown = (event: MouseEvent) => {
            const dialog = dialogRef.current!;
            isDragging = true;

            offset.x = event.clientX - dialog.offsetLeft;
            offset.y = event.clientY - dialog.offsetTop;
            document.addEventListener("pointermove", handlePointerMove);
        }
        const handlePointerMove = (event: MouseEvent) => {
            if (isDragging) {
                const dialog = dialogRef.current!;
                
                dialog.style.left = `${event.clientX - offset.x}px`;
                dialog.style.top = `${event.clientY - offset.y}px`;
            }
        }
        const handlePointerUp = () => {
            isDragging = false;
            document.removeEventListener("pointermove", handlePointerMove);
        }
        const handlePointerLeave = () => {
            isDragging = false;
            document.removeEventListener("pointermove", handlePointerMove);
        }
        const headerEl = dialogRef.current!.querySelector('.popup-header') as HTMLDivElement;
        if (!headerEl || !isOpen) return;
        headerEl.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("pointerup", handlePointerUp);
        document.addEventListener("pointerleave", handlePointerLeave);
        return () => {
            headerEl.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("pointerup", handlePointerUp);
            document.removeEventListener("pointerleave", handlePointerLeave);
        }
    }, [isOpen]);
    return (
        <dialog ref={dialogRef} className="popup">
            <div className="popup-header">
                <h4 className="popup-title">{title ?? "Default popup tile"}</h4>
                <button className="popup-close-button" onClick={() => onClose?.(null)}>X</button>
            </div>
            <div className="popup-content">
                {children}
            </div>
        </dialog>
    )
}