import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const ENDPOINT = {
    chat: '/chat'
};

function send(message, callback) {
    let request = new Request(HOST.backend_api + ENDPOINT.chat + '/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'

        },
        body: JSON.stringify(message)
    });

    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function getHistory(user1, user2, callback) {
    let request = new Request(HOST.backend_api + ENDPOINT.chat + '/history/' + user1 + '/' + user2, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    send,
    getHistory
};