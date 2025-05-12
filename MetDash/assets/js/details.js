// 1) Grab the station from ?station=KXXX
const params = new URLSearchParams(window.location.search);
const station = params.get('station');
if (!station) {
    document.getElementById('details-container').innerHTML = `
        <div class="error" style="text-align: center; padding: 2rem;">
            <h2>No station specified</h2>
            <p>Please return to the home page and select a station.</p>
            <a href="index.html" class="back-button" style="margin-top: 1rem; display: inline-block;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                </svg>
                Back to Stations
            </a>
        </div>
    `;
    throw new Error('No station in URL');
}

// 2) Show it in the heading
const stationCodeEl = document.getElementById('station-code');
stationCodeEl.textContent = station;
stationCodeEl.classList.remove('loading-details');
document.title = `METAR - ${station}`;

// Helper functions
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp * 1000);
    return date.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}

function getWindDirectionArrow(degrees) {
    if (degrees === null || degrees === undefined) return '';

    // Convert degrees to arrow character
    const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
    const index = Math.round(degrees / 45) % 8;
    return `<span class="wind-direction" title="${degrees}°">${directions[index]}</span>`;
}

function getCloudEmoji(cover) {
    switch (cover) {
        case 'CLR': return '☀️ Clear';
        case 'FEW': return '🌤️ Few';
        case 'SCT': return '⛅ Scattered';
        case 'BKN': return '🌥️ Broken';
        case 'OVC': return '☁️ Overcast';
        case 'VV': return '🌫️ Vertical Visibility';
        default: return cover || 'Unknown';
    }
}

function createMetarCard(title, value, units = null) {
    const card = document.createElement('div');
    card.className = 'metar-card';

    const heading = document.createElement('h4');
    heading.textContent = title;
    card.appendChild(heading);

    const valueEl = document.createElement('div');
    valueEl.className = 'metar-value';

    if (value === null || value === undefined) {
        valueEl.textContent = 'N/A';
    } else {
        valueEl.textContent = value;

        if (units) {
            const unitsEl = document.createElement('span');
            unitsEl.className = 'metar-units';
            unitsEl.textContent = units;
            valueEl.appendChild(unitsEl);
        }
    }

    card.appendChild(valueEl);
    return card;
}

function updateStatusIndicator(metarData) {
    const statusContainer = document.getElementById('metar-status');
    const statusIndicator = statusContainer.querySelector('.status-indicator');
    const statusText = document.getElementById('status-text');

    const wspd = metarData.wspd;

    if (wspd == null) {
        // no wind info
        statusIndicator.style.backgroundColor = '#f9c74f';  // yellow
        statusIndicator.style.boxShadow = '0 0 8px rgba(249,199,79,0.7)';
        statusText.textContent = 'No wind information available';
    } else if (wspd >= 20) {
        // very high wind
        statusIndicator.style.backgroundColor = '#ff6b6b';  // red
        statusIndicator.style.boxShadow = '0 0 8px rgba(255,107,107,0.7)';
        statusText.textContent = `High winds: ${wspd} knots`;
    } else if (wspd >= 10) {
        // moderate wind
        statusIndicator.style.backgroundColor = '#f9c74f';  // yellow
        statusIndicator.style.boxShadow = '0 0 8px rgba(249,199,79,0.7)';
        statusText.textContent = `Moderate winds: ${wspd} knots`;
    } else {
        // low wind
        statusIndicator.style.backgroundColor = '#4ecca3';  // green
        statusIndicator.style.boxShadow = '0 0 8px rgba(78,204,163,0.7)';
        statusText.textContent = `Light winds: ${wspd} knots`;
    }

    statusContainer.style.display = 'flex';
}

// 3) Fetch raw METAR and parse it
const fullRawEl = document.getElementById('full-raw');
const summaryContainer = document.getElementById('metar-summary');
const cloudContainer = document.getElementById('cloud-conditions');

