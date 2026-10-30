import { useState, useRef } from 'react';
import { FileText, Layers, MessageSquare, Info, ChevronLeft, ChevronRight, Upload, Zap, Calendar } from 'lucide-react';
import LayerControl, { LayerConfig } from './LayerControl';
import AiChat from './AiChat';
import AgreementSidebar from './AgreementSidebar';
import TimelineClimatePanel, { type TimelineMode } from './TimelineClimatePanel';
import type { Agreement, WaterConflict } from './MapViewer';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  layers: LayerConfig[];
  onLayerToggle: (id: string) => void;
  agreements: Agreement[];
  allAgreements: Agreement[];
  conflicts?: WaterConflict[];
  selectedId?: string;
  onSelect: (id: string) => void;
  selectedAgreement?: Agreement | WaterConflict;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  aiMode: boolean;
  onToggleAiMode: () => void;
  onUploadFile: (file: File) => void;
  // Timeline & Climate props
  currentYear?: number;
  setCurrentYear?: (y: number) => void;
  timelineMode?: TimelineMode;
  setTimelineMode?: (m: TimelineMode) => void;
  isPlaying?: boolean;
  setIsPlaying?: (p: boolean) => void;
  bins?: { start: number; end: number }[];
  totalCount?: number;
  coopCount?: number;
  conflictCount?: number;
  mixedCount?: number;
}

type Tab = 'agreements' | 'timeline' | 'layers' | 'ai' | 'info';

