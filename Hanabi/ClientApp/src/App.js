import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {Counter} from './components/Counter';
import {Login} from "./components/Login/Login";

import {instanceOf} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';

import './custom.scss'

class App extends Component {
    static displayName = App.name;
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.LOGIN_COOKIE_NAME = 'loginAccessToken';

        this.state = {
            loginAccessToken: props.cookies.get(this.LOGIN_COOKIE_NAME) || null
        }
    }

    setToken(token) {
        this.setState({loginAccessToken: token.access_token})
        this.props.cookies.set(this.LOGIN_COOKIE_NAME, token.access_token, {
            path: '/',
            expires: new Date(token.expired_at)
        })
    }

    render() {
        if (!this.state.loginAccessToken) {
            return <Login setToken={this.setToken.bind(this)}/>
        }
        return (
            <Layout>
                <Route exact path='/' render={() => <Home loginAccessToken={this.state.loginAccessToken}/>}/>
                <Route path='/counter' component={Counter}/>
            </Layout>
        );
    }
}

export default withCookies(App);