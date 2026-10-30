# Metodoloji ve Veri Kaynakları Dokümantasyonu
### *Methodology, Data Corpora, and Hydro-Climatic Sources*

Bu doküman, **Sınır Aşan Su Anlaşmaları ve Hidro-İklimsel Analiz Portalı** bünyesinde entegre edilen veri setlerinin metodolojik temellerini, değişken tanımlarını, kodlama kurallarını, iklimsel hesaplama yöntemlerini ve akademik literatür kaynaklarını ayrıntılı olarak açıklamaktadır.

---

## 1. Transboundary Freshwater Dispute Database (TFDD)

### 1.1. Genel Bakış ve Tarihçe
**Transboundary Freshwater Dispute Database (TFDD)**, Oregon State Üniversitesi Coğrafya ve Yer Bilimleri Bölümü'nde Prof. Aaron T. Wolf liderliğindeki araştırma grubu tarafından geliştirilmiş, dünyadaki en kapsamlı sınır-aşan su anlaşmaları külliyatıdır.

- **Kapsam:** 1820'den 2026 yılına kadar 280'den fazla uluslararası nehir havzasını kapsayan 3.059 ikili ve çok taraflı anlaşma (2024–2026 modern anlaşmaları ve protokolleri dahil).
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

### 1.4. OSU TFDD Orijinal Master Excel Veritabanı (`WebsiteTreatiesDB_20181124.xlsx`)
Oregon State University (OSU) Transboundary Freshwater Dispute Database projesinin resmi ham Excel master veritabanı doğrudan yerel depomuza indirilmiş, portal veri tabanımızla birleştirilmiş ve araştırmacıların doğrudan indirmesine açılmıştır:

- **Dosya Adı:** `WebsiteTreatiesDB_20181124.xlsx` (1.182.567 bayt / ~1.18 MB)
- **Doğrudan Yerel İndirme:** [client/public/data/WebsiteTreatiesDB_20181124.xlsx](client/public/data/WebsiteTreatiesDB_20181124.xlsx)
- **Orijinal OSU Kaynak URL:** `https://transboundarywaters.science.oregonstate.edu/sites/transboundarywaters.ceoas.oregonstate.edu/files/Database/Data/Treaty/WebsiteTreatiesDB_20181124.xlsx`
- **Kayıt ve Boyut:** 2.118 satır × 115 kodlanmış değişken sütunu.

#### 1.4.1. 115 Kolonluk Kodlama Mimarisi ve Temel Değişken Grupları
OSU master veritabanı, her anlaşmayı uluslararası hidro-diplomasinin 115 analitik parametresine göre etiketlemiştir:
1. **Havza & Coğrafi Tanımlayıcılar:** `BCCODE` (Basin Country Code), `BCODE` (Basin Numeric Code), `Basin Name`, `Treaty Basin(s)`, `CCODE`, `Country_Name`, `Signatories` (Tüm imza sahibi ülkeler), `LocationSigned` (Anlaşmanın imzalandığı şehir/başkent).
2. **Kurumsal Yapı ve Havza Komisyonları:** `RBO` (Nehir Havzası Örgütü varlığı, 0/1), `CommName` (Ortak nehir havzası komisyonunun resmi diplomatik adı, örn. *International Boundary and Water Commission, Mekong River Commission, Permanent Indus Commission*).
3. **Su Tahsis Mekanizmaları:** `Allocation` (0/1), `Alloc_Text` (Debi payı, kota veya yüzdelik tahsis metninin detaylı alıntısı).
4. **Sektörel ve Çevresel Hükümler:** `Hydropower` (0/1), `Groundwater` (Yeraltı suları/akifer hükümleri, 0/1), `Environment` (Çevresel akış ve ekosistem koruma hükümleri, 0/1).
5. **Yönetişim, İzleme ve Uyuşmazlık Çözümü:** `Monitoring` (Ortak hidrolojik ölçüm ve veri paylaşımı, 0/1), `Conflict Resolution Mechanism` (Tahkim, arabuluculuk veya uluslararası yargı maddeleri, 0/1).

