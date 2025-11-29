import mongoose from 'mongoose';

const WarehouseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        type: {
            type: String,
            enum: ['distribution', 'storage', 'cross_dock', 'cold_storage'],
            default: 'distribution',
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        location: {
            lat: Number,
            lon: Number,
        },
        capacity: {
            total: Number, // m³
            available: Number, // m³
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'maintenance'],
            default: 'active',
        },
        operatingHours: {
            weekdays: {
                open: String,
                close: String,
            },
            weekends: {
                open: String,
                close: String,
            },
        },
        manager: {
            name: String,
            phone: String,
            email: String,
        },
        zones: [
            {
                name: String,
                capacity: Number,
                currentLoad: Number,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Warehouse', WarehouseSchema);
