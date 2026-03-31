import { useState, useMemo, useRef } from 'react';
import type { Agreement } from './MapViewer';

interface Props {
  agreements: Agreement[];
  selectedId?: string;
  onSelectAgreement: (id: string) => void;
  onUploadFile: (file: File) => void;
  isLoading?: boolean;
}

function AgreementLinks({ a }: { a: Agreement }) {
  const q = encodeURIComponent(a.name.slice(0, 80));
  const faolexSearch = `https://www.fao.org/faolex/results/en/?query=${q}`;
  return (
    <div style={{ marginTop: 4, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {a.pdfUrl && (
        <a
          href={a.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: 11, color: '#0369a1', textDecoration: 'none' }}
        >
          &#128196; PDF &#x2193;
        </a>
      )}
      {a.githubDocUrl && (
        <a
          href={a.githubDocUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: 11, color: '#0369a1', textDecoration: 'none' }}
        >
          &#128229; PDF
        </a>
      )}
      {a.faolexUrl && (
        <a
          href={a.faolexUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ fontSize: 11, color: '#0369a1', textDecoration: 'none' }}
        >
          FAOLEX
        </a>
      )}
      <a
        href={faolexSearch}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none' }}
      >
        FAOLEX Ara
      </a>
    </div>
  );
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
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px 8px',
          borderBottom: '1px solid #e2e8f0',
          fontWeight: 700,
          fontSize: 16,
          color: '#0369a1',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>&#128167;</span>
        <span>Su Anla&#351;malar&#305; Portal&#305;</span>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px' }}>
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
      </div>

      <div style={{ fontSize: 11, color: '#94a3b8', padding: '0 16px 6px' }}>
        {isLoading ? 'Yükleniyor...' : `${filtered.length} / ${agreements.length} anlaşma`}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 && !isLoading && (
          <div style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>Sonuç bulunamadı.</div>
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
            <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', lineHeight: 1.3 }}>
              {a.name}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {a.country} &middot; {a.basin} &middot; {a.year > 0 ? a.year : '?'}
            </div>
            {a.purpose && (
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{a.purpose}</div>
            )}
            <AgreementLinks a={a} />
          </div>
        ))}
      </div>

      {/* Footer: upload */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid #e2e8f0' }}>
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
          + CSV / JSON Yüкle
        </button>
      </div>
    </aside>
  );
}
