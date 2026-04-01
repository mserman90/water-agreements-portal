import { useEffect, useRef } from 'react';
import { useState } from 'react';
import LayerControl, { LayerConfig } from './LayerControl';
import L from 'leaflet';
import 'leaflet.markercluster';

export interface Agreement {
  id: string;
  name: string;
  country: string;
  basin: string;
  latitude: number;
  longitude: number;
  purpose: string;
  year: number;
  pdfUrl?: string;
  faolexUrl?: string;
  githubDocUrl?: string;
}

interface Props {
  agreements: Agreement[];
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
}

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const selectedIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#0369a1;border:2px solid #fff;box-shadow:0 0 0 3px #0369a1"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const defaultIcon = L.divIcon({
  className: '',
  html: '<div style="width:10px;height:10px;border-radius:50%;background:#14b8a6;border:2px solid #fff;opacity:0.85"></div>',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

function buildPopupLinks(a: Agreement): string {
  const links: string[] = [];

  if (a.pdfUrl) {
    links.push(`<a href="${a.pdfUrl}" target="_blank" rel="noopener" style="font-size:11px;color:#0369a1;text-decoration:none;margin-right:8px">&#128196; PDF &#x2193;</a>`);
  }
  if (a.githubDocUrl) {
    links.push(`<a href="${a.githubDocUrl}" target="_blank" rel="noopener" style="font-size:11px;color:#0369a1;text-decoration:none;margin-right:8px">&#128229; PDF</a>`);
  }
  if (a.faolexUrl) {
    links.push(`<a href="${a.faolexUrl}" target="_blank" rel="noopener" style="font-size:11px;color:#0369a1;text-decoration:none;margin-right:8px">FAOLEX</a>`);
  }

  // Always add FAOLEX search as fallback
  const q = encodeURIComponent(a.name.slice(0, 80));
  links.push(`<a href="https://www.fao.org/faolex/results/en/?query=${q}" target="_blank" rel="noopener" style="font-size:11px;color:#64748b;text-decoration:none">FAOLEX Ara</a>`);

  return links.join(' ');
}

export default function MapViewer({ agreements, selectedId, onMarkerClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Layer management
  const [layers, setLayers] = useState<LayerConfig[]>([
    {
      id: 'agreements',
      label: { tr: 'Anlaşmalar', en: 'Agreements' },
      icon: '📄',
      enabled: true,
      color: '#3b82f6',
    },
  ]);

  const handleLayerToggle = (id: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [20, 10],
      zoom: 2,
      zoomControl: true,
    });

      // Toggle agreements layer
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;

    const agreementsLayer = layers.find(l => l.id === 'agreements');
    if (agreementsLayer?.enabled) {
      if (!map.hasLayer(cluster)) map.addLayer(cluster);
    } else {
      if (map.hasLayer(cluster)) map.removeLayer(cluster);
    }
  }, [layers]);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '\u00a9 OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when agreements change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Remove old cluster
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }
    const cluster = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 40 });
    const newMarkers = new Map<string, L.Marker>();
    agreements.forEach((a) => {
      const marker = L.marker([a.latitude, a.longitude], {
        icon: a.id === selectedId ? selectedIcon : defaultIcon,
        title: a.name,
      });
      const linkHtml = buildPopupLinks(a);
      marker.bindPopup(`
        <div style="min-width:220px;font-family:Inter,sans-serif">
          <strong style="font-size:13px;color:#0369a1">${a.name}</strong><br/>
          <span style="font-size:11px;color:#64748b">${a.country} &middot; ${a.basin}</span><br/>
          <span style="font-size:11px">${a.year > 0 ? a.year : '?'} &mdash; ${a.purpose || 'No description'}</span>
          <div style="margin-top:6px;border-top:1px solid #e2e8f0;padding-top:4px">${linkHtml}</div>
        </div>
      `);
      marker.on('click', () => onMarkerClick?.(a.id));
      cluster.addLayer(marker);
      newMarkers.set(a.id, marker);
    });
    map.addLayer(cluster);
    clusterRef.current = cluster;
    markersRef.current = newMarkers;
  }, [agreements, selectedId, onMarkerClick]);

  // Pan to selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (marker) {
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 5), { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
      <LayerControl layers={layers} onLayerToggle={handleLayerToggle} />
}
