import { useEffect, useMemo, useState } from 'react'
import type { LatLngExpression } from 'leaflet'
import { GlobalProvider, useGlobal } from './state'
import { MapView } from './components/MapView'

type WeatherAlert = { id: number; type: string; severity: string; location: string; description: string; impact: string; latlng?: LatLngExpression }
type ForecastItem = { day: string; icon: string; high: number; low: number }
type Incident = { id: number; type: string; severity: string; location: string; description: string; impact: string; expectedClearance: string; latlng?: LatLngExpression }
type Vehicle = { id: string; name: string; latlng: LatLngExpression; weatherImpact?: string; roadImpact?: string }

function AppInner() {
  const [apiStatus, setApiStatus] = useState('checking...')
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(false)
  const { filterWeatherImpacted, setFilterWeatherImpacted, severityFilter, setSeverityFilter, incidents: incidentsDb, zones, setBbox } = useGlobal()
  const [selectedWeather, setSelectedWeather] = useState<WeatherAlert | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  const [weatherData, setWeatherData] = useState<{ current: { temp: number; icon: string; description: string }; forecast: ForecastItem[]; alerts: WeatherAlert[], zones?: LatLngExpression[][] }>({
    current: { temp: 32, icon: 'sunny', description: 'Clear Sky' },
    forecast: [
      { day: 'Mon', icon: 'rain', high: 30, low: 23 },
      { day: 'Tue', icon: 'cloudy', high: 31, low: 24 },
      { day: 'Wed', icon: 'sunny', high: 33, low: 25 },
    ],
    alerts: [
      { id: 1, type: 'Heavy Rainfall', severity: 'High', location: 'Riyadh', description: 'Expected flooding in low-lying areas', impact: 'Reduced visibility', latlng: [24.7136, 46.6753] },
    ],
    zones: [
      [
        [24.7300, 46.6600] as LatLngExpression,
        [24.7350, 46.6900] as LatLngExpression,
        [24.7200, 46.7050] as LatLngExpression,
        [24.7000, 46.6950] as LatLngExpression,
        [24.7050, 46.6650] as LatLngExpression,
      ],
    ],
  })

  const [roadConditions, setRoadConditions] = useState<{ incidents: Incident[] }>({ incidents: [] })

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'VEH-001', name: 'Vehicle 1', latlng: [24.7200, 46.6800] },
    { id: 'VEH-002', name: 'Vehicle 2', latlng: [24.7250, 46.6900] },
    { id: 'VEH-003', name: 'Vehicle 3', latlng: [24.7100, 46.6700] },
    { id: 'VEH-004', name: 'Vehicle 4', latlng: [24.7000, 46.7000] },
    { id: 'VEH-005', name: 'Vehicle 5', latlng: [24.7350, 46.6800] },
    { id: 'VEH-006', name: 'Vehicle 6', latlng: [24.6950, 46.6750] },
    { id: 'VEH-007', name: 'Vehicle 7', latlng: [24.7450, 46.6900] },
    { id: 'VEH-008', name: 'Vehicle 8', latlng: [24.7150, 46.7000] },
  ])

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then(r => r.json())
      .then(d => setApiStatus(d.status || 'unknown'))
      .catch(() => setApiStatus('unreachable'))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setVehicles(prev => {
        const next = prev.map(v => ({ ...v }))
        for (let i = 0; i < next.length; i++) {
          const jitterLat = (Math.random() - 0.5) * 0.005
          const jitterLng = (Math.random() - 0.5) * 0.005
          const [lat, lng] = next[i].latlng as [number, number]
          next[i].latlng = [lat + jitterLat, lng + jitterLng]
        }
        return next
      })
    }, 25000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setRoadConditions({ incidents: incidentsDb.map(i => ({ id: i.id, type: i.type, severity: i.severity, location: i.location, description: i.description, impact: i.impact, expectedClearance: i.expectedClearance, latlng: [i.lat, i.lng] })) })
  }, [incidentsDb])

  const shownVehicles = useMemo(() => {
    if (!filterWeatherImpacted) return vehicles
    return vehicles.filter(v => !!v.weatherImpact)
  }, [vehicles, filterWeatherImpacted])

  return (
    <div className="min-h-screen flex font-sans">
      <aside className="w-64 border-r border-gray-200 p-4">
        <div className="font-semibold mb-3">Navigation</div>
        <div className="mb-1">Tracking</div>
        <div className="pl-3 text-gray-600">Weather & Road Overlays</div>
        <div className="mt-3 font-semibold">Weather & Road Conditions</div>
        <div className="pl-3 text-gray-600">Weather Forecast Dashboard</div>
        <div className="pl-3 text-gray-600">Real-time Road Condition Alerts</div>
        <div className="pl-3 text-gray-600">Impact Analysis on Fleet Operations</div>
        <div className="pl-3 text-gray-600">Weather-Aware Route Optimization</div>
        <div className="pl-3 text-gray-600">Weather & Road Condition Reports</div>
        <div className="mt-3">Reports</div>
        <div className="pl-3 text-gray-600">Weather Impact Report</div>
        <div className="pl-3 text-gray-600">Road Conditions Report</div>
        <div className="mt-3">Integrations</div>
        <div className="pl-3 text-gray-600">Weather API</div>
        <div className="pl-3 text-gray-600">Traffic Data API</div>
      </aside>

      <main className="flex-1 p-4 grid gap-4">
        <div className="flex gap-4 items-center">
          <div className="p-3 border border-gray-200 rounded-lg cursor-pointer" onClick={() => setFilterWeatherImpacted(v => !v)}>
            <div className="text-xs text-gray-500">Active Weather Alerts</div>
            <div className="text-2xl font-bold">{weatherData.alerts.length}</div>
            <div className="text-[11px] text-gray-400">{filterWeatherImpacted ? 'Filter: ON' : 'Filter: OFF'}</div>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-500">API status</div>
            <div className="text-lg">{apiStatus}</div>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-500">Incident severity</div>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button className="px-3 py-1.5 border border-gray-300 rounded-md" onClick={async () => {
            const payload = { weatherAlerts: weatherData.alerts, incidents: roadConditions.incidents, ts: Date.now() }
            try { await fetch('http://localhost:3001/api/snapshots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }) } catch { }
          }}>Save Snapshot</button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="font-semibold mb-2">Live Weather Forecast</div>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{weatherData.current.icon === 'sunny' ? '☀️' : weatherData.current.icon === 'rain' ? '🌧️' : '⛅'}</div>
              <div className="text-2xl font-bold">{weatherData.current.temp}°C</div>
              <div className="text-gray-600">{weatherData.current.description}</div>
            </div>
            <div className="flex gap-3 mt-3">
              {weatherData.forecast.map(f => (
                <div key={f.day} className="border border-gray-200 rounded-md p-2 w-24 text-center">
                  <div className="font-semibold">{f.day}</div>
                  <div className="text-xl">{f.icon === 'sunny' ? '☀️' : f.icon === 'rain' ? '🌧️' : '☁️'}</div>
                  <div className="text-xs">{f.high} / {f.low}°C</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3">
            <div className="font-semibold mb-2">Active Road Incidents</div>
            <div className="max-h-52 overflow-auto grid gap-2">
              {roadConditions.incidents.map(inc => (
                <div key={inc.id} className="border border-gray-200 rounded-md p-2 cursor-pointer" onClick={() => setSelectedIncident(inc)}>
                  <div className="flex justify-between">
                    <div>{inc.type} • {inc.location}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${inc.severity === 'High' ? 'bg-red-100' : inc.severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>{inc.severity}</div>
                  </div>
                  <div className="text-xs text-gray-600">{inc.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="font-semibold">Tracking Map</div>
            <button onClick={() => setShowWeatherOverlay(v => !v)} className={`px-2.5 py-1.5 border border-gray-300 rounded-md ${showWeatherOverlay ? 'bg-indigo-50' : 'bg-white'}`}>Weather Overlay</button>
          </div>
          <div className="mt-2 text-xs text-gray-600">{showWeatherOverlay ? 'Overlay: ON' : 'Overlay: OFF'}</div>
          <div className="mt-3 flex gap-4">
            <div className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500" /> Weather Impact</div>
            <div className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600" /> Road Impact</div>
          </div>
          <div className="h-96 mt-3">
            <MapView
              center={[24.7136, 46.6753]}
              incidents={roadConditions.incidents}
              vehicles={vehicles}
              alerts={weatherData.alerts}
              zones={zones}
              showWeatherOverlay={showWeatherOverlay}
              onBoundsChange={(bbox) => setBbox(bbox)}
            />
          </div>
          <div className="mt-3 grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {shownVehicles.map(v => (
              <div key={v.id} className="border border-gray-200 rounded-lg p-2 cursor-pointer flex items-center gap-2" onClick={() => {
                if (v.weatherImpact) setSelectedWeather({ id: 0, type: 'Weather', severity: 'Medium', location: 'Route', description: v.weatherImpact, impact: 'Delay' })
                else if (v.roadImpact) setSelectedIncident({ id: 0, type: 'Road', severity: 'Medium', location: 'Route', description: v.roadImpact, impact: 'Congestion', expectedClearance: 'Unknown' })
              }}>
                <div className={`w-2.5 h-2.5 rounded-full ${v.weatherImpact ? 'bg-orange-500' : v.roadImpact ? 'bg-red-600' : 'bg-gray-300'}`} />
                <div className="font-semibold">{v.name}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-gray-200 rounded-lg p-3">
          <div className="font-semibold mb-2">Vehicles</div>
          <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {vehicles.map(v => (
              <div key={v.id} className="border border-gray-200 rounded-lg p-2">
                <div className="font-semibold">{v.name}</div>
                {!!v.weatherImpact && <div className="flex items-center gap-1.5 text-orange-700"><span>🌧️</span><span>{v.weatherImpact}</span></div>}
                {!!v.roadImpact && <div className="flex items-center gap-1.5 text-red-700"><span>🛣️</span><span>{v.roadImpact}</span></div>}
              </div>
            ))}
          </div>
        </section>

        {selectedWeather && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center" onClick={() => setSelectedWeather(null)}>
            <div className="bg-white p-4 rounded-lg w-[420px]" onClick={e => e.stopPropagation()}>
              <div className="font-bold mb-2">Weather Alert</div>
              <div>Type: {selectedWeather.type}</div>
              <div>Severity: {selectedWeather.severity}</div>
              <div>Affected: {selectedWeather.location}</div>
              <div>Description: {selectedWeather.description}</div>
              <div>Recommended: Slowdown, alternative route</div>
              <div className="text-right mt-3"><button onClick={() => setSelectedWeather(null)} className="px-3 py-1.5 border border-gray-300 rounded-md">Close</button></div>
            </div>
          </div>
        )}

        {selectedIncident && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center" onClick={() => setSelectedIncident(null)}>
            <div className="bg-white p-4 rounded-lg w-[420px]" onClick={e => e.stopPropagation()}>
              <div className="font-bold mb-2">Road Incident</div>
              <div>Type: {selectedIncident.type}</div>
              <div>Location: {selectedIncident.location}</div>
              <div>Severity: {selectedIncident.severity}</div>
              <div>Impact: {selectedIncident.impact}</div>
              <div>Clearance ETA: {selectedIncident.expectedClearance}</div>
              <div>Suggested: Reroute</div>
              <div className="text-right mt-3"><button onClick={() => setSelectedIncident(null)} className="px-3 py-1.5 border border-gray-300 rounded-md">Close</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <GlobalProvider>
      <AppInner />
    </GlobalProvider>
  )
}
