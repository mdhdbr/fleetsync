import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const BookTruckModal = ({ isOpen, onClose, onShipmentCreated }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        shipment_type: 'LTL',
        vehicle_type: 'flatbed',
        goods_description: '',
        weight: '',
        weight_unit: 'kg',
        volume: '',
        volume_unit: 'm3',
        pickupLat: 24.7136,
        pickupLng: 46.6753,
        dropoffLat: 24.7500,
        dropoffLng: 46.7000,
        pickup_window_start: '',
        pickup_window_end: '',
        delivery_window_start: '',
        delivery_window_end: ''
    });
    const [documents, setDocuments] = useState({
        pod: null,
        bol: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e, docType) => {
        setDocuments({ ...documents, [docType]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();

            // Add all form fields
            Object.keys(formData).forEach(key => {
                if (key === 'pickupLat' || key === 'pickupLng' || key === 'dropoffLat' || key === 'dropoffLng') {
                    return; // Skip, we'll handle these separately
                }
                formDataToSend.append(key, formData[key]);
            });

            // Add location data as JSON strings
            formDataToSend.append('pickup_location', JSON.stringify({
                lat: parseFloat(formData.pickupLat),
                lng: parseFloat(formData.pickupLng)
            }));
            formDataToSend.append('delivery_location', JSON.stringify({
                lat: parseFloat(formData.dropoffLat),
                lng: parseFloat(formData.dropoffLng)
            }));

            // Add documents if selected
            if (documents.pod) {
                formDataToSend.append('pod', documents.pod);
            }
            if (documents.bol) {
                formDataToSend.append('bol', documents.bol);
            }

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/shipments`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            onShipmentCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create shipment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Book Truck</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Shipment Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="shipment_type"
                                        value="LTL"
                                        checked={formData.shipment_type === 'LTL'}
                                        onChange={(e) => setFormData({ ...formData, shipment_type: e.target.value })}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm">LTL (Less Than Truckload)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="shipment_type"
                                        value="FTL"
                                        checked={formData.shipment_type === 'FTL'}
                                        onChange={(e) => setFormData({ ...formData, shipment_type: e.target.value })}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm">FTL (Full Truckload)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                            <select
                                value={formData.vehicle_type}
                                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            >
                                <option value="flatbed">Flatbed</option>
                                <option value="reefer">Reefer (Refrigerated)</option>
                                <option value="tanker">Tanker</option>
                                <option value="box_truck">Box Truck</option>
                            </select>
                        </div>
                    </div>

                    {/* Goods Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Goods Description</label>
                        <textarea
                            value={formData.goods_description}
                            onChange={(e) => setFormData({ ...formData, goods_description: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            rows="2"
                            placeholder="Describe the goods being shipped..."
                            required
                        />
                    </div>

                    {/* Weight and Volume */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="flex-1 border border-gray-300 rounded-lg p-2"
                                    placeholder="0.00"
                                    required
                                />
                                <select
                                    value={formData.weight_unit}
                                    onChange={(e) => setFormData({ ...formData, weight_unit: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-2"
                                >
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                    <option value="tons">tons</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.volume}
                                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                    className="flex-1 border border-gray-300 rounded-lg p-2"
                                    placeholder="0.00"
                                    required
                                />
                                <select
                                    value={formData.volume_unit}
                                    onChange={(e) => setFormData({ ...formData, volume_unit: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-2"
                                >
                                    <option value="m3">m³</option>
                                    <option value="ft3">ft³</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pickup and Delivery Locations */}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery (Lat, Lng)</label>
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

                    {/* Time Windows */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Window</label>
                            <div className="flex gap-2">
                                <input
                                    type="datetime-local"
                                    value={formData.pickup_window_start}
                                    onChange={(e) => setFormData({ ...formData, pickup_window_start: e.target.value })}
                                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                                    required
                                />
                                <input
                                    type="datetime-local"
                                    value={formData.pickup_window_end}
                                    onChange={(e) => setFormData({ ...formData, pickup_window_end: e.target.value })}
                                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Window</label>
                            <div className="flex gap-2">
                                <input
                                    type="datetime-local"
                                    value={formData.delivery_window_start}
                                    onChange={(e) => setFormData({ ...formData, delivery_window_start: e.target.value })}
                                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                                    required
                                />
                                <input
                                    type="datetime-local"
                                    value={formData.delivery_window_end}
                                    onChange={(e) => setFormData({ ...formData, delivery_window_end: e.target.value })}
                                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Document Uploads */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">POD (Proof of Delivery)</label>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'pod')}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {documents.pod && <p className="text-xs text-green-600 mt-1">✓ {documents.pod.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">BOL (Bill of Lading)</label>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'bol')}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {documents.bol && <p className="text-xs text-green-600 mt-1">✓ {documents.bol.name}</p>}
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
                            {loading ? 'Creating...' : 'Book Truck'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookTruckModal;
