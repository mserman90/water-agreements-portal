/**
 * MeteoTimelineChart
 *
 * A pure SVG sparkline chart that renders inside the timeline panel.
 * Shows the selected meteorological indicator (temperature anomaly,
 * precipitation anomaly, or drought index) as a bar/line chart
 * spanning the ERA5 record (1940–present).
 *
 * Features:
 *  - Colour-coded bars (blue=cold/wet, red=warm/dry)
 *  - Vertical line marking the current slider year
 *  - Zero-line (baseline) for anomaly charts
 *  - Loading / error states
 *  - Hover tooltip showing exact year + value
 */

import { useMemo, useState } from 'react';
import { useMeteoTimeSeries } from '@/hooks/useMeteoTimeSeries';
import type { MeteoLayerType } from '@/hooks/useMeteoLayer';
import { useLanguage } from '@/i18n/LanguageContext';

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  layerType: MeteoLayerType;
  currentYear: number;
  enabled: boolean;
  /** Total pixel width of the chart (defaults to full container) */
  width?: number;
  height?: number;
}

// ── Colour helpers ────────────────────────────────────────────────────────────

function barColor(value: number, type: MeteoLayerType): string {
  if (type === 'temperature') {
    if (value > 0.5)  return '#ef4444'; // hot
    if (value > 0)    return '#f97316'; // warm
    if (value > -0.5) return '#93c5fd'; // slightly cool
    return '#3b82f6';                   // cold
  }
  if (type === 'precipitation') {
    return value >= 0 ? '#3b82f6' : '#a16207'; // wet vs dry
  }
  // drought — higher = worse
  if (value > 30) return '#b91c1c';
  if (value > 15) return '#f97316';
  return '#fbbf24';
}

// ── Labels ────────────────────────────────────────────────────────────────────

const LABELS: Record<MeteoLayerType, { tr: string; en: string; unit: string }> = {
  temperature:   { tr: 'Sicaklik Anomalisi',   en: 'Temp Anomaly',    unit: '°C' },
  precipitation: { tr: 'Yagis Anomalisi',      en: 'Precip Anomaly',  unit: 'mm' },
  drought:       { tr: 'Kuraklik Endeksi',      en: 'Drought Index',   unit: '%' },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function MeteoTimelineChart({
  layerType,
  currentYear,
  enabled,
  width  = 860,
  height = 60,
}: Props) {
  const { lang }                    = useLanguage();
  const { series, loading, error }  = useMeteoTimeSeries(layerType, enabled);
  const [hovered, setHovered]       = useState<{ year: number; value: number } | null>(null);

  const meta = LABELS[layerType];

  // ── Derived geometry ───────────────────────────────────────────────────────
  const { bars, zeroY, cursorX } = useMemo(() => {
    if (series.length === 0) return { bars: [], zeroY: height / 2, cursorX: null };

    const values   = series.map((d) => d.value);
    const minV     = Math.min(...values);
    const maxV     = Math.max(...values);
    const range    = maxV - minV || 1;

    const firstYear = series[0].year;
    const lastYear  = series[series.length - 1].year;
    const yearSpan  = lastYear - firstYear || 1;

    const PAD_TOP    = 4;
    const PAD_BOTTOM = 4;
    const chartH     = height - PAD_TOP - PAD_BOTTOM;

    // Zero line Y (for anomaly types)
    const hasZero = minV < 0 && maxV > 0;
    const zY = hasZero
      ? PAD_TOP + chartH * (1 - (0 - minV) / range)
      : PAD_TOP + chartH; // bottom when all positive

    const barW = Math.max(1, (width / yearSpan) - 0.5);

    const bs = series.map((d) => {
      const x = ((d.year - firstYear) / yearSpan) * width;
      const yNorm = (d.value - minV) / range;       // 0=min, 1=max
      const yTop  = PAD_TOP + chartH * (1 - yNorm);
      const barHeight = Math.abs(d.value / range) * chartH;

      return {
        year:   d.year,
        value:  d.value,
        x,
        y:      d.value >= 0 ? yTop : zY,
        h:      Math.max(1, barHeight),
        color:  barColor(d.value, layerType),
      };
    });

    // Cursor X position
    const cX = currentYear >= firstYear && currentYear <= lastYear
      ? ((currentYear - firstYear) / yearSpan) * width
      : null;

    return { bars: bs, zeroY: zY, cursorX: cX };
  }, [series, layerType, width, height, currentYear]);

  // ── No-data / loading states ───────────────────────────────────────────────
  if (!enabled) return null;

  const label = lang === 'tr' ? meta.tr : meta.en;

  return (
    <div
      style={{
        width: '100%',
        padding: '2px 0 0',
        position: 'relative',
      }}
    >
      {/* Title row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
        fontSize: 10,
        color: '#cbd5e1',
        userSelect: 'none',
      }}>
        <span style={{ fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ color: '#64748b' }}>ERA5 · 1940–{new Date().getFullYear() - 1}</span>
        {loading && (
          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
            {lang === 'tr' ? 'yukleniyor…' : 'loading…'}
          </span>
        )}
        {error && (
          <span style={{ color: '#f87171' }}>
            {lang === 'tr' ? 'hata' : 'error'}
          </span>
        )}
        {hovered && (
          <span style={{ marginLeft: 'auto', color: '#e2e8f0', fontWeight: 600 }}>
            {hovered.year}: {hovered.value > 0 ? '+' : ''}{hovered.value} {meta.unit}
          </span>
        )}
      </div>

      {/* SVG chart */}
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block', cursor: 'crosshair' }}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Zero baseline */}
        {layerType !== 'drought' && (
          <line
            x1={0} y1={zeroY} x2={width} y2={zeroY}
            stroke="rgba(255,255,255,0.2)" strokeWidth={0.5}
            strokeDasharray="3,2"
          />
        )}

        {/* Bars */}
        {bars.map((b) => (
          <rect
            key={b.year}
            x={b.x}
            y={b.y}
            width={Math.max(1, (width / (series.length || 1)) - 0.5)}
            height={b.h}
            fill={b.color}
            opacity={hovered?.year === b.year ? 1 : 0.8}
            onMouseEnter={() => setHovered({ year: b.year, value: b.value })}
          />
        ))}

        {/* Current year cursor */}
        {cursorX !== null && (
          <>
            <line
              x1={cursorX} y1={0} x2={cursorX} y2={height}
              stroke="#facc15"
              strokeWidth={1.5}
              strokeDasharray="3,2"
            />
            <circle cx={cursorX} cy={height - 4} r={3} fill="#facc15" />
          </>
        )}

        {/* Year labels at start / end */}
        {series.length > 0 && (
          <>
            <text x={2}     y={height - 2} fontSize={8} fill="rgba(255,255,255,0.4)">{series[0].year}</text>
            <text x={width - 2} y={height - 2} fontSize={8} fill="rgba(255,255,255,0.4)"
              textAnchor="end">{series[series.length - 1].year}</text>
          </>
        )}
      </svg>
    </div>
  );
}
