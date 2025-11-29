import express from 'express';
import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all trips
router.get('/', authenticate, async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('vehicle')
            .populate('driver')
            .sort({ createdAt: -1 })
            .lean();
        res.json(trips);
    } catch (error) {
        console.error('Get trips error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single trip by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver');
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        console.error('Get trip error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create new trip
router.post('/', authenticate, authorize('admin', 'dispatcher'), async (req, res) => {
    try {
        const tripId = `TRIP-${Date.now()}`;
        const trip = await Trip.create({ ...req.body, tripId });

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('trip_update', { type: 'new', trip });
        }

        res.status(201).json(trip);
    } catch (error) {
        console.error('Create trip error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update trip
router.put('/:id', authenticate, authorize('admin', 'dispatcher'), async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('trip_update', { type: 'update', trip });
        }

        res.json(trip);
    } catch (error) {
        console.error('Update trip error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH mark trip as completed (COA)
router.patch('/:id/complete', authenticate, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver');
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        trip.status = 'completed';
        trip.actualEnd = new Date();
        trip.actualDuration = trip.actualStart
            ? Math.floor((trip.actualEnd - trip.actualStart) / 60000)
            : null;
        await trip.save();

        // Free up the vehicle and driver
        if (trip.vehicle) {
            const vehicle = await Vehicle.findById(trip.vehicle._id);
            vehicle.status = 'idle';
            await vehicle.save();
        }

        if (trip.driver) {
            const driver = await Driver.findById(trip.driver._id);
            driver.status = 'available';
            driver.totalTrips += 1;
            await driver.save();
        }

        // Emit socket events
        const io = req.app.get('io');
        if (io) {
            io.emit('trip_update', { type: 'update', trip });
        }

        res.json({ message: 'Trip completed', trip });
    } catch (error) {
        console.error('Complete trip error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
