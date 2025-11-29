import express from 'express';
import Warehouse from '../models/Warehouse.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all warehouses
router.get('/', authenticate, async (req, res) => {
    try {
        const warehouses = await Warehouse.find().lean();
        res.json(warehouses);
    } catch (error) {
        console.error('Get warehouses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single warehouse by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        res.json(warehouse);
    } catch (error) {
        console.error('Get warehouse error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create new warehouse
router.post('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const warehouse = await Warehouse.create(req.body);
        res.status(201).json(warehouse);
    } catch (error) {
        console.error('Create warehouse error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Warehouse with this code already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update warehouse
router.put('/:id', authenticate, authorize('admin', 'dispatcher'), async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        res.json(warehouse);
    } catch (error) {
        console.error('Update warehouse error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE warehouse
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        res.json({ success: true, message: 'Warehouse deleted' });
    } catch (error) {
        console.error('Delete warehouse error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
