/* =========================================================
   VAYU — AQI Dashboard  |  script.js
   ========================================================= */

// ── DATA ──────────────────────────────────────────────────
const CITY_LOOKUP = {
  "new delhi": "delhi", "delhi": "delhi",
  "mumbai": "mumbai", "bombay": "mumbai",
  "bangalore": "bangalore", "bengaluru": "bangalore",
  "chennai": "chennai", "madras": "chennai",
  "kolkata": "kolkata", "calcutta": "kolkata",
  "hyderabad": "delhi", "pune": "mumbai",
  "ahmedabad": "delhi", "jaipur": "delhi"
};

const CITIES = {
  delhi: {
    name: "New Delhi", displayName: "NEW DELHI",
    lat: 28.6139, lng: 77.2090, zoom: 11,
    zones: [
      { name: "Anand Vihar",   aqi: 318, pm25: 149, lat: 28.6469, lng: 77.3159 },
      { name: "RK Puram",      aqi: 248, pm25: 116, lat: 28.5693, lng: 77.1858 },
      { name: "Punjabi Bagh",  aqi: 195, pm25:  91, lat: 28.6663, lng: 77.1292 },
      { name: "ITO",           aqi: 282, pm25: 132, lat: 28.6289, lng: 77.2445 },
      { name: "Lodhi Road",    aqi: 163, pm25:  76, lat: 28.5910, lng: 77.2246 },
      { name: "Dwarka Sec-8",  aqi: 226, pm25: 106, lat: 28.5900, lng: 77.0390 },
      { name: "Jahangirpuri", aqi: 294, pm25: 138, lat: 28.7299, lng: 77.1677 },
      { name: "Okhla Phase-2", aqi:  85, pm25:  37, lat: 28.5355, lng: 77.2734 },
    ]
  },
  mumbai: {
    name: "Mumbai", displayName: "MUMBAI",
    lat: 19.0760, lng: 72.8777, zoom: 11,
    zones: [
      { name: "Bandra Kurla", aqi:  92, pm25: 41, lat: 19.0596, lng: 72.8655 },
      { name: "Chembur",      aqi: 152, pm25: 70, lat: 19.0547, lng: 72.9009 },
      { name: "Worli",        aqi:  68, pm25: 30, lat: 18.9994, lng: 72.8156 },
      { name: "Powai",        aqi: 115, pm25: 52, lat: 19.1174, lng: 72.9060 },
      { name: "Borivali",     aqi:  62, pm25: 27, lat: 19.2308, lng: 72.8567 },
      { name: "Dharavi",      aqi: 178, pm25: 83, lat: 19.0404, lng: 72.8528 },
    ]
  },
  bangalore: {
    name: "Bangalore", displayName: "BANGALORE",
    lat: 12.9716, lng: 77.5946, zoom: 11,
    zones: [
      { name: "BTM Layout", aqi:  55, pm25: 24, lat: 12.9165, lng: 77.6101 },
      { name: "Peenya",     aqi: 138, pm25: 63, lat: 13.0299, lng: 77.5194 },
      { name: "Hebbal",     aqi:  95, pm25: 43, lat: 13.0354, lng: 77.5966 },
      { name: "Silk Board", aqi: 122, pm25: 56, lat: 12.9174, lng: 77.6228 },
      { name: "Whitefield", aqi:  74, pm25: 33, lat: 12.9698, lng: 77.7499 },
    ]
  },
  chennai: {
    name: "Chennai", displayName: "CHENNAI",
    lat: 13.0827, lng: 80.2707, zoom: 11,
    zones: [
      { name: "Manali",       aqi: 168, pm25: 78, lat: 13.1667, lng: 80.2560 },
      { name: "Velachery",    aqi:  86, pm25: 38, lat: 12.9781, lng: 80.2209 },
      { name: "Ambattur",     aqi: 125, pm25: 58, lat: 13.1142, lng: 80.1531 },
      { name: "Nungambakkam", aqi:  72, pm25: 32, lat: 13.0606, lng: 80.2430 },
      { name: "Perungudi",    aqi:  98, pm25: 44, lat: 12.9648, lng: 80.2444 },
    ]
  },
  kolkata: {
    name: "Kolkata", displayName: "KOLKATA",
    lat: 22.5726, lng: 88.3639, zoom: 11,
    zones: [
      { name: "Jadavpur",         aqi: 182, pm25: 85, lat: 22.4972, lng: 88.3714 },
      { name: "Rabindra Sarobar", aqi: 136, pm25: 63, lat: 22.5121, lng: 88.3513 },
      { name: "Ballygunge",       aqi: 152, pm25: 70, lat: 22.5249, lng: 88.3659 },
      { name: "Dumdum",           aqi: 202, pm25: 94, lat: 22.6421, lng: 88.3967 },
      { name: "Salt Lake",        aqi: 114, pm25: 52, lat: 22.5771, lng: 88.4197 },
    ]
  }
};

