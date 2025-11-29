import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['speeding', 'fatigue', 'maintenance', 'fuel', 'geofence', 'accident', 'other'],
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
        },
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip',
        },
        location: {
            lat: Number,
            lon: Number,
            address: String,
        },
        status: {
            type: String,
            enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
            default: 'active',
        },
        acknowledgedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        acknowledgedAt: Date,
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        resolvedAt: Date,
        metadata: mongoose.Schema.Types.Mixed,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Alert', AlertSchema);
