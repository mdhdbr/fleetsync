import express from 'express';
import { mockData } from '../store.js';
import {
    checkVehicleEligibility,
    findJobsInRadius,
    scoreJobs
} from '../utils/scoring.js';

const router = express.Router();

// GET /allocation/assign_next - Auto-assign next job to vehicle after COA
router.get('/assign_next', (req, res) => {
    const { vehicle_id } = req.query;

    if (!vehicle_id) {
        return res.status(400).json({
            error: 'vehicle_id is required',
            message: 'Please provide vehicle_id as query parameter'
        });
    }

    // Find vehicle
    const vehicle = mockData.vehicles.find(v => v.id === vehicle_id);
    if (!vehicle) {
        return res.status(404).json({
            error: 'Vehicle not found',
            message: `No vehicle found with id: ${vehicle_id}`
        });
    }

    // Step 0: Check for driver fatigue (hours > 10)
    if (vehicle.driver_hours_today && vehicle.driver_hours_today > 10) {
        return res.json({
            status: 'fatigue_break_required',
            vehicle_id: vehicle_id,
            driver: vehicle.driver,
            hours_worked: vehicle.driver_hours_today,
            message: 'Driver has exceeded 10 hours. Break required before next assignment.',
            requires_acknowledgment: true
        });
    }

    // Step 1: Check vehicle eligibility
    const eligibility = checkVehicleEligibility(vehicle);
    if (!eligibility.eligible) {
        return res.json({
            status: 'ineligible',
            vehicle_id: vehicle_id,
            issues: eligibility.issues,
            message: 'Vehicle is not eligible for assignment'
        });
    }

    // Step 2: Find pending jobs within radius (20km)
    const jobsInRadius = findJobsInRadius(vehicle.lat, vehicle.lng, 20);

    if (jobsInRadius.length === 0) {
        return res.json({
            status: 'no_jobs',
            vehicle_id: vehicle_id,
            message: 'No pending jobs found within 20km radius',
            vehicle_location: {
                lat: vehicle.lat,
                lng: vehicle.lng
            }
        });
    }

    // Step 3: Score jobs by profitability
    const scoredJobs = scoreJobs(jobsInRadius, vehicle.lat, vehicle.lng);
    const bestJob = scoredJobs[0];

    // Step 4: Return best job assignment
    return res.json({
        status: 'job_assigned',
        vehicle_id: vehicle_id,
        assignment: {
            job_id: bestJob.job.id,
            job_type: bestJob.job.type,
            origin: bestJob.job.origin,
            destination: bestJob.job.destination,
            passengers: bestJob.job.passengers,
            score: {
                profitability: parseFloat(bestJob.score.profitability),
                revenue: parseFloat(bestJob.score.revenue),
                reposition_cost: parseFloat(bestJob.score.reposition_cost),
                distance_to_pickup_km: parseFloat(bestJob.score.distance_to_pickup)
            },
            rationale: `Best profitability score of ${bestJob.score.profitability} SAR. ` +
                `Revenue: ${bestJob.score.revenue} SAR, ` +
                `Reposition cost: ${bestJob.score.reposition_cost} SAR, ` +
                `Distance to pickup: ${bestJob.score.distance_to_pickup} km`
        },
        alternatives_count: scoredJobs.length - 1
    });
});

export default router;
