import { useState, useMemo } from 'react';
import { Search, Loader2, FileDown, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';
import { smartSearch, describeQuery, isSmartQuery } from '@/lib/smartSearch';
import SettingsPanel from './SettingsPanel';

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
  faolexUrl?: string;
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
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [aiMode, setAiMode] = useState(false);

  const filteredAgreements = useMemo(() => {
    if (!searchTerm) return agreements;

    if (aiMode || isSmartQuery(searchTerm)) {
      return smartSearch(searchTerm, agreements);
    }

    const lower = searchTerm.toLowerCase();
    return agreements.filter(
      a =>
        a.name.toLowerCase().includes(lower) ||
        a.country.toLowerCase().includes(lower) ||
        a.basin.toLowerCase().includes(lower) ||
        a.id.toLowerCase().includes(lower)
    );
  }, [agreements, searchTerm, aiMode]);

  const queryDescription = useMemo(() => {
    if (!searchTerm || (!aiMode && !isSmartQuery(searchTerm))) return '';
    return describeQuery(searchTerm, lang);
  }, [searchTerm, aiMode, lang]);



  return (
    <aside className="sidebar-panel w-[85vw] sm:w-80 h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] flex flex-col border-r border-slate-200">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-100 bg-slate-50 space-y-2">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-200/60 rounded-lg p-0.5">
          <button
            onClick={() => setAiMode(false)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              !aiMode
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Search className="h-3 w-3" />
            {t('search.mode.simple')}
          </button>
          <button
            onClick={() => setAiMode(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              aiMode
                ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            {t('search.mode.ai')}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          {aiMode
            ? <Sparkles className="absolute left-3 top-2.5 h-4 w-4 text-violet-400" />
            : <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          }
          <Input
            type="text"
            placeholder={aiMode ? t('search.smartPlaceholder') : t('search.placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`pl-10 text-sm ${aiMode ? 'border-violet-200 focus:border-violet-400' : ''}`}
          />
        </div>

        {/* AI Query Understanding */}
        {searchTerm && queryDescription && (
          <div className="bg-violet-50 border border-violet-100 rounded-md px-3 py-2 text-[11px] text-violet-700">
            <span className="font-semibold">{t('search.understood')}</span>{' '}
            {queryDescription}
            {filteredAgreements.length > 0 && (
              <span className="block mt-1 text-violet-500 font-medium">
                {t('search.resultCount', { count: filteredAgreements.length })}
              </span>
            )}
          </div>
        )}
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
                    <div className="flex items-center gap-2">
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
                      {agreement.faolexUrl && (
                        <a
                          href={agreement.faolexUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:underline"
                        >
                          FAOLEX
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Settings Button */}
      <SettingsPanel onUploadFile={onUploadFile} />

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
