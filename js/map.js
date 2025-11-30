// Map Configuration
const MAP_CONFIG = {
    center: [24.7136, 46.6753], // Riyadh, Saudi Arabia
    zoom: 12,
    dashboardZoom: 10,
    tileLayer: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
};

// Mock Vehicle Data
const VEHICLES = [
    { id: 'V001', type: 'truck', lat: 24.7136, lng: 46.6753, status: 'moving', heading: 45 },
    { id: 'V002', type: 'car', lat: 24.7536, lng: 46.7053, status: 'moving', heading: 90 },
    { id: 'V003', type: 'truck', lat: 24.6836, lng: 46.6453, status: 'idle', heading: 0 },
    { id: 'V004', type: 'car', lat: 24.7336, lng: 46.7253, status: 'moving', heading: 180 },
    { id: 'V005', type: 'truck', lat: 24.7936, lng: 46.6253, status: 'moving', heading: 270 }
];

// State
let dashboardMap = null;
let fullMap = null;
let vehicleMarkers = {};
let simulationInterval = null;

// Icons
const createIcon = (type, heading) => {
    const color = type === 'truck' ? '#3b82f6' : '#10b981'; // Blue for trucks, Green for cars

    // Simple SVG icon
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" style="transform: rotate(${heading}deg);">
            <path d="M12 2L2 22l10-3 10 3L12 2z"/>
        </svg>
    `;

    return L.divIcon({
        className: 'vehicle-marker',
        html: svg,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

// Initialize Maps
function initMaps() {
    // Dashboard Map (Preview)
    const dashboardMapEl = document.getElementById('dashboard-map');
    if (dashboardMapEl && !dashboardMap) {
        dashboardMap = L.map('dashboard-map', {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false
        }).setView(MAP_CONFIG.center, MAP_CONFIG.dashboardZoom);

        L.tileLayer(MAP_CONFIG.tileLayer, {
            attribution: MAP_CONFIG.attribution,
            maxZoom: 19
        }).addTo(dashboardMap);

        // Add static markers for dashboard preview
        addMarkers(dashboardMap);
    }

    // Full Tracking Map
    const fullMapEl = document.getElementById('full-map');
    if (fullMapEl && !fullMap) {
        fullMap = L.map('full-map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

        L.tileLayer(MAP_CONFIG.tileLayer, {
            attribution: MAP_CONFIG.attribution,
            maxZoom: 19
        }).addTo(fullMap);

        // Add markers and start simulation
        addMarkers(fullMap);
        startSimulation();
    }
}

// Add Markers to Map
function addMarkers(map) {
    VEHICLES.forEach(vehicle => {
        const marker = L.marker([vehicle.lat, vehicle.lng], {
            icon: createIcon(vehicle.type, vehicle.heading)
        }).addTo(map);

        marker.bindPopup(`
            <b>${vehicle.id}</b><br>
            Type: ${vehicle.type}<br>
            Status: ${vehicle.status}
        `);

        // Store marker reference for updates (only for full map simulation)
        if (map === fullMap) {
            vehicleMarkers[vehicle.id] = marker;
        }
    });
}

// Simulate Vehicle Movement
function startSimulation() {
    if (simulationInterval) clearInterval(simulationInterval);

    simulationInterval = setInterval(() => {
        VEHICLES.forEach(vehicle => {
            if (vehicle.status === 'moving') {
                // Random small movement
                const moveLat = (Math.random() - 0.5) * 0.001;
                const moveLng = (Math.random() - 0.5) * 0.001;

                vehicle.lat += moveLat;
                vehicle.lng += moveLng;

                // Update heading based on movement
                const angle = Math.atan2(moveLng, moveLat) * 180 / Math.PI;
                vehicle.heading = angle;

                // Update marker position and icon rotation
                if (vehicleMarkers[vehicle.id]) {
                    const marker = vehicleMarkers[vehicle.id];
                    marker.setLatLng([vehicle.lat, vehicle.lng]);
                    marker.setIcon(createIcon(vehicle.type, vehicle.heading));
                }
            }
        });
    }, 2000); // Update every 2 seconds
}

// Handle Resize (Leaflet needs this when container size changes)
function invalidateMapSizes() {
    if (dashboardMap) dashboardMap.invalidateSize();
    if (fullMap) fullMap.invalidateSize();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initMaps);

// Export for use in app.js if needed
window.FleetSyncMap = {
    init: initMaps,
    refresh: invalidateMapSizes
};
