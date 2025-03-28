import { FC, ReactNode } from "react";

type SidePanelContentsProps = {
    children: Array<JSX.Element | ReactNode | null> | any
}

export const SidePanelContents: FC<SidePanelContentsProps> = ({ children }) => children;