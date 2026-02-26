/* =========================================================
   VAYU — AQI Dashboard  |  script.js
   Changes: real AQI data (WAQI), no policy page,
   pollutant breakdown, compact overview, clean air route,
   login theme toggle
   ========================================================= */

// ── WAQI (aqicn.org) token — free demo token ───────────────
// NOTE: This token is the public "demo" key from waqi.info
// Replace with your own free token from https://aqicn.org/api/
const WAQI_TOKEN = "demo";

// ── CITY DATA (lat/lng for WAQI feed lookups) ──────────────
const CITIES = {
  delhi: {
    name: "New Delhi", displayName: "NEW DELHI",
    lat: 28.6139, lng: 77.2090, zoom: 11,
    waqi_city: "delhi",
    zones: [
      { name: "Anand Vihar",   lat: 28.6469, lng: 77.3159, waqi: "anand-vihar" },
      { name: "RK Puram",      lat: 28.5693, lng: 77.1858, waqi: "rk-puram" },
      { name: "Punjabi Bagh",  lat: 28.6663, lng: 77.1292, waqi: "punjabi-bagh" },
      { name: "ITO",           lat: 28.6289, lng: 77.2445, waqi: "ito" },
      { name: "Lodhi Road",    lat: 28.5910, lng: 77.2246, waqi: "lodhi-road" },
      { name: "Dwarka Sec-8",  lat: 28.5900, lng: 77.0390, waqi: "dwarka" },
      { name: "Jahangirpuri",  lat: 28.7299, lng: 77.1677, waqi: "jahangirpuri" },
      { name: "Okhla Phase-2", lat: 28.5355, lng: 77.2734, waqi: "okhla" },
    ]
  },
  mumbai: {
    name: "Mumbai", displayName: "MUMBAI",
    lat: 19.0760, lng: 72.8777, zoom: 11,
    waqi_city: "mumbai",
    zones: [
      { name: "Bandra Kurla", lat: 19.0596, lng: 72.8655, waqi: "bandra" },
      { name: "Chembur",      lat: 19.0547, lng: 72.9009, waqi: "chembur" },
      { name: "Worli",        lat: 18.9994, lng: 72.8156, waqi: "worli" },
      { name: "Powai",        lat: 19.1174, lng: 72.9060, waqi: "powai" },
      { name: "Borivali",     lat: 19.2308, lng: 72.8567, waqi: "borivali" },
      { name: "Dharavi",      lat: 19.0404, lng: 72.8528, waqi: "dharavi" },
    ]
  },
  bangalore: {
    name: "Bangalore", displayName: "BANGALORE",
    lat: 12.9716, lng: 77.5946, zoom: 11,
    waqi_city: "bangalore",
    zones: [
      { name: "BTM Layout", lat: 12.9165, lng: 77.6101, waqi: "btm-layout" },
      { name: "Peenya",     lat: 13.0299, lng: 77.5194, waqi: "peenya" },
      { name: "Hebbal",     lat: 13.0354, lng: 77.5966, waqi: "hebbal" },
      { name: "Silk Board", lat: 12.9174, lng: 77.6228, waqi: "silk-board" },
      { name: "Whitefield", lat: 12.9698, lng: 77.7499, waqi: "whitefield" },
    ]
  },
  chennai: {
    name: "Chennai", displayName: "CHENNAI",
    lat: 13.0827, lng: 80.2707, zoom: 11,
    waqi_city: "chennai",
    zones: [
      { name: "Manali",       lat: 13.1667, lng: 80.2560, waqi: "manali" },
      { name: "Velachery",    lat: 12.9781, lng: 80.2209, waqi: "velachery" },
      { name: "Ambattur",     lat: 13.1142, lng: 80.1531, waqi: "ambattur" },
      { name: "Nungambakkam", lat: 13.0606, lng: 80.2430, waqi: "nungambakkam" },
      { name: "Perungudi",    lat: 12.9648, lng: 80.2444, waqi: "perungudi" },
    ]
  },
  kolkata: {
    name: "Kolkata", displayName: "KOLKATA",
    lat: 22.5726, lng: 88.3639, zoom: 11,
    waqi_city: "kolkata",
    zones: [
      { name: "Jadavpur",         lat: 22.4972, lng: 88.3714, waqi: "jadavpur" },
      { name: "Rabindra Sarobar", lat: 22.5121, lng: 88.3513, waqi: "rabindra-sarobar" },
      { name: "Ballygunge",       lat: 22.5249, lng: 88.3659, waqi: "ballygunge" },
      { name: "Dumdum",           lat: 22.6421, lng: 88.3967, waqi: "dumdum" },
      { name: "Salt Lake",        lat: 22.5771, lng: 88.4197, waqi: "salt-lake" },
    ]
  }
};

// Realistic fallback AQI data per city (used when API unavailable / CORS block)
const FALLBACK_AQI = {
  delhi: {
    base: 218,
    zones: [318, 248, 195, 282, 163, 226, 294, 85],
    pollutants: { "PM2.5": 42, "PM10": 22, "NO₂": 14, "SO₂": 8, "CO": 7, "O₃": 7 }
  },
  mumbai: {
    base: 108,
    zones: [92, 152, 68, 115, 62, 178],
    pollutants: { "PM2.5": 35, "PM10": 28, "NO₂": 18, "SO₂": 6, "CO": 8, "O₃": 5 }
  },
  bangalore: {
    base: 97,
    zones: [55, 138, 95, 122, 74],
    pollutants: { "PM2.5": 38, "PM10": 25, "NO₂": 16, "SO₂": 7, "CO": 6, "O₃": 8 }
  },
  chennai: {
    base: 110,
    zones: [168, 86, 125, 72, 98],
    pollutants: { "PM2.5": 33, "PM10": 27, "NO₂": 17, "SO₂": 9, "CO": 7, "O₃": 7 }
  },
  kolkata: {
    base: 157,
    zones: [182, 136, 152, 202, 114],
    pollutants: { "PM2.5": 40, "PM10": 24, "NO₂": 13, "SO₂": 10, "CO": 8, "O₃": 5 }
  }
};

const POLLUTANT_COLORS = {
  "PM2.5": "#ef4444",
  "PM10": "#f97316",
  "NO₂": "#eab308",
  "SO₂": "#a855f7",
  "CO": "#6366f1",
  "O₃": "#22c55e"
};

const CATEGORIES = [
  { max: 50,  label: "Good",                    color: "#22c55e", riskPct: 8   },
  { max: 100, label: "Moderate",                color: "#eab308", riskPct: 25  },
  { max: 150, label: "Unhealthy for Sensitive", color: "#f97316", riskPct: 45  },
  { max: 200, label: "Unhealthy",               color: "#ef4444", riskPct: 62  },
  { max: 300, label: "Very Unhealthy",          color: "#a855f7", riskPct: 80  },
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

const CITY_LOOKUP = {
  "new delhi": "delhi", "delhi": "delhi",
  "mumbai": "mumbai", "bombay": "mumbai",
  "bangalore": "bangalore", "bengaluru": "bangalore",
  "chennai": "chennai", "madras": "chennai",
  "kolkata": "kolkata", "calcutta": "kolkata",
  "hyderabad": "delhi", "pune": "mumbai",
  "ahmedabad": "delhi", "jaipur": "delhi"
};

const CITY_SUGGESTIONS = [
  { name: "New Delhi", key: "delhi", pin: "110001" },
  { name: "Mumbai", key: "mumbai", pin: "400001" },
  { name: "Bangalore", key: "bangalore", pin: "560001" },
  { name: "Chennai", key: "chennai", pin: "600001" },
  { name: "Kolkata", key: "kolkata", pin: "700001" },
  { name: "Hyderabad", key: "delhi", pin: "500001" },
  { name: "Pune", key: "mumbai", pin: "411001" },
  { name: "Bengaluru", key: "bangalore", pin: "560001" },
  { name: "Ahmedabad", key: "delhi", pin: "380001" },
  { name: "Jaipur", key: "delhi", pin: "302001" },
];

// ── STATE ─────────────────────────────────────────────────
let currentCity = "delhi";
let leafletMap = null, routeMap = null;
let leafletMarkers = [], routeLayer = null, routeMarkers = [];
let charts = {};
let currentTheme = "dark";
let loggedInUser = "", userLocation = "";
let brRunning = false, brPhaseTimeout = null, brCountInterval = null, brSessionTimer = null, brCycles = 0, brSessionStart = null;
let forecastChartInst = null;
let aqiCache = {}; // cache fetched aqi values per city
let routeStartZone = null, routeEndZone = null;

// ── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Allow Enter key on login
  document.getElementById("loginPass").addEventListener("keydown", e => { if (e.key === "Enter") handleLogin(); });
});

// ── THEME ─────────────────────────────────────────────────
function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (leafletMap) rebuildMapTiles(leafletMap);
  if (routeMap) rebuildMapTiles(routeMap);
  // Refresh active page charts
  const active = document.querySelector(".page.active");
  if (active) {
    if (active.id === "page-overview") updateOverview();
    if (active.id === "page-trends") loadTrend("weekly", document.querySelector(".trend-tab.active"));
  }
}
function rebuildMapTiles(map) {
  map.eachLayer(l => { if (l._url) map.removeLayer(l); });
  const url = currentTheme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  L.tileLayer(url, { attribution: "© OpenStreetMap © CARTO", maxZoom: 19 }).addTo(map);
}