const CATEGORIES = [
  { max: 50,  label: "Good",                    color: "#22c55e", riskPct: 8  },
  { max: 100, label: "Moderate",                color: "#eab308", riskPct: 25 },
  { max: 150, label: "Unhealthy for Sensitive", color: "#f97316", riskPct: 45 },
  { max: 200, label: "Unhealthy",               color: "#ef4444", riskPct: 62 },
  { max: 300, label: "Very Unhealthy",          color: "#a855f7", riskPct: 80 },
  { max: 500, label: "Hazardous",               color: "#7e0023", riskPct: 100 },
];

const HEALTH = [
  { warning: "Air quality is satisfactory and poses little or no health risk.",
    guidelines: ["Great time for outdoor activities", "Open windows for fresh air", "No special precautions needed"],
    vulnerable: ["All groups are safe today", "No restrictions on activity", "Enjoy the outdoors freely"] },
  { warning: "Sensitive individuals should consider reducing prolonged outdoor exertion.",
    guidelines: ["Limit prolonged outdoor activity if sensitive", "Stay hydrated outdoors", "Monitor air quality updates"],
    vulnerable: ["Asthma patients: mild caution", "Elderly: limit strenuous outdoor activity", "Children: short outdoor sessions ok"] },
  { warning: "Sensitive groups may experience health effects. General public less likely to be affected.",
    guidelines: ["Sensitive groups limit outdoor time", "Wear N95 mask if outside", "Use air purifiers indoors", "Avoid vigorous outdoor exercise"],
    vulnerable: ["Asthma patients: keep inhaler handy", "Elderly: reduce outdoor exposure", "Children: limit outdoor playtime"] },
  { warning: "Everyone may begin experiencing health effects. Sensitive groups may be more seriously affected.",
    guidelines: ["Avoid outdoor exertion", "Keep windows closed", "Run air purifiers on high", "N95 mask mandatory outdoors"],
    vulnerable: ["High risk of asthma attacks", "All children stay indoors", "Elderly: avoid outdoors", "Pregnant women: extra precautions"] },
  { warning: "Health alert — everyone may experience serious health effects. Avoid all outdoor activities.",
    guidelines: ["Stay indoors at all times", "N95/KN95 mask if going outside", "Seal window and door gaps", "Work from home if possible"],
    vulnerable: ["All people at significant risk", "Seek medical help for breathing issues", "Asthma/COPD patients: emergency care level"] },
  { warning: "EMERGENCY — public health emergency. Everyone is at risk of serious health effects.",
    guidelines: ["Do NOT go outside", "Close all windows and seal gaps", "Call emergency services if breathing difficulty", "Evacuate if possible"],
    vulnerable: ["Life-threatening for ALL groups", "Children, elderly: evacuate or shelter", "Immediate medical attention required"] },
];

const CITY_SUGGESTIONS = [
  { name: "New Delhi", key: "delhi", pin: "110001" },
  { name: "Mumbai", key: "mumbai", pin: "400001" },
  { name: "Bangalore", key: "bangalore", pin: "560001" },
  { name: "Chennai", key: "chennai", pin: "600001" },
  { name: "Kolkata", key: "kolkata", pin: "700001" },
  { name: "Hyderabad", key: "delhi", pin: "500001" },
  { name: "Pune", key: "mumbai", pin: "411001" },
  { name: "Ahmedabad", key: "delhi", pin: "380001" },
  { name: "Jaipur", key: "delhi", pin: "302001" },
  { name: "Bengaluru", key: "bangalore", pin: "560001" },
];

// ── STATE ─────────────────────────────────────────────────
let currentCity = "delhi";
let leafletMap = null;
let leafletMarkers = [];
let policies = { vehicle: false, construction: false, factory: false, school: false };
let policyReductions = { vehicle: 0, construction: 0, factory: 0, school: 0 };
let charts = {};
let currentTheme = "dark";
let loggedInUser = "";
let userLocation = "";
let brRunning = false, brPhaseTimeout = null, brCountInterval = null, brSessionTimer = null, brCycles = 0, brSessionStart = null;
let forecastChartInst = null;

// ── LOGIN FLOW ────────────────────────────────────────────
function handleLogin() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  const err = document.getElementById("loginError");

  if (!user) { showErr(err, "Please enter your username"); return; }
  if (pass.length < 3) { showErr(err, "Password must be at least 3 characters"); return; }

  err.classList.remove("show");
  loggedInUser = user;

  // animate transition to step 2
  document.getElementById("step1").style.animation = "cardOut .3s ease forwards";
  setTimeout(() => {
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    document.getElementById("step2").style.animation = "cardIn .35s ease";
  }, 280);
}

function togglePassVis() {
  const inp = document.getElementById("loginPass");
  inp.type = inp.type === "password" ? "text" : "password";
}

