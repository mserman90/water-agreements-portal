# -*- coding: utf-8 -*-
"""
Generates client/src/data/conflictsTr.ts with accurate Turkish translations
for all 121 historical water conflict and cooperation records.
"""
import json

# Full translations for all 121 historical water conflict/cooperation events
translations = [
    # 0 - 1948
    ("Hindistan-Pakistan İndus Kanalı Su İhtilafı",
     "Bölünmenin ardından Hindistan, 1 Nisan 1948'de Yukarı Bari Doab Kanalı sisteminden Pakistan kanallarına akan suyu keserek milyonlarca dönüm tarım arazisini etkiledi. Haftalarca süren kriz, Mayıs 1948'de imzalanan acil Hakimiyetlerarası Anlaşma ile çözüldü."),
    # 1 - 1950
    ("Mısır'ın Etiyopya Nil Projelerini Protestosu",
     "Mısır, 1929 İngiliz-Mısır Nil Suları Anlaşması'nı gerekçe göstererek ve Mısır'ın tarihi su haklarının tanınmasını talep ederek, Etiyopya'da Nil debisini etkileyebilecek her türlü yukarı havza su yapısına resmi olarak itiraz etti."),
    # 2 - 1955
    ("Şeria Nehri İçin Johnston Planı Müzakereleri",
     "ABD özel temsilcisi Eric Johnston, Şeria Nehri sularını paylaştırmak için İsrail ile Arap devletleri arasında çok yıllı müzakereler yürüttü. Su kotalarında teknik uzlaşmaya varılmasına rağmen plan, İsrail'in tanınmasına ilişkin siyasi endişeler sebebiyle 1955'te Arap Birliği tarafından reddedildi."),
    # 3 - 1957
    ("Mekong Komitesi'nin Kuruluşu",
     "Kamboçya, Laos, Tayland ve Güney Vietnam, BM himayesinde Aşağı Mekong Havzası İncelemeleri Koordinasyon Komitesi'ni (Mekong Komitesi) kurarak Mekong işbirliği için ilk kurumsal çerçeveyi oluşturdu."),
    # 4 - 1959
    ("Mısır-Sudan Nil Suları Anlaşması",
     "Mısır ve Sudan, yıllık 55,5 milyar m³ suyu Mısır'a ve 18,5 milyar m³ suyu Sudan'a tahsis eden kapsamlı bir su paylaşım anlaşması imzaladı; bu anlaşma Asvan Yüksek Barajı'nın inşasını sağladı. Yukarı kıyıdaş devletler müzakerelerin dışında bırakıldı."),
    # 5 - 1960
    ("İndus Suları Antlaşması İmzalandı",
     "Hindistan ve Pakistan, Dünya Bankası arabuluculuğunda Karaçi'de İndus Suları Antlaşması'nı imzaladı. Antlaşma, doğu nehirlerini (Ravi, Beas, Sutlej) Hindistan'a ve batı nehirlerini (İndus, Jhelum, Chenab) Pakistan'a tahsis ederek bölünme sonrası on yıllık anlaşmazlığı çözdü."),
    # 6 - 1960
    ("Etiyopya 1929 Nil Anlaşmasının Geçerliliğine İtiraz Etti",
     "Etiyopya, 1929 İngiliz-Mısır Nil Suları Anlaşması'nın Etiyopya'nın rızası olmadan imzalandığını ve Mavi Nil ile Tana Gölü kolları üzerindeki haklarını bağlamayacağını belirterek anlaşmanın geçerliliğine resmen meydan okudu."),
    # 7 - 1961
    ("Kolombiya Nehri Antlaşması İmzalandı",
     "Amerika Birleşik Devletleri ve Kanada, sel kontrolü ve hidroelektrik amacıyla Britanya Kolombiyası'nda üç baraj inşasını öngören Kolombiya Nehri Antlaşması'nı imzaladı. ABD sel kontrolü sağladı ve Kanada'ya yaklaşık 65 milyon dolar ödedi; Kanada ise aşağı havza enerji faydalarının yarısını aldı."),
    # 8 - 1962
    ("Asvan Yüksek Barajı İnşası Sovyet Yardımıyla Başladı",
     "Batı'nın finansmanı geri çekmesinin ardından Mısır, Sovyet finansmanıyla Asvan Yüksek Barajı'nın inşasına başladı. Etiyopya ve yukarı kıyıdaş ülkeler, projenin dayandığı 1959 su tahsisi çerçevesinden dışlandıklarını belirterek projeyi protesto etti."),
    # 9 - 1963
    ("Nijer Havzası Niamey Senedi",
     "Dokuz Nijer Havzası devleti, Nijer Nehri üzerinde adil seyrüsefer ve ekonomik işbirliğini taahhüt eden Niamey Senedi'ni imzaladı; bu senet daha sonra kurulacak Nijer Nehri Komisyonu ve Nijer Havzası Otoritesi'nin temelini attı."),
    # 10 - 1964
    ("İsrail-Suriye Şeria Nehri Su Savaşı Başladı",
     "İsrail Ulusal Su Taşıyıcısı'nı faaliyete geçirirken, Suriye ve Ürdün Şeria Nehri'nin kollarını (Banias ve Yarmuk) saptırma inşaatına başladı. İsrail hava saldırıları Suriye'nin saptırma tesislerini vurarak 1967 savaşına giden gerilimi tırmandırdı."),
    # 11 - 1964
    ("Nijer Nehri Komisyonu Kuruldu",
     "Batı Afrika'da dokuz kıyıdaş devlet, çok taraflı nehir yönetimi ve ortak hidroelektrik ile tarımsal kalkınma planlaması için ilk bölgesel organ olan Nijer Nehri Komisyonu'nu resmen kurdu."),
    # 12 - 1967
    ("Altı Gün Savaşı: Bir Savaş Sebebi Olarak Su",
     "1967 Altı Gün Savaşı'nda İsrail, Golan Tepeleri'ni (Banias su kaynakları), Batı Şeria dağ akiferlerini ve Gazze kıyı akiferini ele geçirerek bölgesel tatlı su kaynakları üzerindeki kontrolünü büyük ölçüde artırdı."),
    # 13 - 1970
    ("Asvan Yüksek Barajı Tamamlandı",
     "Mısır, Nasır Gölü'nü oluşturan Asvan Yüksek Barajı'nı tamamladı. Baraj Mısır'a sel kontrolü, sulama güvencesi ve hidroelektrik sağlarken, aşağı havzada verimli alüvyon akışını kesti ve Nil Deltası'nda kıyı erozyonuna yol açtı."),
    # 14 - 1972
    ("OMVS Senegal Nehri Havzası Örgütü Kuruldu",
     "Mali, Moritanya ve Senegal, ortak altyapı (Manantali ve Diama barajları) mülkiyeti ve işletilmesi yoluyla Senegal Nehri sularını yönetmek üzere Senegal Nehri Kalkınma Örgütü'nü (OMVS) kurdu."),
    # 15 - 1973
    ("Hilmend Nehri Antlaşması: Afganistan-İran",
     "Afganistan ve İran, normal hidrolojik koşullarda İran'ın Sistan havzasına saniyede 22 metreküp (artı 4 m³/sn iyi niyet akışı) Hilmend Nehri suyu garanti eden bir antlaşma imzaladı. Uygulama on yıllarca ihtilaflı kaldı."),
    # 16 - 1975
    ("Türkiye-Suriye Fırat Nehri Krizi",
     "Keban Barajı (Türkiye) ve Tabka Barajı'nın (Suriye) eşzamanlı doldurulması, Irak'a ulaşan Fırat akışını kritik seviyede düşürerek savaş tehditlerine yol açtı. Suudi Arabistan'ın acil arabuluculuğu Suriye'nin su tahliyesini artırmasını sağladı ve askeri çatışmayı önledi."),
    # 17 - 1975
    ("Hindistan Ganj Üzerinde Farakka Barajı'nı Açtı",
     "Hindistan, Kalküta Limanı'nın çamur birikimini temizlemek amacıyla Bhagirathi-Hooghly nehrine su yönlendirmek için Farakka Barajı'nı devreye aldı; bu durum Bangladeş'in aşağı havzasındaki kuru mevsim akışını ciddi ölçüde azalttı."),
    # 18 - 1976
    ("Ren Nehri Tuz Kirliliği Sözleşmesi",
     "Fransa, Almanya, Hollanda, İsviçre ve Lüksemburg, Fransız potas madenlerinden kaynaklanan klorür deşarjını azaltmak ve Hollanda tarımı ile içme suyunu korumak amacıyla Ren Nehri'nin Klorür Kirliliğine Karşı Korunması Sözleşmesi'ni imzaladı."),
    # 19 - 1978
    ("Mısır Devlet Başkanı Sedat'tan Nil İçin Savaş Tehdidi",
     "Mısır Cumhurbaşkanı Enver Sedat, Etiyopya'nın Mavi Nil üzerindeki baraj planlarına karşı uyararak 'Mısır'ı yeniden savaşa sokabilecek tek konu sudur' açıklamasında bulundu."),
    # 20 - 1980
    ("Nijer Havzası Otoritesi (NBA) Kuruldu",
     "Niamey'de Nijer Nehri Komisyonu'nun yerine geçen dokuz üye devlet, entegre havza yönetimi, baraj koordinasyonu ve su kaynakları kalkınması için güçlendirilmiş bir yetkiye sahip Nijer Havzası Otoritesi'ni kurdu."),
    # 21 - 1984
    ("Irak'ın Mezopotamya Sazlıklarını Silah Olarak Kurutması",
     "Saddam Hüseyin rejimi, Şii muhalifleri ve Bataklık Araplarını bastırmak için Dicle ve Fırat nehirlerinin yönünü devasa kanallarla değiştirerek Mezopotamya sazlıklarının %90'ından fazlasını kuruttu ve tarihin en büyük ekolojik yıkımlarından birini gerçekleştirdi."),
    # 22 - 1987
    ("Türkiye-Suriye Fırat Suyu ve Güvenlik Protokolü",
     "Türkiye ve Suriye, Türkiye'nin sınırda yıllık ortalama saniyede 500 metreküp Fırat suyu bırakmayı taahhüt ettiği, Suriye'nin ise sınır güvenliği ve terörle mücadelede işbirliği yapmayı kabul ettiği geçici bir ekonomik protokol imzaladı."),
    # 23 - 1988
    ("Hindistan-Bangladeş Ganj Anlaşmazlığı Şiddetlendi",
     "Hindistan ile Bangladeş arasındaki 1982 tarihli geçici su paylaşım anlaşmasının süresi doldu. Hindistan tek taraflı su çekimlerine devam ederken, Bangladeş'in güneybatısında tuzlanma, içme suyu krizi ve tarımsal çöküş yaşandı."),
    # 24 - 1990
    ("Türkiye'nin Körfez Savaşı Sırasında Fırat Akışını Kesmesi",
     "Türkiye, Atatürk Barajı rezervuarını doldurmak için Fırat Nehri akışını bir ay boyunca kesti. Önceden bildirilmesine ve teknik tahliyelerle telafi edilmesine rağmen hamle, Suriye ve Irak'ta şiddetli diplomatik protestolara neden oldu."),
    # 25 - 1992
    ("Aral Denizi Eyaletlerarası Su Koordinasyon Komisyonu (ICWC)",
     "Sovyetler Birliği'nin dağılmasının ardından beş Orta Asya cumhuriyeti (Kazakistan, Kırgızistan, Tacikistan, Türkmenistan, Özbekistan) Almatı Anlaşması'nı imzalayarak Seyhun ve Ceyhun sularını ortak yönetmek üzere ICWC'yi kurdu."),
    # 26 - 1994
    ("Aral Denizi Orta Asya Bütçe Taahhüdü",
     "Orta Asya liderleri, felaket düzeyinde kuruyan Aral Denizi havzasını rehabilite etmek ve yerel nüfusun ekolojik yaşam koşullarını iyileştirmek için ulusal bütçelerinin %1'ini Uluslararası Aral'ı Kurtarma Fonu'na (IFAS) tahsis etmeyi kabul etti."),
    # 27 - 1994
    ("İsrail-Ürdün Barış Antlaşması Su Maddeleri",
     "İsrail-Ürdün Barış Antlaşması'nın VI. Eki, Şeria ve Yarmuk nehirleri ile Vadi Araba yeraltı suları için karşılıklı su tahsislerini, tuzdan arındırma işbirliklerini ve depolama transferlerini resmileştirdi."),
    # 28 - 1995
    ("Mekong Nehri Komisyonu Anlaşması",
     "Kamboçya, Laos, Tayland ve Vietnam, Aşağı Mekong Havzası'nın Sürdürülebilir Kalkınması İçin İşbirliği Anlaşması'nı imzalayarak Mekong Nehri Komisyonu'nu (MRC) kurdu. Çin ve Myanmar diyalog ortağı olarak katıldı ancak tam üye olmadı."),
    # 29 - 1995
    ("Çin Lancang (Mekong) Üzerinde Manwan Barajı'nı Başlattı",
     "Çin, Yukarı Mekong (Lancang) nehri ana kolu üzerinde 1.500 MW kapasiteli Manwan Barajı'nı ticari işletmeye aldı. Bu baraj, aşağı havza ülkelerine danışılmadan inşa edilen devasa hidroelektrik baraj kademesinin ilk halkası oldu."),
    # 30 - 1996
    ("Hindistan-Bangladeş Ganj Suları Paylaşım Antlaşması",
     "Hindistan ve Bangladeş, 1 Ocak ile 31 Mayıs arasındaki kurak mevsimde Farakka Barajı'ndaki su paylaşımını belirleyen 30 yıllık tarihi bir antlaşma imzalayarak 20 yıllık ikili su krizine kapsamlı bir formül getirdi."),
    # 31 - 1997
    ("Irak'tan Dicle-Fırat Paylaşım Anlaşması Çağrısı",
     "Irak, Türkiye'nin Güneydoğu Anadolu Projesi (GAP) barajları inşaatının hızlanması üzerine BM'ye ve Arap Birliği'ne başvurarak Dicle ve Fırat nehirleri için bağlayıcı bir üçlü su paylaşım kotası belirlenmesini talep etti."),
    # 32 - 1998
    ("Tuna Nehri Koruma Sözleşmesi Yürürlüğe Girdi",
     "Tuna Nehri Koruma Sözleşmesi (DRPC) yürürlüğe girerek Tuna Havzası'nda sürdürülebilir su yönetimi, kirlilik kontrolü ve ekolojik restorasyon için Uluslararası Tuna Koruma Komisyonu'nu (ICPDR) yetkilendirdi."),
    # 33 - 1999
    ("Nil Havzası Girişimi (NBI) Kuruldu",
     "Tüm Nil kıyıdaş ülkeleri (Eritre gözlemci olarak) Darüsselam'da Nil Havzası Girişimi'ni kurarak havzanın ortak kalkınması ve kalıcı bir yasal çerçevenin müzakere edilmesi için ortak bir platform oluşturdu."),
    # 34 - 2000
    ("Cochabamba Su Savaşı, Bolivya",
     "Bolivya'nın Cochabamba kentinde belediye su sisteminin Bechtel konsorsiyumuna özelleştirilmesinin ve su tarifelerinin fahiş oranda artırılmasının ardından halk ayaklanması çıktı; haftalar süren çatışmaların ardından hükümet sözleşmeyi iptal etti."),
    # 35 - 2002
    ("Hindistan'ın Baglihar Barajı Üzerine Pakistan ile İhtilafı",
     "Pakistan, Hindistan'ın Chenab Nehri üzerinde inşa ettiği 900 MW'lık Baglihar Hidroelektrik Santrali'nin baraj göleti ve savak tasarımının 1960 İndus Antlaşması'nı ihlal ettiğini ileri sürerek projeye resmen itiraz etti."),
    # 36 - 2003
    ("Irak Savaşı: Su Altyapısının Yıkımı",
     "2003 Irak işgali ve sonrasındaki çatışmalar; elektrik şebekesinin, arıtma tesislerinin ve su dağıtım boru hatlarının çökmesine neden oldu. Milyonlarca sivil temiz suya erişimini kaybederek kolera ve tifo salgınlarıyla karşı karşıya kaldı."),
    # 37 - 2004
    ("Zambezi Su Yolu Komisyonu Anlaşması (ZAMCOM)",
     "Sekiz kıyıdaş Afrika devleti, Güney Afrika'nın en büyük dördüncü nehir havzası olan Zambezi havzasında ortak ve sürdürülebilir su kaynakları yönetimini teşvik etmek üzere ZAMCOM Anlaşması'nı imzaladı."),
    # 38 - 2005
    ("Kazakistan Kok-Aral Barajı ile Kuzey Aral'ı Kurtardı",
     "Kazakistan, Dünya Bankası desteğiyle Kok-Aral Barajı'nı tamamlayarak Kuzey Aral Denizi'ni Güney Aral'dan ayırdı. Kuzey Aral'da su seviyesi 8 metre yükseldi, tuzluluk azaldı ve ticari balıkçılık yeniden canlandı."),
    # 39 - 2005
    ("Fırat-Dicle İşbirliği Girişimi (ETIC)",
     "Türkiye, Suriye, Irak ve uluslararası uzmanlar, Fırat-Dicle havzasında teknik işbirliği, veri paylaşımı ve akademik diplomasi yoluyla güven inşa etmek amacıyla ETIC girişimini başlattı."),
    # 40 - 2006
    ("Dünya Bankası Tarafsız Uzmanı Baglihar Barajı Kararını Verdi",
     "İsviçreli profesör Raymond Lafitte, İndus Suları Antlaşması tarihindeki ilk tarafsız uzman tahkiminde Hindistan'ın Baglihar Barajı'ndaki savak yüksekliğini hafifçe düşürmesine hükmetti ancak baraj inşasının devamına onay verdi."),
    # 41 - 2007
    ("Nil İşbirliği Çerçeve Anlaşması (CFA) Müzakereleri Tıkandı",
     "Nil Havzası Girişimi müzakerelerinde, Mısır ve Sudan'ın 1929 ve 1959 anlaşmalarından doğan 'tarihi haklarının' korunması maddesini şart koşması ve yukarı havza ülkelerinin bunu reddetmesi üzerine görüşmeler kilitlendi."),
    # 42 - 2008
    ("Nijer Havzası Su Şartı Kabul Edildi",
     "Dokuz kıyıdaş devletin devlet başkanları, Nijer Havzası'nda adil su tahsisi ilkelerini, çevre korumayı ve sınır aşan ortak projeleri düzenleyen bağlayıcı Nijer Su Şartı'nı kabul etti."),
    # 43 - 2009
    ("Türkiye-Irak ve Türkiye-Suriye Su Mutabakat Zabıtları",
     "Türkiye, Irak ve Suriye ile ikili ilişkilerin zirvesinde su kaynakları, meteorolojik veri paylaşımı, baraj yönetimi ve kuraklıkla mücadele konularında ortak mutabakat zabıtları (MoU) imzaladı."),
    # 44 - 2009
    ("Mekong Düşük Su Seviyesi Krizi",
     "Aşağı Mekong Havzası'nda su seviyelerinin rekor düzeyde düşmesi naviyasyonu ve balıkçılığı felce uğrattı. Aşağı kıyıdaşlar Çin'in yeni faaliyete geçen Xiaowan Barajı'nı su tutmakla suçlarken, Çin krizin şiddetli kuraklıktan kaynaklandığını savundu."),
    # 45 - 2010
    ("Nil İşbirliği Çerçeve Anlaşması (CFA) İmzaya Açıldı",
     "Etiyopya, Uganda, Ruanda, Tanzanya ve Kenya, Entebbe'de Mısır ve Sudan'ın vetolarını aşarak Nil CFA'yı imzaladı. Anlaşma, sömürge dönemi kotaları yerine adil ve makul kullanım ilkesini getirdi."),
    # 46 - 2011
    ("Etiyopya Büyük Rönesans Barajı'nı (GERD) Duyurdu",
     "Arap Baharı sırasında Mısır'daki siyasi çalkantıdan yararlanan Etiyopya Başbakanı Meles Zenawi, Mavi Nil üzerinde 5.000+ MW kapasiteli ve 74 milyar m³ rezervuarlı Büyük Rönesans Barajı'nın inşasını resmen duyurdu."),
    # 47 - 2012
    ("Xayaburi Barajı Tartışması, Laos",
     "Laos, Mekong Nehri Komisyonu'nun Ön İstişare sürecinde komşuları Kamboçya ve Vietnam'ın balık göçü ve tortu akışı konusundaki ciddi itirazlarına rağmen 1.285 MW'lık Xayaburi Barajı'nın inşasına tek taraflı olarak başladı."),
    # 48 - 2013
    ("Etiyopya Nil CFA'yı Onayladı",
     "Etiyopya Parlamentosu Nil İşbirliği Çerçeve Anlaşması'nı (CFA) oybirliğiyle onaylayarak, Mısır Cumhurbaşkanı Muhammed Mursi'nin baraj inşasını engellemek için 'tüm seçeneklerin masada olduğu' yönündeki açıklamalarına meydan okudu."),
    # 49 - 2014
    ("Ukrayna Kuzey Kırım Kanalı'nı Kapattı",
     "Rusya'nın Kırım'ı yasadışı ilhakının ardından Ukrayna, yarımadanın tatlı su ihtiyacının %85'ini karşılayan Dinyeper Nehri kaynaklı Kuzey Kırım Kanalı'na set çekerek akışı tamamen kesti."),
    # 50 - 2015
    ("Mısır-Etiyopya-Sudan İlkeler Deklarasyonu",
     "Mısır Cumhurbaşkanı Sisi, Etiyopya Başbakanı Desalegn ve Sudan Devlet Başkanı Beşir, Hartum'da GERD Barajı için zarar vermeme, adil kullanım ve barışçıl uyuşmazlık çözümü ilkelerini içeren 10 maddelik İlkeler Bildirgesi'ni imzaladı."),
    # 51 - 2016
    ("Pakistan Kishanganga ve Ratle Barajları İçin Tahkim İstedi",
     "Pakistan, Hindistan'ın Jhelum ve Chenab kolları üzerinde inşa ettiği Kishanganga (330 MW) ve Ratle (850 MW) hidroelektrik santrallerinin akış kontrolü tasarımını ihlal ettiği gerekçesiyle Lahey Daimi Tahkim Mahkemesi'ne başvurdu."),
    # 52 - 2018
    ("Mekong Son 100 Yılın En Düşük Seviyesine Geriledi",
     "Mekong ana kolunda su seviyeleri son yüzyılın en düşük seviyelerine inerek nehir renginin maviye dönmesine ve balık popülasyonlarının çökmesine yol açtı; uydu verileri Çin barajlarının yukarı havzada su tuttuğunu ortaya koydu."),
    # 53 - 2018
    ("Cauvery Su Anlaşmazlığı: Hindistan Eyaletlerarası Çatışma",
     "Hindistan Yüksek Mahkemesi, Karnataka ve Tamil Nadu eyaletleri arasında yüzyıllık Cauvery Nehri su paylaşımı davasında nihai kararını vererek Tamil Nadu'nun payını hafifçe düşürdü; eyaletler arasında kitlesel protestolar ve grevler patlak verdi."),
    # 54 - 2019
    ("Hindistan Pulwama Saldırısı Sonrası İndus Kollarını Kesmekle Tehdit Etti",
     "Keşmir'de 40 Hint polisinin öldürüldüğü intihar saldırısının ardından Hindistan Su Kaynakları Bakanı Nitin Gadkari, doğu nehirlerinden Pakistan'a akan kullanılmayan saptırma sularının kesilerek Haryana ve Pencap'a aktarılacağını açıkladı."),
    # 55 - 2019
    ("Etiyopya İkinci Nil CFA Onay Çabaları",
     "Etiyopya ve Doğu Afrika müttefikleri, Nil CFA'nın yürürlüğe girmesi için gereken altıncı onayı sağlamak amacıyla Kongo Demokratik Cumhuriyeti ve Güney Sudan nezdinde diplomatik baskıyı artırdı."),
    # 56 - 2020
    ("Mısır GERD İhtilafını BM Güvenlik Konseyi'ne Taşıdı",
     "Washington'da ABD ve Dünya Bankası arabuluculuğunda yürütülen üçlü müzakerelerin Etiyopya'nın son tur toplantıya katılmamasıyla çökmesinin ardından Mısır, Etiyopya'nın tek taraflı baraj doldurma girişimini BM Güvenlik Konseyi'ne şikayet etti."),
    # 57 - 2020
    ("Etiyopya İlk GERD Doldurma İşlemini Tamamladı",
     "Etiyopya, Mısır ve Sudan ile bağlayıcı bir doldurma ve işletme anlaşması imzalanmadan, yoğun yağış mevsiminden yararlanarak GERD rezervuarında 4,9 milyar m³ su tuttuğunu resmen açıkladı."),
    # 58 - 2020
    ("Meksika-ABD Colorado/Rio Grande Su Borcu Gerilimi",
     "Meksika'nın 1944 Su Antlaşması kapsamındaki beş yıllık su teslimat borcunu ödemek için Chihuahua eyaletindeki La Boquilla Barajı'ndan ABD'ye su salma kararı, binlerce Meksikalı çiftçinin barajı işgal etmesi ve Ulusal Muhafızlarla çatışmasıyla sonuçlandı."),
    # 59 - 2021
    ("Kırgızistan-Tacikistan İsfara Nehri Silahlı Çatışması",
     "Kırgızistan ve Tacikistan sınır güçleri arasında İsfara Nehri üzerindeki Golovnoy su dağıtım tesisi çevresinde gözetleme kamerası kurulması yüzünden çıkan silahlı çatışmada 50'den fazla kişi hayatını kaybetti, binlerce köylü tahliye edildi."),
    # 60 - 2021
    ("Etiyopya İkinci GERD Doldurmasını Anlaşmasız Gerçekleştirdi",
     "Etiyopya, Mısır ve Sudan'ın tüm diplomatik itirazlarına rağmen GERD rezervuarına ilave 13,5 milyar m³ su ekleyerek ikinci aşama doldurmayı tamamladı; Kahire hamleyi uluslararası hukukun açık ihlali ilan etti."),
    # 61 - 2021
    ("Afganistan Hilmend Üzerinde Kemal Han Barajı'nı Açtı",
     "Afganistan Devlet Başkanı Eşref Gani, Nimruz vilayetinde Kemal Han Barajı'nı açarak 'İran'a artık bedava su verilmeyeceğini, petrol karşılığında su verileceğini' ilan etti; bu durum Tahran ile diplomatik krizi tırmandırdı."),
    # 62 - 2022
    ("Kırgızistan-Tacikistan Geniş Çaplı Sınır ve Su Çatışmaları",
     "Kırgız-Tacik sınırında su kanalları ve tartışmalı araziler yüzünden tank ve ağır topların kullanıldığı büyük çatışmalar çıktı; 100'den fazla insan hayatını kaybetti ve 130.000'den fazla insan yerinden edildi."),
    # 63 - 2022
    ("Afganistan-İran Hilmend Gerilimi Tırmandı",
     "Taliban yönetiminin Kemal Han Barajı savaklarını kapalı tutması ve İran'ın Sistan-Belucistan eyaletine su akışını engellemesi üzerine İran Cumhurbaşkanı Reisi, Taliban'ı 1973 anlaşması taahhütlerini ihlal etmekle suçladı ve sert önlemlerle uyardı."),
    # 64 - 2022
    ("Etiyopya Üçüncü GERD Doldurmasını Gerçekleştirdi",
     "Etiyopya Başbakanı Abiy Ahmed, GERD rezervuarındaki su miktarının 22 milyar m³'e ulaştığını ve ikinci türbinin elektrik üretmeye başladığını duyurarak barajın geri döndürülemez bir gerçeklik olduğunu vurguladı."),
    # 65 - 2023
    ("Lahey Daimi Tahkim Mahkemesi İndus Yetkisini Onayladı",
     "Lahey Daimi Tahkim Mahkemesi (PCA), Hindistan'ın boykotuna ve itirazlarına rağmen Pakistan'ın Kishanganga ve Ratle barajları hakkındaki başvurusunu inceleme konusunda tam yetkili olduğuna hükmetti."),
    # 66 - 2023
    ("İsrail'in Gazze Su Altyapısına 250'den Fazla Saldırısı",
     "7 Ekim 2023 sonrası başlayan savaşta İsrail elektrik ve su tedarikini kesti; su kuyularını, tuzdan arındırma tesislerini ve kanalizasyon altyapısını bombalayarak Gazze nüfusunun %95'ini güvenli içme suyundan mahrum bıraktı ve insani felakete yol açtı."),
    # 67 - 2023
    ("İran-Afganistan Hilmend Ölümcül Çatışmaları",
     "Hilmend Nehri su hakları geriliminin zirveye çıkmasıyla İran sınır muhafızları ile Taliban güçleri arasında sınır kapısında çıkan ağır silahlı çatışmada her iki taraftan askerler hayatını kaybetti."),
    # 68 - 2023
    ("Hindistan Nagarjunasagar Barajı Polis Çatışması",
     "Krishna Nehri suları üzerinde anlaşmazlık yaşayan Hindistan'ın Andhra Pradeş ve Telangana eyaletleri, yüzlerce silahlı polisi Nagarjunasagar Barajı'na konuşlandırarak baraj kontrolü için fiili çatışmanın eşiğine geldi."),
    # 69 - 2024
    ("Kırgızistan-Tacikistan Nihai Sınır ve Su Anlaşması",
     "Yıllar süren kanlı çatışmaların ardından Kırgızistan ve Tacikistan heyetleri, ortak su tesislerinin yönetimi ve tartışmalı sınır hatlarının kesin olarak belirlenmesi konusunda tarihi bir nihai protokol üzerinde anlaştı."),
    # 70 - 2024
    ("GERD Resmi Açılışı Yapıldı, Mısır BM'ye Şikayet Etti",
     "Etiyopya Başbakanı Abiy Ahmed, GERD baraj gövdesinin ve dolusavaklarının tamamlandığını duyurdu. Mısır Dışişleri Bakanı Bedr Abdülati, BM Güvenlik Konseyi'ne resmi mektup yazarak tek taraflı eylemlerin bölgesel güvenliğe tehdit olduğunu bildirdi."),
    # 71 - 2025
    ("Hindistan Pahalgam Saldırısı Sonrası İndus Antlaşması'nı Askıya Aldı",
     "Hindistan, Keşmir'deki terör saldırılarının ardından Pakistan'a resmi bildirimde bulunarak 1960 İndus Suları Antlaşması'nın esaslı ihlal gerekçesiyle askıya alındığını ve sınır aşan nehir akışlarının tek taraflı yönetileceğini duyurdu."),
    # 72 - 2025
    ("ABD-Kanada Kolombiya Nehri Antlaşması Revizyonu Tıkandı",
     "Kolombiya Nehri Antlaşması'nın 60 yıllık sel kontrolü ve 'Kanada Yetkisi' enerji paylaşımı hükümlerinin modern iklim ve yerli halk haklarına göre güncellenmesi müzakereleri tarafların tazminat anlaşmazlığı sebebiyle kilitlendi."),
    # 73 - 2025
    ("Kırgızistan-Tacikistan-Özbekistan Su Zirvesi",
     "Üç Orta Asya cumhuriyetinin liderleri Fergana Vadisi'nde toplanarak Kambarata-1 Hidroelektrik Santrali'nin ortak inşası ve yaz sulama sezonu için garantili su salımları konusunda mutabakata vardı."),
    # 74 - 1922
    ("Kolorado Nehri Sözleşmesi İmzalandı",
     "Herbert Hoover başkanlığında yedi ABD eyaleti (Wyoming, Colorado, Utah, New Mexico, Nevada, Arizona, California), yıllık 15 milyon akre-feet Kolorado Nehri suyunu Yukarı ve Aşağı Havza arasında eşit paylaştıran tarihi sözleşmeyi imzaladı."),
    # 75 - 1944
    ("ABD-Meksika Rio Grande ve Kolorado Nehri Antlaşması",
     "Amerika Birleşik Devletleri ve Meksika, Rio Grande, Kolorado ve Tijuana nehirlerinin sularını paylaştıran ve ikili sınır suları komisyonunu (IBWC) kuran kapsamlı sınır aşan su antlaşmasını imzaladı."),
    # 76 - 1965
    ("İsrail Ulusal Su Taşıyıcısı İşletmeye Alındı",
     "İsrail, Taberiye Gölü'nden güneydeki Necef Çölü'ne devasa boru hatlarıyla yılda yüz milyonlarca metreküp su aktaran Ulusal Su Taşıyıcısı projesini devreye aldı; Arap devletleri projeyi şiddetle kınadı."),
    # 77 - 1969
    ("Ren Nehri Kimyasal Kirlilik Krizi",
     "Ren Nehri'ne karışan böcek ilacı Endosulfan, Almanya ve Hollanda boyunca 20 milyondan fazla balığın ölümüne yol açarak Ren Nehri'ni 'Avrupa'nın kanalizasyonu' haline getirdi ve acil çevre koruma yasalarını tetikledi."),
    # 78 - 1986
    ("Sandoz Kimyasal Faciası Ren Nehri'ni Zehirledi",
     "İsviçre'nin Basel kentindeki Sandoz kimya deposunda çıkan yangın sonrası tonlarca zehirli tarım ilacı ve cıva Ren Nehri'ne karıştı; yüzlerce kilometre boyunca nehir yaşamı yok oldu ve kıyıdaş ülkelerin içme suyu alımı durduruldu."),
    # 79 - 1994
    ("Ren Eylem Programı ile Somon Balığı Geri Döndü",
     "Uluslararası Ren Koruma Komisyonu'nun (ICPR) kararlı arıtma ve balık geçidi yatırımları sayesinde kirlilik %90 oranında azaldı ve 50 yıl aradan sonra somon balıkları yeniden Ren Nehri'nde üremeye başladı."),
    # 80 - 1960
    ("Sovyetler Birliği Aral Denizi Nehirlerini Pamuğa Yönlendirdi",
     "Sovyet merkezi planlaması, Aral Denizi'ni besleyen Seyhun ve Ceyhun nehirlerinin sularını Özbekistan ve Türkmenistan'ın uçsuz bucaksız pamuk tarlalarını sulamak için Karakum Kanalı'na aktarma kararı alarak tarihin en büyük çevre felaketini başlattı."),
    # 81 - 1990
    ("Aral Denizi Kuzey ve Güney Olarak İkiye Bölündü",
     "Su seviyesinin dramatik şekilde düşmesiyle dünyanın en büyük dördüncü gölü olan Aral Denizi iki ayrı su kütlesine bölündü; suların çekildiği alanlar zehirli tuz ve toz fırtınaları üreten Aralkum Çölü'ne dönüştü."),
    # 82 - 1972
    ("Hindistan-Bangladeş Ortak Nehirler Komisyonu (JRC)",
     "Bangladeş'in bağımsızlığının hemen ardından iki ülke, 54 ortak sınır aşan akarsuyun hidrolojik verilerini paylaşmak ve ortak sel tahminleri üretmek amacıyla Ortak Nehirler Komisyonu'nu kurdu."),
    # 83 - 1974
    ("Hindistan-Bangladeş Farakka Barajı Ortak Bildirisi",
     "Başbakanlar İndira Gandi ve Şeyh Mucibur Rahman, Farakka Barajı tam kapasiteye geçmeden önce Bangladeş'e kurak mevsimde yeterli su bırakılmasını teminat altına alan ortak bir bildiri yayımladı."),
    # 84 - 2000
    ("Tuna Nehri Romanya Altın Madeni Siyanür Felaketi",
     "Romanya'nın Baia Mare kentindeki bir altın madeninin atık barajının çökmesi sonucu 100.000 m³ siyanürlü ve ağır metalli su Somes, Tisa ve Tuna nehirlerine aktı; Macaristan ve Sırbistan'da tüm sucul ekosistem çöktü."),
    # 85 - 1989
    ("Moritanya-Senegal Sınır ve Su Savaşı",
     "Senegal Nehri taşkın yatağındaki verimli tarım ve otlatma arazilerinin kontrolü yüzünden iki ülke arasında çıkan etnik ve askeri çatışmalarda yüzlerce insan öldü, on binlerce vatandaş karşılıklı olarak sınır dışı edildi."),
    # 86 - 1980
    ("Zambezi Nehri Sistemi Eylem Planı (ZACPLAN)",
     "Zambezi kıyıdaş devletleri, BM Çevre Programı (UNEP) öncülüğünde nehir havzasının entegre yönetimi, ekolojik dengesi ve hidrolojik bilgi sistemlerinin kurulması için ZACPLAN'ı başlattı."),
    # 87 - 1929
    ("İngiliz-Mısır Nil Suları Anlaşması",
     "İngiltere ve Mısır arasında teati edilen notalarla Mısır'a yıllık 48 milyar m³ su tahsis edildi ve Mısır'a yukarı Nil havzasındaki her türlü su yapısı üzerinde mutlak veto yetkisi tanındı."),
    # 88 - 1948
    ("İsrail'in Bağımsızlığı: Arap Devletlerinin Su Tehditleri",
     "İsrail Devleti'nin kuruluşu ve 1948 Arap-İsrail Savaşı sonrasında Şeria Nehri ve kolları askeri temas hatlarının merkezinde kalarak bölgesel su çatışmalarının ana zeminini oluşturdu."),
    # 89 - 1967
    ("İsrail Batı Şeria Yeraltı Su Kaynaklarını Ele Geçirdi",
     "1967 savaşının ardından İsrail Askeri İdaresi, 92 ve 158 sayılı askeri emirlerle Batı Şeria'daki tüm su kaynaklarının kontrolünü orduya devretti; Filistinlilerin yeni kuyu açması yasaklandı ve kotalar getirildi."),
    # 90 - 1995
    ("Oslo II Anlaşması Batı Şeria Su Hükümleri",
     "İsrail-Filistin Geçici Anlaşması (Oslo II) Madde 40, Filistin su haklarını ilk kez prensipte tanıdı ve Ortak Su Komitesi'ni (JWC) kurdu, ancak Batı Şeria dağ akiferlerinin %80'inden fazlasının kontrolünü İsrail'e bıraktı."),
    # 91 - 2000
    ("Lauca Nehri Saptırması: Şili-Bolivya Süregiden İhtilafı",
     "Şili'nin sınır aşan Lauca Nehri sularını Azapa Vadisi tarımına yönlendirmesi, denize çıkışı olmayan Bolivya'nın sert protestolarına yol açtı ve iki ülke arasındaki diplomatik ilişkilerin kesilmesinin başlıca nedenlerinden biri oldu."),
    # 92 - 1960
    ("Çad Gölü Havzası Komisyonu (LCBC) Kuruldu",
     "Kamerun, Çad, Nijer ve Nijerya, Afrika'nın en hayati sulak alanlarından biri olan Çad Gölü havzasını sürdürülebilir yönetmek ve balıkçılık ile tarımı koordine etmek amacıyla LCBC'yi kurdu."),
    # 93 - 2001
    ("Çad Gölü'nün Çöküşü Bölgesel İnsani Krizi Tetikledi",
     "Aşırı sulama ve iklim değişikliği yüzünden Çad Gölü yüzey alanının %90'dan fazlasını kaybederek 2.500 km²'nin altına düştü; 30 milyon insan geçim kaynağını yitirerek Boko Haram gibi çatışma dinamiklerine açık hale geldi."),
    # 94 - 1991
    ("Körfez Savaşı: Irak Güçlerinin Körfez Sularına Petrol Akıtması",
     "Irak ordusu Kuveyt'ten çekilirken yüz milyonlarca galon ham petrolü Basra Körfezi'ne boşalttı; 600 mil uzunluğundaki petrol tabakası Suudi Arabistan ve Körfez ülkelerinin deniz suyu arıtma tesislerini tehdit etti."),
    # 95 - 2002
    ("Lesotho Yaylaları Su Projesi (LHWP): Güney Afrika-Lesotho",
     "Lesotho ve Güney Afrika, Senqu/Orange Nehri sularını tünellerle Johannesburg sanayi bölgesine aktaran ve Lesotho'ya elektrik ile telif geliri sağlayan milyarlarca dolarlık LHWP 1. Aşamasını tamamladı."),
    # 96 - 1979
    ("Hindistan Farakka Barajı'nı Kalıcı Olarak İşletmeye Aldı",
     "1977 geçici anlaşmasının ardından Hindistan, Farakka Barajı saptırma kanallarını kalıcı altyapıya dönüştürdü; Bangladeş barajın Padma Nehri deltasında tuzlanma ve çölleşmeye yol açtığını uluslararası platformlara taşıdı."),
    # 97 - 2016
    ("Hindistan Daimi İndus Komisyonu Görüşmelerini Askıya Aldı",
     "Uri askeri üssüne yapılan saldırının ardından Hindistan Başbakanı Narendra Modi 'Kan ve su birlikte akamaz' diyerek Daimi İndus Komisyonu'nun rutin toplantılarını dondurdu."),
    # 98 - 2012
    ("Kolorado Nehri On Yıllar Sonra İlk Kez Denize Ulaştı",
     "ABD ve Meksika'nın imzaladığı Tarihi 319 Sayılı Karar (Minute 319) kapsamında barajlardan çevreye bırakılan 'nabız akışı' sayesinde Kolorado Nehri, on yıllar sonra ilk kez Meksika'daki Cortez Denizi'ne ulaştı."),
    # 99 - 1975
    ("Mekong Komitesi Vietnam Savaşı Sırasında Askıya Alındı",
     "Saygon'un düşüşü ve Kamboçya'da Kızıl Kmerler'in iktidara gelmesiyle Mekong Komitesi fiilen felç oldu; bölgesel jeopolitik düşmanlıklar su diplomasisini yıllarca durma noktasına getirdi."),
    # 100 - 1970
    ("Bangladeş Kurtuluş Savaşı ve Brahmaputra Suları",
     "Doğu Pakistan'daki savaş ve mülteci krizi döneminde sınır sularının stratejik ve lojistik kullanımı Hindistan ile Pakistan arasındaki çatışmanın merkezinde yer aldı."),
    # 101 - 2006
    ("Gine OMVS Senegal Nehri Havzası Otoritesine Katıldı",
     "Senegal Nehri'nin doğduğu kaynak ülke olan Gine, OMVS'ye dördüncü tam üye olarak katılarak havzanın tüm su kaynaklarının ortak mülkiyet ve entegre yönetim altına girmesini sağladı."),
    # 102 - 1990
    ("Asvan Yüksek Barajı Alüvyon Yoksunluğu Tartışması",
     "Nil boyunca yapılan bilimsel araştırmalar, Asvan Barajı'nın yıllık 130 milyon ton verimli alüvyonu tutması yüzünden Nil Deltası'nın Akdeniz dalgalarıyla hızla aşındığını ve Mısır tarımının kimyasal gübreye bağımlı kaldığını belgeledi."),
    # 103 - 2013
    ("Burundi Nil CFA'yı İmzaladı",
     "Burundi, Nil İşbirliği Çerçeve Anlaşması'nı (CFA) imzalayan altıncı yukarı havza ülkesi olarak anlaşmanın yürürlüğe girmesi için gereken kritik onay eşiğine kapı araladı."),
    # 104 - 2021
    ("Taliban'ın İktidarı Ele Geçirmesi ve Hilmend Antlaşması",
     "Kabil'in düşmesiyle iktidara gelen Taliban geçici hükümeti, İran'ın Hilmend su hakkı talepleri karşısında su akışının yetersizliğini kuraklığa bağlayarak Tahran ile tansiyonu yükseltti."),
    # 105 - 2020
    ("Çin Kuraklık Sırasında Mekong Su Salımlarını Açıkladı",
     "Güneydoğu Asya ülkelerinin ve ABD destekli Mekong Gözlem Projesi'nin yoğun uydu verisi baskısı üzerine Çin, kuraklıkla mücadele için Jinghong Barajı'ndan acil su salımı yaptığını duyurdu."),
    # 106 - 2023
    ("Özbekistan 2024 Su Olağanüstü Hali İlan Etti",
     "Ceyhun ve Seyhun nehirlerindeki tarihi su kayıpları ve kuraklık nedeniyle Özbekistan Cumhurbaşkanı Şevket Mirziyoyev, tarımda su israfını önlemek için ülke çapında olağanüstü su tasarrufu rejimi ilan etti."),
    # 107 - 1994
    ("Ren Koruma Sözleşmesi Yürürlüğe Girdi",
     "Bern'de imzalanan yeni Ren Koruma Sözleşmesi yürürlüğe girerek kıyıdaş devletler arasında ekolojik hedefleri, sel korunmasını ve sürdürülebilir taşkın yatağı restorasyonunu yasal zorunluluk haline getirdi."),
    # 108 - 2002
    ("Hindistan-Nepal Mahakali Antlaşması Anlaşmazlıkları",
     "1996 Mahakali Antlaşması'nın öngördüğü Pancheshwar Çok Amaçlı Baraj Projesi, güç paylaşımı, su hakları ve sınır tespiti konusundaki siyasi kutuplaşmalar sebebiyle Nepal parlamentosunda kilitlendi."),
    # 109 - 2015
    ("Çin Lancang-Mekong İşbirliği (LMC) Mekanizmasını Başlattı",
     "Çin, Batı destekli Mekong Nehri Komisyonu'na alternatif olarak altı kıyıdaş ülkenin tamamını kapsayan ve Pekin tarafından finanse edilen Lancang-Mekong İşbirliği Mekanizması'nı kurdu."),
    # 110 - 2014
    ("Sudan GERD Müzakerelerinde Mısır'dan Ayrıştı",
     "Sudan hükümeti, GERD Barajı'nın Mavi Nil taşkınlarını önleme ve ucuz hidroelektrik sağlama faydalarını görerek Etiyopya ile ortak pozisyon almaya başladı ve Mısır'ın mutlak muhalefet cephesinden koptu."),
    # 111 - 2019
    ("Uganda Nil CFA'yı Onayladı",
     "Uganda Parlamentosu, Nil Havzası İşbirliği Çerçeve Anlaşması'nı (CFA) onaylayarak Nil Havzası Komisyonu'nun resmen kurulmasına bir adım daha yaklaştırdı."),
    # 112 - 2017
    ("İsrail-Filistin Batı Şeria Suya Erişim Engelleri",
     "Uluslararası insan hakları raporları, İsrailli yerleşimcilerin Batı Şeria'da kişi başına günlük 300 litre su kullanırken, kırsal Filistin topluluklarının Dünya Sağlık Örgütü asgari standardı olan 100 litrenin çok altında (20-70 litre) suya erişebildiğini belgeledi."),
    # 113 - 2023
    ("Güney Sudan Nil CFA'ya Katılım Sürecini Başlattı",
     "Güney Sudan Geçici Ulusal Yasama Meclisi, Nil İşbirliği Çerçeve Anlaşması'na (CFA) katılım tasarısını onaylayarak anlaşmanın uluslararası hukuken yürürlüğe girmesi için gereken son onayı sağlama yoluna girdi."),
    # 114 - 2010
    ("Sudan Beyaz Nil Su Paylaşımı Anlaşmazlığı",
     "Güney Sudan'ın bağımsızlık referandumu öncesinde, Beyaz Nil ve Bahr el-Gazal havzalarındaki su kaynaklarının ve Sudd bataklıklarındaki Jonglei Kanalı projesinin geleceği Hartum ile Cuba arasında tartışma konusu oldu."),
    # 115 - 1973
    ("Amerikanlararası Su Hakları: ABD-Meksika Kolorado Tuzluluk Anlaşması",
     "ABD ve Meksika, ABD'nin Wellton-Mohawk sulama bölgesinden Meksika'ya boşalttığı aşırı tuzlu suların arıtılmasını zorunlu kılan 242 Sayılı Tarihi Kararı (Minute 242) imzaladı."),
    # 116 - 1985
    ("Dicle ve Fırat Üzerinde Musul ve Hadise Barajları İnşa Edildi",
     "Irak, Türkiye ve Suriye'nin baraj projelerine karşı su depolama kapasitesini güvenceye almak amacıyla Dicle üzerinde Musul (Saddam) Barajı'nı ve Fırat üzerinde Hadise (Kadisiyye) Barajı'nı tamamladı."),
    # 117 - 2009
    ("GERD Barajı Jeolojik Etütleri Başlatıldı",
     "Etiyopya Elektrik Enerjisi Şirketi ve İtalyan müteahhit Salini Impregilo (Webuild), Mavi Nil vadisinde gizlilik içinde GERD Barajı'nın temel sondaj ve yerinde jeolojik etüt çalışmalarına başladı."),
    # 118 - 2004
    ("Lancang-Mekong Baraj Kademeleri Aşağı Havzayı Alarma Geçirdi",
     "Çin'in Dachaoshan Barajı'nı tamamlaması ve dev Xiaowan ile Nuozhadu mega barajlarının inşaatına hız vermesi, Tayland, Kamboçya ve Vietnam'da nehir akış rejiminin tek taraflı kontrol edilmesine yönelik derin endişeler yarattı."),
    # 119 - 2024
    ("Nil CFA Anlaşması 6 Ülkenin Onayıyla Yürürlüğe Girdi",
     "Güney Sudan'ın onay belgelerini teslim etmesiyle Nil İşbirliği Çerçeve Anlaşması (CFA) 60 gün sonra yürürlüğe girdi; bu gelişmeyle tarihte ilk kez Mısır ve Sudan'ın vetosu olmaksızın Nil Havzası Komisyonu hukuken faaliyete geçti."),
    # 120 - 2023
    ("Özbekistan Aral Krizi Ortasında Sulanan Alanları Genişletti",
     "Aral Denizi kuruma felaketine rağmen Özbekistan ve komşu bölgelerde su yoğun tarım ve yeni baraj projeleri devam ederken, Türkmenistan'ın Karakum Gölü projesi ve Afganistan'ın Kuş Tepe Kanalı Amuderya akışını daha da tehdit eder hale geldi.")
]

