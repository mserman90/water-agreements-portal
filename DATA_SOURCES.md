# Metodoloji ve Veri Kaynakları Dokümantasyonu
### *Methodology, Data Corpora, and Hydro-Climatic Sources*

Bu doküman, **Sınır Aşan Su Anlaşmaları ve Hidro-İklimsel Analiz Portalı** bünyesinde entegre edilen veri setlerinin metodolojik temellerini, değişken tanımlarını, kodlama kurallarını, iklimsel hesaplama yöntemlerini ve akademik literatür kaynaklarını ayrıntılı olarak açıklamaktadır.

---

## 1. Transboundary Freshwater Dispute Database (TFDD)

### 1.1. Genel Bakış ve Tarihçe
**Transboundary Freshwater Dispute Database (TFDD)**, Oregon State Üniversitesi Coğrafya ve Yer Bilimleri Bölümü'nde Prof. Aaron T. Wolf liderliğindeki araştırma grubu tarafından geliştirilmiş, dünyadaki en kapsamlı sınır-aşan su anlaşmaları külliyatıdır.

- **Kapsam:** 1820'den günümüze kadar 280'den fazla uluslararası nehir havzasını kapsayan 3.000'i aşkın ikili ve çok taraflı anlaşma.
- **Dahil Edilme Kriterleri:**
  1. Anlaşmanın en az iki egemen devlet veya uluslararası tüzel kişilik arasında akdedilmiş olması.
  2. Anlaşma konusunun doğrudan veya dolaylı olarak tatlı su kaynakları (yüzeysel sular, yeraltı suları, sınır oluşturan veya sınırı kesen nehir ve göller) ile ilgili olması.
  3. Protokoller, ek sözleşmeler, komisyon kararları ve deklarasyonlar da bağımsız veya bağlı hukuki metinler olarak kaydedilmiştir.

### 1.2. Değişken Tanımları ve Kodlama Şeması

| Alan Adı | Tip | Açıklama ve Metodolojik Not |
| :--- | :--- | :--- |
| `id` | String | TFDD benzersiz protokol kimlik kodu. |
| `name` | String | Anlaşmanın resmi diplomatik başlığı (İngilizce orijinal + portal çevirisi). |
| `country` | String | Taraf ve imza sahibi devletler listesi (ISO uyumlu ülke adları). |
| `basin` | String | Uluslararası nehir veya göl havzasının hidrolojik adı (örn. *Danube, Nile, Indus, Euphrates-Tigris, Mekong, Colorado*). |
| `year` | Integer | Anlaşmanın imzalandığı (veya yürürlüğe girdiği) takvim yılı. |
| `purpose` | String | Anlaşmanın ana odak konusu (Tahsis, Seyrüsefer, Hidroelektrik, Kalite, Taşkın, vb.). |
| `latitude` / `longitude` | Float | Anlaşmanın odaklandığı nehir havzası veya ana hidrolik kontrol noktasının coğrafi koordinatları (WGS84). |

### 1.3. Amaç ve Konu Sınıflandırma Taksonomisi
TFDD veri setindeki amaç kodları, uluslararası su diplomasisindeki temel işlevlere göre sınıflandırılmıştır:
- **Su Miktarı ve Tahsisi (*Water Quantity / Allocation*):** Debinin yüzdesel veya hacimsel paylaşımı (örn. 1959 Mısır-Sudan Nil Anlaşması, 1960 İndus Antlaşması).
- **Hidroelektrik Enerji (*Hydropower / Joint Development*):** Ortak baraj ve enerji santrali projeleri (örn. 1973 Itaipu Anlaşması - Brezilya & Paraguay).
- **Su Kalitesi ve Kirlilik Kontrolü (*Water Quality / Pollution*):** Havza bazında arıtma ve deşarj standartları (örn. 1994 Tuna Nehri Koruma Sözleşmesi).
- **Seyrüsefer ve Ulaşım (*Navigation*):** Sınır-aşan su yollarında ticari gemi geçiş serbestisi (19. ve erken 20. yüzyıl anlaşmalarının ağırlıklı teması).
- **Taşkın ve Sel Yönetimi (*Flood Management / Early Warning*):** Hidrolojik veri paylaşımı ve taşkın kontrol barajları.
- **Sınır ve Toprak Düzenlemeleri (*Border & Territorial Delimitation*):** Nehir ekseninin (talweg veya medyan çizgi) sınır kabul edilmesi.

---

## 2. Basins at Risk (BAR) Olay Veri Seti ve Su Etkileşim Skalası

### 2.1. Metodolojik Çerçeve (Wolf, Yoffe & Giordano)
Basins at Risk (BAR) projesi, uluslararası su etkileşimlerinin sanılanın aksine "su savaşları" yerine ezici bir çoğunlukla diplomatik işbirliği ile sonuçlandığını ampirik olarak kanıtlayan öncü bir çalışmadır.

