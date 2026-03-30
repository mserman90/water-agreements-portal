import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface HeroScreenProps {
  onEnter: () => void;
}

// Animated counter hook
function useCounter(target: number, duration = 2000, enabled = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, enabled]);
  return value;
}

export default function HeroScreen({ onEnter }: HeroScreenProps) {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [animStart, setAnimStart] = useState(false);
  const tr = lang === 'tr';

  useEffect(() => {
    // Trigger counter animation after mount
    const timer = setTimeout(() => setAnimStart(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const treaties = useCounter(3063, 2000, animStart);
  const basins = useCounter(261, 1800, animStart);
  const countries = useCounter(200, 1600, animStart);
  const documents = useCounter(659, 1900, animStart);
  const years = useCounter(206, 1700, animStart);
  const pdfs = useCounter(26, 1400, animStart);

  const handleEnter = () => {
    setVisible(false);
    setTimeout(onEnter, 400);
  };

  if (!visible) return null;

  const stats = [
    {
      value: treaties.toLocaleString(),
      label: tr ? 'Anlaşma Kaydı' : 'Treaty Records',
      sub: tr ? 'TFDD Veritabanı' : 'TFDD Database',
      color: '#0369A1',
    },
    {
      value: basins.toString(),
      label: tr ? 'Nehir Havzası' : 'River Basins',
      sub: tr ? 'Coğrafi Kapsam' : 'Geographic Coverage',
      color: '#14B8A6',
    },
    {
      value: `${countries}+`,
      label: tr ? 'Ülke' : 'Countries',
      sub: tr ? 'Taraf Devlet' : 'Signatory States',
      color: '#7C3AED',
    },
    {
      value: documents.toString(),
      label: tr ? 'İndirilebilir Belge' : 'Downloadable Documents',
      sub: 'Oregon Digital + FAOLEX',
      color: '#059669',
    },
    {
      value: `${years}`,
      label: tr ? 'Yıllık Veri' : 'Years of Data',
      sub: '1820 – 2026',
      color: '#EA580C',
    },
    {
      value: pdfs.toString(),
      label: tr ? 'Orijinal PDF' : 'Original PDFs',
      sub: tr ? 'GitHub Deposu' : 'GitHub Repository',
      color: '#DC2626',
    },
  ];

  const features = tr ? [
    { icon: '🗺️', title: 'İnteraktif Harita', desc: 'Leaflet + kümeleme ile 3000+ anlaşmayı görselleştirin' },
    { icon: '🤖', title: 'AI Arama', desc: 'Doğal dilde Türkçe/İngilizce sorgulama' },
    { icon: '🌊', title: 'Su Altyapıları', desc: 'OpenStreetMap Overpass ile baraj, kanal, kuyu verileri' },
    { icon: '🌧️', title: 'Yağış & Taşkın', desc: 'Open-Meteo ile güncel ve tarihi hava verileri' },
    { icon: '📊', title: 'Tarihi Yağış', desc: '1940\'tan bugüne ERA5 yağış sorgusu ve grafik' },
    { icon: '📥', title: '3 Kaynak İndirme', desc: 'Oregon Digital, FAOLEX ve GitHub PDF' },
  ] : [
    { icon: '🗺️', title: 'Interactive Map', desc: 'Leaflet + clustering for 3000+ agreements' },
    { icon: '🤖', title: 'AI Search', desc: 'Natural language queries in Turkish/English' },
    { icon: '🌊', title: 'Water Infrastructure', desc: 'OpenStreetMap Overpass: dams, canals, wells' },
    { icon: '🌧️', title: 'Precipitation & Flood', desc: 'Open-Meteo current and forecast weather data' },
    { icon: '📊', title: 'Historical Precip.', desc: 'ERA5 precipitation query from 1940 to present' },
    { icon: '📥', title: '3-Source Downloads', desc: 'Oregon Digital, FAOLEX, and GitHub PDFs' },
  ];

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 overflow-auto">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
            <svg className="h-8 w-8 md:h-10 md:w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {tr ? 'Global Su Anlaşmaları' : 'Global Water Agreements'}
            <span className="block text-lg md:text-2xl lg:text-3xl font-semibold text-blue-300 mt-1">
              {tr ? 'Portalı' : 'Portal'}
            </span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            {tr
              ? '1820\'den günümüze uluslararası tatlı su anlaşmalarını interaktif harita üzerinde keşfedin.'
              : 'Explore international freshwater agreements from 1820 to present on an interactive map.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-5xl w-full mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl px-3 py-3 md:px-4 md:py-4 text-center hover:bg-white/10 transition-colors"
            >
              <div className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-semibold text-white mt-1">{stat.label}</div>
              <div className="text-[9px] md:text-[10px] text-slate-500 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 max-w-3xl w-full mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
          {features.map((feat, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2.5 hover:bg-white/[0.08] transition-colors"
            >
              <span className="text-lg shrink-0 mt-0.5">{feat.icon}</span>
              <div>
                <div className="text-xs font-semibold text-white">{feat.title}</div>
                <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Enter Button */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
          <button
            onClick={handleEnter}
            className="group relative px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-bold text-sm md:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              {tr ? 'Haritayı Keşfet' : 'Explore the Map'}
              <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Attribution */}
        <p className="mt-6 text-[10px] text-slate-600 text-center max-w-md animate-in fade-in duration-700 delay-700">
          {tr
            ? 'Veriler: Oregon State University – TFDD | Open-Meteo | OpenStreetMap | FAOLEX'
            : 'Data: Oregon State University – TFDD | Open-Meteo | OpenStreetMap | FAOLEX'}
        </p>
      </div>
    </div>
  );
}
