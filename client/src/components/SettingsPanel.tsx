import { useState } from 'react';
import { Settings, X, Upload, BookOpen, Heart, ChevronDown, ChevronUp, LogIn, LogOut, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsPanelProps {
  onUploadFile: (file: File) => void;
}

export default function SettingsPanel({ onUploadFile }: SettingsPanelProps) {
  const { lang, t } = useLanguage();
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'upload' | 'about' | 'login'>('guide');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
      e.target.value = '';
      setIsOpen(false);
    }
  };

  const tabs = [
    { id: 'guide' as const, icon: BookOpen, label: lang === 'tr' ? 'Kullanım Kılavuzu' : 'User Guide' },
    // Only show Upload tab if admin
    ...(isAdmin ? [{ id: 'upload' as const, icon: Upload, label: lang === 'tr' ? 'Veri Yükle' : 'Upload Data' }] : []),
    { id: 'about' as const, icon: Heart, label: lang === 'tr' ? 'Hakkında & Teşekkür' : 'About & Credits' },
    { id: 'login' as const, icon: isAdmin ? ShieldCheck : LogIn, label: isAdmin ? (lang === 'tr' ? 'Hesap' : 'Account') : (lang === 'tr' ? 'Giriş' : 'Login') },
  ];

  return (
    <>
      {/* Settings Button */}
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full gap-2"
          variant="outline"
        >
          <Settings className="h-4 w-4" />
          {lang === 'tr' ? 'Ayarlar' : 'Settings'}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative ml-0 w-[360px] max-w-[90vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-600" />
                <h2 className="font-bold text-sm text-slate-800">
                  {lang === 'tr' ? 'Ayarlar' : 'Settings'}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-[11px] font-semibold transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-blue-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'upload' && isAdmin && (
                <UploadTab
                  lang={lang}
                  onFileChange={handleFileChange}
                />
              )}
              {activeTab === 'guide' && <GuideTab lang={lang} isAdmin={isAdmin} />}
              {activeTab === 'about' && <AboutTab lang={lang} />}
              {activeTab === 'login' && <LoginTab lang={lang} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Upload Tab ──
function UploadTab({ lang, onFileChange }: { lang: string; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="p-5 space-y-4">
      <p className="text-sm text-slate-600 leading-relaxed">
        {lang === 'tr'
          ? 'Kendi veri setinizi yükleyerek mevcut verilerin üzerine yazabilirsiniz. CSV veya JSON formatları desteklenmektedir.'
          : 'Upload your own dataset to replace the current data. CSV and JSON formats are supported.'}
      </p>

      <label htmlFor="settings-file-upload" className="block">
        <Button className="w-full gap-2" variant="default" asChild>
          <span>
            <Upload className="h-4 w-4" />
            {lang === 'tr' ? 'CSV / JSON Dosya Seç' : 'Select CSV / JSON File'}
          </span>
        </Button>
      </label>
      <input
        id="settings-file-upload"
        type="file"
        accept=".csv,.json"
        onChange={onFileChange}
        className="hidden"
      />

      <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600 space-y-2">
        <p className="font-semibold text-slate-700">
          {lang === 'tr' ? 'Desteklenen JSON yapıları:' : 'Supported JSON structures:'}
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>{lang === 'tr' ? 'Doğrudan dizi: [{...}, {...}]' : 'Direct array: [{...}, {...}]'}</li>
          <li>{lang === 'tr' ? 'Sarmalı nesne: {"data": [...]} veya {"agreements": [...]}' : 'Wrapped object: {"data": [...]} or {"agreements": [...]}'}</li>
          <li>{lang === 'tr' ? 'TFDD formatı: {"Full Treaty Database": [...]}' : 'TFDD format: {"Full Treaty Database": [...]}'}</li>
        </ul>
        <p className="font-semibold text-slate-700 mt-3">
          {lang === 'tr' ? 'Tanınan alan adları:' : 'Recognized field names:'}
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li><code className="bg-slate-200 px-1 rounded">latitude / lat</code>, <code className="bg-slate-200 px-1 rounded">longitude / lng / lon</code></li>
          <li><code className="bg-slate-200 px-1 rounded">name / DocumentName / title</code></li>
          <li><code className="bg-slate-200 px-1 rounded">country / Country_Name / Signatories</code></li>
          <li><code className="bg-slate-200 px-1 rounded">basin / Basin_Name / TFDD Basin(s)</code></li>
          <li><code className="bg-slate-200 px-1 rounded">year / DateSigned</code></li>
        </ul>
      </div>
    </div>
  );
}

// ── Login Tab ──
function LoginTab({ lang }: { lang: string }) {
  const { isAdmin, username, isLoading, login, logout } = useAuth();
  const { t } = useLanguage();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const success = await login(token);
    if (!success) {
      setError(t('auth.failed'));
    }
    setToken('');
  };

  if (isAdmin) {
    return (
      <div className="p-5 space-y-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              {t('auth.loggedAs')} <span className="font-mono">@{username}</span>
            </p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          {t('auth.logoutButton')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      <div className="text-center space-y-2">
        <LogIn className="h-8 w-8 text-slate-400 mx-auto" />
        <h3 className="font-bold text-sm text-slate-800">{t('auth.loginTitle')}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {t('auth.loginDesc')}
        </p>
      </div>

      <div className="space-y-3">
        <Input
          type="password"
          placeholder={t('auth.tokenPlaceholder')}
          value={token}
          onChange={e => { setToken(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="text-sm"
        />

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}

        <Button
          onClick={handleLogin}
          disabled={!token || isLoading}
          className="w-full gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {t('auth.loginButton')}
        </Button>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-500 leading-relaxed space-y-2">
        <p className="font-semibold text-slate-600">
          {lang === 'tr' ? 'Token nas\u0131l al\u0131n\u0131r?' : 'How to get a token?'}
        </p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>
            {lang === 'tr' ? 'GitHub\'a giri\u015f yap\u0131n' : 'Sign in to GitHub'}
          </li>
          <li>
            <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {lang === 'tr' ? 'Yeni token olu\u015fturun' : 'Create a new token'}
            </a>
            {lang === 'tr' ? ' (scope gerekmez)' : ' (no scopes needed)'}
          </li>
          <li>
            {lang === 'tr' ? 'Olu\u015fturulan token\'\u0131 yukar\u0131daki alana yap\u0131\u015ft\u0131r\u0131n' : 'Paste the generated token above'}
          </li>
        </ol>
      </div>
    </div>
  );
}

// ── Guide Tab ──
function GuideTab({ lang, isAdmin }: { lang: string; isAdmin: boolean }) {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const sections = lang === 'tr' ? [
    {
      title: 'Genel Bakış',
      content: 'Bu portal, 1820\'den günümüze kadar imzalanmış 800\'den fazla uluslararası tatlı su anlaşmasını interaktif bir harita üzerinde görselleştirir. Veriler, Oregon State Üniversitesi Transboundary Freshwater Dispute Database (TFDD) kaynağından sağlanmaktadır.'
    },
    {
      title: 'Harita Kullanımı',
      content: 'Harita üzerindeki dairesel işaretçiler anlaşmaların konumlarını gösterir. Kümelenmiş (cluster) işaretçilere tıklayarak yakınlaştırabilirsiniz. Tekil bir işaretçiye tıkladığınızda anlaşma detayları ve varsa belge indirme bağlantısı görüntülenir. Haritayı sürükleyerek kaydırabilir, fare tekerleği veya +/- butonlarıyla yakınlaştırabilirsiniz.'
    },
    {
      title: 'Basit Arama',
      content: 'Sol paneldeki arama çubuğuna havza adı, ülke adı veya anlaşma ID\'si yazarak hızlı filtreleme yapabilirsiniz. Arama sonuçları anlık olarak güncellenir.'
    },
    {
      title: 'AI Destekli Arama',
      content: 'AI moduna geçerek doğal dilde sorgular yapabilirsiniz. Motor, sorgunuzdaki ülke, havza, bölge, konu ve yıl bilgilerini otomatik olarak çıkarır. Türkçe ve İngilizce desteklenir.\n\nÖrnek sorgular:\n• "Nil havzasında 1960 sonrası anlaşmalar"\n• "Türkiye su anlaşmaları"\n• "hydropower treaties in Asia"\n• "navigation agreements 1900-1950"\n• "belgesi olan Fırat anlaşmaları"'
    },
    {
      title: 'Sidebar Etkileşimi',
      content: 'Sol paneldeki anlaşma kartlarına tıkladığınızda harita o noktaya odaklanır ve detay popup\'ı açılır. Belge bağlantısı olan anlaşmalarda "İndir" butonu bulunur — bu buton Oregon Digital arşivine yönlendirir.'
    },
    ...(isAdmin ? [{
      title: 'Veri Yükleme',
      content: 'Ayarlar menüsündeki "Veri Yükle" sekmesinden kendi CSV veya JSON dosyanızı yükleyerek mevcut verileri değiştirebilirsiniz. Uygulama TFDD formatını ve yaygın alternatif alan adlarını otomatik tanır. Koordinat bilgisi olmayan verilerde havza adından otomatik konum türetilir.'
    }] : []),
    {
      title: 'Dil Desteği',
      content: 'Sağ üst köşedeki TR/EN butonuyla Türkçe ve İngilizce arasında geçiş yapabilirsiniz. AI arama motoru her iki dilde de sorgu anlayabilir.'
    },
  ] : [
    {
      title: 'Overview',
      content: 'This portal visualizes over 800 international freshwater agreements signed from 1820 to present on an interactive map. Data is sourced from the Oregon State University Transboundary Freshwater Dispute Database (TFDD).'
    },
    {
      title: 'Map Navigation',
      content: 'Circular markers on the map represent agreement locations. Click clustered markers to zoom in. Click individual markers to view agreement details and download links (where available). Drag to pan, scroll or use +/- to zoom.'
    },
    {
      title: 'Simple Search',
      content: 'Type a basin name, country name, or agreement ID in the search bar for quick filtering. Results update instantly.'
    },
    {
      title: 'AI-Powered Search',
      content: 'Switch to AI mode for natural language queries. The engine automatically extracts country, basin, region, topic, and year information from your query. Supports both Turkish and English.\n\nExample queries:\n• "Nile basin agreements after 1960"\n• "Turkey water treaties"\n• "hydropower treaties in Asia"\n• "navigation agreements 1900-1950"\n• "agreements with downloadable documents"'
    },
    {
      title: 'Sidebar Interaction',
      content: 'Click agreement cards in the sidebar to focus the map and open the detail popup. Agreements with available documents show a "Download" button linking to the Oregon Digital archive.'
    },
    ...(isAdmin ? [{
      title: 'Data Upload',
      content: 'Upload your own CSV or JSON file from the "Upload Data" tab in Settings to replace the current dataset. The application auto-recognizes TFDD format and common alternative field names. For data without coordinates, locations are automatically derived from basin names.'
    }] : []),
    {
      title: 'Language Support',
      content: 'Toggle between Turkish and English using the TR/EN button in the top-right corner. The AI search engine understands queries in both languages.'
    },
  ];

  return (
    <div className="divide-y divide-slate-100">
      {sections.map((section, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenSection(openSection === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-800">{section.title}</span>
            {openSection === i
              ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
              : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
            }
          </button>
          {openSection === i && (
            <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── About Tab ──
function AboutTab({ lang }: { lang: string }) {
  return (
    <div className="p-5 space-y-5 text-xs text-slate-600 leading-relaxed">
      {/* Attribution Section */}
      <div>
        <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-400" />
          {lang === 'tr' ? 'Teşekkür & Kaynak' : 'Acknowledgment & Source'}
        </h3>

        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100 space-y-3">
          <p>
            {lang === 'tr'
              ? 'Bu portal, Oregon State Üniversitesi College of Earth, Ocean, and Atmospheric Sciences bünyesindeki Program in Water Conflict Management and Transformation tarafından derlenen ve sürdürülen International Freshwater Treaties Database (Uluslararası Tatlı Su Anlaşmaları Veritabanı) verileri kullanılarak oluşturulmuştur.'
              : 'This portal was built using data from the International Freshwater Treaties Database, compiled and maintained by the Program in Water Conflict Management and Transformation at Oregon State University\'s College of Earth, Ocean, and Atmospheric Sciences.'}
          </p>

          <p>
            {lang === 'tr'
              ? 'Veritabanı, 1820\'den günümüze kadar imzalanan 800\'den fazla uluslararası tatlı su anlaşmasının özetlerini ve/veya tam metinlerini içermektedir. Belgeler; ilgili havza ve ülkeler, imza tarihi, anlaşma konusu, tahsis önlemleri, uyuşmazlık çözüm mekanizmaları, su dışı bağlantılar ve daha birçok parametre ile kodlanmıştır.'
              : 'The database is a searchable collection of summaries and/or full text of more than 800 international freshwater-related agreements, covering the years 1820 to 2021. Documents are coded by basin and countries involved, date signed, treaty topic, allocation measures, conflict resolution mechanisms, non-water linkages, and many more parameters.'}
          </p>

          <p>
            {lang === 'tr'
              ? 'Toplanan anlaşmalar; su hakları, su tahsisi, su kirliliği, su ihtiyaçlarının hakkaniyetli karşılanması ilkeleri, hidroelektrik/baraj/taşkın kontrolü geliştirme ve çevresel konular ile nehir ekosistemlerinin haklarına ilişkin belgeleri kapsamaktadır.'
              : 'The agreements collected relate to water rights, water allocations, water pollution, principles for equitably addressing water needs, hydropower/reservoir/flood control development, and environmental issues and the rights of riverine ecological systems.'}
          </p>

          <a
            href="https://transboundarywaters.ceoas.oregonstate.edu/international-freshwater-treaties-database"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white rounded-md border border-blue-200 text-primary font-semibold hover:bg-blue-50 transition-colors"
          >
            {lang === 'tr' ? 'TFDD Veritabanını Ziyaret Et →' : 'Visit the TFDD Database →'}
          </a>
        </div>
      </div>

      {/* Additional Credits */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-2">
          {lang === 'tr' ? 'Ek Katkıda Bulunanlar' : 'Additional Contributors'}
        </h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {lang === 'tr'
            ? 'Veritabanının güncellenmesi ve sürdürülmesi, araştırmacıların katkılarıyla mümkün olmaktadır. OSU Valley Library ortaklığıyla anlaşma belgelerinin PDF\'lerine Oregon Digital üzerinden erişim sağlanmaktadır.'
            : 'The update and maintenance of this database is made possible through the contributions of fellow researchers. In partnership with the OSU Valley Library, PDFs of treaty documents are accessible through Oregon Digital.'}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
        <p className="text-[10px] text-amber-700 leading-relaxed">
          <span className="font-bold">{lang === 'tr' ? 'Sorumluluk Reddi: ' : 'Disclaimer: '}</span>
          {lang === 'tr'
            ? 'Veritabanında sunulan çeviriler yalnızca bilgilendirme ve akademik amaçlıdır. Resmi olmayan çevirilerdir ve resmi yasal kullanımlar için geçerli değildir.'
            : 'Translations provided within the database are for informational and academic purposes only. They are unofficial translations and are not valid for official legal uses.'}
        </p>
      </div>
    </div>
  );
}