Etkileşimler, **-7** (tam askeri çatışma) ile **+7** (gönüllü birleşme / ortak egemenlik) arasında 15 dereceli bir cetvelde kodlanmıştır:

```
  ÇATIŞMA / UYUŞMAZLIK                              İŞBİRLİĞİ / BARIŞ
◄───────────────────────┼───────────────────────►
 -7   -5   -3   -1      0      +1   +3   +5   +7
```

### 2.2. BAR Skalası Detaylı Derecelendirme Rehberi

| Skor | Düzey Kategorisi | Tanım ve Olay Örneği |
| :---: | :--- | :--- |
| **+7** | Gönüllü Birleşme | İki veya daha fazla devletin su yönetimi ve toprak üzerinde ortak yönetim veya federasyon ilan etmesi. |
| **+6** | Kapsamlı Ortaklık Anlaşması | Ortak havza komisyonu kurulması, uluslararası bağlayıcı tahsis antlaşması imzalanması (örn. *1960 İndus Antlaşması*). |
| **+5** | Askeri/Stratejik Destek | Su altyapısı veya havza güvenliğine yönelik ortak güvenlik veya askeri protokol. |
| **+4** | Hukuki / Finansal Destek | Bir devletin diğerine su projeleri için doğrudan kredi, fon veya hibe sağlaması. |
| **+3** | Resmi İkili/Çok Taraflı Anlaşma | Teknik veya sınırlı kapsamlı ortak protokol imzalanması, ortak araştırma komitesi teşkili. |
| **+2** | Resmi Görüşme ve Ziyaretler | Üst düzey liderlerin veya heyetlerin su gündemiyle resmi temaslarda bulunması. |
| **+1** | Sözlü Destek & İletişim | Taraf devletlerden birinin ortak su yönetimine yönelik olumlu beyanatta bulunması. |
| **0** | Nötr Eylemler | Rutin teknik işlemler, siyasi bağlamı olmayan hidrolojik ölçümler. |
| **-1** | Sözlü Eleştiri / İtiraz | Karşı tarafın su politikalarına veya tek taraflı baraj projelerine diplomatik nota ile tepki gösterilmesi. |
| **-2** | Diplomatik Protesto & İlişkilerin Askıya Alınması | Büyükelçinin geri çağrılması, su müzakerelerinden çekilme kararı. |
| **-3** | İdari / Ekonomik Yaptırımlar | Su akışını tek taraflı kısma tehdidi, sınır kapılarının kapatılması. |
| **-4** | Hukuki Misilleme & Tehdit | Sınır güvenliğinin artırılması, askeri birliklerin havzaya kaydırılması, açık savaş tehdidi. |
| **-5** | Düşmanca / Paramiliter Eylemler | Su tesislerine yönelik sınır ötesi sabotaj, taciz ateşi, su kaynağının kasten kirletilmesi. |
| **-6** | Sınırlı Askeri Çatışma | Havza üzerinde zırhlı birliklerin çatışması, baraj şantiyelerinin bombalanması (örn. *1964–1966 Ürdün Nehri Saptırma Savaşı*). |
| **-7** | Resmi Savaş İlanı | Doğrudan su kontrolü sebebiyle tarafların topyekûn savaşa girmesi. |

---

## 3. ECMWF ERA5 Tarihsel Atmosferik Reanaliz Verisi

### 3.1. Reanaliz Teknolojisi ve Veri Kalitesi
**ERA5**, Avrupa Orta Vadeli Hava Tahminleri Merkezi (**ECMWF**) tarafından Copernicus İklim Değişikliği Servisi (C3S) kapsamında üretilen beşinci nesil küresel atmosferik reanalizdir.

- **Model Çözünürlüğü:** Yatayda ~31 km (0.25° × 0.25°), dikeyde 137 atmosferik katman.
- **Veri Asimilasyonu:** 4D-Var (Dört Boyutlu Değişimsel Asimilasyon) tekniği ile yer gözlemleri, uydular ve radyo sondalar birleştirilmiştir.
- **Portaldaki Zaman Aralığı:** 1940'tan bir önceki takvim yılının sonuna kadar yıllık agregasyon.

### 3.2. Türetilen İklim İndikatörleri ve Formülasyon

1. **Yıllık Sıcaklık Anomalisi ($\Delta T_y$):**
   $$\Delta T_y = T_y - \overline{T}_{1991-2020}$$
   Burada $T_y$, havza merkez koordinatındaki $y$ yılına ait ortalama 2 metre hava sıcaklığıdır. $\overline{T}_{1991-2020}$, Dünya Meteoroloji Örgütü (WMO) standart referans normalleri baz periyodudur.

