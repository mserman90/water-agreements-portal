# Sınır Aşan Su Anlaşmaları ve Hidro-İklimsel Analiz Portalı
### *Transboundary Freshwater Agreements & Hydro-Climatic Intelligence Portal*

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.placeholder.svg)](https://github.com/mserman90/water-agreements-portal)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Live_Portal-GitHub_Pages-0284c7?style=flat&logo=github)](https://mserman90.github.io/water-agreements-portal/)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![ERA5 Reanalysis](https://img.shields.io/badge/Climate_Data-ECMWF_ERA5-orange)](https://www.ecmwf.int/en/forecasts/dataset/ecmwf-reanalysis-v5)
[![Pacific Institute](https://img.shields.io/badge/Conflict_Chronology-Pacific_Institute-red)](https://worldwater.org/conflict/refs.html)

---

## 📌 Özet / Abstract

**[TR]** Bu araştırma portalı, 1820 yılından günümüze kadar dünya genelindeki sınır-aşan tatlı su havzalarında imzalanmış 3.000'i aşkın uluslararası su anlaşmasını, Oregon State Üniversitesi **Transboundary Freshwater Dispute Database (TFDD)**, **Basins at Risk (BAR)** uyuşmazlık-işbirliği veri setlerini, **Pacific Institute Water Conflict Chronology** (Dr. Peter Gleick, [worldwater.org/conflict/refs.html](https://worldwater.org/conflict/refs.html)) taksonomisini, Birleşmiş Milletler (BM) anlaşma metinlerini ve **Copernicus ECMWF ERA5** iklim yeniden analiz verilerini (1940–günümüz) tek bir etkileşimli jeo-uzamsal çatı altında birleştiren açık kaynaklı bir akademik araştırma platformudur. Portal; uluslararası su hukuku, hidropolitik, hidro-hegemonya ve iklim değişikliğinin sınır-aşan su güvenliği üzerindeki etkilerini inceleyen araştırmacılar, diplomatlar ve akademisyenler için tasarlanmıştır.

**[EN]** This research portal is an open-access scholarly platform synthesizing over 3,000 international transboundary freshwater treaties from 1820 to the present. By integrating Oregon State University’s **Transboundary Freshwater Dispute Database (TFDD)** and **Basins at Risk (BAR)** conflict-cooperation event set with United Nations treaty archives and **Copernicus ECMWF ERA5** historical reanalysis data (1940–present), the portal provides a unified spatio-temporal framework for investigating the hydro-diplomacy, hydro-hegemony, and climate-conflict nexus across international river basins.

---

## 🔬 Kuramsal Çerçeve ve Metodoloji / Theoretical Framework

Platform, hidropolitik ve sınır-aşan su yönetimi literatüründeki dört temel teorik sütun üzerine inşa edilmiştir:

```
                      ┌──────────────────────────────────────────────┐
                      │    Uluslararası Su Hukuku & İlkeler          │
                      │  (BM 1997 Su Yolları / UNECE 1992 Helsinki)   │
                      └──────────────────────┬───────────────────────┘
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             ▼                                                               ▼
┌──────────────────────────────┐                           ┌──────────────────────────────────┐
│   Hidro-Hegemonya & TWINS     │                           │   BAR Uyuşmazlık-İşbirliği Skalası│
│   (Zeitoun & Warner, 2006)   │                           │   (Wolf, Yoffe & Giordano, 2003) │
└────────────┬─────────────────┘                           └──────────────────┬───────────────┘
             │                                                                │
             └───────────────────────────────┬────────────────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │    Hidro-İklimsel Stres & ERA5 Entegrasyonu  │
                      │  (Sıcaklık, Yağış ve Kuraklık Anomalileri)   │
                      └──────────────────────────────────────────────┘
```

### 1. Hidro-Hegemonya ve Transboundary Water Interaction Nexus (TWINS)
Zeitoun ve Warner (2006) tarafından geliştirilen **Hidro-Hegemonya Çerçevesi**, sınır-aşan nehir havzalarındaki güç asimetrilerini (coğrafi konum, askeri/ekonomik kapasite, uluslararası meşruiyet) analiz eder. Portaldaki anlaşma ve uyuşmazlık sınıflandırmaları, işbirliği ve çatışmanın birbirini dışlayan zıtlıklar değil, aynı anda var olabilen süreçler olduğunu (Miranowski & Cascão, 2011; TWINS modeli) dikkate alarak "İşbirliği" (Cooperation), "Uyuşmazlık" (Conflict) ve "Karma/Teknik" (Mixed) eksenlerinde kategorize edilmiştir.

### 2. Basins at Risk (BAR) Çatışma ve İşbirliği Olay Skalası
Oregon State Üniversitesi bünyesinde yürütülen Basins at Risk çalışması (Wolf et al., 2003; Yoffe et al., 2003), su etkileşimlerini **-7 (resmi savaş ilanı/askeri çatışma)** ile **+7 (gönüllü birleşme / ortak yönetim sözleşmesi)** arasında değişen sayısal bir ölçeğe yerleştirir. Portaldaki 121 kritik tarihi su krizi ve dönüm noktası, bu BAR ölçeğine göre haritalandırılmış ve renklendirilmiştir.

### 3. Uluslararası Su Hukukunun Temel İlkeleri
Veritabanı, 1997 Birleşmiş Milletler Uluslararası Su Yollarının Seyrüsefer Dışı Kullanım Hukuku Sözleşmesi (*UN Watercourses Convention*) ve 1992 UNECE Helsinki Sözleşmesi'nde tanımlanan:
- **Hakça ve Makul Kullanım İlkesi** (*Equitable and Reasonable Utilization*)
- **Önemli Zarar Vermeme Yükümlülüğü** (*No Significant Harm Rule*)
- **Düzenli Bilgi Değişimi ve Bildirim İlkesi** (*Prior Notification & Data Exchange*)
esaslarına göre kodlanmış anlaşma metinlerini içerir.

### 4. Hidro-İklimsel Değişkenlik & Çatışma Korelasyonu
Aşırı kuraklık ve düzensiz yağış rejimlerinin sınır-aşan gerilimleri tetikleme potansiyeli (Gleick, 1993; IPCC AR6 WGII), platformda **Copernicus ECMWF ERA5** atmosferik reanaliz verisi ile anlaşma kronolojisi eşleştirilerek somutlaştırılmıştır.

---

## 📊 Veri Kaynakları ve Provenans / Data Sources

Tüm veriler orijinal, hakemli ve uluslararası kabul görmüş resmi depolardan derlenmiştir:

| Kaynak / Veri Seti | Kurum / Sağlayıcı | Kapsam / Boyut | Akademik Referans |
| :--- | :--- | :--- | :--- |
| **TFDD Master Treaties Database** | Oregon State University (OSU TFDD) | 1.18 MB Excel (`WebsiteTreatiesDB_20181124.xlsx`, 2.118 kayıt, 115 değişken) | OSU Department of Geosciences / Prof. Aaron T. Wolf. |
| **UNEP / FAO / OSU Atlas (192 Sayfa)** | UNEP, FAO & Oregon State University (Prof. Aaron Wolf) | 75 MB PDF Eser (ISBN 92 807 2232 8, 10 Tematik Harita) | UNEP / FAO / OSU (2002). *Atlas of International Freshwater Agreements*. |
| **TFDD Treaty CodeBook (16 Sayfa)** | Oregon State University, IWMI, World Bank | 196 KB PDF (`WebsiteTreatyCodeBook_20180312.pdf`, 115 değişken tanımı) | OSU / IWMI / World Bank (2018). |
| **310 International Basins GeoJSON** | OSU TFDD Spatial Data (Friedrich et al., 2018) | 1.36 MB GeoJSON (`Basin310_Master_20180511.geojson`) | Friedrich, H. K., Svevo, G., & Walters, A. (OSU). |
| **TFDD RBO Database (77 Kolon)** | OSU Transboundary Freshwater Dispute Database | 246 KB Excel (`TFDD_RBODatabase_20131015.xlsx`) | OSU Department of Geosciences / Prof. Aaron T. Wolf. |
| **TFDD & Modern Water Treaties** | Oregon State University, UNTS, FAOLEX, River Commissions | 1820–2026 (3.059+ ikili & çok taraflı anlaşma) | Wolf, A. T. (1999) & Portal 2026 Derlemesi. |
| **BAR Event Dataset (Basins at Risk)** | OSU, World Bank & Portal Update | 1948–2026 (124 su krizi ve dönüm noktası) | Yoffe, S., Wolf, A. T., & Giordano, M. (2003). |
| **FAOLEX Database** | Gıda ve Tarım Örgütü (UN FAO) | Milli mevzuat ve su anlaşmaları metinleri | FAO Legal Office (2026). *FAOLEX Treaty Collection*. fao.org/faolex |
| **UN Treaty Series (UNTS)** | Birleşmiş Milletler Hukuk İşleri Ofisi | Orijinal anlaşma metinleri (PDF) | United Nations (1946–2026). *Treaty Series*. treaties.un.org |
| **UNECE Water Convention** | BM Avrupa Ekonomik Komisyonu | Sınır-aşan su organları ve küresel katılımlar | UNECE (1992–2026). *Water Convention Secretariat*. |
| **ERA5 Atmospheric Reanalysis** | ECMWF / Copernicus Climate Change Service (C3S) | 1940–2025 (Yıllık sıcaklık, yağış, kuraklık indisi) | Hersbach, H., et al. (2020). *The ERA5 global reanalysis*. |
| **IBWC / CILA Archives** | Uluslararası Sınır ve Su Komisyonu (ABD-Meksika) | Colorado ve Rio Grande ikili antlaşmaları (Dakika 330, 331, 332 dahil) | IBWC Minute Series (1889–2026). ibwc.gov |

> Detaylı metodolojik açıklamalar, değişken tanımları ve kodlama şeması için **[DATA_SOURCES.md](DATA_SOURCES.md)** belgesine bakınız.

---

## 📂 Depolanan Birincil Anlaşma Metinleri (PDF Arşivi)

Dış bağlantıların zamanla kaybolması (*link rot*) riskini bertaraf etmek ve açık bilim standartlarını korumak amacıyla, en kritik sınır-aşan su anlaşmalarının orijinal metinleri projenin kendi GitHub deposunda (`client/public/docs/`) arşivlenmiştir:

- **1960 İndus Suları Antlaşması (Indus Waters Treaty)** — Hindistan & Pakistan (Dünya Bankası arabuluculuğu)
- **1994 İsrail - Ürdün Barış Antlaşması (Madde 6: Su Düzenlemesi)**
- **1995 Mekong Havzası Sürdürülebilir Kalkınma İşbirliği Anlaşması** — Kamboçya, Laos, Tayland, Vietnam
- **1997 Birleşmiş Milletler Uluslararası Su Yolları Sözleşmesi (A/RES/51/229)**
- **1992 UNECE Helsinki Sınır Aşan Su Yolları ve Uluslararası Göller Sözleşmesi**
- **1944 Colorado, Tijuana ve Rio Grande Antlaşması** — ABD & Meksika
- **1909 Sınır Suları Antlaşması** — ABD & Kanada (International Joint Commission)
- **1978 Amazon İşbirliği Antlaşması (OTCA / ACTO)** — 8 Amazon havzası ülkesi
- **2000 SADC Revize Edilmiş Paylaşılan Su Yolları Protokolü** — Güney Afrika Kalkınma Topluluğu
- **2015 Nil / GERD İlkeler Bildirgesi** — Mısır, Etiyopya, Sudan
- **OSU TFDD Resmi Kodlama Kılavuzu (WebsiteTreatyCodeBook_20180312.pdf)** — Oregon State University, IWMI & World Bank (16 Sayfa)

Kullanıcılar arayüzdeki **📥 Depo PDF** butonuna basarak bu belgelere doğrudan depodan, üçüncü taraf sunuculara bağımlı olmadan erişebilirler.

---

## 🛰️ ECMWF ERA5 İklim Analizi Entegrasyonu

Platform, her nehir havzasının enlem/boylam koordinatlarını kullanarak **Open-Meteo ERA5 Tarihsel Reanaliz API'si** üzerinden 1940 ile günümüz arasındaki yıllık iklim zaman serilerini dinamik olarak çeker:

1. **2m Sıcaklık Anomalisi ($\Delta T$):** WMO 1991–2020 referans iklim normallerine göre yıllık sapmalar ($^\circ\text{C}$).
2. **Toplam Yağış Anomalisi ($\Delta P$):** Yıllık yağışın normallerden yüzdesel ve mutlak (mm) farkları.
3. **Kuraklık Stres İndisi (%):** Yağış eksikliği ve potansiyel evapotranspirasyon korelasyonuna dayalı hidrometeorolojik kuraklık şiddeti.

Herhangi bir anlaşma veya su uyuşmazlığı seçildiğinde, iklim grafiğinde anlaşmanın imzalandığı veya krizin yaşandığı yıl turuncu dikey çizgi ile vurgulanır; bu sayede araştırmacılar su anlaşmalarının kuraklık dönemlerinde mi yoksa aşırı taşkın dönemlerinde mi yoğunlaştığını ampirik olarak test edebilirler.

---

## 🤖 Açık ve Anahtarsız (Keyless) Yapay Zekâ Destekli Sorgu Mimarisi

Kullanıcı gizliliğini korumak, API anahtarı maliyetlerini ortadan kaldırmak ve akademik bağımsızlığı sağlamak amacıyla çift kademeli bir **Keyless RAG (Retrieval-Augmented Generation)** mimarisi uygulanmıştır:

1. **Katman 1 — Yerel Vektör/Kelimelik TFDD Bilgi Motoru:** Tarayıcı üzerinde (offline-ready) çalışan anlamsal eşleştirme motoru. Kullanıcının sorusuna en uygun 5 anlaşma ve kriz parametresini seçer.
2. **Katman 2 — Anahtarsız LLM Entegrasyonu (Pollinations.ai):** Kayıt veya ticari API anahtarı gerektirmeyen açık model havuzu üzerinden sorguları akademik formatta analiz eder.
3. **Katman 3 — Akıllı Hevristik Deterministik Yedek:** Ağ bağlantısı kesildiğinde dahi çalışan, anlaşmaların amaç, havza ve taraflarını doğrudan çözümleyen yerel çözümleyici.

---

## 💻 Sistem Mimarisi ve Teknoloji Yığını

| Katman | Teknoloji / Kütüphane | Kullanım Amacı |
| :--- | :--- | :--- |
| **Kullanıcı Arayüzü** | React 19, TypeScript, Tailwind CSS | Bileşen mimarisi, yüksek performans ve tip güvenliği |
| **Jeo-Uzamsal Görselleştirme** | Leaflet.js, Leaflet.markercluster | 3.000+ markerın dinamik kümelenmesi ve harita renderı |
| **Vektörel Grafik & Zaman Çizelgesi** | Responsive SVG & Canvas | 5 yıllık dağılım histogramları ve ERA5 zaman serisi grafiği |
| **Yerelleştirme (i18n)** | Custom Context + Algoritmik Çeviri Motoru | İngilizce/Türkçe tam çift dilli arayüz ve 3.000+ anlaşma çevirisi |
| **Paketleyici & Sunucu** | Vite 7, Node.js, GitHub Pages | Statik dağıtım, hızlı üretim derlemesi (<5 sn) |

---

## 📖 Akademik Atıf / Citation

Bu portalı, veri setlerini veya metodolojisini araştırmalarınızda, tezlerinizde veya yayınlarınızda kullanıyorsanız lütfen aşağıdaki şekilde atıfta bulununuz:

### BibTeX
```bibtex
@software{serman2026waterportal,
  author       = {Serman, Mert},
  title        = {Transboundary Freshwater Agreements and Hydro-Climatic Intelligence Portal: A Spatio-Temporal Database of Global Water Treaties and Climate Anomalies},
  year         = {2026},
  publisher    = {GitHub},
  journal      = {GitHub repository},
  howpublished = {\url{https://github.com/mserman90/water-agreements-portal}},
  version      = {1.0.0}
}
```

### APA
> Serman, M. (2026). *Transboundary Freshwater Agreements and Hydro-Climatic Intelligence Portal: A Spatio-Temporal Database of Global Water Treaties and Climate Anomalies* (Version 1.0.0) [Computer software]. GitHub. https://github.com/mserman90/water-agreements-portal

---

## 📜 Lisans & Etik Bildirim / License & Ethics

- Bu projenin kaynak kodları **[MIT Lisansı](LICENSE)** altında serbestçe dağıtılmaktadır.
- Projede kullanılan TFDD ve BAR veri setleri Oregon State University akademik kullanım şartlarına uygundur.
- Anlaşma metinleri ve resmi belgeler uluslararası kamu malı (*public domain*) ve açık erişim ilkeleri uyarınca derlenmiştir.
