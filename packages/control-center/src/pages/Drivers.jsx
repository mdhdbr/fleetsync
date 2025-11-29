import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { User, Phone, Star, Truck, Shield } from 'lucide-react';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/drivers`
            );
            setDrivers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            available: 'bg-green-100 text-green-800',
            on_trip: 'bg-blue-100 text-blue-800',
            off_duty: 'bg-gray-100 text-gray-800',
            on_break: 'bg-yellow-100 text-yellow-800',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.replace(/_/g, ' ').toUpperCase()}
            </span>
        );
    };

    const columns = [
        {
            header: 'Driver',
            accessor: 'name',
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <User size={20} />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900">{row.name}</div>
                        <div className="text-xs text-slate-500">{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'License',
            accessor: 'licenseNumber',
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-slate-400" />
                    <span className="font-mono text-sm text-slate-700">{row.licenseNumber}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            sortable: true,
            cell: (row) => getStatusBadge(row.status)
        },
        {
            header: 'Assigned Vehicle',
            accessor: 'assignedVehicle',
            sortable: true,
            cell: (row) => row.assignedVehicle ? (
                <div className="flex items-center gap-2 text-blue-600">
                    <Truck size={14} />
                    <span className="text-sm font-medium">{row.assignedVehicle}</span>
                </div>
            ) : (
                <span className="text-slate-400 italic">No Vehicle</span>
            )
        },
        {
            header: 'Rating',
            accessor: 'rating',
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-slate-700 font-medium">{row.rating.toFixed(1)}</span>
                </div>
            )
        },
        {
            header: 'Contact',
            accessor: 'phone',
            cell: (row) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={14} />
                    <span className="text-sm">{row.phone}</span>
                </div>
            )
        }
    ];

    if (loading) return <Layout><div className="p-10 text-slate-900">Loading Drivers...</div></Layout>;

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <DataTable
                    title="Fleet Drivers"
                    columns={columns}
                    data={drivers}
                    searchPlaceholder="Search drivers..."
                    actions={
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                            <User size={18} />
                            Add Driver
                        </button>
                    }
                />
            </div>
        </Layout>
    );
};

export default Drivers;
