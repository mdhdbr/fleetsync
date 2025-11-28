import express from 'express';
import { mockData } from '../store.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const uploadsDir = join(__dirname, '../../uploads');
if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// GET all shipments
router.get('/', (req, res) => {
    res.json(mockData.shipments || []);
});

// GET shipment by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const shipment = mockData.shipments.find(s => s.id === id);

    if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json(shipment);
});

// POST create new shipment with document uploads
router.post('/', upload.fields([
    { name: 'pod', maxCount: 1 },
    { name: 'bol', maxCount: 1 }
]), (req, res) => {
    const {
        shipment_type,
        vehicle_type,
        goods_description,
        weight,
        weight_unit,
        volume,
        volume_unit,
        pickup_location,
        delivery_location,
        pickup_window_start,
        pickup_window_end,
        delivery_window_start,
        delivery_window_end
    } = req.body;

    // Parse JSON strings for location data
    const pickup = JSON.parse(pickup_location);
    const delivery = JSON.parse(delivery_location);

    const newShipment = {
        id: `ship_${Date.now()}`,
        shipment_type: shipment_type || 'LTL',
        vehicle_type: vehicle_type || 'flatbed',
        goods_description,
        weight: parseFloat(weight),
        weight_unit: weight_unit || 'kg',
        volume: parseFloat(volume),
        volume_unit: volume_unit || 'm3',
        pickup: pickup,
        delivery: delivery,
        pickup_window: {
            start: pickup_window_start,
            end: pickup_window_end
        },
        delivery_window: {
            start: delivery_window_start,
            end: delivery_window_end
        },
        status: 'pending',
        created_at: new Date().toISOString(),
        documents: {}
    };

    // Add document URLs if uploaded
    if (req.files) {
        if (req.files.pod) {
            newShipment.documents.pod = `/uploads/${req.files.pod[0].filename}`;
        }
        if (req.files.bol) {
            newShipment.documents.bol = `/uploads/${req.files.bol[0].filename}`;
        }
    }

    mockData.shipments.push(newShipment);

    // Notify clients about new shipment
    const io = req.app.get('io');
    if (io) {
        io.emit('shipment_update', { type: 'new', shipment: newShipment });
    }

    res.status(201).json(newShipment);
});

export default router;
