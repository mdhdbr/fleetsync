import express from 'express';
import { mockData } from '../store.js';

const router = express.Router();

// GET all warehouses
router.get('/', (req, res) => {
    res.json(mockData.warehouses);
});

export default router;
