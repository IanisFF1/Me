import {HOST} from '../commons/hosts';
import RestApiClient from "../commons/api/rest-client";

const endpoint = {
    login: '/auth/login',
    register: '/auth/register' // <--- Endpoint nou
};

function loginUser(user, callback) {
    let request = new Request(HOST.backend_api + endpoint.login, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("Login URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// <--- Functie noua
function registerUser(user, callback) {
    let request = new Request(HOST.backend_api + endpoint.register, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("Register URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    loginUser,
    registerUser // <--- Nu uita exportul!
};