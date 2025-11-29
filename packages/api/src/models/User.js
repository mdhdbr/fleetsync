import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'dispatcher', 'driver'],
            default: 'driver',
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', UserSchema);
