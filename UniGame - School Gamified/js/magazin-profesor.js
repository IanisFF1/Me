document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('reward-modal');
    const btnOpen = document.getElementById('btn-open-modal');
    const btnClose = document.getElementById('close-modal');
    const form = document.getElementById('reward-form');
    const grid = document.getElementById('shop-admin-grid');
    const iconSelect = document.getElementById('reward-icon');
    const iconPreview = document.getElementById('icon-preview');
    const modalTitle = document.getElementById('modal-title');
    const btnSave = document.getElementById('btn-save');
    const editIdInput = document.getElementById('edit-mode-id');

    // Funcții Modal
    function openModal(isEdit = false) {
        modal.classList.remove('hidden');
        if (!isEdit) {
            form.reset();
            editIdInput.value = '';
            modalTitle.textContent = "Adaugă Recompensă Nouă";
            btnSave.textContent = "Adaugă în Magazin";
            iconPreview.className = 'fa-solid fa-gift';
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    btnOpen.addEventListener('click', () => openModal(false));
    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    iconSelect.addEventListener('change', () => {
        iconPreview.className = `fa-solid ${iconSelect.value}`;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reward-name').value;
        const desc = document.getElementById('reward-desc').value;
        const price = document.getElementById('reward-price').value;
        const stock = document.getElementById('reward-stock').value;
        const limit = document.getElementById('reward-limit').value;
        const icon = document.getElementById('reward-icon').value;
        const editId = editIdInput.value;

        const limitText = limit > 0 ? `Limită: ${limit}/std` : 'Limită: -';

        if (editId) {
            const card = document.querySelector(`.shop-item[data-id="${editId}"]`);
            if (card) {
                card.querySelector('h3').textContent = name;
                card.querySelector('p').textContent = desc;
                card.querySelector('.stock').textContent = `Stoc: ${stock}`;
                card.querySelector('.limit').textContent = limitText;
                card.querySelector('.price-tag').textContent = `${price} MP`;
                
                const iconWrapper = card.querySelector('.item-icon-wrapper');
                iconWrapper.innerHTML = `<i class="fa-solid ${icon}"></i>`;
                
                alert('Recompensă actualizată cu succes!');
            }
        } else {
            const newId = Date.now();
            const newCard = document.createElement('div');
            newCard.className = 'shop-item';
            newCard.setAttribute('data-id', newId);
            
            newCard.innerHTML = `
                <div class="item-icon-wrapper color-blue">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="item-content">
                    <h3>${name}</h3>
                    <p>${desc}</p>
                    <div class="item-meta">
                        <span class="stock">Stoc: ${stock}</span>
                        <span class="limit">${limitText}</span>
                        <span class="price-tag">${price} MP</span>
                    </div>
                </div>
                <div class="admin-actions">
                    <button class="btn-edit"><i class="fa-solid fa-pen"></i> Editează</button>
                    <button class="btn-delete"><i class="fa-solid fa-trash"></i> Șterge</button>
                </div>
            `;
            
            grid.appendChild(newCard);
            attachCardEvents(newCard);
            alert('Recompensă adăugată cu succes!');
        }

        closeModal();
    });

    function attachCardEvents(card) {
        const btnEdit = card.querySelector('.btn-edit');
        const btnDelete = card.querySelector('.btn-delete');

        btnDelete.addEventListener('click', () => {
            if (confirm('Sigur vrei să ștergi această recompensă?')) {
                card.remove();
            }
        });

        btnEdit.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const name = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;
            const priceText = card.querySelector('.price-tag').textContent;
            const stockText = card.querySelector('.stock').textContent;
            const limitText = card.querySelector('.limit').textContent;
            
            document.getElementById('reward-name').value = name;
            document.getElementById('reward-desc').value = desc;
            document.getElementById('reward-price').value = parseInt(priceText);
            document.getElementById('reward-stock').value = parseInt(stockText.split(':')[1]);
            
            if(limitText.includes('/std')) {
                document.getElementById('reward-limit').value = parseInt(limitText.split(':')[1]);
            } else {
                document.getElementById('reward-limit').value = 0;
            }

            editIdInput.value = id;
            modalTitle.textContent = "Editează Recompensa";
            btnSave.textContent = "Actualizează";
            
            openModal(true);
        });
    }

    document.querySelectorAll('.shop-item').forEach(card => {
        attachCardEvents(card);
    });
});