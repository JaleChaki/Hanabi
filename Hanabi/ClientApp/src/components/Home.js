import React, {Component} from 'react';
import * as signalR from "@microsoft/signalr";

export class Home extends Component {
    static displayName = Home.name;

    constructor() {
        super();
    }
    
    componentDidMount() {
        this.initiateHubConnection();
    }

    initiateHubConnection() {
        let connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl("/testhub", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();

        //Disable the send button until connection is established.
        document.getElementById("sendButton").disabled = true;

        connection.on("ReceiveMessage", function (user, message) {
            var li = document.createElement("li");
            document.getElementById("messagesList").appendChild(li);
            // We can assign user-supplied strings to an element's textContent because it
            // is not interpreted as markup. If you're assigning in any other way, you 
            // should be aware of possible script injection concerns.
            li.textContent = `${user} says ${message}`;
        });

        connection.start().then(function () {
            document.getElementById("sendButton").disabled = false;
        }).catch(function (err) {
            return console.error(err.toString());
        });

        document.getElementById("sendButton").addEventListener("click", function (event) {
            var user = document.getElementById("userInput").value;
            var message = document.getElementById("messageInput").value;
            connection.invoke("SendMessage", user, message).catch(function (err) {
                return console.error(err.toString());
            });
            event.preventDefault();
        });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">&nbsp;</div>
                    <div className="row">
                        <div className="col-2">User</div>
                        <div className="col-4"><input type="text" id="userInput"/></div>
                    </div>
                    <div className="row">
                        <div className="col-2">Message</div>
                        <div className="col-4"><input type="text" id="messageInput"/></div>
                    </div>
                    <div className="row">&nbsp;</div>
                    <div className="row">
                        <div className="col-6">
                            <input type="button" id="sendButton" value="Send Message"/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <ul id="messagesList"></ul>
                    </div>
                </div>
            </div>
        );
    }
}
