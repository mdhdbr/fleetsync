# FleetSync Unified Saudi Arabia Map Interface Plan

## Overview

This document outlines the complete map interface implementation for FleetSync, providing a unified view of all vehicles (cars and trucks) across Saudi Arabia with real-time tracking, filtering, and interaction capabilities.

---

## Map Configuration

### Base Map Setup

#### Geographic Coverage
- **Primary Region**: Saudi Arabia
- **Default Center**: Riyadh (24.7136° N, 46.6753° E)
- **Default Zoom**: 6 (country-wide view)
- **Zoom Range**: 4 (regional) to 18 (street-level)

#### Map Provider
- **Primary**: Google Maps API
  - Better coverage for Saudi Arabia
  - Arabic language support
  - Accurate POI data
  - Real-time traffic data
- **Fallback**: Mapbox GL JS
  - Custom styling options
  - Offline capabilities

#### Map Styles
- **Light Mode**: Standard Google Maps
- **Dark Mode**: Custom dark theme for night operations
- **Satellite**: Hybrid view with labels
- **Traffic**: Real-time traffic overlay

### Map Initialization Code

```javascript
// Initialize Google Map centered on Saudi Arabia
const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: 24.7136, lng: 46.6753 }, // Riyadh
  zoom: 6,
  mapTypeId: 'roadmap',
  styles: darkModeStyles, // Custom dark theme
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  gestureHandling: 'greedy'
});

// Add traffic layer
const trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setMap(map);

// Add major cities markers
const majorCities = [
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753 },
  { name: 'Jeddah', lat: 21.5433, lng: 39.1728 },
  { name: 'Mecca', lat: 21.3891, lng: 39.8579 },
  { name: 'Medina', lat: 24.5247, lng: 39.5692 },
  { name: 'Dammam', lat: 26.4207, lng: 50.0888 },
  { name: 'Khobar', lat: 26.2172, lng: 50.1971 },
  { name: 'Dhahran', lat: 26.2361, lng: 50.0393 },
  { name: 'Taif', lat: 21.2703, lng: 40.4150 },
  { name: 'Tabuk', lat: 28.3838, lng: 36.5550 },
  { name: 'Abha', lat: 18.2164, lng: 42.5053 }
];
```

---

## Vehicle Tracking System

### Vehicle Marker System

#### Marker Types & Icons

**RideSync Vehicles (Cars)**
- 🟢 **Available** - Green car icon
- 🔵 **POB (Passenger On Board)** - Blue car icon
- 🟡 **En-route to Pickup** - Yellow car icon
- 🔴 **Offline** - Red car icon
- ⚫ **Maintenance** - Black car icon with wrench

**LogiSync Vehicles (Trucks)**
- 🟢 **Empty** - Green truck icon
- 🔵 **Loaded** - Blue truck icon
- 🟡 **Loading** - Yellow truck icon
- 🟠 **Unloading** - Orange truck icon
- 🔴 **Returning Empty** - Red truck icon

#### Custom Icon Implementation

```javascript
// Vehicle icon configuration
const vehicleIcons = {
  // RideSync - Cars
  car_available: {
    url: '/assets/icons/car-green.svg',
    scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(16, 16)
  },
  car_pob: {
    url: '/assets/icons/car-blue.svg',
    scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(16, 16)
  },
  car_enroute: {
    url: '/assets/icons/car-yellow.svg',
    scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(16, 16)
  },
  car_offline: {
    url: '/assets/icons/car-red.svg',
    scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(16, 16)
  },
  car_maintenance: {
    url: '/assets/icons/car-black.svg',
    scaledSize: new google.maps.Size(32, 32),
    anchor: new google.maps.Point(16, 16)
  },
  
  // LogiSync - Trucks
  truck_empty: {
    url: '/assets/icons/truck-green.svg',
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20)
  },
  truck_loaded: {
    url: '/assets/icons/truck-blue.svg',
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20)
  },
  truck_loading: {
    url: '/assets/icons/truck-yellow.svg',
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20)
  },
  truck_unloading: {
    url: '/assets/icons/truck-orange.svg',
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20)
  }
};

// Create vehicle marker
function createVehicleMarker(vehicle) {
  const iconKey = `${vehicle.type}_${vehicle.status}`;
  const marker = new google.maps.Marker({
    position: { lat: vehicle.lat, lng: vehicle.lng },
    map: map,
    icon: vehicleIcons[iconKey],
    title: vehicle.id,
    optimized: true, // Use optimized rendering for many markers
    zIndex: getZIndex(vehicle.status) // Higher z-index for active vehicles
  });
  
  // Add rotation for direction
  if (vehicle.heading) {
    marker.setIcon({
      ...vehicleIcons[iconKey],
      rotation: vehicle.heading
    });
  }
  
  return marker;
}
```

