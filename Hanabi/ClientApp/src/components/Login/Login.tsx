import React, {useState} from "react";
import './Login.scss'

export interface IToken {
    token_type: string,
    access_token: string,
    expired_at: string
}
export const Login = (props: { setToken: (token: IToken) => void }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const getLoginToken = async () => {
        return await fetch('/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickName: userName
            })
        }).then(
            data => data.json(),
            err => {
                return {err};
            }
        ).catch(err => {
            return {err};
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = await getLoginToken();
        if (token.err) {
            alert("Our server does not accept your nickname. Please, try another one, like 'jalechaki'")
        } else {
            props.setToken(token);
        }
    }

    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" className="username" onChange={e => setUserName(e.target.value)}
                           required/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" className="password" onChange={e => setPassword(e.target.value)}
                           placeholder="Password is not required"/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}