// -------------------- AUTHENTICATION --------------------

let currentMobileNumber = null;
let currentUserLocation = null;

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const mobileNumber = document.getElementById('mobileNumber').value;
    
    if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    // Simulate OTP sending
    currentMobileNumber = mobileNumber;
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('otpSection').classList.remove('hidden');
    
    // Generate a simple OTP for demo (in real app, this would be sent via SMS)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('OTP for demo: ' + otp); // For testing - show in console
    window.demoOTP = otp; // Store for verification
});

// OTP verification handler
document.getElementById('verifyOtpBtn').addEventListener('click', function() {
    const otpInput = document.getElementById('otpInput').value;
    
    // For demo: accept any 6-digit OTP (in real app, verify against sent OTP)
    if (otpInput.length !== 6 || isNaN(otpInput)) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }
    
    // Move to details section
    document.getElementById('loginSection').classList.remove('active');
    document.getElementById('detailsSection').classList.add('active');
});

// User details form handler
document.getElementById('detailsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    
    if (!city || !state || !pincode) {
        alert('Please fill all fields');
        return;
    }
    
    if (pincode.length !== 6 || isNaN(pincode)) {
        alert('Please enter a valid 6-digit pincode');
        return;
    }
    
    // Store user location
    currentUserLocation = {
        city: city,
        state: state,
        pincode: pincode
    };
    
    // Hide auth sections and show dashboard
    document.getElementById('detailsSection').classList.remove('active');
    document.getElementById('dashboardSection').classList.remove('hidden');
    
    // Initialize map with user's location (using a default coordinate for demo)
    initializeDashboard();
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Reset to login screen
    currentMobileNumber = null;
    currentUserLocation = null;
    
    // Reset forms
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('otpSection').classList.add('hidden');
    document.getElementById('mobileNumber').value = '';
    document.getElementById('otpInput').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('pincode').value = '';
    
    // Show login section
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('detailsSection').classList.remove('active');
    document.getElementById('loginSection').classList.add('active');
});

// -------------------- DASHBOARD INITIALIZATION --------------------

let map = null;

function initializeDashboard() {
    // Initialize map only when dashboard is shown
    if (map === null) {
        map = L.map('map').setView([28.61, 77.23], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Comprehensive AQI Data for Indian Cities
        const areas = [
            { name: "Delhi", lat: 28.6139, lng: 77.2090, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Mumbai", lat: 19.0760, lng: 72.8777, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Kolkata", lat: 22.5726, lng: 88.3639, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Chennai", lat: 13.0827, lng: 80.2707, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Bengaluru", lat: 12.9716, lng: 77.5946, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Hyderabad", lat: 17.3850, lng: 78.4867, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Pune", lat: 18.5204, lng: 73.8567, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Jaipur", lat: 26.9124, lng: 75.7873, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Lucknow", lat: 26.8467, lng: 80.9462, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Kanpur", lat: 25.4358, lng: 80.3467, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Nagpur", lat: 21.1458, lng: 79.0882, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Indore", lat: 22.7196, lng: 75.8577, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Bhopal", lat: 23.1815, lng: 79.9864, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Patna", lat: 25.5941, lng: 85.1376, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Ranchi", lat: 23.3441, lng: 85.3096, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Raipur", lat: 21.2514, lng: 81.6296, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Chandigarh", lat: 30.7333, lng: 76.7794, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Surat", lat: 21.1707, lng: 72.8311, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Vadodara", lat: 22.3072, lng: 73.1812, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Coimbatore", lat: 11.0066, lng: 76.9655, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Madurai", lat: 9.9252, lng: 78.1198, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Kochi", lat: 9.9312, lng: 76.2673, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Visakhapatnam", lat: 17.6869, lng: 83.2185, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Vijayawada", lat: 16.5062, lng: 80.6480, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Mysuru", lat: 12.2958, lng: 76.6394, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Mangalore", lat: 12.8628, lng: 74.8455, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Guwahati", lat: 26.1445, lng: 91.7362, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Shillong", lat: 25.5788, lng: 91.8933, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Imphal", lat: 24.8170, lng: 94.7772, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Aizawl", lat: 23.1815, lng: 93.3110, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Agartala", lat: 23.8103, lng: 91.2787, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Gangtok", lat: 27.5330, lng: 88.6109, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Dehradun", lat: 30.1978, lng: 78.1450, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Haridwar", lat: 29.9457, lng: 78.1642, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Varanasi", lat: 25.3201, lng: 82.9857, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Prayagraj", lat: 25.4358, lng: 81.8463, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Amritsar", lat: 31.6340, lng: 74.8711, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Ludhiana", lat: 30.9010, lng: 75.8573, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Jalandhar", lat: 31.7260, lng: 75.5762, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Srinagar", lat: 34.0837, lng: 74.7973, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Jammu", lat: 32.7216, lng: 75.0997, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Udaipur", lat: 24.5854, lng: 73.7125, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Jodhpur", lat: 26.2389, lng: 73.0243, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Ajmer", lat: 26.4499, lng: 74.6399, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Gwalior", lat: 26.2183, lng: 78.1828, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Meerut", lat: 28.9845, lng: 77.7064, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Noida", lat: 28.5921, lng: 77.3871, aqi: Math.floor(Math.random() * 400) + 50 },
            { name: "Faridabad", lat: 28.4089, lng: 77.3178, aqi: Math.floor(Math.random() * 400) + 50 }
        ];
        
        // Add markers
        areas.forEach(area => {
            L.circleMarker([area.lat, area.lng], {
                color: getColor(area.aqi),
                radius: 3,
                fillOpacity: 0.8
            }).addTo(map)
            .bindPopup(`${area.name} <br> AQI: ${area.aqi}`);
        });
        
        // Add AQI Legend
        const legend = L.control({ position: 'bottomright' });
        
        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'aqi-legend');
            div.innerHTML = `
                <div class="legend-title">AQI Ranges</div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #00B050;"></span>
                    <span>0-50: Good</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #FFD700;"></span>
                    <span>51-100: Satisfactory</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #FF8C00;"></span>
                    <span>101-200: Moderately Polluted</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #FF0000;"></span>
                    <span>201-300: Poor</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #800080;"></span>
                    <span>301+: Severe</span>
                </div>
            `;
            return div;
        };
        
        legend.addTo(map);
        
        // Use highest AQI for alert
        let maxAQI = Math.max(...areas.map(a => a.aqi));
        updateHealthAlert(maxAQI);
        
        // Initialize chart
        initializeChart();
        
        // Wire up sidebar buttons
        setupSidebarButtons();
        
        // Default: show map only
        showMapOnly();
        setActiveButton('btnHome');
    }
    
    // Refresh map size
    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 100);
}

