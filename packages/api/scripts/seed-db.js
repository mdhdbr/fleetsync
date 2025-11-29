import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';
import Vehicle from '../src/models/Vehicle.js';
import Driver from '../src/models/Driver.js';
import Trip from '../src/models/Trip.js';
import Alert from '../src/models/Alert.js';
import Warehouse from '../src/models/Warehouse.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Driver.deleteMany({});
        await Trip.deleteMany({});
        await Alert.deleteMany({});
        await Warehouse.deleteMany({});

        console.log('👤 Creating users...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@fleetsync.com',
            phone: '+966501234567',
            password: hashedPassword,
            role: 'admin',
        });

        const dispatcherUser = await User.create({
            name: 'Dispatcher Ali',
            email: 'dispatcher@fleetsync.com',
            phone: '+966501234568',
            password: hashedPassword,
            role: 'dispatcher',
        });

        const driverUser1 = await User.create({
            name: 'Driver Ahmed',
            email: 'ahmed@fleetsync.com',
            phone: '+966501234569',
            password: hashedPassword,
            role: 'driver',
        });

        const driverUser2 = await User.create({
            name: 'Driver Mohammed',
            email: 'mohammed@fleetsync.com',
            phone: '+966501234570',
            password: hashedPassword,
            role: 'driver',
        });

        console.log('🚗 Creating vehicles...');
        const vehicle1 = await Vehicle.create({
            registration: 'RYD-1234',
            type: 'truck',
            make: 'Volvo',
            model: 'FH16',
            year: 2022,
            capacity: { weight: 25000, volume: 80 },
            status: 'idle',
            fuelLevel: 75,
            odometer: 45000,
            currentLocation: { lat: 24.7136, lon: 46.6753, address: 'Riyadh, Saudi Arabia' },
        });

        const vehicle2 = await Vehicle.create({
            registration: 'JED-5678',
            type: 'van',
            make: 'Mercedes',
            model: 'Sprinter',
            year: 2023,
            capacity: { weight: 3500, volume: 15 },
            status: 'idle',
            fuelLevel: 60,
            odometer: 12000,
            currentLocation: { lat: 21.5433, lon: 39.1728, address: 'Jeddah, Saudi Arabia' },
        });

        console.log('👨‍✈️ Creating drivers...');
        const driver1 = await Driver.create({
            userId: driverUser1._id,
            licenseNumber: 'DL-123456',
            licenseExpiry: new Date('2026-12-31'),
            licenseClass: 'C',
            status: 'available',
            hoursWorked: 6,
            rating: 4.8,
        });

        const driver2 = await Driver.create({
            userId: driverUser2._id,
            licenseNumber: 'DL-789012',
            licenseExpiry: new Date('2027-06-30'),
            licenseClass: 'C',
            status: 'available',
            hoursWorked: 3,
            rating: 4.9,
        });

        // Assign drivers to vehicles
        vehicle1.assignedDriver = driver1._id;
        await vehicle1.save();
        driver1.assignedVehicle = vehicle1._id;
        await driver1.save();

        vehicle2.assignedDriver = driver2._id;
        await vehicle2.save();
        driver2.assignedVehicle = vehicle2._id;
        await driver2.save();

        console.log('📦 Creating warehouses...');
        await Warehouse.create({
            name: 'Riyadh Distribution Center',
            code: 'RYD-DC-01',
            type: 'distribution',
            address: {
                street: 'King Fahd Road',
                city: 'Riyadh',
                state: 'Riyadh Province',
                zipCode: '11564',
                country: 'Saudi Arabia',
            },
            location: { lat: 24.7136, lon: 46.6753 },
            capacity: { total: 50000, available: 32000 },
            status: 'active',
        });

        await Warehouse.create({
            name: 'Jeddah Port Warehouse',
            code: 'JED-PW-01',
            type: 'storage',
            address: {
                street: 'Port Road',
                city: 'Jeddah',
                state: 'Makkah Province',
                zipCode: '21589',
                country: 'Saudi Arabia',
            },
            location: { lat: 21.5433, lon: 39.1728 },
            capacity: { total: 75000, available: 45000 },
            status: 'active',
        });

        console.log('🚚 Creating trips...');
        const trip1 = await Trip.create({
            tripId: 'TRIP-001',
            vehicle: vehicle1._id,
            driver: driver1._id,
            origin: {
                name: 'Riyadh Distribution Center',
                address: 'King Fahd Road, Riyadh',
                lat: 24.7136,
                lon: 46.6753,
            },
            destination: {
                name: 'Dammam Warehouse',
                address: 'Industrial Area, Dammam',
                lat: 26.4207,
                lon: 50.0888,
            },
            status: 'in_progress',
            cargo: {
                description: 'Electronics',
                weight: 15000,
                volume: 50,
                type: 'general',
            },
            distance: 395,
            estimatedDuration: 240,
            scheduledStart: new Date(),
            actualStart: new Date(),
            revenue: 5000,
            expenses: 1200,
            profit: 3800,
        });

        console.log('🚨 Creating alerts...');
        await Alert.create({
            type: 'speeding',
            severity: 'high',
            title: 'Speed Limit Exceeded',
            description: 'Vehicle RYD-1234 exceeded speed limit of 120 km/h',
            vehicle: vehicle1._id,
            driver: driver1._id,
            trip: trip1._id,
            location: { lat: 25.2854, lon: 48.3456, address: 'Highway 40, near Hofuf' },
            status: 'active',
        });

        await Alert.create({
            type: 'fatigue',
            severity: 'critical',
            title: 'Driver Fatigue Warning',
            description: 'Driver has worked 6 hours without break',
            vehicle: vehicle1._id,
            driver: driver1._id,
            status: 'active',
        });

        console.log('✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${await User.countDocuments()}`);
        console.log(`   Vehicles: ${await Vehicle.countDocuments()}`);
        console.log(`   Drivers: ${await Driver.countDocuments()}`);
        console.log(`   Trips: ${await Trip.countDocuments()}`);
        console.log(`   Alerts: ${await Alert.countDocuments()}`);
        console.log(`   Warehouses: ${await Warehouse.countDocuments()}`);
        console.log('\n🔑 Login Credentials:');
        console.log('   Admin: admin@fleetsync.com / password123');
        console.log('   Dispatcher: dispatcher@fleetsync.com / password123');
        console.log('   Driver: ahmed@fleetsync.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
