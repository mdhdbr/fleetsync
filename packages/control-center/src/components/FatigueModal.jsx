import React from 'react';

export default function FatigueModal({ driver, hoursWorked, onAcknowledge, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Fatigue Break Required</h2>
                    <p className="text-slate-600">Driver safety regulation enforcement</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Driver:</span>
                            <span className="text-slate-900 font-bold">{driver}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Hours Worked:</span>
                            <span className="text-red-600 font-bold">{hoursWorked} hours</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Limit:</span>
                            <span className="text-slate-600">10 hours</span>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                        <strong>Regulation:</strong> Driver has exceeded the maximum allowed working hours.
                        A mandatory break must be recorded before the next assignment can be made.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onAcknowledge}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Acknowledge & Record Break
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
