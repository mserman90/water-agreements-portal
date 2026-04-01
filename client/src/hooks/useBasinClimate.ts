import { useState, useEffect, useRef } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export interface DailyClimatePoint {
  date: string;           // YYYY-MM-DD
  precip: number;         // precipitation_sum  (mm)
  tempMax: number;        // temperature_2m_max (°C)
  tempMin: number;        // temperature_2m_min (°C)
  et0: number;            // et0_fao_evapotranspiration (mm)
  soilMoist0_7: number;   // soil_moisture_0_to_7cm  (m³/m³)
  soilMoist7_28: number;  // soil_moisture_7_to_28cm (m³/m³)
}

export interface ClimateStats {
  meanAnnualPrecip: number;    // mm/year
  meanTempMax: number;         // °C
  meanTempMin: number;         // °C
  meanET0: number;             // mm/day
  aridity: number;             // PET/P ratio (>1 = arid)
  precipTrend: number;         // mm/decade (linear slope * 10)
  tempTrend: number;           // °C/decade
  droughtYears: number[];      // years with precip < 75% of mean
}

export interface BasinClimateResult {
  data: DailyClimatePoint[];
  stats: ClimateStats | null;
  annualSeries: { year: number; precip: number; tempMax: number; et0: number; soilMoist: number }[];
  loading: boolean;
  error: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function linearSlope(ys: number[]): number {
  const n = ys.length;
  if (n < 2) return 0;
  const xs = ys.map((_, i) => i);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const den = xs.reduce((s, x) => s + (x - mx) ** 2, 0);
  return den === 0 ? 0 : num / den;
}

function groupByYear(
  daily: DailyClimatePoint[]
): { year: number; precip: number; tempMax: number; et0: number; soilMoist: number }[] {
  const map = new Map<number, { precip: number[]; tempMax: number[]; et0: number[]; soil: number[] }>();
  for (const d of daily) {
    const y = Number(d.date.slice(0, 4));
    if (!map.has(y)) map.set(y, { precip: [], tempMax: [], et0: [], soil: [] });
    const e = map.get(y)!;
    e.precip.push(d.precip);
    e.tempMax.push(d.tempMax);
    e.et0.push(d.et0);
    e.soil.push(d.soilMoist0_7);
  }
  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, v]) => ({
      year,
      precip: Math.round(avg(v.precip) * 365),   // annualised from daily avg
      tempMax: +avg(v.tempMax).toFixed(1),
      et0: +avg(v.et0).toFixed(2),
      soilMoist: +avg(v.soil).toFixed(4),
    }));
}

function computeStats(daily: DailyClimatePoint[], annual: ReturnType<typeof groupByYear>): ClimateStats {
  const precipYr = annual.map((a) => a.precip);
  const tempYr   = annual.map((a) => a.tempMax);
  const meanAnnualPrecip = precipYr.reduce((a, b) => a + b, 0) / (precipYr.length || 1);
  const meanTempMax      = tempYr.reduce((a, b) => a + b, 0) / (tempYr.length || 1);
  const meanTempMin      = daily.reduce((s, d) => s + d.tempMin, 0) / (daily.length || 1);
  const meanET0          = daily.reduce((s, d) => s + d.et0, 0) / (daily.length || 1);
  const annualET0        = meanET0 * 365;
  const aridity          = meanAnnualPrecip > 0 ? annualET0 / meanAnnualPrecip : 99;
  const precipTrend      = linearSlope(precipYr) * 10;
  const tempTrend        = linearSlope(tempYr)   * 10;
  const droughtYears     = annual
    .filter((a) => a.precip < meanAnnualPrecip * 0.75)
    .map((a) => a.year);
  return {
    meanAnnualPrecip: Math.round(meanAnnualPrecip),
    meanTempMax: +meanTempMax.toFixed(1),
    meanTempMin: +meanTempMin.toFixed(1),
    meanET0: +meanET0.toFixed(2),
    aridity: +aridity.toFixed(2),
    precipTrend: +precipTrend.toFixed(1),
    tempTrend: +tempTrend.toFixed(2),
    droughtYears,
  };
}

// ── Cache ─────────────────────────────────────────────────────────────────────
// Simple in-memory cache so repeated renders don't re-fetch
const cache = new Map<string, DailyClimatePoint[]>();

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useBasinClimate(
  lat: number,
  lng: number,
  startYear = 1980
): BasinClimateResult {
  const [data, setData]       = useState<DailyClimatePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const abortRef              = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}_${startYear}`;
    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey)!);
      return;
    }

    // Cancel previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setData([]);

    // ERA5-Land historical archive — daily variables
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 5); // ERA5 has ~5 day delay
    const end = endDate.toISOString().split('T')[0];
    const start = `${startYear}-01-01`;

    const params = new URLSearchParams({
      latitude:  String(lat),
      longitude: String(lng),
      start_date: start,
      end_date:   end,
      daily: [
        'precipitation_sum',
        'temperature_2m_max',
        'temperature_2m_min',
        'et0_fao_evapotranspiration',
        'soil_moisture_0_to_7cm',
        'soil_moisture_7_to_28cm',
      ].join(','),
      models: 'era5_seamless',
      timezone: 'auto',
    });

    fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (json.error) throw new Error(json.reason ?? 'API error');
        const times: string[]            = json.daily?.time                      ?? [];
        const precip: number[]           = json.daily?.precipitation_sum         ?? [];
        const tMax: number[]             = json.daily?.temperature_2m_max        ?? [];
        const tMin: number[]             = json.daily?.temperature_2m_min        ?? [];
        const et0: number[]              = json.daily?.et0_fao_evapotranspiration ?? [];
        const soil0_7: number[]          = json.daily?.soil_moisture_0_to_7cm    ?? [];
        const soil7_28: number[]         = json.daily?.soil_moisture_7_to_28cm   ?? [];

        const parsed: DailyClimatePoint[] = times.map((date, i) => ({
          date,
          precip:       precip[i]   ?? 0,
          tempMax:      tMax[i]     ?? 0,
          tempMin:      tMin[i]     ?? 0,
          et0:          et0[i]      ?? 0,
          soilMoist0_7:  soil0_7[i]  ?? 0,
          soilMoist7_28: soil7_28[i] ?? 0,
        }));

        cache.set(cacheKey, parsed);
        setData(parsed);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message ?? 'Unknown error');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [lat, lng, startYear]);

  const annualSeries = groupByYear(data);
  const stats = data.length ? computeStats(data, annualSeries) : null;

  return { data, stats, annualSeries, loading, error };
}
