import express from 'express';
import { mockData } from '../store.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /alerts - Get active alerts
router.get('/', (req, res) => {
    // Filter for active alerts (or all if needed)
    const activeAlerts = mockData.alerts.filter(a => a.status === 'active');
    res.json(activeAlerts);
});

// POST /alerts/acknowledge - Acknowledge an alert
router.post('/acknowledge', (req, res) => {
    const { alertId, userId } = req.body;

    const alert = mockData.alerts.find(a => a.id === alertId);
    if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
    }

    alert.status = 'acknowledged';
    alert.acknowledged_by = userId || 'system';
    alert.acknowledged_at = new Date().toISOString();

    res.json({ success: true, alert });
});

// Helper to create alert (internal use mostly, but exposed for simulation)
export const createAlert = (type, severity, message, vehicleId, metadata = {}) => {
    const newAlert = {
        id: uuidv4(),
        type, // speeding, fatigue, route_deviation, temp_breach
        severity, // low, medium, high, critical
        message,
        vehicle_id: vehicleId,
        status: 'active',
        created_at: new Date().toISOString(),
        metadata
    };

    if (!mockData.alerts) mockData.alerts = [];
    mockData.alerts.push(newAlert);
    return newAlert;
};

// POST /alerts/simulate - Simulate an alert
router.post('/simulate', (req, res) => {
    const { type, severity, message, vehicleId } = req.body;
    const alert = createAlert(type, severity, message, vehicleId);

    // Notify via Socket.IO
    const io = req.app.get('io');
    if (io) {
        io.emit('alert_new', alert);
    }

    res.json(alert);
});

// Alert thresholds (in-memory for POC)
let alertThresholds = {
    speedLimit: 120,
    driverHoursLimit: 10,
    fuelLowThreshold: 20,
    engineTempHigh: 110,
    routeDeviationKm: 5
};

// GET alert thresholds
router.get('/thresholds', (req, res) => {
    res.json(alertThresholds);
});

// POST update alert thresholds
router.post('/thresholds', (req, res) => {
    alertThresholds = {
        ...alertThresholds,
        ...req.body
    };
    res.json({ success: true, thresholds: alertThresholds });
});

export default router;
