import React, {Component} from "react";
import './Login.css'

export class Login extends Component {
    static displayName = Login.name;

    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            password: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async getLoginToken() {
        return await fetch('/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickName: this.state.userName
            })
        })
    }

    async handleSubmit(e) {
        e.preventDefault();
        const token = await this.getLoginToken();
        this.props.setToken(token);
    }

    setUserName(name) {
        this.setState({userName: name});
    }

    setPassword(password) {
        this.setState({password: password});
    }

    render() {
        return (
            <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <p>Username</p>
                        <input type="text" onChange={e => this.setUserName(e.target.value)}/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => this.setPassword(e.target.value)}
                               placeholder={"Password is not required"}/>
                    </label>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}