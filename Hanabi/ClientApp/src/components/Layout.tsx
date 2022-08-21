import React, {FunctionComponent, ReactNode} from 'react';
import {Container} from 'reactstrap';
import {NavMenu} from './NavMenu';

interface MyProps { children?: Array<JSX.Element | ReactNode | null> | any }
// interface MyProps { children?: any }
export const Layout : FunctionComponent<MyProps> = (props) => {
// export const Layout = (props: any) => {
// export const Layout = (props: React.PropsWithChildren<MyProps>) => {
    return (
        <div>
            <NavMenu/>
            <Container>
                {props.children}
            </Container>
        </div>
    );
}
