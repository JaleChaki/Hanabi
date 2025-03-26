import React, {FC, Fragment, ReactNode} from 'react';

type MyProps = { children?: Array<JSX.Element | ReactNode | null> | any }
export const Layout: FC<MyProps> = (props) => {
    return (
        <Fragment>
            {props.children}
        </Fragment>
    );
}