export default function LeftPanel({
  layers,
  onLayerToggle,
  agreements,
  allAgreements,
  conflicts = [],
  selectedId,
  onSelect,
  selectedAgreement,
  searchTerm,
  onSearchChange,
  aiMode,
  onToggleAiMode,
  onUploadFile,
  currentYear = 2024,
  setCurrentYear = () => {},
  timelineMode = 'cumulative',
  setTimelineMode = () => {},
  isPlaying = false,
  setIsPlaying = () => {},
  bins = [],
  totalCount = 0,
  coopCount = 0,
  conflictCount = 0,
  mixedCount = 0,
}: Props) {
  const { lang, setLang } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('agreements');
  const [collapsed, setCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'agreements', label: lang === 'tr' ? 'Veritabanı' : 'Database', icon: <FileText size={16} /> },
    { id: 'timeline', label: lang === 'tr' ? 'Zaman & İklim' : 'Timeline & Climate', icon: <Calendar size={16} /> },
    { id: 'layers', label: lang === 'tr' ? 'Katmanlar' : 'Layers', icon: <Layers size={16} /> },
    { id: 'ai', label: lang === 'tr' ? 'AI Sorgu' : 'AI Assistant', icon: <MessageSquare size={16} /> },
    { id: 'info', label: lang === 'tr' ? 'Kılavuz' : 'Guide', icon: <Info size={16} /> },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? 48 : 360,
        zIndex: 1000,
        backgroundColor: '#ffffff',
        boxShadow: '3px 0 16px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        borderRight: '1px solid #e2e8f0',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: collapsed ? '12px 6px' : '12px 14px',
          borderBottom: '1px solid #e2e8f0',
          background: '#0369a1',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: 18 }}>💧</span>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                  {lang === 'tr' ? 'Su Anlaşmaları Portalı' : 'Water Agreements'}
                </div>
                <div style={{ fontSize: 10, opacity: 0.85 }}>
                  TFDD & FAOLEX Database
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Language Switch */}
              <button
                onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 6px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
              >
                {lang.toUpperCase()}
              </button>

              {/* Collapse button */}
              <button
                onClick={() => setCollapsed(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 2,
                }}
                title="Paneli Gizle"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>💧</span>
            <button
              onClick={() => setCollapsed(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: 26,
                height: 26,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Paneli Aç"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          borderBottom: collapsed ? 'none' : '1px solid #e2e8f0',
          background: '#f8fafc',
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (collapsed) setCollapsed(false);
              }}
              style={{
                flex: collapsed ? 'none' : 1,
                padding: collapsed ? '12px 0' : '8px 4px',
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0369a1' : '#64748b',
                backgroundColor: isActive ? '#fff' : 'transparent',
                border: 'none',
                borderBottom: !collapsed && isActive ? '2px solid #0369a1' : '2px solid transparent',
                borderLeft: collapsed && isActive ? '3px solid #0369a1' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: collapsed ? 'row' : 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                transition: 'all 0.15s ease',
              }}
              title={tab.label}
            >
              {tab.icon}
              {!collapsed && <span>{tab.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {!collapsed && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Tab 1: Database (Agreements & Conflicts) */}
          {activeTab === 'agreements' && (
            <AgreementSidebar
              agreements={agreements}
              allAgreementsCount={allAgreements.length}
              conflicts={conflicts}
              selectedId={selectedId}
              onSelect={onSelect}
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              aiMode={aiMode}
              onToggleAiMode={onToggleAiMode}
              onUploadFile={onUploadFile}
            />
          )}

          {/* Tab 2: Timeline & Climate Analysis */}
          {activeTab === 'timeline' && (
            <TimelineClimatePanel
              currentYear={currentYear}
              setCurrentYear={setCurrentYear}
              mode={timelineMode}
              setMode={setTimelineMode}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              bins={bins}
              agreements={allAgreements}
              totalCount={totalCount}
              coopCount={coopCount}
              conflictCount={conflictCount}
              mixedCount={mixedCount}
              selectedAgreement={selectedAgreement}
              onSelectAgreement={onSelect}
            />
          )}

          {/* Tab 2: Layers */}
          {activeTab === 'layers' && (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                {lang === 'tr' ? 'Harita Katmanları & Gösterim' : 'Map Layers & Visibility'}
              </div>
              <LayerControl layers={layers} onLayerToggle={onLayerToggle} embedded={true} />

              {/* Dataset overview badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe', fontSize: 12 }}>
                  <span style={{ color: '#1e40af', fontWeight: 600 }}>📄 Uluslararası Anlaşmalar</span>
                  <span style={{ fontWeight: 700, color: '#1d4ed8' }}>{agreements.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fef2f2', borderRadius: 6, border: '1px solid #fecaca', fontSize: 12 }}>
                  <span style={{ color: '#991b1b', fontWeight: 600 }}>⚡ Su Uyuşmazlıkları (BAR)</span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>{conflicts.length}</span>
                </div>
              </div>

              {/* Legend & Guide */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#334155' }}>
                  {lang === 'tr' ? 'Marker Renk & Sembol Anlamları' : 'Marker Legend'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                    <span style={{ color: '#475569' }}>Anlaşma: İşbirliği (Cooperation)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                    <span style={{ color: '#475569' }}>Anlaşma: Uyuşmazlık (Conflict)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>⚡</span>
                    <span style={{ color: '#475569' }}>Tarihi Su Krizi (Negatif BAR Skoru)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>🤝</span>
                    <span style={{ color: '#475569' }}>Tarihi Dönüm Noktası (Pozitif BAR)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: AI Query */}
          {activeTab === 'ai' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <AiChat
                agreements={allAgreements}
                selectedAgreement={selectedAgreement}
                embedded={true}
              />
            </div>
          )}

          {/* Tab 4: Info & Guide & Upload */}
          {activeTab === 'info' && (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13, color: '#334155' }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px 0', color: '#0369a1' }}>
                  {lang === 'tr' ? 'Kullanım Kılavuzu' : 'User Guide'}
                </h3>
                <p style={{ margin: 0, lineHeight: 1.5, color: '#64748b' }}>
                  {lang === 'tr'
                    ? 'Bu portal, 1820 yılından günümüze dünyadaki sınır-aşan tatlı su anlaşmalarını, nehir havzalarını ve su diplomasisini interaktif olarak haritalandırır.'
                    : 'This portal visualizes transboundary freshwater agreements, river basins, and water diplomacy across the globe from 1820 to the present.'}
                </p>
              </div>

              {/* Upload section */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <h4 style={{ fontWeight: 600, margin: '0 0 6px 0', fontSize: 13 }}>
                  {lang === 'tr' ? 'Özel Veri Yükle' : 'Upload Custom Data'}
                </h4>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px 0' }}>
                  {lang === 'tr'
                    ? 'Kendi CSV veya JSON anlaşma veritabanınızı haritaya yükleyebilirsiniz.'
                    : 'Upload your own CSV or JSON treaty dataset to visualize on the map.'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUploadFile(f);
                    e.target.value = '';
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px dashed #0284c7',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Upload size={14} />
                  {lang === 'tr' ? '+ CSV / JSON Dosyası Yükle' : '+ Upload CSV / JSON'}
                </button>
              </div>

              {/* Data source credits & Academic documentation */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14, fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>
                <p style={{ fontWeight: 700, margin: '0 0 6px 0', color: '#1e293b', fontSize: 12 }}>
                  {lang === 'tr' ? '📚 Bilimsel Veri Kaynakları & Metodoloji' : '📚 Scientific Sources & Methodology'}
                </p>
                <ul style={{ margin: '0 0 8px 0', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <li><strong>TFDD (Oregon State University)</strong>: 3.000+ sınır-aşan su anlaşması (1820–2024).</li>
                  <li><strong>BAR Project (OSU & World Bank)</strong>: -7 ile +7 arası su çatışma ve işbirliği olay veri seti.</li>
                  <li><strong>ECMWF ERA5 (Copernicus C3S)</strong>: 1940–günümüz hidro-meteorolojik sıcaklık, yağış ve kuraklık reanalizi.</li>
                  <li><strong>UN Treaty Series (UNTS) & FAOLEX</strong>: Birleşmiş Milletler ve FAO resmi anlaşma metinleri.</li>
                </ul>
                <div style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', marginTop: 6 }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#334155', fontSize: 11 }}>
                    {lang === 'tr' ? 'Akademik Atıf & Dokümantasyon:' : 'Academic Citation & Documentation:'}
                  </p>
                  <a
                    href="https://github.com/mserman90/water-agreements-portal#readme"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <span>🔗 GitHub README & DATA_SOURCES.md</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
