import { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export interface LayerConfig {
  id: string;
  label: { tr: string; en: string };
  icon?: string;
  enabled: boolean;
  color?: string;
}

interface LayerControlProps {
  layers: LayerConfig[];
  onLayerToggle: (id: string) => void;
}

export default function LayerControl({ layers, onLayerToggle }: LayerControlProps) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: 200,
        maxWidth: 300,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        style={{
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          color: '#111',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={16} />
          {lang === 'tr' ? 'Katmanlar' : 'Layers'}
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Layer List */}
      {isOpen && (
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '8px 0' }}>
          {layers.map((layer) => (
            <label
              key={layer.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 13,
                color: '#374151',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <input
                type="checkbox"
                checked={layer.enabled}
                onChange={() => onLayerToggle(layer.id)}
                style={{
                  marginRight: 10,
                  width: 16,
                  height: 16,
                  cursor: 'pointer',
                  accentColor: layer.color || '#3b82f6',
                }}
              />
              {layer.icon && <span style={{ marginRight: 8 }}>{layer.icon}</span>}
              <span>{lang === 'tr' ? layer.label.tr : layer.label.en}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
