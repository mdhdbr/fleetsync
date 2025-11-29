import express from 'express';
import Alert from '../models/Alert.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all alerts (with optional filtering)
router.get('/', authenticate, async (req, res) => {
    try {
        const { status, severity, type } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (severity) filter.severity = severity;
        if (type) filter.type = type;

        const alerts = await Alert.find(filter)
            .populate('vehicle')
            .populate('driver')
            .populate('trip')
            .sort({ createdAt: -1 })
            .lean();

        res.json(alerts);
    } catch (error) {
        console.error('Get alerts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST acknowledge alert
router.post('/acknowledge', authenticate, async (req, res) => {
    try {
        const { alertId } = req.body;

        const alert = await Alert.findById(alertId);
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        alert.status = 'acknowledged';
        alert.acknowledgedBy = req.user.id;
        alert.acknowledgedAt = new Date();
        await alert.save();

        res.json({ success: true, alert });
    } catch (error) {
        console.error('Acknowledge alert error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST resolve alert
router.post('/resolve', authenticate, authorize('admin', 'dispatcher'), async (req, res) => {
    try {
        const { alertId } = req.body;

        const alert = await Alert.findById(alertId);
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        alert.status = 'resolved';
        alert.resolvedBy = req.user.id;
        alert.resolvedAt = new Date();
        await alert.save();

        res.json({ success: true, alert });
    } catch (error) {
        console.error('Resolve alert error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create alert (for simulation or manual creation)
router.post('/simulate', authenticate, async (req, res) => {
    try {
        const alert = await Alert.create(req.body);

        // Notify via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.emit('alert_new', alert);
        }

        res.status(201).json(alert);
    } catch (error) {
        console.error('Create alert error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Alert thresholds (stored in-memory for now, could be moved to DB)
let alertThresholds = {
    speedLimit: 120,
    driverHoursLimit: 10,
    fuelLowThreshold: 20,
    engineTempHigh: 110,
    routeDeviationKm: 5,
};

// GET alert thresholds
router.get('/thresholds', authenticate, (req, res) => {
    res.json(alertThresholds);
});

// POST update alert thresholds
router.post('/thresholds', authenticate, authorize('admin'), (req, res) => {
    alertThresholds = {
        ...alertThresholds,
        ...req.body,
    };
    res.json({ success: true, thresholds: alertThresholds });
});

export default router;
