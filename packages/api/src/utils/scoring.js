import { mockData } from '../store.js';

// Calculate distance between two points using Haversine formula (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

// Check if vehicle is eligible for next assignment
export const checkVehicleEligibility = (vehicle) => {
    const issues = [];

    // Check driver hours (assuming 8 hour shift, mock data)
    if (vehicle.driver_hours_today >= 8) {
        issues.push('Driver has exceeded maximum hours (8h)');
    }

    // Check fuel level
    if (vehicle.fuel_level && vehicle.fuel_level < 20) {
        issues.push('Fuel level below 20%');
    }

    // Check maintenance flag
    if (vehicle.needs_maintenance) {
        issues.push('Vehicle requires maintenance');
    }

    // Check if vehicle is available
    if (vehicle.status !== 'empty') {
        issues.push('Vehicle is not available (status: ' + vehicle.status + ')');
    }

    return {
        eligible: issues.length === 0,
        issues: issues
    };
};

// Find pending jobs within radius (km)
export const findJobsInRadius = (vehicleLat, vehicleLng, radiusKm = 20) => {
    const pendingJobs = mockData.trips.filter(trip => trip.status === 'pending');

    const jobsInRadius = pendingJobs.filter(job => {
        const distance = calculateDistance(vehicleLat, vehicleLng, job.origin.lat, job.origin.lng);
        return distance <= radiusKm;
    }).map(job => {
        const distance = calculateDistance(vehicleLat, vehicleLng, job.origin.lat, job.origin.lng);
        return { ...job, distance_to_pickup: distance };
    });

    return jobsInRadius;
};

// Calculate reposition cost based on distance
export const calculateRepositionCost = (distanceKm) => {
    const costPerKm = 2.5; // SAR per km
    const baseCost = 10; // SAR base cost
    return baseCost + (distanceKm * costPerKm);
};

// Calculate job revenue (mock calculation)
const calculateJobRevenue = (job) => {
    // Calculate trip distance
    const tripDistance = calculateDistance(
        job.origin.lat,
        job.origin.lng,
        job.destination.lat,
        job.destination.lng
    );

    const baseRate = 15; // SAR base fare
    const ratePerKm = 5; // SAR per km
    const passengerMultiplier = job.passengers || 1;

    // Add addon premiums
    let addonPremium = 0;
    if (job.addons && job.addons.length > 0) {
        addonPremium = job.addons.length * 10; // 10 SAR per addon
    }

    return baseRate + (tripDistance * ratePerKm * passengerMultiplier) + addonPremium;
};

// Calculate profitability score for a job
export const calculateProfitability = (job, vehicleLat, vehicleLng) => {
    const revenue = calculateJobRevenue(job);
    const repositionCost = calculateRepositionCost(job.distance_to_pickup);
    const profitability = revenue - repositionCost;

    return {
        job_id: job.id,
        revenue: revenue.toFixed(2),
        reposition_cost: repositionCost.toFixed(2),
        profitability: profitability.toFixed(2),
        distance_to_pickup: job.distance_to_pickup.toFixed(2)
    };
};

// Score and rank jobs by profitability
export const scoreJobs = (jobs, vehicleLat, vehicleLng) => {
    const scoredJobs = jobs.map(job => {
        const score = calculateProfitability(job, vehicleLat, vehicleLng);
        return {
            job: job,
            score: score
        };
    });

    // Sort by profitability (highest first)
    scoredJobs.sort((a, b) => parseFloat(b.score.profitability) - parseFloat(a.score.profitability));

    return scoredJobs;
};
