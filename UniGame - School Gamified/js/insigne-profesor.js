document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('create-badge-modal');
    const btnOpen = document.getElementById('btn-open-modal');
    const btnClose = document.getElementById('close-modal');
    const form = document.getElementById('create-badge-form');
    const grid = document.getElementById('prof-badges-grid');
    const iconSelect = document.getElementById('badge-icon-select');
    const iconPreview = document.getElementById('icon-preview');

    btnOpen.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    btnClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    iconSelect.addEventListener('change', () => {
        const selectedIcon = iconSelect.value;
        iconPreview.className = `fa-solid ${selectedIcon}`;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('badge-name').value;
        const iconClass = document.getElementById('badge-icon-select').value;
        const type = document.getElementById('badge-type').value;
        const desc = document.getElementById('badge-desc').value;

        const newCard = document.createElement('div');
        newCard.className = 'badge-card obtained';
        
        newCard.innerHTML = `
            <div class="delete-btn"><i class="fa-solid fa-trash"></i></div>
            <div class="badge-icon">
                <i class="fa-solid ${iconClass}"></i>
            </div>
            <h4>${name}</h4>
            <p class="badge-desc">${desc}</p>
            <span class="badge-status">${type}</span>
        `;

        grid.appendChild(newCard);
        form.reset();
        iconPreview.className = 'fa-solid fa-trophy';
        
        modal.classList.add('hidden');

        newCard.querySelector('.delete-btn').addEventListener('click', (e) => {
            if(confirm('Ești sigur că vrei să ștergi această insignă?')) {
                e.target.closest('.badge-card').remove();
            }
        });

        alert(`Insigna "${name}" a fost creată cu succes!`);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm('Ești sigur că vrei să ștergi această insignă?')) {
                e.target.closest('.badge-card').remove();
            }
        });
    });
});