### Real-Time Location Updates

#### WebSocket Integration

```javascript
// WebSocket connection for real-time updates
const socket = io('wss://api.fleetsync.sa', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10
});

// Listen for vehicle location updates
socket.on('vehicle:location', (data) => {
  const { vehicleId, lat, lng, heading, speed, status } = data;
  
  // Update marker position
  const marker = vehicleMarkers.get(vehicleId);
  if (marker) {
    // Smooth animation to new position
    animateMarker(marker, { lat, lng }, 1000);
    
    // Update icon if status changed
    if (marker.status !== status) {
      marker.setIcon(vehicleIcons[`${data.type}_${status}`]);
      marker.status = status;
    }
    
    // Update rotation
    if (heading) {
      marker.setIcon({
        ...marker.getIcon(),
        rotation: heading
      });
    }
  } else {
    // Create new marker if doesn't exist
    const newMarker = createVehicleMarker(data);
    vehicleMarkers.set(vehicleId, newMarker);
  }
});

// Smooth marker animation
function animateMarker(marker, newPosition, duration) {
  const startPosition = marker.getPosition();
  const startTime = Date.now();
  
  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Interpolate position
    const lat = startPosition.lat() + (newPosition.lat - startPosition.lat()) * progress;
    const lng = startPosition.lng() + (newPosition.lng - startPosition.lng()) * progress;
    
    marker.setPosition({ lat, lng });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  animate();
}
```

#### GPS Update Frequency
- **Active Trips**: Every 5 seconds
- **Idle Vehicles**: Every 30 seconds
- **Offline Vehicles**: No updates
- **High-Speed Vehicles**: Every 3 seconds (>80 km/h)

---

## Marker Clustering

### Clustering Configuration

```javascript
// Import MarkerClusterer
import { MarkerClusterer } from '@googlemaps/markerclusterer';

// Configure clustering
const clusterer = new MarkerClusterer({
  map,
  markers: Array.from(vehicleMarkers.values()),
  algorithm: new SuperClusterAlgorithm({
    radius: 100,
    maxZoom: 14
  }),
  renderer: {
    render: ({ count, position }) => {
      return new google.maps.Marker({
        position,
        icon: {
          url: '/assets/icons/cluster.svg',
          scaledSize: new google.maps.Size(50, 50)
        },
        label: {
          text: String(count),
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        },
        zIndex: 1000
      });
    }
  }
});

// Update clusters on filter change
function updateClusters(filteredMarkers) {
  clusterer.clearMarkers();
  clusterer.addMarkers(filteredMarkers);
}
```

### Cluster Behavior
- **Zoom < 10**: Cluster all nearby vehicles
- **Zoom 10-14**: Cluster within 100m radius
- **Zoom > 14**: Show individual markers
- **Click**: Zoom into cluster

---

## Filtering System

### Filter Controls

#### Vehicle Type Filter
```javascript
const vehicleTypeFilter = {
  cars: true,
  trucks: true,
  mpv: true,
  luxury: true,
  flatbed: true,
  reefer: true,
  tanker: true,
  box: true
};

function applyVehicleTypeFilter() {
  vehicleMarkers.forEach((marker, vehicleId) => {
    const vehicle = vehicleData.get(vehicleId);
    const visible = vehicleTypeFilter[vehicle.subtype];
    marker.setVisible(visible);
  });
}
```

#### Service Type Filter
```javascript
const serviceTypeFilter = {
  ridesync: true,  // Passenger trips
  logisync: true   // Freight shipments
};

function applyServiceTypeFilter() {
  vehicleMarkers.forEach((marker, vehicleId) => {
    const vehicle = vehicleData.get(vehicleId);
    const visible = serviceTypeFilter[vehicle.service];
    marker.setVisible(visible);
  });
}
```

#### Status Filter
```javascript
const statusFilter = {
  available: true,
  active: true,
  enroute: true,
  offline: false,
  maintenance: false
};

function applyStatusFilter() {
  vehicleMarkers.forEach((marker, vehicleId) => {
    const vehicle = vehicleData.get(vehicleId);
    const visible = statusFilter[vehicle.status];
    marker.setVisible(visible);
  });
}
```

#### Region Filter
```javascript
const regionBounds = {
  riyadh: new google.maps.LatLngBounds(
    new google.maps.LatLng(24.4, 46.4),
    new google.maps.LatLng(25.0, 47.0)
  ),
  jeddah: new google.maps.LatLngBounds(
    new google.maps.LatLng(21.3, 39.0),
    new google.maps.LatLng(21.8, 39.4)
  ),
  // ... other regions
};

function applyRegionFilter(region) {
  if (region === 'all') {
    vehicleMarkers.forEach(marker => marker.setVisible(true));
    map.setCenter({ lat: 24.7136, lng: 46.6753 });
    map.setZoom(6);
  } else {
    const bounds = regionBounds[region];
    vehicleMarkers.forEach((marker, vehicleId) => {
      const visible = bounds.contains(marker.getPosition());
      marker.setVisible(visible);
    });
    map.fitBounds(bounds);
  }
}
```

