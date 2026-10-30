import { useState, useRef, useEffect } from 'react';
import { Sparkles, Key, RotateCcw, Send, Settings, Check } from 'lucide-react';
import type { Agreement, WaterConflict } from './MapViewer';
import { smartSearch } from '@/lib/smartSearch';
import { useLanguage } from '@/i18n/LanguageContext';
import { translateTreatyTitle, translateConflict } from '@/lib/treatyTranslator';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  agreements: Agreement[];
  selectedAgreement?: Agreement | WaterConflict;
  embedded?: boolean;
}

type Provider = 'keyless' | 'gemini';

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const STORAGE_KEY_GEMINI = 'gemini_api_key';
const STORAGE_KEY_PROVIDER = 'ai_provider_mode';

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

// 1. Free & Keyless AI Engine (Pollinations.ai)
async function askKeylessAI(
  history: Message[],
  userMsg: string,
  systemCtx: string
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 14000); // 14s timeout

  const messages = [
    { role: 'system', content: systemCtx },
    ...history.slice(-4).map((m) => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.text,
    })),
    { role: 'user', content: userMsg },
  ];

  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: 'openai',
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const reply = await res.text();
    if (!reply.trim()) throw new Error('Boş yanıt döndü');
    return reply;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// 2. Optional Gemini AI Engine
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

  const res = await fetch(`${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
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

// 3. Local Smart Fallback Engine (Offline or fallback)
function generateLocalFallbackResponse(
  userMsg: string,
  agreements: Agreement[],
  selected?: Agreement | WaterConflict
): string {
  if (selected) {
    if (isWaterConflict(selected)) {
      return `📌 **${selected.title} (${selected.year})**\n\n` +
        `- **Havza:** ${selected.basin}\n` +
        `- **Taraf Devletler:** ${selected.countries}\n` +
        `- **BAR Yoğunluk Ölçeği:** ${selected.intensity}\n` +
        `- **Tarihsel Açıklama:** ${selected.description}\n` +
        (selected.source ? `- **Kaynak Literatür:** ${selected.source}\n` : '');
    } else {
      return `📌 **${selected.name} (${selected.year})**\n\n` +
        `- **Havza:** ${selected.basin}\n` +
        `- **Taraf Devletler:** ${selected.country}\n` +
        `- **Kapsam / Amaç:** ${selected.purpose || 'Belirtilmemiş'}\n` +
        (selected.pdfUrl ? `- [📄 Orijinal PDF İndir](${selected.pdfUrl})\n` : '') +
        (selected.faolexUrl ? `- [🌐 FAOLEX Veritabanı Kaydı](${selected.faolexUrl})\n` : '');
    }
  }

  const matches = smartSearch(userMsg, agreements);
  if (matches.length > 0) {
    const top = matches.slice(0, 5);
    const years = matches.map((m) => m.year).filter(Boolean);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    let reply = `Sorunuzla ilgili veritabanında **${matches.length} anlaşma** tespit edildi (${minYear}–${maxYear}):\n\n`;
    top.forEach((m, idx) => {
      reply += `${idx + 1}. **${m.name}** (${m.year}) — *${m.country}* · 🌊 ${m.basin}\n`;
      if (m.pdfUrl) reply += `   - [📄 PDF Belgesi](${m.pdfUrl})\n`;
    });
    if (matches.length > 5) {
      reply += `\n*...ve ${matches.length - 5} anlaşma daha. Sol paneldeki arama kutusundan hepsini filtreleyebilirsiniz.*`;
    }
    return reply;
  }

  return `Uluslararası tatlı su anlaşmaları portalında 3.029 anlaşma ve 121 kriz kaydı bulunmaktadır. Belirli bir nehir havzası (örn: Nil, Fırat, Tuna), ülke veya yıl aralığı belirterek sorunuzu detaylandırabilirsiniz.`;
}

export default function AiChat({ agreements, selectedAgreement, embedded = false }: Props) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<Provider>(() => {
    return (localStorage.getItem(STORAGE_KEY_PROVIDER) as Provider) || 'keyless';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [geminiKey, setGeminiKey] = useState<string>(() => localStorage.getItem(STORAGE_KEY_GEMINI) ?? '');
  const [keyInput, setKeyInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveGeminiKey = () => {
    const k = keyInput.trim();
    if (!k) return;
    localStorage.setItem(STORAGE_KEY_GEMINI, k);
    setGeminiKey(k);
    setKeyInput('');
    setProvider('gemini');
    localStorage.setItem(STORAGE_KEY_PROVIDER, 'gemini');
    setShowSettings(false);
    setError('');
  };

  const selectProvider = (p: Provider) => {
    setProvider(p);
    localStorage.setItem(STORAGE_KEY_PROVIDER, p);
    if (p === 'keyless') {
      setShowSettings(false);
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const newHistory: Message[] = [...messages, { role: 'user', text }];
    setMessages(newHistory);
    if (!overrideText) setInput('');
    setLoading(true);
    setError('');

    const ctx = buildSystemContext(agreements, selectedAgreement);

    try {
      let reply = '';
      if (provider === 'gemini' && geminiKey) {
        reply = await askGemini(geminiKey, messages, text, ctx);
      } else {
        // Free & Keyless AI (with local fallback if offline)
        try {
          reply = await askKeylessAI(messages, text, ctx);
        } catch {
          reply = generateLocalFallbackResponse(text, agreements, selectedAgreement);
        }
      }
      setMessages([...newHistory, { role: 'model', text: reply }]);
    } catch (e: unknown) {
      // Automatic Local Fallback
      const fallback = generateLocalFallbackResponse(text, agreements, selectedAgreement);
      setMessages([...newHistory, { role: 'model', text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = selectedAgreement
    ? isWaterConflict(selectedAgreement)
      ? lang === 'tr'
        ? [
            `Bu krizin temel sebebi nedir ve nasıl sonuçlandı?`,
            `Bu uyuşmazlığın ardından hangi su anlaşması imzalandı?`,
            `Tarafların savunduğu su hakları nelerdi?`,
          ]
        : [
            `What was the root cause of this crisis and how was it resolved?`,
            `Which water treaty was signed following this dispute?`,
            `What water rights did each party claim?`,
          ]
      : lang === 'tr'
      ? [
          `Bu anlaşmanın ana konusu ve önemi nedir?`,
          `Taraflar su paylaşımını nasıl düzenlemiştir?`,
          `Uyuşmazlık çözümü mekanizması var mı?`,
        ]
      : [
          `What is the main topic and significance of this agreement?`,
          `How did the parties regulate water allocation?`,
          `Is there a dispute resolution mechanism?`,
        ]
    : lang === 'tr'
    ? [
        '1959 Nil Anlaşması neden önemlidir?',
        'Fırat-Dicle nehirlerindeki tarihi anlaşmalar nelerdir?',
        'Tarihteki en eski su anlaşması hangisidir?',
      ]
    : [
        'Why is the 1959 Nile Waters Agreement significant?',
        'What are the historic treaties on the Tigris-Euphrates?',
        'What is the oldest recorded water agreement in history?',
      ];

  const selectedName = selectedAgreement
    ? isWaterConflict(selectedAgreement)
      ? `${translateConflict(selectedAgreement, lang).title} (${selectedAgreement.year})`
      : `${translateTreatyTitle(selectedAgreement.name, lang)} (${selectedAgreement.year > 0 ? selectedAgreement.year : (lang === 'tr' ? 'Tarih Belirsiz' : 'Date Unknown')})`
    : '';

  const chatBody = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          background: '#0369a1',
          color: '#fff',
          padding: '10px 14px',
          fontWeight: 700,
          fontSize: 13.5,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span>🤖</span>
        <span>Su Anlaşmaları AI Asistanı</span>

        {/* Free & Keyless indicator badge */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              background: provider === 'keyless' ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '2px 7px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
            {provider === 'keyless' ? 'Ücretsiz Keyless' : 'Gemini'}
          </span>

          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: 2,
              opacity: 0.85,
            }}
            title="AI Ayarları"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* Settings Dropdown/Drawer */}
      {showSettings && (
        <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: 12, fontSize: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#0f172a' }}>AI Sağlayıcı Seçimi:</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <button
              onClick={() => selectProvider('keyless')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 6,
                border: provider === 'keyless' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: provider === 'keyless' ? '#f0f9ff' : '#fff',
                color: provider === 'keyless' ? '#0369a1' : '#475569',
                fontWeight: 600,
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Sparkles size={12} />
              Keyless AI (Ücretsiz)
            </button>
            <button
              onClick={() => selectProvider('gemini')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 6,
                border: provider === 'gemini' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: provider === 'gemini' ? '#f0f9ff' : '#fff',
                color: provider === 'gemini' ? '#0369a1' : '#475569',
                fontWeight: 600,
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Key size={12} />
              Özel Gemini Key
            </button>
          </div>

          {provider === 'gemini' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                type="password"
                placeholder="Gemini API anahtarınız..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                style={{
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                  fontSize: 11,
                  outline: 'none',
                }}
              />
              <button
                onClick={saveGeminiKey}
                style={{
                  padding: '6px',
                  borderRadius: 4,
                  background: '#0369a1',
                  color: '#fff',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Key'i Kaydet
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected item banner */}
      {selectedAgreement && (
        <div style={{ background: '#f0f9ff', borderBottom: '1px solid #bae6fd', padding: '6px 12px', fontSize: 11.5, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span>{isWaterConflict(selectedAgreement) ? '⚡' : '📌'}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
            {selectedName}
          </span>
        </div>
      )}

      {/* Messages container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', color: '#475569', fontSize: 12, lineHeight: 1.45 }}>
              <div style={{ fontWeight: 600, color: '#0369a1', marginBottom: 2 }}>
                ✨ Ücretsiz & Anahtarsız Su Asistanı
              </div>
              <div>
                Herhangi bir API key veya giriş gerekmeden tüm dünya su anlaşmaları, Nil, Fırat-Dicle, İndus ve Tuna gibi havzalar hakkında soru sorabilirsiniz.
              </div>
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
          <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: 12.5, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🤖 {lang === 'tr' ? 'Düşünüyor ve analiz ediyor...' : 'Thinking and analyzing...'}</span>
          </div>
        )}

        {error && (
          <div style={{ color: '#dc2626', fontSize: 12, background: '#fef2f2', border: '1px solid #fecaca', padding: '8px 10px', borderRadius: 6 }}>
            {error}
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
          placeholder={lang === 'tr' ? 'Sorunuzu yazın (örn: Nil anlaşmaları nelerdir?)...' : 'Type your question (e.g. What are the Nile treaties?)...'}
          disabled={loading}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            fontSize: 12.5,
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
    </div>
  );

  if (embedded) {
    return chatBody;
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Ücretsiz AI Asistanı"
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
