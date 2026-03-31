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
  dam: { color: '#DC2626', icon: '🏗' },
  weir: { color: '#EA580C', icon: '💧' },
  waterTower: { color: '#7C3AED', icon: '🏢' },
  waterWell: { color: '#2563EB', icon: '💧' },
  waterworks: { color: '#059669', icon: '⚙' },
  reservoir: { color: '#0284C7', icon: '🌊' },
  canal: { color: '#0891B2', icon: '🛤' },
  waterway: { color: '#0EA5E9', icon: '🌊' },
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

  // Historical precipitation query
  const [histPoint, setHistPoint] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      markerCluster.current = L.markerClusterGroup();
      map.current.addLayer(markerCluster.current);

      map.current.on('contextmenu', (e: L.LeafletMouseEvent) => {
        setHistPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    markers.current.forEach(marker => {
      markerCluster.current?.removeLayer(marker);
    });
    markers.current.clear();

    agreements.forEach(agreement => {
      const circleMarker = L.circleMarker([agreement.latitude, agreement.longitude], {
        radius: 8,
        fillColor: selectedId === agreement.id ? '#0369A1' : '#06B6D4',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      });

      const pdfLink = agreement.pdfUrl ? `[📄 ${t('popup.download', lang)}](${agreement.pdfUrl})` : '';
      const faolexLink = agreement.faolexUrl ? `[FAOLEX](${agreement.faolexUrl})` : '';
      const ghDocLink = agreement.githubDocUrl ? `[PDF](${agreement.githubDocUrl})` : '';

      circleMarker.bindPopup(`
### ${agreement.name}
${agreement.country} • ${agreement.basin}
${agreement.purpose}
${t('popup.year', lang)}: ${agreement.year}
${pdfLink}${faolexLink}${ghDocLink}
      `);

      circleMarker.on('click', () => {
        onMarkerClick?.(agreement.id);
        circleMarker.openPopup();
      });

      markerCluster.current?.addLayer(circleMarker);
      markers.current.set(agreement.id, circleMarker);
    });

    if (agreements.length > 0) {
      const group = new L.FeatureGroup(Array.from(markers.current.values()));
      map.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [agreements, selectedId, onMarkerClick, lang]);

  useEffect(() => {
    if (selectedId && map.current && markerCluster.current) {
      const marker = markers.current.get(selectedId);
      if (marker && 'setStyle' in marker) {
        const cm = marker as L.CircleMarker;
        cm.setStyle({ fillColor: '#0369A1' });
        const latlng = cm.getLatLng();

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
${style.icon} ${catLabel}
${feat.name ? `

${feat.name}

` : ''}
${feat.lat.toFixed(4)}, ${feat.lng.toFixed(4)}
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

    return () => {
      m.off('moveend', load);
    };
  }, [precipEnabled, lang]);

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

    return () => {
      m.off('moveend', load);
    };
  }, [floodEnabled, lang]);

  return (
    <div className="relative w-full h-full bg-slate-100">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
        {/* Water Infrastructure Toggle */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => setWaterEnabled(prev => !prev)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold transition-all border ${
              waterEnabled
                ? 'bg-sky-600 text-white border-sky-700 hover:bg-sky-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title={t('layer.waterInfra', lang)}
          >
            {t('layer.waterInfra', lang)}
            {/* Status indicator */}
            {waterEnabled && (
              <div className="flex items-center gap-1.5 ml-1 px-1.5 py-0.5 bg-white/20 rounded-md">
                <div className={`w-1.5 h-1.5 rounded-full ${waterLoading ? 'bg-white animate-pulse' : 'bg-emerald-300'}`} />
              </div>
            )}
          </button>

          {waterEnabled && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2 shadow-xl w-48 animate-in fade-in slide-in-from-top-2">
              {waterLoading ? (
                <div className="flex items-center justify-center py-2 gap-2 text-slate-500 text-[10px]">
                  <div className="w-3 h-3 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin" />
                  {t('layer.loading', lang)}
                </div>
              ) : map.current && map.current.getZoom() < 10 ? (
                <div className="text-[10px] text-amber-600 font-medium text-center py-1">
                  ⚠️ {t('layer.zoomIn', lang)}
                </div>
              ) : waterCount > 0 ? (
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold border-b border-slate-100 pb-1 flex justify-between">
                    <span>{t('layer.results', lang, { count: waterCount })}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(WATER_ICONS).slice(0, 6).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-1.5 text-[9px] text-slate-600">
                        <span style={{ color: val.color }}>{val.icon}</span>
                        <span className="truncate">{t(`layer.${key}` as any, lang)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 text-center py-1">
                  {t('layer.results', lang, { count: 0 })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Precipitation Toggle */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => setPrecipEnabled(prev => !prev)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold transition-all border ${
              precipEnabled
                ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t('layer.precipitation', lang)}
            {precipEnabled && (
              <div className="flex items-center gap-1.5 ml-1 px-1.5 py-0.5 bg-white/20 rounded-md">
                <div className={`w-1.5 h-1.5 rounded-full ${precipLoading ? 'bg-white animate-pulse' : 'bg-blue-300'}`} />
              </div>
            )}
          </button>

          {precipEnabled && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2 shadow-xl w-48">
              {precipLoading ? (
                <div className="flex items-center justify-center py-2 gap-2 text-slate-500 text-[10px]">
                  <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                  {t('layer.precipLoading', lang)}
                </div>
              ) : precipCount > 0 ? (
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold border-b border-slate-100 pb-1">
                    {t('layer.precipResults', lang, { count: precipCount })}
                  </div>
                  {precipLegend(lang)}
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 text-center py-1">
                  {t('layer.precipResults', lang, { count: 0 })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Flood Toggle */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => setFloodEnabled(prev => !prev)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-xs font-semibold transition-all border ${
              floodEnabled
                ? 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t('layer.flood', lang)}
            {floodEnabled && (
              <div className="flex items-center gap-1.5 ml-1 px-1.5 py-0.5 bg-white/20 rounded-md">
                <div className={`w-1.5 h-1.5 rounded-full ${floodLoading ? 'bg-white animate-pulse' : 'bg-amber-300'}`} />
              </div>
            )}
          </button>

          {floodEnabled && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2 shadow-xl w-48">
              {floodLoading ? (
                <div className="flex items-center justify-center py-2 gap-2 text-slate-500 text-[10px]">
                  <div className="w-3 h-3 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin" />
                  {t('layer.floodLoading', lang)}
                </div>
              ) : floodCount > 0 ? (
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold border-b border-slate-100 pb-1">
                    {t('layer.floodResults', lang, { count: floodCount })}
                  </div>
                  {floodLegend(lang)}
                  <div className="text-[8px] text-slate-400 pt-1 italic">
                    {t('layer.dataSource', lang)}
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 text-center py-1">
                  {t('layer.floodResults', lang, { count: 0 })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Historical precipitation hint */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-md pointer-events-none">
        <p className="text-[10px] font-bold text-slate-600 flex items-center gap-2">
          {lang === 'tr' ? '📊 Sağ tık → Tarihi yağış sorgusu' : '📊 Right-click → Historical precipitation'}
        </p>
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