---

## Marker Interactions

### Info Window

```javascript
// Create info window
const infoWindow = new google.maps.InfoWindow();

// Add click listener to markers
marker.addListener('click', () => {
  const vehicle = vehicleData.get(vehicleId);
  
  const content = `
    <div class="vehicle-info-window">
      <h3>${vehicle.type} - ${vehicle.id}</h3>
      <div class="info-row">
        <span class="label">Driver:</span>
        <span class="value">${vehicle.driver.name}</span>
      </div>
      <div class="info-row">
        <span class="label">Status:</span>
        <span class="value status-${vehicle.status}">${vehicle.status}</span>
      </div>
      <div class="info-row">
        <span class="label">Speed:</span>
        <span class="value">${vehicle.speed} km/h</span>
      </div>
      <div class="info-row">
        <span class="label">Fuel:</span>
        <span class="value">${vehicle.fuel}%</span>
      </div>
      ${vehicle.currentTrip ? `
        <div class="info-row">
          <span class="label">Current Trip:</span>
          <span class="value">#${vehicle.currentTrip}</span>
        </div>
      ` : ''}
      <div class="actions">
        <button onclick="viewDetails('${vehicleId}')">View Details</button>
        <button onclick="contactDriver('${vehicle.driver.id}')">Contact Driver</button>
        ${vehicle.status === 'available' ? `
          <button onclick="assignJob('${vehicleId}')">Assign Job</button>
        ` : ''}
      </div>
    </div>
  `;
  
  infoWindow.setContent(content);
  infoWindow.open(map, marker);
});
```

### Hover Effects

```javascript
// Add hover listeners
marker.addListener('mouseover', () => {
  // Show tooltip with basic info
  const tooltip = document.createElement('div');
  tooltip.className = 'marker-tooltip';
  tooltip.innerHTML = `
    <strong>${vehicle.id}</strong><br>
    ${vehicle.driver.name}<br>
    ${vehicle.status}
  `;
  // Position tooltip near marker
  // ...
});

marker.addListener('mouseout', () => {
  // Hide tooltip
});
```

---

## Route Visualization

### Active Trip Routes

```javascript
// Draw route for active trip
function drawTripRoute(trip) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: trip.service === 'ridesync' ? '#4A90E2' : '#F5A623',
      strokeWeight: 4,
      strokeOpacity: 0.7
    }
  });
  
  directionsService.route({
    origin: trip.pickup,
    destination: trip.dropoff,
    travelMode: google.maps.TravelMode.DRIVING,
    drivingOptions: {
      departureTime: new Date(),
      trafficModel: 'bestguess'
    }
  }, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
      
      // Store for cleanup
      activeRoutes.set(trip.id, directionsRenderer);
    }
  });
}

// Clear route when trip completes
function clearTripRoute(tripId) {
  const renderer = activeRoutes.get(tripId);
  if (renderer) {
    renderer.setMap(null);
    activeRoutes.delete(tripId);
  }
}
```

### Polyline for Historical Routes

```javascript
// Draw historical route
function drawHistoricalRoute(coordinates) {
  const path = coordinates.map(coord => ({
    lat: coord.lat,
    lng: coord.lng
  }));
  
  const polyline = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#9E9E9E',
    strokeOpacity: 0.5,
    strokeWeight: 2,
    map: map
  });
  
  return polyline;
}
```

---

## Geofencing

### Geofence Zones

```javascript
// Define geofence zones
const geofences = {
  riyadh_airport: {
    center: { lat: 24.9574, lng: 46.6983 },
    radius: 5000, // 5km radius
    type: 'high_demand'
  },
  jeddah_port: {
    center: { lat: 21.4858, lng: 39.1925 },
    radius: 3000,
    type: 'logistics_hub'
  },
  // ... more zones
};

// Draw geofence circles
Object.entries(geofences).forEach(([name, zone]) => {
  const circle = new google.maps.Circle({
    strokeColor: zone.type === 'high_demand' ? '#4A90E2' : '#F5A623',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: zone.type === 'high_demand' ? '#4A90E2' : '#F5A623',
    fillOpacity: 0.15,
    map: map,
    center: zone.center,
    radius: zone.radius
  });
});

// Check if vehicle enters/exits geofence
function checkGeofence(vehicleId, position) {
  Object.entries(geofences).forEach(([name, zone]) => {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(position.lat, position.lng),
      new google.maps.LatLng(zone.center.lat, zone.center.lng)
    );
    
    if (distance <= zone.radius) {
      // Vehicle entered geofence
      onGeofenceEnter(vehicleId, name, zone);
    } else if (previouslyInside[vehicleId]?.[name]) {
      // Vehicle exited geofence
      onGeofenceExit(vehicleId, name, zone);
    }
  });
}
```

