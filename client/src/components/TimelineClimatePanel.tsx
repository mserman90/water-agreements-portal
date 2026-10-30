import { useMemo, useState } from 'react';
import type { Agreement, WaterConflict } from './MapViewer';
import MeteoTimelineChart from './MeteoTimelineChart';
import type { MeteoLayerType } from '@/hooks/useMeteoLayer';
import { useLanguage } from '@/i18n/LanguageContext';
import { getItemDisplayName, isWaterConflictItem } from '@/lib/treatyTranslator';
import { PACIFIC_CATEGORIES } from '@/data/conflictsTr';
import { Play, Pause, Calendar, TrendingUp, Droplets, Thermometer, CloudRain, Award } from 'lucide-react';

export type TimelineMode = 'cumulative' | 'decade';

interface Bin {
  start: number;
  end: number;
}

interface TimelineClimatePanelProps {
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
  selectedAgreement?: Agreement | WaterConflict;
  onSelectAgreement?: (id: string) => void;
}

const MIN_YEAR = 1820;
const MAX_YEAR = 2026;
const ERA5_END = 2025;

const METRIC_OPTIONS: { key: MeteoLayerType; labelTr: string; labelEn: string; unit: string; color: string; icon: any }[] = [
  { key: 'temperature', labelTr: 'Sıcaklık', labelEn: 'Temperature', unit: '°C', color: '#f97316', icon: Thermometer },
  { key: 'precipitation', labelTr: 'Yağış', labelEn: 'Precipitation', unit: 'mm', color: '#38bdf8', icon: CloudRain },
  { key: 'drought', labelTr: 'Kuraklık', labelEn: 'Drought', unit: '%', color: '#f59e0b', icon: Droplets },
];

const HISTORIC_MILESTONES = [
  { year: 1960, labelTr: '1960 İndus Anlaşması', labelEn: '1960 Indus Treaty', basin: 'Indus' },
  { year: 1994, labelTr: '1994 İsrail-Ürdün', labelEn: '1994 Israel-Jordan', basin: 'Jordan' },
  { year: 1995, labelTr: '1995 Mekong Anlaşması', labelEn: '1995 Mekong Agreement', basin: 'Mekong' },
  { year: 1997, labelTr: '1997 BM Su Sözleşmesi', labelEn: '1997 UN Watercourses', basin: 'Global' },
  { year: 2015, labelTr: '2015 Nil İlkeler Bildirgesi', labelEn: '2015 Nile GERD Declaration', basin: 'Nile' },
  { year: 2024, labelTr: '2024 Türkiye-Irak Su Anlaşması & Nil CFA', labelEn: '2024 Turkey-Iraq & Nile CFA', basin: 'Tigris-Nile' },
  { year: 2025, labelTr: '2025 Kolombiya Nehri Antlaşması', labelEn: '2025 Modern Columbia Treaty', basin: 'Columbia' },
  { year: 2026, labelTr: '2026 Kuzey Aral Denizi Antlaşması', labelEn: '2026 Northern Aral Treaty', basin: 'Aral Sea' },
];

