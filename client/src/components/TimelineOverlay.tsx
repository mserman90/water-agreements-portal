import { useMemo, useState } from 'react';
import type { Agreement } from './MapViewer';
import MeteoTimelineChart from './MeteoTimelineChart';

export type TimelineMode = 'cumulative' | 'decade';

type MetricKey = 'temperature_2m_mean' | 'precipitation_sum' | 'et0_fao_evapotranspiration';

interface Bin {
  start: number;
  end: number;
}

interface TimelineOverlayProps {
  currentYear: number;
  setCurrentYear: (y: number) => void;
  mode: TimelineMode;
  setMode: (m: TimelineMode) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  bins: Bin[];
  agreements: Agreement[];
  totalCount: number;
  coopCount: number;
  conflictCount: number;
  mixedCount: number;
  activeMeteoLayers?: string[];
}

const MIN_YEAR = 1820;
const MAX_YEAR = 2024;

const METRIC_OPTIONS: { key: MetricKey; label: string; shortLabel: string }[] = [
  { key: 'temperature_2m_mean', label: 'Sicaklik Anomalisi', shortLabel: 'TEMP' },
  { key: 'precipitation_sum', label: 'Yagis Anomalisi', shortLabel: 'YAGIS' },
  { key: 'et0_fao_evapotranspiration', label: 'Kuraklik Endeksi (ET0)', shortLabel: 'ET0' },
];

export default function TimelineOverlay({
  currentYear,
  setCurrentYear,
  mode,
  setMode,
  isPlaying,
  setIsPlaying,
  bins,
  agreements,
  totalCount,
  coopCount,
  conflictCount,
  mixedCount,
  activeMeteoLayers = [],
}: TimelineOverlayProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('temperature_2m_mean');
  const [showMeteoChart, setShowMeteoChart] = useState(true);

  const binStats = useMemo(
    () =>
      bins.map((b) => {
        const count = agreements.filter(
          (a) => a.year >= b.start && a.year <= b.end,
        ).length;
        return { ...b, count };
      }),
    [bins, agreements],
  );
  const maxCount = binStats.reduce((m, x) => (x.count > m ? x.count : m), 0) || 1;
  const activeBinIndex = binStats.findIndex(
    (b) => currentYear >= b.start && currentYear <= b.end,
  );
  const decadeStart = Math.floor(currentYear / 10) * 10;
  const hasMeteoLayers = activeMeteoLayers.length > 0;

  return (
    <div className="tl-overlay">
      <div className="tl-inner">
        {/* Top row: histogram + controls */}
        <div className="tl-top">
          <div className="tl-histogram">
            {binStats.map((b, idx) => {
              const pct = (b.count / maxCount) * 100;
              const isActive = idx === activeBinIndex;
              const coopPct =
                b.count > 0
                  ? (agreements.filter(
                      (a) =>
                        a.year >= b.start &&
                        a.year <= b.end &&
                        (a.purpose?.toLowerCase().includes('cooper') ||
                          a.purpose?.toLowerCase().includes('alloc') ||
                          a.purpose?.toLowerCase().includes('joint')),
                    ).length /
                      b.count) *
                    100
                  : 0;
              return (
                <div
                  key={b.start}
                  className={`tl-bar${isActive ? ' tl-bar--active' : ''}`}
                  title={`${b.start}-${b.end}: ${b.count} anlasma`}
                  onClick={() => setCurrentYear(b.end)}
                >
                  <div
                    className="tl-bar-fill"
                    style={{ height: `${pct}%` }}
                  >
                    <div
                      className="tl-bar-coop"
                      style={{ height: `${coopPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="tl-controls">
            <button
              className="tl-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Durdur' : 'Oynat'}
            >
              {isPlaying ? '\u23F8' : '\u25B6'}
            </button>
            <div className="tl-mode-btns">
              <button
                className={`tl-mode-btn${mode === 'cumulative' ? ' tl-mode-btn--active' : ''}`}
                onClick={() => setMode('cumulative')}
                title="1820'den bugune kumulatif"
              >
                1820–{currentYear}
              </button>
              <button
                className={`tl-mode-btn${mode === 'decade' ? ' tl-mode-btn--active' : ''}`}
                onClick={() => setMode('decade')}
                title="Sadece bu on yil"
              >
                {decadeStart}'lar
              </button>
            </div>
            <div className="tl-counter">
              <span className="tl-counter-total">{totalCount} anlasma</span>
              <span className="tl-counter-coop">✔ {coopCount}</span>
              <span className="tl-counter-conflict">✘ {conflictCount}</span>
              <span className="tl-counter-mixed">∼ {mixedCount}</span>
            </div>
          </div>
        </div>

        {/* Meteo timeline chart section */}
        {(hasMeteoLayers || showMeteoChart) && (
          <div
            style={{
              marginTop: 6,
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 6,
            }}
          >
            {/* Chart header with metric selector and toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: '#94a3b8',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                Meteoroloji Grafigi
              </span>
              <div style={{ display: 'flex', gap: 3, marginLeft: 4 }}>
                {METRIC_OPTIONS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setActiveMetric(m.key)}
                    title={m.label}
                    style={{
                      fontSize: 9,
                      padding: '1px 5px',
                      borderRadius: 3,
                      border: '1px solid',
                      cursor: 'pointer',
                      borderColor: activeMetric === m.key ? '#3b82f6' : 'rgba(255,255,255,0.2)',
                      background: activeMetric === m.key ? 'rgba(59,130,246,0.25)' : 'transparent',
                      color: activeMetric === m.key ? '#60a5fa' : '#94a3b8',
                      fontWeight: activeMetric === m.key ? 700 : 400,
                    }}
                  >
                    {m.shortLabel}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowMeteoChart((v) => !v)}
                title={showMeteoChart ? 'Grafigi gizle' : 'Grafigi goster'}
                style={{
                  marginLeft: 'auto',
                  fontSize: 9,
                  padding: '1px 5px',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                {showMeteoChart ? '\u25B4 Gizle' : '\u25BE Goster'}
              </button>
            </div>

            {/* The actual SVG sparkline chart */}
            {showMeteoChart && (
              <MeteoTimelineChart
                metric={activeMetric}
                currentYear={currentYear}
                width={860}
                height={60}
              />
            )}
          </div>
        )}

        {/* Bottom row: slider */}
        <div className="tl-bottom">
          <span className="tl-year-label">{MIN_YEAR}</span>
          <input
            type="range"
            className="tl-slider"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
          />
          <span className="tl-year-label">{MAX_YEAR}</span>
          <span className="tl-year-current">{currentYear}</span>
        </div>
      </div>
    </div>
  );
}
