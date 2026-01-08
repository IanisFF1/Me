function performRequest(request, callback) {
    const token = sessionStorage.getItem("token");
    if (token) {
        request.headers.append('Authorization', 'Bearer ' + token);
    }

    fetch(request)
        .then(function(response) {
            if (response.ok) {
                // MODIFICARE CRITICA: Citim ca text intai!
                response.text().then(text => {
                    // Daca textul e gol, returnam un obiect gol, altfel il parsam
                    const data = text && text.length > 0 ? JSON.parse(text) : {};
                    callback(data, response.status, null);
                });
            } else {
                // La fel si pentru erori
                response.text().then(text => {
                    let err = text;
                    try {
                        err = JSON.parse(text); // Incercam sa vedem daca e JSON
                    } catch (e) {
                        // Daca nu e JSON, lasam textul simplu
                    }
                    callback(null, response.status, err);
                });
            }
        })
        .catch(function(err) {
            // Erori de retea
            callback(null, 1, err)
        });
}

module.exports = {
    performRequest
};