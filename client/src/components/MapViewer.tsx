import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useLanguage } from '@/i18n/LanguageContext';
import type { LayerConfig } from './LayerControl';
import {
  translateTreatyTitle,
  translateBasin,
  translateCountry,
  translatePurpose,
  translateConflict,
} from '@/lib/treatyTranslator';

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

export interface WaterConflict {
  id: string;
  year: number;
  title: string;
  description: string;
  countries: string;
  basin: string;
  latitude: number;
  longitude: number;
  intensity: number; // -7 to +7 BAR Scale
  type: 'conflict' | 'cooperation' | 'mixed';
  source?: string;
}

interface Props {
  agreements: Agreement[];
  conflicts?: WaterConflict[];
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
  currentYear?: number;
  layers?: LayerConfig[];
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

function buildConflictIcon(conflict: WaterConflict, isSelected: boolean): L.DivIcon {
  const isNegative = conflict.intensity < 0;
  const size = isSelected ? 24 : 20;
  const bg = isNegative ? '#dc2626' : conflict.intensity > 0 ? '#16a34a' : '#ea580c';
  const symbol = isNegative ? '⚡' : conflict.intensity > 0 ? '🤝' : '⚖️';
  const shadow = isSelected ? '0 0 10px 3px rgba(220,38,38,0.75)' : '0 2px 6px rgba(0,0,0,0.4)';
  const border = isSelected ? '2px solid #facc15' : '1.5px solid #ffffff';

  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${bg};
      border: ${border};
      box-shadow: ${shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${size * 0.55}px;
      cursor: pointer;
      line-height: 1;
      user-select: none;
    ">${symbol}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function buildPopupLinks(a: Agreement, lang: 'tr' | 'en' = 'tr'): string {
  const links: string[] = [];
  const pdfDownloadText = lang === 'tr' ? '📄 PDF İndir' : '📄 Download PDF';
  const pdfDocText = lang === 'tr' ? '📥 PDF Belgesi' : '📥 PDF Document';
  const searchFaolexText = lang === 'tr' ? 'FAOLEX Ara ↗' : 'Search FAOLEX ↗';

  if (a.pdfUrl) {
    links.push(`<a href="${a.pdfUrl}" target="_blank" style="color:#0369a1;font-weight:600;">${pdfDownloadText}</a>`);
  }
  if (a.githubDocUrl) {
    links.push(`<a href="${a.githubDocUrl}" target="_blank" style="color:#0369a1;font-weight:600;">${pdfDocText}</a>`);
  }
  if (a.faolexUrl) {
    links.push(`<a href="${a.faolexUrl}" target="_blank" style="color:#0284c7;">FAOLEX</a>`);
  }
  const q = encodeURIComponent(a.name.slice(0, 80));
  links.push(`<a href="https://www.fao.org/faolex/results/en/?query=${q}" target="_blank" style="color:#64748b;">${searchFaolexText}</a>`);
  return links.join(' &nbsp;|&nbsp; ');
}

function buildConflictPopup(c: WaterConflict, lang: 'tr' | 'en' = 'tr'): string {
  const cTr = translateConflict(c, lang);
  const intensityColor = c.intensity < 0 ? '#dc2626' : c.intensity > 0 ? '#16a34a' : '#ea580c';
  const intensityLabel =
    c.intensity <= -4
      ? lang === 'tr' ? 'Ağır Uyuşmazlık / Kriz' : 'Severe Dispute / Crisis'
      : c.intensity < 0
      ? lang === 'tr' ? 'Diplomatik / Bölgesel Gerginlik' : 'Diplomatic / Regional Tension'
      : c.intensity > 3
      ? lang === 'tr' ? 'Büyük İşbirliği / Kurum Kuruluşu' : 'Major Cooperation / Institution'
      : lang === 'tr' ? 'Müzakere / Ortak Girişim' : 'Negotiation / Joint Action';

  let sourceHtml = '';
  if (c.source) {
    const urlMatch = c.source.match(/https?:\/\/[^\s)]+/);
    const sourceLabel = lang === 'tr' ? 'Kaynak' : 'Source';
    const litLabel = lang === 'tr' ? 'Literatür Bağlantısı ↗' : 'Literature Link ↗';
    if (urlMatch) {
      sourceHtml = `<div style="margin-top:6px;font-size:11px;color:#64748b;border-top:1px dashed #e2e8f0;padding-top:4px;">
        ${sourceLabel}: <a href="${urlMatch[0]}" target="_blank" style="color:#0284c7;text-decoration:underline;">${litLabel}</a>
      </div>`;
    } else {
      sourceHtml = `<div style="margin-top:6px;font-size:11px;color:#64748b;border-top:1px dashed #e2e8f0;padding-top:4px;">${sourceLabel}: ${c.source}</div>`;
    }
  }

  return `
    <div style="font-family:sans-serif;font-size:12px;line-height:1.45;max-width:280px;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <span style="background:${intensityColor};color:#fff;padding:1px 6px;border-radius:4px;font-weight:700;font-size:10.5px;">
          BAR: ${c.intensity > 0 ? '+' + c.intensity : c.intensity}
        </span>
        <span style="font-weight:700;font-size:11px;color:${intensityColor};">${intensityLabel}</span>
      </div>
      <div style="font-weight:700;font-size:13.5px;color:#0f172a;margin-bottom:4px;line-height:1.25;">
        ${cTr.title}
      </div>
      <div style="color:#475569;margin-bottom:6px;font-size:11.5px;">
        📅 <strong>${c.year}</strong> &nbsp;·&nbsp; 📍 ${cTr.countries} &nbsp;·&nbsp; 🌊 ${cTr.basin}
      </div>
      <div style="color:#1e293b;background:#f8fafc;padding:8px 10px;border-radius:6px;border:1px solid #e2e8f0;font-size:12px;line-height:1.45;">
        ${cTr.description}
      </div>
      ${sourceHtml}
    </div>
  `;
}

export default function MapViewer({ agreements, conflicts = [], selectedId, onMarkerClick, layers }: Props) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const agreementClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const conflictClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Map init
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [25, 20],
      zoom: 3,
      zoomControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | TFDD Oregon State Univ.',
      maxZoom: 18,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Agreement markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (agreementClusterRef.current) {
      map.removeLayer(agreementClusterRef.current);
    }