#### 1.4.2. Portala Entegrasyon ve Zenginleştirme
Portalımızdaki 3.059 anlaşmalık külliyatta:
- 2.147 anlaşma kaydı bu 115 kolonluk master Excel tablosundaki kodlamalarla (`signatories`, `locationSigned`, `bcode`, `commName`, `alloc`, `allocText`, `hydro`, `groundwater`, `enviro`, `monitoring`, `conflictRes`, `rbo`) birebir zenginleştirilmiştir.
- Geriye kalan modern anlaşmalar (2007 sonrası, 2024–2026 Nil CFA, Aral Restorasyonu, IBWC Dakika 330/331/332 vb.) portal derlemesiyle güncellenmiş ve haritada/kenar panelde aynı standartta sunulmaktadır.
- Kullanıcılar sol paneldeki **"📊 OSU TFDD Master Excel (115 Kolon)"** butonuyla orijinal 1.18 MB .xlsx dosyasını tek tıkla indirebilmektedir.

---

### 1.5. OSU TFDD Resmi Kodlama Kılavuzu (`WebsiteTreatyCodeBook_20180312.pdf`)
Oregon State University TFDD araştırma grubu, International Water Management Institute (IWMI) ve Dünya Bankası (World Bank) ortaklığıyla hazırlanan 16 sayfalık resmi metodolojik el kitabı doğrudan depolanmıştır:

- **Dosya Adı:** `WebsiteTreatyCodeBook_20180312.pdf` (195.735 bayt / ~196 KB, 16 Sayfa)
- **Doğrudan Yerel İndirme:** [client/public/docs/WebsiteTreatyCodeBook_20180312.pdf](client/public/docs/WebsiteTreatyCodeBook_20180312.pdf)
- **Orijinal OSU Kaynak URL:** `https://transboundarywaters.science.oregonstate.edu/sites/transboundarywaters.ceoas.oregonstate.edu/files/Database/Data/Treaty/WebsiteTreatyCodeBook_20180312.pdf`
- **Kapsam:** 1820–2007 (ve 2016–2018 güncellemeleri) TFDD anlaşma metinlerinin kodlama kuralları ve taksonomik sözlüğü.

#### 1.5.1. Kodlama Kılavuzu Taksonomisi ve Analitik Bölümleri
Kılavuz, 115 değişkeni aşağıdaki metodolojik bloklarda tanımlar:
1. **Mekânsal ve Havza Tanımlayıcıları (A–X):** `Entry ID`, `BCCODE` (Basin Country Code), `BCODE`, `Basin Name`, `CCODE`, `Country_name`, `DateSigned`, `Signatories`, `Location Signed`, `Primary Country Sub-Region`, `Treaty Basin(s)`, `TFDD Basin(s)`.
2. **Hukuki Niteliği ve Belge Formatı (Y–EE):** `Number of Parties`, `Minor Agreement (Y/N)`, `Reference to Precedence`, `Agreement Purpose`, `Geographic Scope (GeoScope)`, `Issue Area`.
3. **Kurumsal Mimari (FF–GG):** `RBO (River Basin Organization Y/N)`, `Infrastructure (Y/N)`.
4. **Su Tahsisi ve Kullanım Rejimi (HH–JJ):** `Allocation (Numerical)`, `Alloc_Article`, `Alloc_Text` (Tahsis metinlerinin doğrudan alıntıları).
5. **Sektörel ve Çevresel Boyutlar (KK–XX):**
   - `Hydropower` (KK, LL, MM)
   - `Irrigation` (NN, OO)
   - `Groundwater` (PP, QQ)
   - `Environment` (RR, SS)
   - `Equity or Sustainability` (TT, UU, VV)
   - `Local Needs` (WW, XX)
6. **Mühendislik ve İnşa Kısıtlamaları (YY–BBB):**
   - `Right to Construct` (YY, ZZ)
   - `Ban on Particular Constructions` (AAA, BBB)
   - `Prior Notification Before New Water Needs are Realized` (CCC, DDD)
7. **Geleneksel Kullanım ve Sınır Rejimi (EEE–LLL):**
   - `Navigation` (EEE, FFF)
   - `Fishing` (GGG, HHH)
   - `Border Issues` (III, JJJ)
   - `Territorial Issues` (KKK, LLL)
8. **Su Dışı Bağlantılar ve Entegre Bağlam (MMM–PPP):**
   - `Non-Water Linkages` (Ticaret, sınır düzenlemesi, enerji, askeri destek takası)
   - `Embedded in a larger Non-Water Context`
