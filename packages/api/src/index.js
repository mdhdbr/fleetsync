import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import telemetryRoutes from './routes/telemetry.js';
import vehicleRoutes from './routes/vehicles.js';
import warehouseRoutes from './routes/warehouses.js';
import allocationRoutes from './routes/allocation.js';
import shipmentRoutes from './routes/shipments.js';
import wmsRoutes from './routes/wms.js';
import alertRoutes from './routes/alerts.js';
import reportRoutes from './routes/reports.js';
import docsRoutes from './routes/docs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(join(__dirname, '../uploads')));

import { mockData } from './store.js';

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io available to routes
app.set('io', io);

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/trips', tripRoutes);
app.use('/telemetry', telemetryRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/warehouses', warehouseRoutes);
app.use('/allocation', allocationRoutes);
app.use('/shipments', shipmentRoutes);
app.use('/wms', wmsRoutes);
app.use('/alerts', alertRoutes);
app.use('/reports', reportRoutes);
app.use('/api/docs', docsRoutes);

// Telemetry events endpoint
app.get('/telemetry-events', (req, res) => {
    res.json(mockData.telemetry_events || []);
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO server ready`);
});
