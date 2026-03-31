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

// Overpass API query for comprehensive water infrastructure
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function buildOverpassQuery(bounds: L.LatLngBounds): string {
  const s = bounds.getSouth();
  const w = bounds.getWest();
  const n = bounds.getNorth();
  const e = bounds.getEast();
  const bbox = `${s},${w},${n},${e}`;
  return `[out:json][timeout:25];
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
  node["man_made"="pumping_station"](${bbox});
  way["man_made"="pumping_station"](${bbox});
  node["man_made"="water_treatment_plant"](${bbox});
  way["man_made"="water_treatment_plant"](${bbox});
  node["man_made"="wastewater_plant"](${bbox});
  way["man_made"="wastewater_plant"](${bbox});
  node["waterway"="lock_gate"](${bbox});
  way["waterway"="lock_gate"](${bbox});
  node["waterway"="waterfall"](${bbox});
  way["landuse"="reservoir"](${bbox});
  relation["landuse"="reservoir"](${bbox});
  way["waterway"="canal"](${bbox});
  way["waterway"="river"](${bbox});
  way["waterway"="stream"](${bbox});
  node["natural"="spring"](${bbox});
  node["natural"="hot_spring"](${bbox});
  way["natural"="wetland"](${bbox});
  relation["natural"="wetland"](${bbox});
  node["amenity"="water_point"](${bbox});
  node["man_made"="monitoring_station"]["monitoring:water_level"="yes"](${bbox});
);
out geom 500;`;
}

interface WaterFeature {
  id: number;
  osmType: string; // 'node' | 'way' | 'relation'
  type: string;
  name: string;
  lat: number;
  lng: number;
  tags: Record<string, string>;
  geometry?: Array<{ lat: number; lng: number }>;
}

function categorizeFeature(tags: Record<string, string>): string {
  if (tags.waterway === 'dam') return 'dam';
  if (tags.waterway === 'weir') return 'weir';
  if (tags.man_made === 'water_tower') return 'waterTower';
  if (tags.man_made === 'water_well') return 'waterWell';
  if (tags.man_made === 'water_works') return 'waterworks';
  if (tags.man_made === 'pumping_station') return 'pumpingStation';
  if (tags.man_made === 'water_treatment_plant' || tags.man_made === 'wastewater_plant') return 'waterTreatment';
  if (tags.waterway === 'lock_gate') return 'waterGate';
  if (tags.waterway === 'waterfall') return 'waterfall';
  if (tags.man_made === 'watermill') return 'waterworks';
  if (tags.landuse === 'reservoir') return 'reservoir';
  if (tags.waterway === 'canal') return 'canal';
  if (tags.natural === 'spring' || tags.natural === 'hot_spring') return 'spring';
  if (tags.natural === 'wetland') return 'wetland';
  if (tags.amenity === 'water_point') return 'waterWell';
  if (tags['monitoring:water_level'] === 'yes') return 'gauging';
  if (tags.waterway === 'river' || tags.waterway === 'stream') return 'waterway';
  return 'waterway';
}

const WATER_ICONS: Record<string, { color: string; icon: string }> = {
  dam: { color: '#DC2626', icon: '🏗' },
  weir: { color: '#EA580C', icon: '💧' },
  waterTower: { color: '#7C3AED', icon: '🏢' },
  waterWell: { color: '#2563EB', icon: '💧' },
  waterworks: { color: '#059669', icon: '⚙' },
  pumpingStation: { color: '#8B5CF6', icon: '⛽' },
  waterTreatment: { color: '#10B981', icon: '🏭' },
  waterGate: { color: '#F59E0B', icon: '🚪' },
  waterfall: { color: '#06B6D4', icon: '🌊' },
  reservoir: { color: '#0284C7', icon: '🌊' },
  canal: { color: '#0891B2', icon: '🛤' },
  spring: { color: '#22C55E', icon: '💧' },
  wetland: { color: '#84CC16', icon: '🌾' },
  gauging: { color: '#EAB308', icon: '📊' },
  waterway: { color: '#0EA5E9', icon: '🌊' },
};

