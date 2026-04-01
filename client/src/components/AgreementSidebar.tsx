import SettingsPanel from './SettingsPanel';
import type { Agreement } from './MapViewer';

interface Props {
  agreements: Agreement[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onUploadFile: (file: File) => void;
}

export default function AgreementSidebar({ agreements, selectedId, onSelect, onUploadFile }: Props) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 320, zIndex: 1000, backgroundColor: 'white', boxShadow: '2px 0 8px rgba(0,0,0,0.1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Anlaşmalar</h2>
        <p style={{ fontSize: 12, color: '#666' }}>{agreements.length} anlaşma</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {agreements.slice(0, 50).map(a => (
          <div key={a.id} onClick={() => onSelect(a.id)} style={{ padding: 12, marginBottom: 8, border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', backgroundColor: a.id === selectedId ? '#eff6ff' : 'white' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{a.country} · {a.year}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: '1px solid #e5e7eb' }}>
        <SettingsPanel onUploadFile={onUploadFile} />
      </div>
    </div>
  );
}