export default function TimelineClimatePanel({
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
}: TimelineClimatePanelProps) {
  const { lang } = useLanguage();
  const [activeMetric, setActiveMetric] = useState<MeteoLayerType>('temperature');
  const [chartExpanded, setChartExpanded] = useState(true);

  // Bin statistics for 5-year histogram
  const binStats = useMemo(
    () =>
      bins.map((b) => {
        const matching = agreements.filter((a) => a.year >= b.start && a.year <= b.end);
        const count = matching.length;
        const coop = matching.filter(
          (a) =>
            a.purpose?.toLowerCase().includes('cooper') ||
            a.purpose?.toLowerCase().includes('alloc') ||
            a.purpose?.toLowerCase().includes('joint'),
        ).length;
        return {
          ...b,
          count,
          coopPct: count > 0 ? (coop / count) * 100 : 0,
        };
      }),
    [bins, agreements],
  );

  const maxCount = useMemo(
    () => binStats.reduce((m, x) => (x.count > m ? x.count : m), 0) || 1,
    [binStats],
  );

  const activeBinIndex = useMemo(
    () => binStats.findIndex((b) => currentYear >= b.start && currentYear <= b.end),
    [binStats, currentYear],
  );

  const decadeStart = Math.floor(currentYear / 10) * 10;

  // Selected item coordinates and ERA5 year
  const agreementMeteoYear =
    selectedAgreement && selectedAgreement.year >= 1940 && selectedAgreement.year <= ERA5_END
      ? selectedAgreement.year
      : undefined;

  const isConflict = selectedAgreement ? isWaterConflictItem(selectedAgreement) : false;

  // Display title for selected item
  const selectedTitle = useMemo(() => {
    if (!selectedAgreement) return '';
    return getItemDisplayName(selectedAgreement, lang);
  }, [selectedAgreement, lang]);

  const countryDisplay = useMemo(() => {
    if (!selectedAgreement) return '';
    return isWaterConflictItem(selectedAgreement)
      ? selectedAgreement.countries
      : selectedAgreement.country;
  }, [selectedAgreement]);

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Header Card with Active Year & Controls */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 10,
          padding: 12,
          color: '#f8fafc',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={16} color="#38bdf8" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
              {lang === 'tr' ? 'Zaman Çizelgesi' : 'Timeline Control'}
            </span>
          </div>

          <div
            style={{
              background: '#0284c7',
              color: '#ffffff',
              padding: '2px 10px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(2,132,199,0.4)',
            }}
          >
            {currentYear}
          </div>
        </div>

        {/* Playback & Mode Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 6,
              border: `1px solid ${isPlaying ? '#ef4444' : '#22c55e'}`,
              background: isPlaying ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
              color: isPlaying ? '#fca5a5' : '#86efac',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={isPlaying ? (lang === 'tr' ? 'Durdur' : 'Pause') : (lang === 'tr' ? 'Animasyonu Oynat' : 'Play Animation')}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? (lang === 'tr' ? 'Durdur' : 'Pause') : (lang === 'tr' ? 'Oynat' : 'Play')}</span>
          </button>

          <button
            onClick={() => setMode('cumulative')}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: `1px solid ${mode === 'cumulative' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}`,
              background: mode === 'cumulative' ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.05)',
              color: mode === 'cumulative' ? '#38bdf8' : '#94a3b8',
              fontSize: 11,
              fontWeight: mode === 'cumulative' ? 700 : 500,
              cursor: 'pointer',
            }}
            title={lang === 'tr' ? '1820 yılından seçili yıla kadar kümülatif göster' : 'Show cumulative from 1820 to current year'}
          >
            1820–{currentYear}
          </button>

          <button
            onClick={() => setMode('decade')}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: `1px solid ${mode === 'decade' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}`,
              background: mode === 'decade' ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.05)',
              color: mode === 'decade' ? '#38bdf8' : '#94a3b8',
              fontSize: 11,
              fontWeight: mode === 'decade' ? 700 : 500,
              cursor: 'pointer',
            }}
            title={lang === 'tr' ? 'Sadece ilgili 10 yılı göster' : 'Show decade only'}
          >
            {decadeStart}{lang === 'tr' ? "'lar" : "s"}
          </button>
        </div>

        {/* Year Slider with quick jump buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#94a3b8' }}>
            <span>{MIN_YEAR}</span>
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              style={{
                flex: 1,
                accentColor: '#0284c7',
                cursor: 'pointer',
              }}
            />
            <span>{MAX_YEAR}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginTop: 4 }}>
            <button
              onClick={() => setCurrentYear(Math.max(MIN_YEAR, currentYear - 10))}
              style={{ flex: 1, padding: '3px 0', fontSize: 10, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 4, color: '#cbd5e1', cursor: 'pointer' }}
            >
              -10 {lang === 'tr' ? 'Yıl' : 'Yr'}
            </button>
            <button
              onClick={() => setCurrentYear(Math.max(MIN_YEAR, currentYear - 1))}
              style={{ flex: 1, padding: '3px 0', fontSize: 10, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 4, color: '#cbd5e1', cursor: 'pointer' }}
            >
              -1 {lang === 'tr' ? 'Yıl' : 'Yr'}
            </button>
            <button
              onClick={() => setCurrentYear(Math.min(MAX_YEAR, currentYear + 1))}
              style={{ flex: 1, padding: '3px 0', fontSize: 10, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 4, color: '#cbd5e1', cursor: 'pointer' }}
            >
              +1 {lang === 'tr' ? 'Yıl' : 'Yr'}
            </button>
            <button
              onClick={() => setCurrentYear(Math.min(MAX_YEAR, currentYear + 10))}
              style={{ flex: 1, padding: '3px 0', fontSize: 10, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 4, color: '#cbd5e1', cursor: 'pointer' }}
            >
              +10 {lang === 'tr' ? 'Yıl' : 'Yr'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5-Year Histogram Distribution */}
      <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#334155' }}>
            {lang === 'tr' ? '5 Yıllık Anlaşma Dağılımı (1820–2026)' : '5-Year Distribution (1820–2026)'}
          </span>
          <span style={{ fontSize: 10.5, color: '#64748b' }}>
            {lang === 'tr' ? 'Yeşil: İşbirliği / Kırmızı: Çatışma' : 'Green: Coop / Red: Conflict'}
          </span>
        </div>

        {/* Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 44, padding: '2px 0', borderBottom: '1px solid #cbd5e1' }}>
          {binStats.map((b, idx) => {
            const pct = (b.count / maxCount) * 100;
            const isActive = idx === activeBinIndex;
            return (
              <div
                key={b.start}
                title={`${b.start}–${b.end}: ${b.count} ${lang === 'tr' ? 'anlaşma' : 'treaties'} (%${Math.round(b.coopPct)} işbirliği)`}
                onClick={() => setCurrentYear(b.end)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.65,
                  transition: 'opacity 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${pct}%`,
                    minHeight: b.count > 0 ? 3 : 1,
                    background:
                      b.count > 0
                        ? `linear-gradient(to top, #22c55e ${b.coopPct}%, #ef4444 ${b.coopPct}%)`
                        : '#cbd5e1',
                    borderRadius: '1px 1px 0 0',
                    boxShadow: isActive ? '0 0 0 1.5px #0284c7' : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#94a3b8', marginTop: 3 }}>
          <span>1820</span>
          <span>1900</span>
          <span>1950</span>
          <span>2000</span>
          <span>2026</span>
        </div>
      </div>

      {/* 3. Live Statistics Summary Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: '#f0f9ff', padding: '8px 10px', borderRadius: 8, border: '1px solid #bae6fd' }}>
          <div style={{ fontSize: 10.5, color: '#0369a1', fontWeight: 600 }}>
            {lang === 'tr' ? 'Seçili Dönem Anlaşma' : 'Active Period Treaties'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', marginTop: 2 }}>
            {totalCount}
          </div>
        </div>

        <div style={{ background: '#f0fdf4', padding: '8px 10px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: 10.5, color: '#15803d', fontWeight: 600 }}>
            {lang === 'tr' ? 'İşbirliği Oranı' : 'Cooperation'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#16a34a', marginTop: 2 }}>
            ✔ {coopCount}
          </div>
        </div>

        <div style={{ background: '#fef2f2', padding: '8px 10px', borderRadius: 8, border: '1px solid #fecaca' }}>
          <div style={{ fontSize: 10.5, color: '#b91c1c', fontWeight: 600 }}>
            {lang === 'tr' ? 'Uyuşmazlık / Anlaşmazlık' : 'Conflict / Disputes'}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#dc2626', marginTop: 2 }}>
            ✘ {conflictCount}
          </div>
        </div>

        <div style={{ background: '#fefce8', padding: '8px 10px', borderRadius: 8, border: '1px solid #fef08a' }}>
          <div style={{ fontSize: 10.5, color: '#a16207', fontWeight: 600 }}>
            {lang === 'tr' ? 'Karma / Teknik' : 'Mixed / Technical'}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#ca8a04', marginTop: 2 }}>
            ∼ {mixedCount}
          </div>
        </div>
      </div>

      {/* 4. Selected Agreement / Event Banner */}
      {selectedAgreement && (
        <div
          style={{
            background: isConflict ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${isConflict ? '#fca5a5' : '#86efac'}`,
            borderRadius: 8,
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 4,
                background: isConflict ? '#ef4444' : '#16a34a',
                color: '#fff',
              }}
            >
              {isConflict
                ? lang === 'tr' ? '⚡ Su Uyuşmazlığı (BAR)' : '⚡ Water Conflict (BAR)'
                : lang === 'tr' ? '📄 Anlaşma' : '📄 Treaty'}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: isConflict ? '#dc2626' : '#15803d' }}>
              {selectedAgreement.year > 0 ? selectedAgreement.year : '?'}
            </span>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
            {selectedTitle}
          </div>

          <div style={{ fontSize: 10.5, color: '#64748b' }}>
            🌊 {selectedAgreement.basin || (lang === 'tr' ? 'Bilinmeyen Havza' : 'Unknown Basin')} · 🌐 {countryDisplay}
          </div>

          {/* Pacific Category badge & reference for conflicts */}
          {isConflict && (selectedAgreement as WaterConflict).pacificCategory && (
            (() => {
              const pCat = (selectedAgreement as WaterConflict).pacificCategory!;
              const meta = PACIFIC_CATEGORIES[pCat];
              const refUrl = (selectedAgreement as WaterConflict).pacificRefUrl || 'https://worldwater.org/conflict/refs.html';
              return (
                <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: meta.bg, border: `1px solid ${meta.border}`, padding: '2px 6px', borderRadius: 4 }}>
                    <span style={{ fontSize: 11 }}>{meta.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: meta.color }}>
                      {lang === 'tr' ? meta.badgeTr : meta.badgeEn}
                    </span>
                    <span style={{ fontSize: 9.5, color: '#64748b', marginLeft: 'auto' }}>
                      (Pacific Inst.)
                    </span>
                  </div>
                  <div style={{ fontSize: 9.5, color: '#475569', lineHeight: 1.25 }}>
                    {lang === 'tr' ? meta.descriptionTr : meta.descriptionEn}
                  </div>
                  <a
                    href={refUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 10, color: '#0284c7', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                  >
                    🏛️ {lang === 'tr' ? 'Pacific Institute Kaynakça & Literatür ↗' : 'Pacific Institute Chronology Reference ↗'}
                  </a>
                </div>
              );
            })()
          )}

          {selectedAgreement.latitude && selectedAgreement.longitude && (
            <div style={{ fontSize: 10, color: '#0284c7', fontWeight: 600, marginTop: 2 }}>
              📍 ERA5 Koordinat Odak: {selectedAgreement.latitude.toFixed(2)}°, {selectedAgreement.longitude.toFixed(2)}°
            </div>
          )}
        </div>
      )}

      {/* 5. ERA5 Climate Analysis Suite */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={16} color="#0284c7" />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
              {lang === 'tr' ? 'ERA5 İklim Analizi (1940–Bugün)' : 'ERA5 Climate Analysis (1940–Present)'}
            </span>
          </div>

          <button
            onClick={() => setChartExpanded(!chartExpanded)}
            style={{
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {chartExpanded ? (lang === 'tr' ? '▲ Gizle' : '▲ Hide') : (lang === 'tr' ? '▼ Göster' : '▼ Show')}
          </button>
        </div>

        {/* Metric Selector Pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {METRIC_OPTIONS.map((opt) => {
            const isAct = opt.key === activeMetric;
            const label = lang === 'tr' ? opt.labelTr : opt.labelEn;
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setActiveMetric(opt.key)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  fontSize: 10.5,
                  padding: '5px 6px',
                  borderRadius: 6,
                  border: `1px solid ${isAct ? opt.color : '#e2e8f0'}`,
                  background: isAct ? `${opt.color}18` : '#f8fafc',
                  color: isAct ? opt.color : '#64748b',
                  fontWeight: isAct ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={12} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Meteo Timeline Chart */}
        {chartExpanded && (
          <div style={{ background: '#0a1428', borderRadius: 6, padding: '8px 6px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, padding: '0 4px' }}>
              <span style={{ fontSize: 9.5, color: '#94a3b8' }}>
                {activeMetric === 'temperature' && (lang === 'tr' ? 'Yıllık Sıcaklık Anomalisi (°C)' : 'Annual Temperature Anomaly (°C)')}
                {activeMetric === 'precipitation' && (lang === 'tr' ? 'Yıllık Yağış Anomalisi (mm)' : 'Annual Precipitation Anomaly (mm)')}
                {activeMetric === 'drought' && (lang === 'tr' ? 'Yıllık Kuraklık Endeksi (%)' : 'Annual Drought Index (%)')}
              </span>
              <span style={{ fontSize: 9.5, color: '#38bdf8', fontWeight: 600 }}>
                {selectedAgreement?.basin || (lang === 'tr' ? 'Genel Havza' : 'Global Baseline')}
              </span>
            </div>

            <MeteoTimelineChart
              metric={activeMetric}
              currentYear={currentYear}
              agreementYear={agreementMeteoYear}
              lat={selectedAgreement?.latitude}
              lng={selectedAgreement?.longitude}
              width={320}
              height={85}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#64748b', marginTop: 4, padding: '0 4px' }}>
              <span>1940</span>
              <span style={{ color: '#facc15' }}>● {currentYear}</span>
              {agreementMeteoYear && (
                <span style={{ color: '#f97316' }}>★ {agreementMeteoYear}</span>
              )}
              <span>{ERA5_END}</span>
            </div>
          </div>
        )}

        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, background: '#f8fafc', padding: 8, borderRadius: 6 }}>
          💡 {lang === 'tr'
            ? 'Open-Meteo ERA5 tarihi arşivi (1940-günümüz) kullanılarak havzadaki iklim şokları ve su diplomasisi etkileşimi analiz edilir.'
            : 'Integrates Open-Meteo ERA5 historical archive (1940-present) to observe climate stress alongside diplomatic treaties.'}
        </div>
      </div>

      {/* 6. Historic Milestones Quick Jumps */}
      <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Award size={15} color="#0369a1" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
            {lang === 'tr' ? 'Önemli Su Diplomasisi Dönüm Noktaları' : 'Historic Water Milestones'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {HISTORIC_MILESTONES.map((m) => (
            <button
              key={m.year}
              onClick={() => setCurrentYear(m.year)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 6,
                background: currentYear === m.year ? '#e0f2fe' : '#ffffff',
                border: `1px solid ${currentYear === m.year ? '#0284c7' : '#e2e8f0'}`,
                color: currentYear === m.year ? '#0284c7' : '#334155',
                fontSize: 11,
                fontWeight: currentYear === m.year ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{lang === 'tr' ? m.labelTr : m.labelEn}</span>
              <span style={{ fontSize: 10, color: '#64748b', background: 'rgba(0,0,0,0.04)', padding: '1px 6px', borderRadius: 4 }}>
                {m.basin}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
