export type Lang = 'tr' | 'en';

const translations = {
  // Header
  'app.title': { tr: 'Global Su Anlaşmaları Portalı', en: 'Global Water Agreements Portal' },
  'app.recordsMapped': { tr: 'Kayıt Haritalandı', en: 'Records Mapped' },

  // Sidebar search
  'search.placeholder': { tr: 'Havza, Ülke veya ID Ara...', en: 'Search Basin, Country or ID...' },

  // Sidebar states
  'sidebar.loading': { tr: 'Veriler Yükleniyor...', en: 'Loading Data...' },
  'sidebar.noResults': { tr: 'Sonuç Bulunamadı', en: 'No Results Found' },
  'sidebar.noData': { tr: 'Henüz veri yüklenmedi. CSV veya JSON dosyası yükleyin.', en: 'No data loaded yet. Upload a CSV or JSON file.' },
  'sidebar.tryAgain': { tr: 'Arama kriterlerinizi değiştirmeyi deneyin.', en: 'Try changing your search criteria.' },

  // Sidebar card
  'card.year': { tr: 'Yıl', en: 'Year' },
  'card.download': { tr: 'İndir', en: 'Download' },

  // Upload
  'upload.button': { tr: 'CSV / JSON Yükle', en: 'Upload CSV / JSON' },

  // Status footer
  'footer.connected': { tr: 'BAĞLANDI', en: 'CONNECTED' },
  'footer.mapped': { tr: 'anlaşma haritalandı', en: 'agreements mapped' },
  'footer.attribution': {
    tr: 'Veriler, {link} International Freshwater Treaties Database kaynağından sağlanmıştır.',
    en: 'Data sourced from {link} International Freshwater Treaties Database.',
  },
  'footer.osu': {
    tr: 'Oregon State University – College of Earth, Ocean, and Atmospheric Sciences',
    en: 'Oregon State University – College of Earth, Ocean, and Atmospheric Sciences',
  },

  // Map popup
  'popup.download': { tr: 'Belgeyi İndir', en: 'Download Document' },
  'popup.year': { tr: 'Yıl', en: 'Year' },

  // Toast messages
  'toast.loaded': { tr: '{count} anlaşma başarıyla yüklendi.', en: '{count} agreements loaded successfully.' },
  'toast.jsonEmpty': { tr: 'JSON dosyasında geçerli veri bulunamadı.', en: 'No valid data found in JSON file.' },
  'toast.jsonError': { tr: 'JSON dosyası geçersiz veya okunamıyor.', en: 'JSON file is invalid or unreadable.' },
  'toast.jsonReadError': { tr: 'JSON dosyası okunamadı.', en: 'Could not read JSON file.' },
  'toast.csvEmpty': { tr: 'CSV dosyasında geçerli veri bulunamadı.', en: 'No valid data found in CSV file.' },
  'toast.csvError': { tr: 'CSV dosyası işlenirken hata oluştu.', en: 'Error processing CSV file.' },
  'toast.csvReadError': { tr: 'CSV dosyası okunamadı.', en: 'Could not read CSV file.' },

  // Smart search
  'search.smart': { tr: 'AI Arama', en: 'AI Search' },
  'search.smartPlaceholder': { tr: 'Örn: Nil havzasında 1960 sonrası anlaşmalar...', en: 'E.g.: Nile basin agreements after 1960...' },
  'search.resultCount': { tr: '{count} sonuç bulundu', en: '{count} results found' },
  'search.understood': { tr: 'Anlaşılan:', en: 'Understood:' },
  'search.mode.simple': { tr: 'Basit', en: 'Simple' },
  'search.mode.ai': { tr: 'AI', en: 'AI' },

  // Overpass water infrastructure layer
  'layer.waterInfra': { tr: 'Su Altyapıları', en: 'Water Infrastructure' },
  'layer.loading': { tr: 'Su altyapıları yükleniyor...', en: 'Loading water infrastructure...' },
  'layer.zoomIn': { tr: 'Su altyapılarını görmek için yakınlaştırın (zoom ≥10)', en: 'Zoom in to see water infrastructure (zoom ≥10)' },
  'layer.dam': { tr: 'Baraj', en: 'Dam' },
  'layer.weir': { tr: 'Savık', en: 'Weir' },
  'layer.waterTower': { tr: 'Su Kulesi', en: 'Water Tower' },
  'layer.waterWell': { tr: 'Su Kuyusu', en: 'Water Well' },
  'layer.waterworks': { tr: 'Su Arıtma Tesisi', en: 'Waterworks' },
  'layer.reservoir': { tr: 'Baraj Gölü / Rezervuar', en: 'Reservoir' },
  'layer.canal': { tr: 'Kanal', en: 'Canal' },
  'layer.waterway': { tr: 'Su Yolu', en: 'Waterway' },
  'layer.results': { tr: '{count} su altyapısı bulundu', en: '{count} water features found' },

  // Auth
  'auth.loginTitle': { tr: 'Yönetici Girişi', en: 'Admin Login' },
  'auth.tokenPlaceholder': { tr: 'GitHub Personal Access Token', en: 'GitHub Personal Access Token' },
  'auth.loginButton': { tr: 'Giriş Yap', en: 'Sign In' },
  'auth.logoutButton': { tr: 'Çıkış Yap', en: 'Sign Out' },
  'auth.loginDesc': { tr: 'Veri yüklemek için GitHub hesabınızla giriş yapın.', en: 'Sign in with your GitHub account to upload data.' },
  'auth.failed': { tr: 'Giriş başarısız. Yalnızca yetkili kullanıcı giriş yapabilir.', en: 'Login failed. Only the authorized user can sign in.' },
  'auth.loggedAs': { tr: 'Giriş yapıldı:', en: 'Logged in as:' },

  // NotFound
  'notFound.title': { tr: 'Sayfa Bulunamadı', en: 'Page Not Found' },
  'notFound.description': { tr: 'Aradığınız sayfa mevcut değil. Taşınmış veya silinmiş olabilir.', en: "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted." },
  'notFound.goHome': { tr: 'Ana Sayfaya Dön', en: 'Go Home' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang, params?: Record<string, string | number>): string {
  const entry = translations[key];
  let text = entry?.[lang] ?? entry?.['tr'] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export default translations;
