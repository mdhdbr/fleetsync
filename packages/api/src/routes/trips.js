import express from 'express';
import { mockData } from '../store.js';
import { findNearestVehicle, assignVehicleToTrip } from '../utils/assignment.js';

const router = express.Router();

// GET all trips
router.get('/', (req, res) => {
    res.json(mockData.trips);
});

// POST create new trip
router.post('/', (req, res) => {
    const { type, origin, destination, passengers, addons } = req.body;

    const newTrip = {
        id: `trip_${Date.now()}`,
        type: type || 'ride',
        origin,
        destination,
        passengers: passengers || 1,
        addons: addons || [],
        status: 'pending',
        created_at: new Date().toISOString()
    };

    mockData.trips.push(newTrip);

    // Notify clients about new trip
    const io = req.app.get('io');
    if (io) {
        io.emit('trip_update', { type: 'new', trip: newTrip });
    }

    res.status(201).json(newTrip);
});

// POST auto-assign vehicle to trip
router.post('/:id/assign', (req, res) => {
    const { id } = req.params;
    const trip = mockData.trips.find(t => t.id === id);

    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'pending') {
        return res.status(400).json({ message: 'Trip is not pending' });
    }

    const nearestVehicle = findNearestVehicle(trip.origin.lat, trip.origin.lng, trip.type === 'ride' ? 'sedan' : 'truck');

    if (!nearestVehicle) {
        return res.status(404).json({ message: 'No available vehicles found' });
    }

    const result = assignVehicleToTrip(id, nearestVehicle.id);

    if (result.success) {
        const io = req.app.get('io');
        if (io) {
            io.emit('trip_update', { type: 'update', trip: result.trip });
            io.emit('vehicle_update', { type: 'update', vehicle: result.vehicle });
        }
        res.json({ message: 'Vehicle assigned successfully', trip: result.trip, vehicle: result.vehicle });
    } else {
        res.status(500).json({ message: result.error });
    }
});

// PATCH mark trip as completed (COA)
router.patch('/:id/complete', (req, res) => {
    const { id } = req.params;
    const trip = mockData.trips.find(t => t.id === id);

    if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
    }

    trip.status = 'completed';
    trip.completed_at = new Date().toISOString();

    // Free up the vehicle
    const io = req.app.get('io');
    if (trip.vehicle_id) {
        const vehicle = mockData.vehicles.find(v => v.id === trip.vehicle_id);
        if (vehicle) {
            vehicle.status = 'empty';
            if (io) {
                io.emit('vehicle_update', { type: 'update', vehicle });
            }
        }
    }

    if (io) {
        io.emit('trip_update', { type: 'update', trip });
    }

    res.json({ message: 'Trip completed', trip });
});

export default router;