---

## Heat Maps

### Demand Heat Map

```javascript
// Create heat map layer
const heatmapLayer = new google.maps.visualization.HeatmapLayer({
  data: getHeatmapData(),
  map: map,
  radius: 50,
  opacity: 0.6,
  gradient: [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
});

// Get heat map data from trip history
function getHeatmapData() {
  const points = [];
  trips.forEach(trip => {
    points.push(new google.maps.LatLng(trip.pickup.lat, trip.pickup.lng));
    points.push(new google.maps.LatLng(trip.dropoff.lat, trip.dropoff.lng));
  });
  return points;
}

// Toggle heat map
function toggleHeatmap(show) {
  heatmapLayer.setMap(show ? map : null);
}
```

---

## Performance Optimization

### Marker Management

```javascript
// Use marker pool to reuse markers
class MarkerPool {
  constructor() {
    this.pool = [];
    this.active = new Map();
  }
  
  getMarker(vehicleId, data) {
    let marker;
    if (this.pool.length > 0) {
      marker = this.pool.pop();
      marker.setPosition(data.position);
      marker.setIcon(data.icon);
      marker.setVisible(true);
    } else {
      marker = new google.maps.Marker(data);
    }
    this.active.set(vehicleId, marker);
    return marker;
  }
  
  releaseMarker(vehicleId) {
    const marker = this.active.get(vehicleId);
    if (marker) {
      marker.setVisible(false);
      this.pool.push(marker);
      this.active.delete(vehicleId);
    }
  }
}

const markerPool = new MarkerPool();
```

### Viewport-Based Rendering

```javascript
// Only render markers in viewport
map.addListener('bounds_changed', () => {
  const bounds = map.getBounds();
  vehicleMarkers.forEach((marker, vehicleId) => {
    const inBounds = bounds.contains(marker.getPosition());
    marker.setVisible(inBounds && passesFilters(vehicleId));
  });
});
```

### Throttled Updates

```javascript
// Throttle marker updates
const throttledUpdate = throttle((vehicleId, data) => {
  updateMarker(vehicleId, data);
}, 1000); // Max once per second per vehicle
```

---

## Integration with Existing Code

### Adapter Pattern

```javascript
// Adapter to integrate existing map/tracking code
class MapAdapter {
  constructor(existingMapInstance) {
    this.legacyMap = existingMapInstance;
    this.googleMap = this.convertToGoogleMap();
  }
  
  convertToGoogleMap() {
    // Convert existing map configuration to Google Maps
    // Preserve existing markers, routes, etc.
    // ...
  }
  
  migrateMarkers() {
    // Convert existing markers to new format
    this.legacyMap.markers.forEach(oldMarker => {
      const newMarker = createVehicleMarker({
        id: oldMarker.id,
        lat: oldMarker.position.lat,
        lng: oldMarker.position.lng,
        type: oldMarker.vehicleType,
        status: oldMarker.status
      });
      vehicleMarkers.set(oldMarker.id, newMarker);
    });
  }
}
```

---

## Mobile Responsiveness

### Responsive Map Container

```css
.map-container {
  width: 100%;
  height: calc(100vh - 60px); /* Full height minus header */
}

@media (max-width: 768px) {
  .map-container {
    height: 50vh; /* Half screen on mobile */
  }
  
  .map-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
```

### Touch Gestures

```javascript
// Enable touch gestures
map.setOptions({
  gestureHandling: 'greedy', // Allow one-finger panning
  zoomControl: true,
  zoomControlOptions: {
    position: google.maps.ControlPosition.RIGHT_BOTTOM
  }
});
```

---

## Summary

This map interface plan provides:

✅ **Unified Saudi Arabia Map** - Complete coverage with Google Maps
✅ **Real-Time Tracking** - WebSocket updates every 5 seconds
✅ **Vehicle Status Icons** - Color-coded markers for all states
✅ **Smart Filtering** - Multi-dimensional filtering system
✅ **Marker Clustering** - Performance optimization for many vehicles
✅ **Route Visualization** - Active and historical routes
✅ **Geofencing** - Zone-based monitoring
✅ **Heat Maps** - Demand visualization
✅ **Mobile Responsive** - Touch-friendly controls
✅ **Performance Optimized** - Marker pooling, viewport rendering
✅ **Integration Ready** - Adapter for existing code

The map serves as the central command interface for the entire FleetSync platform.
