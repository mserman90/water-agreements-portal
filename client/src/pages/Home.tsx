import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { basinCoords } from '@/data/basinCoords';
import { findTreatyLink, findGithubDoc } from '@/data/treatyLinks';
import MapViewer from '@/components/MapViewer';
import AgreementSidebar from '@/components/AgreementSidebar';
import type { Agreement } from '@/components/MapViewer';

// Map basin name to lat/lng
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

// Extract 4-digit year from any date string
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
  const [selectedId, setSelectedId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const processJSON = useCallback((text: string): Agreement[] => {
    const raw = JSON.parse(text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, ''));
    let data: unknown[];
    if (Array.isArray(raw)) {
      data = raw;
    } else if (raw && typeof raw === 'object') {
      data =
        (raw as Record<string, unknown>).agreements ??
        (raw as Record<string, unknown>).data ??
        (raw as Record<string, unknown>).treaties ??
        Object.values(raw as object).find((v) => Array.isArray(v)) ??
        [];
    } else {
      data = [];
    }
    return parseRows(data as Record<string, unknown>[]);
  }, []);

  // Load bundled MASTER.json on mount
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
    <div style={{ display: 'flex', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Sidebar toggle button (mobile friendly) */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        style={{
          position: 'absolute',
          top: 90,
          left: sidebarOpen ? 328 : 8,
          zIndex: 1000,
          background: '#0369a1',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1,
          transition: 'left 0.25s',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
        title={sidebarOpen ? 'Kapat' : 'Aç'}
      >
        {sidebarOpen ? '←' : '☰'}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <AgreementSidebar
          agreements={agreements}
          selectedId={selectedId}
          onSelectAgreement={setSelectedId}
          onUploadFile={handleFileUpload}
          isLoading={isLoading}
        />
      )}

      {/* Map fills rest */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapViewer
          agreements={agreements}
          selectedId={selectedId}
          onMarkerClick={setSelectedId}
        />
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255,255,255,0.9)',
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 14,
              color: '#0369a1',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Veriler yükleniyor...
          </div>
        )}
      </div>
    </div>
  );
}