function filterCitySuggestions(val) {
  const box = document.getElementById("citySuggestions");
  if (!val || val.length < 2) { box.classList.remove("show"); return; }
  const filtered = CITY_SUGGESTIONS.filter(c => c.name.toLowerCase().startsWith(val.toLowerCase()));
  if (!filtered.length) { box.classList.remove("show"); return; }
  box.innerHTML = filtered.map(c =>
    `<div class="city-sug-item" onclick="pickCity('${c.name}','${c.pin}')">📍 ${c.name} <span>${c.pin}</span></div>`
  ).join("");
  box.classList.add("show");
}

function pickCity(name, pin) {
  document.getElementById("cityInput").value = name;
  document.getElementById("pinInput").value = pin;
  document.getElementById("citySuggestions").classList.remove("show");
}

function handleCitySubmit() {
  const cityInput = document.getElementById("cityInput").value.trim();
  const pin = document.getElementById("pinInput").value.trim();
  const err = document.getElementById("cityError");

  if (!cityInput) { showErr(err, "Please enter your city name"); return; }
  if (pin.length !== 6) { showErr(err, "Please enter a valid 6-digit PIN code"); return; }

  err.classList.remove("show");

  // Find city key
  const normalized = cityInput.toLowerCase().replace(/\s+/g, " ");
  const cityKey = CITY_LOOKUP[normalized] || "delhi";
  const displayCity = CITY_SUGGESTIONS.find(c => c.name.toLowerCase() === normalized)?.name || cityInput;

  userLocation = `${displayCity} — ${pin}`;
  currentCity = cityKey;

  // Update UI
  document.getElementById("sfUsername").textContent = loggedInUser;
  document.getElementById("sfAvatar").textContent = loggedInUser[0].toUpperCase();
  document.getElementById("sfUserloc").textContent = userLocation;

  // Sync city picker
  const picker = document.getElementById("cityPicker");
  picker.value = cityKey;
  if (!picker.querySelector(`option[value="${cityKey}"]`)) picker.value = "delhi";

  // Launch app
  document.getElementById("loginScreen").style.animation = "fadeOut .4s ease forwards";
  setTimeout(() => {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("appShell").style.display = "flex";
    initApp();
    // Auto-navigate to map to show their city
    switchPage("map");
    setTimeout(() => initMap(), 100);
  }, 380);
}

function handleLogout() {
  document.getElementById("appShell").style.display = "none";
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("loginScreen").style.animation = "none";
  document.getElementById("step1").style.display = "block";
  document.getElementById("step1").style.animation = "cardIn .4s ease";
  document.getElementById("step2").style.display = "none";
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
  document.getElementById("loginError").classList.remove("show");
  if (brRunning) stopBreathing();
}

function showErr(el, msg) { el.textContent = msg; el.classList.add("show"); }

// ── THEME ─────────────────────────────────────────────────
function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  // Rebuild charts for new theme
  if (document.getElementById("page-overview").classList.contains("active")) updateOverview();
  if (document.getElementById("page-trends").classList.contains("active")) loadTrend("weekly", document.querySelector(".trend-tab"));
  // Update map tiles
  if (leafletMap) rebuildMapTiles();
}

function rebuildMapTiles() {
  leafletMap.eachLayer(layer => { if (layer._url) leafletMap.removeLayer(layer); });
  const tileUrl = currentTheme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  L.tileLayer(tileUrl, { attribution: "© OpenStreetMap © CARTO" }).addTo(leafletMap);
}

// ── INIT APP ──────────────────────────────────────────────
function initApp() {
  initNav();
  refreshAll();
  // Auto jitter every 30s
  setInterval(() => {
    Object.values(CITIES).forEach(city => {
      city.zones.forEach(z => {
        z.aqi = Math.max(15, z.aqi + Math.round((Math.random() - 0.5) * 8));
        z.pm25 = Math.round(z.aqi * 0.47);
      });
    });
    refreshAll();
    if (leafletMap) updateMapMarkers();
  }, 30000);
}

// ── NAVIGATION ────────────────────────────────────────────
function initNav() {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      switchPage(link.dataset.page);
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
}

function switchPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  const pg = document.getElementById("page-" + page);
  if (pg) pg.classList.add("active");
  const lnk = document.querySelector(`[data-page="${page}"]`);
  if (lnk) lnk.classList.add("active");
  if (page === "map") setTimeout(initMap, 60);
  if (page === "trends") loadTrend("weekly", document.querySelector(".trend-tab.active") || document.querySelector(".trend-tab"));
  if (page === "breathing") updateBreathingChip();
  if (page === "forecast") buildForecastPage();
  if (page === "heatmap") buildHeatmap();
}

function toggleSidebar() { document.getElementById("sidebar").classList.toggle("open"); }
function closeSidebar() { document.getElementById("sidebar").classList.remove("open"); }

