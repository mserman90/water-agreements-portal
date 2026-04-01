import { useState, useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export type MeteoLayerType = 'temperature' | 'precipitation' | 'drought';

export interface MeteoGridPoint {
  lat: number;
  lng: number;
  value: number;      // anomaly or absolute value
  anomaly: number;    // deviation from 1961-1990 baseline
  isDrought: boolean; // precip < 75% of baseline
}

export interface MeteoLayerState {
  type: MeteoLayerType;
  year: number;
  points: MeteoGridPoint[];
  loading: boolean;
  error: string | null;
  minVal: number;
  maxVal: number;
}

// ── Grid definition ─────────────────────────────────────────────────────────
// Sparse global grid: 5-degree resolution to keep API calls minimal
const GRID_STEP = 5;
export const METEO_GRID_POINTS: { lat: number; lng: number }[] = (() => {
  const pts: { lat: number; lng: number }[] = [];
  for (let lat = -55; lat <= 75; lat += GRID_STEP) {
    for (let lng = -170; lng <= 175; lng += GRID_STEP) {
      pts.push({ lat, lng });
    }
  }
  return pts;
})();

// ── In-memory cache ──────────────────────────────────────────────────────────
const meteoCache = new Map<string, MeteoGridPoint[]>();

// ── Fetch helpers ────────────────────────────────────────────────────────────

/**
 * Fetch annual mean temperature or precipitation for ONE point and year
 * using Open-Meteo Archive API (ERA5-Land seamless).
 */
async function fetchAnnualMeteo(
  lat: number,
  lng: number,
  year: number,
  signal: AbortSignal
): Promise<{ precip: number; tempMax: number }> {
  // Open-Meteo archive available from 1940 onwards
  const safeYear = Math.max(year, 1940);
  const startDate = `${safeYear}-01-01`;
  const endDate   = `${safeYear}-12-31`;

  const params = new URLSearchParams({
    latitude:   String(lat),
    longitude:  String(lng),
    start_date: startDate,
    end_date:   endDate,
    daily:      'precipitation_sum,temperature_2m_max',
    models:     'era5_seamless',
    timezone:   'UTC',
  });

  const res = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params}`,
    { signal }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.reason ?? 'API error');

  const precips: number[] = json.daily?.precipitation_sum ?? [];
  const temps:   number[] = json.daily?.temperature_2m_max ?? [];

  const sum = (arr: number[]) => arr.reduce((a, b) => a + (b ?? 0), 0);
  const avg = (arr: number[]) => arr.length ? sum(arr) / arr.length : 0;

  return {
    precip:  sum(precips),   // mm/year
    tempMax: avg(temps),     // mean daily max (°C)
  };
}

/**
 * Fetch baseline (1961-1990 average) for one point.
 * To reduce API calls we fetch 1961-1990 as one request using monthly aggregation.
 */
async function fetchBaseline(
  lat: number,
  lng: number,
  signal: AbortSignal
): Promise<{ precip: number; tempMax: number }> {
  const cacheKey = `baseline_${lat}_${lng}`;
  const cached = meteoCache.get(cacheKey) as unknown as { precip: number; tempMax: number } | undefined;
  if (cached) return cached;

  // Use ERA5 30-year climatology: fetch 1961-1990
  const params = new URLSearchParams({
    latitude:   String(lat),
    longitude:  String(lng),
    start_date: '1961-01-01',
    end_date:   '1990-12-31',
    daily:      'precipitation_sum,temperature_2m_max',
    models:     'era5_seamless',
    timezone:   'UTC',
  });

  const res = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params}`,
    { signal }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.reason ?? 'API error');

  const precips: number[] = json.daily?.precipitation_sum ?? [];
  const temps:   number[] = json.daily?.temperature_2m_max ?? [];

  const sum = (arr: number[]) => arr.reduce((a, b) => a + (b ?? 0), 0);
  const avg = (arr: number[]) => arr.length ? sum(arr) / arr.length : 0;

  // annualised precip = total / 30 years
  const result = {
    precip:  sum(precips) / 30,
    tempMax: avg(temps),
  };

  (meteoCache as Map<string, unknown>).set(cacheKey, result);
  return result;
}

// ── Lightweight sampled grid ─────────────────────────────────────────────────
// We use a subset of METEO_GRID_POINTS to stay within browser limits
const SAMPLE_STEP = 15; // every 15° — yields ~120 points, fast enough
export const SAMPLED_GRID = METEO_GRID_POINTS.filter(
  (_, i) => i % Math.round(METEO_GRID_POINTS.length / 120) === 0
);

// ── Main hook ────────────────────────────────────────────────────────────────

export function useMeteoLayer(
  type: MeteoLayerType,
  year: number,
  enabled: boolean
): MeteoLayerState {
  const [points, setPoints] = useState<MeteoGridPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled || year < 1940) {
      setPoints([]);
      return;
    }

    const cacheKey = `${type}_${year}`;
    const cached = meteoCache.get(cacheKey);
    if (cached) {
      setPoints(cached);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setPoints([]);

    // Sample 40 well-distributed points to avoid too many API calls
    const sample = SAMPLED_GRID.slice(0, 40);

    Promise.allSettled(
      sample.map(async ({ lat, lng }) => {
        const [annual, baseline] = await Promise.all([
          fetchAnnualMeteo(lat, lng, year, controller.signal),
          fetchBaseline(lat, lng, controller.signal),
        ]);

        let value: number;
        let anomaly: number;
        let isDrought = false;

        if (type === 'temperature') {
          value   = annual.tempMax;
          anomaly = annual.tempMax - baseline.tempMax;
        } else if (type === 'precipitation') {
          value   = annual.precip;
          anomaly = annual.precip - baseline.precip;
          isDrought = annual.precip < baseline.precip * 0.75;
        } else {
          // drought: show precip deficit as positive value
          value   = baseline.precip > 0
            ? Math.max(0, (baseline.precip - annual.precip) / baseline.precip * 100)
            : 0;
          anomaly = value;
          isDrought = annual.precip < baseline.precip * 0.75;
        }

        return { lat, lng, value, anomaly, isDrought } satisfies MeteoGridPoint;
      })
    ).then((results) => {
      if (controller.signal.aborted) return;
      const ok = results
        .filter((r): r is PromiseFulfilledResult<MeteoGridPoint> => r.status === 'fulfilled')
        .map((r) => r.value);
      meteoCache.set(cacheKey, ok);
      setPoints(ok);
    }).catch((err) => {
      if (err.name !== 'AbortError') setError(String(err));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

    return () => controller.abort();
  }, [type, year, enabled]);

  const vals = points.map((p) => p.anomaly);
  const minVal = vals.length ? Math.min(...vals) : 0;
  const maxVal = vals.length ? Math.max(...vals) : 1;

  return { type, year, points, loading, error, minVal, maxVal };
}
