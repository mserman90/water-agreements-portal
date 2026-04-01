/**
 * MeteoTimelineChart
 *
 * SVG line+area chart rendered inside the TimelineOverlay panel.
 * Shows annual meteorological anomalies (temperature, precipitation)
 * or drought index fetched from Open-Meteo ERA5 archive (1940-present).
 *
 * Props:
 *   metric      - which ERA5 variable to show
 *   currentYear - slider year (draws a vertical cursor line)
 *   width/height - SVG dimensions
 */
import { useMemo, useState } from 'react';
import { useMeteoTimeSeries } from '@/hooks/useMeteoTimeSeries';
import type { MeteoLayerType } from '@/hooks/useMeteoLayer';
import { useLanguage } from '@/i18n/LanguageContext';

// MeteoTimelineChart accepts either 'metric' (new API) or 'layerType' (legacy)
interface Props {
  metric?: MeteoLayerType;
  layerType?: MeteoLayerType;  // legacy alias
  currentYear: number;
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
  temperature: { tr: 'Sicaklik Anomalisi', en: 'Temp Anomaly', unit: '\u00b0C' },
  precipitation: { tr: 'Yagis Anomalisi', en: 'Precip Anomaly', unit: 'mm' },
  drought: { tr: 'Kuraklik Endeksi (ET0)', en: 'Drought Index', unit: '%' },
};

export default function MeteoTimelineChart({
  metric,
  layerType,
  currentYear,
  width = 860,
  height = 72,
}: Props) {
  const { lang } = useLanguage();
  const activeType: MeteoLayerType = metric ?? layerType ?? 'temperature';
  const { series, loading, error } = useMeteoTimeSeries(activeType, true);
  const [hovered, setHovered] = useState<{ year: number; value: number } | null>(null);

  const palette = PALETTE[activeType];
  const meta = LABELS[activeType];
  const label = lang === 'tr' ? meta.tr : meta.en;

  const PAD = { top: 6, bottom: 6, left: 2, right: 2 };
  const chartW = width - PAD.left - PAD.right;
  const chartH = height - PAD.top - PAD.bottom;

  const { points, zeroY, cursorX, areaPath, linePath } = useMemo(() => {
    if (series.length < 2) {
      return { points: [], zeroY: PAD.top + chartH, cursorX: null, areaPath: '', linePath: '' };
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

    // Zero line Y
    const hasNeg = minV < 0;
    const zY = hasNeg ? toY(0) : PAD.top + chartH;

    const pts = series.map((d) => ({ x: toX(d.year), y: toY(d.value), year: d.year, value: d.value }));

    // SVG line path
    const lPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    // Area path (filled region under/above zero)
    const aPath =
      `M${pts[0].x.toFixed(1)},${zY.toFixed(1)} ` +
      pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
      ` L${pts[pts.length - 1].x.toFixed(1)},${zY.toFixed(1)} Z`;

    // Cursor X
    const cX =
      currentYear >= firstYear && currentYear <= lastYear ? toX(currentYear) : null;

    return { points: pts, zeroY: zY, cursorX: cX, areaPath: aPath, linePath: lPath };
  }, [series, activeType, width, height, currentYear, chartW, chartH, PAD.left, PAD.top]);

  // Loading / error
  if (loading && series.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic' }}>
          {label} {lang === 'tr' ? 'yukleniyor\u2026' : 'loading\u2026'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#ef4444' }}>
          {label}: {lang === 'tr' ? 'veri yuklenemedi' : 'failed to load'}
        </span>
      </div>
    );
  }

  if (series.length === 0) return null;

  // Find hovered point by proximity to cursor
  const hoveredPoint = hovered
    ? series.find((d) => d.year === hovered.year)
    : null;

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
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
          // Find nearest point
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
        <line
          x1={PAD.left} y1={zeroY} x2={PAD.left + chartW} y2={zeroY}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="3,3"
        />

        {/* Area fill */}
        <path d={areaPath} fill={palette.fill} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={palette.line} strokeWidth={1.5}
          strokeLinejoin="round" strokeLinecap="round" />

        {/* Current year cursor */}
        {cursorX !== null && (
          <>
            <line
              x1={cursorX} y1={PAD.top} x2={cursorX} y2={PAD.top + chartH}
              stroke="#facc15" strokeWidth={1.5} strokeDasharray="2,2"
            />
            <circle cx={cursorX} cy={
              points.find((p) => p.year === currentYear)?.y ?? (PAD.top + chartH / 2)
            } r={3} fill="#facc15" />
          </>
        )}

        {/* Hover dot */}
        {hovered && (() => {
          const hp = points.find((p) => p.year === hovered.year);
          if (!hp) return null;
          return (
            <circle cx={hp.x} cy={hp.y} r={4}
              fill="white" stroke={palette.line} strokeWidth={2} />
          );
        })()}

        {/* Year labels */}
        <text x={PAD.left + 2} y={height - 2} fontSize={8} fill="rgba(255,255,255,0.3)">
          {series[0]?.year}
        </text>
        <text x={PAD.left + chartW - 2} y={height - 2} fontSize={8}
          fill="rgba(255,255,255,0.3)" textAnchor="end">
          {series[series.length - 1]?.year}
        </text>
      </svg>

      {/* Hover tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: 2,
          right: 0,
          fontSize: 10,
          color: '#e2e8f0',
          background: 'rgba(15,23,42,0.85)',
          padding: '2px 6px',
          borderRadius: 4,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          {hovered.year}: <strong style={{ color: palette.line }}>
            {hovered.value > 0 ? '+' : ''}{hovered.value}{meta.unit}
          </strong>
        </div>
      )}
    </div>
  );
}
