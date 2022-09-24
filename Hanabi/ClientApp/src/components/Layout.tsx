import React, {FC, ReactNode} from 'react';
import {Container} from 'reactstrap';
import {NavMenu} from './NavMenu';

type MyProps = { children?: Array<JSX.Element | ReactNode | null> | any }
export const Layout: FC<MyProps> = (props) => {
    return (
        <div>
            <NavMenu/>
            <div>
                {props.children}
            </div>
        </div>
    );
}
