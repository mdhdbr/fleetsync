import { mockData } from '../store.js';

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

export const findNearestVehicle = (originLat, originLng, type) => {
    const availableVehicles = mockData.vehicles.filter(v =>
        v.status === 'empty' && (!type || v.type === type)
    );

    if (availableVehicles.length === 0) return null;

    let nearestVehicle = null;
    let minDistance = Infinity;

    availableVehicles.forEach(vehicle => {
        const distance = calculateDistance(originLat, originLng, vehicle.lat, vehicle.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestVehicle = vehicle;
        }
    });

    return nearestVehicle;
};

export const assignVehicleToTrip = (tripId, vehicleId) => {
    const trip = mockData.trips.find(t => t.id === tripId);
    const vehicle = mockData.vehicles.find(v => v.id === vehicleId);

    if (trip && vehicle) {
        trip.status = 'assigned';
        trip.vehicle_id = vehicleId;
        vehicle.status = 'busy'; // Or 'en_route_pickup'
        return { success: true, trip, vehicle };
    }

    return { success: false, error: 'Trip or vehicle not found' };
};
