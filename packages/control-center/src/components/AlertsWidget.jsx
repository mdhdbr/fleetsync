import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function AlertsWidget() {
    const [alerts, setAlerts] = useState([]);
    const [filter, setFilter] = useState('all'); // all, high, critical
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        fetchAlerts();

        const newSocket = io(API_URL);
        setSocket(newSocket);

        newSocket.on('alert_new', (alert) => {
            setAlerts(prev => [alert, ...prev]);
        });

        return () => newSocket.disconnect();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await axios.get(`${API_URL}/alerts`);
            setAlerts(res.data);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const handleAcknowledge = async (alertId) => {
        try {
            await axios.post(`${API_URL}/alerts/acknowledge`, { alertId, userId: 'admin' });
            setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'acknowledged' } : a));
        } catch (error) {
            console.error('Error acknowledging alert:', error);
        }
    };

    const filteredAlerts = filter === 'all'
        ? alerts
        : alerts.filter(a => a.severity === filter);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-300';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default: return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Active Alerts</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('high')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'high' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        High
                    </button>
                    <button
                        onClick={() => setFilter('critical')}
                        className={`px-3 py-1 rounded text-sm ${filter === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        Critical
                    </button>
                </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAlerts.length === 0 ? (
                    <p className="text-center text-slate-400 py-8">No active alerts</p>
                ) : (
                    filteredAlerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} ${alert.status === 'acknowledged' ? 'opacity-50' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm uppercase">{alert.type.replace('_', ' ')}</span>
                                        <span className="text-xs opacity-75">{new Date(alert.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm">{alert.message}</p>
                                    {alert.vehicle_id && (
                                        <p className="text-xs mt-1 opacity-75">Vehicle: {alert.vehicle_id}</p>
                                    )}
                                </div>
                                {alert.status === 'active' && (
                                    <button
                                        onClick={() => handleAcknowledge(alert.id)}
                                        className="ml-2 px-3 py-1 bg-white/50 hover:bg-white rounded text-xs font-medium"
                                    >
                                        Acknowledge
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
