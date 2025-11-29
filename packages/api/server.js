import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);


// ----------------- Mock Data -----------------

// Users for login
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'dispatcher' },
  { id: 2, username: 'driver1', password: 'driver123', role: 'driver' }
];

// Drivers
let drivers = [
  { id: 1, name: 'John Doe', vehicle: 'Bus 101', status: 'available' },
  { id: 2, name: 'Jane Smith', vehicle: 'Car 202', status: 'on-trip' },
];

// Trips
let trips = [
  { id: 1, driverId: 1, passenger: 'Alice', status: 'assigned' },
  { id: 2, driverId: 2, passenger: 'Bob', status: 'in-progress' },
];

// ----------------- Routes -----------------

// Root route
app.get('/', (req, res) => {
  res.send('🚀 FleetSync API is running!');
});

// Test API route
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'FleetSync API is working' });
});

// ----------------- Login -----------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Login failed: Invalid credentials' });
  }
  // Mock token for testing
  const token = `mock-token-${user.id}`;
  res.json({ success: true, user: { id: user.id, username: user.username, role: user.role }, token });
});

// ----------------- Drivers -----------------
app.get('/api/drivers', (req, res) => {
  res.json(drivers);
});

// ----------------- Trips -----------------
app.get('/api/trips', (req, res) => {
  res.json(trips);
});

// Complete a trip
app.post('/api/trips/:id/complete', (req, res) => {
  const tripId = parseInt(req.params.id);
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.status = 'completed';

  // Emit Socket.IO event
  io.emit('tripUpdated', trip);

  res.json({ message: 'Trip marked as completed', trip });
});

// Cancel a trip
app.post('/api/trips/:id/cancel', (req, res) => {
  const tripId = parseInt(req.params.id);
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.status = 'cancelled';

  // Emit Socket.IO event
  io.emit('tripUpdated', trip);

  res.json({ message: 'Trip cancelled', trip });
});

// ----------------- HTTP & Socket.IO -----------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ----------------- Start server -----------------
server.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log('📡 Socket.IO server ready');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free it or change PORT.`);
  }
  process.exit(1);
});
