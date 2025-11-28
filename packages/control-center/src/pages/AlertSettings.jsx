import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function AlertSettings() {
    const [thresholds, setThresholds] = useState({
        speedLimit: 120,
        driverHoursLimit: 10,
        fuelLowThreshold: 20,
        engineTempHigh: 110,
        routeDeviationKm: 5
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setThresholds(prev => ({
            ...prev,
            [key]: parseFloat(value) || 0
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        try {
            await axios.post(`${API_URL}/alerts/thresholds`, thresholds);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving thresholds:', error);
            alert('Failed to save thresholds');
        }
    };

    const handleReset = () => {
        setThresholds({
            speedLimit: 120,
            driverHoursLimit: 10,
            fuelLowThreshold: 20,
            engineTempHigh: 110,
            routeDeviationKm: 5
        });
        setSaved(false);
    };

    const handleTestAlert = async (type) => {
        try {
            await axios.post(`${API_URL}/alerts/simulate`, {
                type: type,
                severity: 'high',
                message: `Test ${type} alert from settings page`,
                vehicleId: 'veh_1'
            });
            alert(`Test ${type} alert sent!`);
        } catch (error) {
            console.error('Error sending test alert:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow border-b border-slate-200">
                <div className="container mx-auto px-6 py-4">
                    <h1 className="text-2xl font-bold text-slate-800">Alert Settings</h1>
                    <p className="text-slate-500 text-sm">Configure alert thresholds and safety rules</p>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Speed Limit */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Speed Limit</h3>
                                <p className="text-sm text-slate-500">Alert when vehicle exceeds this speed</p>
                            </div>
                            <button
                                onClick={() => handleTestAlert('speeding')}
                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200"
                            >
                                Test Alert
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="60"
                                max="180"
                                value={thresholds.speedLimit}
                                onChange={(e) => handleChange('speedLimit', e.target.value)}
                                className="flex-1"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={thresholds.speedLimit}
                                    onChange={(e) => handleChange('speedLimit', e.target.value)}
                                    className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
                                />
                                <span className="text-slate-600 font-medium">km/h</span>
                            </div>
                        </div>
                    </div>

                    {/* Driver Hours Limit */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Driver Hours Limit</h3>
                                <p className="text-sm text-slate-500">Maximum working hours before mandatory break</p>
                            </div>
                            <button
                                onClick={() => handleTestAlert('fatigue')}
                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200"
                            >
                                Test Alert
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="6"
                                max="14"
                                value={thresholds.driverHoursLimit}
                                onChange={(e) => handleChange('driverHoursLimit', e.target.value)}
                                className="flex-1"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={thresholds.driverHoursLimit}
                                    onChange={(e) => handleChange('driverHoursLimit', e.target.value)}
                                    className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
                                />
                                <span className="text-slate-600 font-medium">hours</span>
                            </div>
                        </div>
                    </div>

                    {/* Fuel Low Threshold */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Low Fuel Threshold</h3>
                                <p className="text-sm text-slate-500">Alert when fuel level drops below this percentage</p>
                            </div>
                            <button
                                onClick={() => handleTestAlert('fuel_low')}
                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200"
                            >
                                Test Alert
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="10"
                                max="40"
                                value={thresholds.fuelLowThreshold}
                                onChange={(e) => handleChange('fuelLowThreshold', e.target.value)}
                                className="flex-1"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={thresholds.fuelLowThreshold}
                                    onChange={(e) => handleChange('fuelLowThreshold', e.target.value)}
                                    className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
                                />
                                <span className="text-slate-600 font-medium">%</span>
                            </div>
                        </div>
                    </div>

                    {/* Engine Temperature */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">High Engine Temperature</h3>
                                <p className="text-sm text-slate-500">Alert when engine temperature exceeds this value</p>
                            </div>
                            <button
                                onClick={() => handleTestAlert('temp_breach')}
                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200"
                            >
                                Test Alert
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="90"
                                max="130"
                                value={thresholds.engineTempHigh}
                                onChange={(e) => handleChange('engineTempHigh', e.target.value)}
                                className="flex-1"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={thresholds.engineTempHigh}
                                    onChange={(e) => handleChange('engineTempHigh', e.target.value)}
                                    className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
                                />
                                <span className="text-slate-600 font-medium">°C</span>
                            </div>
                        </div>
                    </div>

                    {/* Route Deviation */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Route Deviation</h3>
                                <p className="text-sm text-slate-500">Alert when vehicle deviates from planned route</p>
                            </div>
                            <button
                                onClick={() => handleTestAlert('route_deviation')}
                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200"
                            >
                                Test Alert
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={thresholds.routeDeviationKm}
                                onChange={(e) => handleChange('routeDeviationKm', e.target.value)}
                                className="flex-1"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={thresholds.routeDeviationKm}
                                    onChange={(e) => handleChange('routeDeviationKm', e.target.value)}
                                    className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
                                />
                                <span className="text-slate-600 font-medium">km</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleSave}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            {saved ? '✓ Saved!' : 'Save Settings'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
                        >
                            Reset to Defaults
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ About Alert Thresholds</h4>
                        <p className="text-sm text-blue-800">
                            These thresholds determine when alerts are automatically generated. Changes take effect immediately
                            for new telemetry data. You can test each alert type using the "Test Alert" buttons.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
