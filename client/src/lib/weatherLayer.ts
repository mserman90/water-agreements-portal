/**
 * Open-Meteo precipitation and flood data layer for Leaflet.
 * Fetches grid-point data and renders as colored circle overlays.
 * No API key required.
 */
import L from 'leaflet';
import type { Lang } from '@/i18n/translations';

const METEO_BASE = 'https://api.open-meteo.com/v1';
const FLOOD_BASE = 'https://flood-api.open-meteo.com/v1/flood';

// ── Color scales ──
function precipColor(mm: number): string {
  if (mm <= 0) return 'rgba(0,0,0,0)';
  if (mm < 1) return 'rgba(170,220,250,0.4)';   // light blue
  if (mm < 5) return 'rgba(70,180,230,0.5)';     // blue
  if (mm < 10) return 'rgba(30,140,200,0.6)';    // medium blue
  if (mm < 25) return 'rgba(20,100,180,0.7)';    // dark blue
  if (mm < 50) return 'rgba(255,200,0,0.7)';     // yellow
  if (mm < 100) return 'rgba(255,130,0,0.75)';   // orange
  return 'rgba(220,30,30,0.8)';                   // red
}

function floodColor(discharge: number): string {
  if (discharge <= 0) return 'rgba(0,0,0,0)';
  if (discharge < 50) return 'rgba(100,200,255,0.35)';
  if (discharge < 200) return 'rgba(60,160,230,0.45)';
  if (discharge < 500) return 'rgba(30,120,200,0.55)';
  if (discharge < 1000) return 'rgba(20,80,180,0.65)';
  if (discharge < 5000) return 'rgba(255,180,0,0.7)';
  if (discharge < 10000) return 'rgba(255,100,0,0.75)';
  return 'rgba(200,20,20,0.8)';
}

// ── Grid generator ──
function generateGrid(bounds: L.LatLngBounds, step: number): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  const s = bounds.getSouth();
  const n = bounds.getNorth();
  const w = bounds.getWest();
  const e = bounds.getEast();

  for (let lat = Math.ceil(s / step) * step; lat <= n; lat += step) {
    for (let lng = Math.ceil(w / step) * step; lng <= e; lng += step) {
      points.push({ lat: Math.round(lat * 100) / 100, lng: Math.round(lng * 100) / 100 });
    }
  }
  return points.slice(0, 100); // Max 100 points per request
}

// ── Precipitation layer ──
export async function loadPrecipitation(
  map: L.Map,
  layer: L.LayerGroup,
  lang: Lang,
  signal?: AbortSignal
): Promise<number> {
  layer.clearLayers();
  const bounds = map.getBounds();
  const zoom = map.getZoom();

  // Adjust grid step based on zoom
  const step = zoom >= 8 ? 0.25 : zoom >= 6 ? 0.5 : zoom >= 4 ? 1 : 2;
  const points = generateGrid(bounds, step);

  if (points.length === 0) return 0;

  const lats = points.map(p => p.lat).join(',');
  const lngs = points.map(p => p.lng).join(',');

  const url = `${METEO_BASE}/forecast?latitude=${lats}&longitude=${lngs}&daily=precipitation_sum&timezone=auto&forecast_days=1`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Meteo API error');
  const data = await res.json();

  // Handle single vs multiple locations
  const results = Array.isArray(data) ? data : [data];
  let count = 0;

  const radius = zoom >= 8 ? 12 : zoom >= 6 ? 16 : zoom >= 4 ? 20 : 25;

  results.forEach((result: any, i: number) => {
    const precip = result?.daily?.precipitation_sum?.[0] ?? 0;
    if (precip <= 0) return;

    const pt = points[i];
    if (!pt) return;

    const circle = L.circleMarker([pt.lat, pt.lng], {
      radius,
      fillColor: precipColor(precip),
      color: 'transparent',
      fillOpacity: 1,
      weight: 0,
    });

    const label = lang === 'tr' ? 'Yağış' : 'Precipitation';
    circle.bindPopup(`
      <div style="text-align:center">
        <strong style="color:#0369A1">${label}</strong><br>
        <span style="font-size:18px;font-weight:700">${precip.toFixed(1)} mm</span><br>
        <span style="font-size:10px;color:#94a3b8">${pt.lat.toFixed(2)}°, ${pt.lng.toFixed(2)}°</span>
      </div>
    `);

    layer.addLayer(circle);
    count++;
  });

  return count;
}

