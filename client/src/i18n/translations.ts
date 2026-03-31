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
  'search.smartPlaceholder': { tr: "Örn: Türkiye'nin Fırat anlaşmaları, Afrika sel yönetimi, 20. yüzyıl...", en: 'E.g.: Turkey Euphrates treaties, African flood mgmt, 20th century...' },
  'search.resultCount': { tr: '{count} sonuç bulundu', en: '{count} results found' },
  'search.understood': { tr: 'Anlaşılan:', en: 'Understood:' },
  'search.mode.simple': { tr: 'Basit', en: 'Simple' },
  'search.mode.ai': { tr: 'AI', en: 'AI' },

  // Overpass water infrastructure layer
  'layer.waterInfra': { tr: 'Su Altyapıları', en: 'Water Infrastructure' },
  'layer.loading': { tr: 'Su altyapıları yükleniyor...', en: 'Loading water infrastructure...' },
  'layer.zoomIn': { tr: 'Su altyapılarını görmek için yakınlaştırın (zoom ≥7)', en: 'Zoom in to see water infrastructure (zoom ≥7)' },
  'layer.dam': { tr: 'Baraj', en: 'Dam' },
  'layer.weir': { tr: 'Savak', en: 'Weir' },
  'layer.waterTower': { tr: 'Su Kulesi', en: 'Water Tower' },
  'layer.waterWell': { tr: 'Su Kuyusu', en: 'Water Well' },
  'layer.waterworks': { tr: 'Su Arıtma / İşletme', en: 'Waterworks' },
  'layer.reservoir': { tr: 'Rezervuar / Baraj Gölü', en: 'Reservoir' },
  'layer.canal': { tr: 'Kanal', en: 'Canal' },
  'layer.waterway': { tr: 'Su Yolu', en: 'Waterway' },
  'layer.pump': { tr: 'Pompa İstasyonu', en: 'Pump Station' },
  'layer.pumpingStation': { tr: 'Pompa İstasyonu', en: 'Pumping Station' },
  'layer.waterTreatment': { tr: 'Su Arıtma Tesisi', en: 'Water Treatment Plant' },
  'layer.waterGate': { tr: 'Su Kapısı / Savak', en: 'Water Gate / Sluice' },
  'layer.irrigationChannel': { tr: 'Sulama Kanalı', en: 'Irrigation Channel' },
  'layer.spring': { tr: 'Kaynak / Pınar', en: 'Spring' },
  'layer.wetland': { tr: 'Sulak Alan', en: 'Wetland' },
  'layer.gauging': { tr: 'Akım Ölçüm İstasyonu', en: 'Gauging Station' },
  'layer.waterfall': { tr: 'Şelale', en: 'Waterfall' },
  'layer.lock': { tr: 'Gemi Kilidi', en: 'Lock (Navigation)' },
  'layer.results': { tr: '{count} su altyapısı bulundu', en: '{count} water features found' },
  'layer.filterTitle': { tr: 'Katman Filtreleri', en: 'Layer Filters' },
  'layer.showAll': { tr: 'Tümünü Göster', en: 'Show All' },
  'layer.hideAll': { tr: 'Tümünü Gizle', en: 'Hide All' },
  'layer.exportGeoJSON': { tr: 'GeoJSON İndir', en: 'Export GeoJSON' },
  'layer.exportCSV': { tr: 'CSV İndir', en: 'Export CSV' },
  'layer.osmId': { tr: 'OSM ID', en: 'OSM ID' },
  'layer.osmType': { tr: 'OSM Türü', en: 'OSM Type' },
  'layer.viewOnOSM': { tr: 'OSM\'de Görüntüle', en: 'View on OSM' },
  'layer.tags': { tr: 'Özellikler', en: 'Tags' },
  'layer.name': { tr: 'Ad', en: 'Name' },
  'layer.type': { tr: 'Tür', en: 'Type' },
  'layer.noName': { tr: 'İsimsiz', en: 'Unnamed' },
  'layer.featureInfo': { tr: 'Altyapı Bilgisi', en: 'Feature Info' },
  'layer.operator': { tr: 'İşletmeci', en: 'Operator' },
  'layer.capacity': { tr: 'Kapasite', en: 'Capacity' },
  'layer.height': { tr: 'Yükseklik', en: 'Height' },
  'layer.length': { tr: 'Uzunluk', en: 'Length' },
  'layer.width': { tr: 'Genişlik', en: 'Width' },
  'layer.depth': { tr: 'Derinlik', en: 'Depth' },
  'layer.maxdepth': { tr: 'Maks. Derinlik', en: 'Max Depth' },
  'layer.volume': { tr: 'Hacim', en: 'Volume' },
  'layer.start_date': { tr: 'İnşaat Tarihi', en: 'Construction Date' },
  'layer.wikipedia': { tr: 'Wikipedia', en: 'Wikipedia' },
  'layer.website': { tr: 'Web Sitesi', en: 'Website' },
  'layer.attribution': { tr: 'Kaynak: OpenStreetMap katkıcıları (ODbL)', en: 'Source: OpenStreetMap contributors (ODbL)' },

  // Precipitation & Flood
  'layer.precipitation': { tr: 'Yağış', en: 'Precipitation' },
  'layer.flood': { tr: 'Taşkın / Debi', en: 'Flood / Discharge' },
  'layer.precipLoading': { tr: 'Yağış verileri yükleniyor...', en: 'Loading precipitation data...' },
  'layer.floodLoading': { tr: 'Taşkın verileri yükleniyor...', en: 'Loading flood data...' },
  'layer.precipResults': { tr: '{count} noktada yağış verisi', en: '{count} precipitation points' },
  'layer.floodResults': { tr: '{count} noktada debi verisi', en: '{count} discharge points' },
  'layer.dataSource': { tr: 'Kaynak: Open-Meteo (GloFAS)', en: 'Source: Open-Meteo (GloFAS)' },
  'layer.conflicts': { tr: 'Çatışma / İşbirliği', en: 'Conflict / Cooperation' },
  'layer.conflictsLoading': { tr: 'Su çatışma verileri yükleniyor...', en: 'Loading water conflict data...' },
  'layer.conflictsResults': { tr: '{count} tarihi olay', en: '{count} historical events' },
  'layer.barScale': { tr: 'BAR Skalası', en: 'BAR Scale' },
  'layer.conflictSrc': { tr: 'Kaynak: Pacific Institute, TFDD', en: 'Source: Pacific Institute, TFDD' },

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
