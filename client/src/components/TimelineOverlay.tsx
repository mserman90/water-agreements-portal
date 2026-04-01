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
  selectedAgreement?: Agreement; // seçili anlaşma — meteo grafiğinde yılını vurgular
}

const MIN_YEAR = 1820;
const MAX_YEAR = 2024;
const ERA5_END = new Date().getFullYear() - 1;

const METRIC_OPTIONS: { key: MeteoLayerType; labelTr: string; unit: string; color: string }[] = [
  { key: 'temperature', labelTr: 'Sıcaklık', unit: '°C', color: '#f97316' },
  { key: 'precipitation', labelTr: 'Yağış', unit: 'mm', color: '#38bdf8' },
  { key: 'drought', labelTr: 'Kuraklık', unit: '%', color: '#f59e0b' },
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
  selectedAgreement,
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

  // Seçili anlaşmanın meteo grafiğinde gösterilecek yılı (ERA5 aralığında ise)
  const agreementMeteoYear =
    selectedAgreement && selectedAgreement.year >= 1940 && selectedAgreement.year <= ERA5_END
      ? selectedAgreement.year
      : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: 'rgba(10,20,40,0.88)',
        backdropFilter: 'blur(4px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '6px 12px 4px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* Histogram + controls */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 36 }}>
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
              title={`${b.start}–${b.end}: ${b.count} anlaşma`}
              onClick={() => setCurrentYear(b.end)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  width: '80%',
                  height: `${pct}%`,
                  minHeight: b.count > 0 ? 2 : 0,
                  background: `linear-gradient(to top, #22c55e ${coopPct}%, #ef4444 ${coopPct}%)`,
                  borderRadius: '1px 1px 0 0',
                  boxShadow: isActive ? '0 0 0 1px #facc15' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Durdur' : 'Oynat'}
          style={{
            fontSize: 13, padding: '2px 8px', borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.2)',
            background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
            color: isPlaying ? '#ef4444' : '#22c55e',
            cursor: 'pointer',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={() => setMode('cumulative')}
          style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 4,
            border: `1px solid ${mode === 'cumulative' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
            background: mode === 'cumulative' ? 'rgba(56,189,248,0.12)' : 'transparent',
            color: mode === 'cumulative' ? '#38bdf8' : '#64748b',
            cursor: 'pointer',
          }}
        >
          1820–{currentYear}
        </button>
        <button
          onClick={() => setMode('decade')}
          style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 4,
            border: `1px solid ${mode === 'decade' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
            background: mode === 'decade' ? 'rgba(56,189,248,0.12)' : 'transparent',
            color: mode === 'decade' ? '#38bdf8' : '#64748b',
            cursor: 'pointer',
          }}
        >
          {decadeStart}'lar
        </button>

        <span style={{ color: '#94a3b8', marginLeft: 4 }}>
          {totalCount} anlaşma &nbsp;
          <span style={{ color: '#22c55e' }}>✔ {coopCount}</span>&nbsp;
          <span style={{ color: '#ef4444' }}>✘ {conflictCount}</span>&nbsp;
          <span style={{ color: '#eab308' }}>∼ {mixedCount}</span>
        </span>

        {/* Seçili anlaşma bilgisi */}
        {selectedAgreement && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#f97316', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📍 {selectedAgreement.year > 0 ? selectedAgreement.year : '?'} · {selectedAgreement.name}
          </span>
        )}
      </div>

      {/* Meteo chart section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        {METRIC_OPTIONS.map((opt) => {
          const isAct = opt.key === activeMetric;
          return (
            <button
              key={opt.key}
              onClick={() => setActiveMetric(opt.key)}
              style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                border: `1px solid ${isAct ? opt.color : 'rgba(255,255,255,0.15)'}`,
                background: isAct ? `${opt.color}22` : 'transparent',
                color: isAct ? opt.color : '#64748b',
                fontWeight: isAct ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {opt.labelTr} &nbsp;{opt.unit}
            </button>
          );
        })}
        <span style={{ fontSize: 9, color: '#334155', marginLeft: 4 }}>
          ERA5 · 1940–{ERA5_END}
        </span>
        <button
          onClick={() => setChartVisible((v) => !v)}
          style={{
            marginLeft: 'auto', fontSize: 9, padding: '1px 6px', borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#475569', cursor: 'pointer',
          }}
        >
          {chartVisible ? '▴ gizle' : '▾ göster'}
        </button>
      </div>

      {chartVisible && (
        <MeteoTimelineChart
          metric={activeMetric}
          currentYear={currentYear}
          agreementYear={agreementMeteoYear}
          width={typeof window !== 'undefined' ? window.innerWidth - 24 : 860}
          height={72}
        />
      )}

      {/* Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#64748b' }}>
        <span>{MIN_YEAR}</span>
        <input
          type="range"
          className="tl-slider"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={currentYear}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span>{MAX_YEAR}</span>
        <span style={{ minWidth: 36, textAlign: 'center', color: '#e2e8f0', fontWeight: 700 }}>
          {currentYear}
        </span>
      </div>
    </div>
  );
}
