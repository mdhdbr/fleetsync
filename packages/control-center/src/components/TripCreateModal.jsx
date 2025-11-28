import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const TripCreateModal = ({ isOpen, onClose, onTripCreated }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        type: 'ride',
        pickupLat: 24.7136,
        pickupLng: 46.6753,
        dropoffLat: 24.7500,
        dropoffLng: 46.7000,
        passengers: 1,
        addons: {
            baby_seat: false,
            wheelchair: false,
            extra_luggage: false
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const addonsList = Object.keys(formData.addons).filter(key => formData.addons[key]);

            const payload = {
                type: formData.type,
                origin: {
                    lat: parseFloat(formData.pickupLat),
                    lng: parseFloat(formData.pickupLng)
                },
                destination: {
                    lat: parseFloat(formData.dropoffLat),
                    lng: parseFloat(formData.dropoffLng)
                },
                passengers: parseInt(formData.passengers),
                addons: addonsList
            };

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/trips`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onTripCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Trip</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            >
                                <option value="ride">Ride (Sedan)</option>
                                <option value="logistics">Logistics (Truck)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                            <input
                                type="number"
                                min="1"
                                max="6"
                                value={formData.passengers}
                                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup (Lat, Lng)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={formData.pickupLat}
                                    onChange={(e) => setFormData({ ...formData, pickupLat: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    placeholder="Lat"
                                />
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={formData.pickupLng}
                                    onChange={(e) => setFormData({ ...formData, pickupLng: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    placeholder="Lng"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff (Lat, Lng)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={formData.dropoffLat}
                                    onChange={(e) => setFormData({ ...formData, dropoffLat: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    placeholder="Lat"
                                />
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={formData.dropoffLng}
                                    onChange={(e) => setFormData({ ...formData, dropoffLng: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    placeholder="Lng"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add-ons</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.addons.baby_seat}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        addons: { ...formData.addons, baby_seat: e.target.checked }
                                    })}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-600">Baby Seat</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.addons.wheelchair}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        addons: { ...formData.addons, wheelchair: e.target.checked }
                                    })}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-600">Wheelchair</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.addons.extra_luggage}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        addons: { ...formData.addons, extra_luggage: e.target.checked }
                                    })}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="text-sm text-gray-600">Extra Luggage</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Trip'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripCreateModal;
