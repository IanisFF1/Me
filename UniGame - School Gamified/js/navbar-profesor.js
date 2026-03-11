document.addEventListener('DOMContentLoaded', () => {
    
    const navbarContent = `
        <div class="logo-area">
            <h2>UniGame <span style="font-size: 14px; opacity: 0.8; font-weight: normal;">| Profesor</span></h2>
        </div>
        
        <ul class="nav-links">
            <li><a href="dashboard-profesor.html"><i class="fa-solid fa-chart-pie"></i> Dashboard</a></li>
            <li><a href="insigne.html"><i class="fa-solid fa-medal"></i> Insigne</a></li>
            <li><a href="magazin.html"><i class="fa-solid fa-store"></i> Magazin</a></li>
            <li><a href="clasa.html"><i class="fa-solid fa-users"></i> Clasa Mea</a></li>
        </ul>

        <div class="nav-right">
            <div class="notification-wrapper">
                <div class="notification-bell" id="bell-icon">
                    <i class="fa-solid fa-bell"></i>
                    <span class="notification-badge" id="notif-count">1</span>
                </div>

                <div class="notification-dropdown hidden" id="notification-dropdown">
                    <div class="dropdown-header">
                        <h4>Notificări Recente</h4>
                        <span class="mark-read" id="btn-mark-read">Marchează tot</span>
                    </div>
                    <ul class="dropdown-list">
                        <li class="dropdown-item unread">
                            <div class="item-icon icon-info">
                                <i class="fa-solid fa-user-graduate"></i>
                            </div>
                            <div class="item-text">
                                <p><strong>Cerere Insignă</strong></p>
                                <p class="text-small">Andrei P. a solicitat insigna "Voluntar".</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="user-profile-wrapper" id="profile-trigger">
                <div class="user-mini-profile">
                    <div class="avatar-circle" style="background-color: #8e44ad;">P</div>
                    <span>Dl Prof. Ionescu</span>
                    <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 5px;"></i>
                </div>
                
                <div class="profile-dropdown hidden" id="profile-dropdown">
                    <a href="../login.html" class="logout-btn">
                        <i class="fa-solid fa-right-from-bracket"></i> Deconectare
                    </a>
                </div>
            </div>
        </div>
    `;

    const container = document.getElementById('navbar-container');
    
    if (container) {
        container.innerHTML = navbarContent;
        container.className = 'navbar';
        initNavbarLogic();
        highlightActiveLink();
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

    function highlightActiveLink() {
        const currentPage = window.location.pathname.split("/").pop();
        const navLinks = document.querySelectorAll('.nav-links li a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.parentElement.classList.add('active');
            }
        });
    }
});