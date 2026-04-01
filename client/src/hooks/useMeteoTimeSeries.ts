/**
 * useMeteoTimeSeries
 *
 * Fetches annual meteorological time series from Open-Meteo ERA5 archive.
 * Accepts optional lat/lng to fetch location-specific data for a selected agreement.
 * Falls back to a representative global point (0°N, 20°E) when no coords given.
 * Data is cached in a module-level Map keyed by "type|lat|lng" to survive re-renders.
 */
import { useState, useEffect, useRef } from 'react';
import type { MeteoLayerType } from './useMeteoLayer';

export interface MeteoYearPoint {
  year: number;
  value: number;
  isDrought: boolean;
}

export interface MeteoTimeSeriesState {
  series: MeteoYearPoint[];
  loading: boolean;
  error: string | null;
}

// Default representative point (global average-ish)
const DEFAULT_LAT = 0;
const DEFAULT_LNG = 20;
const ERA5_START = 1940;
const ERA5_END = 2024; // fixed to last complete year

// Module-level cache keyed by "type|lat|lng"
const seriesCache = new Map<string, MeteoYearPoint[]>();

function makeCacheKey(type: MeteoLayerType, lat: number, lng: number): string {
  return `${type}|${lat.toFixed(2)}|${lng.toFixed(2)}`;
}

async function fetchAnnualSeries(
  signal: AbortSignal,
  lat: number,
  lng: number,
): Promise<{ year: number; precip: number; tempMax: number }[]> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    start_date: `${ERA5_START}-01-01`,
    end_date: `${ERA5_END}-12-31`,
    daily: 'precipitation_sum,temperature_2m_max',
    models: 'era5_seamless',
    timezone: 'UTC',
  });
  const res = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params}`,
    { signal },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.reason ?? 'API error');
  const times: string[] = json.daily?.time ?? [];
  const precips: number[] = json.daily?.precipitation_sum ?? [];
  const temps: number[] = json.daily?.temperature_2m_max ?? [];
  const byYear = new Map<number, { precip: number[]; temp: number[] }>();
  times.forEach((t, i) => {
    const y = Number(t.slice(0, 4));
    if (!byYear.has(y)) byYear.set(y, { precip: [], temp: [] });
    const e = byYear.get(y)!;
    if (precips[i] != null && !isNaN(precips[i])) e.precip.push(precips[i]);
    if (temps[i] != null && !isNaN(temps[i])) e.temp.push(temps[i]);
  });
  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  return Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, v]) => ({
      year,
      precip: avg(v.precip) * 365,
      tempMax: avg(v.temp),
    }));
}

export function useMeteoTimeSeries(
  type: MeteoLayerType,
  _enabled?: boolean, // kept for API compatibility, ignored
  lat?: number,
  lng?: number,
): MeteoTimeSeriesState {
  const resolvedLat = lat ?? DEFAULT_LAT;
  const resolvedLng = lng ?? DEFAULT_LNG;
  const cacheKey = makeCacheKey(type, resolvedLat, resolvedLng);

  const [series, setSeries] = useState<MeteoYearPoint[]>(
    () => seriesCache.get(cacheKey) ?? [],
  );
  const [loading, setLoading] = useState<boolean>(
    () => !seriesCache.has(cacheKey),
  );
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (seriesCache.has(cacheKey)) {
      setSeries(seriesCache.get(cacheKey)!);
      setLoading(false);
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);

    fetchAnnualSeries(ctrl.signal, resolvedLat, resolvedLng)
      .then((raw) => {
        if (ctrl.signal.aborted) return;
        // Compute 1961-1990 baseline
        const baseline = raw.filter((r) => r.year >= 1961 && r.year <= 1990);
        const avgOf = (arr: number[]) =>
          arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        const baselinePrecip = avgOf(baseline.map((r) => r.precip));
        const baselineTemp = avgOf(baseline.map((r) => r.tempMax));
        const result: MeteoYearPoint[] = raw.map(({ year, precip, tempMax }) => {
          let value: number;
          let isDrought = false;
          if (type === 'temperature') {
            value = +(tempMax - baselineTemp).toFixed(2);
          } else if (type === 'precipitation') {
            value = +Math.round(precip - baselinePrecip);
            isDrought = precip < baselinePrecip * 0.75;
          } else {
            // drought: % deficit vs baseline
            value =
              baselinePrecip > 0
                ? +Math.max(
                    0,
                    ((baselinePrecip - precip) / baselinePrecip) * 100,
                  ).toFixed(1)
                : 0;
            isDrought = precip < baselinePrecip * 0.75;
          }
          return { year, value, isDrought };
        });
        seriesCache.set(cacheKey, result);
        setSeries(result);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(String(err));
        }
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [type, cacheKey, resolvedLat, resolvedLng]);

  return { series, loading, error };
}
