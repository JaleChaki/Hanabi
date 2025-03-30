import React, { FC } from "react";

type ShareButtonProps = {
    title: string,
    text?: string,
    url?: string
}

export const ShareButton: FC<ShareButtonProps> = ({ title, text, url }) => {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title,
                text,
                url
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            console.error('Web Share API not supported in this browser.');
        }
    };

    return (
        <button onClick={handleShare}>
            Share
        </button>
    );
};