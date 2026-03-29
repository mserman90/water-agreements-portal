import { useState, useMemo } from 'react';
import { Search, Upload, Loader2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';

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

interface AgreementSidebarProps {
  agreements: Agreement[];
  selectedId?: string;
  onSelectAgreement: (id: string) => void;
  onUploadFile: (file: File) => void;
  isLoading?: boolean;
}

export default function AgreementSidebar({
  agreements,
  selectedId,
  onSelectAgreement,
  onUploadFile,
  isLoading = false,
}: AgreementSidebarProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAgreements = useMemo(() => {
    if (!searchTerm) return agreements;
    const lower = searchTerm.toLowerCase();
    return agreements.filter(
      a =>
        a.name.toLowerCase().includes(lower) ||
        a.country.toLowerCase().includes(lower) ||
        a.basin.toLowerCase().includes(lower) ||
        a.id.toLowerCase().includes(lower)
    );
  }, [agreements, searchTerm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
      e.target.value = '';
    }
  };

  return (
    <aside className="sidebar-panel w-80 h-[calc(100vh-64px)] flex flex-col border-r border-slate-200">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Agreements List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">{t('sidebar.loading')}</span>
          </div>
        ) : filteredAgreements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 text-center px-4">
            <div className="text-3xl">📭</div>
            <span className="text-xs font-bold uppercase tracking-widest">{t('sidebar.noResults')}</span>
            <p className="text-[11px] text-slate-500">
              {agreements.length === 0
                ? t('sidebar.noData')
                : t('sidebar.tryAgain')}
            </p>
          </div>
        ) : (
          filteredAgreements.map(agreement => (
            <button
              key={agreement.id}
              onClick={() => onSelectAgreement(agreement.id)}
              className={`agreement-card w-full text-left transition-all ${
                selectedId === agreement.id ? 'active' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-900 truncate">{agreement.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {agreement.country} • {agreement.basin}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{agreement.purpose}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-400">{t('card.year')}: {agreement.year}</p>
                    {agreement.pdfUrl && (
                      <a
                        href={agreement.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                      >
                        <FileDown className="h-3 w-3" />
                        {t('card.download')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Upload Button */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <label htmlFor="file-upload" className="block">
          <Button className="w-full gap-2" variant="default" asChild>
            <span>
              <Upload className="h-4 w-4" />
              {t('upload.button')}
            </span>
          </Button>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Status Footer */}
      <div className="p-3 bg-slate-900 text-white text-[10px] leading-relaxed border-t border-slate-800 text-center">
        <div className="flex items-center gap-2 mb-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold opacity-80 uppercase tracking-widest text-emerald-400">
            {t('footer.connected')}
          </span>
        </div>
        <p className="opacity-50 italic text-[9px]">
          {agreements.length} {t('footer.mapped')}
        </p>
        <p className="opacity-40 text-[8px] mt-2 leading-snug">
          {t('footer.attribution').split('{link}')[0]}
          <a
            href="https://transboundarywaters.ceoas.oregonstate.edu/international-freshwater-treaties-database"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            {t('footer.osu')}
          </a>
          {t('footer.attribution').split('{link}')[1]}
        </p>
      </div>
    </aside>
  );
}
