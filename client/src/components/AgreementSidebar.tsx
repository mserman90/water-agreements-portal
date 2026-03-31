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
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>\uD83D\uDCA7</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#0369a1' }}>
            Su Anla\u015fmalar\u0131 Portal\u0131
          </span>
        </div>
        {/* Search */}
        <input
          type="text"
          placeholder="Ara: isim, \u00fclke, havza..."
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
          }}
        />
        <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>
          {isLoading ? 'Y\u00fckleniyor...' : `${filtered.length} / ${agreements.length} anla\u015fma`}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 && !isLoading && (
          <div style={{ padding: 20, color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
            Sonu\u00e7 bulunamad\u0131.
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
              {a.country} \u00b7 {a.basin} \u00b7 {a.year > 0 ? a.year : '?'}
            </div>
            {a.purpose && (
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, 
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.purpose}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer: upload */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
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
          + CSV / JSON Y\u00fckle
        </button>
      </div>
    </aside>
  );
}
