/**
 * MeteoTimelineChart
 *
 * SVG line+area chart rendered inside the TimelineOverlay panel.
 * Shows annual meteorological anomalies (temperature, precipitation)
 * or drought index fetched from Open-Meteo ERA5 archive (1940-present).
 *
 * Props:
 *   metric        - which ERA5 variable to show
 *   currentYear   - slider year (draws a vertical cursor line)
 *   agreementYear - selected agreement year (draws a highlight line)
 *   lat/lng       - coordinates of the selected agreement's basin (optional)
 *   width/height  - SVG dimensions
 */
import { useMemo, useState } from 'react';
import { useMeteoTimeSeries } from '@/hooks/useMeteoTimeSeries';
import type { MeteoLayerType } from '@/hooks/useMeteoLayer';
import { useLanguage } from '@/i18n/LanguageContext';

// MeteoTimelineChart accepts either 'metric' (new API) or 'layerType' (legacy)
interface Props {
  metric?: MeteoLayerType;
  layerType?: MeteoLayerType; // legacy alias
  currentYear: number;
  agreementYear?: number; // highlight the selected agreement's year
  lat?: number; // basin/agreement latitude for location-specific ERA5 fetch
  lng?: number; // basin/agreement longitude for location-specific ERA5 fetch
  width?: number;
  height?: number;
}

const PALETTE: Record<MeteoLayerType, { positive: string; negative: string; line: string; fill: string }> = {
  temperature: {
    positive: '#ef4444',
    negative: '#3b82f6',
    line: '#f97316',
    fill: 'rgba(249,115,22,0.15)',
  },
  precipitation: {
    positive: '#3b82f6',
    negative: '#b45309',
    line: '#38bdf8',
    fill: 'rgba(56,189,248,0.12)',
  },
  drought: {
    positive: '#b91c1c',
    negative: '#22c55e',
    line: '#f59e0b',
    fill: 'rgba(245,158,11,0.15)',
  },
};

const LABELS: Record<MeteoLayerType, { tr: string; en: string; unit: string }> = {
  temperature: { tr: 'S\u0131cakl\u0131k Anomalisi', en: 'Temp Anomaly', unit: '\u00b0C' },
  precipitation: { tr: 'Ya\u011f\u0131\u015f Anomalisi', en: 'Precip Anomaly', unit: 'mm' },
  drought: { tr: 'Kuraklık Endeksi', en: 'Drought Index', unit: '%' },
};

