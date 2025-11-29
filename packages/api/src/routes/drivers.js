import express from 'express';
import Driver from '../models/Driver.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find()
            .populate('userId', 'name email role')
            .populate('assignedVehicle', 'make model licensePlate');

        // Transform data to flatten structure for frontend
        const formattedDrivers = drivers.map(driver => ({
            id: driver._id,
            userId: driver.userId?._id,
            name: driver.userId?.name || 'Unknown',
            email: driver.userId?.email || 'Unknown',
            licenseNumber: driver.licenseNumber,
            status: driver.status,
            assignedVehicle: driver.assignedVehicle ? `${driver.assignedVehicle.make} ${driver.assignedVehicle.model} (${driver.assignedVehicle.licensePlate})` : null,
            phone: driver.emergencyContact?.phone || 'N/A',
            rating: driver.rating,
            totalTrips: driver.totalTrips
        }));

        res.json(formattedDrivers);
    } catch (error) {
        console.warn('⚠️ MongoDB unavailable, returning mock drivers');
        const MOCK_DRIVERS = [
            { id: 'd1', name: 'Ahmed Al-Sayed', email: 'ahmed@fleetsync.com', licenseNumber: 'DL-1001', status: 'available', assignedVehicle: 'Toyota Hilux (KSA-1234)', phone: '+966 50 123 4567', rating: 4.8, totalTrips: 150 },
            { id: 'd2', name: 'Mohammed Ali', email: 'mohammed@fleetsync.com', licenseNumber: 'DL-1002', status: 'on_trip', assignedVehicle: 'Mercedes Actros (KSA-5678)', phone: '+966 55 987 6543', rating: 4.9, totalTrips: 320 },
            { id: 'd3', name: 'Khalid Omar', email: 'khalid@fleetsync.com', licenseNumber: 'DL-1003', status: 'off_duty', assignedVehicle: null, phone: '+966 54 555 1212', rating: 4.5, totalTrips: 85 },
            { id: 'd4', name: 'Fahad Salem', email: 'fahad@fleetsync.com', licenseNumber: 'DL-1004', status: 'on_break', assignedVehicle: 'Isuzu N-Series (KSA-9012)', phone: '+966 56 444 3333', rating: 4.7, totalTrips: 210 },
        ];
        res.json(MOCK_DRIVERS);
    }
});

// GET driver by ID
router.get('/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id)
            .populate('userId', 'name email role')
            .populate('assignedVehicle');

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