// ── CITY SELECT ───────────────────────────────────────────
function selectCity(city) {
  currentCity = city;
  refreshAll();
  if (leafletMap) {
    const c = CITIES[city];
    leafletMap.setView([c.lat, c.lng], c.zoom);
    updateMapMarkers();
  }
}

function refreshAll() {
  updateOverview();
  updateAlerts();
  updatePolicySim();
  updateBreathingChip();
}

// ── HELPERS ───────────────────────────────────────────────
function getCategory(aqi) { return CATEGORIES.find(c => aqi <= c.max) || CATEGORIES[CATEGORIES.length - 1]; }
function getCatIndex(aqi) { const i = CATEGORIES.findIndex(c => aqi <= c.max); return i < 0 ? CATEGORIES.length - 1 : i; }
function avgAqi(city) { const z = CITIES[city].zones; return Math.round(z.reduce((s, zz) => s + zz.aqi, 0) / z.length); }
function isDark() { return currentTheme === "dark"; }
function textColor() { return isDark() ? "#e2e8f4" : "#1a2035"; }
function mutedColor() { return isDark() ? "#8392b0" : "#5a6a8a"; }
function gridColor() { return isDark() ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.07)"; }

function chartDefaults() {
  return {
    tooltip: {
      backgroundColor: isDark() ? "#0e1219" : "#ffffff",
      titleColor: textColor(), bodyColor: mutedColor(),
      borderColor: isDark() ? "#1e2535" : "#dde3ee",
      borderWidth: 1, padding: 10, cornerRadius: 8,
      titleFont: { family: "'Inter'", weight: "600", size: 12 },
      bodyFont: { family: "'Inter'", size: 11 }
    }
  };
}
function chartScales() {
  return {
    x: { grid: { color: gridColor() }, ticks: { color: mutedColor(), font: { family: "'Inter'", size: 11 } }, border: { color: isDark() ? "#1e2535" : "#dde3ee" } },
    y: { grid: { color: gridColor() }, ticks: { color: mutedColor(), font: { family: "'Inter'", size: 11 } }, border: { color: isDark() ? "#1e2535" : "#dde3ee" } }
  };
}

// ── GAUGE CANVAS ──────────────────────────────────────────
function drawGauge(canvas, aqi) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, r = W * 0.41;
  ctx.clearRect(0, 0, W, H);
  const trackColor = isDark() ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25, false);
  ctx.strokeStyle = trackColor; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.stroke();
  const pct = Math.min(aqi / 400, 1);
  const start = Math.PI * 0.75, end = start + pct * (Math.PI * 1.5);
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#22c55e"); grad.addColorStop(.4, "#eab308");
  grad.addColorStop(.7, "#ef4444"); grad.addColorStop(1, "#7e0023");
  ctx.beginPath();
  ctx.arc(cx, cy, r, start, end, false);
  ctx.strokeStyle = grad; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.stroke();
  const cat = getCategory(aqi);
  ctx.beginPath();
  ctx.arc(cx, cy, r, start, end, false);
  ctx.strokeStyle = cat.color + "40"; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.stroke();
}

