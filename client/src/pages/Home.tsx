import { useState } from 'react';
import { toast } from 'sonner';
import Papa from 'papaparse';

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
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  // Agreements are kept in-memory (loaded fresh via CSV upload each session)

  const handleCSVUpload = (file: File) => {
    setIsLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        try {
          const parsed: Agreement[] = results.data
            .map((row: any, index: number) => ({
              id: row.id || `agreement-${index}`,
              name: row.name || 'Unnamed',
              country: row.country || 'Unknown',
              basin: row.basin || 'Unknown',
              latitude: parseFloat(row.latitude) || 0,
              longitude: parseFloat(row.longitude) || 0,
              purpose: row.purpose || '',
              year: parseInt(row.year) || new Date().getFullYear(),
              pdfUrl: row.pdfUrl || undefined,
            }))
            .filter((a: Agreement) => a.latitude !== 0 && a.longitude !== 0);

          if (parsed.length === 0) {
            toast.error('CSV dosyasında geçerli veri bulunamadı.');
            setIsLoading(false);
            return;
          }

          setAgreements(parsed);
          toast.success(`${parsed.length} anlaşma başarıyla yüklendi.`);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          toast.error('CSV dosyası işlenirken hata oluştu.');
        } finally {
          setIsLoading(false);
        }
      },
      error: (error: any) => {
        console.error('CSV parse error:', error);
        toast.error('CSV dosyası okunamadı.');
        setIsLoading(false);
      },
    });
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
            Global Su Anlaşmaları Portalı
          </h1>
        </div>
        <div className="ml-auto hidden lg:flex items-center gap-4">
          <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-100 text-xs font-bold tracking-wide uppercase shadow-sm">
            <strong>{agreements.length}</strong> Kayıt Haritalandı
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
          onUploadCSV={handleCSVUpload}
          isLoading={isLoading}
        />

        {/* Map */}
        <div className="flex-1 relative">
          <MapViewer
            agreements={agreements}
            selectedId={selectedId}
            onMarkerClick={setSelectedId}
          />
        </div>
      </div>
    </div>
  );
}
