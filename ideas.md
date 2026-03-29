# Global Su Anlaşmaları Portalı - Tasarım Felsefesi

## Seçilen Tasarım Yaklaşımı: **Coğrafi Minimalizm**

Bu portal, uluslararası su anlaşmalarının karmaşık ağını erişilebilir ve görsel olarak çekici bir şekilde sunmak için tasarlanmıştır. Seçilen yaklaşım, **Coğrafi Minimalizm** felsefesini takip eder - harita merkezli, veri odaklı, ancak hiçbir zaman kütüphanesi hissettirmeyen bir arayüz.

### Tasarım Hareketi
**Coğrafi Minimalizm + Veri Humanizasyonu**: Harita tabanlı uygulamaların soyut doğasını insan ölçeğine indirgeyen, ancak bilimsel titizliği koruyan bir yaklaşım. Örnek: Google Earth Pro'nun profesyonelliği ile Figma'nın temizliği.

### Temel Prensipler
1. **Harita Egemenliği**: Harita ana içerik, yan panel ise seçim ve filtreleme aracı
2. **Hiyerarşik Netlik**: Anlaşmalar, ülkeler, havzalar arasında net hiyerarşi
3. **Veri Şeffaflığı**: Her bilgi parçası kolaylıkla erişilebilir, hiçbir şey gizli değil
4. **Sessiz Yardımcılık**: Arayüz, kullanıcının hedefine ulaşmasını destekler, dikkat çekmez

### Renk Felsefesi
- **Primer**: Okyanus Mavisi (`#0369A1`) - güven, bilim, su
- **Sekonder**: Kil Beige (`#A89968`) - toprak, coğrafya, stabilite
- **Aksent**: Yeşil-Turkuaz (`#14B8A6`) - anlaşma/aktivite, yaşam
- **Nötr**: Gri Spektrumu - profesyonellik, okunabilirlik
- **Uyarı**: Turuncu (`#EA580C`) - önemli bilgiler, durumlar

Renk mantığı: Su (mavi) + Toprak (beige) = Doğal kaynak yönetimi. Turkuaz ise uluslararası işbirliğinin sembolü.

### Düzen Paradigması
- **Asimetrik Sidebar + Harita**: Sol panel sabit, dinamik; harita sağda dominant
- **Kartlar Yerine Listeler**: Yan panelde kompakt, taranabilir liste formatı
- **Harita Markerları**: Kümeleme ile başlayan, yakınlaştıkça detaylaşan hiyerarşi
- **Modal Popuplar**: Harita üzerinde hafif, bilgi yoğun popuplar

### İmza Öğeleri
1. **Su Damlası İkonu**: Başlıkta marka kimliği
2. **Harita Marker Animasyonları**: Pulsating rings, smooth zoom transitions
3. **Durum İndikatörü**: Alt panelde canlı bağlantı durumu göstergesi (yeşil/turuncu/kırmızı)
4. **Arama Çubuğu**: Havza, ülke, ID'ye göre anlık filtreleme

### Etkileşim Felsefesi
- **Doğrudan Seçim**: Harita üzerinde tıkla → yan panelde vurgula → popup aç
- **Çift Yönlü Bağlantı**: Yan panelde kartı seç → harita markeri vurgula ve zoom
- **Yumuşak Geçişler**: Tüm animasyonlar 300ms, easing: cubic-bezier(0.4, 0, 0.2, 1)
- **Geri Bildirim**: Yükleme durumları, başarı/hata mesajları, durum göstergeleri

### Animasyon Yönergeleri
- **Giriş Animasyonları**: Yan panel slayt (300ms), harita fade-in (500ms)
- **Marker Animasyonları**: Cluster açılırken scatter effect, zoom smooth
- **Hover Efektleri**: Kartlar hafif yukarı kaymak (2px), shadow artış
- **Geçiş Animasyonları**: Arama sonuçları smooth scroll, liste güncellemeleri fade

### Tipografi Sistemi
- **Display**: Playfair Display (Bold) - başlıklar, ülke adları
- **Body**: Inter (Regular/Medium) - açıklamalar, veri
- **Monospace**: IBM Plex Mono - ID'ler, teknik bilgiler
- **Hiyerarşi**: 
  - H1: 32px Playfair Bold
  - H2: 24px Playfair SemiBold
  - Body: 14px Inter Regular
  - Small: 12px Inter Regular
  - Caption: 11px IBM Plex Mono

---

## Alternatif Fikirler (Seçilmedi)

### Fikir 2: Retro Kartografi (Olasılık: 0.08)
Vintage harita estetik, renkli sınırlar, eski kağıt dokusu. Çok dekoratif, veri okunabilirliğini azaltır.

### Fikir 3: Gelecekçi Hologram (Olasılık: 0.06)
Neon renkler, glassmorphism, 3D efektler. Çok oyuncu, bilimsel bir portal için uygunsuz.

---

## Uygulama Notları
- Tüm CSS değişkenleri `index.css` içinde tanımlanacak
- Tailwind utility-first yaklaşımı kullanılacak
- Leaflet harita özelleştirmeleri CSS ile yapılacak
- Firebase entegrasyonu arka planda çalışacak, UI'da görünmeyecek
