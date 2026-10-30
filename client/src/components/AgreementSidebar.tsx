import { useState, useMemo, useRef } from 'react';
import { Search, Sparkles, X, FileDown, ExternalLink } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Agreement, WaterConflict } from './MapViewer';
import { smartSearch, describeQuery, isSmartQuery } from '@/lib/smartSearch';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  translateTreatyTitle,
  translateBasin,
  translateCountry,
  translateConflict,
} from '@/lib/treatyTranslator';
import { PACIFIC_CATEGORIES, PacificCategoryType } from '@/data/conflictsTr';

interface Props {
  agreements: Agreement[];
  allAgreementsCount?: number;
  conflicts?: WaterConflict[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onUploadFile?: (file: File) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  aiMode: boolean;
  onToggleAiMode: () => void;
}

function deriveTypeBadge(purpose: string) {
  const p = purpose.toLowerCase();
  const isConflict = p.includes('conflict') || p.includes('dispute') || p.includes('war') || p.includes('protest');
  const isCoop = p.includes('cooper') || p.includes('alloc') || p.includes('joint') || p.includes('agreement') || p.includes('treaty');
  if (isConflict && isCoop) {
    return { labelTr: 'Karma', labelEn: 'Mixed', color: '#b45309', bg: '#fef3c7' };
  }
  if (isConflict) {
    return { labelTr: 'Uyuşmazlık', labelEn: 'Conflict', color: '#b91c1c', bg: '#fee2e2' };
  }
  return { labelTr: 'İşbirliği', labelEn: 'Cooperation', color: '#15803d', bg: '#dcfce7' };
}

function getConflictBadge(intensity: number, lang: 'tr' | 'en' = 'tr') {
  if (intensity <= -4) return { label: lang === 'tr' ? 'Ağır Kriz' : 'Severe Crisis', color: '#dc2626', bg: '#fee2e2' };
  if (intensity < 0) return { label: lang === 'tr' ? 'Uyuşmazlık' : 'Dispute', color: '#ea580c', bg: '#ffedd5' };
  if (intensity > 3) return { label: lang === 'tr' ? 'Büyük İşbirliği' : 'Major Cooperation', color: '#16a34a', bg: '#dcfce7' };
  return { label: lang === 'tr' ? 'Ortak Girişim' : 'Joint Action', color: '#0284c7', bg: '#e0f2fe' };
}

export default function AgreementSidebar({
  agreements,
  allAgreementsCount,
  conflicts = [],
  selectedId,
  onSelect,
  searchTerm,
  onSearchChange,
  aiMode,
  onToggleAiMode,
}: Props) {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'agreements' | 'conflicts'>('agreements');
  const [pacificFilter, setPacificFilter] = useState<'all' | PacificCategoryType>('all');
  const parentRef = useRef<HTMLDivElement>(null);

  const isSmart = aiMode || isSmartQuery(searchTerm);

  const queryDescription = useMemo(() => {
    if (!searchTerm.trim() || !isSmart) return '';
    return describeQuery(searchTerm, lang);
  }, [searchTerm, isSmart, lang]);

  // Filter conflicts if in conflicts tab and searching
  const filteredConflicts = useMemo(() => {
    let list = conflicts;
    if (pacificFilter !== 'all') {
      list = list.filter((c) => c.pacificCategory === pacificFilter);
    }
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.countries.toLowerCase().includes(q) ||
        c.basin.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        String(c.year).includes(q)
    );
  }, [conflicts, searchTerm, pacificFilter]);

  const activeItemsCount = activeCategory === 'agreements' ? agreements.length : filteredConflicts.length;

