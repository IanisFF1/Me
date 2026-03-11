document.addEventListener('DOMContentLoaded', () => {
    let currentBalance = 1250;

    const navBalance = document.getElementById('nav-balance');
    const pageBalance = document.getElementById('page-balance');
    const buyButtons = document.querySelectorAll('.btn-buy');

    function updateBalanceDisplay() {
        navBalance.textContent = currentBalance;
        pageBalance.textContent = `${currentBalance} MP`;
    }

    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const price = parseInt(e.target.dataset.price);
            const itemName = e.target.dataset.name;
            const btn = e.target;

            if (currentBalance >= price) {
                const confirmBuy = confirm(`Ești sigur că vrei să cumperi "${itemName}" pentru ${price} MP?`);
                
                if (confirmBuy) {
                    currentBalance -= price;
                    updateBalanceDisplay();
                    
                    const originalText = btn.innerText;
                    btn.innerText = "Cumpărat!";
                    btn.style.backgroundColor = "#95a5a6";
                    btn.disabled = true;

                    setTimeout(() => {
                        alert(`Ai achiziționat cu succes: ${itemName}`);
                    }, 100);
                }
            } else {
                alert("Fonduri insuficiente! Mai ai nevoie de MeritPoints.");
            }
        });
    });
});