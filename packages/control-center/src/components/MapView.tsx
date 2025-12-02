import { MapContainer, TileLayer, Marker, Circle, Polygon, Popup, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'

export function MapView({
  center,
  incidents,
  vehicles,
  alerts,
  zones,
  showWeatherOverlay,
  onBoundsChange,
}: {
  center: LatLngExpression
  incidents: Array<{ id: number; latlng?: LatLngExpression; type: string; location: string }>
  vehicles: Array<{ id: string; name: string; latlng: LatLngExpression; weatherImpact?: string; roadImpact?: string }>
  alerts: Array<{ id: number; latlng?: LatLngExpression }>
  zones: Array<{ id: number; geom: any }>
  showWeatherOverlay: boolean
  onBoundsChange?: (bbox: string) => void
}) {
  function BoundsHandler() {
    useMapEvents({
      moveend(map) {
        const b = map.target.getBounds()
        const minLat = b.getSouth()
        const minLng = b.getWest()
        const maxLat = b.getNorth()
        const maxLng = b.getEast()
        onBoundsChange && onBoundsChange(`${minLat},${minLng},${maxLat},${maxLng}`)
      },
      zoomend(map) {
        const b = map.target.getBounds()
        const minLat = b.getSouth()
        const minLng = b.getWest()
        const maxLat = b.getNorth()
        const maxLng = b.getEast()
        onBoundsChange && onBoundsChange(`${minLat},${minLng},${maxLat},${maxLng}`)
      }
    })
    return null
  }
  return (
    <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
      <BoundsHandler />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {incidents.map(inc => (
        inc.latlng ? (
          <Marker key={`inc-${inc.id}`} position={inc.latlng}>
            <Popup>
              {inc.type} • {inc.location}
            </Popup>
          </Marker>
        ) : null
      ))}
      {vehicles.map(v => (
        <Marker key={`veh-${v.id}`} position={v.latlng}>
          <Popup>
            {v.name}
          </Popup>
        </Marker>
      ))}
      {showWeatherOverlay && alerts.map(al => (
        al.latlng ? (
          <Circle key={`al-${al.id}`} center={al.latlng} radius={1500} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.2 }} />
        ) : null
      ))}
      {showWeatherOverlay && zones.map((z, idx) => (
        <Polygon key={`poly-${z.id ?? idx}`} positions={z.geom} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.15 }} />
      ))}
    </MapContainer>
  )
}
