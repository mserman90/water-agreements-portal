import { useMemo } from 'react';
import type { Agreement } from './MapViewer';

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
                  key={`${b.start}-${b.end}`}
                  className={`tl-bar ${isActive ? 'tl-bar--active' : ''}`}
                  style={{ height: `${pct}%` }}
                  title={`${b.start}\u2013${b.end}: ${b.count} anla\u015fma`}
                >
                  <div
                    className="tl-bar-coop"
                    style={{ height: `${coopPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="tl-controls">
            <button
              type="button"
              className="tl-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Durdur' : 'Oynat'}
            >
              {isPlaying ? '\u23F8' : '\u25B6'}
            </button>

            <div className="tl-mode">
              <button
                type="button"
                className={mode === 'cumulative' ? 'tl-mode-btn tl-mode-btn--on' : 'tl-mode-btn'}
                onClick={() => setMode('cumulative')}
                title="1820'den bug\u00fcne kumulatif"
              >
                1820\u2013{currentYear}
              </button>
              <button
                type="button"
                className={mode === 'decade' ? 'tl-mode-btn tl-mode-btn--on' : 'tl-mode-btn'}
                onClick={() => setMode('decade')}
                title="Sadece bu on y\u0131l"
              >
                {decadeStart}'lar
              </button>
            </div>

            <div className="tl-counter">
              <span className="tl-counter-total">{totalCount} anla\u015fma</span>
              <span className="tl-counter-coop">\u2714 {coopCount}</span>
              <span className="tl-counter-conflict">\u2718 {conflictCount}</span>
              <span className="tl-counter-mixed">\u223C {mixedCount}</span>
            </div>
          </div>
        </div>

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
