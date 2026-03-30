import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { t } from '@/i18n/translations';
import type { Lang } from '@/i18n/translations';
import { loadPrecipitation, loadFloodData, precipLegend, floodLegend } from '@/lib/weatherLayer';
import HistoricalPrecipPanel from './HistoricalPrecipPanel';

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
  faolexUrl?: string;
  githubDocUrl?: string;
}

interface MapViewerProps {
  agreements: Agreement[];
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
  lang?: Lang;
}

type MarkerType = L.CircleMarker | L.Marker;

// Overpass API query for water infrastructure
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function buildOverpassQuery(bounds: L.LatLngBounds): string {
  const s = bounds.getSouth();
  const w = bounds.getWest();
  const n = bounds.getNorth();
  const e = bounds.getEast();
  const bbox = `${s},${w},${n},${e}`;
  return `[out:json][timeout:15];
(
  node["waterway"="dam"](${bbox});
  way["waterway"="dam"](${bbox});
  node["waterway"="weir"](${bbox});
  way["waterway"="weir"](${bbox});
  node["man_made"="water_tower"](${bbox});
  node["man_made"="water_well"](${bbox});
  node["man_made"="watermill"](${bbox});
  node["man_made"="water_works"](${bbox});
  way["man_made"="water_works"](${bbox});
  way["landuse"="reservoir"](${bbox});
  relation["landuse"="reservoir"](${bbox});
  way["waterway"="canal"](${bbox});
  way["waterway"="river"](${bbox});
);
out center 500;`;
}

interface WaterFeature {
  id: number;
  type: string;
  name: string;
  lat: number;
  lng: number;
}

function categorizeFeature(tags: Record<string, string>): string {
  if (tags.waterway === 'dam') return 'dam';
  if (tags.waterway === 'weir') return 'weir';
  if (tags.man_made === 'water_tower') return 'waterTower';
  if (tags.man_made === 'water_well') return 'waterWell';
  if (tags.man_made === 'water_works') return 'waterworks';
  if (tags.man_made === 'watermill') return 'waterworks';
  if (tags.landuse === 'reservoir') return 'reservoir';
  if (tags.waterway === 'canal') return 'canal';
  if (tags.waterway === 'river') return 'waterway';
  return 'waterway';
}

const WATER_ICONS: Record<string, { color: string; icon: string }> = {
  dam:        { color: '#DC2626', icon: '\u{1F3D7}' },  // 🏗
  weir:       { color: '#EA580C', icon: '\u{1F4A7}' },  // 💧
  waterTower: { color: '#7C3AED', icon: '\u{1F3E2}' },  // 🏢
  waterWell:  { color: '#2563EB', icon: '\u{1F4A7}' },  // 💧
  waterworks: { color: '#059669', icon: '\u{2699}' },   // ⚙
  reservoir:  { color: '#0284C7', icon: '\u{1F30A}' },  // 🌊
  canal:      { color: '#0891B2', icon: '\u{1F6E4}' },  // 🛤
  waterway:   { color: '#0EA5E9', icon: '\u{1F30A}' },  // 🌊
};

