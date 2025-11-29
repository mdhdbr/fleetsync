import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const API_URL = 'http://localhost:4000';

export default function WMS() {
    const [activeTab, setActiveTab] = useState('overview');
    const [warehouses, setWarehouses] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [dockBookings, setDockBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ASN Form State
    const [asnForm, setAsnForm] = useState({ warehouseId: '', items: [{ item: '', qty: 0, bin: '' }] });

    // Dock Booking Form State
    const [bookingForm, setBookingForm] = useState({ warehouseId: '', dockId: '', startTime: '', endTime: '', truckId: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [whRes, invRes, dockRes] = await Promise.all([
                axios.get(`${API_URL}/warehouses`),
                axios.get(`${API_URL}/wms/inventory`),
                axios.get(`${API_URL}/wms/docks`)
            ]);
            setWarehouses(whRes.data);
            setInventory(invRes.data);
            setDockBookings(dockRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching WMS data:', error);
            setLoading(false);
        }
    };

    const handleAsnSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/wms/push-inbound`, asnForm);
            alert('ASN Created & Inventory Updated!');
            fetchData();
            setAsnForm({ warehouseId: '', items: [{ item: '', qty: 0, bin: '' }] });
        } catch (error) {
            alert('Error creating ASN');
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/wms/docks/book`, bookingForm);
            alert('Dock Booked Successfully!');
            fetchData();
            setBookingForm({ warehouseId: '', dockId: '', startTime: '', endTime: '', truckId: '' });
        } catch (error) {
            alert(error.response?.data?.error || 'Error booking dock');
        }
    };

    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warehouses.map(wh => (
                <div key={wh.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
                    <h3 className="text-xl font-bold mb-2 text-slate-900">{wh.name}</h3>
                    <p className="text-slate-600">Capacity: {wh.capacity}</p>
                    <p className="text-slate-600">Current Stock: {wh.current_stock}</p>
                    <p className="text-slate-600">Docks: {wh.docks || 0}</p>
                    <div className="mt-4 w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(wh.current_stock / wh.capacity) * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderInventory = () => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="p-4 text-slate-700">Item</th>
                        <th className="p-4 text-slate-700">Warehouse</th>
                        <th className="p-4 text-slate-700">Qty</th>
                        <th className="p-4 text-slate-700">Bin</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-50">
                            <td className="p-4 text-slate-900">{item.item}</td>
                            <td className="p-4 text-slate-600">{warehouses.find(w => w.id === item.warehouse_id)?.name || item.warehouse_id}</td>
                            <td className="p-4 text-slate-900">{item.qty}</td>
                            <td className="p-4 text-slate-600">{item.bin}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderInbound = () => (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md max-w-2xl">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">Create Inbound ASN</h3>
            <form onSubmit={handleAsnSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-slate-700">Warehouse</label>
                    <select
                        className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900"
                        value={asnForm.warehouseId}
                        onChange={e => setAsnForm({ ...asnForm, warehouseId: e.target.value })}
                        required
                    >
                        <option value="">Select Warehouse</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>

                <div className="border-t border-slate-200 pt-4">
                    <h4 className="font-semibold mb-2 text-slate-900">Item Details</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            placeholder="Item Name"
                            className="bg-white border border-slate-300 rounded p-2 text-slate-900"
                            value={asnForm.items[0].item}
                            onChange={e => {
                                const newItems = [...asnForm.items];
                                newItems[0].item = e.target.value;
                                setAsnForm({ ...asnForm, items: newItems });
                            }}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Qty"
                            className="bg-white border border-slate-300 rounded p-2 text-slate-900"
                            value={asnForm.items[0].qty}
                            onChange={e => {
                                const newItems = [...asnForm.items];
                                newItems[0].qty = parseInt(e.target.value);
                                setAsnForm({ ...asnForm, items: newItems });
                            }}
                            required
                        />
                        <input
                            placeholder="Bin Location"
                            className="bg-white border border-slate-300 rounded p-2 text-slate-900"
                            value={asnForm.items[0].bin}
                            onChange={e => {
                                const newItems = [...asnForm.items];
                                newItems[0].bin = e.target.value;
                                setAsnForm({ ...asnForm, items: newItems });
                            }}
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition">
                    Submit ASN
                </button>
            </form>
        </div>
    );

    const renderDockScheduler = () => (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md max-w-2xl">
                <h3 className="text-2xl font-bold mb-6 text-slate-900">Book Dock Slot</h3>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-slate-700">Warehouse</label>
                            <select
                                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900"
                                value={bookingForm.warehouseId}
                                onChange={e => setBookingForm({ ...bookingForm, warehouseId: e.target.value })}
                                required
                            >
                                <option value="">Select Warehouse</option>
                                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-slate-700">Dock ID</label>
                            <input
                                type="number"
                                placeholder="Dock #"
                                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900"
                                value={bookingForm.dockId}
                                onChange={e => setBookingForm({ ...bookingForm, dockId: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-slate-700">Start Time</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900"
                                value={bookingForm.startTime}
                                onChange={e => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-slate-700">End Time</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900"
                                value={bookingForm.endTime}
                                onChange={e => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-slate-700">Truck ID</label>
                        <input
                            placeholder="Truck License / ID"
                            className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900"
                            value={bookingForm.truckId}
                            onChange={e => setBookingForm({ ...bookingForm, truckId: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold transition">
                        Book Slot
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-slate-900">Upcoming Bookings</h3>
                <div className="space-y-3">
                    {dockBookings.length === 0 ? <p className="text-slate-500">No bookings found.</p> : dockBookings.map(b => (
                        <div key={b.id} className="p-4 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                            <div>
                                <span className="font-bold text-blue-600">{warehouses.find(w => w.id === b.warehouse_id)?.name}</span>
                                <span className="mx-2 text-slate-400">|</span>
                                <span className="text-slate-900">Dock #{b.dock_id}</span>
                                <div className="text-sm text-slate-500 mt-1">
                                    {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="bg-slate-200 px-3 py-1 rounded text-sm text-slate-900">
                                Truck: {b.truck_id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) return <Layout><div className="p-10 text-slate-900">Loading WMS...</div></Layout>;

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            WMS Control Center
                        </h1>
                        <p className="text-slate-600 mt-1">Manage Inventory, Inbound & Docks</p>
                    </div>
                    <nav className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
                        {['overview', 'inventory', 'inbound', 'docks'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md capitalize transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </header>

                <main>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'inventory' && renderInventory()}
                    {activeTab === 'inbound' && renderInbound()}
                    {activeTab === 'docks' && renderDockScheduler()}
                </main>
            </div>
        </Layout>
    );
}
