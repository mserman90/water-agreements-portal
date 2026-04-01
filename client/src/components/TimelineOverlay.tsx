import { useMemo, useState } from 'react';
import type { Agreement } from './MapViewer';
import MeteoTimelineChart from './MeteoTimelineChart';
import type { MeteoLayerType } from '@/hooks/useMeteoLayer';

export type TimelineMode = 'cumulative' | 'decade';

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
}

const MIN_YEAR = 1820;
const MAX_YEAR = 2024;
const ERA5_END = new Date().getFullYear() - 1;

const METRIC_OPTIONS: { key: MeteoLayerType; labelTr: string; unit: string; color: string }[] = [
  { key: 'temperature', labelTr: 'Sicaklik', unit: '°C', color: '#f97316' },
  { key: 'precipitation', labelTr: 'Yagis', unit: 'mm', color: '#38bdf8' },
  { key: 'drought', labelTr: 'Kuraklik', unit: '%', color: '#f59e0b' },
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
}: TimelineOverlayProps) {
  const [activeMetric, setActiveMetric] = useState<MeteoLayerType>('temperature');
  const [chartVisible, setChartVisible] = useState(true);

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
  const activeColor = METRIC_OPTIONS.find((m) => m.key === activeMetric)?.color ?? '#38bdf8';

  return (
    <div className="tl-overlay">
      <div className="tl-inner">
        {/* Histogram + controls */}
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
                  <div className="tl-bar-fill" style={{ height: `${pct}%` }}>
                    <div className="tl-bar-coop" style={{ height: `${coopPct}%` }} />
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
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div className="tl-mode-btns">
              <button
                className={`tl-mode-btn${mode === 'cumulative' ? ' tl-mode-btn--active' : ''}`}
                onClick={() => setMode('cumulative')}
              >
                1820–{currentYear}
              </button>
              <button
                className={`tl-mode-btn${mode === 'decade' ? ' tl-mode-btn--active' : ''}`}
                onClick={() => setMode('decade')}
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

        {/* Meteo chart section */}
        <div style={{ marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {METRIC_OPTIONS.map((opt) => {
                const isAct = opt.key === activeMetric;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setActiveMetric(opt.key)}
                    style={{
                      fontSize: 10,
                      padding: '2px 8px',
                      borderRadius: 10,
                      border: `1px solid ${isAct ? opt.color : 'rgba(255,255,255,0.15)'}`,
                      background: isAct ? `${opt.color}22` : 'transparent',
                      color: isAct ? opt.color : '#64748b',
                      fontWeight: isAct ? 700 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.labelTr}
                    <span style={{ opacity: 0.6, marginLeft: 3, fontSize: 9 }}>{opt.unit}</span>
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: 9, color: '#475569', marginLeft: 4 }}>
              ERA5 · 1940–{ERA5_END}
            </span>
            <button
              onClick={() => setChartVisible((v) => !v)}
              style={{
                marginLeft: 'auto',
                fontSize: 9,
                padding: '1px 6px',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              {chartVisible ? '▴ gizle' : '▾ goster'}
            </button>
          </div>

          {chartVisible && (
            <div style={{ borderLeft: `2px solid ${activeColor}`, paddingLeft: 4 }}>
              <MeteoTimelineChart
                metric={activeMetric}
                currentYear={currentYear}
                height={68}
              />
            </div>
          )}
        </div>

        {/* Slider */}
        <div className="tl-bottom" style={{ marginTop: 6 }}>
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