export default function MapViewer({ agreements, selectedId, onMarkerClick, lang = 'tr' }: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerCluster = useRef<L.MarkerClusterGroup | null>(null);
  const markers = useRef<Map<string, MarkerType>>(new Map());
  const waterLayer = useRef<L.LayerGroup | null>(null);
  const [waterEnabled, setWaterEnabled] = useState(false);
  const [waterLoading, setWaterLoading] = useState(false);
  const [waterCount, setWaterCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastBoundsRef = useRef<string>('');

  // Precipitation & Flood layers
  const precipLayer = useRef<L.LayerGroup | null>(null);
  const floodLayer = useRef<L.LayerGroup | null>(null);
  const [precipEnabled, setPrecipEnabled] = useState(false);
  const [floodEnabled, setFloodEnabled] = useState(false);
  const [precipLoading, setPrecipLoading] = useState(false);
  const [floodLoading, setFloodLoading] = useState(false);
  const [precipCount, setPrecipCount] = useState(0);
  const [floodCount, setFloodCount] = useState(0);
  const precipAbort = useRef<AbortController | null>(null);
  const floodAbort = useRef<AbortController | null>(null);

  // Conflict/cooperation layer
  const conflictLayer = useRef<L.LayerGroup | null>(null);
  const [conflictEnabled, setConflictEnabled] = useState(false);
  const [conflictLoading, setConflictLoading] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);

  // Historical precipitation query
  const [histPoint, setHistPoint] = useState<{ lat: number; lng: number } | null>(null);

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

      // Right-click / long-press: open historical precip query
      map.current.on('contextmenu', (e: L.LeafletMouseEvent) => {
        setHistPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
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

      const pdfLink = agreement.pdfUrl
        ? `<a href="${agreement.pdfUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;padding:4px 10px;background:#0369A1;color:#fff;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none;">&#128196; ${t('popup.download', lang)}</a>`
        : '';
      const faolexLink = agreement.faolexUrl
        ? `<a href="${agreement.faolexUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;margin-top:4px;padding:4px 10px;background:#059669;color:#fff;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none;">FAOLEX</a>`
        : '';
      const ghDocLink = agreement.githubDocUrl
        ? `<a href="${agreement.githubDocUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;margin-top:4px;padding:4px 10px;background:#6D28D9;color:#fff;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none;">PDF</a>`
        : '';

      circleMarker.bindPopup(`
        <div class="p-3 w-64">
          <h3 class="font-bold text-sm text-slate-900">${agreement.name}</h3>
          <p class="text-xs text-slate-600 mt-1">${agreement.country} • ${agreement.basin}</p>
          <p class="text-xs text-slate-500 mt-2">${agreement.purpose}</p>
          <p class="text-xs text-slate-400 mt-1">${t('popup.year', lang)}: ${agreement.year}</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap">${pdfLink}${faolexLink}${ghDocLink}</div>
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
  }, [agreements, selectedId, onMarkerClick, lang]);

  // Highlight selected marker and open its popup
  useEffect(() => {
    if (selectedId && map.current && markerCluster.current) {
      const marker = markers.current.get(selectedId);
      if (marker && 'setStyle' in marker) {
        const cm = marker as L.CircleMarker;
        cm.setStyle({ fillColor: '#0369A1' });
        const latlng = cm.getLatLng();

        // Zoom to marker, then spiderfy cluster and open popup
        markerCluster.current.zoomToShowLayer(cm, () => {
          map.current?.setView(latlng, Math.max(map.current.getZoom(), 10), {
            animate: true,
            duration: 0.5,
          });
          setTimeout(() => cm.openPopup(), 300);
        });
      }
    }
  }, [selectedId]);

  // Overpass water layer loader
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    if (!waterLayer.current) {
      waterLayer.current = L.layerGroup();
    }

    if (waterEnabled) {
      waterLayer.current.addTo(m);
    } else {
      waterLayer.current.remove();
      setWaterCount(0);
      return;
    }

    const loadWaterFeatures = async () => {
      const zoom = m.getZoom();
      if (zoom < 10) {
        waterLayer.current?.clearLayers();
        setWaterCount(0);
        return;
      }

      const bounds = m.getBounds();
      const boundsKey = bounds.toBBoxString();
      if (boundsKey === lastBoundsRef.current) return;
      lastBoundsRef.current = boundsKey;

      // Abort previous request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setWaterLoading(true);
      try {
        const query = buildOverpassQuery(bounds);
        const res = await fetch(OVERPASS_URL, {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Overpass error');
        const data = await res.json();

        waterLayer.current?.clearLayers();

        const features: WaterFeature[] = [];
        for (const el of data.elements || []) {
          const lat = el.lat ?? el.center?.lat;
          const lng = el.lon ?? el.center?.lon;
          if (!lat || !lng) continue;
          const tags = el.tags || {};
          const cat = categorizeFeature(tags);
          const name = tags.name || tags['name:en'] || tags['name:tr'] || '';
          features.push({ id: el.id, type: cat, name, lat, lng });
        }

        for (const feat of features) {
          const style = WATER_ICONS[feat.type] || WATER_ICONS.waterway;
          const catKey = `layer.${feat.type}` as any;
          const catLabel = t(catKey, lang) || feat.type;

          const marker = L.circleMarker([feat.lat, feat.lng], {
            radius: 6,
            fillColor: style.color,
            color: '#fff',
            weight: 1.5,
            opacity: 0.9,
            fillOpacity: 0.7,
          });

          const popupContent = `
            <div style="min-width:160px">
              <div style="font-size:11px;font-weight:700;color:${style.color};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">
                ${style.icon} ${catLabel}
              </div>
              ${feat.name ? `<div style="font-size:13px;font-weight:600;color:#1e293b">${feat.name}</div>` : ''}
              <div style="font-size:10px;color:#94a3b8;margin-top:4px">
                ${feat.lat.toFixed(4)}, ${feat.lng.toFixed(4)}
              </div>
            </div>
          `;
          marker.bindPopup(popupContent);
          waterLayer.current?.addLayer(marker);
        }

        setWaterCount(features.length);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Overpass query failed:', err);
        }
      } finally {
        setWaterLoading(false);
      }
    };

    loadWaterFeatures();
    m.on('moveend', loadWaterFeatures);
    return () => {
      m.off('moveend', loadWaterFeatures);
    };
  }, [waterEnabled, lang]);

  // ── Precipitation layer ──
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;
    if (!precipLayer.current) precipLayer.current = L.layerGroup();

    if (precipEnabled) {
      precipLayer.current.addTo(m);
    } else {
      precipLayer.current.remove();
      setPrecipCount(0);
      return;
    }

    const load = async () => {
      precipAbort.current?.abort();
      const ctrl = new AbortController();
      precipAbort.current = ctrl;
      setPrecipLoading(true);
      try {
        const count = await loadPrecipitation(m, precipLayer.current!, lang, ctrl.signal);
        setPrecipCount(count);
      } catch (e: any) {
        if (e.name !== 'AbortError') console.warn('Precip error:', e);
      } finally {
        setPrecipLoading(false);
      }
    };

    load();
    m.on('moveend', load);
    return () => { m.off('moveend', load); };
  }, [precipEnabled, lang]);

  // ── Flood layer ──
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;
    if (!floodLayer.current) floodLayer.current = L.layerGroup();

    if (floodEnabled) {
      floodLayer.current.addTo(m);
    } else {
      floodLayer.current.remove();
      setFloodCount(0);
      return;
    }

    const load = async () => {
      floodAbort.current?.abort();
      const ctrl = new AbortController();
      floodAbort.current = ctrl;
      setFloodLoading(true);
      try {
        const count = await loadFloodData(m, floodLayer.current!, lang, ctrl.signal);
        setFloodCount(count);
      } catch (e: any) {
        if (e.name !== 'AbortError') console.warn('Flood error:', e);
      } finally {
        setFloodLoading(false);
      }
    };

    load();
    m.on('moveend', load);
    return () => { m.off('moveend', load); };
  }, [floodEnabled, lang]);

  // ── Conflict/cooperation layer ──
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;
    if (!conflictLayer.current) conflictLayer.current = L.layerGroup();

    if (conflictEnabled) {
      conflictLayer.current.addTo(m);
    } else {
      conflictLayer.current.remove();
      setConflictCount(0);
      return;
    }

    const loadConflicts = async () => {
      setConflictLoading(true);
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const res = await fetch(`${baseUrl}data/water_conflicts.json`);
        if (!res.ok) throw new Error('Failed to load conflict data');
        const events = await res.json();

        conflictLayer.current?.clearLayers();

        const barColor = (intensity: number): string => {
          if (intensity <= -5) return '#7F1D1D'; // dark red
          if (intensity <= -3) return '#DC2626'; // red
          if (intensity <= -1) return '#F97316'; // orange
          if (intensity === 0) return '#94A3B8'; // gray
          if (intensity <= 2) return '#60A5FA';  // light blue
          if (intensity <= 4) return '#22C55E';  // green
          return '#059669';                       // dark green
        };

        const barLabel = (intensity: number): string => {
          if (lang === 'tr') {
            if (intensity <= -5) return 'Sava\u015f Eylemi';
            if (intensity <= -3) return 'Askeri/Diplomatik D\u00fc\u015fmanl\u0131k';
            if (intensity <= -1) return 'S\u00f6zl\u00fc D\u00fc\u015fmanl\u0131k';
            if (intensity === 0) return 'N\u00f6tr';
            if (intensity <= 2) return 'S\u00f6zl\u00fc Destek';
            if (intensity <= 4) return 'Anla\u015fma/\u0130\u015fbirli\u011fi';
            return 'Stratejik \u0130ttifak';
          }
          if (intensity <= -5) return 'War Act';
          if (intensity <= -3) return 'Military/Diplomatic Hostility';
          if (intensity <= -1) return 'Verbal Hostility';
          if (intensity === 0) return 'Neutral';
          if (intensity <= 2) return 'Verbal Support';
          if (intensity <= 4) return 'Agreement/Cooperation';
          return 'Strategic Alliance';
        };

        for (const event of events) {
          const color = barColor(event.intensity);
          const radius = Math.max(6, Math.min(12, Math.abs(event.intensity) * 1.5 + 4));

          const marker = L.circleMarker([event.latitude, event.longitude], {
            radius,
            fillColor: color,
            color: event.intensity < -3 ? '#450A0A' : event.intensity > 3 ? '#064E3B' : '#fff',
            weight: event.intensity < -3 || event.intensity > 3 ? 2 : 1,
            opacity: 0.9,
            fillOpacity: 0.75,
          });

          const typeIcon = event.type === 'conflict' ? '\u2694\uFE0F' : event.type === 'cooperation' ? '\uD83E\uDD1D' : '\u26A0\uFE0F';
          const intensityBar = `<div style="display:inline-block;width:${Math.abs(event.intensity)*12}px;height:6px;background:${color};border-radius:3px;margin:0 4px"></div>`;

          marker.bindPopup(`
            <div style="min-width:220px;max-width:280px">
              <div style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.5px">
                ${typeIcon} ${barLabel(event.intensity)}
              </div>
              <div style="font-size:14px;font-weight:700;color:#1e293b;margin:4px 0">${event.title}</div>
              <div style="font-size:11px;color:#475569;line-height:1.4">${event.description}</div>
              <div style="margin-top:6px;font-size:10px;color:#64748b">
                <div>\uD83D\uDCC5 ${event.year} &nbsp; \uD83C\uDF0D ${event.countries}</div>
                <div>\uD83C\uDF0A ${event.basin}</div>
                <div style="margin-top:4px">BAR: <strong>${event.intensity > 0 ? '+' : ''}${event.intensity}</strong> ${intensityBar}</div>
              </div>
              <div style="font-size:9px;color:#94a3b8;margin-top:4px;font-style:italic">${event.source}</div>
            </div>
          `);

          conflictLayer.current?.addLayer(marker);
        }

        setConflictCount(events.length);
      } catch (err) {
        console.warn('Conflict data error:', err);
      } finally {
        setConflictLoading(false);
      }
    };

    loadConflicts();
  }, [conflictEnabled, lang]);

  return (
    <div className="relative h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-full">
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: '100%', width: '100%' }}
      />

      {/* Layer Controls */}
      <div className="absolute top-20 right-3 z-[1000] flex flex-col gap-2 max-w-[200px]">
        <button
          onClick={() => setWaterEnabled(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold transition-all border ${
            waterEnabled
              ? 'bg-sky-600 text-white border-sky-700 hover:bg-sky-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title={t('layer.waterInfra', lang)}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          {t('layer.waterInfra', lang)}
        </button>

        {/* Status indicator */}
        {waterEnabled && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-600">
            {waterLoading ? (
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                {t('layer.loading', lang)}
              </div>
            ) : map.current && map.current.getZoom() < 10 ? (
              <span className="text-amber-600">{t('layer.zoomIn', lang)}</span>
            ) : waterCount > 0 ? (
              <div className="space-y-1">
                <span className="font-semibold text-sky-700">
                  {t('layer.results', lang, { count: waterCount })}
                </span>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                  {Object.entries(WATER_ICONS).slice(0, 6).map(([key, val]) => (
                    <span key={key} className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: val.color }} />
                      <span>{t(`layer.${key}` as any, lang)}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <span>{t('layer.results', lang, { count: 0 })}</span>
            )}
          </div>
        )}

        {/* Precipitation Toggle */}
        <button
          onClick={() => setPrecipEnabled(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold transition-all border ${
            precipEnabled
              ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9" />
            <path d="M9 20l3 3 3-3" />
          </svg>
          {t('layer.precipitation', lang)}
        </button>

        {precipEnabled && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-600">
            {precipLoading ? (
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                {t('layer.precipLoading', lang)}
              </div>
            ) : precipCount > 0 ? (
              <div className="space-y-1">
                <span className="font-semibold text-blue-700">{t('layer.precipResults', lang, { count: precipCount })}</span>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5" dangerouslySetInnerHTML={{ __html: precipLegend(lang) }} />
              </div>
            ) : (
              <span className="text-slate-400">{t('layer.precipResults', lang, { count: 0 })}</span>
            )}
          </div>
        )}

        {/* Flood Toggle */}
        <button
          onClick={() => setFloodEnabled(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold transition-all border ${
            floodEnabled
              ? 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 15c6.667-6 13.333 0 20-6" />
            <path d="M2 19c6.667-6 13.333 0 20-6" />
          </svg>
          {t('layer.flood', lang)}
        </button>

        {floodEnabled && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-600">
            {floodLoading ? (
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                {t('layer.floodLoading', lang)}
              </div>
            ) : floodCount > 0 ? (
              <div className="space-y-1">
                <span className="font-semibold text-amber-700">{t('layer.floodResults', lang, { count: floodCount })}</span>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5" dangerouslySetInnerHTML={{ __html: floodLegend(lang) }} />
                <span className="text-[9px] text-slate-400 block mt-1">{t('layer.dataSource', lang)}</span>
              </div>
            ) : (
              <span className="text-slate-400">{t('layer.floodResults', lang, { count: 0 })}</span>
            )}
          </div>
        )}
        {/* Conflict/Cooperation Toggle */}
        <button
          onClick={() => setConflictEnabled(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold transition-all border ${
            conflictEnabled
              ? 'bg-red-700 text-white border-red-800 hover:bg-red-800'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 7v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          {t('layer.conflicts', lang)}
        </button>

        {conflictEnabled && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-600">
            {conflictLoading ? (
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                {t('layer.conflictsLoading', lang)}
              </div>
            ) : conflictCount > 0 ? (
              <div className="space-y-1">
                <span className="font-semibold text-red-700">{t('layer.conflictsResults', lang, { count: conflictCount })}</span>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                  {[
                    { color: '#7F1D1D', label: lang === 'tr' ? 'Savaş (-6/-5)' : 'War (-6/-5)' },
                    { color: '#DC2626', label: lang === 'tr' ? 'Düşmanlık (-4/-3)' : 'Hostility (-4/-3)' },
                    { color: '#F97316', label: lang === 'tr' ? 'Sözel (-2/-1)' : 'Verbal (-2/-1)' },
                    { color: '#94A3B8', label: lang === 'tr' ? 'Nötr (0)' : 'Neutral (0)' },
                    { color: '#60A5FA', label: lang === 'tr' ? 'Destek (+1/+2)' : 'Support (+1/+2)' },
                    { color: '#22C55E', label: lang === 'tr' ? 'İşbirliği (+3/+4)' : 'Cooperation (+3/+4)' },
                    { color: '#059669', label: lang === 'tr' ? 'İttifak (+5/+6)' : 'Alliance (+5/+6)' },
                  ].map(item => (
                    <span key={item.color} className="inline-flex items-center gap-1">
                      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                      <span className="text-[9px]">{item.label}</span>
                    </span>
                  ))}
                </div>
                <span className="text-[9px] text-slate-400 block mt-1">{t('layer.conflictSrc', lang)}</span>
              </div>
            ) : (
              <span className="text-slate-400">{t('layer.conflictsResults', lang, { count: 0 })}</span>
            )}
          </div>
        )}

        {/* Historical precipitation hint */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow border border-slate-200 px-2.5 py-1.5 text-[9px] text-slate-500 text-center leading-snug">
          {lang === 'tr'
            ? '📊 Sağ tık → Tarihi yağış sorgusu'
            : '📊 Right-click → Historical precipitation'}
        </div>
      </div>

      {/* Historical Precipitation Panel */}
      {histPoint && (
        <HistoricalPrecipPanel
          lat={histPoint.lat}
          lng={histPoint.lng}
          onClose={() => setHistPoint(null)}
        />
      )}
    </div>
  );
}
