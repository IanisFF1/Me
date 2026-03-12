import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Card, CardBody, CardHeader, Input, Button, Spinner } from 'reactstrap';
import * as CHAT_API from './api/chat-api';


const WS_URL = 'http://localhost/ws';

function ChatWindow({ onClose, myUserId, otherUserId, otherUserName, role }) {
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    const styles = {
        container: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '500px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        },
        msgArea: {
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
            backgroundColor: '#f9f9f9'
        },
        myMsg: {
            textAlign: 'right',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '15px 15px 0 15px',
            marginBottom: '5px',
            maxWidth: '80%',
            alignSelf: 'flex-end',
            marginLeft: 'auto'
        },
        otherMsg: {
            textAlign: 'left',
            backgroundColor: '#e9ecef',
            color: 'black',
            padding: '8px 12px',
            borderRadius: '15px 15px 15px 0',
            marginBottom: '5px',
            maxWidth: '80%',
            alignSelf: 'flex-start'
        }
    };

    useEffect(() => {
        CHAT_API.getHistory(myUserId, otherUserId, (result, status, err) => {
            if (result && status === 200) {
                setMessages(result);
                scrollToBottom();
            }
        });

        const socket = new SockJS(WS_URL);
        const stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, frame => {
            console.log('Chat Connected: ' + frame);
            setIsConnected(true);
            stompClientRef.current = stompClient;

            stompClient.subscribe('/topic/chat/' + myUserId, notification => {
                const msgBody = JSON.parse(notification.body);

                if (msgBody.senderId === otherUserId || msgBody.senderId === myUserId) {
                    addMessageToState(msgBody);
                }
            });

        }, error => {
            console.log("WebSocket Error: ", error);
            setIsConnected(false);
        });

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
    }, [myUserId, otherUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const addMessageToState = (msg) => {
        setMessages(prev => [...prev, msg]);
    };

    const handleSend = () => {
        if (!inputMsg.trim()) return;

        const msgPayload = {
            senderId: myUserId,
            receiverId: otherUserId,
            message: inputMsg,
            isRead: false
        };

        CHAT_API.send(msgPayload, (result, status, err) => {
            if (status === 201 || status === 200) {

                addMessageToState(result);
                setInputMsg('');
            } else {
                alert("Failed to send message");
            }
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <Card style={styles.container} className="shadow">
            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
                <span>💬 {role === 'ADMIN' ? `Chat with ${otherUserName}` : 'Support Chat'}</span>
                <Button size="sm" color="danger" onClick={onClose}>X</Button>
            </CardHeader>

            <CardBody style={styles.msgArea}>
                {!isConnected && <div className="text-center"><Spinner size="sm" color="primary" /> Connecting...</div>}

                {messages.map((msg, index) => {
                    const isMine = msg.senderId === myUserId;
                    return (
                        <div key={index} style={isMine ? styles.myMsg : styles.otherMsg}>
                            <div style={{fontSize: '0.9rem'}}>{msg.message}</div>
                            <div style={{fontSize: '0.6rem', opacity: 0.7, textAlign: 'right'}}>
                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </CardBody>

            <div className="p-2 bg-light d-flex">
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{marginRight: '10px'}}
                />
                <Button color="primary" onClick={handleSend}>➤</Button>
            </div>
        </Card>
    );
}

export default ChatWindow;