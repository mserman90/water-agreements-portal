import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { basinCoords } from '@/data/basinCoords';
import { findTreatyLink } from '@/data/treatyLinks';
import { useLanguage } from '@/i18n/LanguageContext';

declare global {
  interface Window {
    Papa: typeof Papa;
  }
}
import MapViewer from '@/components/MapViewer';
import AgreementSidebar from '@/components/AgreementSidebar';

interface Agreement {
  id: string;
  name: string;
  country: string;
  basin: string;
  latitude: number;
  longitude: number;
  purpose: string;
  year: number;
  pdfUrl?: string;
}

export default function Home() {
  const { lang, setLang, t } = useLanguage();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true); // start true for initial load

  // Look up basin coordinates with fuzzy matching
  const findBasinCoords = (basinName: string): [number, number] | null => {
    if (!basinName) return null;
    // Exact match
    if (basinCoords[basinName]) return basinCoords[basinName];
    // Try first basin in comma-separated list
    const primary = basinName.split(',')[0].trim();
    if (basinCoords[primary]) return basinCoords[primary];
    // Case-insensitive search
    const lower = basinName.toLowerCase();
    for (const [key, val] of Object.entries(basinCoords)) {
      if (key.toLowerCase() === lower) return val;
    }
    return null;
  };

  // Extract year from various date formats
  const extractYear = (val: any): number => {
    if (!val) return 0;
    const s = String(val);
    // "3/28/1820" or "1820-03-28" or just "1820"
    const match = s.match(/(\d{4})/);
    return match ? Number(match[1]) : 0;
  };

  const parseRows = (rows: any[]): Agreement[] => {
    return rows
      .map((row: any, index: number) => {
        // Support TFDD fields + common alternatives
        let lat = Number(row.latitude ?? row.lat ?? row.Latitude ?? row.LAT ?? 0);
        let lng = Number(row.longitude ?? row.lng ?? row.lon ?? row.Longitude ?? row.LON ?? 0);

        // If no coordinates, try to derive from basin name
        const basinRaw = row.basin ?? row.Basin ?? row.Basin_Name ?? row['Basin Name']
          ?? row['TFDD Basin(s)'] ?? row['Treaty Basin(s)']
          ?? row.river ?? row.River ?? row.watershed ?? '';
        const basin = String(basinRaw);

        if ((!lat || !lng) && basin) {
          const coords = findBasinCoords(basin);
          if (coords) {
            // Add slight random offset to avoid stacking markers on same basin
            lat = coords[0] + (Math.random() - 0.5) * 2;
            lng = coords[1] + (Math.random() - 0.5) * 2;
          }
        }

        // Year: support DateSigned ("3/28/1820"), year, Year
        const yr = extractYear(row.year ?? row.Year ?? row.DateSigned ?? row.date ?? row.Date);

        return {
          id: String(row.id ?? row.ID ?? row.Id ?? row['Entry ID'] ?? row['Unified Primary 2016 Treaty ID'] ?? `agreement-${index}`),
          name: String(row.name ?? row.Name ?? row.title ?? row.Title ?? row.DocumentName ?? 'Unnamed'),
          country: String(row.country ?? row.Country ?? row.countries ?? row.Countries ?? row.Country_Name ?? row.Signatories ?? 'Unknown'),
          basin,
          latitude: lat,
          longitude: lng,
          purpose: String(row.purpose ?? row.Purpose ?? row.description ?? row.Description ?? row.summary ?? row['Issue Area'] ?? ''),
          year: yr || new Date().getFullYear(),
          pdfUrl: row.pdfUrl ?? row.pdf_url ?? row.link
            ?? findTreatyLink(row.DocumentName ?? row.name ?? row.Name ?? row.title ?? '')?.download
            ?? undefined,
        };
      })
      .filter((a: Agreement) => a.latitude !== 0 && a.longitude !== 0);
  };

  // Shared JSON text parser
  const processJSONText = useCallback((text: string, showToast = true): Agreement[] => {
    // Clean control characters that break JSON.parse
    const cleaned = text.replace(/[\x00-\x1f\x7f]/g, (c) => {
      if (c === '\n' || c === '\r' || c === '\t') return c;
      return '';
    });
    const raw = JSON.parse(cleaned);

    // Find the array: direct array, or common wrapper keys
    let data: any[];
    if (Array.isArray(raw)) {
      data = raw;
    } else if (typeof raw === 'object' && raw !== null) {
      data = raw.agreements ?? raw.data ?? raw.features ?? raw.records
        ?? raw.items ?? raw.results ?? raw.treaties
        ?? Object.values(raw).find((v: any) => Array.isArray(v))
        ?? [];
    } else {
      data = [];
    }

    if (!Array.isArray(data)) data = [];
    return parseRows(data);
  }, []);

  // Auto-load bundled MASTER.json on mount
  useEffect(() => {
    const loadDefaultData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const res = await fetch(`${baseUrl}data/MASTER.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const parsed = processJSONText(text, false);
        if (parsed.length > 0) {
          setAgreements(parsed);
        }
      } catch (error) {
        console.warn('Varsayılan veri yüklenemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDefaultData();
  }, [processJSONText]);

  const handleJSONUpload = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = processJSONText(e.target?.result as string);

        if (parsed.length === 0) {
          toast.error(t('toast.jsonEmpty'));
          setIsLoading(false);
          return;
        }

        setAgreements(parsed);
        toast.success(t('toast.loaded', { count: parsed.length }));
      } catch (error) {
        console.error('JSON parse error:', error);
        toast.error(t('toast.jsonError'));
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast.error(t('toast.jsonReadError'));
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const handleCSVUpload = (file: File) => {
    setIsLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        try {
          const parsed = parseRows(results.data);

          if (parsed.length === 0) {
            toast.error(t('toast.csvEmpty'));
            setIsLoading(false);
            return;
          }

          setAgreements(parsed);
          toast.success(t('toast.loaded', { count: parsed.length }));
        } catch (error) {
          console.error('Error parsing CSV:', error);
          toast.error(t('toast.csvError'));
        } finally {
          setIsLoading(false);
        }
      },
      error: (error: any) => {
        console.error('CSV parse error:', error);
        toast.error(t('toast.csvReadError'));
        setIsLoading(false);
      },
    });
  };

  const handleFileUpload = (file: File) => {
    if (file.name.endsWith('.json')) {
      handleJSONUpload(file);
    } else {
      handleCSVUpload(file);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-50 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="font-bold text-lg md:text-xl tracking-tight text-slate-800 uppercase leading-none">
            {t('app.title')}
          </h1>
        </div>
        <div className="ml-auto hidden lg:flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span className={lang === 'tr' ? 'opacity-100' : 'opacity-40'}>TR</span>
            <span className="text-slate-300">/</span>
            <span className={lang === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
          </button>
          <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-100 text-xs font-bold tracking-wide uppercase shadow-sm">
            <strong>{agreements.length}</strong> {t('app.recordsMapped')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex w-full pt-16">
        {/* Sidebar */}
        <AgreementSidebar
          agreements={agreements}
          selectedId={selectedId}
          onSelectAgreement={setSelectedId}
          onUploadFile={handleFileUpload}
          isLoading={isLoading}
        />

        {/* Map */}
        <div className="flex-1 relative">
          <MapViewer
            agreements={agreements}
            selectedId={selectedId}
            onMarkerClick={setSelectedId}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
