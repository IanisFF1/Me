document.addEventListener('DOMContentLoaded', () => {
    const btnCombine = document.getElementById('btn-combine');
    const overlay = document.getElementById('animation-overlay');
    const btnSkip = document.getElementById('btn-skip');
    const animationStage = document.querySelector('.animation-stage');
    const rewardMessage = document.getElementById('reward-message');
    const btnCollect = document.getElementById('btn-collect');
    const targetBadgeCard = document.getElementById('target-badge');

    let animationTimeout;

    btnCombine.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        rewardMessage.classList.add('hidden');
        animationStage.innerHTML = '';

        const icons = [
            '<i class="fa-brands fa-html5" style="color: #e44d26;"></i>',
            '<i class="fa-brands fa-css3-alt" style="color: #264de4;"></i>',
            '<i class="fa-brands fa-js" style="color: #f0db4f;"></i>'
        ];

        icons.forEach((icon, index) => {
            const el = document.createElement('div');
            el.innerHTML = icon;
            el.className = 'anim-icon';
            el.style.animationDelay = `${index * 0.2}s`;
            animationStage.appendChild(el);
        });

        animationTimeout = setTimeout(() => {
            showReward();
        }, 3000);
    });

    btnSkip.addEventListener('click', () => {
        clearTimeout(animationTimeout);
        showReward();
    });

    function showReward() {
        animationStage.innerHTML = '';
        btnSkip.classList.add('hidden');
        rewardMessage.classList.remove('hidden');
    }

    btnCollect.addEventListener('click', () => {
        overlay.classList.add('hidden');
        
        targetBadgeCard.classList.remove('locked');
        targetBadgeCard.classList.add('obtained');
        targetBadgeCard.style.borderColor = '#27ae60';
        
        targetBadgeCard.innerHTML = `
            <div class="badge-icon-large" style="color: #27ae60;">
                <i class="fa-solid fa-laptop-code"></i>
            </div>
            <h4>Maestru Front-End</h4>
            <span class="badge-status" style="background: #e8f6f3; color: #27ae60;">
                <i class="fa-solid fa-check"></i> Obținută
            </span>
        `;

        alert("Ai primit 100 MeritPoints!");
    });

    const btnClaimVolunteer = document.getElementById('btn-claim-volunteer');
    const cardVolunteer = document.getElementById('card-volunteer');

    if(btnClaimVolunteer) {
        btnClaimVolunteer.addEventListener('click', () => {
            const confirmAction = confirm("Confirmi revendicarea insignei pentru activitatea de voluntariat?");
            
            if (confirmAction) {
                cardVolunteer.classList.remove('claimable');
                cardVolunteer.classList.add('obtained');

                const iconDiv = cardVolunteer.querySelector('.badge-icon');
                iconDiv.style.background = '#e8f6f3';
                iconDiv.style.color = '#27ae60';

                btnClaimVolunteer.remove();

                const statusSpan = document.createElement('span');
                statusSpan.className = 'badge-status';
                statusSpan.style.background = '#e8f6f3';
                statusSpan.style.color = '#27ae60';
                statusSpan.innerHTML = '<i class="fa-solid fa-check"></i> Obținută';
                
                cardVolunteer.appendChild(statusSpan);

                alert("Felicitări! Ai primit 50 MeritPoints.");
            }
        });
    }

    const cardBackend = document.getElementById('card-backend');
    if (cardBackend) {
        const btnDetails = cardBackend.querySelector('.btn-details');
        const btnBack = cardBackend.querySelector('.btn-back');
        const viewSummary = cardBackend.querySelector('.view-summary');
        const viewDetails = cardBackend.querySelector('.view-details');

        btnDetails.addEventListener('click', () => {
            viewSummary.classList.add('hidden');
            viewDetails.classList.remove('hidden');
        });

        btnBack.addEventListener('click', () => {
            viewDetails.classList.add('hidden');
            viewSummary.classList.remove('hidden');
        });
    }
});