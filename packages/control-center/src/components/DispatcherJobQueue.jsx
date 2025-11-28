import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import FatigueModal from './FatigueModal';

const DispatcherJobQueue = ({ trips = [], onTripUpdated }) => {
    const { token } = useAuth();
    const [filter, setFilter] = useState('all'); // all, pending, assigned, completed
    const [loading, setLoading] = useState(null);
    const [fatigueAlert, setFatigueAlert] = useState(null);

    const filteredTrips = trips.filter(trip => {
        if (filter === 'all') return trip.status !== 'completed';
        return trip.status === filter;
    });

    const handleAutoAssign = async (tripId) => {
        setLoading(tripId);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/trips/${tripId}/assign`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Check if fatigue alert was returned
            if (response.data.status === 'fatigue_break_required') {
                setFatigueAlert({
                    tripId,
                    driver: response.data.driver,
                    hoursWorked: response.data.hours_worked,
                    vehicleId: response.data.vehicle_id
                });
                setLoading(null);
                return;
            }

            onTripUpdated();
        } catch (error) {
            console.error('Assign failed:', error);
            alert(error.response?.data?.message || 'Assignment failed');
        } finally {
            setLoading(null);
        }
    };

    const handleFatigueAcknowledge = async () => {
        if (!fatigueAlert) return;

        try {
            // Record break for the driver/vehicle
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/vehicles/${fatigueAlert.vehicleId}/record-break`, {
                driver: fatigueAlert.driver,
                hours_worked: fatigueAlert.hoursWorked
            });

            alert(`Break recorded for ${fatigueAlert.driver}. Driver hours reset.`);
            setFatigueAlert(null);
            onTripUpdated();
        } catch (error) {
            console.error('Error recording break:', error);
            alert('Failed to record break');
        }
    };

    const handleCompleteTrip = async (tripId) => {
        setLoading(tripId);
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/trips/${tripId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onTripUpdated();
        } catch (error) {
            console.error('Completion failed:', error);
            alert('Failed to complete trip');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Job Queue</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="text-sm border border-slate-300 rounded-lg px-2 py-1"
                >
                    <option value="all">Active</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredTrips.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                        No trips found
                    </div>
                ) : (
                    filteredTrips.map(trip => (
                        <div key={trip.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-400 transition">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-mono text-xs text-slate-500">#{trip.id}</span>
                                    <h3 className="font-semibold text-slate-800 capitalize">{trip.type} Trip</h3>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    trip.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                    {trip.status}
                                </span>
                            </div>

                            <div className="text-sm text-slate-600 space-y-1 mb-3">
                                <div className="flex items-center gap-2">
                                    <span>📍</span>
                                    <span className="truncate">From: {trip.origin.lat.toFixed(4)}, {trip.origin.lng.toFixed(4)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🏁</span>
                                    <span className="truncate">To: {trip.destination.lat.toFixed(4)}, {trip.destination.lng.toFixed(4)}</span>
                                </div>
                                <div className="flex gap-4 mt-1 text-xs">
                                    <span>👥 {trip.passengers} pax</span>
                                    {trip.addons?.length > 0 && (
                                        <span>➕ {trip.addons.length} addons</span>
                                    )}
                                </div>
                                {trip.vehicle_id && (
                                    <div className="text-xs font-semibold text-blue-600 mt-1">
                                        Vehicle: {trip.vehicle_id}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {trip.status === 'pending' && (
                                    <button
                                        onClick={() => handleAutoAssign(trip.id)}
                                        disabled={loading === trip.id}
                                        className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {loading === trip.id ? 'Assigning...' : 'Auto Assign'}
                                    </button>
                                )}
                                {trip.status === 'assigned' && (
                                    <button
                                        onClick={() => handleCompleteTrip(trip.id)}
                                        disabled={loading === trip.id}
                                        className="flex-1 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {loading === trip.id ? 'Completing...' : 'Complete (COA)'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {fatigueAlert && (
                <FatigueModal
                    driver={fatigueAlert.driver}
                    hoursWorked={fatigueAlert.hoursWorked}
                    onAcknowledge={handleFatigueAcknowledge}
                    onClose={() => setFatigueAlert(null)}
                />
            )}
        </div>
    );
};

export default DispatcherJobQueue;