    const agreementsLayer = layers?.find((l) => l.id === 'agreements');
    if (agreementsLayer && !agreementsLayer.enabled) {
      return;
    }

    const cluster = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 40 });
    agreements.forEach((a) => {
      const isSelected = a.id === selectedId;
      const color = deriveAgreementColor(a.purpose, isSelected);
      const icon = buildMarkerIcon(color, isSelected);
      const marker = L.marker([a.latitude, a.longitude], { icon, title: a.name });
      const linkHtml = buildPopupLinks(a, lang);
      const nameTr = translateTreatyTitle(a.name, lang);
      const countryTr = translateCountry(a.country, lang);
      const basinTr = translateBasin(a.basin, lang);
      const purposeTr = translatePurpose(a.purpose, lang);
      const dateLabel = a.year > 0 ? a.year : (lang === 'tr' ? 'Tarih Belirsiz' : 'Date Unknown');
      const typeDot = `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${color};margin-right:6px;"></span>`;
      marker.bindPopup(
        `<div style="font-family:sans-serif;font-size:12px;line-height:1.4;max-width:260px;">
          <div style="font-weight:700;font-size:13px;color:#0f172a;margin-bottom:4px;">${nameTr}</div>
          <div style="color:#475569;margin-bottom:4px;">📍 ${countryTr} &nbsp;·&nbsp; 🌊 ${basinTr}</div>
          <div style="margin-bottom:6px;display:flex;align-items:center;">${typeDot}<strong>${dateLabel}</strong> &nbsp;—&nbsp; <span style="color:#64748b;">${purposeTr}</span></div>
          <div style="border-top:1px solid #e2e8f0;padding-top:6px;margin-top:6px;">${linkHtml}</div>
        </div>`,
      );
      marker.on('click', () => onMarkerClick?.(a.id));
      cluster.addLayer(marker);
      markersRef.current.set(a.id, marker);
    });
    map.addLayer(cluster);
    agreementClusterRef.current = cluster;
  }, [agreements, selectedId, onMarkerClick, layers, lang]);

  // Update Conflict markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (conflictClusterRef.current) {
      map.removeLayer(conflictClusterRef.current);
    }

    const conflictsLayer = layers?.find((l) => l.id === 'conflicts');
    if (conflictsLayer && !conflictsLayer.enabled) {
      return;
    }

    const cluster = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 35 });
    conflicts.forEach((c) => {
      if (!c.latitude || !c.longitude) return;
      const isSelected = c.id === selectedId;
      const icon = buildConflictIcon(c, isSelected);
      const marker = L.marker([c.latitude, c.longitude], { icon, title: c.title, zIndexOffset: 500 });
      marker.bindPopup(buildConflictPopup(c, lang));
      marker.on('click', () => onMarkerClick?.(c.id));
      cluster.addLayer(marker);
      markersRef.current.set(c.id, marker);
    });
    map.addLayer(cluster);
    conflictClusterRef.current = cluster;
  }, [conflicts, selectedId, onMarkerClick, layers, lang]);

  // Pan to selected marker
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
