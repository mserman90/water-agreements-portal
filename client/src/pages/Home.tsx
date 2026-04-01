import { useState, useEffect, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import { basinCoords } from '@/data/basinCoords';
import { findTreatyLink, findGithubDoc } from '@/data/treatyLinks';
import MapViewer from '@/components/MapViewer';
import LeftPanel from '@/components/LeftPanel';
import TimelineOverlay from '@/components/TimelineOverlay';
import { useAuth } from '@/contexts/AuthContext';
import type { Agreement } from '@/components/MapViewer';
import type { TimelineMode } from '@/components/TimelineOverlay';
import { LayerConfig } from '@/components/LayerControl';

const MIN_YEAR = 1820;
const MAX_YEAR = 2024;
const YEAR_STEP_MS = 120;

function findBasinCoords(basinName: string): [number, number] | null {
  if (!basinName) return null;
  if (basinCoords[basinName]) return basinCoords[basinName];
  const primary = basinName.split(',')[0].trim();
  if (basinCoords[primary]) return basinCoords[primary];
  const lower = basinName.toLowerCase();
  for (const [key, val] of Object.entries(basinCoords)) {
    if (key.toLowerCase() === lower) return val;
  }
  return null;
}

function extractYear(val: unknown): number {
  const m = String(val ?? '').match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
}

function parseRows(rows: Record<string, unknown>[]): Agreement[] {
  return rows
    .map((row, index) => {
      let lat = Number(row.latitude ?? row.lat ?? row.Latitude ?? 0);
      let lng = Number(row.longitude ?? row.lng ?? row.lon ?? row.Longitude ?? 0);
      const basin = String(
        row.basin ?? row.Basin ?? row['Basin Name'] ?? row['TFDD Basin(s)'] ?? row.river ?? ''
      );
      if ((!lat || !lng) && basin) {
        const coords = findBasinCoords(basin);
        if (coords) {
          lat = coords[0] + (Math.random() - 0.5) * 2;
          lng = coords[1] + (Math.random() - 0.5) * 2;
        }
      }
      const yr = extractYear(row.year ?? row.Year ?? row.DateSigned ?? row.date);
      const docName = String(row.DocumentName ?? row.name ?? row.Name ?? row.title ?? '');
      const link = findTreatyLink(docName);
      const ghDoc = link ? findGithubDoc(link.faolex, docName) : undefined;
      return {
        id: String(row.id ?? row.ID ?? row['Entry ID'] ?? `agreement-${index}`),
        name: String(row.name ?? row.Name ?? row.title ?? row.DocumentName ?? 'Unnamed'),
        country: String(row.country ?? row.Country ?? row.Signatories ?? 'Unknown'),
        basin,
        latitude: lat,
        longitude: lng,
        purpose: String(row.purpose ?? row.Purpose ?? row['Issue Area'] ?? ''),
        year: yr || new Date().getFullYear(),
        pdfUrl: String(row.pdfUrl ?? link?.download ?? ''),
        faolexUrl: link?.faolex,
        githubDocUrl: ghDoc ? `${import.meta.env.BASE_URL}docs/${ghDoc}` : undefined,
      } satisfies Agreement;
    })
    .filter((a) => a.latitude !== 0 && a.longitude !== 0);
}

export default function Home() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: 'agreements', label: { tr: 'Anlasmalar', en: 'Agreements' }, icon: '📄', enabled: true, color: '#3b82f6' },
  ]);

  const handleLayerToggle = (id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const [currentYear, setCurrentYear] = useState(MAX_YEAR);
  const [timelineMode, setTimelineMode] = useState<TimelineMode>('cumulative');
  const [isPlaying, setIsPlaying] = useState(false);

  const bins = useMemo(
    () =>
      Array.from({ length: Math.ceil((MAX_YEAR - MIN_YEAR + 1) / 5) }, (_, i) => ({
        start: MIN_YEAR + i * 5,
        end: Math.min(MIN_YEAR + i * 5 + 4, MAX_YEAR),
      })),
    [],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setCurrentYear((prev) => {
        if (prev >= MAX_YEAR) return MIN_YEAR;
        return prev + 1;
      });
    }, YEAR_STEP_MS);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  const filteredAgreements = useMemo(() => {
    if (!agreements.length) return [];
    if (timelineMode === 'cumulative') return agreements.filter((a) => a.year <= currentYear);
    const ds = Math.floor(currentYear / 10) * 10;
    return agreements.filter((a) => a.year >= ds && a.year <= ds + 9);
  }, [agreements, currentYear, timelineMode]);

  const selectedAgreement = useMemo(
    () => agreements.find((a) => a.id === selectedId),
    [agreements, selectedId],
  );

  const processJSON = useCallback((text: string): Agreement[] => {
    const raw = JSON.parse(text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, ''));
    let data: unknown[];
    if (Array.isArray(raw)) {
      data = raw;
    } else if (raw && typeof raw === 'object') {
      data =
        (raw as Record<string, unknown>).agreements as unknown[] ??
        (raw as Record<string, unknown>).data as unknown[] ??
        (raw as Record<string, unknown>).treaties as unknown[] ??
        Object.values(raw as object).find((v) => Array.isArray(v)) ??
        [];
    } else {
      data = [];
    }
    return parseRows(data as Record<string, unknown>[]);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/MASTER.json`)
      .then((r) => r.text())
      .then((text) => {
        const parsed = processJSON(text);
        if (parsed.length > 0) setAgreements(parsed);
      })
      .catch(console.warn)
      .finally(() => setIsLoading(false));
  }, [processJSON]);

  const handleFileUpload = (file: File) => {
    if (!isAdmin) return;
    setIsLoading(true);
    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = processJSON(e.target!.result as string);
          setAgreements(parsed);
        } catch (err) {
          console.error(err);
          alert('JSON dosyasi okunamadi.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = parseRows(results.data as Record<string, unknown>[]);
          setAgreements(parsed);
          setIsLoading(false);
        },
        error: () => {
          alert('CSV dosyasi okunamadi.');
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <>
      <LeftPanel
        layers={layers}
        onLayerToggle={handleLayerToggle}
        agreements={filteredAgreements}
        selectedAgreement={selectedAgreement}
        onUploadFile={handleFileUpload}
      />

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <MapViewer
          agreements={filteredAgreements}
          selectedId={selectedId}
          onMarkerClick={setSelectedId}
          currentYear={currentYear}
          layers={layers}
        />
      </div>

      <TimelineOverlay
        currentYear={currentYear}
        minYear={MIN_YEAR}
        maxYear={MAX_YEAR}
        mode={timelineMode}
        isPlaying={isPlaying}
        bins={bins}
        agreements={filteredAgreements}
        selectedAgreement={selectedAgreement}
        onYearChange={setCurrentYear}
        onModeChange={setTimelineMode}
        onPlayToggle={() => setIsPlaying((v) => !v)}
      />

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            background: 'rgba(255,255,255,0.9)',
            padding: '12px 24px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: 14,
            zIndex: 2000,
          }}
        >
          Veriler yukleniyor...
        </div>
      )}
    </>
  );
}
