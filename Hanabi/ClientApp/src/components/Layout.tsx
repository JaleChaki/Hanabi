import React, {FC, ReactNode} from 'react';

type MyProps = { children?: Array<JSX.Element | ReactNode | null> | any }
export const Layout: FC<MyProps> = (props) => {
    return (
        <div>
            {props.children}
        </div>
    );
}
