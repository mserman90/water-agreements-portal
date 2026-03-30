import { useState, useEffect, useRef } from 'react';
import { X, CloudRain, Loader2, BarChart3, Calendar, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';

interface HistoricalPrecipPanelProps {
  lat: number;
  lng: number;
  onClose: () => void;
}

interface DailyData {
  date: string;
  precipitation: number;
}

export default function HistoricalPrecipPanel({ lat, lng, onClose }: HistoricalPrecipPanelProps) {
  const { lang } = useLanguage();
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 5); // 5 days ago (ERA5 delay)
    return d.toISOString().split('T')[0];
  });
  const [data, setData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ total: number; avg: number; max: number; maxDate: string; rainyDays: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setData([]);
    setStats(null);
    try {
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum,rain_sum,snowfall_sum&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();

      if (json.error) throw new Error(json.reason || 'API error');

      const times: string[] = json.daily?.time ?? [];
      const precip: (number | null)[] = json.daily?.precipitation_sum ?? [];

      const parsed: DailyData[] = times.map((date, i) => ({
        date,
        precipitation: precip[i] ?? 0,
      }));

      setData(parsed);

      // Calculate stats
      const values = parsed.map(d => d.precipitation).filter(v => v !== null);
      const total = values.reduce((a, b) => a + b, 0);
      const avg = values.length > 0 ? total / values.length : 0;
      const max = Math.max(...values, 0);
      const maxDate = parsed.find(d => d.precipitation === max)?.date ?? '';
      const rainyDays = values.filter(v => v > 0.1).length;

      setStats({ total, avg, max, maxDate, rainyDays });
    } catch (e: any) {
      setError(e.message || 'Veri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Draw chart on canvas
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, w, h);

    const values = data.map(d => d.precipitation);
    const maxVal = Math.max(...values, 1);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'right';
      const label = ((maxVal / 4) * (4 - i)).toFixed(0);
      ctx.fillText(`${label}`, padding.left - 4, y + 3);
    }

    // Bars
    const barW = Math.max(1, chartW / data.length - (data.length > 365 ? 0 : 1));
    data.forEach((d, i) => {
      const x = padding.left + (i / data.length) * chartW;
      const barH = (d.precipitation / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      // Color based on intensity
      if (d.precipitation > 50) ctx.fillStyle = '#DC2626';
      else if (d.precipitation > 25) ctx.fillStyle = '#EA580C';
      else if (d.precipitation > 10) ctx.fillStyle = '#2563EB';
      else if (d.precipitation > 1) ctx.fillStyle = '#3B82F6';
      else if (d.precipitation > 0) ctx.fillStyle = '#93C5FD';
      else ctx.fillStyle = 'transparent';

      if (d.precipitation > 0) {
        ctx.fillRect(x, y, Math.max(barW, 1), barH);
      }
    });

    // X-axis labels (show ~5 dates)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'center';
    const step = Math.floor(data.length / 5);
    for (let i = 0; i < data.length; i += step) {
      if (i >= data.length) break;
      const x = padding.left + (i / data.length) * chartW;
      const label = data[i].date.slice(5); // MM-DD
      ctx.fillText(label, x, h - 8);
    }

    // mm label
    ctx.fillStyle = '#64748b';
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(10, padding.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('mm', 0, 0);
    ctx.restore();

  }, [data]);

  // CSV export
  const exportCSV = () => {
    if (data.length === 0) return;
    const header = 'date,precipitation_mm\n';
    const rows = data.map(d => `${d.date},${d.precipitation}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `precipitation_${lat.toFixed(2)}_${lng.toFixed(2)}_${startDate}_${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tr = lang === 'tr';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-white shadow-2xl border-t border-slate-200 max-h-[50vh] flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50 shrink-0">
        <div className="flex items-center gap-2">
          <CloudRain className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-800">
            {tr ? 'Tarihi Yağış Sorgusu' : 'Historical Precipitation Query'}
          </h3>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {lat.toFixed(3)}°, {lng.toFixed(3)}°
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-200 transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50/50 shrink-0 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <Input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="h-7 text-xs w-[130px]"
            min="1940-01-01"
          />
          <span className="text-xs text-slate-400">—</span>
          <Input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="h-7 text-xs w-[130px]"
          />
        </div>
        <Button onClick={fetchData} disabled={loading} size="sm" className="h-7 text-xs gap-1">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <BarChart3 className="h-3 w-3" />}
          {tr ? 'Sorgula' : 'Query'}
        </Button>
        {data.length > 0 && (
          <Button onClick={exportCSV} variant="outline" size="sm" className="h-7 text-xs gap-1">
            <Download className="h-3 w-3" />
            CSV
          </Button>
        )}
        <span className="text-[9px] text-slate-400 ml-auto">
          {tr ? 'Kaynak: Open-Meteo ERA5 (1940–güncel)' : 'Source: Open-Meteo ERA5 (1940–present)'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex min-h-0">
        {error ? (
          <div className="flex items-center justify-center w-full p-4 text-sm text-red-500">
            {error}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center w-full p-4 gap-2 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            {tr ? 'Veriler yükleniyor...' : 'Loading data...'}
          </div>
        ) : data.length > 0 ? (
          <>
            {/* Stats */}
            <div className="w-48 shrink-0 p-3 border-r border-slate-100 space-y-2 text-xs overflow-auto">
              <div className="font-semibold text-slate-700 text-[11px] mb-2">
                {tr ? 'İstatistikler' : 'Statistics'}
              </div>
              {stats && (
                <>
                  <div>
                    <span className="text-slate-500">{tr ? 'Toplam:' : 'Total:'}</span>
                    <span className="ml-1 font-bold text-blue-700">{stats.total.toFixed(1)} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{tr ? 'Günlük Ort.:' : 'Daily Avg:'}</span>
                    <span className="ml-1 font-semibold">{stats.avg.toFixed(1)} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{tr ? 'Maks.:' : 'Max:'}</span>
                    <span className="ml-1 font-bold text-red-600">{stats.max.toFixed(1)} mm</span>
                    <span className="block text-[9px] text-slate-400">{stats.maxDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{tr ? 'Yağışlı Gün:' : 'Rainy Days:'}</span>
                    <span className="ml-1 font-semibold">{stats.rainyDays}</span>
                    <span className="text-slate-400"> / {data.length}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500">{tr ? 'Dönem:' : 'Period:'}</span>
                    <span className="block text-[10px] font-mono">{startDate}</span>
                    <span className="block text-[10px] font-mono">{endDate}</span>
                  </div>
                </>
              )}
            </div>

            {/* Chart */}
            <div className="flex-1 p-2 min-w-0">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ minHeight: '120px' }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full p-4 text-sm text-slate-400">
            {tr ? 'Tarih aralığı seçip "Sorgula" butonuna tıklayın.' : 'Select a date range and click "Query".'}
          </div>
        )}
      </div>
    </div>
  );
}