function buildDetailedPopup(feat: WaterFeature, lang: Lang): string {
  const catKey = `layer.${feat.type}` as any;
  const catLabel = t(catKey, lang) || feat.type;
  const nameDisplay = feat.name || t('layer.noName', lang);
  const style = WATER_ICONS[feat.type] || WATER_ICONS.waterway;
  
  let html = `<div style="min-width:220px;max-width:320px;">`;
  html += `<div style="font-size:14px;font-weight:bold;margin-bottom:8px;">${style.icon} ${nameDisplay}</div>`;
  html += `<div style="font-size:11px;color:#666;margin-bottom:6px;">${catLabel}</div>`;
  html += `<div style="font-size:10px;color:#999;margin-bottom:8px;">${feat.lat.toFixed(5)}, ${feat.lng.toFixed(5)}</div>`;
  
  // Display important tags
  const importantTags = ['operator', 'capacity', 'height', 'length', 'width', 'depth', 'maxdepth', 'volume', 'start_date'];
  for (const key of importantTags) {
    if (feat.tags[key]) {
      const labelKey = `layer.${key}` as any;
      const label = t(labelKey, lang) || key;
      html += `<div style="font-size:10px;margin:2px 0;"><strong>${label}:</strong> ${feat.tags[key]}</div>`;
    }
  }
  
  // Links
  if (feat.tags.wikipedia) {
    const wikiUrl = feat.tags.wikipedia.includes('http') ? feat.tags.wikipedia : `https://en.wikipedia.org/wiki/${feat.tags.wikipedia.replace(/ /g, '_')}`;
    html += `<div style="margin-top:6px;"><a href="${wikiUrl}" target="_blank" style="font-size:10px;color:#0284C7;">${t('layer.wikipedia', lang)}</a></div>`;
  }
  if (feat.tags.website) {
    html += `<div><a href="${feat.tags.website}" target="_blank" style="font-size:10px;color:#0284C7;">${t('layer.website', lang)}</a></div>`;
  }
  
  // OSM link
  const osmLink = `https://www.openstreetmap.org/${feat.osmType}/${feat.id}`;
  html += `<div style="margin-top:8px;padding-top:6px;border-top:1px solid #ddd;">`;
  html += `<a href="${osmLink}" target="_blank" style="font-size:9px;color:#999;">${t('layer.viewOnOSM', lang)} (ID: ${feat.id})</a>`;
  html += `</div></div>`;
  return html;
}

