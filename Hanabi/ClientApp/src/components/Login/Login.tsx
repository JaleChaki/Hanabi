import React, {FC, useEffect, useState} from "react";
import './Login.scss'

export interface IToken {
    token_type: string,
    access_token: string,
    expired_at: string
}
type LoginProps = { 
    setToken: (token: IToken) => void,
    setUserUUID: (userId: string) => void,
    setUserNick: (userNick: string) => void
}

export const Login: FC<LoginProps> = ({ setToken, setUserUUID, setUserNick }) => {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const newUserId = window.crypto.randomUUID();
        setUserId(newUserId);
        setUserUUID(newUserId);
    }, []);

    const getLoginToken = async () => {
        return await fetch('/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                nickName: userName,
                password: password
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
            setToken(token);
        }
    }

    const setUserNickName = (userNick: string) => {
        setUserName(userNick);
        setUserNick(userNick);
    }

    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" className="username" onChange={e => setUserNickName(e.target.value)}
                           required/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" className="password" onChange={e => setPassword(e.target.value)}
                           placeholder="Password is qwerty654" required/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}