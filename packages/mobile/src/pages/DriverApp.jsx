import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:4000';
const DRIVER_ID = 'd1';
const VEHICLE_ID = 'veh_1'; // Hardcoded for demo

const DriverApp = () => {
    const [status, setStatus] = useState('off_duty');
    const [location, setLocation] = useState(null);
    const [socket, setSocket] = useState(null);
    const [view, setView] = useState('dashboard'); // dashboard, job, pod
    const [activeJob, setActiveJob] = useState(null);
    const [podFile, setPodFile] = useState(null);

    useEffect(() => {
        const newSocket = io(API_URL);
        setSocket(newSocket);

        newSocket.on('job_assigned', (job) => {
            alert('New Job Assigned!');
            setActiveJob(job);
            setView('job');
        });

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error('Error getting location:', error)
            );
        }

        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        if (status === 'on_duty' && location) {
            const interval = setInterval(() => {
                axios.post(`${API_URL}/telemetry`, {
                    driverId: DRIVER_ID,
                    vehicleId: VEHICLE_ID,
                    lat: location.lat,
                    lng: location.lng,
                    timestamp: new Date().toISOString(),
                }).catch(console.error);
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [status, location]);

    const handleCOA = async () => {
        try {
            const res = await axios.get(`${API_URL}/allocation/assign_next`, {
                params: { vehicle_id: VEHICLE_ID }
            });

            if (res.data.status === 'job_assigned') {
                setActiveJob(res.data.assignment);
                setView('job');
                alert('New Job Assigned via COA!');
            } else if (res.data.status === 'fatigue_break_required') {
                alert(`⚠️ BREAK REQUIRED\n\nDriver: ${res.data.driver}\nHours Worked: ${res.data.hours_worked}\n\n${res.data.message}`);
            } else {
                alert(`No jobs found: ${res.data.message}`);
            }
        } catch (error) {
            console.error('COA Error:', error);
            alert('Error triggering COA');
        }
    };

    const handlePodSubmit = async (e) => {
        e.preventDefault();
        // Simulate upload
        alert('POD Uploaded Successfully!');
        setActiveJob(null);
        setView('dashboard');
        setPodFile(null);
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🚗</div>
                <h2 className="text-2xl font-bold mb-2">Driver Status</h2>
                <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold mb-6 ${status === 'on_duty' ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {status === 'on_duty' ? '🟢 On Duty' : '⚫ Off Duty'}
                </div>
                <button
                    onClick={() => setStatus(status === 'on_duty' ? 'off_duty' : 'on_duty')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition"
                >
                    {status === 'on_duty' ? 'Go Off Duty' : 'Go On Duty'}
                </button>
            </div>

            {status === 'on_duty' && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">Actions</h3>
                    <button
                        onClick={handleCOA}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg mb-4"
                    >
                        📍 COA (Complete On Arrival)
                    </button>
                    <p className="text-center text-sm text-gray-300">
                        Pressing COA will request the next immediate assignment.
                    </p>
                </div>
            )}
        </div>
    );

    const renderJob = () => (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Current Job</h2>

            <div className="flex-1 space-y-6">
                <div className="bg-black/20 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">Pickup</p>
                    <p className="text-xl font-bold">{activeJob?.origin || 'Riyadh Warehouse'}</p>
                </div>

                <div className="bg-black/20 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">Dropoff</p>
                    <p className="text-xl font-bold">{activeJob?.destination || 'Jeddah Port'}</p>
                </div>

                <div className="bg-black/20 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">Job Type</p>
                    <p className="text-lg capitalize">{activeJob?.job_type || 'Freight'}</p>
                </div>

                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeJob?.destination}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-3 bg-blue-500 text-center rounded-xl font-bold"
                >
                    🗺️ Navigate
                </a>
            </div>

            <button
                onClick={() => setView('pod')}
                className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg mt-6"
            >
                ✅ Complete & Upload POD
            </button>
        </div>
    );

    const renderPod = () => (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">Proof of Delivery</h2>
            <form onSubmit={handlePodSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-gray-300">Upload Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setPodFile(e.target.files[0])}
                        className="w-full bg-black/30 p-2 rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-300">Signature</label>
                    <div className="h-32 bg-white rounded-lg flex items-center justify-center text-gray-500">
                        [Signature Pad Placeholder]
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" required className="w-5 h-5" />
                        <span>Cargo inspected</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" required className="w-5 h-5" />
                        <span>Documents handed over</span>
                    </label>
                </div>

                <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg">
                    Submit POD
                </button>
                <button
                    type="button"
                    onClick={() => setView('job')}
                    className="w-full py-2 text-gray-400"
                >
                    Back
                </button>
            </form>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <header className="bg-slate-800 p-4 shadow-lg flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold">FleetSync Driver</h1>
                <div className="text-sm text-gray-400">
                    {activeJob ? 'On Job' : 'Waiting'}
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-md">
                {view === 'dashboard' && renderDashboard()}
                {view === 'job' && renderJob()}
                {view === 'pod' && renderPod()}
            </main>
        </div>
    );
};

export default DriverApp;