function exportFeaturesAsGeoJSON(features: WaterFeature[]): void {
  const geojson = {
    type: 'FeatureCollection',
    features: features.map(f => ({
      type: 'Feature',
      id: f.id,
      properties: {
        osmType: f.osmType,
        type: f.type,
        name: f.name,
        ...f.tags,
      },
      geometry: f.geometry ? {
        type: f.geometry.length > 1 ? 'LineString' : 'Point',
        coordinates: f.geometry.length > 1
          ? f.geometry.map(p => [p.lng, p.lat])
          : [f.lng, f.lat],
      } : {
        type: 'Point',
        coordinates: [f.lng, f.lat],
      },
    })),
  };
  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `water_infrastructure_${Date.now()}.geojson`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportFeaturesAsCSV(features: WaterFeature[]): void {
  const header = ['OSM_ID', 'OSM_Type', 'Type', 'Name', 'Latitude', 'Longitude', 'Operator', 'Capacity', 'Height', 'Start_Date'];
  const rows = features.map(f => [
    f.id,
    f.osmType,
    f.type,
    f.name || '',
    f.lat,
    f.lng,
    f.tags.operator || '',
    f.tags.capacity || '',
    f.tags.height || '',
    f.tags.start_date || '',
  ]);
  const csv = [header, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `water_infrastructure_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MapViewer({ agreements, selectedId, onMarkerClick, lang = 'tr' }: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerCluster = useRef<L.MarkerClusterGroup | null>(null);
  const markers = useRef<Map<string, MarkerType>>(new Map());
  const waterLayer = useRef<L.LayerGroup | null>(null);
  const [waterEnabled, setWaterEnabled] = useState(false);
  const [waterLoading, setWaterLoading] = useState(false);
  const [waterFeatures, setWaterFeatures] = useState<WaterFeature[]>([]);
  const [waterCount, setWaterCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastBoundsRef = useRef<string>('');

  // Filter state
  const [filterEnabled, setFilterEnabled] = useState<Record<string, boolean>>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

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
      setWaterFeatures([]);
      return;
    }

    const loadWaterFeatures = async () => {
      const zoom = m.getZoom();
      if (zoom < 7) {
        waterLayer.current?.clearLayers();
        setWaterCount(0);
        setWaterFeatures([]);
        return;
      }

      const bounds = m.getBounds();
      const boundsKey = bounds.toBBoxString();
      if (boundsKey === lastBoundsRef.current) return;
      lastBoundsRef.current = boundsKey;

      // Limit area if zoom < 10
      const area = (bounds.getNorth() - bounds.getSouth()) * (bounds.getEast() - bounds.getWest());
      if (zoom < 10 && area > 100) {
        // Too large area at low zoom
        return;
      }

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
          const tags = el.tags || {};
          const cat = categorizeFeature(tags);
          const name = tags.name || tags['name:en'] || tags['name:tr'] || '';

          let lat: number, lng: number;
          let geometry: Array<{ lat: number; lng: number }> | undefined;

          if (el.type === 'node') {
            lat = el.lat;
            lng = el.lon;
          } else if (el.type === 'way' && el.geometry) {
            // For ways, use centroid for marker but store geometry for polyline
            geometry = el.geometry.map((g: any) => ({ lat: g.lat, lng: g.lon }));
            lat = geometry.reduce((sum, p) => sum + p.lat, 0) / geometry.length;
            lng = geometry.reduce((sum, p) => sum + p.lng, 0) / geometry.length;
          } else if (el.center) {
            lat = el.center.lat;
            lng = el.center.lon;
          } else {
            continue;
          }

          features.push({ id: el.id, osmType: el.type, type: cat, name, lat, lng, tags, geometry });
        }

        setWaterFeatures(features);
        const enabledTypes = Object.keys(filterEnabled).filter(k => filterEnabled[k] !== false);
        const filtered = enabledTypes.length > 0 ? features.filter(f => enabledTypes.includes(f.type)) : features;

        for (const feat of filtered) {
          const style = WATER_ICONS[feat.type] || WATER_ICONS.waterway;

          if (feat.geometry && feat.geometry.length > 1) {
            // Draw polyline for ways
            const polyline = L.polyline(feat.geometry.map(p => [p.lat, p.lng] as [number, number]), {
              color: style.color,
              weight: 3,
              opacity: 0.7,
            });
            polyline.bindPopup(buildDetailedPopup(feat, lang));
            waterLayer.current?.addLayer(polyline);
          }

          // Always add a marker (even for polylines, so they're clickable)
          const marker = L.circleMarker([feat.lat, feat.lng], {
            radius: 6,
            fillColor: style.color,
            color: '#fff',
            weight: 1.5,
            opacity: 0.9,
            fillOpacity: 0.7,
          });

          marker.bindPopup(buildDetailedPopup(feat, lang));
          waterLayer.current?.addLayer(marker);
        }

        setWaterCount(filtered.length);
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
  }, [waterEnabled, lang, filterEnabled]);

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

  const uniqueTypes = Array.from(new Set(waterFeatures.map(f => f.type)));

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
            {waterEnabled && (
              <div className="flex items-center gap-1.5 ml-1 px-1.5 py-0.5 bg-white/20 rounded-md">
                <div className={`w-1.5 h-1.5 rounded-full ${waterLoading ? 'bg-white animate-pulse' : 'bg-emerald-300'}`} />
              </div>
            )}
          </button>

          {waterEnabled && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-xl w-64 animate-in fade-in slide-in-from-top-2">
              {waterLoading ? (
                <div className="flex items-center justify-center py-2 gap-2 text-slate-500 text-[10px]">
                  <div className="w-3 h-3 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin" />
                  {t('layer.loading', lang)}
                </div>
              ) : map.current && map.current.getZoom() < 7 ? (
                <div className="text-[10px] text-amber-600 font-medium text-center py-1">
                  ⚠️ {t('layer.zoomIn', lang)}
                </div>
              ) : waterCount > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="text-[10px] text-slate-500 font-bold">
                      {t('layer.results', lang, { count: waterCount })}
                    </div>
                    <button
                      onClick={() => setShowFilterPanel(p => !p)}
                      className="text-[9px] text-sky-600 hover:text-sky-700 font-semibold"
                    >
                      🔍 {t('layer.filterTitle', lang)}
                    </button>
                  </div>

                  {showFilterPanel && (
                    <div className="space-y-1 border-b border-slate-100 pb-2">
                      <div className="flex gap-1 mb-1">
                        <button
                          onClick={() => setFilterEnabled({})}
                          className="text-[8px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded"
                        >
                          {t('layer.showAll', lang)}
                        </button>
                        <button
                          onClick={() => {
                            const all: Record<string, boolean> = {};
                            uniqueTypes.forEach(t => { all[t] = false; });
                            setFilterEnabled(all);
                          }}
                          className="text-[8px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
                        >
                          {t('layer.hideAll', lang)}
                        </button>
                      </div>
                      {uniqueTypes.map(type => {
                        const style = WATER_ICONS[type] || WATER_ICONS.waterway;
                        const catKey = `layer.${type}` as any;
                        const catLabel = t(catKey, lang) || type;
                        const enabled = filterEnabled[type] !== false;
                        return (
                          <label key={type} className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 rounded px-1 py-0.5">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => setFilterEnabled(prev => ({ ...prev, [type]: e.target.checked }))}
                              className="w-3 h-3"
                            />
                            <span style={{ color: style.color }} className="text-[10px]">{style.icon}</span>
                            <span className="text-[9px] text-slate-700">{catLabel}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => exportFeaturesAsGeoJSON(waterFeatures)}
                      className="text-[9px] px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    >
                      🗺 {t('layer.exportGeoJSON', lang)}
                    </button>
                    <button
                      onClick={() => exportFeaturesAsCSV(waterFeatures)}
                      className="text-[9px] px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                    >
                      📄 {t('layer.exportCSV', lang)}
                    </button>
                  </div>

                  <div className="text-[8px] text-slate-400 pt-1 italic text-center">
                    {t('layer.attribution', lang)}
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
