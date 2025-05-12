const BASE = 'https://ripple-candle-microraptor.glitch.me/metar?ids=';
const stations = ['KHQU', 'KAGS', 'KATL', 'KCPP'];

stations.forEach(station => {
    const element = document.getElementById(`rawObs-${station}`);
    const card = element.closest('.metarCard');
    const indicator = card.querySelector('.status-indicator');

    fetch(`${BASE}${station}`)
        .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
        .then(data => {
            element.classList.remove('loading');
            const report = data[0] || {};
            const obs = report.rawOb || 'No report available';
            const wspd = report.wspd;

            element.textContent = obs;

            if (wspd == null) {
                // no wind info
                indicator.style.backgroundColor = '#f9c74f';  // yellow
                indicator.style.boxShadow = '0 0 8px rgba(249,199,79,0.7)';
            } else if (wspd >= 20) {
                // very high wind (exactly 20 or higher)
                indicator.style.backgroundColor = '#ff6b6b';  // red
                indicator.style.boxShadow = '0 0 8px rgba(255,107,107,0.7)';
            } else if (wspd >= 10) {
                // moderate wind (exactly 10 or higher, but less than 20)
                indicator.style.backgroundColor = '#f9c74f';  // yellow
                indicator.style.boxShadow = '0 0 8px rgba(249,199,79,0.7)';
            } else {
                // low wind (less than 10)
                indicator.style.backgroundColor = '#4ecca3';  // green
                indicator.style.boxShadow = '0 0 8px rgba(78,204,163,0.7)';
            }
        })
        .catch(err => {
            element.classList.remove('loading');
            element.classList.add('error');
            element.textContent = 'Error loading data';

            // error state
            indicator.style.backgroundColor = '#ff6b6b';  // red
            indicator.style.boxShadow = '0 0 8px rgba(255,107,107,0.7)';
        });
});