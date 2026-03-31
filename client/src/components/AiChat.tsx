import { useState, useRef, useEffect } from 'react';
import type { Agreement } from './MapViewer';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  agreements: Agreement[];
  selectedAgreement?: Agreement;
}

const GEMINI_MODEL = 'gemini-2.0-flash';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const STORAGE_KEY = 'gemini_api_key';

function buildSystemContext(agreements: Agreement[], selected?: Agreement): string {
  const total = agreements.length;
  const years = agreements.map((a) => a.year).filter(Boolean);
  const minYear = years.length ? Math.min(...years) : 0;
  const maxYear = years.length ? Math.max(...years) : 0;
  const countries = [...new Set(agreements.flatMap((a) => a.country.split(/[,;/]/).map((c) => c.trim())))].slice(0, 30);

  let ctx = `Sen bir su diplomasisi uzmanissin. Kullanici, ${total} uluslararasi sinir asan su anlasmasini gosteren bir harita portali kullaniyor.`;
  ctx += ` Veritabaninda ${minYear > 0 ? minYear : '?'} ile ${maxYear > 0 ? maxYear : '?'} yillari arasinda imzalanmis anlasmalarin bilgileri mevcut.`;
  ctx += ` Temsil edilen bazi ulkeler: ${countries.join(', ')}.`;
  ctx += ` Kullanici Turkce veya Ingilizce sorabilir, ayni dilde yanit ver.`;
  ctx += ` Yanitlarin ozlu, bilgilendirici ve haritayla ilgili olsun.`;

  if (selected) {
    ctx += `\n\nKullanici su anda bu anlasmaya bakiyor:\n`;
    ctx += `Ad: ${selected.name}\n`;
    ctx += `Ulke(ler): ${selected.country}\n`;
    ctx += `Havza: ${selected.basin}\n`;
    ctx += `Yil: ${selected.year}\n`;
    ctx += `Amac: ${selected.purpose}`;
  }

  return ctx;
}

async function askGemini(
  apiKey: string,
  history: Message[],
  userMsg: string,
  systemCtx: string
): Promise<string> {
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemCtx + '\n\n---\n\nKullanici mesaji: ' + history[0]?.text || userMsg }],
    },
    ...history.slice(1).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: userMsg }] },
  ];

  const res = await fetch(`${API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Yanit alinamadi.';
}

export default function AiChat({ agreements, selectedAgreement }: Props) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(STORAGE_KEY) ?? '');
  const [keyInput, setKeyInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveKey = () => {
    const k = keyInput.trim();
    if (!k) return;
    localStorage.setItem(STORAGE_KEY, k);
    setApiKey(k);
    setKeyInput('');
    setError('');
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || !apiKey) return;
    const newHistory: Message[] = [...messages, { role: 'user', text }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const ctx = buildSystemContext(agreements, selectedAgreement);
      const reply = await askGemini(apiKey, messages, text, ctx);
      setMessages([...newHistory, { role: 'model', text: reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="AI Asistan"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#0369a1',
          color: '#fff',
          border: 'none',
          fontSize: 22,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(3,105,161,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
      >
        {open ? '\u2715' : '\uD83E\uDD16'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            zIndex: 2000,
            width: 360,
            maxWidth: 'calc(100vw - 48px)',
            height: 500,
            maxHeight: 'calc(100vh - 120px)',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#0369a1',
              color: '#fff',
              padding: '12px 16px',
              fontWeight: 700,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>\uD83E\uDD16</span>
            <span>Su Anlasmalari AI Asistani</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.8 }}>Gemini 2.0 Flash</span>
          </div>

          {/* API key setup */}
          {!apiKey ? (
            <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                Google AI Studio'dan <strong>ucretsiz</strong> API key alin ve buraya girin.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12, color: '#0369a1' }}
              >
                https://aistudio.google.com/app/apikey
              </a>
              <input
                type="password"
                placeholder="API Key giriniz..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveKey()}
                style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={saveKey}
                style={{
                  padding: '8px',
                  borderRadius: 6,
                  background: '#0369a1',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Kaydet ve Baslat
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.length === 0 && (
                  <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
                    {selectedAgreement
                      ? `"${selectedAgreement.name}" anlasmasi hakkinda soru sorun.`
                      : 'Su anlagmalari hakkinda herhangi bir soru sorun.'}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: m.role === 'user' ? '#0369a1' : '#f1f5f9',
                      color: m.role === 'user' ? '#fff' : '#1e293b',
                      padding: '8px 12px',
                      borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      fontSize: 13,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.text}
                  </div>
                ))}
                {loading && (
                  <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: 13 }}>
                    Dusunuyor...
                  </div>
                )}
                {error && (
                  <div style={{ color: '#dc2626', fontSize: 12, background: '#fef2f2', padding: '6px 10px', borderRadius: 6 }}>
                    Hata: {error}
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '8px 10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Sorunuzu yazin..."
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    fontSize: 13,
                    outline: 'none',
                    background: '#f8fafc',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 6,
                    background: loading || !input.trim() ? '#94a3b8' : '#0369a1',
                    color: '#fff',
                    border: 'none',
                    cursor: loading || !input.trim() ? 'default' : 'pointer',
                    fontSize: 14,
                  }}
                >
                  \u2191
                </button>
              </div>
              {/* Reset key */}
              <div style={{ padding: '4px 10px 8px', textAlign: 'right' }}>
                <button
                  onClick={() => { localStorage.removeItem(STORAGE_KEY); setApiKey(''); setMessages([]); }}
                  style={{ fontSize: 10, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  API key'i degistir
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