// ── OVERVIEW ──────────────────────────────────────────────
function updateOverview() {
  const city = CITIES[currentCity];
  const zones = city.zones;
  const avg = avgAqi(currentCity);
  const cat = getCategory(avg);
  const catIdx = getCatIndex(avg);
  const hotspot = zones.reduce((a, b) => a.aqi > b.aqi ? a : b);
  const clean = zones.reduce((a, b) => a.aqi < b.aqi ? a : b);

  document.getElementById("heroCity").textContent = city.displayName;
  const aqiEl = document.getElementById("heroAqi");
  aqiEl.textContent = avg; aqiEl.style.color = cat.color;
  document.getElementById("heroAqiCat").textContent = cat.label;
  document.getElementById("heroAqiCat").style.color = cat.color;
  document.getElementById("heroTime").textContent = new Date().toLocaleTimeString();

  const gc = document.getElementById("heroGauge");
  drawGauge(gc, avg);
  document.getElementById("hgoNum").textContent = avg;
  document.getElementById("hgoCat").textContent = cat.label;

  const hCat = getCategory(hotspot.aqi), cCat = getCategory(clean.aqi);
  document.getElementById("sc1v").textContent = hotspot.name;
  document.getElementById("sc1s").innerHTML = `AQI <span style="color:${hCat.color};font-weight:700">${hotspot.aqi}</span>`;
  document.getElementById("sc2v").textContent = clean.name;
  document.getElementById("sc2s").innerHTML = `AQI <span style="color:${cCat.color};font-weight:700">${clean.aqi}</span>`;

  const actCount = Object.values(policies).filter(Boolean).length;
  document.getElementById("sc3v").textContent = `${actCount} / 4`;
  document.getElementById("sc3s").textContent = actCount ? `${actCount} measure${actCount > 1 ? "s" : ""} active` : "No measures active";

  const riskLabels = ["Low", "Moderate", "Elevated", "High", "Very High", "Critical"];
  const adviceSub = ["Safe outdoors", "Sensitive: take care", "Limit outdoor activity", "Avoid outdoor exertion", "Stay indoors", "Emergency conditions"];
  document.getElementById("sc4v").textContent = riskLabels[catIdx] || "Critical";
  document.getElementById("sc4v").style.color = cat.color;
  document.getElementById("sc4s").textContent = adviceSub[catIdx] || adviceSub[adviceSub.length - 1];

  // Zones
  const list = document.getElementById("zonesList");
  list.innerHTML = `<div class="zone-row zone-row-head"><span>Zone</span><span>AQI</span><span>Category</span><span>PM2.5</span></div>`;
  zones.forEach(z => {
    const zc = getCategory(z.aqi);
    const row = document.createElement("div");
    row.className = "zone-row";
    row.innerHTML = `<span>${z.name}</span><span class="zone-aqi" style="color:${zc.color}">${z.aqi}</span><span><span class="zone-cat-chip" style="background:${zc.color}20;color:${zc.color};border:1px solid ${zc.color}40">${zc.label}</span></span><span class="zone-pm">${z.pm25} µg/m³</span>`;
    list.appendChild(row);
  });
  document.getElementById("zonesBadge").textContent = `${zones.length} zones`;

  // Snapshot chart
  const ctx = document.getElementById("snapshotChart").getContext("2d");
  if (charts.snapshot) charts.snapshot.destroy();
  charts.snapshot = new Chart(ctx, {
    type: "bar",
    data: {
      labels: zones.map(z => z.name.split(" ")[0]),
      datasets: [{ data: zones.map(z => z.aqi), backgroundColor: zones.map(z => getCategory(z.aqi).color + "55"), borderColor: zones.map(z => getCategory(z.aqi).color), borderWidth: 2, borderRadius: 5 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: chartDefaults().tooltip }, scales: chartScales() }
  });
}

// ── MAP ───────────────────────────────────────────────────
function initMap() {
  const city = CITIES[currentCity];
  const tileUrl = currentTheme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  if (!leafletMap) {
    leafletMap = L.map("leafletMap", { zoomControl: true }).setView([city.lat, city.lng], city.zoom);
    L.tileLayer(tileUrl, { attribution: "© OpenStreetMap © CARTO" }).addTo(leafletMap);
  } else {
    leafletMap.setView([city.lat, city.lng], city.zoom);
  }
  document.getElementById("mapCityLabel").textContent = city.name;
  updateMapMarkers();
}

function updateMapMarkers() {
  if (!leafletMap) return;
  leafletMarkers.forEach(m => leafletMap.removeLayer(m));
  leafletMarkers = [];

  CITIES[currentCity].zones.forEach(z => {
    const cat = getCategory(z.aqi);
    // SMALLER MARKERS: radius reduced from 20 to 10
    const m = L.circleMarker([z.lat, z.lng], {
      radius: 10,
      fillColor: cat.color,
      color: isDark() ? "rgba(255,255,255,.7)" : "#fff",
      weight: 1.5,
      opacity: .9,
      fillOpacity: .8
    }).addTo(leafletMap);

    m.bindPopup(`
      <div style="font-family:'Inter',sans-serif;padding:2px;min-width:165px">
        <div style="font-weight:700;font-size:.95rem;margin-bottom:6px;color:var(--text)">${z.name}</div>
        <div style="font-size:2rem;font-family:'Bebas Neue',sans-serif;color:${cat.color};line-height:1;letter-spacing:1px">${z.aqi}</div>
        <div style="font-size:.75rem;color:${cat.color};margin-bottom:6px;font-weight:600">${cat.label}</div>
        <div style="font-size:.73rem;color:#8392b0">PM2.5: ${z.pm25} µg/m³</div>
      </div>
    `);
    leafletMarkers.push(m);
  });
}

// ── ALERTS ────────────────────────────────────────────────
function updateAlerts() {
  const city = CITIES[currentCity];
  const avg = avgAqi(currentCity);
  const cat = getCategory(avg);
  const catIdx = getCatIndex(avg);
  const hd = HEALTH[catIdx] || HEALTH[HEALTH.length - 1];
  const isHigh = avg > 150;

  const banner = document.getElementById("emergencyBanner");
  banner.style.background = isHigh ? "rgba(239,68,68,.08)" : "rgba(34,197,94,.07)";
  banner.style.borderColor = isHigh ? "rgba(239,68,68,.3)" : "rgba(34,197,94,.3)";
  document.getElementById("ebTitle").textContent = isHigh ? "⚡ AIR QUALITY ALERT ACTIVE" : "✓ AIR QUALITY STATUS — NORMAL";
  document.getElementById("ebSub").textContent = `${city.name} · ${cat.label} · Average AQI ${avg}`;
  const ebBadge = document.getElementById("ebAqiBadge");
  ebBadge.textContent = avg; ebBadge.style.color = cat.color; ebBadge.style.background = cat.color + "20";

  document.getElementById("alertCatCard").style.borderColor = cat.color + "44";
  document.getElementById("accCatName").textContent = cat.label;
  document.getElementById("accCatName").style.color = cat.color;
  document.getElementById("accAqiRange").textContent = `AQI: ${catIdx > 0 ? CATEGORIES[catIdx - 1].max + 1 : 0}–${CATEGORIES[catIdx].max} · ${city.name}`;
  document.getElementById("accDesc").textContent = hd.warning;
  document.getElementById("riskFill").style.width = cat.riskPct + "%";
  document.getElementById("advisoryText").textContent = hd.warning;
  document.getElementById("guidelinesList").innerHTML = hd.guidelines.map(g => `<li>${g}</li>`).join("");
  document.getElementById("vulnerableList").innerHTML = hd.vulnerable.map(v => `<li>${v}</li>`).join("");
}

// ── POLICY ────────────────────────────────────────────────
function togglePol(name, reduction) {
  const checked = document.getElementById("togl-" + name).checked;
  policies[name] = checked;
  policyReductions[name] = checked ? reduction : 0;
  document.getElementById("polc-" + name).classList.toggle("pol-active", checked);
  const statusEl = document.getElementById("pols-" + name);
  statusEl.textContent = checked ? "ACTIVE" : "INACTIVE";
  statusEl.classList.toggle("active-lbl", checked);
  updatePolicySim();
  const actCount = Object.values(policies).filter(Boolean).length;
  document.getElementById("sc3v").textContent = `${actCount} / 4`;
  document.getElementById("sc3s").textContent = actCount ? `${actCount} measure${actCount > 1 ? "s" : ""} active` : "No measures active";
}

function updatePolicySim() {
  const avg = avgAqi(currentCity);
  const totalRed = Object.values(policyReductions).reduce((a, b) => a + b, 0);
  const projected = Math.max(10, avg - totalRed);
  const actCount = Object.values(policies).filter(Boolean).length;
  document.getElementById("simCur").textContent = avg;
  document.getElementById("simProj").textContent = projected;
  document.getElementById("simRed").textContent = totalRed > 0 ? "−" + totalRed : "0";
  document.getElementById("simAct").textContent = actCount;
  document.getElementById("pipValue").textContent = totalRed > 0 ? `−${totalRed} AQI` : "−0 AQI";
  const names = { vehicle: "Vehicle Restriction", construction: "Construction Ban", factory: "Factory Emission Control", school: "School Closure" };
  const actNames = Object.keys(policies).filter(k => policies[k]).map(k => names[k]);
  document.getElementById("simActiveList").textContent = actNames.length ? "Active: " + actNames.join(" · ") : "No policies currently active";
}

// ── TRENDS ────────────────────────────────────────────────
function loadTrend(view, btnEl) {
  document.querySelectorAll(".trend-tab").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");

  const baseAqi = avgAqi(currentCity);
  let labels, data, datasets;

  if (view === "compare") {
    labels = Object.values(CITIES).map(c => c.name);
    data = Object.keys(CITIES).map(k => avgAqi(k));
    datasets = [{ label: "City AQI", data, backgroundColor: data.map(v => getCategory(v).color + "55"), borderColor: data.map(v => getCategory(v).color), borderWidth: 2, borderRadius: 6 }];
    buildChart("bar", labels, datasets);
  } else {
    labels = view === "weekly" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    data = labels.map(() => Math.max(15, baseAqi + Math.round((Math.random() - 0.48) * 65)));
    datasets = [{ label: "AQI", data, tension: 0.45, fill: true, borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.07)", pointBackgroundColor: data.map(v => getCategory(v).color), pointBorderColor: "transparent", pointRadius: 4, pointHoverRadius: 7, borderWidth: 2.5 }];
    buildChart("line", labels, datasets);
  }

  const nums = datasets[0].data;
  const min = Math.min(...nums), max = Math.max(...nums), avg2 = Math.round(nums.reduce((a, b) => a + b) / nums.length);
  document.getElementById("trendKPIs").innerHTML = `
    <div class="kpi-card"><div class="kpi-num" style="color:${getCategory(avg2).color}">${avg2}</div><div class="kpi-lbl">Average AQI</div></div>
    <div class="kpi-card"><div class="kpi-num" style="color:${getCategory(max).color}">${max}</div><div class="kpi-lbl">Peak AQI</div></div>
    <div class="kpi-card"><div class="kpi-num" style="color:${getCategory(min).color}">${min}</div><div class="kpi-lbl">Best AQI</div></div>
    <div class="kpi-card"><div class="kpi-num" style="color:${getCategory(avg2).color}">${getCategory(avg2).label}</div><div class="kpi-lbl">Avg Category</div></div>
  `;

  // PM2.5 chart
  const ctx2 = document.getElementById("pm25Chart").getContext("2d");
  if (charts.pm25) charts.pm25.destroy();
  charts.pm25 = new Chart(ctx2, {
    type: "line",
    data: { labels, datasets: [{ label: "PM2.5", data: nums.map(v => Math.round(v * 0.47)), tension: 0.4, fill: true, borderColor: "#fb923c", backgroundColor: "rgba(251,146,60,.08)", pointRadius: 3, pointBackgroundColor: "#fb923c", borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: chartDefaults().tooltip }, scales: chartScales() }
  });

  // Donut chart
  const counts = [0, 0, 0, 0, 0, 0];
  nums.forEach(v => counts[getCatIndex(v)]++);
  const nonZero = counts.map((c, i) => ({ count: c, cat: CATEGORIES[i] })).filter(x => x.count > 0);
  const ctx3 = document.getElementById("donutChart").getContext("2d");
  if (charts.donut) charts.donut.destroy();
  charts.donut = new Chart(ctx3, {
    type: "doughnut",
    data: { labels: nonZero.map(x => x.cat.label), datasets: [{ data: nonZero.map(x => x.count), backgroundColor: nonZero.map(x => x.cat.color + "bb"), borderColor: nonZero.map(x => x.cat.color), borderWidth: 2, hoverOffset: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { display: true, position: "bottom", labels: { color: mutedColor(), font: { family: "'Inter'", size: 10 }, boxWidth: 9, padding: 8 } }, tooltip: chartDefaults().tooltip } }
  });
}

function buildChart(type, labels, datasets) {
  const ctx = document.getElementById("mainTrendChart").getContext("2d");
  if (charts.trend) charts.trend.destroy();
  charts.trend = new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: "index", intersect: false }, plugins: { legend: { display: false }, tooltip: chartDefaults().tooltip }, scales: chartScales() }
  });
}

