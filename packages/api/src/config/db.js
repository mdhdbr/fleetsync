import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fleetsync';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully');
        return true;
    } catch (error) {
        console.warn('⚠️  MongoDB connection failed:', error.message);
        console.warn('⚠️  Running in MOCK DATA mode - data will not persist');
        return false;
    }
};

export default connectDB;
