import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BookTruckModal from '../components/BookTruckModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function ShipperPortal() {
    const [shipments, setShipments] = useState([]);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            const res = await axios.get(`${API_URL}/shipments`);
            setShipments(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shipments:', error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white shadow border-b border-slate-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">S</div>
                        <h1 className="text-2xl font-bold text-slate-800">Shipper Portal</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsBookModalOpen(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-sm"
                        >
                            + New Shipment
                        </button>
                        <Link to="/" className="text-slate-500 hover:text-slate-700 font-medium">Logout</Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium uppercase">Active Shipments</p>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">{shipments.filter(s => s.status === 'pending' || s.status === 'in_transit').length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium uppercase">Delivered</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{shipments.filter(s => s.status === 'delivered').length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium uppercase">Total Spend</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">SAR {shipments.length * 1500}</p>
                        <p className="text-xs text-slate-400 mt-1">Estimated based on avg. cost</p>
                    </div>
                </div>

                {/* Shipments List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">My Shipments</h2>
                        <button onClick={fetchShipments} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Refresh</button>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading shipments...</div>
                    ) : shipments.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-slate-900">No shipments yet</h3>
                            <p className="text-slate-500 mb-6">Create your first shipment to get started.</p>
                            <button
                                onClick={() => setIsBookModalOpen(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                            >
                                Create Shipment
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Goods</th>
                                        <th className="px-6 py-3">Origin</th>
                                        <th className="px-6 py-3">Destination</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {shipments.map((shipment) => (
                                        <tr key={shipment.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-mono text-slate-600">{shipment.id.slice(0, 8)}...</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{shipment.shipment_type}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{shipment.goods_description}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {shipment.pickup?.lat.toFixed(4)}, {shipment.pickup?.lng.toFixed(4)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {shipment.delivery?.lat.toFixed(4)}, {shipment.delivery?.lng.toFixed(4)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${shipment.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        shipment.status === 'in_transit' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {shipment.status === 'pending' ? 'Pending' :
                                                        shipment.status === 'in_transit' ? 'In Transit' :
                                                            shipment.status === 'delivered' ? 'Delivered' : shipment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(shipment.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <BookTruckModal
                isOpen={isBookModalOpen}
                onClose={() => setIsBookModalOpen(false)}
                onShipmentCreated={() => {
                    fetchShipments();
                    setIsBookModalOpen(false);
                }}
            />
        </div>
    );
}