export default function MeteoTimelineChart({
  metric,
  layerType,
  currentYear,
  agreementYear,
  lat,
  lng,
  width = 860,
  height = 72,
}: Props) {
  const { lang } = useLanguage();
  const activeType: MeteoLayerType = metric ?? layerType ?? 'temperature';
  const { series, loading, error } = useMeteoTimeSeries(activeType, true, lat, lng);
  const [hovered, setHovered] = useState<{ year: number; value: number } | null>(null);

  const palette = PALETTE[activeType];
  const meta = LABELS[activeType];
  const label = lang === 'tr' ? meta.tr : meta.en;

  const PAD = { top: 6, bottom: 6, left: 2, right: 2 };
  const chartW = width - PAD.left - PAD.right;
  const chartH = height - PAD.top - PAD.bottom;

  const { points, zeroY, cursorX, agreementX, areaPath, linePath } = useMemo(() => {
    if (series.length < 2) {
      return { points: [], zeroY: PAD.top + chartH, cursorX: null, agreementX: null, areaPath: '', linePath: '' };
    }
    const values = series.map((d) => d.value);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const range = maxV - minV || 1;
    const firstYear = series[0].year;
    const lastYear = series[series.length - 1].year;
    const yearSpan = lastYear - firstYear || 1;
    const toX = (year: number) => PAD.left + ((year - firstYear) / yearSpan) * chartW;
    const toY = (v: number) => PAD.top + chartH - ((v - minV) / range) * chartH;
    const hasNeg = minV < 0;
    const zY = hasNeg ? toY(0) : PAD.top + chartH;
    const pts = series.map((d) => ({ x: toX(d.year), y: toY(d.value), year: d.year, value: d.value }));
    const lPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const aPath =
      `M${pts[0].x.toFixed(1)},${zY.toFixed(1)} ` +
      pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
      ` L${pts[pts.length - 1].x.toFixed(1)},${zY.toFixed(1)} Z`;
    const cX =
      currentYear >= firstYear && currentYear <= lastYear ? toX(currentYear) : null;
    // Agreement year vertical line
    const aX =
      agreementYear != null && agreementYear >= firstYear && agreementYear <= lastYear
        ? toX(agreementYear)
        : null;
    return { points: pts, zeroY: zY, cursorX: cX, agreementX: aX, areaPath: aPath, linePath: lPath };
  }, [series, activeType, width, height, currentYear, agreementYear, chartW, chartH, PAD.left, PAD.top]);

  // Loading / error
  if (loading && series.length === 0) {
    return (
      <div style={{ color: '#64748b', fontSize: 10, padding: '4px 8px' }}>
        {label} {lang === 'tr' ? 'y\u00fckleniyor\u2026' : 'loading\u2026'}
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ color: '#ef4444', fontSize: 10, padding: '4px 8px' }}>
        {label}: {lang === 'tr' ? 'veri y\u00fcklenemedi' : 'failed to load'}
      </div>
    );
  }
  if (series.length === 0) return null;

  const hoveredPoint = hovered ? series.find((d) => d.year === hovered.year) : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block', cursor: 'crosshair' }}
        onMouseLeave={() => setHovered(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const xRatio = (e.clientX - rect.left) / rect.width;
          const svgX = xRatio * width;
          let nearest = points[0];
          let minDist = Math.abs(points[0].x - svgX);
          for (const p of points) {
            const d = Math.abs(p.x - svgX);
            if (d < minDist) { minDist = d; nearest = p; }
          }
          setHovered({ year: nearest.year, value: nearest.value });
        }}
      >
        {/* Zero / baseline */}
        <line x1={PAD.left} y1={zeroY} x2={width - PAD.right} y2={zeroY}
          stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
        {/* Area fill */}
        <path d={areaPath} fill={palette.fill} />
        {/* Line */}
        <path d={linePath} fill="none" stroke={palette.line} strokeWidth={1} />
        {/* Agreement year highlight line */}
        {agreementX !== null && (
          <>
            <line x1={agreementX} y1={PAD.top} x2={agreementX} y2={PAD.top + chartH}
              stroke="#f97316" strokeWidth={1.5} strokeDasharray="3,2" />
            <circle
              cx={agreementX}
              cy={points.find((p) => p.year === agreementYear)?.y ?? (PAD.top + chartH / 2)}
              r={3.5}
              fill="#f97316"
            />
            <text x={agreementX + 3} y={PAD.top + 8} fill="#f97316" fontSize={7}>
              {agreementYear}
            </text>
          </>
        )}
        {/* Current year cursor */}
        {cursorX !== null && (
          <>
            <line x1={cursorX} y1={PAD.top} x2={cursorX} y2={PAD.top + chartH}
              stroke="#facc15" strokeWidth={1} strokeDasharray="2,2" opacity={0.7} />
            <circle
              cx={cursorX}
              cy={points.find((p) => p.year === currentYear)?.y ?? (PAD.top + chartH / 2)}
              r={3}
              fill="#facc15"
            />
          </>
        )}
        {/* Hover dot */}
        {hovered && (() => {
          const hp = points.find((p) => p.year === hovered.year);
          if (!hp) return null;
          return (
            <circle cx={hp.x} cy={hp.y} r={3} fill={palette.line} stroke="#fff" strokeWidth={1} />
          );
        })()}
        {/* Year labels */}
        <text x={PAD.left + 2} y={PAD.top + chartH - 2} fill="#475569" fontSize={7}>
          {series[0]?.year}
        </text>
        <text x={width - PAD.right - 2} y={PAD.top + chartH - 2} fill="#475569" fontSize={7}
          textAnchor="end">
          {series[series.length - 1]?.year}
        </text>
      </svg>
      {/* Hover tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 8, fontSize: 9,
          color: palette.line, pointerEvents: 'none',
        }}>
          {hovered.year}: <strong>{hovered.value > 0 ? '+' : ''}{hovered.value}{meta.unit}</strong>
        </div>
      )}
    </div>
  );
}
