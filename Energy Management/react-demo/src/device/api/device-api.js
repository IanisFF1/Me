import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    device: '/devices'
};

// --- CRUD STANDARD ---

function getDevices(callback) {
    let request = new Request(HOST.backend_api + endpoint.device, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.device + '/' + params.id, {
        method: 'GET'
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postDevice(device, callback){
    let request = new Request(HOST.backend_api + endpoint.device , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });
    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteDevice(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.device + '/' + id, {
        method: 'DELETE'
    });
    console.log("Delete URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function updateDevice(id, device, callback) {
    let request = new Request(HOST.backend_api + endpoint.device + '/' + id, {
        method: 'PUT',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });
    console.log("Update URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// --- FUNCTII SPECIALE PENTRU ASIGNARE ---

// Atribuie un user unui device (PATCH /devices/{deviceId}/assign/{userId})
function assignUserToDevice(deviceId, userId, callback) {
    let request = new Request(HOST.backend_api + endpoint.device + '/' + deviceId + '/assign/' + userId, {
        method: 'PATCH',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    console.log("Assign URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// Optional: Dezleaga un user (daca ai implementat endpoint-ul de unassign)
// Daca nu ai endpoint dedicat, poti folosi updateDevice si trimiti userId: null (dar backend-ul trebuie sa permita)
function unassignUserFromDevice(deviceId, callback) {
    // Presupunand ca ai facut endpoint-ul de unassign pe care l-am discutat
    // Daca nu, lasam comentat sau adaptam
    let request = new Request(HOST.backend_api + endpoint.device + '/' + deviceId + '/unassign', {
        method: 'PATCH'
    });
    console.log("Unassign URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

// Adauga functia asta:
function getDevicesByUserId(userId, callback) {
    let request = new Request(HOST.backend_api + endpoint.device + '/user/' + userId, {
        method: 'GET'
    });
    console.log("My Devices URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getDevices,
    getDeviceById,
    postDevice,
    deleteDevice,
    updateDevice,
    assignUserToDevice,
    unassignUserFromDevice,
    getDevicesByUserId
};