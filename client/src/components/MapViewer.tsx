import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';

interface Agreement {
  id: string;
  name: string;
  country: string;
  basin: string;
  latitude: number;
  longitude: number;
  purpose: string;
  year: number;
  pdfUrl?: string;
}

interface MapViewerProps {
  agreements: Agreement[];
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
}

type MarkerType = L.CircleMarker | L.Marker;

export default function MapViewer({ agreements, selectedId, onMarkerClick }: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerCluster = useRef<L.MarkerClusterGroup | null>(null);
  const markers = useRef<Map<string, MarkerType>>(new Map());

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([20, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      markerCluster.current = L.markerClusterGroup();
      map.current.addLayer(markerCluster.current);
    }

    // Clear existing markers
    markers.current.forEach(marker => {
      markerCluster.current?.removeLayer(marker);
    });
    markers.current.clear();

    // Add new markers
    agreements.forEach(agreement => {
      const circleMarker = L.circleMarker([agreement.latitude, agreement.longitude], {
        radius: 8,
        fillColor: selectedId === agreement.id ? '#0369A1' : '#06B6D4',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      });

      circleMarker.bindPopup(`
        <div class="p-3 w-64">
          <h3 class="font-bold text-sm text-slate-900">${agreement.name}</h3>
          <p class="text-xs text-slate-600 mt-1">${agreement.country} • ${agreement.basin}</p>
          <p class="text-xs text-slate-500 mt-2">${agreement.purpose}</p>
          <p class="text-xs text-slate-400 mt-1">Yıl: ${agreement.year}</p>
        </div>
      `);

      circleMarker.on('click', () => {
        onMarkerClick?.(agreement.id);
        circleMarker.openPopup();
      });

      markerCluster.current?.addLayer(circleMarker);
      markers.current.set(agreement.id, circleMarker);
    });

    // Fit bounds if agreements exist
    if (agreements.length > 0) {
      const group = new L.FeatureGroup(Array.from(markers.current.values()));
      map.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [agreements, selectedId, onMarkerClick]);

  // Highlight selected marker
  useEffect(() => {
    if (selectedId && map.current) {
      const marker = markers.current.get(selectedId);
      if (marker && 'setStyle' in marker) {
        (marker as L.CircleMarker).setStyle({ fillColor: '#0369A1' });
        map.current.setView((marker as any).getLatLng(), Math.max(map.current.getZoom(), 10), {
          animate: true,
          duration: 0.5,
        });
      }
    }
  }, [selectedId]);

  return (
    <div
      ref={mapContainer}
      className="map-container"
      style={{ height: 'calc(100vh - 64px)', width: '100%' }}
    />
  );
}
