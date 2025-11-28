import express from 'express';
import { mockData } from '../store.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET all inventory
router.get('/inventory', (req, res) => {
    res.json(mockData.inventory || []);
});

// POST /push-inbound (Simulate receiving ASN)
router.post('/push-inbound', (req, res) => {
    const { warehouseId, items } = req.body;
    // items: [{ item: "Name", qty: 10, bin: "A-1" }]

    if (!warehouseId || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid ASN data' });
    }

    const warehouse = mockData.warehouses.find(w => w.id === warehouseId);
    if (!warehouse) {
        return res.status(404).json({ error: 'Warehouse not found' });
    }

    if (!mockData.inventory) mockData.inventory = [];

    items.forEach(newItem => {
        const existingItem = mockData.inventory.find(
            i => i.warehouse_id === warehouseId && i.item === newItem.item && i.bin === newItem.bin
        );

        if (existingItem) {
            existingItem.qty += newItem.qty;
        } else {
            mockData.inventory.push({
                id: uuidv4(),
                warehouse_id: warehouseId,
                item: newItem.item,
                qty: newItem.qty,
                bin: newItem.bin || 'Unassigned'
            });
        }
    });

    // Update warehouse stock count (mock logic)
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    warehouse.current_stock += totalQty;

    res.json({ success: true, message: 'ASN received and inventory updated', inventory: mockData.inventory });
});

// GET dock bookings
router.get('/docks', (req, res) => {
    res.json(mockData.dock_bookings || []);
});

// POST /docks/book
router.post('/docks/book', (req, res) => {
    const { warehouseId, dockId, startTime, endTime, truckId } = req.body;

    if (!warehouseId || !dockId || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing booking details' });
    }

    if (!mockData.dock_bookings) mockData.dock_bookings = [];

    // Check for conflicts
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const conflict = mockData.dock_bookings.find(b => {
        if (b.warehouse_id !== warehouseId || b.dock_id !== dockId) return false;
        const bStart = new Date(b.start_time).getTime();
        const bEnd = new Date(b.end_time).getTime();
        return (start < bEnd && end > bStart); // Overlap check
    });

    if (conflict) {
        return res.status(409).json({ error: 'Dock slot already booked', conflict });
    }

    const newBooking = {
        id: uuidv4(),
        warehouse_id: warehouseId,
        dock_id: dockId,
        start_time: startTime,
        end_time: endTime,
        truck_id: truckId || 'Unknown'
    };

    mockData.dock_bookings.push(newBooking);

    res.json({ success: true, booking: newBooking });
});

export default router;
