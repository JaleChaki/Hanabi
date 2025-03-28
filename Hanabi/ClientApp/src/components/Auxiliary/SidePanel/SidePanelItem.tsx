import { FC, ReactNode } from "react";

export type SidePanelItemProps = {
    compactContent?: Array<JSX.Element | ReactNode | null> | any,
    expandedContent?: Array<JSX.Element | ReactNode | null> | any
}

export const SidePanelItem: FC<SidePanelItemProps> = (props: SidePanelItemProps) => null;