2. **Yıllık Yağış Anomalisi ($\Delta P_y$):**
   $$\Delta P_y = P_y - \overline{P}_{1991-2020}$$
   Havzadaki yıllık toplam yağış miktarının (mm) referans periyottan sapmasını gösterir.

3. **Hidrometeorolojik Kuraklık / Stres İndisi ($D_y$):**
   Yağış noksanlığı ve potansiyel evapotranspirasyon dengesini esas alan normalize kuraklık yüzdesi:
   $$D_y = \max\left(0, \frac{\overline{P}_{1991-2020} - P_y}{\overline{P}_{1991-2020}}\right) \times 100$$
   Pozitif değerler kuraklık stresini, negatif veya sıfır değerler ise normal ve üzeri yağışlı koşulları ifade eder.

---

## 4. FAOLEX ve Birleşmiş Milletler Hukuk Arşivleri

### 4.1. UN FAO FAOLEX Entegrasyonu
FAO Legal Office tarafından işletilen **FAOLEX**, dünyanın en büyük çevre, su ve tarım hukuku veritabanıdır.
- Her anlaşma için FAOLEX LEX-FAOC kayıt kodları indekslenmiş; ulusal uygulama yasaları ve ikincil mevzuat bağlantıları ilişkilendirilmiştir.

### 4.2. Birincil PDF Belge Saklama Mimarisi
Akademik araştırmalarda en sık karşılaşılan problemlerden biri olan dış web sitelerindeki kırık linkler (*link rot / 404 hataları*), portala dahil edilen yerel arşiv sistemiyle çözülmüştür:
- Kritik anlaşmalar resmi BM Antlaşmalar Serisi (UNTS), FAOLEX ve ikili sınır komisyonlarından (IBWC, MRC) PDF formatında temin edilerek doğrudan `client/public/docs/` dizininde versiyonlanmıştır.
- Her anlaşma kartında sağlanan **📥 Depo PDF** butonu, bu birincil hukuki metinleri harici ağ bağlantısı kesintilerinden etkilenmeksizin doğrudan sunar.

---

## 5. Metodolojik Kısıtlar ve Dikkat Edilmesi Gereken Hususlar

Araştırmacıların veri analizlerinde göz önünde bulundurması gereken metodolojik kısıtlar şunlardır:

1. **Dil ve Arşivleme Yanlılığı (*Language Bias*):** TFDD külliyatı tarihi olarak İngilizce, Fransızca ve İspanyolca belgelere daha geniş yer vermiştir. Yerel dillerdeki bazı ikili protokoller tarihi arşivlerde eksik kalabilmektedir.
2. **Koordinat Merkezileştirme:** Çok geniş nehir havzalarında (örn. Amazon, Nil, Tuna) anlaşma koordinatı olarak ya ana havza çıkış noktası ya da anlaşmanın odaklandığı hidrolik altyapı (baraj, rezervuar) koordinatı seçilmiştir.
3. **BAR Skalası Ağırlıklandırması:** Olay verileri olay bazlıdır; uzun süreli yapısal gerginliklerin tamamını tek bir skora indirgemek yerine, dönemin kritik kırılma noktalarını simgelemektedir.

---

## 6. Temel Akademik Kaynakça / References

- **Allan, J. A.** (2002). *The Middle East Water Question: Hydropolitics and the Global Economy*. I.B. Tauris.
- **Dinar, A., Blankespoor, B., Dinar, S., & Kurukulasuriya, P.** (2019). *Water Scarcity, Conflict, and Cooperation: Analytical and Empirical Perspectives*. World Scientific.
- **Gleick, P. H.** (1993). Water and conflict: Fresh water resources and international security. *International Security*, 18(1), 79–112.
- **Hersbach, H., et al.** (2020). The ERA5 global reanalysis. *Quarterly Journal of the Royal Meteorological Society*, 146(730), 1999–2049.
- **McCaffrey, S. C.** (2019). *The Law of International Watercourses* (3rd ed.). Oxford University Press.
- **Salman, S. M.** (2007). The United Nations Watercourses Convention ten years later: Why has its entry into force proven difficult? *Water International*, 32(1), 1–15.
- **Wolf, A. T.** (1998). Conflict and cooperation along international waterways. *Water Policy*, 1(2), 251–265.
- **Wolf, A. T., Yoffe, S. B., & Giordano, M.** (2003). International waters: Identifying basins at risk. *Water Policy*, 5(1), 29–60.
- **Yoffe, S., Wolf, A. T., & Giordano, M.** (2003). Conflict and cooperation over international freshwater resources: Indicators of basins at risk. *Journal of the American Water Resources Association*, 39(5), 1109–1126.
- **Zeitoun, M., & Warner, J.** (2006). Hydro-hegemony: A framework for analysis of trans-boundary water conflicts. *Water Policy*, 8(5), 435–460.
