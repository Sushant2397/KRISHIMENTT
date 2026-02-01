import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';

type LatLng = { lat: number; lng: number };

export interface MapPoint extends LatLng {
  id?: string | number;
  label?: string;
  description?: string;
}

/** Waypoint from route optimization API (Dijkstra / SLM) */
export interface RouteWaypoint {
  lat: number;
  lon: number;
  label?: string;
}

interface LeafletMapProps {
  center: LatLng;
  zoom?: number;
  points?: MapPoint[];
  height?: string;
  className?: string;
  showCenter?: boolean;
  circleRadiusKm?: number; // draw a radius circle from center when provided
  /** Optimal route waypoints to draw as polyline (from route optimization API) */
  routeWaypoints?: RouteWaypoint[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 12,
  points = [],
  height = '360px',
  className = '',
  showCenter = true,
  circleRadiusKm,
  routeWaypoints = []
}) => {
  const routePositions = routeWaypoints.length >= 2
    ? routeWaypoints.map((w) => [w.lat, w.lon] as [number, number])
    : [];

  return (
    <div style={{ height }} className={className}>
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showCenter && (
          <Marker position={[center.lat, center.lng]} />
        )}
        {typeof circleRadiusKm === 'number' && circleRadiusKm > 0 && (
          <Circle
            center={[center.lat, center.lng]}
            radius={circleRadiusKm * 1000}
            pathOptions={{ color: '#3B82F6', fillColor: '#60A5FA', fillOpacity: 0.15 }}
          />
        )}
        {routePositions.length >= 2 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#16a34a', weight: 4, opacity: 0.8 }}
          />
        )}
        {points.map((p, i) => (
          <Marker key={p.id ?? i} position={[p.lat, p.lng]}>
            {(p.label || p.description) ? (
              <Popup>
                {p.label && <div style={{ fontWeight: 600 }}>{p.label}</div>}
                {p.description && <div style={{ marginTop: 4 }}>{p.description}</div>}
              </Popup>
            ) : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;


