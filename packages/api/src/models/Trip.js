import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema(
    {
        tripId: {
            type: String,
            required: true,
            unique: true,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            required: true,
        },
        origin: {
            name: String,
            address: String,
            lat: Number,
            lon: Number,
        },
        destination: {
            name: String,
            address: String,
            lat: Number,
            lon: Number,
        },
        status: {
            type: String,
            enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
            default: 'pending',
        },
        cargo: {
            description: String,
            weight: Number,
            volume: Number,
            type: String,
        },
        distance: Number, // km
        estimatedDuration: Number, // minutes
        actualDuration: Number, // minutes
        scheduledStart: Date,
        actualStart: Date,
        scheduledEnd: Date,
        actualEnd: Date,
        revenue: Number,
        expenses: Number,
        profit: Number,
        route: [
            {
                lat: Number,
                lon: Number,
                timestamp: Date,
            },
        ],
        alerts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Alert',
            },
        ],
        notes: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Trip', TripSchema);
