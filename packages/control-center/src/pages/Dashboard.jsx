import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import io from 'socket.io-client';
import MapView from '../components/MapView';
import TimelineSlider from '../components/TimelineSlider';
import TripCreateModal from '../components/TripCreateModal';
import DispatcherJobQueue from '../components/DispatcherJobQueue';
import BookTruckModal from '../components/BookTruckModal';
import AlertsWidget from '../components/AlertsWidget';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [telemetryEvents, setTelemetryEvents] = useState([]);
    const [trips, setTrips] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [currentTime, setCurrentTime] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBookTruckModalOpen, setIsBookTruckModalOpen] = useState(false);
    const [fatigueAlert, setFatigueAlert] = useState(null);

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
            fetchVehicles(); // Vehicle status might change
        });

        socket.on('vehicle_update', (data) => {
            console.log('Vehicle update:', data);
            fetchVehicles();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/vehicles`);
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/warehouses`);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchTelemetryEvents = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/telemetry-events`);
            setTelemetryEvents(response.data);
        } catch (error) {
            console.error('Error fetching telemetry events:', error);
        }
    };

    const fetchTrips = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/trips`);
            setTrips(response.data);
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-md border-b border-slate-200 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">F</div>
                        <h1 className="text-2xl font-bold text-slate-900">FleetSync Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/analytics')}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-semibold flex items-center gap-2"
                        >
                            📊 Analytics
                        </button>
                        <button
                            onClick={() => navigate('/wms')}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-semibold flex items-center gap-2"
                        >
                            🏭 WMS
                        </button>
                        <button
                            onClick={() => navigate('/alert-settings')}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-semibold flex items-center gap-2"
                        >
                            ⚙️ Alerts
                        </button>
                        <div className="h-6 w-px bg-slate-300"></div>
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
                        <div className="h-6 w-px bg-slate-300"></div>
                        <span className="text-slate-700">Welcome, {user?.name || 'Admin'}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 container mx-auto px-6 py-6 overflow-hidden flex flex-col">
                <div className="grid lg:grid-cols-3 gap-6 h-full">
                    {/* Left Column: Map & Timeline */}
                    <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 flex-1 min-h-[500px] relative">
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
                    <div className="h-full flex flex-col gap-6">
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
                    // Refresh data if needed, e.g. fetchShipments()
                    console.log('Shipment created');
                    setIsBookTruckModalOpen(false);
                }}
            />
        </div>
    );
};

export default Dashboard;
