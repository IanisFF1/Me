document.addEventListener('DOMContentLoaded', () => {
    const btnStats = document.getElementById('btn-view-stats');
    const btnApprove = document.getElementById('btn-approve');
    const btnReject = document.getElementById('btn-reject');
    const requestContent = document.getElementById('request-content');
    const welcomeMsg = document.getElementById('welcome-msg');
    const requestIcon = document.querySelector('#request-item i');

    if (btnStats) {
        btnStats.addEventListener('click', () => {
            window.location.href = 'clasa.html';
        });
    }

    if (btnApprove) {
        btnApprove.addEventListener('click', () => {
            requestContent.innerHTML = `
                <strong>Andrei Popescu</strong>
                <p style="color: #27ae60; font-weight: bold; margin-top: 5px;">
                    <i class="fa-solid fa-check-circle"></i> Insignă acordată cu succes!
                </p>
            `;
            
            if(requestIcon) {
                requestIcon.style.color = '#27ae60';
                requestIcon.className = 'fa-solid fa-check';
            }
            
            updateWelcomeMessage();
        });
    }

    if (btnReject) {
        btnReject.addEventListener('click', () => {
            if(confirm("Ești sigur că vrei să respingi cererea?")) {
                requestContent.innerHTML = `
                    <strong>Andrei Popescu</strong>
                    <p style="color: #e74c3c; font-weight: bold; margin-top: 5px;">
                        <i class="fa-solid fa-times-circle"></i> Cerere respinsă.
                    </p>
                `;
                
                if(requestIcon) {
                    requestIcon.style.color = '#e74c3c';
                    requestIcon.className = 'fa-solid fa-xmark';
                }

                updateWelcomeMessage();
            }
        });
    }

    function updateWelcomeMessage() {
        if(welcomeMsg) {
            welcomeMsg.textContent = "Nu aveți cereri în așteptare.";
        }
    }
});