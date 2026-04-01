import { useMemo } from 'react';
import { useBasinClimate, ClimateStats } from '@/hooks/useBasinClimate';
import { BasinClimateInfo } from '@/data/basinClimateData';
import { useLanguage } from '@/i18n/LanguageContext';

interface BasinClimateDashboardProps {
  basin: BasinClimateInfo;
}

export default function BasinClimateDashboard({ basin }: BasinClimateDashboardProps) {
  const { lang } = useLanguage();
  const { stats, annualSeries, loading, error } = useBasinClimate(basin.lat, basin.lng);

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        {lang === 'tr' ? 'İklim verileri yükleniyor...' : 'Loading climate data...'}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        {lang === 'tr' ? 'Hata: ' : 'Error: '}{error}
      </div>
    );
  }

  if (!stats || annualSeries.length === 0) return null;

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
        🌡️ {lang === 'tr' ? 'İklim & Hidroloji' : 'Climate & Hydrology'}
      </h4>
      <p className="text-xs text-gray-600 mb-4">
        {lang === 'tr' ? basin.descTr : basin.descEn}
      </p>
      <StatsGrid stats={stats} lang={lang} />
      <div className="mt-4 space-y-4">
        <MiniChart
          title={lang === 'tr' ? 'Yıllık Yağış (mm)' : 'Annual Precipitation (mm)'}
          data={annualSeries.map(a => ({ year: a.year, value: a.precip }))}
          color="#3b82f6"
        />
        <MiniChart
          title={lang === 'tr' ? 'Ort. Maks. Sıcaklık (°C)' : 'Avg Max Temp (°C)'}
          data={annualSeries.map(a => ({ year: a.year, value: a.tempMax }))}
          color="#ef4444"
        />
        <MiniChart
          title={lang === 'tr' ? 'Toprak Nemi (m³/m³)' : 'Soil Moisture (m³/m³)'}
          data={annualSeries.map(a => ({ year: a.year, value: a.soilMoist }))}
          color="#8b5cf6"
          precision={3}
        />
      </div>
    </div>
  );
}

// ── Stats Grid ────────────────────────────────────────────────────────────────
function StatsGrid({ stats, lang }: { stats: ClimateStats; lang: string }) {
  const items = [
    { label: lang === 'tr' ? 'Ort. Yağış' : 'Mean Precip', value: `${stats.meanAnnualPrecip} mm/yr` },
    { label: lang === 'tr' ? 'Ort. Sıcaklık' : 'Mean Temp', value: `${stats.meanTempMax}/${stats.meanTempMin} °C` },
    { label: lang === 'tr' ? 'Arıdıte' : 'Aridity', value: stats.aridity.toFixed(2), alert: stats.aridity > 1 },
    { label: lang === 'tr' ? 'Yağış Trendi' : 'Precip Trend', value: `${stats.precipTrend > 0 ? '+' : ''}${stats.precipTrend} mm/dec`, alert: stats.precipTrend < 0 },
    { label: lang === 'tr' ? 'Sıcaklık Trendi' : 'Temp Trend', value: `+${stats.tempTrend} °C/dec`, alert: stats.tempTrend > 0.3 },
    { label: lang === 'tr' ? 'Kurakhık Yılları' : 'Drought Years', value: stats.droughtYears.length, alert: stats.droughtYears.length > 5 },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      {items.map((it, i) => (
        <div key={i} className="bg-gray-50 p-2 rounded">
          <div className="font-medium text-gray-600">{it.label}</div>
          <div className={`text-sm font-bold ${it.alert ? 'text-orange-600' : 'text-gray-900'}`}>
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Mini Sparkline Chart ──────────────────────────────────────────────────────
function MiniChart({ title, data, color, precision = 0 }: { title: string; data: {year: number; value: number}[]; color: string; precision?: number }) {
  const W = 300, H = 80;
  const { xScale, yScale, path } = useMemo(() => {
    if (data.length < 2) return { xScale: () => 0, yScale: () => 0, path: '' };
    const xs = data.map(d => d.year);
    const ys = data.map(d => d.value);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const pad = (yMax - yMin) * 0.1 || 1;
    const xScale = (x: number) => ((x - xMin) / (xMax - xMin || 1)) * W;
    const yScale = (y: number) => H - ((y - (yMin - pad)) / ((yMax + pad) - (yMin - pad) || 1)) * H;
    const pathStr = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(d.year).toFixed(1)},${yScale(d.value).toFixed(1)}`).join(' ');
    return { xScale, yScale, path: pathStr };
  }, [data]);

  return (
    <div>
      <div className="text-xs font-medium text-gray-700 mb-1">{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-gray-200 rounded bg-white">
        <path d={path} fill="none" stroke={color} strokeWidth="2" />
        {data.map((d, i) => (
          <circle key={i} cx={xScale(d.year)} cy={yScale(d.value)} r="2" fill={color} />
        ))}
      </svg>
      <div className="text-[10px] text-gray-500 mt-1 flex justify-between">
        <span>{data[0]?.year}</span>
        <span>{data[data.length-1]?.year} - {data[data.length-1]?.value.toFixed(precision)}</span>
      </div>
    </div>
  );
}
