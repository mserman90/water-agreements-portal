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
