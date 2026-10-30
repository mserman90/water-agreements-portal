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
  const parentRef = useRef<HTMLDivElement>(null);

  const isSmart = aiMode || isSmartQuery(searchTerm);

  const queryDescription = useMemo(() => {
    if (!searchTerm.trim() || !isSmart) return '';
    return describeQuery(searchTerm, lang);
  }, [searchTerm, isSmart, lang]);

  // Filter conflicts if in conflicts tab and searching
  const filteredConflicts = useMemo(() => {
    if (!searchTerm.trim()) return conflicts;
    const q = searchTerm.toLowerCase();
    return conflicts.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.countries.toLowerCase().includes(q) ||
        c.basin.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        String(c.year).includes(q)
    );
  }, [conflicts, searchTerm]);

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

                      <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>
                        📍 {translateCountry(a.country, lang)}
                      </div>

                      <div style={{ display: 'flex', gap: 8, fontSize: 10.5, borderTop: '1px solid #f1f5f9', paddingTop: 6 }} onClick={(e) => e.stopPropagation()}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ background: badge.bg, color: badge.color, padding: '1px 5px', borderRadius: 4, fontSize: 10.5, fontWeight: 700 }}>
                        BAR: {c.intensity > 0 ? '+' + c.intensity : c.intensity} · {badge.label}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginLeft: 'auto' }}>
                        📅 {c.year}
                      </span>
                    </div>

                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: 4 }}>
                      {cTr.title}
                    </div>

                    <div style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>
                      📍 {cTr.countries} &nbsp;·&nbsp; 🌊 {cTr.basin}
                    </div>

                    <div style={{ fontSize: 11.5, color: '#334155', lineHeight: 1.45, background: '#f8fafc', padding: 6, borderRadius: 4, border: '1px solid #f1f5f9' }}>
                      {cTr.description.slice(0, 140)}...
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