9. **Belirsizlik ve Hidro-İklimsel Değişkenlik Yönetimi (QQQ–ZZZ):**
   - `Uncertainty Explicit`
   - `Variability Management (VarMgmt)`
   - `Variability in Water/Hydro needs`
   - `Alternative Scenarios`
   - `Prediction Modeling`
10. **Bilgi Paylaşımı, İzleme ve Uyuşmazlık Çözümü (HHHH–JJJJ):**
    - `Information Exchange`
    - `Monitoring (Y/N)`
    - `Conflict Resolution Mechanism` (1: Commission, 2: Diplomatic Channels, 3: Arbitration, 4: Third Party Involvement, vb.)
11. **Tazminat, İç Hukuk Uyumu ve Emsal Hükümleri (RRRR–FFFFF):**
    - `Compensation (Y/N)`
    - `National Programs or Laws (Y/N)`
    - `Interests of Non-Signatory Riparians (Y/N)`
    - `Amendment Mechanism`
    - `Precedent (Establishes / Not Establishes)`
    - `Enforcement Provisions`

---

### 1.6. OSU TFDD Mekânsal Havza Poligonları ve RBO Veritabanı (`hannahkfriedrich/tfdd`)
Oregon State University (OSU) Coğrafya Bölümü araştırmacılarından Hannah K. Friedrich, Giovanni Svevo ve Alex Walters tarafından geliştirilen açık kaynaklı mekânsal TFDD reposu ([github.com/hannahkfriedrich/tfdd](https://github.com/hannahkfriedrich/tfdd)) bünyesindeki resmi jeo-uzamsal katmanlar ve Nehir Havzası Örgütleri (RBO) veri tabanı doğrudan portala entegre edilmiştir:

#### 1.6.1. 310 Uluslararası Nehir Havzası Sınırları (`Basin310_Master_20180511.geojson`)
- **Dosya Boyutu:** 1.365.382 bayt (~1,36 MB GeoJSON)
- **Doğrudan Yerel İndirme:** [client/public/data/Basin310_Master_20180511.geojson](client/public/data/Basin310_Master_20180511.geojson)
- **Mekânsal Kapsam:** Dünya üzerindeki tüm 310 uluslararası sınır-aşan nehir havzasının tam poligon geometrileri (WGS84).
- **Öznitelikler:**
  - `BCODE`: Uluslararası 4 harfli havza kodu (örn. `AMZN`, `NILE`, `INDL`, `DANU`, `EUPH`).
  - `Basin_Name`: Havzanın tam adı.
  - `Area_km2`: Havza drenaj alanı yüzölçümü ($km^2$).
  - `Pop_2007`, `Pop_2015`, `Pop_2020`: Yıllara göre havzadaki toplam nüfus ve nüfus yoğunluğu.
  - `Dams_Exist` / `Dam_Plnd`: Havzadaki mevcut baraj ve inşaatı planlanan baraj sayıları.
  - `HydroPolTe`: Havza bazındaki hidropolitik gerilim skoru (0 ila 5 skalası).
- **Harita Entegrasyonu:** Portalın sağ üst katman kontrol panelindeki **"🌊 Nehir Havzaları (310 Havza)"** katmanı açıldığında, 310 uluslararası havzanın tamamı harita üzerinde yarı saydam poligonlar olarak çizilir. Üzerine gelindiğinde poligon vurgulanır; tıklandığında alan, nüfus, mevcut baraj ve hidropolitik gerilim verileri popup olarak açılır.

#### 1.6.2. River Basin Organizations (RBO) Veritabanı (`TFDD_RBODatabase_20131015.xlsx`)
- **Dosya Boyutu:** 245.720 bayt (~246 KB Excel / 925 KB CSV)
- **Doğrudan Yerel İndirme:** [client/public/data/TFDD_RBODatabase_20131015.xlsx](client/public/data/TFDD_RBODatabase_20131015.xlsx)
- **Kapsam:** Dünya genelindeki 270'ten fazla Nehir Havzası Örgütü'nün (RBO) 77 analitik değişkene göre kodlanmış kurumsal yapısı:
  - `RBO_NAME`: Havza komisyonu veya örgütünün resmi diplomasi adı.
  - `AGREEMENT_NAME` ve `AGREEMENT_DATE`: Örgütü kuran kurucu antlaşma ve imza yılı.
  - `MEMB_NAMES` ve `MEMB_NO`: Üye devletlerin listesi ve sayısı.
  - `LATERALITY` (İkili veya Çok Taraflı) ve `INCLUSIVENESS` (Tüm kıyıdaşları kapsama oranı).

---

### 1.7. UNEP, FAO & OSU Ortak Yayını: Uluslararası Tatlı Su Anlaşmaları Atlası (*Atlas of International Freshwater Agreements*)
Birleşmiş Milletler Çevre Programı (**UNEP**), Birleşmiş Milletler Gıda ve Tarım Örgütü (**FAO**) ve Oregon State Üniversitesi (**OSU TFDD**) işbirliğiyle yayımlanan bu başvuru eseri, modern sınır-aşan su diplomasisinin ve TFDD veri tabanının kurumsal ve kartografik omurgasını oluşturmaktadır:

- **Eser Adı:** *Atlas of International Freshwater Agreements*
- **Yazarlar & Direktör:** Prof. Aaron T. Wolf (Direktör), Dr. Meredith A. Giordano (OSU)
- **Sunuş & Önsöz:** Klaus Töpfer (UNEP İcra Direktörü), Stefano Burchi (FAO Hukuk Kıdemli Yetkilisi)
- **ISBN:** 92 807 2232 8 | **Yayın Yılı:** 2002 | **Sayfa:** 192 Sayfa
- **Resmi Dijital Arşiv (PDF - 75 MB):** [AtlasFreshwaterAgreements.pdf (OSU)](https://transboundarywaters.science.oregonstate.edu/sites/transboundarywaters.ceoas.oregonstate.edu/files/2023-08/AtlasFreshwaterAgreements.pdf)

#### 1.7.1. Atlas'ın Kuramsal Tezi: "Su Savaşları Değil, Su İşbirliği"
Klaus Töpfer ve Stefano Burchi'nin önsözlerinde ve Aaron Wolf ile Meredith Giordano'nun analizlerinde vurgulandığı üzere, medyadaki yaygın "su savaşları" (*water wars*) söyleminin aksine, insanlık tarihi ampirik olarak suyun bir savaş nedeni olmaktan ziyade **kurumsal diplomasi ve işbirliğinin katalizörü** olduğunu kanıtlamaktadır. 1820'lerden bu yana akdedilen yüzlerce sınır-aşan antlaşma, nehir havzası örgütü ve ortak komisyon bu tezin birincil kanıtıdır.

#### 1.7.2. 10 Tematik Mekânsal İndikatör Haritası
Atlas, sınır-aşan nehir havzalarını salt hukuki metinlerle değil, havza ölçeğinde 10 temel sosyo-ekonomik ve hidro-iklimsel göstergeyle görselleştirmiştir:
1. **Havza Başına Anlaşma Sayısı (*Number of Agreements per Basin*):** Hukuki kurumsallaşmanın coğrafi yoğunluğu.
2. **Kişi Başına Düşen Milli Gelir (*GDP per Capita*):** Kıyıdaş ülkeler arasındaki ekonomik asimetriler.
3. **Nüfus Dağılımı (*Population Distribution*):** Havza genelinde demografik yoğunlaşma merkezleri.
4. **Havza Nüfus Yoğunluğu (*Population Density per River Basin*):** Su kaynağı üzerindeki antropolojik baskı.
5. **İklim Bölgeleri (*Climatic Regions*):** Köppen iklim zonları ve kurak/yarı-kurak alanların sınır-aşan dağılımı.
6. **Arazi Örtüsü ve Kullanımı (*Land Cover and Use*):** Orman, tarım, mera ve sulak alan kompozisyonu.
7. **Sulanabilir Tarım Alanları (*Irrigated Areas*):** Tarımsal su tüketiminin yoğunlaştığı ovalar.
8. **Baraj Yoğunluğu (*Dam Density per International Basin*):** Büyük hidroelektrik ve depolama rezervuarları.
9. **Ortalama Yıllık Yüzey Akışı (*Average Annual Runoff*):** Havza hidrolojik su bütçesi ve debi verimi.
10. **Su Stresi ve Kıtlık İndeksi (*Water Stress per International Basin*):** Kullanılabilir su miktarı ile tüketim talebi arasındaki oran.

#### 1.7.3. Kıtalar Bazında Antlaşmalar Fihristi
Atlas, küresel sınır-aşan havzaları 5 ana coğrafi kıtada fihristlemiştir:
- **Afrika (ss. 27–50):** Nil, Kongo, Nijer, Zambezi, Çad, Senegal ve Okavango anlaşmaları.
- **Asya (ss. 51–76):** İndus, Ganj-Brahmaputra, Mekong, Fırat-Dicle, Aral Denizi (Amu Derya/Siri Derya), Ürdün Nehri.
- **Avrupa (ss. 77–132):** Tuna, Ren, Elbe, Oder, Douro, Tagus ve İskandinav havzaları.
- **Kuzey Amerika (ss. 133–162):** Büyük Göller / St. Lawrence, Colorado, Rio Grande, Columbia.
- **Güney Amerika (ss. 163–170):** Amazon, La Plata (Paraná-Paraguay-Uruguay), Orinoco.

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

---

## 3. Pacific Institute Su Çatışmaları Kronolojisi (Dr. Peter H. Gleick)

### 3.1. Kapsam ve Kurumsal Köken
**Pacific Institute Water Conflict Chronology**, Dr. Peter H. Gleick liderliğindeki araştırmacılar tarafından Oakland, Kaliforniya'da geliştirilen ve insanlık tarihinin bilinen ilk su çatışmalarından (M.Ö. 2500 Mezopotamya Lagaş-Umma savaşı) modern döneme kadar tatlı su kaynaklarıyla bağlantılı tüm şiddet, saldırı ve gerilim olaylarını kaydeden dünyanın en yetkin su güvenliği kronolojisidir.

- **Resmi Veritabanı ve Etkileşimli Kronoloji:** [https://www.worldwater.org/conflict/list/](https://www.worldwater.org/conflict/list/)
- **Literatür ve Bibliyografya Kaynakçası:** [https://worldwater.org/conflict/refs.html](https://worldwater.org/conflict/refs.html)
- **Kapsam:** M.Ö. 2500 (Antik Sümer Lagaş-Umma savaşı) yılından günümüze (2024–2026) kadar dünya genelindeki 2.758 doğrulanmış su çatışması, şiddet olayı ve altyapı saldırısı (tarihi diplomasi/işbirliği dönüm noktalarıyla birlikte toplam 2.809 kayıt).
- **Portala Entegrasyon:** `https://www.worldwater.org/conflict/list/` veritabanındaki 2.758 olayın **tamamı** WGS84 coğrafi koordinatları, tarihleri, havzaları, taraf ülkeleri, BAR skalası skorları ve Pacific Institute taksonomisi (Trigger, Weapon, Casualty) ile portalın haritasına ve arama motoruna eksiksiz entegre edilmiştir. Her olay kartında ve harita popup penceresinde doğrudan `worldwater.org/conflict/refs.html#<anchor>` literatür kaynakları sunulmaktadır.

### 3.2. Pacific Institute Üçlü Rol Taksonomisi (*Tripartite Conflict Typology*)

Pacific Institute, suyun çatışmalardaki rolünü üç temel analitik kategoriye ayırır:

1. **🎯 Tetikleyici (*Trigger*):**
   Suyun veya su altyapısının kontrolü, tahsisi ya da su kıtlığı/kuraklık nedeniyle yaşanan ekonomik-fiziksel baskılar doğrudan çatışmanın ya da şiddetin kök nedeni veya kıvılcımı olmuştur.
   - *Örnekler:* 1975 Farakka Bendi açılışı (Ganj), 2000 Bolivya Cochabamba Su Savaşı, 2011–2024 Büyük Etiyopya Rönesans Barajı (GERD) uyuşmazlığı, 2021 Kırgızistan-Tacikistan İsfara Golovnoy su dağıtım noktası çatışması.

2. **⚔️ Silah / Askeri Araç (*Weapon / Tool*):**
   Su kaynakları veya su dağıtım sistemleri, askeri harekat, kuşatma ya da siyasi baskı amacıyla bir araç veya silah olarak kullanılmıştır.
   - *Örnekler:* 1948 yılında Hindistan'ın Pakistan kanallarına giden suyu kesmesi, 1984'te Saddam Hüseyin'in Şii muhalifleri sindirmek için Mezopotamya bataklıklarını kurutması, 1991 Körfez Savaşı'nda petrolün Basra Körfezi'ndeki tuz giderme tesislerine boşaltılması, 2014'te Ukrayna'nın Kuzey Kırım Kanalı'nı kapatması.

3. **💥 Hedef / Zayiat (*Casualty / Target*):**
   Su kaynakları veya su altyapıları (barajlar, arıtma tesisleri, su boru hatları, pompa istasyonları, kanallar) askeri çatışmalar sırasında kasıtlı ya da ikincil hedef olmuş, bombalanmış, tahrip edilmiş veya zehirlenmiştir.
   - *Örnekler:* 1964–1966 İsrail-Suriye Şeria Nehri saptırma kanalları bombardımanı, 1986 Ren Sandoz kimyasal zehirlenmesi, 2003 Irak Savaşı'nda su arıtma tesislerinin bombalanması ve yağmalanması, 2023 Gazze su iletim ve tuz giderme altyapısının tahrip edilmesi.

4. **🤝 İşbirliği ve Barışçıl Dönüm Noktası (*Cooperation / Institutional Milestone*):**
   Pacific Institute kronolojisinin barışçıl boyutunu ve OSU TFDD işbirliği skalasını bütünlemek amacıyla eklenen dördüncü kategori; çatışmaları sona erdiren diplomatik antlaşmaları ve ortak nehir havzası komisyonlarını ifade eder.
   - *Örnekler:* 1960 İndus Suları Antlaşması, 1994 İsrail-Ürdün Barış Antlaşması Su Maddesi, 1996 Ganj Antlaşması, 2024 Nil CFA'sının yürürlüğe girmesi, 2026 Kuzey Aral Denizi Restorasyon Antlaşması.

### 3.3. TFDD BAR Skalası ve Pacific Institute Taksonomisinin Çapraz Eşlemesi

Portalda sunulan analitik derinlik, iki önde gelen metodolojinin birleşimiyle sağlanmaktadır:
- **OSU BAR Skalası (-7 ila +7):** Uyuşmazlığın ya da işbirliğinin yoğunluk derecesini (şiddet skalasını) ölçer.
- **Pacific Institute Taksonomisi (Trigger / Weapon / Casualty):** Suyun bu etkileşimdeki nedensel rolünü (kök neden mi, araç mı, hedef mi) açıklar.


## 4. ECMWF ERA5 Tarihsel Atmosferik Reanaliz Verisi

### 5.1. Reanaliz Teknolojisi ve Veri Kalitesi
**ERA5**, Avrupa Orta Vadeli Hava Tahminleri Merkezi (**ECMWF**) tarafından Copernicus İklim Değişikliği Servisi (C3S) kapsamında üretilen beşinci nesil küresel atmosferik reanalizdir.

- **Model Çözünürlüğü:** Yatayda ~31 km (0.25° × 0.25°), dikeyde 137 atmosferik katman.
- **Veri Asimilasyonu:** 4D-Var (Dört Boyutlu Değişimsel Asimilasyon) tekniği ile yer gözlemleri, uydular ve radyo sondalar birleştirilmiştir.
- **Portaldaki Zaman Aralığı:** 1940'tan bir önceki takvim yılının sonuna kadar yıllık agregasyon.

### 5.2. Türetilen İklim İndikatörleri ve Formülasyon

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

## 5. FAOLEX ve Birleşmiş Milletler Hukuk Arşivleri

### 5.1. UN FAO FAOLEX Entegrasyonu
FAO Legal Office tarafından işletilen **FAOLEX**, dünyanın en büyük çevre, su ve tarım hukuku veritabanıdır.
- Her anlaşma için FAOLEX LEX-FAOC kayıt kodları indekslenmiş; ulusal uygulama yasaları ve ikincil mevzuat bağlantıları ilişkilendirilmiştir.

### 5.2. Birincil PDF Belge Saklama Mimarisi
Akademik araştırmalarda en sık karşılaşılan problemlerden biri olan dış web sitelerindeki kırık linkler (*link rot / 404 hataları*), portala dahil edilen yerel arşiv sistemiyle çözülmüştür:
- Kritik anlaşmalar resmi BM Antlaşmalar Serisi (UNTS), FAOLEX ve ikili sınır komisyonlarından (IBWC, MRC) PDF formatında temin edilerek doğrudan `client/public/docs/` dizininde versiyonlanmıştır.
- Her anlaşma kartında sağlanan **📥 Depo PDF** butonu, bu birincil hukuki metinleri harici ağ bağlantısı kesintilerinden etkilenmeksizin doğrudan sunar.

---

## 6. Metodolojik Kısıtlar ve Dikkat Edilmesi Gereken Hususlar

Araştırmacıların veri analizlerinde göz önünde bulundurması gereken metodolojik kısıtlar şunlardır:

1. **Dil ve Arşivleme Yanlılığı (*Language Bias*):** TFDD külliyatı tarihi olarak İngilizce, Fransızca ve İspanyolca belgelere daha geniş yer vermiştir. Yerel dillerdeki bazı ikili protokoller tarihi arşivlerde eksik kalabilmektedir.
2. **Koordinat Merkezileştirme:** Çok geniş nehir havzalarında (örn. Amazon, Nil, Tuna) anlaşma koordinatı olarak ya ana havza çıkış noktası ya da anlaşmanın odaklandığı hidrolik altyapı (baraj, rezervuar) koordinatı seçilmiştir.
3. **BAR Skalası Ağırlıklandırması:** Olay verileri olay bazlıdır; uzun süreli yapısal gerginliklerin tamamını tek bir skora indirgemek yerine, dönemin kritik kırılma noktalarını simgelemektedir.

---

## 7. Temel Akademik Kaynakça / References

- **Allan, J. A.** (2002). *The Middle East Water Question: Hydropolitics and the Global Economy*. I.B. Tauris.
- **Dinar, A., Blankespoor, B., Dinar, S., & Kurukulasuriya, P.** (2019). *Water Scarcity, Conflict, and Cooperation: Analytical and Empirical Perspectives*. World Scientific.
- **Gleick, P. H.** (1991). Environment and security: The clear connections. *Bulletin of the Atomic Scientists*, April, 17–21.
- **Gleick, P. H.** (1993). Water and conflict: Fresh water resources and international security. *International Security*, 18(1), 79–112.
- **Gleick, P. H.** (1994). Water, war, and peace in the Middle East. *Environment: Science and Policy for Sustainable Development*, 36(3), 6–42.
- **Gleick, P. H.** (2014). Water, drought, climate change, and conflict in Syria. *Weather, Climate, and Society*, 6(3), 331–340.
- **Gleick, P. H.** (2023). *The Three Ages of Water: Prehistoric Past, Imperiled Present, and a Hope for the Future*. PublicAffairs, New York.
- **Gleick, P. H., Vyshnevskyi, V., & Shevchuk, S.** (2023). The use of Ukraine rivers and water systems as defense, weapons, and casualties of the Russia-Ukraine war. *Earth's Future*, 11(8), e2023EF003883.
- **Hatami, H., & Gleick, P. H.** (1994). Chronology of conflict over water in the legends, myths, and history of the ancient Middle East. *Environment*, 36(3).
- **Pacific Institute.** (2024). *Water Conflict Chronology & Literature References*. World Water Project. URL: [https://worldwater.org/conflict/refs.html](https://worldwater.org/conflict/refs.html).
- **Hersbach, H., et al.** (2020). The ERA5 global reanalysis. *Quarterly Journal of the Royal Meteorological Society*, 146(730), 1999–2049.
- **McCaffrey, S. C.** (2019). *The Law of International Watercourses* (3rd ed.). Oxford University Press.
- **Salman, S. M.** (2007). The United Nations Watercourses Convention ten years later: Why has its entry into force proven difficult? *Water International*, 32(1), 1–15.
- **Wolf, A. T.** (1998). Conflict and cooperation along international waterways. *Water Policy*, 1(2), 251–265.
- **Wolf, A. T., Yoffe, S. B., & Giordano, M.** (2003). International waters: Identifying basins at risk. *Water Policy*, 5(1), 29–60.
- **Yoffe, S., Wolf, A. T., & Giordano, M.** (2003). Conflict and cooperation over international freshwater resources: Indicators of basins at risk. *Journal of the American Water Resources Association*, 39(5), 1109–1126.
- **Zeitoun, M., & Warner, J.** (2006). Hydro-hegemony: A framework for analysis of trans-boundary water conflicts. *Water Policy*, 8(5), 435–460.
