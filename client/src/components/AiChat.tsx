import { useState, useRef, useEffect } from 'react';
import type { Agreement, WaterConflict } from './MapViewer';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  agreements: Agreement[];
  selectedAgreement?: Agreement | WaterConflict;
  embedded?: boolean;
}

const GEMINI_MODEL = 'gemini-2.0-flash';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const STORAGE_KEY = 'gemini_api_key';

function isWaterConflict(item: Agreement | WaterConflict): item is WaterConflict {
  return 'intensity' in item;
}

function buildSystemContext(agreements: Agreement[], selected?: Agreement | WaterConflict): string {
  const total = agreements.length;
  const years = agreements.map((a) => a.year).filter(Boolean);
  const minYear = years.length ? Math.min(...years) : 0;
  const maxYear = years.length ? Math.max(...years) : 0;
  const countries = [...new Set(agreements.flatMap((a) => a.country.split(/[,;/]/).map((c) => c.trim())))].slice(0, 30);

  let ctx = `Sen uluslararası su diplomasisi, sınır-aşan nehirler, tarihi su uyuşmazlıkları ve uluslararası su anlaşmaları uzmanısın. Kullanıcı, ${total} uluslararası anlaşma ve 121 tarihi su krizini içeren Global Su Anlaşmaları Portalını kullanıyor.`;
  ctx += ` Veritabanında ${minYear > 0 ? minYear : '1820'} ile ${maxYear > 0 ? maxYear : '2024'} yılları arasında imzalanmış anlaşma ve uyuşmazlık kayıtları (BAR Ölçeği: -7 savaştan +7 tam birliğe) mevcut.`;
  ctx += ` Önemli bazı taraflar: ${countries.join(', ')}.`;
  ctx += ` Kullanıcı Türkçe veya İngilizce sorabilir; sorulan dilde yanıt ver.`;
  ctx += ` Yanıtların akademik doğrulukta, özlü, bilgilendirici ve anlaşma maddeleri/havzalar odaklı olsun.`;

  if (selected) {
    if (isWaterConflict(selected)) {
      ctx += `\n\n[Kullanıcının İncelediği Tarihi Su Olayı / Kriz]:\n`;
      ctx += `Başlık: ${selected.title}\n`;
      ctx += `Yıl: ${selected.year}\n`;
      ctx += `Taraf Ülkeler: ${selected.countries}\n`;
      ctx += `Havza: ${selected.basin}\n`;
      ctx += `BAR Yoğunluk Skoru: ${selected.intensity}\n`;
      ctx += `Açıklama: ${selected.description}\n`;
      if (selected.source) ctx += `Kaynak: ${selected.source}\n`;
    } else {
      ctx += `\n\n[Kullanıcının Seçtiği Anlaşma]:\n`;
      ctx += `Başlık: ${selected.name}\n`;
      ctx += `Ülke(ler): ${selected.country}\n`;
      ctx += `Havza: ${selected.basin}\n`;
      ctx += `Yıl: ${selected.year}\n`;
      ctx += `Kapsam/Amaç: ${selected.purpose || 'Belirtilmemiş'}\n`;
      if (selected.pdfUrl) ctx += `PDF: ${selected.pdfUrl}\n`;
      if (selected.faolexUrl) ctx += `FAOLEX: ${selected.faolexUrl}\n`;
    }
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
      parts: [{ text: systemCtx + '\n\n---\n\nKullanıcı sorusu: ' + (history[0]?.text || userMsg) }],
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
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Yanıt alınamadı.';
}

export default function AiChat({ agreements, selectedAgreement, embedded = false }: Props) {
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

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading || !apiKey) return;
    const newHistory: Message[] = [...messages, { role: 'user', text }];
    setMessages(newHistory);
    if (!overrideText) setInput('');
    setLoading(true);
    setError('');
    try {
      const ctx = buildSystemContext(agreements, selectedAgreement);
      const reply = await askGemini(apiKey, messages, text, ctx);
      setMessages([...newHistory, { role: 'model', text: reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata oluştu';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = selectedAgreement
    ? isWaterConflict(selectedAgreement)
      ? [
          `Bu krizin temel sebebi nedir ve nasıl sonuçlandı?`,
          `Bu uyuşmazlığın ardından hangi su anlaşması imzalandı?`,
          `Tarafların savunduğu su hakları nelerdi?`,
        ]
      : [
          `Bu anlaşmanın ana konusu ve önemi nedir?`,
          `Taraflar su paylaşımını nasıl düzenlemiştir?`,
          `Uyuşmazlık çözümü mekanizması var mı?`,
        ]
    : [
        'Nil havzasında kaç anlaşma imzalandı?',
        'Fırat-Dicle nehirlerindeki tarihi anlaşmalar nelerdir?',
        'Tarihteki en eski su anlaşması hangisidir?',
      ];

  const selectedName = selectedAgreement
    ? isWaterConflict(selectedAgreement)
      ? `${selectedAgreement.title} (${selectedAgreement.year})`
      : `${selectedAgreement.name} (${selectedAgreement.year})`
    : '';

  const chatBody = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
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
          flexShrink: 0,
        }}
      >
        <span>🤖</span>
        <span>Su Anlaşmaları AI Asistanı</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.85, background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4 }}>
          Gemini 2.0
        </span>
      </div>

      {/* Selected item banner */}
      {selectedAgreement && (
        <div style={{ background: '#f0f9ff', borderBottom: '1px solid #bae6fd', padding: '8px 12px', fontSize: 12, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span>{isWaterConflict(selectedAgreement) ? '⚡' : '📌'}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
            {selectedName}
          </span>
        </div>
      )}

      {/* API Key Prompt */}
      {!apiKey ? (
        <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              AI Asistanını kullanmak için ücretsiz <strong>Gemini API anahtarı</strong> gereklidir.
            </p>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, marginBottom: 0 }}>
              Anahtarınız sadece tarayıcınızda (localStorage) saklanır, sunucuya gönderilmez.
            </p>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, color: '#0284c7', textDecoration: 'underline', fontWeight: 500 }}
          >
            ↗ Google AI Studio'dan Ücretsiz Key Al
          </a>
          <input
            type="password"
            placeholder="AIzaSy... API anahtarını buraya yapıştırın"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveKey()}
            style={{
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            onClick={saveKey}
            style={{
              padding: '10px',
              borderRadius: 6,
              background: '#0369a1',
              color: '#fff',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Kaydet ve Başlat
          </button>
        </div>
      ) : (
        <>
          {/* Messages container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center' }}>
                  {selectedAgreement
                    ? `"${selectedName}" hakkında soru sorabilirsiniz.`
                    : 'Uluslararası su anlaşmaları, havzalar ve uyuşmazlıklar hakkında soru sorabilirsiniz.'}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Örnek Sorular:
                </div>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(q)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      fontSize: 12,
                      color: '#0369a1',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f9ff';
                      e.currentTarget.style.borderColor = '#bae6fd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background: m.role === 'user' ? '#0369a1' : '#f1f5f9',
                  color: m.role === 'user' ? '#fff' : '#0f172a',
                  padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  fontSize: 13,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: 13, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🤖 Analiz ediliyor...</span>
              </div>
            )}

            {error && (
              <div style={{ color: '#dc2626', fontSize: 12, background: '#fef2f2', border: '1px solid #fecaca', padding: '8px 10px', borderRadius: 6 }}>
                Hata: {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input field */}
          <div style={{ padding: '8px 10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 6, background: '#fff' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Sorunuzu yazın..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                background: '#f8fafc',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                background: loading || !input.trim() ? '#cbd5e1' : '#0369a1',
                color: '#fff',
                border: 'none',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ↑
            </button>
          </div>

          {/* Reset Key */}
          <div style={{ padding: '3px 10px 6px', textAlign: 'right', background: '#fafafa', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setApiKey('');
                setMessages([]);
              }}
              style={{ fontSize: 10, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              🔑 API anahtarını değiştir
            </button>
          </div>
        </>
      )}
    </div>
  );

  if (embedded) {
    return chatBody;
  }

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
        {open ? '✕' : '🤖'}
      </button>

      {/* Floating panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            zIndex: 2000,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            height: 520,
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
          {chatBody}
        </div>
      )}
    </>
  );
}
