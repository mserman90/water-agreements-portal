export type Lang = 'tr' | 'en';

const translations = {
  // Header
  'app.title': { tr: 'Su Anlaşmaları Portalı', en: 'Water Agreements Portal' },
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
  'upload.title': { tr: 'Dosya Yükle', en: 'Upload File' },
  'upload.description': { tr: 'Haritaya görselleştirmek için kendi anlaşma verilerinizi yükleyin', en: 'Upload your own agreement data to visualize on the map' },
  'upload.formats': { tr: 'Desteklenen formatlar: GeoJSON, JSON', en: 'Supported formats: GeoJSON, JSON' },
  'upload.requirements.title': { tr: 'Gereksinimler:', en: 'Requirements:' },
  'upload.requirements.geometry': { tr: 'Geçerli GeoJSON geometrisi', en: 'Valid GeoJSON geometry' },
  'upload.requirements.properties': { tr: 'title ve year özellikleri', en: 'title and year properties' },
  'upload.requirements.encoding': { tr: 'UTF-8 kodlaması', en: 'UTF-8 encoding' },

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

  // Settings Panel
  'settings.title': { tr: 'Bilgi', en: 'Information' },
  'tabs.guide': { tr: 'Kullanım Kılavuzu', en: 'User Guide' },
  'tabs.upload': { tr: 'Yükle', en: 'Upload' },
  'tabs.about': { tr: 'Hakkında & Teşekkür', en: 'About & Thanks' },
  'tabs.login': { tr: 'Giriş', en: 'Login' },

  // Guide Section
  'guide.overview.title': { tr: 'Genel Bakış', en: 'Overview' },
  'guide.overview.content': { tr: 'Bu portal, 1820\'den günümüze kadar imzalanan 800\'den fazla uluslararası tatlı su anlaşmasının özetlerini ve/veya tam metinlerini içermektedir.', en: 'This portal contains summaries and/or full texts of over 800 international freshwater agreements signed from 1820 to present.' },

  'guide.search.title': { tr: 'Arama Özellikleri', en: 'Search Features' },
  'guide.search.content': { tr: 'Gelişmiş arama yetenekleri ile anlaşmaları kolayca bulun:', en: 'Find agreements easily with advanced search capabilities:' },
  'guide.search.features.semantic': { tr: 'Anlamsal arama - kavramsal eşleşmeler', en: 'Semantic search - conceptual matching' },
  'guide.search.features.multilingual': { tr: 'Çok dilli destek (Türkçe, İngilizce)', en: 'Multilingual support (Turkish, English)' },
  'guide.search.features.fuzzy': { tr: 'Bulanık eşleştirme - yazım hatalarına tolerans', en: 'Fuzzy matching - typo tolerance' },
  'guide.search.features.filters': { tr: 'Ülke, nehir, tür ve yıl filtreleri', en: 'Country, river, type, and year filters' },

  'guide.map.title': { tr: 'Harita Kullanımı', en: 'Map Usage' },
  'guide.map.content': { tr: 'İnteraktif harita üzerinde anlaşmaları keşfedin:', en: 'Explore agreements on the interactive map:' },
  'guide.map.features.interactive': { tr: 'Yakınlaştırma, kaydırma ve gezinme', en: 'Zoom, pan, and navigate' },
  'guide.map.features.visual': { tr: 'Anlaşma yoğunluğunun görsel gösterimi', en: 'Visual representation of agreement density' },
  'guide.map.features.details': { tr: 'Detaylar için işaretçilere tıklayın', en: 'Click markers for details' },
  'guide.map.features.zoom': { tr: 'Harita kontrolleri ile zoom', en: 'Zoom with map controls' },

  'guide.filters.title': { tr: 'Filtreleme', en: 'Filtering' },
  'guide.filters.content': { tr: 'Sonuçları daraltmak için filtreleri kullanın:', en: 'Use filters to narrow down results:' },
  'guide.filters.features.country': { tr: 'Ülkeye göre filtrele', en: 'Filter by country' },
  'guide.filters.features.river': { tr: 'Nehir havzasına göre', en: 'By river basin' },
  'guide.filters.features.type': { tr: 'Anlaşma türüne göre', en: 'By agreement type' },
  'guide.filters.features.year': { tr: 'Yıl aralığına göre', en: 'By year range' },

  'guide.details.title': { tr: 'Anlaşma Detayları', en: 'Agreement Details' },
  'guide.details.content': { tr: 'Her anlaşma için başlık, taraf ülkeler, yıl ve belge indirme bağlantılarını görüntüleyin.', en: 'View title, party countries, year, and document download links for each agreement.' },

  'guide.tips.title': { tr: 'İpuçları', en: 'Tips' },
  'guide.tips.items.combine': { tr: 'Daha iyi sonuçlar için arama ve filtreleri birleştirin', en: 'Combine search and filters for better results' },
  'guide.tips.items.language': { tr: 'Dil değiştirmek için üst sağdaki düğmeyi kullanın', en: 'Use the top-right button to switch languages' },
  'guide.tips.items.hover': { tr: 'Hızlı önizleme için kartların üzerine gelin', en: 'Hover over cards for quick preview' },
  'guide.tips.items.reset': { tr: 'Tüm filtreleri temizlemek için yenile düğmesini kullanın', en: 'Use refresh button to clear all filters' },

  // About Section
  'about.title': { tr: 'Su Anlaşmaları Portalı Hakkında', en: 'About Water Agreements Portal' },
  'about.description': { tr: 'Bu portal, sınır aşan su kaynaklarının yönetimi konusunda küresel bir bakış açısı sunmak amacıyla geliştirilmiştir.', en: 'This portal was developed to provide a global perspective on transboundary water resources management.' },
  'about.madeWith': { tr: 'Sevgiyle yapıldı', en: 'Made with love' },

  // Legal Section
  'about.legal.title': { tr: 'Hukuki Beyanlar', en: 'Legal Disclaimers' },
  'about.legal.disclaimer.title': { tr: 'Sorumluluk Reddi', en: 'Disclaimer' },
  'about.legal.disclaimer.content': { tr: 'Bu portal yalnızca bilgilendirme amaçlıdır. Herhangi bir hukuki tavsiye veya resmi belge niteliği taşımaz.', en: 'This portal is for informational purposes only. It does not constitute legal advice or official documentation.' },
  'about.legal.dataAccuracy.title': { tr: 'Veri Doğruluğu', en: 'Data Accuracy' },
  'about.legal.dataAccuracy.content': { tr: 'Verilerin doğruluğunu sağlamak için çaba gösterilmiş olsa da, hata veya eksiklikler olabilir. Resmi kaynaklardan teyit edilmesi önerilir.', en: 'While efforts have been made to ensure data accuracy, there may be errors or omissions. Verification from official sources is recommended.' },
  'about.legal.noLiability.title': { tr: 'Sorumluluk', en: 'Liability' },
  'about.legal.noLiability.content': { tr: 'Bu portalın kullanımından kaynaklanan herhangi bir zarar veya kayıptan sorumluluk kabul edilmez.', en: 'No liability is accepted for any damage or loss resulting from the use of this portal.' },
  'about.legal.privacy.title': { tr: 'Gizlilik', en: 'Privacy' },
  'about.legal.privacy.content': { tr: 'Bu portal kullanıcı verilerini toplamaz veya saklamaz. Tüm işlemler tarayıcınızda yerel olarak gerçekleştirilir.', en: 'This portal does not collect or store user data. All operations are performed locally in your browser.' },
  'about.legal.intellectual.title': { tr: 'Fikri Mülkiyet', en: 'Intellectual Property' },
  'about.legal.intellectual.content': { tr: 'Anlaşma verileri Oregon State University TFDD kaynaklıdır. Kaynak gösterilerek kullanılabilir.', en: 'Agreement data is sourced from Oregon State University TFDD. May be used with attribution.' },
  'about.legal.changes.title': { tr: 'Değişiklikler', en: 'Changes' },
  'about.legal.changes.content': { tr: 'Bu beyanlar önceden haber verilmeksizin güncellenebilir. Düzenli olarak kontrol edilmesi önerilir.', en: 'These disclaimers may be updated without prior notice. Regular review is recommended.' },

  // Map popup
  'popup.viewDetails': { tr: 'Detayları Görüntüle', en: 'View Details' },
  'popup.countries': { tr: 'Ülkeler', en: 'Countries' },
  'popup.year': { tr: 'Yıl', en: 'Year' },
  'popup.basin': { tr: 'Havza', en: 'Basin' },
  'popup.type': { tr: 'Tür', en: 'Type' },
};

export default translations;
