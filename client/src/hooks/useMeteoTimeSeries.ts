/**
 * useMeteoTimeSeries
 *
 * Fetches a multi-decade annual time series of global-average meteorological
 * anomalies from Open-Meteo ERA5-seamless archive for THREE representative
 * grid points (one per climate zone: temperate, tropical, arid).
 *
 * Returns a yearly array ready to be rendered as a sparkline chart
 * inside the TimelineOverlay.
 *
 * To keep browser load minimal:
 *  - Only 3 sampling points (lat/lng pairs)
 *  - Data cached in module-level Map (survives re-renders)
 *  - Fetched once per metric type; re-used across components
 */

import { useState, useEffect, useRef } from 'react';
import type { MeteoLayerType } from './useMeteoLayer';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MeteoYearPoint {
  year: number;
  value: number;     // anomaly vs 1961-1990 baseline (°C, mm/yr, or %)
  isDrought: boolean;
}

export interface MeteoTimeSeriesState {
  series: MeteoYearPoint[];
  loading: boolean;
  error: string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Three representative points spread across climate zones
const SAMPLE_POINTS = [
  { lat: 48,  lng: 10  }, // Central Europe  – temperate
  { lat: 5,   lng: 20  }, // Central Africa  – tropical
  { lat: 25,  lng: 45  }, // Arabian Peninsula – arid
];

const ERA5_START = 1940;
const ERA5_END   = new Date().getFullYear() - 1; // last complete year

// Module-level cache: key = `${type}`
const seriesCache = new Map<MeteoLayerType, MeteoYearPoint[]>();

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchYearlyForPoint(
  lat: number,
  lng: number,
  signal: AbortSignal,
): Promise<{ year: number; precip: number; tempMax: number }[]> {
  // Use Open-Meteo Climate API (faster — yearly aggregates)
  const params = new URLSearchParams({
    latitude:   String(lat),
    longitude:  String(lng),
    start_date: `${ERA5_START}-01-01`,
    end_date:   `${ERA5_END}-12-31`,
    daily:      'precipitation_sum,temperature_2m_max',
    models:     'era5_seamless',
    timezone:   'UTC',
  });

  const res = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params}`,
    { signal },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.reason ?? 'API error');

  const times:  string[] = json.daily?.time                ?? [];
  const precips: number[] = json.daily?.precipitation_sum   ?? [];
  const temps:   number[] = json.daily?.temperature_2m_max  ?? [];

  // Group by year
  const byYear = new Map<number, { precip: number[]; temp: number[] }>();
  times.forEach((t, i) => {
    const y = Number(t.slice(0, 4));
    if (!byYear.has(y)) byYear.set(y, { precip: [], temp: [] });
    const e = byYear.get(y)!;
    e.precip.push(precips[i] ?? 0);
    e.temp.push(temps[i] ?? 0);
  });

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, v]) => ({
      year,
      precip:  avg(v.precip) * 365, // annualised mm
      tempMax: avg(v.temp),
    }));
}

// ── Main hook ─────────────────────────────────────────────────────────────────

export function useMeteoTimeSeries(
  type: MeteoLayerType,
  enabled: boolean,
): MeteoTimeSeriesState {
  const [series,  setSeries]  = useState<MeteoYearPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) {
      setSeries([]);
      return;
    }

    // Return cached result immediately
    if (seriesCache.has(type)) {
      setSeries(seriesCache.get(type)!);
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);

    Promise.all(SAMPLE_POINTS.map((p) => fetchYearlyForPoint(p.lat, p.lng, ctrl.signal)))
      .then((allPoints) => {
        if (ctrl.signal.aborted) return;

        // Merge: average across the 3 sample points per year
        const yearMap = new Map<number, { precip: number[]; temp: number[] }>();
        allPoints.forEach((ptSeries) => {
          ptSeries.forEach(({ year, precip, tempMax }) => {
            if (!yearMap.has(year)) yearMap.set(year, { precip: [], temp: [] });
            const e = yearMap.get(year)!;
            e.precip.push(precip);
            e.temp.push(tempMax);
          });
        });

        const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        const years = Array.from(yearMap.entries()).sort(([a], [b]) => a - b);

        // Compute baseline (1961–1990 window)
        const baselineYears = years.filter(([y]) => y >= 1961 && y <= 1990);
        const baselinePrecip  = avg(baselineYears.map(([, v]) => avg(v.precip)));
        const baselineTemp    = avg(baselineYears.map(([, v]) => avg(v.temp)));

        const result: MeteoYearPoint[] = years.map(([year, v]) => {
          const p   = avg(v.precip);
          const t   = avg(v.temp);
          let value: number;
          let isDrought = false;

          if (type === 'temperature') {
            value = +(t - baselineTemp).toFixed(2);
          } else if (type === 'precipitation') {
            value = +Math.round(p - baselinePrecip).toFixed(0);
            isDrought = p < baselinePrecip * 0.75;
          } else {
            // drought index: % deficit
            value = baselinePrecip > 0
              ? +Math.max(0, ((baselinePrecip - p) / baselinePrecip) * 100).toFixed(1)
              : 0;
            isDrought = p < baselinePrecip * 0.75;
          }

          return { year, value, isDrought };
        });

        seriesCache.set(type, result);
        setSeries(result);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(String(err));
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [type, enabled]);

  return { series, loading, error };
}
