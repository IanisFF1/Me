document.addEventListener('DOMContentLoaded', () => {
    
    const studentsData = [
        { id: 1, name: "Andrei Popescu", badges: 12, mp: 1250, activity: 95 },
        { id: 2, name: "Ioana Radu", badges: 10, mp: 1100, activity: 88 },
        { id: 3, name: "Mihai Ionescu", badges: 8, mp: 980, activity: 75 },
        { id: 4, name: "Elena Dumitrescu", badges: 15, mp: 1450, activity: 98 },
        { id: 5, name: "George Vasile", badges: 5, mp: 600, activity: 45 },
        { id: 6, name: "Cristina Matei", badges: 7, mp: 850, activity: 60 },
        { id: 7, name: "Alexandru Stan", badges: 9, mp: 1050, activity: 82 },
        { id: 8, name: "Diana Florea", badges: 11, mp: 1150, activity: 90 },
        { id: 9, name: "Vlad Munteanu", badges: 4, mp: 400, activity: 30 },
        { id: 10, name: "Simona Popa", badges: 6, mp: 750, activity: 55 }
    ];

    // Sortăm descrescător după MP pentru clasament
    studentsData.sort((a, b) => b.mp - a.mp);

    const container = document.getElementById('students-container');
    const searchInput = document.getElementById('search-input');
    
    const totalEl = document.getElementById('total-students');
    const avgMpEl = document.getElementById('avg-mp');
    const avgBadgesEl = document.getElementById('avg-badges');
    const topNameEl = document.getElementById('top-student-name');

    function calculateStats() {
        const total = studentsData.length;
        const totalMP = studentsData.reduce((sum, s) => sum + s.mp, 0);
        const totalBadges = studentsData.reduce((sum, s) => sum + s.badges, 0);
        
        totalEl.textContent = total;
        avgMpEl.textContent = Math.round(totalMP / total);
        avgBadgesEl.textContent = (totalBadges / total).toFixed(1);
        topNameEl.textContent = studentsData[0].name; // Primul din lista sortată
    }

    function renderList(filterText = '') {
        container.innerHTML = '';
        
        let rank = 1;

        studentsData.forEach(student => {
            if (student.name.toLowerCase().includes(filterText.toLowerCase())) {
                
                let rankClass = '';
                let rankIcon = `#${rank}`;

                if (rank === 1) { rankClass = 'rank-1'; rankIcon = '<i class="fa-solid fa-trophy"></i>'; }
                else if (rank === 2) { rankClass = 'rank-2'; rankIcon = '<i class="fa-solid fa-medal"></i>'; }
                else if (rank === 3) { rankClass = 'rank-3'; rankIcon = '<i class="fa-solid fa-medal"></i>'; }

                const row = document.createElement('div');
                row.className = 'student-row';
                row.innerHTML = `
                    <div class="rank-badge ${rankClass}">${rankIcon}</div>
                    <div class="student-info">
                        <div class="student-avatar" style="background-color: ${getRandomColor(student.name)}">
                            ${student.name.charAt(0)}
                        </div>
                        <span>${student.name}</span>
                    </div>
                    <div class="metric">
                        <i class="fa-solid fa-medal" style="color: #9c27b0; margin-right:5px;"></i> ${student.badges}
                    </div>
                    <div class="metric">
                        <i class="fa-solid fa-coins" style="color: #f39c12; margin-right:5px;"></i> ${student.mp}
                    </div>
                    <div>
                        <small>${student.activity}%</small>
                        <div class="progress-cell">
                            <div class="progress-bar" style="width: ${student.activity}%; background: ${getColorForActivity(student.activity)}"></div>
                        </div>
                    </div>
                    <div>
                        <button class="btn-icon"><i class="fa-solid fa-eye"></i></button>
                        <button class="btn-icon"><i class="fa-solid fa-envelope"></i></button>
                    </div>
                `;
                
                container.appendChild(row);
            }
            rank++;
        });
    }

    function getRandomColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    }

    function getColorForActivity(val) {
        if(val >= 80) return '#27ae60';
        if(val >= 50) return '#f39c12';
        return '#e74c3c';
    }

    searchInput.addEventListener('input', (e) => {
        renderList(e.target.value);
    });

    calculateStats();
    renderList();
});