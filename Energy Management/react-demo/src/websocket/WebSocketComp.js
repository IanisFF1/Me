import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WebSocketComp() {

    useEffect(() => {

        const userId = sessionStorage.getItem("userId");

        if (userId) {
            console.log("WebSocketComp: User ID gasit:", userId);
            console.log("WebSocketComp: Incerc conectarea...");

            const socket = new SockJS('http://localhost/ws');
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, frame => {
                console.log('WebSocketComp: Connected ' + frame);

                // Abonare la topicul specific utilizatorului
                const topic = '/topic/alerts/' + userId;

                stompClient.subscribe(topic, notification => {
                    console.log("WebSocketComp: Alerta primita:", notification.body);
                    try {
                        const body = JSON.parse(notification.body);
                        showNotification(body.message);
                    } catch (e) {
                        console.error("Eroare la parsarea mesajului WebSocket:", e);
                    }
                });
            }, error => {
                console.log("WebSocketComp Error: ", error);
            });

            // Cleanup function: Se apeleaza cand componenta este demontata sau userul da logout
            return () => {
                if (stompClient && stompClient.connected) {
                    console.log("WebSocketComp: Deconectare...");
                    stompClient.disconnect();
                }
            };
        } else {
            console.warn("WebSocketComp: Nu am gasit 'userId' in sessionStorage. Nu ma conectez.");
        }
    }, []);

    const showNotification = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 10000, // Notificarea sta 10 secunde
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    return (
        <div>
            <ToastContainer />
        </div>
    );
}

export default WebSocketComp;