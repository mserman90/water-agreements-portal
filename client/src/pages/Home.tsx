import { useState, useEffect, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import { basinCoords } from '@/data/basinCoords';
import { findTreatyLink, findGithubDoc } from '@/data/treatyLinks';
import MapViewer from '@/components/MapViewer';
import LeftPanel from '@/components/LeftPanel';
import type { Agreement, WaterConflict } from '@/components/MapViewer';
import type { TimelineMode } from '@/components/TimelineClimatePanel';
import type { LayerConfig } from '@/components/LayerControl';
import { smartSearch, isSmartQuery } from '@/lib/smartSearch';

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

function deriveType(purpose: string): 'cooperation' | 'conflict' | 'mixed' {
  const p = purpose.toLowerCase();
  const isConflict = p.includes('conflict') || p.includes('dispute') || p.includes('war') || p.includes('protest');
  const isCoop = p.includes('cooper') || p.includes('alloc') || p.includes('joint') || p.includes('agreement') || p.includes('treaty');
  if (isConflict && isCoop) return 'mixed';
  if (isConflict) return 'conflict';
  return 'cooperation';
}

export default function Home() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [conflicts, setConflicts] = useState<WaterConflict[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [aiMode, setAiMode] = useState(false);

  // Layers state
  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: 'agreements', label: { tr: 'Anlaşmalar', en: 'Agreements' }, icon: '📄', enabled: true, color: '#3b82f6' },
    { id: 'conflicts', label: { tr: 'Su Uyuşmazlıkları (BAR)', en: 'Water Conflicts' }, icon: '⚡', enabled: true, color: '#dc2626' },
  ]);

  const handleLayerToggle = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l))
    );
  };

  // Timeline state
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

  // Auto-play animation
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

  // Timeline filtered agreements
  const timelineFilteredAgreements = useMemo(() => {
    if (!agreements.length) return [];
    if (timelineMode === 'cumulative') {
      return agreements.filter((a) => a.year <= currentYear);
    }
    const ds = Math.floor(currentYear / 10) * 10;
    return agreements.filter((a) => a.year >= ds && a.year <= ds + 9);
  }, [agreements, currentYear, timelineMode]);

  // Timeline filtered conflicts
  const timelineFilteredConflicts = useMemo(() => {
    if (!conflicts.length) return [];
    if (timelineMode === 'cumulative') {
      return conflicts.filter((c) => c.year <= currentYear);
    }
    const ds = Math.floor(currentYear / 10) * 10;
    return conflicts.filter((c) => c.year >= ds && c.year <= ds + 9);
  }, [conflicts, currentYear, timelineMode]);

  // Search filtered agreements
  const displayedAgreements = useMemo(() => {
    if (!searchTerm.trim()) {
      return timelineFilteredAgreements;
    }
    if (aiMode || isSmartQuery(searchTerm)) {
      return smartSearch(searchTerm, agreements);
    }
    const q = searchTerm.toLowerCase();
    return agreements.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.basin.toLowerCase().includes(q) ||
        String(a.year).includes(q)
    );
  }, [searchTerm, aiMode, agreements, timelineFilteredAgreements]);

  // Counts for live counter
  const { totalCount, coopCount, conflictCount, mixedCount } = useMemo(() => {
    let coop = 0, conflict = 0, mixed = 0;
    displayedAgreements.forEach((a) => {
      const t = deriveType(a.purpose);
      if (t === 'cooperation') coop++;
      else if (t === 'conflict') conflict++;
      else mixed++;
    });
    return { totalCount: displayedAgreements.length, coopCount: coop, conflictCount: conflict, mixedCount: mixed };
  }, [displayedAgreements]);

  // Selected item (either agreement or conflict)
  const selectedItem = useMemo(() => {
    if (!selectedId) return undefined;
    if (selectedId.startsWith('conflict-')) {
      return conflicts.find((c) => c.id === selectedId);
    }
    return agreements.find((a) => a.id === selectedId);
  }, [agreements, conflicts, selectedId]);

  const processJSON = useCallback((text: string): Agreement[] => {
    const raw = JSON.parse(text.replace(/[\x00-\x1f\x7f]/g, ''));
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

  // Load datasets on mount
  useEffect(() => {
    const p1 = fetch(`${import.meta.env.BASE_URL}data/agreements.min.json`)
      .then((r) => {
        if (!r.ok) throw new Error('agreements.min.json not found');
        return r.json();
      })
      .then((data: Agreement[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const baseUrl = import.meta.env.BASE_URL;
          const formatted = data.map((a) => ({
            ...a,
            githubDocUrl: a.githubDocUrl
              ? a.githubDocUrl.startsWith('http') || a.githubDocUrl.startsWith(baseUrl)
                ? a.githubDocUrl
                : `${baseUrl}${a.githubDocUrl}`
              : undefined,
          }));
          setAgreements(formatted);
        } else {
          throw new Error('Empty minified agreements');
        }
      })
      .catch(() => {
        // Fallback to legacy MASTER.json
        return fetch(`${import.meta.env.BASE_URL}data/MASTER.json`)
          .then((r) => r.text())
          .then((text) => {
            const parsed = processJSON(text);
            if (parsed.length > 0) setAgreements(parsed);
          });
      })
      .catch(console.warn);

    const p2 = fetch(`${import.meta.env.BASE_URL}data/water_conflicts.json`)
      .then((r) => r.json())
      .then((data: Array<Omit<WaterConflict, 'id'>>) => {
        if (Array.isArray(data)) {
          const formatted: WaterConflict[] = data.map((item, idx) => ({
            ...item,
            id: `conflict-${idx}`,
          }));
          setConflicts(formatted);
        }
      })
      .catch(console.warn);

    Promise.allSettled([p1, p2]).finally(() => setIsLoading(false));
  }, [processJSON]);

  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = processJSON(e.target!.result as string);
          setAgreements(parsed);
        } catch (err) {
          console.error(err);
          alert('JSON dosyası okunamadı.');
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
          alert('CSV dosyası okunamadı.');
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <>
      {/* Unified Left Panel (Agreements, Timeline & Climate, Layers, AI Chat, Guide) */}
      <LeftPanel
        layers={layers}
        onLayerToggle={handleLayerToggle}
        agreements={displayedAgreements}
        allAgreements={agreements}
        conflicts={timelineFilteredConflicts}
        selectedId={selectedId}
        onSelect={setSelectedId}
        selectedAgreement={selectedItem}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        aiMode={aiMode}
        onToggleAiMode={() => setAiMode((v) => !v)}
        onUploadFile={handleFileUpload}
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
        timelineMode={timelineMode}
        setTimelineMode={setTimelineMode}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        bins={bins}
        totalCount={totalCount}
        coopCount={coopCount}
        conflictCount={conflictCount}
        mixedCount={mixedCount}
      />

      {/* Map with Dual Clustering (Agreements + Conflicts) */}
      <MapViewer
        agreements={displayedAgreements}
        conflicts={timelineFilteredConflicts}
        selectedId={selectedId}
        onMarkerClick={setSelectedId}
        currentYear={currentYear}
        layers={layers}
      />

      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#fff',
          padding: '16px 28px',
          borderRadius: 8,
          zIndex: 2000,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>💧</span>
          <span>Veriler yükleniyor...</span>
        </div>
      )}
    </>
  );
}
