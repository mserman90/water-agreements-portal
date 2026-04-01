import { useEffect, useRef, useState } from 'react';
import LayerControl, { LayerConfig } from './LayerControl';
import MeteoLayerOverlay from './MeteoLayerOverlay';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { MeteoLayerType } from '@/hooks/useMeteoLayer';
import { useLanguage } from '@/i18n/LanguageContext';

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
  /** Current year from the timeline slider (used to pick meteorology data year) */
  currentYear?: number;
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
  const isConflict = p.includes('conflict') || p.includes('dispute') || p.includes('war') || p.includes('protest');
  const isCoop = p.includes('cooper') || p.includes('alloc') || p.includes('joint') || p.includes('agreement') || p.includes('treaty');
  if (isSelected) return '#facc15'; // yellow highlight for selected
  if (isConflict && isCoop) return '#eab308'; // mixed -> yellow
  if (isConflict) return '#ef4444'; // conflict -> red
  return '#22c55e'; // cooperation -> green
}

function buildMarkerIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 14 : 10;
  const border = isSelected ? '2px solid #fff' : '1.5px solid rgba(255,255,255,0.7)';
  const shadow = isSelected ? '0 0 6px 2px rgba(250,204,21,0.8)' : '0 1px 3px rgba(0,0,0,0.4)';
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border};box-shadow:${shadow};"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function buildPopupLinks(a: Agreement): string {
  const links: string[] = [];
  if (a.pdfUrl) { links.push(`<a href="${a.pdfUrl}" target="_blank">📄 PDF ↓</a>`); }
  if (a.githubDocUrl) { links.push(`<a href="${a.githubDocUrl}" target="_blank">📥 PDF</a>`); }
  if (a.faolexUrl) { links.push(`<a href="${a.faolexUrl}" target="_blank">FAOLEX</a>`); }
  const q = encodeURIComponent(a.name.slice(0, 80));
  links.push(`<a href="https://www.fao.org/faolex/results/en/?query=${q}" target="_blank">FAOLEX Ara</a>`);
  return links.join(' ');
}

// ── Meteorology layer definitions ─────────────────────────────────────────────

const METEO_LAYER_IDS: MeteoLayerType[] = ['temperature', 'precipitation', 'drought'];

const METEO_LAYER_META: Record<MeteoLayerType, { label: { tr: string; en: string }; icon: string; color: string }> = {
  temperature:   { label: { tr: 'Sicaklik Anomalisi', en: 'Temperature Anomaly' }, icon: '🌡️', color: '#ef4444' },
  precipitation: { label: { tr: 'Yagis Anomalisi',   en: 'Precipitation Anomaly' }, icon: '🌧️', color: '#3b82f6' },
  drought:       { label: { tr: 'Kuraklik Endeksi',  en: 'Drought Index' }, icon: '🏜️', color: '#f59e0b' },
};

export default function MapViewer({ agreements, selectedId, onMarkerClick, currentYear = 2022 }: Props) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // ── Layer state ───────────────────────────────────────────────────────────
  const [layers, setLayers] = useState<LayerConfig[]>([
    {
      id: 'agreements',
      label: { tr: 'Anlasmalar', en: 'Agreements' },
      icon: '📄',
      enabled: true,
      color: '#3b82f6',
    },
    {
      id: 'temperature',
      label: METEO_LAYER_META.temperature.label,
      icon: METEO_LAYER_META.temperature.icon,
      enabled: false,
      color: METEO_LAYER_META.temperature.color,
    },
    {
      id: 'precipitation',
      label: METEO_LAYER_META.precipitation.label,
      icon: METEO_LAYER_META.precipitation.icon,
      enabled: false,
      color: METEO_LAYER_META.precipitation.color,
    },
    {
      id: 'drought',
      label: METEO_LAYER_META.drought.label,
      icon: METEO_LAYER_META.drought.icon,
      enabled: false,
      color: METEO_LAYER_META.drought.color,
    },
  ]);

  const handleLayerToggle = (id: string) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, enabled: !layer.enabled } : layer)),
    );
  };

  const meteoEnabled = (type: MeteoLayerType) =>
    layers.find((l) => l.id === type)?.enabled ?? false;

  // ── Map init ──────────────────────────────────────────────────────────────
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

  // ── Toggle agreements cluster layer ───────────────────────────────────────
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

  // ── Update markers when agreements change ─────────────────────────────────
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
      const typeDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:4px;vertical-align:middle;"></span>`;
      marker.bindPopup(
        `<div style="min-width:200px;font-size:13px;">
          <strong>${a.name}</strong><br/>
          <span style="color:#555;">${a.country} · ${a.basin}</span><br/>
          <span>${typeDot}${a.year > 0 ? a.year : '?'} — ${a.purpose || 'No description'}</span><br/>
          <div style="margin-top:6px;">${linkHtml}</div>
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

  // ── Pan to selected ───────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (marker) {
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 5), { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  // ── Meteorology year: clamp to ERA5 availability (1940+) ─────────────────
  const meteoYear = Math.max(currentYear, 1940);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Layer control panel */}
      <LayerControl layers={layers} onLayerToggle={handleLayerToggle} />

      {/* Meteorology overlays — one per type */}
      {METEO_LAYER_IDS.map((type) => (
        <MeteoLayerOverlay
          key={type}
          map={mapRef.current}
          layerType={type}
          year={meteoYear}
          enabled={meteoEnabled(type)}
        />
      ))}

      {/* ERA5 note shown when any meteo layer is active */}
      {METEO_LAYER_IDS.some((t) => meteoEnabled(t)) && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            background: 'rgba(255,255,255,0.88)',
            padding: '5px 10px',
            borderRadius: 6,
            fontSize: 11,
            color: '#374151',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          }}
        >
          {lang === 'tr'
            ? `Meteoroloji verisi: ${meteoYear} | Kaynak: Open-Meteo ERA5`
            : `Met data: ${meteoYear} | Source: Open-Meteo ERA5`}
        </div>
      )}
    </div>
  );
}
