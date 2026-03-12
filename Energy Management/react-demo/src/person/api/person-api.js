import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    person: '/people'
};

function getPersons(callback) {
    let request = new Request(HOST.backend_api + endpoint.person, { method: 'GET' });
    RestApiClient.performRequest(request, callback);
}

function getPersonById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.person + '/' + params.id, { method: 'GET' });
    RestApiClient.performRequest(request, callback);
}

function postPerson(user, callback){
    let request = new Request(HOST.backend_api + endpoint.person , {
        method: 'POST',
        headers : { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    RestApiClient.performRequest(request, callback);
}


function deletePerson(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.person + '/' + id, {
        method: 'DELETE'
    });
    console.log("Delete URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function updatePerson(id, user, callback) {
    let request = new Request(HOST.backend_api + endpoint.person + '/' + id, {
        method: 'PUT',
        headers : { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    console.log("Update URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getPersons,
    getPersonById,
    postPerson,
    deletePerson,
    updatePerson
};