import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { t } from '@/i18n/translations';
import type { Lang } from '@/i18n/translations';

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

  return (
    <div className="relative h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-full">
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: '100%', width: '100%' }}
      />

      {/* Water Infrastructure Toggle */}
      <div className="absolute top-20 right-3 z-[1000] flex flex-col gap-2">
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
      </div>
    </div>
  );
}
