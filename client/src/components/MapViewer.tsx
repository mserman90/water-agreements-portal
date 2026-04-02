import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
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
  currentYear?: number;
}

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function deriveAgreementColor(purpose: string, isSelected: boolean): string {
  const p = purpose.toLowerCase();
  const isConflict =
    p.includes('conflict') ||
    p.includes('dispute') ||
    p.includes('war') ||
    p.includes('protest');
  const isCoop =
    p.includes('cooper') ||
    p.includes('alloc') ||
    p.includes('joint') ||
    p.includes('agreement') ||
    p.includes('treaty');
  if (isSelected) return '#facc15';
  if (isConflict && isCoop) return '#eab308';
  if (isConflict) return '#ef4444';
  return '#22c55e';
}

function buildMarkerIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 14 : 10;
  const border = isSelected ? '2px solid #fff' : '1.5px solid rgba(255,255,255,0.7)';
  const shadow = isSelected
    ? '0 0 6px 2px rgba(250,204,21,0.8)'
    : '0 1px 3px rgba(0,0,0,0.4)';
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border};box-shadow:${shadow};"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function buildPopupLinks(a: Agreement): string {
  const links: string[] = [];
  if (a.pdfUrl) {
    links.push(`<a href="${a.pdfUrl}" target="_blank">📄 PDF ↓</a>`);
  }
  if (a.githubDocUrl) {
    links.push(`<a href="${a.githubDocUrl}" target="_blank">📥 PDF</a>`);
  }
  if (a.faolexUrl) {
    links.push(`<a href="${a.faolexUrl}" target="_blank">FAOLEX</a>`);
  }
  const q = encodeURIComponent(a.name.slice(0, 80));
  links.push(`<a href="https://www.fao.org/faolex/results/en/?query=${q}" target="_blank">FAOLEX Ara</a>`);
  return links.join(' | ');
}

export default function MapViewer({ agreements, selectedId, onMarkerClick }: Props) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Map init
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

  // Update markers when agreements change
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
      const typeDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:4px;"></span>`;
      marker.bindPopup(
        `<b>${a.name}</b><br/>${a.country} · ${a.basin}<br/>${typeDot}${a.year > 0 ? a.year : '?'} — ${a.purpose || 'No description'}<br/>${linkHtml}`,
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
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
