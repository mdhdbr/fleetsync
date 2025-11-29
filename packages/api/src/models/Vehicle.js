import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema(
    {
        registration: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['truck', 'van', 'flatbed', 'reefer', 'tanker', 'pickup'],
        },
        make: String,
        model: String,
        year: Number,
        capacity: {
            weight: Number, // kg
            volume: Number, // m³
        },
        status: {
            type: String,
            enum: ['active', 'maintenance', 'idle', 'out_of_service'],
            default: 'idle',
        },
        currentLocation: {
            lat: Number,
            lon: Number,
            address: String,
            timestamp: Date,
        },
        assignedDriver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
        },
        fuelLevel: {
            type: Number,
            min: 0,
            max: 100,
        },
        odometer: Number, // km
        lastMaintenance: Date,
        nextMaintenanceDue: Date,
        documents: [
            {
                type: String,
                url: String,
                expiryDate: Date,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Vehicle', VehicleSchema);
