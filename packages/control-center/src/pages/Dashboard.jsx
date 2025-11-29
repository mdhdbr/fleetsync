import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MapView from '../components/MapView';
import TimelineSlider from '../components/TimelineSlider';
import TripCreateModal from '../components/TripCreateModal';
import DispatcherJobQueue from '../components/DispatcherJobQueue';
import BookTruckModal from '../components/BookTruckModal';
import AlertsWidget from '../components/AlertsWidget';
import Layout from '../components/Layout';

const Dashboard = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [telemetryEvents, setTelemetryEvents] = useState([]);
    const [trips, setTrips] = useState([]);
    const [currentTime, setCurrentTime] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBookTruckModalOpen, setIsBookTruckModalOpen] = useState(false);
    const [stats, setStats] = useState({
        activeVehicles: 0,
        tripsToday: 0,
        activeAlerts: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        // Fetch initial data
        fetchVehicles();
        fetchWarehouses();
        fetchTelemetryEvents();
        fetchTrips();

        // Setup Socket.IO for real-time updates
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');

        socket.on('telemetry', (data) => {
            console.log('Telemetry update:', data);
        });

        socket.on('trip_update', (data) => {
            console.log('Trip update:', data);
            fetchTrips();
            fetchVehicles();
        });

        socket.on('vehicle_update', (data) => {
            console.log('Vehicle update:', data);
            fetchVehicles();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        // Calculate stats when data changes
        const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
        const tripsToday = trips.filter((t) => {
            const today = new Date().toDateString();
            const tripDate = new Date(t.createdAt).toDateString();
            return today === tripDate;
        }).length;
        const totalRevenue = trips.reduce((sum, t) => sum + (t.revenue || 0), 0);

        setStats({
            activeVehicles,
            tripsToday,
            activeAlerts: 0, // Will be updated when alerts are fetched
            totalRevenue,
        });
    }, [vehicles, trips]);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/vehicles`
            );
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/warehouses`
            );
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchTelemetryEvents = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/telemetry-events`
            );
            setTelemetryEvents(response.data);
        } catch (error) {
            console.error('Error fetching telemetry events:', error);
        }
    };

    const fetchTrips = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/trips`
            );
            setTrips(response.data);
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    };

    return (
        <Layout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-600 mt-1">Welcome back! Here's your fleet overview.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
                        >
                            <span>➕</span> Create Trip
                        </button>
                        <button
                            onClick={() => setIsBookTruckModalOpen(true)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center gap-2"
                        >
                            <span>🚛</span> Book Truck
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Active Vehicles</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    {stats.activeVehicles}
                                </p>
                                <p className="text-xs text-green-600 mt-1">● Online</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-md">
                                🚗
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Trips Today</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.tripsToday}</p>
                                <p className="text-xs text-blue-600 mt-1">↑ Active</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-2xl shadow-md">
                                📦
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Active Alerts</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    {stats.activeAlerts}
                                </p>
                                <p className="text-xs text-orange-600 mt-1">⚠ Monitoring</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-2xl shadow-md">
                                🚨
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    SAR {stats.totalRevenue.toLocaleString()}
                                </p>
                                <p className="text-xs text-green-600 mt-1">↑ Growing</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-2xl shadow-md">
                                💰
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Fleet Status Pie Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Fleet Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Active', value: vehicles.filter(v => v.status === 'active').length, color: '#10b981' },
                                        { name: 'Idle', value: vehicles.filter(v => v.status === 'idle').length, color: '#3b82f6' },
                                        { name: 'Maintenance', value: vehicles.filter(v => v.status === 'maintenance').length, color: '#f59e0b' },
                                        { name: 'Out of Service', value: vehicles.filter(v => v.status === 'out_of_service').length, color: '#ef4444' },
                                    ].filter(item => item.value > 0)}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {[
                                        { name: 'Active', value: vehicles.filter(v => v.status === 'active').length, color: '#10b981' },
                                        { name: 'Idle', value: vehicles.filter(v => v.status === 'idle').length, color: '#3b82f6' },
                                        { name: 'Maintenance', value: vehicles.filter(v => v.status === 'maintenance').length, color: '#f59e0b' },
                                        { name: 'Out of Service', value: vehicles.filter(v => v.status === 'out_of_service').length, color: '#ef4444' },
                                    ].filter(item => item.value > 0).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue vs Expenses Bar Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue vs Expenses</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                                data={[
                                    {
                                        name: 'This Week',
                                        revenue: trips.reduce((sum, t) => sum + (t.revenue || 0), 0),
                                        expenses: trips.reduce((sum, t) => sum + (t.expenses || 0), 0),
                                    },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column: Map & Timeline */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 h-[500px] relative hover:shadow-2xl transition-shadow">
                            <MapView
                                vehicles={vehicles}
                                warehouses={warehouses}
                                telemetryEvents={telemetryEvents}
                                currentTime={currentTime}
                            />
                        </div>

                        {telemetryEvents.length > 0 && (
                            <TimelineSlider
                                telemetryEvents={telemetryEvents}
                                onTimeChange={setCurrentTime}
                            />
                        )}
                    </div>

                    {/* Right Column: Dispatcher Panel & Alerts */}
                    <div className="flex flex-col gap-6">
                        <AlertsWidget />
                        <DispatcherJobQueue
                            trips={trips}
                            onTripUpdated={() => {
                                fetchTrips();
                                fetchVehicles();
                            }}
                        />
                    </div>
                </div>
            </div>

            <TripCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onTripCreated={() => {
                    fetchTrips();
                    setIsCreateModalOpen(false);
                }}
            />

            <BookTruckModal
                isOpen={isBookTruckModalOpen}
                onClose={() => setIsBookTruckModalOpen(false)}
                onShipmentCreated={() => {
                    console.log('Shipment created');
                    setIsBookTruckModalOpen(false);
                }}
            />
        </Layout>
    );
};

export default Dashboard;
