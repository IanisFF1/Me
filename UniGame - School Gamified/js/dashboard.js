document.addEventListener('DOMContentLoaded', () => {
    
    const chartData = {
        points: {
            userVal: 1250,
            classVal: 980,
            unit: 'MP',
            userLabel: 'Eu (Top 20%)',
            feedback: 'Felicitări! Ești peste media clasei.',
            color: '#27ae60', 
            maxScale: 1500 
        },
        badges: {
            userVal: 8,
            classVal: 9,
            unit: 'insigne',
            userLabel: 'Eu',
            feedback: 'Ești aproape de medie! Mai ai nevoie de o insignă pentru a recupera.',
            color: '#f39c12', 
            maxScale: 20 
        }
    };

    const btnPoints = document.getElementById('tab-points');
    const btnBadges = document.getElementById('tab-badges');
    
    const labelUser = document.getElementById('label-user');
    const barUser = document.getElementById('bar-user');
    const barClass = document.getElementById('bar-class');
    const feedbackText = document.getElementById('feedback-text');

    function updateChart(type) {
        const data = chartData[type];

        const userPercent = (data.userVal / data.maxScale) * 100;
        const classPercent = (data.classVal / data.maxScale) * 100;

        barUser.style.width = `${userPercent}%`;
        barUser.style.backgroundColor = data.color;
        barUser.textContent = `${data.userVal} ${data.unit}`;
        
        barClass.style.width = `${classPercent}%`;
        barClass.textContent = `${data.classVal} ${data.unit}`;

        labelUser.textContent = data.userLabel;
        feedbackText.textContent = data.feedback;

        if (type === 'points') {
            btnPoints.classList.add('active');
            btnBadges.classList.remove('active');
        } else {
            btnBadges.classList.add('active');
            btnPoints.classList.remove('active');
        }
    }

    btnPoints.addEventListener('click', () => updateChart('points'));
    btnBadges.addEventListener('click', () => updateChart('badges'));
});