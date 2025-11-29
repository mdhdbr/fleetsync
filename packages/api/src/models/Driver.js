import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true,
        },
        licenseExpiry: {
            type: Date,
            required: true,
        },
        licenseClass: String,
        dateOfBirth: Date,
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        emergencyContact: {
            name: String,
            phone: String,
            relationship: String,
        },
        assignedVehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
        },
        status: {
            type: String,
            enum: ['available', 'on_trip', 'off_duty', 'on_break'],
            default: 'available',
        },
        hoursWorked: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 5,
        },
        totalTrips: {
            type: Number,
            default: 0,
        },
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

export default mongoose.model('Driver', DriverSchema);
