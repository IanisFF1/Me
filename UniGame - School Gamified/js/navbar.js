document.addEventListener('DOMContentLoaded', () => {
    
    const navbarContent = `
        <div class="notification-wrapper">
            <div class="notification-bell" id="bell-icon">
                <i class="fa-solid fa-bell"></i>
                <span class="notification-badge" id="notif-count">3</span>
            </div>

            <div class="notification-dropdown hidden" id="notification-dropdown">
                <div class="dropdown-header">
                    <h4>Notificări</h4>
                    <span class="mark-read" id="btn-mark-read">Marchează tot</span>
                </div>
                <ul class="dropdown-list" id="notification-list">
                    <li class="dropdown-item unread">
                        <div class="item-icon icon-danger">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </div>
                        <div class="item-text">
                            <p><strong>Cerere Respinsă</strong></p>
                            <p class="text-small">Prof. Popescu nu ți-a validat insigna "Voluntar".</p>
                        </div>
                    </li>
                    <li class="dropdown-item unread">
                        <div class="item-icon icon-success">
                            <i class="fa-solid fa-trophy"></i>
                        </div>
                        <div class="item-text">
                            <p><strong>Insignă Nouă</strong></p>
                            <p class="text-small">Ai deblocat "SQL Basic". Felicitări!</p>
                        </div>
                    </li>
                    <li class="dropdown-item unread">
                        <div class="item-icon icon-info">
                            <i class="fa-solid fa-clock"></i>
                        </div>
                        <div class="item-text">
                            <p><strong>Deadline Prelungit</strong></p>
                            <p class="text-small">Ai cumpărat cu succes Pass 24h.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="user-profile-wrapper" id="profile-trigger">
            <div class="user-mini-profile">
                <div class="avatar-circle">A</div>
                <span>Andrei Popescu</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 5px;"></i>
            </div>
            
            <div class="profile-dropdown hidden" id="profile-dropdown">
                <a href="../login.html" class="logout-btn">
                    <i class="fa-solid fa-right-from-bracket"></i> Deconectare
                </a>
            </div>
        </div>
    `;

    const container = document.getElementById('notification-container');
    
    if (container) {
        container.innerHTML = navbarContent;
        initNavbarLogic();
    }

    function initNavbarLogic() {
        const bellIcon = document.getElementById('bell-icon');
        const notifDropdown = document.getElementById('notification-dropdown');
        const notifBadge = document.getElementById('notif-count');
        const markReadBtn = document.getElementById('btn-mark-read');
        const notifItems = document.querySelectorAll('.dropdown-item');

        const profileTrigger = document.getElementById('profile-trigger');
        const profileDropdown = document.getElementById('profile-dropdown');

        bellIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
            profileDropdown.classList.add('hidden');
        });

        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
            notifDropdown.classList.add('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !bellIcon.contains(e.target)) {
                notifDropdown.classList.add('hidden');
            }
            if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileDropdown.classList.add('hidden');
            }
        });

        markReadBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            notifItems.forEach(item => {
                item.classList.remove('unread');
                item.style.background = 'white';
            });
            if(notifBadge) notifBadge.style.display = 'none';
        });
    }
});