// ── BREATHING ─────────────────────────────────────────────
function updateBreathingChip() {
  const avg = avgAqi(currentCity);
  const cat = getCategory(avg);
  const chip = document.getElementById("brChip");
  if (!chip) return;
  chip.textContent = `Current AQI: ${avg} — ${cat.label}`;
  chip.style.color = cat.color;
  chip.style.borderColor = cat.color + "45";
  chip.style.background = cat.color + "15";
  const tips = [
    "Good air quality today — breathing exercises are always a great wellness habit.",
    "Air is acceptable. Regular breathing helps maintain respiratory health.",
    "Air quality is degraded — indoor breathing exercises will help calm your airways.",
    "Unhealthy air detected. Stay indoors and use this exercise to ease any discomfort.",
    "Very unhealthy conditions. Stay inside. Let this session help you breathe easier.",
    "⚠ Hazardous air quality. Do not go outside. Focus on slow, calm breathing."
  ];
  const tipEl = document.getElementById("brTip");
  if (tipEl) tipEl.textContent = tips[getCatIndex(avg)] || tips[tips.length - 1];
}

function toggleBreathing() {
  brRunning ? stopBreathing() : startBreathing();
}

function startBreathing() {
  brRunning = true; brCycles = 0; brSessionStart = Date.now();
  document.getElementById("bssCycles").textContent = "0";
  document.getElementById("brStartBtn").innerHTML = "⏹ &nbsp; Stop Exercise";
  brSessionTimer = setInterval(() => {
    const e = Math.floor((Date.now() - brSessionStart) / 1000);
    document.getElementById("bssTime").textContent = `${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}`;
  }, 1000);
  runCycle();
}

