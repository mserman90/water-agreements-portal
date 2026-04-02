import { useState } from 'react';
import { Layers, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import LayerControl, { LayerConfig } from './LayerControl';
import AiChat from './AiChat';
import type { Agreement } from './MapViewer';

interface Props {
  layers: LayerConfig[];
  onLayerToggle: (id: string) => void;
  agreements: Agreement[];
  selectedAgreement?: Agreement;
  onUploadFile: (file: File) => void;
}

type Tab = 'layers' | 'ai';

export default function LeftPanel({
  layers,
  onLayerToggle,
  agreements,
  selectedAgreement,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('layers');
  const [collapsed, setCollapsed] = useState(false);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'layers', label: 'Katmanlar', icon: <Layers size={16} /> },
    { id: 'ai', label: 'AI Sorgu', icon: <MessageSquare size={16} /> },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? 40 : 340,
        zIndex: 1000,
        backgroundColor: 'rgba(255,255,255,0.97)',
        boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          top: 12,
          right: -14,
          zIndex: 1001,
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1px solid #d1d5db',
          backgroundColor: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
        title={collapsed ? 'Paneli Ac' : 'Paneli Kapat'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {!collapsed && (
        <>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  fontSize: 11,
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  color: activeTab === tab.id ? '#1d4ed8' : '#6b7280',
                  backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #1d4ed8' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  transition: 'all 0.15s',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'layers' && (
              <LayerControl layers={layers} onToggle={onLayerToggle} />
            )}
            {activeTab === 'ai' && (
              <AiChat agreements={agreements} selectedAgreement={selectedAgreement} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