// -------------------- MAP & AQI FUNCTIONS --------------------

function getColor(aqi) {
    if (aqi <= 50) return "#00B050";      // Green: 0-50 (Good)
    if (aqi <= 100) return "#FFD700";     // Yellow: 51-100 (Satisfactory)
    if (aqi <= 200) return "#FF8C00";     // Orange: 101-200 (Moderately Polluted)
    if (aqi <= 300) return "#FF0000";     // Red: 201-300 (Poor)
    return "#800080";                      // Violet: 301+ (Severe)
}

function updateHealthAlert(aqi) {
    let alertBox = document.getElementById("healthAlert");
    
    if (aqi <= 100) {
        alertBox.innerHTML = "Air Quality is Good. Normal outdoor activities allowed.";
        alertBox.style.background = "#bbf7d0";
    }
    else if (aqi <= 200) {
        alertBox.innerHTML = "Moderate pollution. Sensitive groups avoid outdoor activity.";
        alertBox.style.background = "#fde68a";
    }
    else if (aqi <= 300) {
        alertBox.innerHTML = "High pollution. Reduce prolonged outdoor exposure.";
        alertBox.style.background = "#fca5a5";
    }
    else {
        alertBox.innerHTML = "Severe Pollution! Stay Indoors. Emergency Measures Recommended.";
        alertBox.style.background = "#c084fc";
    }
}

// -------------------- CHART --------------------

let myChart = null;

function initializeChart() {
    if (myChart) return;
    
    var ctx = document.getElementById('aqiChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'AQI Trend',
                data: [150, 200, 180, 300, 280, 220, 260],
                borderColor: 'red',
                backgroundColor: 'rgba(255,0,0,0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// -------------------- UI FUNCTIONS --------------------

function showChart() {
    document.getElementById('chartCard').classList.add('active');
    document.getElementById('alertCard').classList.remove('active');
    document.getElementById('overlay').style.display = 'block';
    setTimeout(() => { if (myChart) myChart.resize(); }, 60);
}

function showAlert() {
    document.getElementById('chartCard').classList.remove('active');
    document.getElementById('alertCard').classList.add('active');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('map').style.display = 'none';
}

function showMapOnly() {
    document.getElementById('chartCard').classList.remove('active');
    document.getElementById('alertCard').classList.remove('active');
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('map').style.display = 'block';
    try { if (map) map.invalidateSize(); } catch(e) {}
}

function setupSidebarButtons() {
    document.getElementById('btnHome').addEventListener('click', function() {
        showMapOnly();
        setActiveButton('btnHome');
    });
    document.getElementById('btnWarning').addEventListener('click', function() {
        showAlert();
        setActiveButton('btnWarning');
    });
    document.getElementById('btnAQI').addEventListener('click', function() {
        showChart();
        setActiveButton('btnAQI');
    });
}

function setActiveButton(id) {
    document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// --- Search functionality ---
let searchMarker = null;

function handleSearch(query) {
    if (!query || !query.trim()) return;
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(query);
    fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                alert('Location not found');
                return;
            }
            const loc = data[0];
            const lat = parseFloat(loc.lat);
            const lon = parseFloat(loc.lon);
            
            showMapOnly();
            setActiveButton('btnHome');
            
            if (map) {
                map.setView([lat, lon], 12);
                
                if (searchMarker) {
                    map.removeLayer(searchMarker);
                }
                searchMarker = L.marker([lat, lon]).addTo(map).bindPopup(loc.display_name).openPopup();
            }
        })
        .catch(err => {
            console.error(err);
            alert('Search failed');
        });
}

document.getElementById('searchBtn').addEventListener('click', function() {
    const q = document.getElementById('searchInput').value;
    handleSearch(q);
});

document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        handleSearch(this.value);
    }
});