function stopBreathing() {
  brRunning = false;
  clearTimeout(brPhaseTimeout); clearInterval(brCountInterval); clearInterval(brSessionTimer);
  document.getElementById("brStartBtn").innerHTML = "▶ &nbsp; Start Exercise";
  document.getElementById("brPhaseText").textContent = "Ready";
  document.getElementById("brCountText").textContent = "";
  const bubble = document.getElementById("brBubble");
  bubble.style.transform = "scale(1)";
  bubble.style.borderColor = "var(--accent)";
  bubble.style.boxShadow = "0 0 36px rgba(56,189,248,.12)";
  document.getElementById("brProgressArc").setAttribute("stroke-dashoffset", "628");
}

function runCycle() {
  if (!brRunning) return;
  setPhase("INHALE", "var(--accent)", 1.45, 4, () => {
    setPhase("HOLD", "var(--accent2)", 1.45, 4, () => {
      setPhase("EXHALE", "var(--accent3)", 0.85, 6, () => {
        brCycles++;
        document.getElementById("bssCycles").textContent = brCycles;
        runCycle();
      });
    });
  });
}

function setPhase(name, color, scale, dur, onDone) {
  if (!brRunning) return;
  const bubble = document.getElementById("brBubble");
  const phaseEl = document.getElementById("brPhaseText");
  const countEl = document.getElementById("brCountText");
  phaseEl.textContent = name; phaseEl.style.color = color;
  bubble.style.borderColor = color;
  bubble.style.boxShadow = `0 0 50px ${color.includes("accent2") ? "rgba(251,146,60,.25)" : color.includes("accent3") ? "rgba(163,230,53,.25)" : "rgba(56,189,248,.25)"}`;
  bubble.style.transition = `transform ${dur}s cubic-bezier(.4,0,.6,1)`;
  setTimeout(() => { bubble.style.transform = `scale(${scale})`; }, 10);
  let rem = dur; countEl.textContent = rem;
  clearInterval(brCountInterval);
  brCountInterval = setInterval(() => {
    rem--; if (rem > 0) countEl.textContent = rem; else { clearInterval(brCountInterval); countEl.textContent = ""; }
  }, 1000);
  brPhaseTimeout = setTimeout(onDone, dur * 1000);
}

