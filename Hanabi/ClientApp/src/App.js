import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {FetchData} from './components/FetchData';
import {Counter} from './components/Counter';

import './custom.css'
import {Login} from "./components/Login/Login";

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            token: null
        }
    }

    setToken(token) {
        this.setState({token})
    }

    render() {
        if (!this.state.token) {
            return <Login setToken={this.setToken.bind(this)}/>
        }
        return (
            <Layout>
                <Route exact path='/' component={Home}/>
                <Route path='/counter' component={Counter}/>
                <Route path='/fetch-data' component={FetchData}/>
            </Layout>
        );
    }
}
