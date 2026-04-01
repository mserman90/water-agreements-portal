/**
 * MeteoLayerOverlay
 *
 * A pure React component that renders historical meteorological data
 * (temperature anomaly, precipitation anomaly, drought index) as
 * coloured circle overlays on the Leaflet map passed via the `map` prop.
 *
 * It uses the `useMeteoLayer` hook to fetch Open-Meteo ERA5-seamless
 * archive data for the selected `year` and `layerType`.
 */

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMeteoLayer, MeteoLayerType, MeteoGridPoint } from '@/hooks/useMeteoLayer';
import { useLanguage } from '@/i18n/LanguageContext';

// ── Colour scales ────────────────────────────────────────────────────────────

/** Interpolate between two RGB hex colours (t in [0,1]) */
function lerpColour(hex1: string, hex2: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

function anomalyToColour(anomaly: number, min: number, max: number, type: MeteoLayerType): string {
  const t = max === min ? 0.5 : (anomaly - min) / (max - min);
  const tc = Math.max(0, Math.min(1, t));

  if (type === 'temperature') {
    // Blue (cold) → White → Red (warm)
    if (tc < 0.5) return lerpColour('#3b82f6', '#ffffff', tc * 2);
    return lerpColour('#ffffff', '#ef4444', (tc - 0.5) * 2);
  }
  if (type === 'precipitation') {
    // Brown (dry) → White → Blue (wet)
    if (tc < 0.5) return lerpColour('#a16207', '#ffffff', tc * 2);
    return lerpColour('#ffffff', '#1d4ed8', (tc - 0.5) * 2);
  }
  // drought: White (no drought) → Orange → Red
  return lerpColour('#fde68a', '#b91c1c', tc);
}

// ── Label helpers ────────────────────────────────────────────────────────────

function layerLabel(type: MeteoLayerType, lang: string): string {
  const labels: Record<MeteoLayerType, { tr: string; en: string }> = {
    temperature:   { tr: 'Sicaklik Anomalisi (°C)', en: 'Temperature Anomaly (°C)' },
    precipitation: { tr: 'Yagis Anomalisi (mm/yil)', en: 'Precipitation Anomaly (mm/yr)' },
    drought:       { tr: 'Kuraklik Endeksi (%)', en: 'Drought Index (%)' },
  };
  return lang === 'tr' ? labels[type].tr : labels[type].en;
}

function pointTooltip(pt: MeteoGridPoint, type: MeteoLayerType, lang: string): string {
  const fmt = (v: number, decimals = 1) => v.toFixed(decimals);
  if (type === 'temperature') {
    const sign = pt.anomaly >= 0 ? '+' : '';
    return lang === 'tr'
      ? `Sicaklik Anomalisi: ${sign}${fmt(pt.anomaly)} °C`
      : `Temp Anomaly: ${sign}${fmt(pt.anomaly)} °C`;
  }
  if (type === 'precipitation') {
    const sign = pt.anomaly >= 0 ? '+' : '';
    return lang === 'tr'
      ? `Yagis Anomalisi: ${sign}${fmt(pt.anomaly, 0)} mm/yil`
      : `Precip Anomaly: ${sign}${fmt(pt.anomaly, 0)} mm/yr`;
  }
  return lang === 'tr'
    ? `Kuraklik: ${fmt(pt.value, 0)}%${pt.isDrought ? ' ⚠ Kurak yil' : ''}`
    : `Drought: ${fmt(pt.value, 0)}%${pt.isDrought ? ' ⚠ Drought year' : ''}`;
}

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  map: L.Map | null;
  layerType: MeteoLayerType;
  year: number;
  enabled: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MeteoLayerOverlay({ map, layerType, year, enabled }: Props) {
  const { lang } = useLanguage();
  const { points, loading, minVal, maxVal } = useMeteoLayer(layerType, year, enabled);
  const circlesRef = useRef<L.CircleMarker[]>([]);
  const legendRef  = useRef<L.Control | null>(null);

  // Draw / update circles whenever points change
  useEffect(() => {
    if (!map) return;

    // Remove old circles
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    if (!enabled || points.length === 0) return;

    points.forEach((pt) => {
      const colour = anomalyToColour(pt.anomaly, minVal, maxVal, layerType);
      const circle = L.circleMarker([pt.lat, pt.lng], {
        radius:      22,
        color:       'transparent',
        fillColor:   colour,
        fillOpacity: 0.55,
        interactive: true,
      });
      circle.bindTooltip(pointTooltip(pt, layerType, lang), {
        sticky: true,
        className: 'meteo-tooltip',
      });
      circle.addTo(map);
      circlesRef.current.push(circle);
    });

    return () => {
      circlesRef.current.forEach((c) => c.remove());
      circlesRef.current = [];
    };
  }, [map, points, enabled, layerType, minVal, maxVal, lang]);

  // Legend control
  useEffect(() => {
    if (!map) return;
    if (legendRef.current) {
      legendRef.current.remove();
      legendRef.current = null;
    }
    if (!enabled || points.length === 0) return;

    const Legend = L.Control.extend({
      onAdd() {
        const div = L.DomUtil.create('div');
        div.style.cssText = `
          background:rgba(255,255,255,0.92);
          padding:8px 12px;
          border-radius:6px;
          font-size:11px;
          line-height:1.6;
          box-shadow:0 1px 4px rgba(0,0,0,0.2);
          pointer-events:none;
          min-width:130px;
        `;

        const title = layerLabel(layerType, lang);
        const isTemp  = layerType === 'temperature';
        const isPrecip = layerType === 'precipitation';

        const lo = minVal.toFixed(isTemp ? 1 : 0);
        const hi = maxVal.toFixed(isTemp ? 1 : 0);

        let gradient: string;
        if (isTemp) {
          gradient = 'linear-gradient(to right, #3b82f6, #ffffff, #ef4444)';
        } else if (isPrecip) {
          gradient = 'linear-gradient(to right, #a16207, #ffffff, #1d4ed8)';
        } else {
          gradient = 'linear-gradient(to right, #fde68a, #b91c1c)';
        }

        div.innerHTML = `
          <div style="font-weight:600;margin-bottom:4px;">${title}</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:10px;">${lo}</span>
            <div style="flex:1;height:10px;border-radius:3px;background:${gradient};"></div>
            <span style="font-size:10px;">${hi}</span>
          </div>
          <div style="margin-top:4px;color:#555;font-size:10px;">
            ${lang === 'tr' ? `${year} — ERA5-seamless` : `${year} — ERA5-seamless`}
          </div>
          ${loading ? `<div style="color:#888;font-size:10px;">${lang === 'tr' ? 'Yukleniyor...' : 'Loading...'}</div>` : ''}
        `;
        return div;
      },
      onRemove() {},
    });

    const legend = new Legend({ position: 'bottomright' });
    legend.addTo(map);
    legendRef.current = legend;

    return () => {
      legend.remove();
      legendRef.current = null;
    };
  }, [map, enabled, points, layerType, minVal, maxVal, year, lang, loading]);

  return null; // pure side-effect component
}
