import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.YOUR_MAPBOX_TOKEN';

const MapView = ({ vehicles = [], warehouses = [], telemetryEvents = [], currentTime = null }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markers = useRef([]);
    const [layers, setLayers] = useState({
        cars: true,
        trucks: true,
        warehouses: true
    });
    const [selectedAsset, setSelectedAsset] = useState(null);
    const popupRef = useRef(null);

    // Initialize map
    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [45.0792, 23.8859], // Saudi Arabia center
            zoom: 5
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }, []);

    // Update markers based on layers and data
    useEffect(() => {
        if (!map.current) return;

        // Clear existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Get vehicle positions (use telemetry if timeline is active, otherwise use current positions)
        const vehiclePositions = currentTime && telemetryEvents.length > 0
            ? getVehiclePositionsAtTime(telemetryEvents, currentTime)
            : vehicles;

        // Add vehicle markers
        vehiclePositions.forEach(vehicle => {
            const shouldShow = (vehicle.type === 'sedan' && layers.cars) ||
                (vehicle.type === 'truck' && layers.trucks);

            if (!shouldShow) return;

            const el = document.createElement('div');
            el.className = 'vehicle-marker';
            el.style.width = '32px';
            el.style.height = '32px';
            el.style.cursor = 'pointer';
            el.innerHTML = vehicle.type === 'sedan' ? '🚗' : '🚚';
            el.style.fontSize = '24px';

            const marker = new mapboxgl.Marker(el)
                .setLngLat([vehicle.lng, vehicle.lat])
                .addTo(map.current);

            el.addEventListener('click', () => {
                setSelectedAsset({ ...vehicle, assetType: 'vehicle' });
            });

            markers.current.push(marker);
        });

        // Add warehouse markers
        if (layers.warehouses) {
            warehouses.forEach(warehouse => {
                const el = document.createElement('div');
                el.className = 'warehouse-marker';
                el.style.width = '32px';
                el.style.height = '32px';
                el.style.cursor = 'pointer';
                el.innerHTML = '🏭';
                el.style.fontSize = '24px';

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([warehouse.lng, warehouse.lat])
                    .addTo(map.current);

                el.addEventListener('click', () => {
                    setSelectedAsset({ ...warehouse, assetType: 'warehouse' });
                });

                markers.current.push(marker);
            });
        }
    }, [vehicles, warehouses, layers, currentTime, telemetryEvents]);

    // Helper function to get vehicle positions at a specific time
    const getVehiclePositionsAtTime = (events, time) => {
        const vehicleMap = {};

        events.forEach(event => {
            const eventTime = new Date(event.ts).getTime();
            if (eventTime <= time) {
                vehicleMap[event.vehicle_id] = {
                    id: event.vehicle_id,
                    type: vehicles.find(v => v.id === event.vehicle_id)?.type || 'sedan',
                    lat: event.lat,
                    lng: event.lng,
                    speed: event.speed,
                    status: event.speed > 0 ? 'moving' : 'stopped'
                };
            }
        });

        return Object.values(vehicleMap);
    };

    const toggleLayer = (layer) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="w-full h-full" />

            {/* Layer Controls */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
                <div className="text-sm font-bold text-gray-800 mb-2">Layers</div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={layers.cars}
                        onChange={() => toggleLayer('cars')}
                        className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">🚗 Cars</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={layers.trucks}
                        onChange={() => toggleLayer('trucks')}
                        className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">🚚 Trucks</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={layers.warehouses}
                        onChange={() => toggleLayer('warehouses')}
                        className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">🏭 Warehouses</span>
                </label>
            </div>

            {/* Asset Popover */}
            {selectedAsset && (
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-2xl p-4 w-80 z-10">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                                {selectedAsset.assetType === 'vehicle' ? selectedAsset.id : selectedAsset.name}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">
                                {selectedAsset.assetType === 'vehicle' ? selectedAsset.type : 'Warehouse'}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedAsset(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    {selectedAsset.assetType === 'vehicle' ? (
                        <>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-semibold capitalize ${selectedAsset.status === 'empty' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {selectedAsset.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Driver:</span>
                                    <span className="font-semibold">{selectedAsset.driver || 'Unassigned'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Location:</span>
                                    <span className="font-mono text-xs">{selectedAsset.lat.toFixed(4)}, {selectedAsset.lng.toFixed(4)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                                    Assign Job
                                </button>
                                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold">
                                    View History
                                </button>
                                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold">
                                    🚨 Panic
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Capacity:</span>
                                    <span className="font-semibold">{selectedAsset.capacity} units</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Current Stock:</span>
                                    <span className="font-semibold">{selectedAsset.current_stock} units</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Utilization:</span>
                                    <span className="font-semibold">
                                        {Math.round((selectedAsset.current_stock / selectedAsset.capacity) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MapView;
