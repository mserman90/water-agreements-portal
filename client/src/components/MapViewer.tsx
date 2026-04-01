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

/** Derive agreement type from purpose for color coding */
function deriveAgreementColor(purpose: string, isSelected: boolean): string {
  const p = purpose.toLowerCase();
  const isConflict =
    p.includes('conflict') || p.includes('dispute') || p.includes('war') || p.includes('protest');
  const isCoop =
    p.includes('cooper') || p.includes('alloc') || p.includes('joint') ||
    p.includes('agreement') || p.includes('treaty');
  if (isSelected) return '#facc15'; // yellow highlight for selected
  if (isConflict && isCoop) return '#eab308'; // mixed -> yellow
  if (isConflict) return '#ef4444';           // conflict -> red
  return '#22c55e';                           // cooperation -> green
}

function buildMarkerIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 14 : 10;
  const border = isSelected ? '2px solid #fff' : '1.5px solid rgba(255,255,255,0.7)';
  const shadow = isSelected ? '0 0 6px 2px rgba(250,204,21,0.8)' : '0 1px 3px rgba(0,0,0,0.4)';
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border};box-shadow:${shadow};opacity:0.92"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

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
  const q = encodeURIComponent(a.name.slice(0, 80));
  links.push(`<a href="https://www.fao.org/faolex/results/en/?query=${q}" target="_blank" rel="noopener" style="font-size:11px;color:#0369a1;text-decoration:none">FAOLEX Ara</a>`);
  return links.join(' ');
}

export default function MapViewer({ agreements, selectedId, onMarkerClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [layers, setLayers] = useState<LayerConfig[]>([
    {
      id: 'agreements',
      label: { tr: 'Anlasmalar', en: 'Agreements' },
      icon: '📄',
      enabled: true,
      color: '#3b82f6',
    },
  ]);

  const handleLayerToggle = (id: string) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, enabled: !layer.enabled } : layer)),
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

  // Toggle agreements layer
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;
    const agreementsLayer = layers.find((l) => l.id === 'agreements');
    if (agreementsLayer?.enabled) {
      if (!map.hasLayer(cluster)) map.addLayer(cluster);
    } else {
      if (map.hasLayer(cluster)) map.removeLayer(cluster);
    }
  }, [layers]);

  // Update markers when agreements change - with color coding
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }
    const cluster = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 40 });
    const newMarkers = new Map<string, L.Marker>();
    agreements.forEach((a) => {
      const isSelected = a.id === selectedId;
      const color = deriveAgreementColor(a.purpose, isSelected);
      const icon = buildMarkerIcon(color, isSelected);
      const marker = L.marker([a.latitude, a.longitude], { icon, title: a.name });
      const linkHtml = buildPopupLinks(a);
      // Color badge in popup
      const typeDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:4px;vertical-align:middle"></span>`;
      marker.bindPopup(
        `<div style="min-width:180px">
          <b style="font-size:13px">${a.name}</b><br/>
          <span style="font-size:11px;color:#475569">${a.country} &middot; ${a.basin}</span><br/>
          <span style="font-size:11px">${typeDot}${a.year > 0 ? a.year : '?'} &mdash; ${a.purpose || 'No description'}</span><br/>
          <div style="margin-top:6px">${linkHtml}</div>
        </div>`,
      );
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

  return (
    <div
      ref={containerRef}
      className="leaflet-container"
      style={{ position: 'absolute', inset: 0 }}
    >
      <LayerControl layers={layers} onToggle={handleLayerToggle} />
    </div>
  );
}