// ── LOGIN ─────────────────────────────────────────────────
function handleLogin() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  const err = document.getElementById("loginError");
  if (!user) { showErr(err, "Please enter your username"); return; }
  if (pass.length < 3) { showErr(err, "Password must be at least 3 characters"); return; }
  err.classList.remove("show");
  loggedInUser = user;
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
  const normalized = cityInput.toLowerCase().replace(/\s+/g, " ");
  const cityKey = CITY_LOOKUP[normalized] || "delhi";
  const displayCity = CITY_SUGGESTIONS.find(c => c.name.toLowerCase() === normalized)?.name || cityInput;
  userLocation = `${displayCity} — ${pin}`;
  currentCity = cityKey;
  document.getElementById("sfUsername").textContent = loggedInUser;
  document.getElementById("sfAvatar").textContent = loggedInUser[0].toUpperCase();
  document.getElementById("sfUserloc").textContent = userLocation;
  document.getElementById("cityPicker").value = cityKey;
  document.getElementById("loginScreen").style.animation = "fadeOut .4s ease forwards";
  setTimeout(() => {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("appShell").style.display = "flex";
    initApp();
    switchPage("map");
    setTimeout(() => initMap(), 120);
  }, 380);
}
function handleLogout() {
  document.getElementById("appShell").style.display = "none";
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("loginScreen").style.animation = "none";
  document.getElementById("step1").style.display = "block";
  document.getElementById("step1").style.animation = "cardIn .4s ease";
  document.getElementById("step2").style.display = "none";
  ["loginUser", "loginPass"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("loginError").classList.remove("show");
  if (brRunning) stopBreathing();
}
function showErr(el, msg) { el.textContent = msg; el.classList.add("show"); }

// ── INIT APP ──────────────────────────────────────────────
function initApp() {
  initNav();
  loadAQIData(currentCity).then(refreshAll);
  // Refresh every 5 minutes
  setInterval(() => {
    loadAQIData(currentCity).then(refreshAll);
    if (leafletMap) updateMapMarkers();
  }, 5 * 60 * 1000);
}

// ── AQI DATA — WAQI API with fallback ─────────────────────
async function loadAQIData(cityKey) {
  const city = CITIES[cityKey];
  const fallback = FALLBACK_AQI[cityKey];
  const zones = city.zones;

  try {
    // Try geo-based feed from WAQI for each zone
    const promises = zones.map(async (zone, i) => {
      try {
        const url = `https://api.waqi.info/feed/geo:${zone.lat};${zone.lng}/?token=${WAQI_TOKEN}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
        const data = await res.json();
        if (data.status === "ok" && data.data && typeof data.data.aqi === "number") {
          zone.aqi = data.data.aqi;
          // extract pollutants if available
          if (data.data.iaqi) {
            const iaqi = data.data.iaqi;
            zone.pollutants = {};
            if (iaqi.pm25) zone.pollutants["PM2.5"] = iaqi.pm25.v;
            if (iaqi.pm10)  zone.pollutants["PM10"]  = iaqi.pm10.v;
            if (iaqi.no2)   zone.pollutants["NO₂"]   = iaqi.no2.v;
            if (iaqi.so2)   zone.pollutants["SO₂"]   = iaqi.so2.v;
            if (iaqi.co)    zone.pollutants["CO"]     = iaqi.co.v;
            if (iaqi.o3)    zone.pollutants["O₃"]     = iaqi.o3.v;
          }
        } else {
          // use fallback with small jitter
          zone.aqi = Math.max(15, fallback.zones[i] + Math.round((Math.random() - 0.5) * 10));
        }
      } catch {
        zone.aqi = Math.max(15, fallback.zones[i] + Math.round((Math.random() - 0.5) * 10));
      }
      zone.pm25 = Math.round(zone.aqi * 0.47);
      return zone;
    });
    await Promise.all(promises);
    // Build city-level pollutant percentages
    // Merge from zones or use fallback
    const mergedPoll = { ...fallback.pollutants };
    // If any zone returned real pollutant data, adjust proportionally
    const zonesWithPoll = zones.filter(z => z.pollutants && Object.keys(z.pollutants).length > 0);
    if (zonesWithPoll.length > 0) {
      const totals = {};
      zonesWithPoll.forEach(z => {
        Object.entries(z.pollutants).forEach(([k, v]) => { totals[k] = (totals[k] || 0) + v; });
      });
      const grand = Object.values(totals).reduce((a, b) => a + b, 0);
      if (grand > 0) {
        Object.keys(totals).forEach(k => { mergedPoll[k] = Math.round((totals[k] / grand) * 100); });
      }
    }
    aqiCache[cityKey] = { pollutants: mergedPoll, loaded: true };
  } catch {
    // Full fallback
    zones.forEach((zone, i) => {
      zone.aqi = Math.max(15, fallback.zones[i] + Math.round((Math.random() - 0.5) * 10));
      zone.pm25 = Math.round(zone.aqi * 0.47);
    });
    aqiCache[cityKey] = { pollutants: fallback.pollutants, loaded: false };
  }
  return true;
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
  if (page === "route") initRouteMap();
}
function toggleSidebar() { document.getElementById("sidebar").classList.toggle("open"); }
function closeSidebar() { document.getElementById("sidebar").classList.remove("open"); }
function selectCity(city) {
  currentCity = city;
  loadAQIData(city).then(() => {
    refreshAll();
    if (leafletMap) {
      const c = CITIES[city];
      leafletMap.setView([c.lat, c.lng], c.zoom);
      updateMapMarkers();
    }
  });
}
function refreshAll() {
  updateOverview();
  updateAlerts();
  updateBreathingChip();
}

// ── HELPERS ───────────────────────────────────────────────
function getCategory(aqi) { return CATEGORIES.find(c => aqi <= c.max) || CATEGORIES[CATEGORIES.length - 1]; }
function getCatIndex(aqi) { const i = CATEGORIES.findIndex(c => aqi <= c.max); return i < 0 ? CATEGORIES.length - 1 : i; }
function avgAqi(city) {
  const z = CITIES[city].zones.filter(zz => zz.aqi !== undefined);
  if (!z.length) return FALLBACK_AQI[city].base;
  return Math.round(z.reduce((s, zz) => s + zz.aqi, 0) / z.length);
}
function isDark() { return currentTheme === "dark"; }
function textColor() { return isDark() ? "#e2e8f4" : "#1a2035"; }
function mutedColor() { return isDark() ? "#8392b0" : "#5a6a8a"; }
function gridColor() { return isDark() ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.07)"; }
function chartDefaults() {
  return { tooltip: { backgroundColor: isDark() ? "#0e1219" : "#fff", titleColor: textColor(), bodyColor: mutedColor(), borderColor: isDark() ? "#1e2535" : "#dde3ee", borderWidth: 1, padding: 10, cornerRadius: 8, titleFont: { family: "'Inter'", weight: "600", size: 12 }, bodyFont: { family: "'Inter'", size: 11 } } };
}
function chartScales() {
  return {
    x: { grid: { color: gridColor() }, ticks: { color: mutedColor(), font: { family: "'Inter'", size: 11 } }, border: { color: isDark() ? "#1e2535" : "#dde3ee" } },
    y: { grid: { color: gridColor() }, ticks: { color: mutedColor(), font: { family: "'Inter'", size: 11 } }, border: { color: isDark() ? "#1e2535" : "#dde3ee" } }
  };
}

// ── GAUGE ─────────────────────────────────────────────────
function drawGauge(canvas, aqi) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height, cx = W/2, cy = H/2, r = W * 0.41;
  ctx.clearRect(0, 0, W, H);
  const track = isDark() ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)";
  ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI*.75, Math.PI*2.25, false);
  ctx.strokeStyle = track; ctx.lineWidth = 13; ctx.lineCap = "round"; ctx.stroke();
  const pct = Math.min(aqi / 400, 1);
  const start = Math.PI * .75, end = start + pct * (Math.PI * 1.5);
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#22c55e"); grad.addColorStop(.4, "#eab308"); grad.addColorStop(.7, "#ef4444"); grad.addColorStop(1, "#7e0023");
  ctx.beginPath(); ctx.arc(cx, cy, r, start, end, false);
  ctx.strokeStyle = grad; ctx.lineWidth = 13; ctx.lineCap = "round"; ctx.stroke();
  const cat = getCategory(aqi);
  ctx.beginPath(); ctx.arc(cx, cy, r, start, end, false);
  ctx.strokeStyle = cat.color + "35"; ctx.lineWidth = 20; ctx.lineCap = "round"; ctx.stroke();
}

// ── BANNER ANIMATION ENGINE ───────────────────────────────

const WEATHER_BY_CITY = {
  delhi:     { temp: 34, condition: "Sunny & Hazy",  icon: "🌫️", humidity: 58, wind: 8.2,  uv: 8  },
  mumbai:    { temp: 31, condition: "Partly Cloudy", icon: "⛅",  humidity: 79, wind: 14.5, uv: 7  },
  bangalore: { temp: 26, condition: "Pleasant",      icon: "🌤️", humidity: 62, wind: 11.0, uv: 6  },
  chennai:   { temp: 35, condition: "Hot & Humid",   icon: "☀️",  humidity: 72, wind: 10.1, uv: 9  },
  kolkata:   { temp: 33, condition: "Cloudy",        icon: "🌥️", humidity: 75, wind: 9.8,  uv: 7  },
};

const BANNER_THEMES = [
  { cls:"theme-good",       maxAqi:50,  charMood:"😊", hazeOp:0,    cloudOp:.7,  sunOp:1,   sweatOp:0,   maskOp:".2", cityColor:"#005030" },
  { cls:"theme-moderate",   maxAqi:100, charMood:"😐", hazeOp:.15,  cloudOp:.75, sunOp:.85, sweatOp:0,   maskOp:".5", cityColor:"#6b4c00" },
  { cls:"theme-sensitive",  maxAqi:150, charMood:"😷", hazeOp:.28,  cloudOp:.85, sunOp:.65, sweatOp:.5,  maskOp:".9", cityColor:"#7c2d00" },
  { cls:"theme-unhealthy",  maxAqi:200, charMood:"🤢", hazeOp:.42,  cloudOp:.9,  sunOp:.4,  sweatOp:.9,  maskOp:"1",  cityColor:"#880020" },
  { cls:"theme-vunhealthy", maxAqi:300, charMood:"😰", hazeOp:.55,  cloudOp:.95, sunOp:.2,  sweatOp:1,   maskOp:"1",  cityColor:"#3b0060" },
  { cls:"theme-hazardous",  maxAqi:500, charMood:"💀", hazeOp:.72,  cloudOp:1,   sunOp:.05, sweatOp:1,   maskOp:"1",  cityColor:"#1a0000" },
];

let particleAnim = null;
let particles = [];

function initBannerParticles(canvas, aqi) {
  if (particleAnim) cancelAnimationFrame(particleAnim);
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth || 800;
  canvas.height = canvas.offsetHeight || 200;
  const W = canvas.width, H = canvas.height;
  const count = Math.min(6 + Math.floor(aqi / 20), 60);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 1 + Math.random() * 3.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -0.2 - Math.random() * 0.5,
    op: 0.08 + Math.random() * 0.18,
    color: aqi > 200 ? "#c084fc" : aqi > 150 ? "#f87171" : aqi > 100 ? "#fb923c" : "#94a3b8"
  }));
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.op; ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    });
    ctx.globalAlpha = 1;
    particleAnim = requestAnimationFrame(draw);
  }
  draw();
}

function updateBanner(avg, cat, catIdx, pm25, pm10) {
  const theme = BANNER_THEMES[catIdx] || BANNER_THEMES[BANNER_THEMES.length - 1];
  const weather = WEATHER_BY_CITY[currentCity];
  const banner = document.getElementById("aqiBanner");
  if (!banner) return;

  banner.className = "aqi-banner " + theme.cls;

  const haze = document.getElementById("bannerHaze");
  if (haze) haze.style.opacity = theme.hazeOp;
  const sun = document.getElementById("bannerSun");
  if (sun) sun.style.opacity = theme.sunOp;
  ["cloud1","cloud2","cloud3"].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.opacity = theme.cloudOp;
  });
  const cityEl = document.querySelector(".banner-city");
  if (cityEl) cityEl.style.color = theme.cityColor;

  // Animated AQI counter
  animateCount("heroAqi", avg, cat);

  const pill = document.getElementById("heroAqiCat");
  if (pill) { pill.textContent = cat.label; pill.style.color = cat.color; }
  const pm25El = document.getElementById("heroPM25");
  const pm10El = document.getElementById("heroPM10");
  if (pm25El) pm25El.textContent = pm25.toFixed(2);
  if (pm10El) pm10El.textContent = pm10.toFixed(2);

  const thumb = document.getElementById("sliderThumb");
  if (thumb) { thumb.style.left = Math.min((avg / 301) * 100, 100) + "%"; thumb.style.borderColor = cat.color; }

  const cn = document.getElementById("heroCity");
  if (cn) cn.textContent = CITIES[currentCity].displayName;
  const ht = document.getElementById("heroTime");
  if (ht) ht.textContent = new Date().toLocaleTimeString();

  const moodEl = document.getElementById("charMood");
  if (moodEl) moodEl.textContent = theme.charMood;
  const maskEl = document.getElementById("charMask");
  const strapsEl = document.getElementById("charMaskStraps");
  if (maskEl) maskEl.setAttribute("opacity", theme.maskOp);
  if (strapsEl) strapsEl.setAttribute("opacity", parseFloat(theme.maskOp) * .7);

  ["charSweat1","charSweat2"].forEach((id, i) => {
    const el = document.getElementById(id); if (el) el.setAttribute("opacity", theme.sweatOp * (i === 0 ? 1 : .7));
  });

  const browL = document.querySelector(".char-brow-l");
  const browR = document.querySelector(".char-brow-r");
  if (browL && browR) {
    if (catIdx >= 3) { browL.setAttribute("d","M43 74 Q49 70 55 74"); browR.setAttribute("d","M65 74 Q71 70 77 74"); }
    else             { browL.setAttribute("d","M43 72 Q49 70 55 72"); browR.setAttribute("d","M65 72 Q71 70 77 72"); }
  }
  const charSvg = document.getElementById("charSvg");
  if (charSvg) charSvg.style.animationDuration = catIdx >= 4 ? "1s" : catIdx >= 2 ? "1.8s" : "2.4s";

  if (weather) {
    const t = weather.temp + Math.round((Math.random() - 0.5) * 3);
    const el = (id) => document.getElementById(id);
    el("bwcTemp") && (el("bwcTemp").textContent = `${t}°C`);
    el("bwcCondition") && (el("bwcCondition").textContent = weather.condition);
    el("bwcIcon") && (el("bwcIcon").textContent = weather.icon);
    el("bwcHumidity") && (el("bwcHumidity").textContent = `${weather.humidity + Math.round(Math.random() * 4)}%`);
    el("bwcWind") && (el("bwcWind").textContent = `${(weather.wind + (Math.random()-.5)).toFixed(1)} km/h`);
    el("bwcUV") && (el("bwcUV").textContent = weather.uv);
  }

  const pCanvas = document.getElementById("bannerParticles");
  if (pCanvas) initBannerParticles(pCanvas, avg);
}

function animateCount(elId, target, cat) {
  const el = document.getElementById(elId);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const diff = target - start, dur = 800, t0 = performance.now();
  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round(start + diff * (1 - Math.pow(1 - p, 3)));
    el.style.color = cat.color;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── OVERVIEW ──────────────────────────────────────────────
function updateOverview() {
  const city = CITIES[currentCity];
  const zones = city.zones.filter(z => z.aqi !== undefined);
  if (!zones.length) return;
  const avg = avgAqi(currentCity);
  const cat = getCategory(avg);
  const catIdx = getCatIndex(avg);
  const hotspot = zones.reduce((a, b) => a.aqi > b.aqi ? a : b);
  const clean = zones.reduce((a, b) => a.aqi < b.aqi ? a : b);
  const pm25 = parseFloat((avg * 0.47).toFixed(2));
  const pm10 = parseFloat((avg * 0.68).toFixed(2));

  updateBanner(avg, cat, catIdx, pm25, pm10);

  const hCat = getCategory(hotspot.aqi), cCat = getCategory(clean.aqi);
  document.getElementById("sc1v").textContent = hotspot.name;
  document.getElementById("sc1s").innerHTML = `AQI <span style="color:${hCat.color};font-weight:700">${hotspot.aqi}</span>`;
  document.getElementById("sc2v").textContent = clean.name;
  document.getElementById("sc2s").innerHTML = `AQI <span style="color:${cCat.color};font-weight:700">${clean.aqi}</span>`;

  const riskLabels = ["Low","Moderate","Elevated","High","Very High","Critical"];
  const adviceSub = ["Safe outdoors","Sensitive: take care","Limit outdoor activity","Avoid outdoor exertion","Stay indoors","Emergency conditions"];
  document.getElementById("sc3v").textContent = riskLabels[catIdx] || "Critical";
  document.getElementById("sc3v").style.color = cat.color;
  document.getElementById("sc3s").textContent = adviceSub[catIdx] || adviceSub[adviceSub.length-1];
  document.getElementById("sc4v").textContent = zones.length;
  document.getElementById("sc4s").textContent = "zones active";

  const list = document.getElementById("zonesList");
  list.innerHTML = `<div class="zone-row zone-row-head"><span>Zone</span><span>AQI</span><span>Category</span><span>PM2.5</span></div>`;
  zones.forEach(z => {
    const zc = getCategory(z.aqi);
    const row = document.createElement("div");
    row.className = "zone-row";
    row.innerHTML = `<span style="font-size:.8rem">${z.name}</span><span class="zone-aqi" style="color:${zc.color}">${z.aqi}</span><span><span class="zone-cat-chip" style="background:${zc.color}20;color:${zc.color};border:1px solid ${zc.color}40">${zc.label}</span></span><span class="zone-pm">${z.pm25} µg/m³</span>`;
    list.appendChild(row);
  });
  document.getElementById("zonesBadge").textContent = `${zones.length} zones`;

  updatePollutantPanel();

  const ctx = document.getElementById("snapshotChart").getContext("2d");
  if (charts.snapshot) charts.snapshot.destroy();
  charts.snapshot = new Chart(ctx, {
    type: "bar",
    data: { labels: zones.map(z => z.name.split(" ")[0]), datasets: [{ data: zones.map(z => z.aqi), backgroundColor: zones.map(z => getCategory(z.aqi).color + "55"), borderColor: zones.map(z => getCategory(z.aqi).color), borderWidth: 2, borderRadius: 5 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: chartDefaults().tooltip }, scales: chartScales() }
  });
}

function updatePollutantPanel() {
  const cache = aqiCache[currentCity];
  const pollutants = cache?.pollutants || FALLBACK_AQI[currentCity].pollutants;
  document.getElementById("pollutantCity").textContent = CITIES[currentCity].name;

  const list = document.getElementById("pollutantList");
  list.innerHTML = "";
  const entries = Object.entries(pollutants).sort((a, b) => b[1] - a[1]);
  entries.forEach(([name, pct]) => {
    const color = POLLUTANT_COLORS[name] || "#8392b0";
    const row = document.createElement("div");
    row.className = "poll-row";
    row.innerHTML = `
      <span class="poll-name">${name}</span>
      <div class="poll-bar-wrap"><div class="poll-bar" style="width:${pct}%;background:${color}"></div></div>
      <span class="poll-pct" style="color:${color}">${pct}%</span>
    `;
    list.appendChild(row);
  });

  // Doughnut chart for pollutants
  const ctx = document.getElementById("pollutantChart").getContext("2d");
  if (charts.pollutant) charts.pollutant.destroy();
  charts.pollutant = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: entries.map(e => e[0]),
      datasets: [{ data: entries.map(e => e[1]), backgroundColor: entries.map(e => (POLLUTANT_COLORS[e[0]] || "#8392b0") + "cc"), borderColor: entries.map(e => POLLUTANT_COLORS[e[0]] || "#8392b0"), borderWidth: 2, hoverOffset: 5 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "62%",
      plugins: {
        legend: { display: true, position: "bottom", labels: { color: mutedColor(), font: { family: "'Inter'", size: 10 }, boxWidth: 8, padding: 6 } },
        tooltip: chartDefaults().tooltip
      }
    }
  });
}

// ── MAP ───────────────────────────────────────────────────
function initMap() {
  const city = CITIES[currentCity];
  const tileUrl = currentTheme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  if (!leafletMap) {
    leafletMap = L.map("leafletMap").setView([city.lat, city.lng], city.zoom);
    L.tileLayer(tileUrl, { attribution: "© OpenStreetMap © CARTO", maxZoom: 19 }).addTo(leafletMap);
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
    if (z.aqi === undefined) return;
    const cat = getCategory(z.aqi);
    const m = L.circleMarker([z.lat, z.lng], { radius: 10, fillColor: cat.color, color: "#fff", weight: 1.5, opacity: .9, fillOpacity: .8 }).addTo(leafletMap);
    m.bindPopup(`<div style="font-family:'Inter',sans-serif;min-width:160px"><div style="font-weight:700;font-size:.95rem;margin-bottom:6px">${z.name}</div><div style="font-size:2rem;font-family:'Bebas Neue',sans-serif;color:${cat.color};line-height:1">${z.aqi}</div><div style="font-size:.74rem;color:${cat.color};font-weight:600;margin-bottom:5px">${cat.label}</div><div style="font-size:.72rem;color:#8392b0">PM2.5: ${z.pm25} µg/m³</div></div>`);
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
  document.getElementById("accAqiRange").textContent = `AQI: ${catIdx > 0 ? CATEGORIES[catIdx-1].max+1 : 0}–${CATEGORIES[catIdx].max} · ${city.name}`;
  document.getElementById("accDesc").textContent = hd.warning;
  document.getElementById("riskFill").style.width = cat.riskPct + "%";
  document.getElementById("advisoryText").textContent = hd.warning;
  document.getElementById("guidelinesList").innerHTML = hd.guidelines.map(g => `<li>${g}</li>`).join("");
  document.getElementById("vulnerableList").innerHTML = hd.vulnerable.map(v => `<li>${v}</li>`).join("");
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
    buildMainChart("bar", labels, datasets);
  } else {
    labels = view === "weekly" ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] : Array.from({length:30},(_,i)=>`${i+1}`);
    data = labels.map(() => Math.max(15, baseAqi + Math.round((Math.random() - 0.48) * 65)));
    datasets = [{ label: "AQI", data, tension: 0.45, fill: true, borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.07)", pointBackgroundColor: data.map(v => getCategory(v).color), pointBorderColor: "transparent", pointRadius: 4, pointHoverRadius: 7, borderWidth: 2.5 }];
    buildMainChart("line", labels, datasets);
  }
  const nums = datasets[0].data;
  const min = Math.min(...nums), max = Math.max(...nums), avg2 = Math.round(nums.reduce((a,b)=>a+b)/nums.length);
  document.getElementById("trendKPIs").innerHTML = [
    [avg2, "Average AQI"], [max, "Peak AQI"], [min, "Best AQI"], [getCategory(avg2).label, "Avg Category"]
  ].map(([v, l]) => `<div class="kpi-card"><div class="kpi-num" style="color:${getCategory(typeof v === 'number' ? v : avg2).color}">${v}</div><div class="kpi-lbl">${l}</div></div>`).join("");
  const ctx2 = document.getElementById("pm25Chart").getContext("2d");
  if (charts.pm25) charts.pm25.destroy();
  charts.pm25 = new Chart(ctx2, { type: "line", data: { labels, datasets: [{ label: "PM2.5", data: nums.map(v=>Math.round(v*.47)), tension:.4, fill:true, borderColor:"#fb923c", backgroundColor:"rgba(251,146,60,.08)", pointRadius:3, pointBackgroundColor:"#fb923c", borderWidth:2 }] }, options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip: chartDefaults().tooltip }, scales: chartScales() } });
  const counts = [0,0,0,0,0,0];
  nums.forEach(v => counts[getCatIndex(v)]++);
  const nonZero = counts.map((c,i)=>({count:c,cat:CATEGORIES[i]})).filter(x=>x.count>0);
  const ctx3 = document.getElementById("donutChart").getContext("2d");
  if (charts.donut) charts.donut.destroy();
  charts.donut = new Chart(ctx3, { type:"doughnut", data:{ labels:nonZero.map(x=>x.cat.label), datasets:[{ data:nonZero.map(x=>x.count), backgroundColor:nonZero.map(x=>x.cat.color+"bb"), borderColor:nonZero.map(x=>x.cat.color), borderWidth:2, hoverOffset:6 }] }, options:{ responsive:true, maintainAspectRatio:false, cutout:"65%", plugins:{ legend:{ display:true, position:"bottom", labels:{ color:mutedColor(), font:{ family:"'Inter'", size:10 }, boxWidth:9, padding:8 } }, tooltip: chartDefaults().tooltip } } });
}
function buildMainChart(type, labels, datasets) {
  const ctx = document.getElementById("mainTrendChart").getContext("2d");
  if (charts.trend) charts.trend.destroy();
  charts.trend = new Chart(ctx, { type, data:{ labels, datasets }, options:{ responsive:true, maintainAspectRatio:false, interaction:{mode:"index",intersect:false}, plugins:{ legend:{display:false}, tooltip: chartDefaults().tooltip }, scales: chartScales() } });
}

// ── CLEAN AIR ROUTE — full overhaul ──────────────────────
let voiceEnabled = true;
let navSteps = [], navStepIdx = 0, navActive = false, carMarker = null;
let currentRouteData = null;

// OSRM public API (free, no key needed)
const OSRM = "https://router.project-osrm.org/route/v1/driving";

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  const btn = document.getElementById("voiceToggleBtn");
  btn.classList.toggle("voice-active", voiceEnabled);
  btn.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 2a3 3 0 013 3v5a3 3 0 01-6 0V5a3 3 0 013-3z"/><path d="M5 10a5 5 0 0010 0M10 15v3M7 18h6"/></svg> Voice ${voiceEnabled ? "On" : "Off"}`;
  if (voiceEnabled) speak("Voice navigation enabled");
}

function speak(text) {
  if (!voiceEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95; u.pitch = 1; u.volume = 1;
  const voices = speechSynthesis.getVoices();
  const eng = voices.find(v => v.lang.startsWith("en"));
  if (eng) u.voice = eng;
  speechSynthesis.speak(u);
}

function initRouteMap() {
  const city = CITIES[currentCity];
  document.getElementById("routeCityName").textContent = city.name;
  const tileUrl = currentTheme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  if (!routeMap) {
    routeMap = L.map("routeMap", { zoomControl: true }).setView([city.lat, city.lng], 12);
    L.tileLayer(tileUrl, { attribution: "© OpenStreetMap © CARTO", maxZoom: 19 }).addTo(routeMap);
  } else {
    routeMap.setView([city.lat, city.lng], 12);
    rebuildMapTiles(routeMap);
  }
  // AQI zone circles
  CITIES[currentCity].zones.forEach(z => {
    if (z.aqi === undefined) return;
    const cat = getCategory(z.aqi);
    L.circle([z.lat, z.lng], {
      radius: 800, fillColor: cat.color, color: cat.color,
      weight: 1, fillOpacity: .18, opacity: .5
    }).bindTooltip(`<b>${z.name}</b> AQI: ${z.aqi} (${cat.label})`, { permanent: false })
      .addTo(routeMap);
    L.circleMarker([z.lat, z.lng], {
      radius: 8, fillColor: cat.color, color: "#fff", weight: 1.5, fillOpacity: .9
    }).bindPopup(`<div style="font-family:'Inter';padding:4px"><b style="font-size:.9rem">${z.name}</b><br><span style="font-size:1.5rem;font-family:'Bebas Neue';color:${cat.color}">${z.aqi}</span><br><small style="color:${cat.color}">${cat.label}</small><br><small>PM2.5: ${z.pm25 || Math.round(z.aqi*.47)} µg/m³</small></div>`)
      .addTo(routeMap);
  });
}

function suggestRoutePlace(which, val) {
  const boxId = which === "start" ? "startSuggestions" : "endSuggestions";
  const box = document.getElementById(boxId);
  if (!val || val.length < 1) { box.classList.remove("show"); return; }
  const zones = CITIES[currentCity].zones.filter(z =>
    z.name.toLowerCase().includes(val.toLowerCase())
  );
  if (!zones.length) { box.classList.remove("show"); return; }
  box.innerHTML = zones.map(z => {
    const cat = getCategory(z.aqi || 50);
    return `<div class="route-sug-item" onclick="selectRouteZone('${which}','${z.name}')">
      <span style="font-size:1rem">📍</span> ${z.name}
      <span class="route-sug-aqi" style="color:${cat.color}">${z.aqi || '—'}</span>
    </div>`;
  }).join("");
  box.classList.add("show");
}

function selectRouteZone(which, zoneName) {
  const zone = CITIES[currentCity].zones.find(z => z.name === zoneName);
  if (!zone) return;
  if (which === "start") {
    routeStartZone = zone;
    document.getElementById("routeStart").value = zone.name;
    document.getElementById("startSuggestions").classList.remove("show");
  } else {
    routeEndZone = zone;
    document.getElementById("routeEnd").value = zone.name;
    document.getElementById("endSuggestions").classList.remove("show");
  }
}

function swapRoutePoints() {
  const s = document.getElementById("routeStart").value;
  const e = document.getElementById("routeEnd").value;
  document.getElementById("routeStart").value = e;
  document.getElementById("routeEnd").value = s;
  const tmp = routeStartZone; routeStartZone = routeEndZone; routeEndZone = tmp;
}

async function planCleanRoute() {
  // Resolve from typed text if not selected from dropdown
  if (!routeStartZone || !routeEndZone) {
    const zones = CITIES[currentCity].zones;
    const sv = document.getElementById("routeStart").value.trim().toLowerCase();
    const ev = document.getElementById("routeEnd").value.trim().toLowerCase();
    if (sv) routeStartZone = zones.find(z => z.name.toLowerCase().includes(sv));
    if (ev) routeEndZone   = zones.find(z => z.name.toLowerCase().includes(ev));
  }
  if (!routeStartZone || !routeEndZone) {
    showRouteError("Please select valid start and destination zones from the dropdown suggestions.");
    return;
  }
  if (routeStartZone.name === routeEndZone.name) {
    showRouteError("Start and destination cannot be the same zone.");
    return;
  }

  setRouteStatus("Fetching road route via OSRM…", true);
  document.getElementById("routeResult").innerHTML = `<div class="route-result-placeholder"><div class="rrp-icon" style="animation:spin 1s linear infinite">⏳</div><div class="rrp-text">Calculating cleanest road route…</div></div>`;

  // Build 3 candidate zone-paths and fetch OSRM route for the cleanest one
  const zones = CITIES[currentCity].zones.filter(z => z.aqi !== undefined);
  const intermediates = zones
    .filter(z => z.name !== routeStartZone.name && z.name !== routeEndZone.name)
    .sort((a, b) => a.aqi - b.aqi);

  const candidates = [
    { label: "Direct", zones: [routeStartZone, routeEndZone] },
    ...(intermediates.slice(0, 2).map((via, i) => ({
      label: i === 0 ? "Cleanest ✓" : "Alternative",
      zones: [routeStartZone, via, routeEndZone]
    })))
  ];

  // Score by avg AQI
  candidates.forEach(c => {
    c.avgAqi = Math.round(c.zones.reduce((s, z) => s + z.aqi, 0) / c.zones.length);
  });
  candidates.sort((a, b) => a.avgAqi - b.avgAqi);

  // Fetch OSRM for best (cleanest) candidate
  const bestCandidate = candidates[0];
  const coords = bestCandidate.zones.map(z => `${z.lng},${z.lat}`).join(";");
  let osrmData = null;
  try {
    const res = await fetch(`${OSRM}/${coords}?overview=full&geometries=geojson&steps=true&annotations=false`, {
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) osrmData = await res.json();
  } catch (e) { /* fall through to fallback */ }

  if (osrmData && osrmData.routes && osrmData.routes[0]) {
    const route = osrmData.routes[0];
    currentRouteData = { osrm: route, candidate: bestCandidate, allCandidates: candidates };
    drawOsrmRoute(route, bestCandidate);
    buildNavSteps(route, bestCandidate);
    showRouteResult(route, bestCandidate, candidates);
    setRouteStatus("Route found · " + candidates[0].avgAqi + " avg AQI", false);
    document.getElementById("navBtn").disabled = false;
    speak(`Clean air route found. ${route.legs.reduce((s,l)=>s+l.steps.length,0)} steps. Average AQI ${bestCandidate.avgAqi}. Tap Navigate to begin turn-by-turn directions.`);
  } else {
    // OSRM unavailable — draw straight-line fallback with rich UI
    currentRouteData = { osrm: null, candidate: bestCandidate, allCandidates: candidates };
    drawFallbackRoute(candidates);
    buildFallbackNavSteps(bestCandidate);
    showFallbackRouteResult(bestCandidate, candidates);
    setRouteStatus("Offline route · " + candidates[0].avgAqi + " avg AQI", false);
    document.getElementById("navBtn").disabled = false;
    speak(`Clean air route planned. Average AQI ${bestCandidate.avgAqi}.`);
  }
}

function drawOsrmRoute(route, candidate) {
  if (!routeMap) return;
  if (routeLayer) routeLayer.forEach(l => routeMap.removeLayer(l));
  routeMarkers.forEach(m => routeMap.removeLayer(m));
  routeLayer = []; routeMarkers = [];

  const cat = getCategory(candidate.avgAqi);
  const geojson = route.geometry;

  // Shadow line
  const shadow = L.geoJSON(geojson, {
    style: { color: "#000", weight: 9, opacity: .12, lineCap: "round", lineJoin: "round" }
  }).addTo(routeMap);
  routeLayer.push(shadow);

  // Main coloured route
  const mainLine = L.geoJSON(geojson, {
    style: { color: cat.color, weight: 5, opacity: .95, lineCap: "round", lineJoin: "round" }
  }).addTo(routeMap);
  routeLayer.push(mainLine);

  // Animated white dash overlay
  const animLine = L.geoJSON(geojson, {
    style: { color: "#fff", weight: 2, opacity: .5, dashArray: "8 12", lineCap: "round" }
  }).addTo(routeMap);
  routeLayer.push(animLine);

  // AQI zone circles overlay
  candidate.zones.forEach(z => {
    const zc = getCategory(z.aqi);
    const circle = L.circle([z.lat, z.lng], {
      radius: 600, fillColor: zc.color, color: zc.color, weight: 0, fillOpacity: .12
    }).addTo(routeMap);
    routeLayer.push(circle);
  });

  // Start marker
  const startIcon = L.divIcon({
    className: "",
    html: `<div style="background:#22c55e;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-size:.55rem;color:#fff;font-weight:700">S</div>`,
    iconSize: [18,18], iconAnchor: [9,9]
  });
  const endIcon = L.divIcon({
    className: "",
    html: `<div style="background:#ef4444;width:22px;height:22px;border-radius:50% 50% 50% 0;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.4);transform:rotate(-45deg)"><div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:.5rem;color:#fff;font-weight:700">D</div></div>`,
    iconSize: [22,22], iconAnchor: [11,22]
  });
  const coords = geojson.coordinates;
  const startCoord = coords[0];
  const endCoord   = coords[coords.length-1];
  L.marker([startCoord[1], startCoord[0]], { icon: startIcon }).bindPopup(`<b>Start:</b> ${candidate.zones[0].name}`).addTo(routeMap);
  L.marker([endCoord[1],   endCoord[0]],   { icon: endIcon   }).bindPopup(`<b>Destination:</b> ${candidate.zones[candidate.zones.length-1].name}`).addTo(routeMap);

  // Fit bounds
  routeMap.fitBounds(mainLine.getBounds(), { padding: [40, 40] });
}

function drawFallbackRoute(candidates) {
  if (!routeMap) return;
  if (routeLayer) routeLayer.forEach(l => routeMap.removeLayer(l));
  routeMarkers.forEach(m => routeMap.removeLayer(m));
  routeLayer = []; routeMarkers = [];

  const best = candidates[0];
  const cat = getCategory(best.avgAqi);

  // Curved spline-like path using intermediate points
  const latlngs = best.zones.map(z => [z.lat, z.lng]);

  const shadow = L.polyline(latlngs, { color: "#000", weight: 8, opacity: .1, lineCap: "round", lineJoin: "round", smoothFactor: 3 }).addTo(routeMap);
  const main   = L.polyline(latlngs, { color: cat.color, weight: 5, opacity: .95, lineCap: "round", lineJoin: "round", smoothFactor: 3 }).addTo(routeMap);
  const anim   = L.polyline(latlngs, { color: "#fff", weight: 2, opacity: .5, dashArray: "8 12", lineCap: "round", smoothFactor: 3 }).addTo(routeMap);
  routeLayer.push(shadow, main, anim);

  // Alt routes
  candidates.slice(1).forEach(c => {
    const l = L.polyline(c.zones.map(z => [z.lat, z.lng]), {
      color: "#8392b0", weight: 2.5, opacity: .35, dashArray: "6 8", smoothFactor: 3
    }).addTo(routeMap);
    routeLayer.push(l);
  });

  best.zones.forEach((z, i) => {
    const isFirst = i === 0, isLast = i === best.zones.length - 1;
    const cat2 = getCategory(z.aqi || 50);
    const icon = L.divIcon({
      className: "",
      html: isFirst
        ? `<div style="background:#22c55e;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:.55rem;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center">S</div>`
        : isLast
          ? `<div style="background:#ef4444;width:22px;height:22px;border-radius:50% 50% 50% 0;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);transform:rotate(-45deg)"><div style="transform:rotate(45deg);width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:.5rem;color:#fff;font-weight:700">D</div></div>`
          : `<div style="background:${cat2.color};width:13px;height:13px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.3)"></div>`,
      iconSize: [isLast ? 22 : 18, isLast ? 22 : 18],
      iconAnchor: isLast ? [11,22] : [9,9]
    });
    L.marker([z.lat, z.lng], { icon })
      .bindPopup(`<div style="font-family:'Inter';padding:4px"><b>${z.name}</b><br>AQI: <span style="color:${cat2.color};font-weight:700">${z.aqi}</span> · ${cat2.label}</div>`)
      .addTo(routeMap);
  });
  routeMap.fitBounds(L.latLngBounds(latlngs), { padding: [40,40] });
}

function buildNavSteps(osrmRoute, candidate) {
  navSteps = [];
  const turnEmoji = {
    "turn-left": "⬅️", "turn-right": "➡️", "turn-slight-left": "↙️", "turn-slight-right": "↘️",
    "turn-sharp-left": "⬅️", "turn-sharp-right": "➡️", "uturn": "🔄",
    "straight": "⬆️", "arrive": "🏁", "depart": "🚦", "roundabout": "🔄",
    "merge": "↗️", "ramp": "↗️", "fork": "⑂", "end-of-road": "↩️"
  };

  osrmRoute.legs.forEach((leg, li) => {
    leg.steps.forEach((step, si) => {
      const man = step.maneuver;
      const type = man.type + (man.modifier ? "-" + man.modifier : "");
      const emoji = turnEmoji[type] || turnEmoji[man.type] || "⬆️";
      const dist = step.distance < 1000 ? `${Math.round(step.distance)} m` : `${(step.distance/1000).toFixed(1)} km`;
      const dur  = Math.round(step.duration / 60);
      let instruction = step.name
        ? `${ucfirst(man.type)} onto ${step.name}`
        : ucfirst(man.type.replace(/-/g, " "));
      if (man.modifier) instruction = ucfirst(man.modifier.replace(/-/g," ")) + " · " + instruction;
      navSteps.push({ emoji, instruction, dist, dur, coord: [man.location[1], man.location[0]] });
    });
  });

  // Add AQI zone waypoints
  candidate.zones.forEach(z => {
    const cat = getCategory(z.aqi);
    navSteps.push({
      emoji: cat.riskPct > 50 ? "⚠️" : "✅",
      instruction: `Entering ${z.name} — AQI ${z.aqi} (${cat.label})`,
      dist: "", dur: 0, coord: [z.lat, z.lng], isZoneInfo: true
    });
  });
  navSteps.sort((a, b) => 0); // keep order
}

function buildFallbackNavSteps(candidate) {
  navSteps = [];
  const dirs = ["Head north", "Turn right", "Continue straight", "Turn left", "Bear right", "Take slight left", "Merge onto main road"];
  candidate.zones.forEach((z, i) => {
    if (i < candidate.zones.length - 1) {
      const next = candidate.zones[i+1];
      const bearing = getBearing(z.lat, z.lng, next.lat, next.lng);
      const dist = Math.round(haversineKm(z.lat, z.lng, next.lat, next.lng) * 1000);
      const dir = bearing < 45 ? "⬆️" : bearing < 135 ? "➡️" : bearing < 225 ? "⬇️" : "⬅️";
      const inst = dirs[Math.floor(Math.random() * dirs.length)];
      navSteps.push({ emoji: dir, instruction: `${inst} towards ${next.name}`, dist: dist < 1000 ? `${dist} m` : `${(dist/1000).toFixed(1)} km`, dur: Math.round(dist/250), coord: [z.lat, z.lng] });
    }
    const cat = getCategory(z.aqi);
    navSteps.push({
      emoji: cat.riskPct > 50 ? "⚠️" : "✅",
      instruction: `Zone: ${z.name} — AQI ${z.aqi} (${cat.label})`,
      dist: "", dur: 0, coord: [z.lat, z.lng], isZoneInfo: true
    });
  });
  navSteps.push({ emoji: "🏁", instruction: `Arrived at ${candidate.zones[candidate.zones.length-1].name}`, dist: "", dur: 0, coord: [candidate.zones[candidate.zones.length-1].lat, candidate.zones[candidate.zones.length-1].lng] });
}

function getBearing(lat1, lng1, lat2, lng2) {
  const dL = (lng2 - lng1) * Math.PI/180;
  const y = Math.sin(dL) * Math.cos(lat2 * Math.PI/180);
  const x = Math.cos(lat1*Math.PI/180)*Math.sin(lat2*Math.PI/180) - Math.sin(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.cos(dL);
  return (Math.atan2(y,x) * 180/Math.PI + 360) % 360;
}
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function ucfirst(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }

function showRouteResult(osrmRoute, candidate, allCandidates) {
  const cat = getCategory(candidate.avgAqi);
  const totalDist = osrmRoute.distance < 1000 ? `${Math.round(osrmRoute.distance)} m` : `${(osrmRoute.distance/1000).toFixed(1)} km`;
  const totalDur  = Math.round(osrmRoute.duration / 60);
  const stepsHtml = navSteps.filter(s => !s.isZoneInfo).slice(0, 8).map((s, i) =>
    `<div class="nav-step-row ${i===0?'nav-step-active':''}">
      <span class="nsr-icon">${s.emoji}</span>
      <div class="nsr-info"><div class="nsr-inst">${s.instruction}</div><div class="nsr-dist">${s.dist}</div></div>
    </div>`
  ).join("");
  _showRouteResultHTML(cat, candidate.avgAqi, totalDist, totalDur, stepsHtml, allCandidates, candidate);
}

function showFallbackRouteResult(candidate, allCandidates) {
  const cat = getCategory(candidate.avgAqi);
  const distKm = candidate.zones.reduce((sum, z, i) => {
    if (i === 0) return 0;
    return sum + haversineKm(candidate.zones[i-1].lat, candidate.zones[i-1].lng, z.lat, z.lng);
  }, 0);
  const totalDist = distKm < 1 ? `${Math.round(distKm*1000)} m` : `${distKm.toFixed(1)} km`;
  const totalDur = Math.round(distKm / 0.5);
  const stepsHtml = navSteps.filter(s => !s.isZoneInfo).slice(0, 6).map((s, i) =>
    `<div class="nav-step-row ${i===0?'nav-step-active':''}">
      <span class="nsr-icon">${s.emoji}</span>
      <div class="nsr-info"><div class="nsr-inst">${s.instruction}</div><div class="nsr-dist">${s.dist}</div></div>
    </div>`
  ).join("");
  _showRouteResultHTML(cat, candidate.avgAqi, totalDist, totalDur, stepsHtml, allCandidates, candidate);
}

function _showRouteResultHTML(cat, avgAqi, dist, dur, stepsHtml, allCandidates, best) {
  const altHtml = allCandidates.slice(1).map(c => {
    const pc = getCategory(c.avgAqi);
    return `<div class="route-alt-card" onclick="void(0)">
      <div class="rac-head"><div class="rac-name">${c.label}</div><div class="rac-aqi" style="color:${pc.color}">${c.avgAqi}</div></div>
      <div class="rac-desc">Via: ${c.zones.map(z=>z.name).join(" → ")} · ${pc.label}</div>
    </div>`;
  }).join("");

  document.getElementById("routeResult").innerHTML = `
    <div class="route-result-panel">
      <div class="route-summary-card">
        <div class="rsc-title">🛣️ CLEANEST ROAD ROUTE</div>
        <div class="rsc-metrics">
          <div class="rscm"><div class="rscm-val" style="color:${cat.color}">${avgAqi}</div><div class="rscm-lbl">Avg AQI</div></div>
          <div class="rscm"><div class="rscm-val">${dist}</div><div class="rscm-lbl">Distance</div></div>
          <div class="rscm"><div class="rscm-val">${dur}</div><div class="rscm-lbl">Min Est.</div></div>
        </div>
        <div class="route-aqi-badge" style="background:${cat.color}18;color:${cat.color};border:1px solid ${cat.color}40">
          ${cat.label} · ${best.zones.map(z=>z.name).join(" → ")}
        </div>
      </div>
      <div class="route-zones-title">🗣 TURN-BY-TURN PREVIEW</div>
      <div class="nav-steps-list">${stepsHtml}</div>
      ${allCandidates.length > 1 ? `<div class="route-alt-label">OTHER ROUTE OPTIONS</div>${altHtml}` : ""}
    </div>`;
}

function startNavigation() {
  if (!navSteps.length) return;
  navActive = true; navStepIdx = 0;
  document.getElementById("navBanner").style.display = "block";
  document.getElementById("navBtn").textContent = "Navigating…";
  updateNavBanner();
  speak(navSteps[0].instruction + ". " + navSteps[0].dist);
  placeCarMarker(navSteps[0].coord);
}

function stopNavigation() {
  navActive = false;
  document.getElementById("navBanner").style.display = "none";
  document.getElementById("navBtn").textContent = "Navigate";
  document.getElementById("navBtn").disabled = false;
  if (carMarker) { routeMap.removeLayer(carMarker); carMarker = null; }
  window.speechSynthesis && window.speechSynthesis.cancel();
}

function nextNavStep() {
  if (navStepIdx < navSteps.length - 1) {
    navStepIdx++;
    updateNavBanner();
    const step = navSteps[navStepIdx];
    speak(step.instruction + (step.dist ? ". " + step.dist : ""));
    placeCarMarker(step.coord);
  } else {
    speak("You have arrived at your destination!");
    setTimeout(stopNavigation, 2500);
  }
}

function prevNavStep() {
  if (navStepIdx > 0) {
    navStepIdx--;
    updateNavBanner();
    const step = navSteps[navStepIdx];
    speak(step.instruction);
    placeCarMarker(step.coord);
  }
}

function updateNavBanner() {
  const step = navSteps[navStepIdx] || {};
  document.getElementById("navTurnIcon").textContent = step.emoji || "⬆️";
  document.getElementById("navStepText").textContent = step.instruction || "Follow the route";
  document.getElementById("navStepDist").textContent = step.dist || "";
  document.getElementById("navStepCounter").textContent = `Step ${navStepIdx+1} of ${navSteps.length}`;
  const pct = ((navStepIdx) / Math.max(navSteps.length-1,1)) * 100;
  document.getElementById("navProgressFill").style.width = pct + "%";

  // Highlight active step in sidebar
  document.querySelectorAll(".nav-step-row").forEach((r,i) => r.classList.toggle("nav-step-active", i === navStepIdx));
}

function placeCarMarker(coord) {
  if (!routeMap || !coord) return;
  if (carMarker) routeMap.removeLayer(carMarker);
  const carIcon = L.divIcon({
    className: "car-marker-icon",
    html: `<div style="font-size:1.4rem;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))">🚗</div>`,
    iconSize: [28,28], iconAnchor: [14,14]
  });
  carMarker = L.marker(coord, { icon: carIcon }).addTo(routeMap);
  routeMap.setView(coord, Math.max(routeMap.getZoom(), 14), { animate: true, duration: 1 });
}

function showRouteError(msg) {
  document.getElementById("routeResult").innerHTML = `<div class="route-result-placeholder"><div class="rrp-icon">⚠️</div><div class="rrp-text">${msg}</div></div>`;
}

function setRouteStatus(text, active) {
  document.getElementById("routeStatusText").textContent = text;
  document.getElementById("routeStatusPill").querySelector(".rsp-dot").classList.toggle("active", active);
}

// ── BREATHING — 5 exercises ───────────────────────────────
const EXERCISES = [
  {
    name: "4-4-6 Calm", sub: "Anti-stress pattern for polluted days",
    phases: [{ name:"INHALE",color:"var(--accent)",scale:1.45,dur:4 }, { name:"HOLD",color:"var(--accent2)",scale:1.45,dur:4 }, { name:"EXHALE",color:"var(--accent3)",scale:.85,dur:6 }],
    badge: "Beginner", title: "4-4-6 Calm Breathing",
    desc: "A gentle anti-stress pattern ideal for smoky or polluted days. Activates the parasympathetic nervous system to reduce anxiety and slow heart rate.",
    benefits: ["✓ Reduces stress hormones", "✓ Eases airway irritation", "✓ Lowers blood pressure"],
    when: "Best when: AQI > 100 or feeling anxious"
  },
  {
    name: "Box Breathing", sub: "4-4-4-4 · Navy SEAL focus technique",
    phases: [{ name:"INHALE",color:"var(--accent)",scale:1.45,dur:4 }, { name:"HOLD IN",color:"var(--accent2)",scale:1.45,dur:4 }, { name:"EXHALE",color:"var(--accent3)",scale:.85,dur:4 }, { name:"HOLD OUT",color:"#8b5cf6",scale:.85,dur:4 }],
    badge: "Intermediate", title: "Box Breathing (4-4-4-4)",
    desc: "Used by Navy SEALs and elite athletes to regulate the nervous system under stress. Equal phases create a mental 'box' that improves focus and calm.",
    benefits: ["✓ Boosts mental clarity", "✓ Balances CO₂/O₂ levels", "✓ Reduces panic response"],
    when: "Best when: Feeling overwhelmed by air quality reports"
  },
  {
    name: "4-7-8 Sleep", sub: "Deep relaxation for bedtime",
    phases: [{ name:"INHALE",color:"var(--accent)",scale:1.5,dur:4 }, { name:"HOLD",color:"var(--accent2)",scale:1.5,dur:7 }, { name:"EXHALE",color:"var(--accent3)",scale:.8,dur:8 }],
    badge: "Relaxation", title: "4-7-8 Sleep Breathing",
    desc: "Dr. Andrew Weil's proven technique for deep sleep induction. The extended hold and exhale activate the body's natural relaxation response.",
    benefits: ["✓ Induces sleep within minutes", "✓ Reduces nighttime coughing", "✓ Clears respiratory tract"],
    when: "Best when: Before sleep on high-pollution days"
  },
  {
    name: "Wim Hof", sub: "Power breathing · Energy & immunity",
    phases: [{ name:"POWER IN",color:"#f97316",scale:1.6,dur:2 }, { name:"RELEASE",color:"#ef4444",scale:.7,dur:1 }, { name:"HOLD",color:"#a855f7",scale:.7,dur:8 }, { name:"RECOVER",color:"var(--accent3)",scale:1.1,dur:3 }],
    badge: "Advanced", title: "Wim Hof Breathing",
    desc: "The famous Iceman's technique. Rapid power breaths raise O₂ levels and create an alkaline state. Scientifically shown to boost immune response.",
    benefits: ["✓ Energises the body", "✓ Strengthens immune system", "✓ Increases lung capacity"],
    when: "Best when: Morning energiser on moderate AQI days"
  },
  {
    name: "Belly Breath", sub: "Diaphragmatic breathing · AQI recovery",
    phases: [{ name:"BELLY IN",color:"var(--accent)",scale:1.5,dur:5 }, { name:"BELLY OUT",color:"var(--accent3)",scale:.85,dur:5 }],
    badge: "Beginner", title: "Belly (Diaphragmatic) Breathing",
    desc: "Pure diaphragmatic breathing strengthens the main breathing muscle and maximises O₂ exchange. Essential for recovering from lung stress caused by pollution.",
    benefits: ["✓ Maximises O₂ intake", "✓ Strengthens diaphragm", "✓ Clears pollutant residue"],
    when: "Best when: After outdoor exposure on any AQI level"
  }
];

let currentExercise = 0;

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
    "Great air today — breathing exercises boost your lung capacity even more.",
    "Air is acceptable. Regular breathing maintains respiratory health.",
    "Air quality is degraded — indoor breathing exercises calm your airways.",
    "Unhealthy air detected. Stay indoors and use this exercise to ease discomfort.",
    "Very unhealthy conditions. Stay inside — slow breathing helps.",
    "⚠ Hazardous air. Do NOT go outside. Focus on slow, calm breathing."
  ];
  const tipEl = document.getElementById("brTip");
  if (tipEl) tipEl.textContent = tips[getCatIndex(avg)] || tips[tips.length - 1];
}

function selectExercise(idx, tabEl) {
  if (brRunning) stopBreathing();
  currentExercise = idx;
  const ex = EXERCISES[idx];

  // Update tabs
  document.querySelectorAll(".br-ex-tab").forEach((t,i) => t.classList.toggle("active", i === idx));

  // Update header
  document.getElementById("brTitle").textContent = ex.name.toUpperCase();
  document.getElementById("brSub").textContent = ex.sub;

  // Update pattern display
  const phases = ex.phases;
  document.getElementById("brIn").textContent = `${phases[0].dur}s`;
  const holdEl = document.getElementById("brHold");
  const holdItem = document.getElementById("brHoldItem");
  const dot2 = document.getElementById("brDot2");
  if (phases.length > 2) {
    document.getElementById("brEx").textContent = `${phases[phases.length-1].dur}s`;
    holdEl.textContent = `${phases[1].dur}s`;
    holdEl.parentElement.style.display = "";
    dot2 && (dot2.style.display = "");
  } else {
    holdEl.parentElement.style.display = "none";
    dot2 && (dot2.style.display = "none");
    document.getElementById("brEx").textContent = `${phases[1].dur}s`;
  }

  // Update info card
  document.getElementById("brDiffBadge").textContent = ex.badge;
  document.getElementById("brInfoTitle").textContent = ex.title;
  document.getElementById("brInfoDesc").textContent = ex.desc;
  ex.benefits.forEach((b, i) => {
    const el = document.getElementById("brBen" + (i+1));
    if (el) el.textContent = b;
  });
  document.getElementById("brWhen").textContent = ex.when;

  // Update tips
  updateBreathingChip();
}

function toggleBreathing() { brRunning ? stopBreathing() : startBreathing(); }

function startBreathing() {
  brRunning = true; brCycles = 0; brSessionStart = Date.now();
  document.getElementById("bssCycles").textContent = "0";
  document.getElementById("bssCalories") && (document.getElementById("bssCalories").textContent = "0");
  document.getElementById("brStartBtn").innerHTML = "⏹ &nbsp; Stop Exercise";
  brSessionTimer = setInterval(() => {
    const e = Math.floor((Date.now() - brSessionStart) / 1000);
    document.getElementById("bssTime").textContent = `${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`;
    const kcal = Math.round(e * 0.05);
    document.getElementById("bssCalories") && (document.getElementById("bssCalories").textContent = kcal);
  }, 1000);
  runExerciseCycle();
}

function stopBreathing() {
  brRunning = false;
  clearTimeout(brPhaseTimeout); clearInterval(brCountInterval); clearInterval(brSessionTimer);
  document.getElementById("brStartBtn").innerHTML = "▶ &nbsp; Start Exercise";
  document.getElementById("brPhaseText").textContent = "Ready";
  document.getElementById("brCountText").textContent = "";
  const bubble = document.getElementById("brBubble");
  bubble.style.transform = "scale(1)"; bubble.style.borderColor = "var(--accent)";
  document.getElementById("brProgressArc").setAttribute("stroke-dashoffset", "628");
}

function runExerciseCycle() {
  if (!brRunning) return;
  const phases = EXERCISES[currentExercise].phases;
  let idx = 0;
  function nextPhase() {
    if (!brRunning) return;
    if (idx >= phases.length) {
      brCycles++;
      document.getElementById("bssCycles").textContent = brCycles;
      idx = 0;
    }
    const phase = phases[idx++];
    setPhase(phase.name, phase.color, phase.scale, phase.dur, nextPhase);
  }
  nextPhase();
}

function setPhase(name, color, scale, dur, onDone) {
  if (!brRunning) return;
  const bubble = document.getElementById("brBubble");
  const phaseEl = document.getElementById("brPhaseText");
  phaseEl.textContent = name; phaseEl.style.color = color;
  bubble.style.borderColor = color;
  bubble.style.transition = `transform ${dur}s cubic-bezier(.4,0,.6,1)`;
  setTimeout(() => { bubble.style.transform = `scale(${scale})`; }, 10);

  // Animate progress arc
  const arc = document.getElementById("brProgressArc");
  arc.style.transition = `stroke-dashoffset ${dur}s linear`;
  arc.setAttribute("stroke", color.includes("var(--accent2)") ? "var(--accent2)" : color.includes("var(--accent3)") ? "var(--accent3)" : "var(--accent)");
  setTimeout(() => arc.setAttribute("stroke-dashoffset", "0"), 20);
  setTimeout(() => { arc.style.transition = "none"; arc.setAttribute("stroke-dashoffset","628"); }, (dur - 0.05) * 1000);

  let rem = dur; document.getElementById("brCountText").textContent = rem;
  clearInterval(brCountInterval);
  brCountInterval = setInterval(() => {
    rem--;
    if (rem > 0) document.getElementById("brCountText").textContent = rem;
    else { clearInterval(brCountInterval); document.getElementById("brCountText").textContent = ""; }
  }, 1000);
  brPhaseTimeout = setTimeout(onDone, dur * 1000);
}

// ── FORECAST ──────────────────────────────────────────────
function buildForecastPage() {
  const baseAqi = avgAqi(currentCity);
  const days = ["Today","Mon","Tue","Wed","Thu","Fri","Sat"];
  const icons = ["😶‍🌫️","🌤️","🌧️","☀️","🌥️","🌬️","☁️"];
  const forecasts = days.map((d, i) => ({ day: d, icon: icons[i], aqi: Math.max(15, baseAqi + Math.round((Math.random()-.45)*80)) }));
  document.getElementById("forecastCards").innerHTML = forecasts.map((f, i) => {
    const cat = getCategory(f.aqi);
    return `<div class="fc-card ${i===0?"fc-today":""}"><div class="fc-day">${f.day}</div><div class="fc-icon">${f.icon}</div><div class="fc-aqi" style="color:${cat.color}">${f.aqi}</div><div class="fc-cat" style="color:${cat.color}">${cat.label}</div></div>`;
  }).join("");
  document.getElementById("fiWind").textContent = `${Math.round(8+Math.random()*14)} km/h`;
  document.getElementById("fiHumidity").textContent = `${Math.round(40+Math.random()*40)}%`;
  document.getElementById("fiTemp").textContent = `${Math.round(22+Math.random()*16)}°C`;
  document.getElementById("fiRain").textContent = `${Math.round(Math.random()*60)}%`;
  const ctx = document.getElementById("forecastChart").getContext("2d");
  if (forecastChartInst) forecastChartInst.destroy();
  forecastChartInst = new Chart(ctx, { type:"line", data:{ labels:forecasts.map(f=>f.day), datasets:[{ label:"Forecasted AQI", data:forecasts.map(f=>f.aqi), tension:.4, fill:true, borderColor:"#38bdf8", backgroundColor:"rgba(56,189,248,.07)", pointBackgroundColor:forecasts.map(f=>getCategory(f.aqi).color), pointRadius:6, pointHoverRadius:9, borderWidth:2.5 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:chartDefaults().tooltip }, scales:chartScales() } });
}

// ── HEAT MAP ──────────────────────────────────────────────
function buildHeatmap() {
  const baseAqi = avgAqi(currentCity);
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const hours = Array.from({length:24},(_,i)=>`${i}h`);
  const grid = document.getElementById("heatmapGrid");
  grid.innerHTML = "";
  grid.appendChild(Object.assign(document.createElement("div"), { className: "hm-cell hm-header" }));
  hours.forEach(h => { const el = document.createElement("div"); el.className = "hm-cell hm-header"; el.textContent = h; grid.appendChild(el); });
  days.forEach(day => {
    const label = document.createElement("div"); label.className = "hm-cell hm-day-label"; label.textContent = day; grid.appendChild(label);
    for (let h = 0; h < 24; h++) {
      const peakBoost = ((h>=7&&h<=10)||(h>=17&&h<=21)) ? 50 : 0;
      const aqi = Math.max(15, Math.min(400, baseAqi + Math.round((Math.random()-.45)*55) + Math.round(Math.random()*peakBoost*.5)));
      const cat = getCategory(aqi);
      const cell = document.createElement("div");
      cell.className = "hm-cell";
      cell.style.background = cat.color + (aqi > 200 ? "cc" : aqi > 100 ? "88" : "55");
      cell.style.color = "#fff";
      cell.title = `${day} ${h}:00 — AQI ${aqi} (${cat.label})`;
      cell.textContent = aqi > 150 ? aqi : "";
      grid.appendChild(cell);
    }
  });
}

// ── CSS ANIMATIONS ────────────────────────────────────────
const _style = document.createElement("style");
_style.textContent = `
  @keyframes cardOut { to { opacity:0; transform:translateY(-16px); } }
  @keyframes fadeOut { to { opacity:0; } }
`;
document.head.appendChild(_style);
