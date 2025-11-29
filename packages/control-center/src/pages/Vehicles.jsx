import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { Truck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/vehicles`
            );
            setVehicles(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            idle: 'bg-blue-100 text-blue-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            out_of_service: 'bg-red-100 text-red-800',
        };

        const icons = {
            active: <CheckCircle size={14} />,
            idle: <Clock size={14} />,
            maintenance: <AlertTriangle size={14} />,
            out_of_service: <AlertTriangle size={14} />,
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {icons[status]}
                {status.replace(/_/g, ' ').toUpperCase()}
            </span>
        );
    };

    const columns = [
        {
            header: 'Vehicle ID',
            accessor: 'id',
            sortable: true,
            cell: (row) => <span className="font-mono text-slate-500">#{row.id.slice(-6)}</span>
        },
        {
            header: 'Vehicle',
            accessor: 'make',
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                        <Truck size={20} />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900">{row.make} {row.model}</div>
                        <div className="text-xs text-slate-500">{row.year} • {row.type}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'License Plate',
            accessor: 'licensePlate',
            sortable: true,
            cell: (row) => <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">{row.licensePlate}</span>
        },
        {
            header: 'Status',
            accessor: 'status',
            sortable: true,
            cell: (row) => getStatusBadge(row.status)
        },
        {
            header: 'Current Driver',
            accessor: 'driverId',
            sortable: true,
            cell: (row) => row.driverId ? (
                <span className="text-blue-600 font-medium">Driver #{row.driverId.slice(-4)}</span>
            ) : (
                <span className="text-slate-400 italic">Unassigned</span>
            )
        },
        {
            header: 'Last Location',
            accessor: 'location',
            cell: (row) => row.location ? (
                <span className="text-slate-600 text-sm">
                    {row.location.lat.toFixed(4)}, {row.location.lng.toFixed(4)}
                </span>
            ) : (
                <span className="text-slate-400">-</span>
            )
        }
    ];

    if (loading) return <Layout><div className="p-10 text-slate-900">Loading Vehicles...</div></Layout>;

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <DataTable
                    title="Fleet Vehicles"
                    columns={columns}
                    data={vehicles}
                    searchPlaceholder="Search vehicles..."
                    actions={
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                            <Truck size={18} />
                            Add Vehicle
                        </button>
                    }
                />
            </div>
        </Layout>
    );
};

export default Vehicles;
