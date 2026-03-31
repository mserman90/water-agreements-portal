import { useState, useMemo, useRef } from 'react';
import type { Agreement } from './MapViewer';

interface Props {
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
}: Props) {
  const [query, setQuery] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return agreements;
    const q = query.toLowerCase();
    return agreements.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.basin.toLowerCase().includes(q) ||
        String(a.year).includes(q)
    );
  }, [agreements, query]);

  return (
    <aside
      style={{
        width: 320,
        minWidth: 260,
        height: '100%',
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px 10px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>💧</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#0369a1' }}>
            Su Anlaşmaları Portalı
          </span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Ara: isim, ülke, havza..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '7px 10px',
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            fontSize: 13,
            outline: 'none',
            background: '#f8fafc',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
          {isLoading ? 'Yükleniyor...' : `${filtered.length} / ${agreements.length} anlaşma`}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 && !isLoading && (
          <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Sonuç bulunamadı.
          </div>
        )}
        {filtered.map((a) => (
          <div
            key={a.id}
            onClick={() => onSelectAgreement(a.id)}
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid #f1f5f9',
              cursor: 'pointer',
              background: a.id === selectedId ? '#eff6ff' : 'transparent',
              borderLeft: a.id === selectedId ? '3px solid #0369a1' : '3px solid transparent',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', marginBottom: 2 }}>
              {a.name}
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              {a.country} · {a.basin} · {a.year > 0 ? a.year : '?'}
            </div>
            {a.purpose && (
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                {a.purpose}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer: upload */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0' }}>
        <input
          ref={fileRef}
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
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: 6,
            border: '1px dashed #94a3b8',
            background: 'transparent',
            color: '#64748b',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          + CSV / JSON Yükle
        </button>
      </div>
    </aside>
  );
}
