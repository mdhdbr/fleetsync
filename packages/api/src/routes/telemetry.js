import express from 'express';
import Alert from '../models/Alert.js';

const router = express.Router();

// In-memory time-series store (for POC - replace with real DB in production)
const telemetryStore = new Map(); // vehicleId -> array of events

// POST single telemetry event
router.post('/', async (req, res) => {
    const telemetryData = {
        ...req.body,
        receivedAt: new Date().toISOString(),
    };

    // Store telemetry
    storeTelemetryEvent(telemetryData);

    const io = req.app.get('io');

    // Check for speeding
    if (telemetryData.speed > 120) {
        const alert = await Alert.create({
            type: 'speeding',
            severity: 'high',
            title: 'Speed Limit Exceeded',
            description: `Vehicle ${telemetryData.vehicleId} exceeded speed limit: ${telemetryData.speed} km/h`,
            vehicle: telemetryData.vehicleId,
            metadata: { speed: telemetryData.speed, location: { lat: telemetryData.lat, lon: telemetryData.lng } }
        });
        io.emit('alert_new', alert);
        console.log('Alert generated:', alert);
    }

    // Emit telemetry to all connected clients via Socket.IO
    io.emit('telemetry', telemetryData);

    console.log('Telemetry received:', telemetryData);

    res.status(201).json({
        message: 'Telemetry received',
        data: telemetryData,
    });
});

// POST bulk telemetry ingest
router.post('/bulk', async (req, res) => {
    const { events } = req.body;

    if (!Array.isArray(events)) {
        return res.status(400).json({ error: 'events must be an array' });
    }

    const processedEvents = events.map(event => ({
        ...event,
        receivedAt: new Date().toISOString()
    }));

    // Store all events
    processedEvents.forEach(event => storeTelemetryEvent(event));

    const io = req.app.get('io');

    // Check for alerts in bulk
    for (const event of processedEvents) {
        if (event.speed > 120) {
            const alert = await Alert.create({
                type: 'speeding',
                severity: 'high',
                title: 'Speed Limit Exceeded',
                description: `Vehicle ${event.vehicleId} exceeded speed limit: ${event.speed} km/h`,
                vehicle: event.vehicleId,
                metadata: { speed: event.speed, location: { lat: event.lat, lon: event.lng } }
            });
            io.emit('alert_new', alert);
        }
    }

    res.status(201).json({
        message: 'Bulk telemetry received',
        count: processedEvents.length
    });
});

// GET telemetry for specific vehicle with time range
router.get('/vehicle/:vehicleId', (req, res) => {
    const { vehicleId } = req.params;
    const { from, to } = req.query;

    let events = telemetryStore.get(vehicleId) || [];

    // Filter by time range if provided
    if (from || to) {
        const fromTime = from ? new Date(from).getTime() : 0;
        const toTime = to ? new Date(to).getTime() : Date.now();

        events = events.filter(event => {
            const eventTime = new Date(event.timestamp || event.receivedAt).getTime();
            return eventTime >= fromTime && eventTime <= toTime;
        });
    }

    // Sort by timestamp
    events.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.receivedAt).getTime();
        const timeB = new Date(b.timestamp || b.receivedAt).getTime();
        return timeA - timeB;
    });

    res.json({
        vehicleId,
        count: events.length,
        events
    });
});

// Helper function to store telemetry event
function storeTelemetryEvent(event) {
    const vehicleId = event.vehicleId || event.vehicle_id;
    if (!vehicleId) return;

    if (!telemetryStore.has(vehicleId)) {
        telemetryStore.set(vehicleId, []);
    }

    const vehicleEvents = telemetryStore.get(vehicleId);
    vehicleEvents.push(event);

    // Keep only last 10000 events per vehicle (memory management)
    if (vehicleEvents.length > 10000) {
        vehicleEvents.shift();
    }
}

// GET telemetry stats
router.get('/stats', (req, res) => {
    const stats = {
        totalVehicles: telemetryStore.size,
        totalEvents: Array.from(telemetryStore.values()).reduce((sum, events) => sum + events.length, 0),
        vehicleStats: {}
    };

    telemetryStore.forEach((events, vehicleId) => {
        stats.vehicleStats[vehicleId] = {
            eventCount: events.length,
            latestEvent: events[events.length - 1]
        };
    });

    res.json(stats);
});

export default router;
