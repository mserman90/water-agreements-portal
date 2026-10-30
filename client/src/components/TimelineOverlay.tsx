import { useMemo, useState } from 'react';
import type { Agreement } from './MapViewer';
import MeteoTimelineChart from './MeteoTimelineChart';
import type { MeteoLayerType } from '@/hooks/useMeteoLayer';
import { useLanguage } from '@/i18n/LanguageContext';
import { translateTreatyTitle } from '@/lib/treatyTranslator';

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

const METRIC_OPTIONS: { key: MeteoLayerType; labelTr: string; labelEn: string; unit: string; color: string }[] = [
  { key: 'temperature', labelTr: 'Sıcaklık', labelEn: 'Temperature', unit: '°C', color: '#f97316' },
  { key: 'precipitation', labelTr: 'Yağış', labelEn: 'Precipitation', unit: 'mm', color: '#38bdf8' },
  { key: 'drought', labelTr: 'Kuraklık', labelEn: 'Drought', unit: '%', color: '#f59e0b' },
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
  const { lang } = useLanguage();

  // Varsayılan ayar: KAPALI (collapsed = true)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('water_portal_bottom_panel_collapsed');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('water_portal_bottom_panel_collapsed', String(next));
      return next;
    });
  };

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

  // Seçili anlaşmanın meteo grafiğinde gösterilecek yılı (ERA5 aralığında ise)
  const agreementMeteoYear =
    selectedAgreement && selectedAgreement.year >= 1940 && selectedAgreement.year <= ERA5_END
      ? selectedAgreement.year
      : undefined;

  // KAPALI DURUM: Şık, haritayı kapatmayan açma butonu
  if (isCollapsed) {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 24,
          padding: '7px 16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          color: '#f8fafc',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
          transition: 'all 0.2s ease',
          userSelect: 'none',
        }}
        onClick={toggleCollapse}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.98)';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.92)';
          e.currentTarget.style.transform = 'translateX(-50%)';
        }}
        title={lang === 'tr' ? 'Alt paneli aç (Zaman Çizelgesi & İklim)' : 'Open bottom panel (Timeline & Climate)'}
      >
        <span style={{ fontSize: 13 }}>📅</span>
        <span>{lang === 'tr' ? 'Zaman Çizelgesi & İklim Paneli' : 'Timeline & Climate Panel'}</span>
        <span
          style={{
            background: '#0284c7',
            color: '#fff',
            padding: '1px 7px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {currentYear}
        </span>
        <span style={{ fontSize: 11, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 2, marginLeft: 2 }}>
          ▲ {lang === 'tr' ? 'Aç' : 'Open'}
        </span>
      </div>
    );
  }

  // AÇIK DURUM: Kapatılabilir tam panel
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: 'rgba(10,20,40,0.92)',
        backdropFilter: 'blur(6px)',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        padding: '6px 14px 6px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Panel Üst Başlık & Kapatma Barı */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#e2e8f0', fontWeight: 600 }}>
          <span>📅</span>
          <span>{lang === 'tr' ? 'Tarihsel Zaman Çizelgesi & ERA5 İklim Analizi' : 'Historical Timeline & ERA5 Climate Analysis'}</span>
          <span style={{ background: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: 10, fontSize: 10.5, fontWeight: 700 }}>
            {currentYear}
          </span>
        </div>

        <button
          onClick={toggleCollapse}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#cbd5e1',
            borderRadius: 4,
            padding: '2px 8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
            e.currentTarget.style.color = '#fca5a5';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#cbd5e1';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
          title={lang === 'tr' ? 'Alt paneli kapat' : 'Close bottom panel'}
        >
          <span>▼</span>
          <span>{lang === 'tr' ? 'Paneli Kapat' : 'Close Panel'}</span>
        </button>
      </div>

      {/* Histogram */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 34 }}>
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
              title={`${b.start}–${b.end}: ${b.count} ${lang === 'tr' ? 'anlaşma' : 'agreements'}`}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, flexWrap: 'wrap' }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? (lang === 'tr' ? 'Durdur' : 'Pause') : (lang === 'tr' ? 'Oynat' : 'Play')}
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
          {decadeStart}{lang === 'tr' ? "'lar" : "s"}
        </button>

        <span style={{ color: '#94a3b8', marginLeft: 4 }}>
          {totalCount} {lang === 'tr' ? 'anlaşma' : 'treaties'} &nbsp;
          <span style={{ color: '#22c55e' }}>✔ {coopCount}</span>&nbsp;
          <span style={{ color: '#ef4444' }}>✘ {conflictCount}</span>&nbsp;
          <span style={{ color: '#eab308' }}>∼ {mixedCount}</span>
        </span>

        {/* Seçili anlaşma bilgisi */}
        {selectedAgreement && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#f97316', fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📍 {selectedAgreement.year > 0 ? selectedAgreement.year : '?'} · {translateTreatyTitle(selectedAgreement.name, lang)}
          </span>
        )}
      </div>

      {/* Meteo chart section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
        {METRIC_OPTIONS.map((opt) => {
          const isAct = opt.key === activeMetric;
          const label = lang === 'tr' ? opt.labelTr : opt.labelEn;
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
              {label} &nbsp;{opt.unit}
            </button>
          );
        })}
        <span style={{ fontSize: 9, color: '#475569', marginLeft: 4 }}>
          ERA5 · 1940–{ERA5_END}
        </span>
        <button
          onClick={() => setChartVisible((v) => !v)}
          style={{
            marginLeft: 'auto', fontSize: 9, padding: '1px 6px', borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#64748b', cursor: 'pointer',
          }}
        >
          {chartVisible
            ? lang === 'tr' ? '▴ grafik gizle' : '▴ hide chart'
            : lang === 'tr' ? '▾ grafik göster' : '▾ show chart'}
        </button>
      </div>

      {chartVisible && (
        <MeteoTimelineChart
          metric={activeMetric}
          currentYear={currentYear}
          agreementYear={agreementMeteoYear}
          lat={selectedAgreement?.latitude}
          lng={selectedAgreement?.longitude}
          width={typeof window !== 'undefined' ? window.innerWidth - 28 : 860}
          height={70}
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