fetch(`https://ripple-candle-microraptor.glitch.me/metar?ids=${station}`)
    .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
    .then(data => {
        fullRawEl.classList.remove('loading-details');

        const metarData = data[0] || {};

        if (!metarData.rawOb) {
            fullRawEl.textContent = 'No raw METAR data available for this station.';
            return;
        }

        // Display raw METAR
        fullRawEl.textContent = metarData.rawOb;

        // Update station info
        if (metarData.name) {
            document.getElementById('station-name').textContent = metarData.name;
        }

        // Format and display observation time
        if (metarData.obsTime) {
            document.getElementById('observation-time').textContent =
                `Observation Time: ${formatTimestamp(metarData.obsTime)}`;
        }

        // Update status indicator
        updateStatusIndicator(metarData);

        // Clear and rebuild summary cards
        summaryContainer.innerHTML = '';

        // Temperature
        if (metarData.temp !== undefined) {
            summaryContainer.appendChild(createMetarCard('Temperature', metarData.temp, '°C'));
        }

        // Dew Point
        if (metarData.dewp !== undefined) {
            summaryContainer.appendChild(createMetarCard('Dew Point', metarData.dewp, '°C'));
        }

        // Wind
        if (metarData.wdir !== undefined || metarData.wspd !== undefined) {
            const windValue = document.createElement('div');

            if (metarData.wspd === 0) {
                windValue.textContent = 'Calm';
            } else {
                if (metarData.wdir !== undefined && metarData.wdir !== null) {
                    windValue.textContent = `${metarData.wdir}°`;
                    windValue.innerHTML += getWindDirectionArrow(metarData.wdir);
                } else {
                    windValue.textContent = 'Variable';
                }

                if (metarData.wspd !== undefined && metarData.wspd !== null) {
                    windValue.textContent += ` at ${metarData.wspd}`;
                }
            }

            const windCard = document.createElement('div');
            windCard.className = 'metar-card';

            const heading = document.createElement('h4');
            heading.textContent = 'Wind';
            windCard.appendChild(heading);

            const valueEl = document.createElement('div');
            valueEl.className = 'metar-value';
            valueEl.appendChild(windValue);

            if (metarData.wspd !== undefined && metarData.wspd !== null && metarData.wspd > 0) {
                const unitsEl = document.createElement('span');
                unitsEl.className = 'metar-units';
                unitsEl.textContent = ' knots';
                valueEl.appendChild(unitsEl);
            }

            windCard.appendChild(valueEl);
            summaryContainer.appendChild(windCard);
        }

        // Visibility
        if (metarData.visib !== undefined) {
            const visValue = metarData.visib === '10+' ? 'Unlimited (10+)' : metarData.visib;
            summaryContainer.appendChild(createMetarCard('Visibility', visValue, 'SM'));
        }

        // Altimeter
        if (metarData.altim !== undefined) {
            summaryContainer.appendChild(createMetarCard('Altimeter',
                (metarData.altim / 33.8639).toFixed(2), 'inHg'));
        }

        // Barometric Pressure
        if (metarData.slp !== undefined) {
            summaryContainer.appendChild(createMetarCard('Pressure', metarData.slp, 'hPa'));
        }

        // Weather string
        if (metarData.wxString) {
            summaryContainer.appendChild(createMetarCard('Weather', metarData.wxString));
        }

        // Process cloud data
        if (metarData.clouds && metarData.clouds.length > 0) {
            cloudContainer.innerHTML = '';

            if (metarData.clouds.length === 1 && metarData.clouds[0].cover === 'CLR') {
                const cloudPill = document.createElement('div');
                cloudPill.className = 'cloud-pill';
                cloudPill.innerHTML = getCloudEmoji('CLR');
                cloudContainer.appendChild(cloudPill);
            } else {
                metarData.clouds.forEach(cloud => {
                    const cloudPill = document.createElement('div');
                    cloudPill.className = 'cloud-pill';

                    let cloudText = getCloudEmoji(cloud.cover);
                    if (cloud.base !== null && cloud.base !== undefined) {
                        cloudText += ` at ${cloud.base} ft`;
                    }

                    cloudPill.innerHTML = cloudText;
                    cloudContainer.appendChild(cloudPill);
                });
            }
        }
    })
    .catch(err => {
        fullRawEl.classList.remove('loading-details');
        fullRawEl.classList.add('error');
        fullRawEl.textContent = 'Error loading raw METAR data. Please try again later.';
        console.error(err);
    });

// 4) Fetch decoded data
const decodedEl = document.getElementById('decoded');
fetch(`https://ripple-candle-microraptor.glitch.me/metar-decoded?ids=${station}`)
    .then(r => r.ok ? r.text() : Promise.reject(r.statusText))
    .then(text => {
        decodedEl.classList.remove('loading-details');
        decodedEl.textContent = text || 'No decoded information available for this station.';
    })
    .catch(err => {
        decodedEl.classList.remove('loading-details');
        decodedEl.classList.add('error');
        decodedEl.textContent = 'Error loading decoded data. Please try again later.';
        console.error(err);
    });