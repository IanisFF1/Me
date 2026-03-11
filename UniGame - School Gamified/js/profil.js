document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('nomination-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const submitBtn = document.getElementById('submit-nomination');
    const reasonInput = document.getElementById('nomination-reason');
    const errorText = document.getElementById('text-error');
    const nomineeNameSpan = document.getElementById('nominee-name');
    const badgeOptions = document.querySelectorAll('.badge-option');
    const allNominateButtons = document.querySelectorAll('.btn-nominate');
    
    let currentButton = null;

    allNominateButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.closest('button').dataset.name;
            nomineeNameSpan.textContent = name;
            currentButton = e.target.closest('button');
            
            reasonInput.value = '';
            errorText.classList.add('hidden');
            reasonInput.style.borderColor = '#ddd';
            
            modal.classList.remove('hidden');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    badgeOptions.forEach(option => {
        option.addEventListener('click', () => {
            badgeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    submitBtn.addEventListener('click', () => {
        const text = reasonInput.value.trim();

        if (text.length < 20) {
            errorText.classList.remove('hidden');
            reasonInput.style.borderColor = '#e74c3c';
            return;
        }

        modal.classList.add('hidden');
        
        allNominateButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.backgroundColor = '#ecf0f1';
            btn.style.color = '#95a5a6';
            btn.style.borderColor = 'transparent';
            btn.style.cursor = 'not-allowed';
            
            if (btn === currentButton) {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Trimis';
                btn.style.backgroundColor = '#e8f6f3';
                btn.style.color = '#27ae60';
            } else {
                btn.innerHTML = 'Închis';
            }
        });

        alert(`Nominalizare trimisă cu succes pentru ${nomineeNameSpan.textContent}!`);
    });

    reasonInput.addEventListener('input', () => {
        if (reasonInput.value.length >= 20) {
            errorText.classList.add('hidden');
            reasonInput.style.borderColor = '#27ae60';
        }
    });

    const btnGenerate = document.getElementById('btn-generate-link');
    const portfolioInitial = document.getElementById('portfolio-initial');
    const portfolioActive = document.getElementById('portfolio-active');
    const btnCopy = document.getElementById('btn-copy-link');
    const portfolioUrl = document.getElementById('portfolio-url');
    const btnRevoke = document.getElementById('btn-revoke-link');

    btnGenerate.addEventListener('click', () => {
        btnGenerate.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Se generează...';
        
        setTimeout(() => {
            portfolioInitial.classList.add('hidden');
            portfolioActive.classList.remove('hidden');
        }, 800);
    });

    btnCopy.addEventListener('click', () => {
        portfolioUrl.select();
        navigator.clipboard.writeText(portfolioUrl.value);
        
        const originalText = btnCopy.innerHTML;
        btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> Copiat';
        btnCopy.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            btnCopy.innerHTML = originalText;
            btnCopy.style.backgroundColor = '#3498db';
        }, 2000);
    });

    btnRevoke.addEventListener('click', () => {
        const confirmRevoke = confirm("Ești sigur că vrei să dezactivezi link-ul public?");
        if (confirmRevoke) {
            portfolioActive.classList.add('hidden');
            portfolioInitial.classList.remove('hidden');
            btnGenerate.textContent = "Generează Link Public";
        }
    });
});