with open('client/public/data/water_conflicts.json', 'r', encoding='utf-8') as f:
    conflicts = json.load(f)

print(f"Loaded {len(conflicts)} conflicts, {len(translations)} translations.")
assert len(conflicts) == len(translations), f"Mismatch: {len(conflicts)} vs {len(translations)}"

out_lines = []
out_lines.append("/**")
out_lines.append(" * Turkish translations for all 121 historical water conflict and cooperation events.")
out_lines.append(" * Auto-generated with exact diplomatic and academic terminology.")
out_lines.append(" */")
out_lines.append("")
out_lines.append("export interface ConflictTr {")
out_lines.append("  title: string;")
out_lines.append("  description: string;")
out_lines.append("}")
out_lines.append("")
out_lines.append("export const conflictsTrById: Record<string, ConflictTr> = {")

for i, (c, (t_tr, d_tr)) in enumerate(zip(conflicts, translations)):
    t_clean = t_tr.replace('"', '\\"')
    d_clean = d_tr.replace('"', '\\"')
    out_lines.append(f'  "conflict-{i}": {{')
    out_lines.append(f'    title: "{t_clean}",')
    out_lines.append(f'    description: "{d_clean}",')
    out_lines.append("  },")

out_lines.append("};")
out_lines.append("")

out_lines.append("export const conflictsTrByTitle: Record<string, ConflictTr> = {")
for i, (c, (t_tr, d_tr)) in enumerate(zip(conflicts, translations)):
    orig_title = c["title"].replace('"', '\\"')
    t_clean = t_tr.replace('"', '\\"')
    d_clean = d_tr.replace('"', '\\"')
    out_lines.append(f'  "{orig_title}": {{')
    out_lines.append(f'    title: "{t_clean}",')
    out_lines.append(f'    description: "{d_clean}",')
    out_lines.append("  },")
out_lines.append("};")
out_lines.append("")

out_lines.append("/**")
out_lines.append(" * Resolves Turkish translation for a water conflict event.")
out_lines.append(" */")
out_lines.append("export function getConflictTranslation(idOrTitle: string, index?: number): ConflictTr | undefined {")
out_lines.append("  if (!idOrTitle && index === undefined) return undefined;")
out_lines.append("  if (idOrTitle && conflictsTrById[idOrTitle]) return conflictsTrById[idOrTitle];")
out_lines.append("  if (idOrTitle && conflictsTrByTitle[idOrTitle]) return conflictsTrByTitle[idOrTitle];")
out_lines.append("  if (index !== undefined && conflictsTrById[`conflict-${index}`]) return conflictsTrById[`conflict-${index}`];")
out_lines.append("  return undefined;")
out_lines.append("}")
out_lines.append("")

with open("client/src/data/conflictsTr.ts", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print("Successfully written to client/src/data/conflictsTr.ts")