// ── Flood / River discharge layer ──
export async function loadFloodData(
  map: L.Map,
  layer: L.LayerGroup,
  lang: Lang,
  signal?: AbortSignal
): Promise<number> {
  layer.clearLayers();
  const bounds = map.getBounds();
  const zoom = map.getZoom();

  if (zoom < 5) return 0; // Too zoomed out for meaningful flood data

  const step = zoom >= 8 ? 0.5 : zoom >= 6 ? 1 : 2;
  const points = generateGrid(bounds, step);

  if (points.length === 0) return 0;

  const lats = points.map(p => p.lat).join(',');
  const lngs = points.map(p => p.lng).join(',');

  const url = `${FLOOD_BASE}?latitude=${lats}&longitude=${lngs}&daily=river_discharge&past_days=1&forecast_days=7`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Flood API error');
  const data = await res.json();

  const results = Array.isArray(data) ? data : [data];
  let count = 0;

  const radius = zoom >= 8 ? 10 : zoom >= 6 ? 14 : 18;

  results.forEach((result: any, i: number) => {
    const discharges: number[] = result?.daily?.river_discharge ?? [];
    if (discharges.length === 0) return;

    // Current (yesterday) and max forecast
    const current = discharges[0] ?? 0;
    const maxForecast = Math.max(...discharges.slice(1));

    if (current <= 0 && maxForecast <= 0) return;

    const pt = points[i];
    if (!pt) return;

    const displayVal = Math.max(current, maxForecast);

    const circle = L.circleMarker([pt.lat, pt.lng], {
      radius,
      fillColor: floodColor(displayVal),
      color: displayVal > 5000 ? '#DC2626' : 'transparent',
      weight: displayVal > 5000 ? 2 : 0,
      fillOpacity: 1,
    });

    const labelCurrent = lang === 'tr' ? 'Güncel Debi' : 'Current Discharge';
    const labelMax = lang === 'tr' ? 'Maks. Tahmin (7 gün)' : 'Max Forecast (7 days)';
    const warning = displayVal > 5000
      ? `<div style="color:#DC2626;font-weight:700;margin-top:4px">⚠ ${lang === 'tr' ? 'Yüksek Taşkın Riski' : 'High Flood Risk'}</div>`
      : '';

    circle.bindPopup(`
      <div style="text-align:center;min-width:140px">
        <strong style="color:#0369A1">${lang === 'tr' ? 'Nehir Debisi' : 'River Discharge'}</strong><br>
        <div style="margin:4px 0">
          <span style="font-size:10px;color:#64748b">${labelCurrent}:</span><br>
          <span style="font-size:16px;font-weight:700">${current.toFixed(0)} m³/s</span>
        </div>
        <div style="margin:4px 0">
          <span style="font-size:10px;color:#64748b">${labelMax}:</span><br>
          <span style="font-size:14px;font-weight:600;color:${maxForecast > current ? '#EA580C' : '#059669'}">${maxForecast.toFixed(0)} m³/s</span>
        </div>
        ${warning}
        <div style="font-size:9px;color:#94a3b8;margin-top:4px">${pt.lat.toFixed(2)}°, ${pt.lng.toFixed(2)}°</div>
      </div>
    `);

    layer.addLayer(circle);
    count++;
  });

  return count;
}

// ── Legend HTML ──
export function precipLegend(lang: Lang): string {
  const items = [
    { color: 'rgba(170,220,250,0.7)', label: '< 1 mm' },
    { color: 'rgba(70,180,230,0.8)', label: '1-5 mm' },
    { color: 'rgba(30,140,200,0.85)', label: '5-10 mm' },
    { color: 'rgba(20,100,180,0.9)', label: '10-25 mm' },
    { color: 'rgba(255,200,0,0.9)', label: '25-50 mm' },
    { color: 'rgba(255,130,0,0.9)', label: '50-100 mm' },
    { color: 'rgba(220,30,30,0.9)', label: '> 100 mm' },
  ];
  return items.map(i =>
    `<span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full" style="background:${i.color}"></span>${i.label}</span>`
  ).join('');
}

export function floodLegend(lang: Lang): string {
  const items = [
    { color: 'rgba(100,200,255,0.6)', label: '< 50 m³/s' },
    { color: 'rgba(60,160,230,0.7)', label: '50-200' },
    { color: 'rgba(30,120,200,0.8)', label: '200-500' },
    { color: 'rgba(20,80,180,0.85)', label: '500-1K' },
    { color: 'rgba(255,180,0,0.9)', label: '1K-5K' },
    { color: 'rgba(255,100,0,0.9)', label: '5K-10K' },
    { color: 'rgba(200,20,20,0.9)', label: '> 10K' },
  ];
  return items.map(i =>
    `<span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full" style="background:${i.color}"></span>${i.label}</span>`
  ).join('');
}
