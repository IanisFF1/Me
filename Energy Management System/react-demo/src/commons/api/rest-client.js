function performRequest(request, callback) {
    const token = sessionStorage.getItem("token");
    if (token) {
        request.headers.append('Authorization', 'Bearer ' + token);
    }

    fetch(request)
        .then(function(response) {
            // --- FIX PENTRU RESTART DOCKER / TOKEN EXPIRAT ---
            if (response.status === 401 || response.status === 403) {
                // Dacă backend-ul ne respinge, ștergem tot și mergem la Login
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "/"; // Force refresh la pagina de login
                return;
            }
            // -------------------------------------------------

            if (response.ok) {
                response.text().then(text => {
                    const data = text && text.length > 0 ? JSON.parse(text) : {};
                    callback(data, response.status, null);
                });
            } else {
                response.text().then(text => {
                    let err = text;
                    try {
                        err = JSON.parse(text);
                    } catch (e) {
                        // ignore
                    }
                    callback(null, response.status, err);
                });
            }
        })
        .catch(function(err) {
            callback(null, 1, err)
        });
}

module.exports = {
    performRequest
};