  // Virtualizer for 60fps scrolling across 3,000+ items
  const rowVirtualizer = useVirtualizer({
    count: activeItemsCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 125,
    overscan: 6,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Category Tabs: Treaties vs Conflicts */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f1f5f9', padding: '6px 8px', gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => setActiveCategory('agreements')}
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: 11.5,
            fontWeight: activeCategory === 'agreements' ? 700 : 500,
            borderRadius: 6,
            border: 'none',
            background: activeCategory === 'agreements' ? '#fff' : 'transparent',
            color: activeCategory === 'agreements' ? '#0369a1' : '#64748b',
            boxShadow: activeCategory === 'agreements' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            transition: 'all 0.15s ease',
          }}
        >
          <span>📄</span>
          <span>{lang === 'tr' ? 'Anlaşmalar' : 'Treaties'}</span>
          <span style={{ fontSize: 10, background: activeCategory === 'agreements' ? '#e0f2fe' : '#e2e8f0', color: activeCategory === 'agreements' ? '#0369a1' : '#64748b', padding: '1px 5px', borderRadius: 10 }}>
            {agreements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('conflicts')}
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: 11.5,
            fontWeight: activeCategory === 'conflicts' ? 700 : 500,
            borderRadius: 6,
            border: 'none',
            background: activeCategory === 'conflicts' ? '#fff' : 'transparent',
            color: activeCategory === 'conflicts' ? '#dc2626' : '#64748b',
            boxShadow: activeCategory === 'conflicts' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            transition: 'all 0.15s ease',
          }}
        >
          <span>⚡</span>
          <span>{lang === 'tr' ? 'Tarihi Krizler' : 'Historical Crises'}</span>
          <span style={{ fontSize: 10, background: activeCategory === 'conflicts' ? '#fee2e2' : '#e2e8f0', color: activeCategory === 'conflicts' ? '#dc2626' : '#64748b', padding: '1px 5px', borderRadius: 10 }}>
            {filteredConflicts.length}
          </span>
        </button>
      </div>

      {/* Search Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        {/* Search Mode Toggle */}
        <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 6, padding: 2 }}>
          <button
            onClick={() => aiMode && onToggleAiMode()}
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              background: !aiMode ? '#fff' : 'transparent',
              color: !aiMode ? '#0f172a' : '#64748b',
              boxShadow: !aiMode ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Search size={12} />
            {lang === 'tr' ? 'Klasik' : 'Standard'}
          </button>
          <button
            onClick={() => !aiMode && onToggleAiMode()}
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              background: aiMode ? '#0284c7' : 'transparent',
              color: aiMode ? '#fff' : '#64748b',
              boxShadow: aiMode ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Sparkles size={12} />
            {lang === 'tr' ? '✨ Akıllı NLP' : '✨ Smart NLP'}
          </button>
        </div>

        {/* Input Field */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, color: '#94a3b8' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              activeCategory === 'agreements'
                ? aiMode
                  ? lang === 'tr'
                    ? 'Örn: Nil havzası 1980 sonrası hidroelektrik...'
                    : 'e.g. Nile basin after 1980 hydropower...'
                  : lang === 'tr'
                  ? 'Havza, ülke veya anlaşma adı ara...'
                  : 'Search basin, country or treaty...'
                : lang === 'tr'
                ? 'Kriz, havza veya ülke ara...'
                : 'Search crisis, basin or country...'
            }
            style={{
              width: '100%',
              padding: '8px 28px 8px 30px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              fontSize: 12,
              outline: 'none',
              background: '#fff',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Query NLP Interpretation Chip */}
        {queryDescription && activeCategory === 'agreements' && (
          <div
            style={{
              fontSize: 11,
              color: '#0369a1',
              background: '#e0f2fe',
              padding: '4px 8px',
              borderRadius: 4,
              lineHeight: 1.3,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Sparkles size={11} style={{ flexShrink: 0 }} />
            <span>{queryDescription}</span>
          </div>
        )}
      </div>

      {/* Pacific Institute Chronology Taxonomy Filter Strip */}
      {activeCategory === 'conflicts' && (
        <div
          style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '6px 10px',
            display: 'flex',
            gap: 4,
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setPacificFilter('all')}
            style={{
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 10.5,
              fontWeight: pacificFilter === 'all' ? 700 : 500,
              border: pacificFilter === 'all' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              background: pacificFilter === 'all' ? '#e0f2fe' : '#ffffff',
              color: pacificFilter === 'all' ? '#0369a1' : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {lang === 'tr' ? 'Tümü' : 'All'} ({conflicts.length})
          </button>
          {(['trigger', 'weapon', 'casualty', 'cooperation'] as PacificCategoryType[]).map((cat) => {
            const meta = PACIFIC_CATEGORIES[cat];
            const isAct = pacificFilter === cat;
            const count = conflicts.filter((c) => c.pacificCategory === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setPacificFilter(cat)}
                title={lang === 'tr' ? meta.descriptionTr : meta.descriptionEn}
                style={{
                  padding: '3px 7px',
                  borderRadius: 4,
                  fontSize: 10.5,
                  fontWeight: isAct ? 700 : 500,
                  border: `1px solid ${isAct ? meta.color : meta.border}`,
                  background: isAct ? meta.bg : '#ffffff',
                  color: isAct ? meta.color : '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <span>{meta.icon}</span>
                <span>{lang === 'tr' ? meta.labelTr : meta.labelEn}</span>
                <span style={{ fontSize: 9.5, opacity: 0.8 }}>({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* OSU Master DB Download Banner (Treaties view) */}
      {activeCategory === 'agreements' && (
        <div
          style={{
            background: '#f0fdf4',
            borderBottom: '1px solid #bbf7d0',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#166534',
            flexShrink: 0,
            gap: 6,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 13 }}>📊</span>
            <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lang === 'tr' ? 'OSU TFDD (115 Kolon)' : 'OSU TFDD (115 Cols)'}
            </span>
          </span>
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            <a
              href="./docs/WebsiteTreatyCodeBook_20180312.pdf"
              target="_blank"
              rel="noreferrer"
              title={lang === 'tr' ? 'OSU TFDD 115-değişken Resmi Metodoloji ve Kodlama Kılavuzu (CodeBook PDF)' : 'OSU TFDD 115-variable Official Methodology & CodeBook PDF'}
              style={{
                textDecoration: 'none',
                color: '#0369a1',
                fontWeight: 700,
                fontSize: 10.5,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                background: '#e0f2fe',
                border: '1px solid #bae6fd',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              <FileDown size={11} />
              CodeBook
            </a>
            <a
              href="./data/WebsiteTreatiesDB_20181124.xlsx"
              download="WebsiteTreatiesDB_20181124.xlsx"
              title={lang === 'tr' ? 'Orijinal OSU TFDD 115-kolon Master Excel tablosunu indir (1.18 MB)' : 'Download original OSU TFDD 115-column Master Excel sheet (1.18 MB)'}
              style={{
                textDecoration: 'none',
                color: '#15803d',
                fontWeight: 700,
                fontSize: 10.5,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                background: '#dcfce7',
                border: '1px solid #86efac',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              <FileDown size={11} />
              .XLSX (1.18 MB)
            </a>
          </div>
        </div>
      )}

      {/* Virtualized Scroll Container */}
      <div
        ref={parentRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px',
          position: 'relative',
        }}
      >
        {activeItemsCount === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b', fontSize: 13 }}>
            <p style={{ margin: 0, fontWeight: 500 }}>
              {activeCategory === 'agreements'
                ? lang === 'tr' ? 'Aramaya uygun anlaşma bulunamadı.' : 'No matching agreements found.'
                : lang === 'tr' ? 'Aramaya uygun kriz veya uyuşmazlık bulunamadı.' : 'No matching crises found.'}
            </p>
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              if (activeCategory === 'agreements') {
                const a = agreements[virtualRow.index];
                if (!a) return null;
                const isSelected = a.id === selectedId;
                const badge = deriveTypeBadge(a.purpose);

                return (
                  <div
                    key={a.id}
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                      paddingBottom: 8,
                    }}
                  >
                    <div
                      onClick={() => onSelect(a.id)}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        background: isSelected ? '#f0f9ff' : '#fff',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 2px 8px rgba(2,132,199,0.15)' : '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'border-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0f172a', lineHeight: 1.35, marginBottom: 4 }}>
                        {translateTreatyTitle(a.name, lang)}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', fontSize: 11, color: '#475569', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '1px 5px', borderRadius: 3 }}>
                          {a.year > 0 ? a.year : (lang === 'tr' ? 'Tarih Belirsiz' : 'Date Unknown')}
                        </span>
                        {a.basin && (
                          <span style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 3 }}>
                            🌊 {translateBasin(a.basin, lang)}
                          </span>
                        )}
                        <span style={{ background: badge.bg, color: badge.color, padding: '1px 5px', borderRadius: 3, fontWeight: 500 }}>
                          {lang === 'tr' ? badge.labelTr : badge.labelEn}
                        </span>
                      </div>

                      {a.commName && (
                        <div style={{ fontSize: 11, color: '#0369a1', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ flexShrink: 0 }}>🤝</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.commName}>
                            {a.commName}
                          </span>
                        </div>
                      )}

                      <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                        📍 {translateCountry(a.country, lang)}
                        {a.locationSigned && <span style={{ color: '#94a3b8' }}> • {a.locationSigned}</span>}
                      </div>

                      {/* Provision Badges from OSU TFDD 115 variables */}
                      {(a.alloc === 1 || a.hydro === 1 || a.groundwater === 1 || a.monitoring === 1 || a.conflictRes === 1) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
                          {a.alloc === 1 && (
                            <span style={{ fontSize: 9.5, padding: '1px 5px', background: '#e0f2fe', color: '#0369a1', borderRadius: 3, fontWeight: 600 }}>
                              💧 {lang === 'tr' ? 'Su Tahsisi' : 'Allocation'}
                            </span>
                          )}
                          {a.hydro === 1 && (
                            <span style={{ fontSize: 9.5, padding: '1px 5px', background: '#fef3c7', color: '#b45309', borderRadius: 3, fontWeight: 600 }}>
                              ⚡ {lang === 'tr' ? 'HES' : 'Hydro'}
                            </span>
                          )}
                          {a.groundwater === 1 && (
                            <span style={{ fontSize: 9.5, padding: '1px 5px', background: '#ecfdf5', color: '#047857', borderRadius: 3, fontWeight: 600 }}>
                              🌿 {lang === 'tr' ? 'Akifer' : 'Aquifer'}
                            </span>
                          )}
                          {a.monitoring === 1 && (
                            <span style={{ fontSize: 9.5, padding: '1px 5px', background: '#f5f3ff', color: '#6d28d9', borderRadius: 3, fontWeight: 600 }}>
                              📡 {lang === 'tr' ? 'İzleme' : 'Monitoring'}
                            </span>
                          )}
                          {a.conflictRes === 1 && (
                            <span style={{ fontSize: 9.5, padding: '1px 5px', background: '#fdf2f8', color: '#be185d', borderRadius: 3, fontWeight: 600 }}>
                              ⚖️ {lang === 'tr' ? 'Çözüm' : 'Dispute Res.'}
                            </span>
                          )}
                        </div>
                      )}

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 10.5, borderTop: '1px solid #f1f5f9', paddingTop: 6, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                        {a.bcode && (
                          <a
                            href="./data/WebsiteTreatiesDB_20181124.xlsx"
                            download="WebsiteTreatiesDB_20181124.xlsx"
                            title={lang === 'tr' ? `OSU TFDD Havza Kodu: ${a.bcode} — 115 Değişkenli Master Excel Tablosu` : `OSU TFDD Basin Code: ${a.bcode} — 115-Variable Master Excel Sheet`}
                            style={{ color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', background: '#ecfdf5', padding: '1px 5px', borderRadius: 3, border: '1px solid #a7f3d0' }}
                          >
                            <span>📊</span>
                            <span>OSU DB</span>
                          </a>
                        )}
                        {a.githubDocUrl ? (
                          <a
                            href={a.githubDocUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#0369a1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', background: '#e0f2fe', padding: '1px 6px', borderRadius: 4 }}
                            title={lang === 'tr' ? 'GitHub deposundan doğrudan PDF aç' : 'Open PDF directly from GitHub repo'}
                          >
                            <FileDown size={12} />
                            {lang === 'tr' ? 'Depo PDF' : 'Repo PDF'}
                          </a>
                        ) : a.pdfUrl ? (
                          <a
                            href={a.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#0369a1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}
                          >
                            <FileDown size={12} />
                            PDF
                          </a>
                        ) : null}
                        {a.faolexUrl && (
                          <a
                            href={a.faolexUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#0284c7', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}
                          >
                            <ExternalLink size={11} />
                            FAOLEX
                          </a>
                        )}
                        <a
                          href={`https://www.fao.org/faolex/results/en/?query=${encodeURIComponent(a.name.slice(0, 80))}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none', marginLeft: 'auto' }}
                        >
                          FAOLEX Ara ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }

              // Conflicts virtual row
              const c = filteredConflicts[virtualRow.index];
              if (!c) return null;
              const isSelected = c.id === selectedId;
              const badge = getConflictBadge(c.intensity, lang);
              const cTr = translateConflict(c, lang);
              const pacificMeta = c.pacificCategory ? PACIFIC_CATEGORIES[c.pacificCategory] : undefined;

              return (
                <div
                  key={c.id}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: 8,
                  }}
                >
                  <div
                    onClick={() => onSelect(c.id)}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: isSelected ? '2px solid #dc2626' : '1px solid #fee2e2',
                      background: isSelected ? '#fef2f2' : '#fff',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 8px rgba(220,38,38,0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#fca5a5';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#fee2e2';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ background: badge.bg, color: badge.color, padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                        BAR: {c.intensity > 0 ? '+' + c.intensity : c.intensity} · {badge.label}
                      </span>
                      {pacificMeta && (
                        <span
                          style={{
                            background: pacificMeta.bg,
                            color: pacificMeta.color,
                            border: `1px solid ${pacificMeta.border}`,
                            padding: '1px 5px',
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                          title={lang === 'tr' ? pacificMeta.descriptionTr : pacificMeta.descriptionEn}
                        >
                          <span>{pacificMeta.icon}</span>
                          <span>{lang === 'tr' ? pacificMeta.labelTr : pacificMeta.labelEn}</span>
                        </span>
                      )}
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginLeft: 'auto' }}>
                        📅 {c.dateStr || (c.year < 0 ? Math.abs(c.year) + (lang === 'tr' ? ' M.Ö.' : ' BC') : c.year)}
                      </span>
                    </div>

                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: 4 }}>
                      {cTr.title}
                    </div>

                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>
                      📍 {cTr.countries} &nbsp;·&nbsp; 🌊 {cTr.basin}
                    </div>

                    <div style={{ fontSize: 11.5, color: '#334155', lineHeight: 1.45, background: '#f8fafc', padding: 6, borderRadius: 4, border: '1px solid #f1f5f9', marginBottom: 5 }}>
                      {cTr.description.slice(0, 140)}...
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: 4 }}>
                      <a
                        href={c.pacificRefUrl || 'https://worldwater.org/conflict/refs.html'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: 10,
                          color: '#0284c7',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          fontWeight: 600,
                        }}
                      >
                        🏛️ {lang === 'tr' ? 'Pacific Institute Kaynağı ↗' : 'Pacific Inst. Ref ↗'}
                      </a>
                      <span style={{ fontSize: 9.5, color: '#94a3b8' }}>
                        worldwater.org
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