// ── FORECAST PAGE ─────────────────────────────────────────
function buildForecastPage() {
  const baseAqi = avgAqi(currentCity);
  const days = ["Today", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const icons = ["😶‍🌫️", "🌤️", "🌧️", "☀️", "🌥️", "🌬️", "☁️"];
  const forecasts = days.map((d, i) => ({
    day: d,
    icon: icons[i],
    aqi: Math.max(15, baseAqi + Math.round((Math.random() - 0.45) * 80))
  }));

  const cardsEl = document.getElementById("forecastCards");
  cardsEl.innerHTML = forecasts.map((f, i) => {
    const cat = getCategory(f.aqi);
    return `<div class="fc-card ${i === 0 ? "fc-today" : ""}">
      <div class="fc-day">${f.day}</div>
      <div class="fc-icon">${f.icon}</div>
      <div class="fc-aqi" style="color:${cat.color}">${f.aqi}</div>
      <div class="fc-cat" style="color:${cat.color}">${cat.label}</div>
    </div>`;
  }).join("");

  document.getElementById("fiWind").textContent = `${Math.round(8 + Math.random() * 14)} km/h`;
  document.getElementById("fiHumidity").textContent = `${Math.round(40 + Math.random() * 40)}%`;
  document.getElementById("fiTemp").textContent = `${Math.round(22 + Math.random() * 16)}°C`;
  document.getElementById("fiRain").textContent = `${Math.round(Math.random() * 60)}%`;

  const ctx = document.getElementById("forecastChart").getContext("2d");
  if (forecastChartInst) forecastChartInst.destroy();
  forecastChartInst = new Chart(ctx, {
    type: "line",
    data: {
      labels: forecasts.map(f => f.day),
      datasets: [{
        label: "Forecasted AQI", data: forecasts.map(f => f.aqi),
        tension: 0.4, fill: true,
        borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.07)",
        pointBackgroundColor: forecasts.map(f => getCategory(f.aqi).color),
        pointRadius: 6, pointHoverRadius: 9, borderWidth: 2.5,
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: chartDefaults().tooltip }, scales: chartScales() }
  });
}

// ── HEAT MAP PAGE ─────────────────────────────────────────
function buildHeatmap() {
  const baseAqi = avgAqi(currentCity);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);
  const grid = document.getElementById("heatmapGrid");
  grid.innerHTML = "";

  // Column headers (hours)
  grid.appendChild(Object.assign(document.createElement("div"), { className: "hm-cell hm-header" }));
  hours.forEach(h => {
    const el = document.createElement("div");
    el.className = "hm-cell hm-header";
    el.textContent = h.length === 2 ? h : h;
    grid.appendChild(el);
  });

  // Rows (days)
  days.forEach(day => {
    const label = document.createElement("div");
    label.className = "hm-cell hm-day-label";
    label.textContent = day;
    grid.appendChild(label);

    hours.forEach(() => {
      // Peak pollution at 8-10am and 6-9pm
      const h = Math.floor(Math.random() * 24);
      const peakBoost = (h >= 7 && h <= 10) || (h >= 17 && h <= 21) ? 60 : 0;
      const aqi = Math.max(15, Math.min(400, baseAqi + Math.round((Math.random() - 0.45) * 60) + Math.round(Math.random() * peakBoost * 0.5)));
      const cat = getCategory(aqi);
      const cell = document.createElement("div");
      cell.className = "hm-cell";
      cell.style.background = cat.color + (aqi > 200 ? "cc" : aqi > 100 ? "99" : "66");
      cell.style.color = "#fff";
      cell.title = `AQI ${aqi} — ${cat.label}`;
      cell.textContent = aqi > 150 ? aqi : "";
      grid.appendChild(cell);
    });
  });
}

// CSS animation for login card out
const style = document.createElement("style");
style.textContent = `
  @keyframes cardOut { to { opacity:0; transform:translateY(-16px); } }
  @keyframes fadeOut { to { opacity:0; } }
`;
document.head.appendChild(style);

