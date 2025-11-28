import express from 'express';
import { mockData } from '../store.js';

const router = express.Router();

// GET all vehicles
router.get('/', (req, res) => {
    res.json(mockData.vehicles);
});

// POST record break for a vehicle/driver
router.post('/:vehicleId/record-break', (req, res) => {
    const { vehicleId } = req.params;
    const { driver, hours_worked } = req.body;

    const vehicle = mockData.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Reset driver hours
    vehicle.driver_hours_today = 0;

    res.json({
        success: true,
        message: `Break recorded for ${driver}. Driver hours reset to 0.`,
        vehicle: vehicle
    });
});

export default router;
