import express from 'express';
import { mockData } from '../store.js';

const router = express.Router();

// GET /reports/usage - Mock aggregated data
router.get('/usage', (req, res) => {
    const { from, to } = req.query;

    // Mock data generation based on date range (ignoring actual range for simplicity)

    const usageData = {
        utilization: [
            { date: '2025-11-20', percentage: 75 },
            { date: '2025-11-21', percentage: 80 },
            { date: '2025-11-22', percentage: 85 },
            { date: '2025-11-23', percentage: 70 },
            { date: '2025-11-24', percentage: 90 },
            { date: '2025-11-25', percentage: 88 },
            { date: '2025-11-26', percentage: 92 },
        ],
        dead_km: [
            { date: '2025-11-20', km: 120 },
            { date: '2025-11-21', km: 100 },
            { date: '2025-11-22', km: 80 },
            { date: '2025-11-23', km: 150 },
            { date: '2025-11-24', km: 90 },
            { date: '2025-11-25', km: 110 },
            { date: '2025-11-26', km: 70 },
        ],
        profitability: [
            { date: '2025-11-20', revenue: 5000, cost: 3000 },
            { date: '2025-11-21', revenue: 5500, cost: 3200 },
            { date: '2025-11-22', revenue: 6000, cost: 3500 },
            { date: '2025-11-23', revenue: 4500, cost: 2800 },
            { date: '2025-11-24', revenue: 7000, cost: 4000 },
            { date: '2025-11-25', revenue: 6800, cost: 3900 },
            { date: '2025-11-26', revenue: 7500, cost: 4200 },
        ],
        hub_throughput: [
            { hub: 'Riyadh', inbound: 150, outbound: 140 },
            { hub: 'Jeddah', inbound: 200, outbound: 190 },
            { hub: 'Dammam', inbound: 120, outbound: 110 },
        ]
    };

    res.json(usageData);
});

export default router;
