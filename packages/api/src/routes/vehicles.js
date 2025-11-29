import express from 'express';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all vehicles
router.get('/', authenticate, async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('assignedDriver').lean();
        res.json(vehicles);
    } catch (error) {
        console.warn('⚠️ MongoDB unavailable, returning mock vehicles');
        const MOCK_VEHICLES = [
            { _id: 'v1', id: 'v1', make: 'Toyota', model: 'Hilux', year: 2023, type: 'Pickup', licensePlate: 'KSA-1234', status: 'active', location: { lat: 24.7136, lng: 46.6753 } },
            { _id: 'v2', id: 'v2', make: 'Mercedes', model: 'Actros', year: 2022, type: 'Truck', licensePlate: 'KSA-5678', status: 'active', location: { lat: 21.4858, lng: 39.1925 } },
            { _id: 'v3', id: 'v3', make: 'Isuzu', model: 'N-Series', year: 2021, type: 'Van', licensePlate: 'KSA-9012', status: 'maintenance', location: { lat: 26.4207, lng: 50.0888 } },
            { _id: 'v4', id: 'v4', make: 'Volvo', model: 'FH16', year: 2024, type: 'Truck', licensePlate: 'KSA-3456', status: 'out_of_service', location: { lat: 24.7136, lng: 46.6753 } },
            { _id: 'v5', id: 'v5', make: 'Hyundai', model: 'H-1', year: 2020, type: 'Van', licensePlate: 'KSA-7890', status: 'idle', location: { lat: 21.4858, lng: 39.1925 } },
        ];
        res.json(MOCK_VEHICLES);
    }
});

// GET single vehicle by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('assignedDriver');
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        console.error('Get vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create new vehicle
router.post('/', authenticate, authorize('admin', 'dispatcher'), async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Create vehicle error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Vehicle with this registration already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update vehicle
router.put('/:id', authenticate, authorize('admin', 'dispatcher'), async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE vehicle
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ success: true, message: 'Vehicle deleted' });
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST record break for a driver (reset hours)
router.post('/:vehicleId/record-break', authenticate, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.vehicleId).populate('assignedDriver');
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        if (!vehicle.assignedDriver) {
            return res.status(400).json({ error: 'No driver assigned to this vehicle' });
        }

        // Reset driver hours
        const driver = await Driver.findById(vehicle.assignedDriver._id);
        driver.hoursWorked = 0;
        driver.status = 'available';
        await driver.save();

        res.json({
            success: true,
            message: `Break recorded. Driver hours reset to 0.`,
            vehicle,
            driver,
        });
    } catch (error) {
        console.error('Record break error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
