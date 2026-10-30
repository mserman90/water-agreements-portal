/**
 * Turkish translations for all 124 historical water conflict and cooperation events.
 * Fully aligned with the Pacific Institute Water Conflict Chronology (Dr. Peter H. Gleick)
 * and Oregon State University (OSU) Transboundary Freshwater Dispute Database (TFDD) BAR Scale.
 * Source: https://worldwater.org/conflict/refs.html
 */

export interface ConflictTr {
  title: string;
  description: string;
}

export type PacificCategoryType = 'trigger' | 'weapon' | 'casualty' | 'cooperation';

export interface PacificCategoryInfo {
  type: PacificCategoryType;
  labelTr: string;
  labelEn: string;
  badgeTr: string;
  badgeEn: string;
  descriptionTr: string;
  descriptionEn: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}

export const PACIFIC_CATEGORIES: Record<PacificCategoryType, PacificCategoryInfo> = {
  trigger: {
    type: 'trigger',
    labelTr: 'Tetikleyici',
    labelEn: 'Trigger',
    badgeTr: '🎯 TETİKLEYİCİ',
    badgeEn: '🎯 TRIGGER',
    descriptionTr: 'Suyun kontrolü veya kıtlığı nedeniyle ortaya çıkan uyuşmazlıklar şiddet ve çatışmaları tetiklemiştir.',
    descriptionEn: 'Water resources or water systems as a trigger or root cause of conflict or violence.',
    icon: '🎯',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
  },
  weapon: {
    type: 'weapon',
    labelTr: 'Silah / Baskı Aracı',
    labelEn: 'Weapon / Instrument',
    badgeTr: '⚔️ SİLAH',
    badgeEn: '⚔️ WEAPON',
    descriptionTr: 'Su kaynakları veya sistemleri bir savaş aracı, baskı unsuru veya silah olarak kullanılmıştır.',
    descriptionEn: 'Water resources or water systems used as a weapon, tool, or instrument of war.',
    icon: '⚔️',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fca5a5',
  },
  casualty: {
    type: 'casualty',
    labelTr: 'Hedef / Zayiat',
    labelEn: 'Casualty / Target',
    badgeTr: '💥 HEDEF / ZAYİAT',
    badgeEn: '💥 CASUALTY',
    descriptionTr: 'Su altyapısı (barajlar, arıtma tesisleri, su kanalları) çatışmalarda doğrudan hedef alınmış veya tahrip edilmiştir.',
    descriptionEn: 'Water infrastructure (dams, treatment facilities, pipelines) targeted or damaged in warfare.',
    icon: '💥',
    color: '#9333ea',
    bg: '#faf5ff',
    border: '#d8b4fe',
  },
  cooperation: {
    type: 'cooperation',
    labelTr: 'İşbirliği / Çözüm',
    labelEn: 'Cooperation / Solution',
    badgeTr: '🤝 İŞBİRLİĞİ',
    badgeEn: '🤝 COOPERATION',
    descriptionTr: 'Diplomatik antlaşma, nehir havzası örgütü veya barışçıl uyuşmazlık çözümü başarılmıştır.',
    descriptionEn: 'Transboundary water agreement, river basin commission, or diplomatic peace resolution.',
    icon: '🤝',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#86efac',
  },
};

export const conflictsTrById: Record<string, ConflictTr> = {
  "conflict-0": {
    title: "Hindistan-Pakistan İndus Kanalı Su İhtilafı",
    description: "Bölünmenin ardından Hindistan, 1 Nisan 1948'de Yukarı Bari Doab Kanalı sisteminden Pakistan kanallarına akan suyu keserek milyonlarca dönüm tarım arazisini etkiledi. Haftalarca süren kriz, Mayıs 1948'de imzalanan acil Hakimiyetlerarası Anlaşma ile çözüldü.",
  },
  "conflict-1": {
    title: "Mısır'ın Etiyopya Nil Projelerini Protestosu",
    description: "Mısır, 1929 İngiliz-Mısır Nil Suları Anlaşması'nı gerekçe göstererek ve Mısır'ın tarihi su haklarının tanınmasını talep ederek, Etiyopya'da Nil debisini etkileyebilecek her türlü yukarı havza su yapısına resmi olarak itiraz etti.",
  },
  "conflict-2": {
    title: "Şeria Nehri İçin Johnston Planı Müzakereleri",
    description: "ABD özel temsilcisi Eric Johnston, Şeria Nehri sularını paylaştırmak için İsrail ile Arap devletleri arasında çok yıllı müzakereler yürüttü. Su kotalarında teknik uzlaşmaya varılmasına rağmen plan, İsrail'in tanınmasına ilişkin siyasi endişeler sebebiyle 1955'te Arap Birliği tarafından reddedildi.",
  },
  "conflict-3": {
    title: "Mekong Komitesi'nin Kuruluşu",
    description: "Kamboçya, Laos, Tayland ve Güney Vietnam, BM himayesinde Aşağı Mekong Havzası İncelemeleri Koordinasyon Komitesi'ni (Mekong Komitesi) kurarak Mekong işbirliği için ilk kurumsal çerçeveyi oluşturdu.",
  },
  "conflict-4": {
    title: "Mısır-Sudan Nil Suları Anlaşması",
    description: "Mısır ve Sudan, yıllık 55,5 milyar m³ suyu Mısır'a ve 18,5 milyar m³ suyu Sudan'a tahsis eden kapsamlı bir su paylaşım anlaşması imzaladı; bu anlaşma Asvan Yüksek Barajı'nın inşasını sağladı. Yukarı kıyıdaş devletler müzakerelerin dışında bırakıldı.",
  },
  "conflict-5": {
    title: "İndus Suları Antlaşması İmzalandı",
    description: "Hindistan ve Pakistan, Dünya Bankası arabuluculuğunda Karaçi'de İndus Suları Antlaşması'nı imzaladı. Antlaşma, doğu nehirlerini (Ravi, Beas, Sutlej) Hindistan'a ve batı nehirlerini (İndus, Jhelum, Chenab) Pakistan'a tahsis ederek bölünme sonrası on yıllık anlaşmazlığı çözdü.",
  },
  "conflict-6": {
    title: "Etiyopya 1929 Nil Anlaşmasının Geçerliliğine İtiraz Etti",
    description: "Etiyopya, 1929 İngiliz-Mısır Nil Suları Anlaşması'nın Etiyopya'nın rızası olmadan imzalandığını ve Mavi Nil ile Tana Gölü kolları üzerindeki haklarını bağlamayacağını belirterek anlaşmanın geçerliliğine resmen meydan okudu.",
  },
  "conflict-7": {
    title: "Kolombiya Nehri Antlaşması İmzalandı",
    description: "Amerika Birleşik Devletleri ve Kanada, sel kontrolü ve hidroelektrik amacıyla Britanya Kolombiyası'nda üç baraj inşasını öngören Kolombiya Nehri Antlaşması'nı imzaladı. ABD sel kontrolü sağladı ve Kanada'ya yaklaşık 65 milyon dolar ödedi; Kanada ise aşağı havza enerji faydalarının yarısını aldı.",
  },
  "conflict-8": {
    title: "Asvan Yüksek Barajı İnşası Sovyet Yardımıyla Başladı",
    description: "Mısır, Sovyetler Birliği'nin finansal ve teknik yardımıyla Asvan Yüksek Barajı'nın inşasına başladı. Proje, Mısır için taşkın kontrolü ve sulama güvencesi sağlarken Nil akış rejimi ve alüvyon taşınımını kalıcı olarak değiştirdi.",
  },
  "conflict-9": {
    title: "Niamey Nijer Havzası Senedi",
    description: "Dokuz Nijer kıyıdaş devleti, seyrüsefer ve ekonomik kalkınmayı düzenleyen Niamey Senedi'ni kabul etti; bu girişim sömürge sonrası Batı Afrika'da ilk çok taraflı nehir havzası anlaşması oldu.",
  },
  "conflict-10": {
    title: "İsrail-Suriye Şeria Nehri Su Çatışmaları Başladı",
    description: "İsrail'in Ulusal Su Taşıyıcısı projesini tamamlamasının ardından Arap Birliği, Baniyas ve Hasbani kollarını Şeria'dan uzaklaştırmak için karşı su yönlendirme projeleri başlattı. İsrail Savunma Kuvvetleri bu inşaatları vurdu ve bu durum 1967 savaşına giden süreçte gerilimi tırmandırdı.",
  },
  "conflict-11": {
    title: "Nijer Nehri Komisyonu Kuruldu",
    description: "Niamey Senedi'ni takiben kıyıdaş ülkeler, ortak su kaynaklarını yönetmek ve navigasyonu koordine etmek üzere Nijer Nehri Komisyonu'nu resmen kurdu.",
  },
  "conflict-12": {
    title: "Altı Gün Savaşı: Bir Casus Belli Olarak Su",
    description: "İsrail, Şeria Nehri'nin yukarı kollarını (Baniyas ve Golan Tepeleri) ve Batı Şeria dağ akiferlerini ele geçirdi. Su kaynaklarının kontrolü, savaşın önemli bir stratejik faktörüydü ve İsrail'in su güvenliğini kökten değiştirdi.",
  },
  "conflict-13": {
    title: "Asvan Yüksek Barajı Tamamlandı",
    description: "Mısır, Nasır Gölü rezervuarını oluşturan Asvan Yüksek Barajı'nı resmen hizmete açtı. Baraj, Mısır'a çok yıllık su depolama olanağı sundu ancak yukarı kıyıdaşlar ile Mısır'ın su bağımlılığı dengesini pekiştirdi.",
  },
  "conflict-14": {
    title: "OMVS Senegal Nehri Havzası Örgütü Kuruldu",
    description: "Mali, Moritanya ve Senegal, Senegal Nehri Kalkınma Örgütü'nü (OMVS) kurarak ortak baraj yatırımları ve su yönetimi için dünyada örnek gösterilen bir ortak mülkiyet ve fayda paylaşımı mekanizması hayata geçirdi.",
  },
  "conflict-15": {
    title: "Helmand Nehri Antlaşması: Afganistan-İran",
    description: "Afganistan ve İran, Helmand (Hirmand) Nehri'nden İran'ın Sistan bölgesine normal hidrolojik koşullarda saniyede 22 m³ su akışını garanti altına alan tarihi bir su paylaşım antlaşması imzaladı.",
  },
  "conflict-16": {
    title: "Türkiye-Suriye Fırat Krizi",
    description: "Türkiye'nin Keban Barajı ile Suriye'nin Tabka Barajı'nı aynı dönemde doldurması ve yaşanan şiddetli kuraklık, Irak'a ulaşan Fırat akışını kritik seviyelere düşürdü. Irak ve Suriye askeri birliklerini sınıra yığdı; Suudi Arabistan ve Sovyet diplomatik arabuluculuğuyla çatışma kıl payı önlendi.",
  },
  "conflict-17": {
    title: "Hindistan Ganj Üzerindeki Farakka Bendi'ni Açtı",
    description: "Hindistan, Kalküta Limanı'ndaki silt birikimini temizlemek amacıyla Ganj sularını Hooghly Nehri'ne yönlendiren Farakka Bendi'ni devreye soktu; bu durum aşağı kıyıdaş Bangladeş'te kuru mevsim akışlarını ciddi şekilde azalttı.",
  },
  "conflict-18": {
    title: "Ren Nehri Tuz Kirliliği Sözleşmesi",
    description: "Fransa, Almanya, Hollanda, İsviçre ve Lüksemburg, Alsas potas madenlerinden Ren Nehri'ne yapılan klorür deşarjını sınırlamak ve aşağı havza su kalitesini korumak amacıyla Bonn Klorür Sözleşmesi'ni imzaladı.",
  },
  "conflict-19": {
    title: "Mısır Devlet Başkanı Enver Sedat Nil İçin Savaş Tehdidinde Bulundu",
    description: "Mısır Cumhurbaşkanı Enver Sedat, Etiyopya'nın Nil sularını kesebilecek veya azaltabilecek herhangi bir girişimine karşı Mısır'ın askeri güç kullanmaktan çekinmeyeceğini açıkça ilan etti.",
  },
  "conflict-20": {
    title: "Nijer Havzası Otoritesi (NBA) Kuruldu",
    description: "Eski Nijer Nehri Komisyonu yeniden yapılandırılarak daha geniş yetkilerle donatılmış Nijer Havzası Otoritesi'ne (NBA) dönüştürüldü ve 9 kıyıdaş devletin entegre havza yönetimi güçlendirildi.",
  },
  "conflict-21": {
    title: "Irak Mezopotamya Bataklıklarını Silah Olarak Kuruttu",
    description: "Saddam Hüseyin rejimi, Şii muhalifleri ve bataklık Araplarını sindirmek amacıyla Fırat ve Dicle nehirlerinin sularını yönlendirip kurutma kanalları açarak Mezopotamya bataklıklarının %90'ını yok etti ve suyu bir cezalandırma silahı olarak kullandı.",
  },
  "conflict-22": {
    title: "Türkiye-Suriye Fırat Suyu-Güvenlik Protokolü",
    description: "Türkiye ve Suriye, Türkiye'nin Fırat sınırından Suriye'ye aylık ortalama en az 500 m³/sn su bırakmasını taahhüt ettiği, Suriye'nin ise sınır güvenliği konusunda güvence verdiği bir Ekonomik İşbirliği Protokolü imzaladı.",
  },
  "conflict-23": {
    title: "Hindistan-Bangladeş Ganj İhtilafı Derinleşti",
    description: "Önceki geçici su paylaşım anlaşmalarının süresi dolduktan sonra müzakereler tıkandı; Bangladeş, kurak mevsimde tarımsal verim kaybı ve tuzlanma gerekçesiyle Hindistan'ı tek taraflı su çekmekle suçladı.",
  },
  "conflict-24": {
    title: "Türkiye Körfez Savaşı Sırasında Fırat Akışını Kesti",
    description: "Türkiye, dev Atatürk Barajı rezervuarını doldurmak amacıyla Fırat akışını bir ay süreyle kesti. Önceden komşu ülkelere duyurulmuş ve ilave su verilmiş olmasına rağmen, yaklaşan Körfez Savaşı gerilimiyle birlikte Irak ve Suriye sert diplomatik tepki gösterdi.",
  },
  "conflict-25": {
    title: "Aral Denizi Devletlerarası Su Koordinasyon Komisyonu (ICWC)",
    description: "Sovyetler Birliği'nin dağılmasının ardından beş Orta Asya cumhuriyeti (Kazakistan, Kırgızistan, Tacikistan, Türkmenistan, Özbekistan), Seyhun ve Ceyhun havzalarındaki su kotalarını ortak yönetmek için Almatı Anlaşması ile ICWC'yi kurdu.",
  },
  "conflict-26": {
    title: "Aral Denizi Orta Asya Bütçe Taahhüdü (Nukus Deklarasyonu)",
    description: "Beş Orta Asya lideri Nukus'ta toplanarak Aral Denizi'ni Kurtarma Uluslararası Fonu'na (IFAS) ulusal bütçelerinin belirli bir oranını aktarmayı taahhüt etti.",
  },
  "conflict-27": {
    title: "İsrail-Ürdün Barış Antlaşması Su Hükümleri",
    description: "İsrail ile Ürdün arasında imzalanan Barış Antlaşması'nın II. Eki, Şeria ve Yermuk nehirlerinin sularının paylaşımı ile ortak tuz giderme ve su depolama projelerini düzenleyen kalıcı bir rejim getirdi.",
  },
  "conflict-28": {
    title: "Mekong Nehri Komisyonu Anlaşması",
    description: "Kamboçya, Laos, Tayland ve Vietnam, Aşağı Mekong Havzası'nın sürdürülebilir kalkınması için Chiang Rai Anlaşması'nı imzalayarak Mekong Nehri Komisyonu'nu (MRC) oluşturdu; ancak yukarı kıyıdaşlar Çin ve Myanmar tam üye olmadı.",
  },
  "conflict-29": {
    title: "Çin Mekong (Lancang) Üzerinde Manwan Barajını İnşa Etti",
    description: "Çin, Yukarı Mekong (Lancang) üzerindeki ilk büyük hidroelektrik barajı olan Manwan'ı işletmeye aldı; bu durum aşağı havza ülkelerinde akış rejiminin bozulacağı ve tortu akışının kesileceği endişelerini başlattı.",
  },
  "conflict-30": {
    title: "Hindistan-Bangladeş Ganj Suları Paylaşım Antlaşması",
    description: "Hindistan ve Bangladeş, Farakka Bendi'nde 30 yıllık bağlayıcı bir su paylaşım formülü belirleyen tarihi Ganj Antlaşması'nı imzalayarak yarım asırlık uyuşmazlığı kurumsal bir çözüme kavuşturdu.",
  },
  "conflict-31": {
    title: "Irak Dicle ve Fırat İçin Nihai Su Paylaşım Anlaşması Çağrısı Yaptı",
    description: "Irak, Türkiye'nin GAP projeleri ve Suriye barajları nedeniyle debilerin azaldığını belirterek üç kıyıdaş devlet arasında bağlayıcı ve nihai bir su tahsis anlaşması imzalanması çağrısında bulundu.",
  },
  "conflict-32": {
    title: "Tuna Nehri Koruma Sözleşmesi Yürürlüğe Girdi",
    description: "Tuna Havzası'ndaki 14 ülke ve Avrupa Birliği'nin imzaladığı Sofia Sözleşmesi yürürlüğe girdi ve Tuna Nehri'ni Koruma Uluslararası Komisyonu (ICPDR) resmen çalışmaya başladı.",
  },
  "conflict-33": {
    title: "Nil Havzası Girişimi (NBI) Kuruldu",
    description: "Nil kıyıdaşı 10 ülke, kaynakları adil paylaşmak, teknik işbirliğini artırmak ve sürdürülebilir kalkınmayı sağlamak üzere Darüsselam'da Nil Havzası Girişimi'ni (NBI) başlattı.",
  },
  "conflict-34": {
    title: "Cochabamba Su Savaşı, Bolivya",
    description: "Bolivya'nın Cochabamba kentinde içme suyu şebekesinin özelleştirilmesi ve faturaların %300'e varan oranlarda artması üzerine kitlesel halk ayaklanması çıktı; olağanüstü hal ilan edildi ve hükümet özelleştirme sözleşmesini feshetmek zorunda kaldı.",
  },
  "conflict-35": {
    title: "Hindistan-Pakistan Baglihar Barajı İhtilafı",
    description: "Pakistan, Hindistan'ın Chenab Nehri üzerinde inşa ettiği Baglihar Hidroelektrik Santrali'nin İndus Suları Antlaşması'nın su depolama ve tahliye kriterlerini ihlal ettiğini ileri sürerek uluslararası arabuluculuk sürecini başlattı.",
  },
  "conflict-36": {
    title: "Irak Savaşı: Su Altyapısının Yıkımı ve Hedef Alınması",
    description: "ABD liderliğindeki askeri harekat ve sonrasındaki çatışmalarda Irak'ın su arıtma, dağıtım ve kanalizasyon şebekeleri bombalandı, elektrik kesintileriyle hizmet dışı kaldı; milyonlarca sivil temiz sudan mahrum kaldı.",
  },
  "conflict-37": {
    title: "Zambezi Su Yolu Komisyonu Anlaşması (ZAMCOM)",
    description: "Sekiz kıyıdaş ülke (Angola, Botsvana, Malavi, Mozambik, Namibya, Tanzanya, Zambiya, Zimbabve), Kasane'de ZAMCOM Anlaşması'nı imzalayarak ortak havza yönetimi için kurumsal temel attı.",
  },
  "conflict-38": {
    title: "Kazakistan Kök-Aral Barajı ile Kuzey Aral Denizi'ni Kurtardı",
    description: "Dünya Bankası desteğiyle tamamlanan 13 kilometrelik Kök-Aral Bendi, Seyhun Nehri'nin sularını Kuzey Aral'da toplayarak su seviyesini 38 metreden 42 metreye çıkardı, tuzluluğu yarıya indirdi ve balıkçılığı yeniden canlandırdı.",
  },
  "conflict-39": {
    title: "Fırat-Dicle İşbirliği Girişimi (ETIC) Başlatıldı",
    description: "Türkiye, Suriye ve Irak'tan akademisyenler ve su uzmanları, siyasi kutuplaşmayı aşmak ve havzada teknik veri paylaşımı ile ortak projeler üretmek üzere sivil toplum odaklı ETIC platformunu kurdu.",
  },
  "conflict-40": {
    title: "Dünya Bankası Tarafsız Uzmanı Baglihar Kararını Verdi",
    description: "Dünya Bankası tarafından atanan İsviçreli tarafsız uzman Prof. Raymond Lafitte, Hindistan'ın baraj yüksekliğini ve batık savak tasarımını kısmen revize etmesine, ancak projenin ana hatlarıyla devamına onay vererek teknik ihtilafı çözdü.",
  },
  "conflict-41": {
    title: "Nil CFA Müzakereleri Tıkandı",
    description: "Yukarı havza ülkeleri ile aşağı havza ülkeleri (Mısır ve Sudan) arasındaki görüşmeler, 1929 ve 1959 anlaşmalarındaki tarihi su hakları ve ön onay veto hakkı maddesi (Madde 14b) üzerinde uzlaşma sağlanamaması sebebiyle kilitlendi.",
  },
  "conflict-42": {
    title: "Nijer Havzası Su Şartı Kabul Edildi",
    description: "Nijer Havzası Otoritesi üyesi 9 ülkenin devlet başkanları, havzada su tahsisi, ortak baraj yönetimi ve çevresel koruma ilkelerini belirleyen bağlayıcı Su Şartı'nı kabul etti.",
  },
  "conflict-43": {
    title: "Türkiye-Irak ve Türkiye-Suriye Su Mutabakat Muhtıraları",
    description: "Türkiye, Irak ve Suriye arasında kurulan Yüksek Düzeyli Stratejik İşbirliği Konseyleri kapsamında su yönetimi, modern sulama teknikleri ve meteorolojik veri paylaşımına ilişkin kapsamlı mutabakat zabıtları imzalandı.",
  },
  "conflict-44": {
    title: "Mekong Havzasında Tarihi Düşük Su Seviyesi Krizi",
    description: "Aşağı Mekong'da su seviyeleri 50 yılın en düşük düzeyine geriledi; kıyıdaş topluluklar kuraklık ve Çin'in yukarı havzada inşa ettiği kaskat barajların su tutmasını ana etken olarak suçladı.",
  },
  "conflict-45": {
    title: "Nil İşbirliği Çerçeve Anlaşması (CFA) İmzaya Açıldı",
    description: "Etiyopya, Uganda, Ruanda, Tanzanya ve Kenya, Entebbe'de Mısır ve Sudan'ın boykot ettiği Nil CFA'yı imzalayarak eşitlikçi ve makul kullanım ilkesini benimsedi ve sömürge dönemi anlaşmalarını tanımadıklarını ilan etti.",
  },
  "conflict-46": {
    title: "Etiyopya Büyük Rönesans Barajı'nı (GERD) Duyurdu",
    description: "Etiyopya, Mavi Nil üzerinde 5 milyar dolarlık ve 74 milyar m³ rezervuar kapasiteli Afrika'nın en büyük hidroelektrik santrali olacak GERD projesini kamuoyuna ilan etti; bu adım Nil jeopolitiğinde tarihi bir kırılma yarattı.",
  },
  "conflict-47": {
    title: "Laos Xayaburi Barajı Tartışması, Mekong",
    description: "Laos, Aşağı Mekong ana kolu üzerindeki ilk hidroelektrik baraj olan 1.285 MW'lık Xayaburi Barajı'nın inşasına başladı; Kamboçya ve Vietnam balık göçü ve alüvyon akışının kesileceğini belirterek sert diplomatik itirazlarda bulundu.",
  },
  "conflict-48": {
    title: "Etiyopya Nil CFA'sını Mecliste Onayladı",
    description: "Etiyopya Parlamentosu, 1929 anlaşmasının hükümsüz olduğunu tescil eden Nil İşbirliği Çerçeve Anlaşması'nı oybirliğiyle onayladı; bu adım Mısır'da televizyondan canlı yayınlanan kriz toplantılarına ve savaş tehditlerine yol açtı.",
  },
  "conflict-49": {
    title: "Ukrayna Kuzey Kırım Kanalı'nı Kesti",
    description: "Rusya'nın Kırım'ı ilhakının ardından Ukrayna, yarımadanın tatlı su ihtiyacının %85'ini karşılayan Dinyeper kaynaklı Kuzey Kırım Kanalı'nın akışını bir setle keserek suyu stratejik bir karşı baskı aracı olarak kullandı.",
  },
  "conflict-50": {
    title: "Mısır-Etiyopya-Sudan İlkeler Deklarasyonu",
    description: "Üç ülkenin devlet başkanları Hartum'da toplanarak GERD'in ilk dolumu ve işletilmesinde tarafların birbirine 'önemli zarar vermeme' ve 'adil kullanım' ilkelerine bağlı kalacağını belirten 10 maddelik İlkeler Deklarasyonu'nu imzaladı.",
  },
  "conflict-51": {
    title: "Pakistan Kishanganga ve Ratle Barajları İçin Tahkim İstedi",
    description: "Pakistan, Hindistan'ın Jhelum kolu Kishanganga ve Chenab üzerindeki Ratle projelerinin İndus Antlaşması tasarım kurallarını aştığını belirterek Lahey Daimi Tahkim Mahkemesi'ne (PCA) başvurdu.",
  },
  "conflict-52": {
    title: "Mekong Son 100 Yılın En Düşük Seviyesine İndi",
    description: "Aşağı Mekong Nehri'nde eşi görülmemiş kuraklık ve su çekilmesi yaşandı; nehir rengi maviye dönüştü (besin sedimenti yok oldu). Uydu analizleri Çin rezervuarlarının yukarıda milyarlarca metreküp su tuttuğunu ortaya koydu.",
  },
  "conflict-53": {
    title: "Cauvery Su İhtilafı: Hindistan Eyaletlerarası Şiddet",
    description: "Karnataka ve Tamil Nadu eyaletleri arasında Cauvery Nehri su tahsisi konusunda çıkan anlaşmazlık kitlesel protestolara, araç kundaklamalarına ve sokağa çıkma yasaklarına dönüştü; Hindistan Yüksek Mahkemesi tahsis kotalarını zorunlu olarak yeniden belirledi.",
  },
  "conflict-54": {
    title: "Hindistan Pulwama Saldırısı Sonrası İndus Kollarını Kesme Tehdidinde Bulundu",
    description: "Keşmir'deki Pulwama terör saldırısının ardından Hindistan Su Kaynakları Bakanlığı, Hindistan'a ait doğu nehir sularının Pakistan'a akmasını tamamen durdurup Hint eyaletlerine yönlendirecek projeleri hızlandırdığını açıkladı.",
  },
  "conflict-55": {
    title: "Etiyopya Nil CFA İkinci Tur Müzakereleri",
    description: "ABD ve Dünya Bankası arabuluculuğunda Washington'da yürütülen GERD dolum müzakereleri, Etiyopya'nın bağlayıcı bir kuraklık protokolünü ulusal egemenliğe aykırı bulması ve nihai taslak toplantısını terk etmesiyle sonuçsuz kaldı.",
  },
  "conflict-56": {
    title: "Mısır GERD İhtilafını BM Güvenlik Konseyi'ne Taşıdı",
    description: "Mısır, Etiyopya'nın tek taraflı baraj doldurma hamlelerinin uluslararası barış ve güvenliği tehdit ettiğini ileri sürerek konuyu Birleşmiş Milletler Güvenlik Konseyi'ne (BMGK) taşıdı ve acil müdahale talep etti.",
  },
  "conflict-57": {
    title: "Etiyopya İlk GERD Dolumunu Gerçekleştirdi",
    description: "Etiyopya, Mısır ve Sudan ile üçlü bir anlaşmaya varmadan GERD rezervuarının ilk aşama dolumunu (4,9 milyar m³) tamamladığını açıkladı ve bunun yoğun muson yağmurları sayesinde doğal olarak gerçekleştiğini savundu.",
  },
  "conflict-58": {
    title: "Meksika-ABD Rio Grande Su Borcu Gerginliği",
    description: "1944 Su Antlaşması kapsamında ABD'ye su teslimatı yapılmasına karşı çıkan Meksikalı çiftçiler, Chihuahua eyaletindeki La Boquilla Barajı'nı işgal etti; Meksika Ulusal Muhafızları ile çiftçiler arasında çıkan çatışmada can kayıpları yaşandı.",
  },
  "conflict-59": {
    title: "Kırgızistan-Tacikistan İsfara Nehri Silahlı Çatışması",
    description: "Ortak Golovnoy su dağıtım noktasına güvenlik kameraları takılması üzerine başlayan sınır uyuşmazlığı, iki ülke orduları arasında havan ve zırhlı araçların kullanıldığı 3 günlük çatışmaya dönüştü; 55'ten fazla kişi hayatını kaybetti.",
  },
  "conflict-60": {
    title: "Etiyopya Anlaşmasız İkinci GERD Dolumunu Yaptı",
    description: "Etiyopya, aşağı kıyıdaşların itirazlarına rağmen ikinci yıl dolumunu tamamlayarak baraj rezervuarındaki toplam su miktarını 13,5 milyar m³ seviyesine çıkardı.",
  },
  "conflict-61": {
    title: "Afganistan Helmand Üzerindeki Kemal Han Barajı'nı Açtı",
    description: "Afganistan Devlet Başkanı Eşref Gani, 'Suya karşı petrol' söylemiyle Helmand Nehri üzerindeki Kemal Han Barajı'nı açtı; İran'ın Hamun sulak alanlarına giden suyun kesilmesi Tahran'da büyük tepkiye yol açtı.",
  },
  "conflict-62": {
    title: "Kırgızistan-Tacikistan Geniş Çaplı Sınır ve Su Çatışmaları",
    description: "Sınır ve su tesisleri üzerindeki kontrol uyuşmazlığı sebebiyle Kırgızistan ve Tacikistan sınırında topyekün çatışmalar patlak verdi; 100'den fazla insan öldü, 140 bin kişi tahliye edildi ve su pompaları zarar gördü.",
  },
  "conflict-63": {
    title: "Afganistan-İran Helmand Gerilimi Tırmandı",
    description: "İran Cumhurbaşkanı İbrahim Reisi, Taliban rejimine Helmand Nehri su haklarını teslim etmesi için açık ültimatom verdi; Taliban yetkilileri ise kuraklık sebebiyle rezervuarlarda su bulunmadığını iddia etti.",
  },
  "conflict-64": {
    title: "Etiyopya Üçüncü GERD Dolumunu Tamamladı",
    description: "Etiyopya, GERD rezervuarına üçüncü aşamada 8 milyar m³ ilave su depolandığını ve ikinci türbinin elektrik üretmeye başladığını duyurdu.",
  },
  "conflict-65": {
    title: "Lahey Daimi Tahkim Mahkemesi İndus Yetkisini Teyit Etti",
    description: "Lahey Daimi Tahkim Mahkemesi (PCA), Hindistan'ın yargı yetkisi itirazını reddederek Pakistan'ın Kishanganga ve Ratle projelerine ilişkin davasını görmeye tam yetkili olduğuna karar verdi.",
  },
  "conflict-66": {
    title: "İsrail Gazze Su Altyapısını ve Dağıtımını Vurdu",
    description: "Ekim 2023'ten itibaren İsrail ordusu Gazze Şeridi'ne giden su boru hatlarını kesti, tuz giderme tesislerini, atık su arıtma ünitelerini ve su kuyularını hedef aldı; BM ve insan hakları örgütleri suyu savaş silahı olarak kullanma suçlamasında bulundu.",
  },
  "conflict-67": {
    title: "İran-Afganistan Helmand Sınırında Ölümcül Çatışma",
    description: "Helmand su hakları geriliminin zirveye ulaştığı Mayıs 2023'te İran sınır muhafızları ile Taliban güçleri arasında sınır karakollarında ağır silahlarla çatışma çıktı; sınır muhafızları hayatını kaybetti.",
  },
  "conflict-68": {
    title: "Hindistan Nagarjunasagar Barajı Polis Çatışması",
    description: "Krishna Nehri üzerindeki kritik Nagarjunasagar Barajı'nın kontrolü ve su boşaltımı sebebiyle komşu Andhra Pradesh ve Telangana eyaletlerinin polis güçleri baraj gövdesinde fiziksel çatışmaya girdi; merkezi hükümet paramiliter birlik sevk etti.",
  },
  "conflict-69": {
    title: "Kırgızistan-Tacikistan Nihai Sınır ve Su Anlaşması",
    description: "Kırgızistan ve Tacikistan hükümetleri, Batken'de sınır hattının %98'ini belirleyen ve kanallar ile Golovnoy su tesisinin ortak yönetim rejimini kuran nihai barış protokolünü parafe etti.",
  },
  "conflict-70": {
    title: "GERD Resmi Olarak Hizmete Açıldı, Mısır BMGK'ya Başvurdu",
    description: "Etiyopya Başbakanı Abiy Ahmed, GERD'in 4 türbininin faaliyete geçtiğini ve rezervuar dolumunun son aşamaya geldiğini duyurdu. Mısır Dışişleri Bakanlığı BM Güvenlik Konseyi'ne resmi şikayet mektubu yazarak uluslararası hukukun çiğnendiğini belirtti.",
  },
  "conflict-71": {
    title: "Hindistan Terör Saldırısı Sonrası İndus Antlaşmasını Askıya Aldı",
    description: "Keşmir Pahalgam'da yaşanan ölümcül terör saldırısının ardından Hindistan hükümeti, Pakistan'a resmi nota vererek 1960 İndus Suları Antlaşması'nı 'terör tehdidi ve köklü koşul değişiklikleri' gerekçesiyle tek taraflı olarak askıya aldığını bildirdi.",
  },
  "conflict-72": {
    title: "ABD-Kanada Kolombiya Nehri Antlaşması Revizyonu Tıkandı",
    description: "60 yıllık antlaşmanın modernizasyonu için 2024'te varılan ilke anlaşması, somon balığı göçü ve Kanada'ya ödenecek taşkın koruma bedelleri konusundaki anlaşmazlıklar sebebiyle yürürlüğe girmekte güçlük yaşadı.",
  },
  "conflict-73": {
    title: "Orta Asya Su-Enerji Zirvesi ve Konsorsiyum Kararı",
    description: "Kazakistan, Kırgızistan ve Özbekistan devlet başkanları Bişkek'te bir araya gelerek Kambarata-1 HES'in inşasını finanse edecek ve Seyhun akış rejimini güvenceye alacak Devletlerarası Su-Enerji Konsorsiyumu'nu onayladı.",
  },
  "conflict-74": {
    title: "Kolorado Nehri Sözleşmesi İmzalandı",
    description: "ABD'nin yedi havza eyaleti, Santa Fe'de Kolorado Nehri sularını Yukarı ve Aşağı Havza arasında yıllık 7,5 milyon akre-feet (9,25 milyar m³) şeklinde eşit paylaştıran tarihi sözleşmeyi imzaladı.",
  },
  "conflict-75": {
    title: "ABD-Meksika Rio Grande ve Kolorado Nehri Antlaşması",
    description: "ABD ve Meksika, Rio Grande, Kolorado ve Tijuana nehirlerinin sularını karşılıklı garanti kotalarıyla tahsis eden ve Uluslararası Sınır ve Su Komisyonu'nu (IBWC) kuran kapsamlı sınır su antlaşmasını imzaladı.",
  },
  "conflict-76": {
    title: "İsrail Ulusal Su Taşıyıcısı İşletmeye Alındı",
    description: "İsrail, Taberiye Gölü sularını boru hatları ve kanallarla kıyı ovalarına ve Necef Çölü'ne taşıyan Ulusal Su Taşıyıcısı'nı tam kapasite devreye aldı; komşu Arap devletleri suyun izinsiz çalındığını ilan etti.",
  },
  "conflict-77": {
    title: "Ren Nehri Kimyasal Kirlilik Krizi",
    description: "Endosülfan böcek ilacının Ren Nehri'ne karışması sonucu Almanya ve Hollanda boyunca milyonlarca balık öldü; içme suyu alımları durduruldu ve bu facia Avrupa'da nehir koruma hukuku reformunu tetikledi.",
  },
  "conflict-78": {
    title: "Sandoz Kimyasal Faciası Ren Nehrini Zehirledi",
    description: "Basel yakınlarındaki Sandoz kimya deposunda çıkan yangını söndürmek için sıkılan tonlarca böcek ilaçlı su Ren'e aktı; yüzlerce kilometre boyunca nehir ekosistemi yok oldu ve acil alarm sistemleri kuruldu.",
  },
  "conflict-79": {
    title: "Ren Eylem Programı 'Somon 2000' Başarısı",
    description: "Uluslararası Ren Komisyonu'nun su kalitesi ve balık geçitleri restorasyon projeleri sayesinde, kirlilikten nesli tükenen Atlantik somonu yarım asır sonra ilk kez Ren Nehri'nde doğal olarak yumurtladı.",
  },
  "conflict-80": {
    title: "Sovyetler Birliği Aral Denizi Su Yönlendirme Kararı",
    description: "Sovyet planlamacılar pamuk monokültürünü beslemek amacıyla Seyhun ve Ceyhun nehirlerinin akışını devasa sulama kanallarına (Karakum Kanalı dahil) yönlendirdi; bu karar Aral Denizi'nin kuruma felaketini başlattı.",
  },
  "conflict-81": {
    title: "Aral Denizi Kuzey ve Güney Olarak İkiye Bölündü",
    description: "Suların aşırı çekilmesi neticesinde Aral Denizi yüzölçümünün %50'sinden fazlasını kaybetti ve su hacmi bölünerek Kuzey (Küçük) Aral ve Güney (Büyük) Aral olarak iki ayrı su kütlesine ayrıldı.",
  },
  "conflict-82": {
    title: "Hindistan-Bangladeş Ortak Nehirler Komisyonu (JRC)",
    description: "Bangladeş'in bağımsızlığının ardından iki ülke, 54 sınır aşan nehrin hidrolojik verilerini paylaşmak ve ortak taşkın erken uyarı sistemleri kurmak üzere Ortak Nehirler Komisyonu'nu kurdu.",
  },
  "conflict-83": {
    title: "Hindistan-Bangladeş Farakka Deklarasyonu",
    description: "Başbakanlar İndira Gandi ve Şeyh Mucibur Rahman, Farakka Bendi'nin besleme kanalının Bangladeş'e zarar vermeyecek kontrollü deneme debileriyle işletilmesi konusunda geçici bir bildiriye imza attı.",
  },
  "conflict-84": {
    title: "Tuna Siyanür Faciası (Baia Mare, Romanya)",
    description: "Romanya'daki bir altın madeninin atık barajının patlaması sonucu 100 bin m³ siyanürlü ve ağır metalli su Somes, Tisza ve nihayet Tuna Nehri'ne karıştı; Macaristan ve Sırbistan'da tüm su canlıları zehirlendi.",
  },
  "conflict-85": {
    title: "Moritanya-Senegal Sınır Su Çatışması",
    description: "Senegal Nehri taşkın yatağındaki otlatma ve su hakları sebebiyle Moritanyalı çobanlar ile Senegalli çiftçiler arasında başlayan sürtüşme etnik şiddete ve iki ülke arasında savaşa ramak kalan bir krize dönüştü.",
  },
  "conflict-86": {
    title: "Zambezi Nehri Havzası Eylem Planı (ZACPLAN)",
    description: "Güney Afrika Kalkınma Topluluğu (SADC) ve UNEP işbirliğiyle Zambezi havzasında çevre odaklı su kaynakları yönetimi ve veri entegrasyonunu amaçlayan ZACPLAN başlatıldı.",
  },
  "conflict-87": {
    title: "İngiliz-Mısır Nil Suları Anlaşması",
    description: "İngiltere ile Mısır arasında yapılan nota teatisiyle Mısır'a yıllık 48 milyar m³, Sudan'a 4 milyar m³ su hakkı tanındı; Mısır'a yukarı Nil havzasındaki baraj ve sulama projeleri üzerinde mutlak veto yetkisi verildi.",
  },
  "conflict-88": {
    title: "İsrail'in Bağımsızlığı ve Şeria Havzası Tehditleri",
    description: "İsrail'in kurulmasının hemen ardından komşu Arap devletleri Şeria Nehri kollarını yönlendirme ve İsrail'in su alımlarını engelleme stratejilerini ilk kez bölgesel gündeme taşıdı.",
  },
  "conflict-89": {
    title: "İsrail Batı Şeria Su Kaynaklarını Kontrol Altına Aldı",
    description: "1967 savaşı sonrası İsrail, Batı Şeria'daki dağ akiferlerini ve yeraltı kuyularını askeri emirlerle doğrudan İsrail Su İdaresi'ne (Mekorot) bağladı; Filistinlilerin kuyu açmasını ve su çekmesini kısıtladı.",
  },
  "conflict-90": {
    title: "Oslo II Anlaşması Batı Şeria Su Hükümleri",
    description: "İsrail ile Filistin Kurtuluş Örgütü arasında imzalanan geçici anlaşmanın 40. maddesiyle Ortak Su Komitesi (JWC) kuruldu; Filistin tarafına belirli su kotaları tahsis edildi ancak nihai su hakları ertelendi.",
  },
  "conflict-91": {
    title: "Lauca Nehri İhtilafı: Şili-Bolivya",
    description: "Şili'nin Lauca Nehri sularını Azapa Vadisi'ne aktarması üzerine Bolivya ile yaşanan yarım asırlık diplomatik sürtüşme, And dağları havzasında su egemenliği ve denize çıkış tartışmalarıyla alevlendi.",
  },
  "conflict-92": {
    title: "Çad Gölü Havzası Komisyonu (LCBC) Kuruldu",
    description: "Kamerun, Çad, Nijer ve Nijerya liderleri, Sahel bölgesinin can damarı olan Çad Gölü'nü korumak ve su kaynaklarını entegre yönetmek üzere Fort Lamy'de LCBC'yi oluşturdu.",
  },
  "conflict-93": {
    title: "Çad Gölü'nün Yok Olma Noktasına Gelmesi",
    description: "Aşırı sulama ve şiddetli iklim kuraklığı nedeniyle Çad Gölü orijinal yüzölçümünün %90'ından fazlasını kaybetti; milyonlarca balıkçı ve çiftçi göç etmek zorunda kalarak Boko Haram gibi çatışma dinamiklerine zemin hazırladı.",
  },
  "conflict-94": {
    title: "Körfez Savaşı: Basra Körfezi'ne Petrol Boşaltımı",
    description: "Irak birlikleri Kuveyt'ten çekilirken petrol vanalarını denize açarak su arıtma ve deniz suyu tuz giderme tesislerini hedef aldı; su güvenliği tarihin en büyük çevre terörizmi eylemiyle silah haline getirildi.",
  },
  "conflict-95": {
    title: "Lesotho Yaylaları Su Projesi (LHWP)",
    description: "Lesotho ve Güney Afrika arasındaki ortak dev baraj ve tünel sistemi devreye girerek Maloti dağlarındaki temiz suyu Gauteng sanayi bölgesine taşırken Lesotho'ya elektrik ve telif geliri sağladı.",
  },
  "conflict-96": {
    title: "Farakka Bendi Kalıcı Olarak Devreye Girdi",
    description: "Hindistan Farakka Bendi'ni tam operasyonel hale getirdi; Bangladeş hükümeti Padma kolundaki kuraklık, nehir içi navigasyonun çökmesi ve güney bölgelerindeki tuzlu su istilası nedeniyle BM'ye resmi şikayette bulundu.",
  },
  "conflict-97": {
    title: "Hindistan Daimi İndus Komisyonu Görüşmelerini Askıya Aldı",
    description: "Uri askeri üssüne yapılan saldırının ardından Hindistan Başbakanı Narendra Modi, 'Kan ve su aynı anda akamaz' diyerek Daimi İndus Komisyonu'nun rutin toplantılarını dondurdu.",
  },
  "conflict-98": {
    title: "Kolorado Nehri On Yıllar Sonra İlk Kez Denize Ulaştı",
    description: "ABD ve Meksika arasındaki IBWC 319 Sayılı Karar kapsamında rezervuarlardan 'darbe akışı' (pulse flow) bırakılarak Kolorado Deltası'ndaki sulak alan ekosistemine tarihi bir can suyu verildi.",
  },
  "conflict-99": {
    title: "Mekong Komitesi Vietnam Savaşı Sırasında Askıya Alındı",
    description: "Saygon'un düşüşü ve Kamboçya ile Laos'taki rejim değişiklikleri sebebiyle dört kıyıdaş arasındaki siyasi bağlar koptu; Mekong Komitesi çalışmaları geçici olarak durduruldu.",
  },
  "conflict-100": {
    title: "Bangladeş Kurtuluş Savaşı ve Brahmaputra Suları",
    description: "Doğu Pakistan'daki savaş ve mülteci krizi döneminde su kaynaklarının kontrolü ve sel yönetimi stratejik bir unsur haline geldi; Hindistan ile sınır aşan nehir istişareleri kilitlendi.",
  },
  "conflict-101": {
    title: "Gine OMVS Senegal Nehri Örgütü'ne Katıldı",
    description: "Senegal Nehri'nin kaynak ülkesi olan Gine, OMVS'ye tam üye olarak katıldı ve Fouta Djallon yaylalarındaki nehir kaynaklarının ortak koruma rejimine dahil olmasını sağladı.",
  },
  "conflict-102": {
    title: "Asvan Barajı Alüvyon Yoksunluğu ve Delta Erozyonu İhtilafı",
    description: "Asvan Barajı'nın tortu tutması sebebiyle Nil Deltası kıyılarının aşınması ve Akdeniz tuzlu suyunun delta akiferlerine sızması, Mısır ile yukarı kıyıdaşlar arasındaki baraj planlama tartışmalarında kritik bir tartışma başlığı oldu.",
  },
  "conflict-103": {
    title: "Burundi Nil CFA'sını İmzaladı",
    description: "Burundi, Nil İşbirliği Çerçeve Anlaşması'nı imzalayan altıncı yukarı havza ülkesi olarak anlaşmanın yürürlüğe girmesi için gereken eşiğin aşılmasına kritik bir katkı sağladı.",
  },
  "conflict-104": {
    title: "Taliban'ın Kabil'i Ele Geçirmesi ve Helmand Antlaşması",
    description: "Taliban'ın yönetimi yeniden ele geçirmesinin ardından Kemal Han Barajı savaklarının açılmaması ve İran'a su verilmemesi Tahran ile Kabil arasında askeri sınır gerginliğini tırmandırdı.",
  },
  "conflict-105": {
    title: "Çin Aşağı Mekong Kuraklığında Acil Su Salımı Yaptı",
    description: "Aşağı kıyıdaş ülkelerin yoğun diplomatik baskısı ve uydu raporlarının ardından Çin, kuraklığı hafifletmek üzere Lancang barajlarından acil hidrolojik su tahliyesi başlattı.",
  },
  "conflict-106": {
    title: "Özbekistan 2024 Acil Su Tasarrufu Rejimi İlan Etti",
    description: "Aral Denizi havzasındaki amansız su kaybı ve kuraklık karşısında Özbekistan Cumhurbaşkanı Şevket Mirziyoyev, tarımda su israfını önlemek için ülke çapında olağanüstü acil tasarruf seferberliği başlattı.",
  },
  "conflict-107": {
    title: "Ren Nehri Atık ve Seyrüsefer Sözleşmesi Yürürlüğe Girdi",
    description: "Ren boyunca seyreden gemilerin yağlı atık, sintine suyu ve çöplerini nehre dökmesini yasaklayan ve kıyı arıtma tesislerine teslimini zorunlu kılan uluslararası sözleşme yürürlüğe girdi.",
  },
  "conflict-108": {
    title: "Hindistan-Nepal Mahakali Antlaşması Anlaşmazlıkları",
    description: "1996 tarihli Mahakali Antlaşması kapsamında planlanan Pancheshwar Çok Amaçlı Baraj Projesi, elektrik paylaşımı ve su hakları konusundaki fikir ayrılıkları nedeniyle çıkmaza girdi.",
  },
  "conflict-109": {
    title: "Çin Lancang-Mekong İşbirliği (LMC) Mekanizmasını Kurdu",
    description: "Çin, Mekong Nehri Komisyonu'nun (MRC) dışındaki bir formatta 6 kıyıdaş ülkeyi bir araya getiren ve Çin finansmanıyla desteklenen alternatif Lancang-Mekong İşbirliği Platformu'nu kurdu.",
  },
  "conflict-110": {
    title: "Sudan GERD Konusunda Mısır'dan Ayrıştı",
    description: "Sudan, GERD'in taşkınları önleme, alüvyonu tutma ve ucuz elektrik sağlama avantajlarını görerek Mısır'ın katı muhalefetinden ayrıştı ve Etiyopya projesine yapıcı destek vermeye başladı.",
  },
  "conflict-111": {
    title: "Uganda Nil CFA Anlaşmasını Onayladı",
    description: "Uganda Parlamentosu Nil Havzası İşbirliği Çerçeve Anlaşması'nı resmen onaylayarak onay belgesini Afrika Birliği'ne tevdi etti.",
  },
  "conflict-112": {
    title: "Batı Şeria'da Filistinlilerin Suya Erişiminin Engellenmesi",
    description: "İsrail askeri yetkililerinin Filistin köylerindeki ruhsatsız su depolarını ve boru hatlarını yıkması, su kotalarını düşürmesi uluslararası insan hakları raporlarında su ayrımcılığı olarak belgelendi.",
  },
  "conflict-113": {
    title: "Güney Sudan Nil CFA Anlaşmasına Katıldı",
    description: "Güney Sudan Ulusal Meclisi Nil CFA'sını onayladı; bu adım anlaşmanın yürürlüğe girmesi için zorunlu olan 6 onay şartının tamamlanmasını sağladı.",
  },
  "conflict-114": {
    title: "Sudan Beyaz Nil Su Paylaşımı Sürtüşmesi",
    description: "Güney Sudan'ın bağımsızlık referandumu öncesinde Beyaz Nil ve Sudd sulak alanlarındaki su kaynaklarının mülkiyeti ve Jonglei Kanalı projesinin geleceği Hartum ile Cuba arasında uyuşmazlık yarattı.",
  },
  "conflict-115": {
    title: "IBWC 242 Sayılı Karar: Kolorado Nehri Tuzluluk Çözümü",
    description: "ABD ve Meksika, ABD'den Meksika'ya teslim edilen Kolorado suyunun tuzluluk oranını sınırlandıran ve Yuma Tuz Giderme Tesisi'nin kurulmasını öngören bağlayıcı 242 Sayılı Kararı kabul etti.",
  },
  "conflict-116": {
    title: "Dicle-Fırat Üzerinde Musul ve Hadise Barajları İnşa Edildi",
    description: "Irak, yukarı havzadaki Türk ve Suriye barajlarına karşı su depolama kapasitesini artırmak için Dicle üzerinde Musul (Saddam) ve Fırat üzerinde Hadise Barajlarını tamamladı.",
  },
  "conflict-117": {
    title: "Etiyopya Mavi Nil Üzerinde Gizli GERD Sondajlarını Başlattı",
    description: "Etiyopya hükümeti ve İtalyan Salini firması, Guba bölgesinde gelecekteki Rönesans Barajı'nın temelini oluşturacak gizli jeolojik ve topoğrafik saha etütlerini yürüttü.",
  },
  "conflict-118": {
    title: "Lancang Baraj Kaskadı Aşağı Havzada Alarm Yarattı",
    description: "Çin'in Dachaoshan Barajı'nı tamamlayıp Xiaowan Barajı'nın inşasına başlaması, Kamboçya'daki Tonle Sap Gölü'nün taşkın döngüsünün bozulacağı endişelerini uluslararası zirvelere taşıdı.",
  },
  "conflict-119": {
    title: "Nil CFA Anlaşması 5 Onayla Resmen Yürürlüğe Girdi",
    description: "Güney Sudan'ın onay belgesini tevdi etmesiyle Nil İşbirliği Çerçeve Anlaşması (CFA) 13 Ekim 2024'te resmen yürürlüğe girdi ve Mısır ile Sudan'ın veto yetkisi tarihe karışarak Nil Nehri Havzası Komisyonu (NRBC) kuruldu.",
  },
  "conflict-120": {
    title: "Özbekistan Aral Krizi Ortasında Sulanan Alanları Genişletti",
    description: "Aral Denizi'ne dökülen Ceyhun akışının rekor düşüşüne rağmen Özbekistan'ın tarım arazilerini genişletmesi ve Afganistan'ın Kuş Tepe Kanalı inşası, bölgedeki hidrolojik kırılganlığı tehlikeli boyuta ulaştırdı.",
  },
  "conflict-121": {
    title: "Kuzey Aral Denizi Restorasyonu Devletlerarası Antlaşması",
    description: "Kazakistan ve Özbekistan, Kuzey Aral Denizi'nin su hacmini büyütmek, Seyhun deltası sulak alanlarını canlandırmak ve Kök-Aral Bendi'ni yükseltmek amacıyla bağlayıcı restorasyon antlaşması imzaladı.",
  },
  "conflict-122": {
    title: "Türkiye-Irak Aşırı Kuraklık Operasyonel Su Protokolü",
    description: "Türkiye ve Irak, Fırat ve Dicle havzalarında iklim değişikliği kaynaklı şiddetli kuraklık dönemlerinde baraj kapaklarından bırakılacak asgari garantili akışları belirleyen dinamik protokolü yürürlüğe koydu.",
  },
  "conflict-123": {
    title: "Mekong Komisyonu Ana Kol Kaskat Hidroelektrik Kuralları",
    description: "Mekong Nehri Komisyonu (MRC), ana kol üzerindeki tüm kademeli hidroelektrik barajların su tutma ve bırakma operasyonlarını dijital ikiz modellemesiyle anlık koordine eden bağlayıcı kuralları ilan etti.",
  },
};

export const conflictsTrByTitle: Record<string, ConflictTr> = {
  "india-pakistan indus canal water dispute": {
    title: "Hindistan-Pakistan İndus Kanalı Su İhtilafı",
    description: "Bölünmenin ardından Hindistan, 1 Nisan 1948'de Yukarı Bari Doab Kanalı sisteminden Pakistan kanallarına akan suyu keserek milyonlarca dönüm tarım arazisini etkiledi. Haftalarca süren kriz, Mayıs 1948'de imzalanan acil Hakimiyetlerarası Anlaşma ile çözüldü.",
  },
  "egypt protests ethiopian nile projects": {
    title: "Mısır'ın Etiyopya Nil Projelerini Protestosu",
    description: "Mısır, 1929 İngiliz-Mısır Nil Suları Anlaşması'nı gerekçe göstererek ve Mısır'ın tarihi su haklarının tanınmasını talep ederek, Etiyopya'da Nil debisini etkileyebilecek her türlü yukarı havza su yapısına resmi olarak itiraz etti.",
  },
  "johnston plan negotiations for jordan river": {
    title: "Şeria Nehri İçin Johnston Planı Müzakereleri",
    description: "ABD özel temsilcisi Eric Johnston, Şeria Nehri sularını paylaştırmak için İsrail ile Arap devletleri arasında çok yıllı müzakereler yürüttü. Su kotalarında teknik uzlaşmaya varılmasına rağmen plan, İsrail'in tanınmasına ilişkin siyasi endişeler sebebiyle 1955'te Arap Birliği tarafından reddedildi.",
  },
  "mekong committee established": {
    title: "Mekong Komitesi'nin Kuruluşu",
    description: "Kamboçya, Laos, Tayland ve Güney Vietnam, BM himayesinde Aşağı Mekong Havzası İncelemeleri Koordinasyon Komitesi'ni (Mekong Komitesi) kurarak Mekong işbirliği için ilk kurumsal çerçeveyi oluşturdu.",
  },
  "egypt-sudan nile waters agreement": {
    title: "Mısır-Sudan Nil Suları Anlaşması",
    description: "Mısır ve Sudan, yıllık 55,5 milyar m³ suyu Mısır'a ve 18,5 milyar m³ suyu Sudan'a tahsis eden kapsamlı bir su paylaşım anlaşması imzaladı; bu anlaşma Asvan Yüksek Barajı'nın inşasını sağladı. Yukarı kıyıdaş devletler müzakerelerin dışında bırakıldı.",
  },
  "indus waters treaty signed": {
    title: "İndus Suları Antlaşması İmzalandı",
    description: "Hindistan ve Pakistan, Dünya Bankası arabuluculuğunda Karaçi'de İndus Suları Antlaşması'nı imzaladı. Antlaşma, doğu nehirlerini (Ravi, Beas, Sutlej) Hindistan'a ve batı nehirlerini (İndus, Jhelum, Chenab) Pakistan'a tahsis ederek bölünme sonrası on yıllık anlaşmazlığı çözdü.",
  },
  "ethiopia contests 1929 nile agreement validity": {
    title: "Etiyopya 1929 Nil Anlaşmasının Geçerliliğine İtiraz Etti",
    description: "Etiyopya, 1929 İngiliz-Mısır Nil Suları Anlaşması'nın Etiyopya'nın rızası olmadan imzalandığını ve Mavi Nil ile Tana Gölü kolları üzerindeki haklarını bağlamayacağını belirterek anlaşmanın geçerliliğine resmen meydan okudu.",
  },
  "columbia river treaty signed": {
    title: "Kolombiya Nehri Antlaşması İmzalandı",
    description: "Amerika Birleşik Devletleri ve Kanada, sel kontrolü ve hidroelektrik amacıyla Britanya Kolombiyası'nda üç baraj inşasını öngören Kolombiya Nehri Antlaşması'nı imzaladı. ABD sel kontrolü sağladı ve Kanada'ya yaklaşık 65 milyon dolar ödedi; Kanada ise aşağı havza enerji faydalarının yarısını aldı.",
  },
  "aswan high dam construction begins with soviet aid": {
    title: "Asvan Yüksek Barajı İnşası Sovyet Yardımıyla Başladı",
    description: "Mısır, Sovyetler Birliği'nin finansal ve teknik yardımıyla Asvan Yüksek Barajı'nın inşasına başladı. Proje, Mısır için taşkın kontrolü ve sulama güvencesi sağlarken Nil akış rejimi ve alüvyon taşınımını kalıcı olarak değiştirdi.",
  },
  "niger basin act of niamey": {
    title: "Niamey Nijer Havzası Senedi",
    description: "Dokuz Nijer kıyıdaş devleti, seyrüsefer ve ekonomik kalkınmayı düzenleyen Niamey Senedi'ni kabul etti; bu girişim sömürge sonrası Batı Afrika'da ilk çok taraflı nehir havzası anlaşması oldu.",
  },
  "israel-syria jordan river water war begins": {
    title: "İsrail-Suriye Şeria Nehri Su Çatışmaları Başladı",
    description: "İsrail'in Ulusal Su Taşıyıcısı projesini tamamlamasının ardından Arap Birliği, Baniyas ve Hasbani kollarını Şeria'dan uzaklaştırmak için karşı su yönlendirme projeleri başlattı. İsrail Savunma Kuvvetleri bu inşaatları vurdu ve bu durum 1967 savaşına giden süreçte gerilimi tırmandırdı.",
  },
  "river niger commission founded": {
    title: "Nijer Nehri Komisyonu Kuruldu",
    description: "Niamey Senedi'ni takiben kıyıdaş ülkeler, ortak su kaynaklarını yönetmek ve navigasyonu koordine etmek üzere Nijer Nehri Komisyonu'nu resmen kurdu.",
  },
  "six-day war: water as a casus belli": {
    title: "Altı Gün Savaşı: Bir Casus Belli Olarak Su",
    description: "İsrail, Şeria Nehri'nin yukarı kollarını (Baniyas ve Golan Tepeleri) ve Batı Şeria dağ akiferlerini ele geçirdi. Su kaynaklarının kontrolü, savaşın önemli bir stratejik faktörüydü ve İsrail'in su güvenliğini kökten değiştirdi.",
  },
  "aswan high dam completed": {
    title: "Asvan Yüksek Barajı Tamamlandı",
    description: "Mısır, Nasır Gölü rezervuarını oluşturan Asvan Yüksek Barajı'nı resmen hizmete açtı. Baraj, Mısır'a çok yıllık su depolama olanağı sundu ancak yukarı kıyıdaşlar ile Mısır'ın su bağımlılığı dengesini pekiştirdi.",
  },
  "omvs senegal river basin organization founded": {
    title: "OMVS Senegal Nehri Havzası Örgütü Kuruldu",
    description: "Mali, Moritanya ve Senegal, Senegal Nehri Kalkınma Örgütü'nü (OMVS) kurarak ortak baraj yatırımları ve su yönetimi için dünyada örnek gösterilen bir ortak mülkiyet ve fayda paylaşımı mekanizması hayata geçirdi.",
  },
  "helmand river treaty: afghanistan-iran": {
    title: "Helmand Nehri Antlaşması: Afganistan-İran",
    description: "Afganistan ve İran, Helmand (Hirmand) Nehri'nden İran'ın Sistan bölgesine normal hidrolojik koşullarda saniyede 22 m³ su akışını garanti altına alan tarihi bir su paylaşım antlaşması imzaladı.",
  },
  "turkey-syria euphrates crisis": {
    title: "Türkiye-Suriye Fırat Krizi",
    description: "Türkiye'nin Keban Barajı ile Suriye'nin Tabka Barajı'nı aynı dönemde doldurması ve yaşanan şiddetli kuraklık, Irak'a ulaşan Fırat akışını kritik seviyelere düşürdü. Irak ve Suriye askeri birliklerini sınıra yığdı; Suudi Arabistan ve Sovyet diplomatik arabuluculuğuyla çatışma kıl payı önlendi.",
  },
  "india opens farakka barrage on ganges": {
    title: "Hindistan Ganj Üzerindeki Farakka Bendi'ni Açtı",
    description: "Hindistan, Kalküta Limanı'ndaki silt birikimini temizlemek amacıyla Ganj sularını Hooghly Nehri'ne yönlendiren Farakka Bendi'ni devreye soktu; bu durum aşağı kıyıdaş Bangladeş'te kuru mevsim akışlarını ciddi şekilde azalttı.",
  },
  "rhine salt pollution treaty": {
    title: "Ren Nehri Tuz Kirliliği Sözleşmesi",
    description: "Fransa, Almanya, Hollanda, İsviçre ve Lüksemburg, Alsas potas madenlerinden Ren Nehri'ne yapılan klorür deşarjını sınırlamak ve aşağı havza su kalitesini korumak amacıyla Bonn Klorür Sözleşmesi'ni imzaladı.",
  },
  "egypt's sadat threatens war over nile": {
    title: "Mısır Devlet Başkanı Enver Sedat Nil İçin Savaş Tehdidinde Bulundu",
    description: "Mısır Cumhurbaşkanı Enver Sedat, Etiyopya'nın Nil sularını kesebilecek veya azaltabilecek herhangi bir girişimine karşı Mısır'ın askeri güç kullanmaktan çekinmeyeceğini açıkça ilan etti.",
  },
  "niger basin authority created": {
    title: "Nijer Havzası Otoritesi (NBA) Kuruldu",
    description: "Eski Nijer Nehri Komisyonu yeniden yapılandırılarak daha geniş yetkilerle donatılmış Nijer Havzası Otoritesi'ne (NBA) dönüştürüldü ve 9 kıyıdaş devletin entegre havza yönetimi güçlendirildi.",
  },
  "iraq drains mesopotamian marshes as weapon": {
    title: "Irak Mezopotamya Bataklıklarını Silah Olarak Kuruttu",
    description: "Saddam Hüseyin rejimi, Şii muhalifleri ve bataklık Araplarını sindirmek amacıyla Fırat ve Dicle nehirlerinin sularını yönlendirip kurutma kanalları açarak Mezopotamya bataklıklarının %90'ını yok etti ve suyu bir cezalandırma silahı olarak kullandı.",
  },
  "turkey-syria euphrates water-pkk agreement": {
    title: "Türkiye-Suriye Fırat Suyu-Güvenlik Protokolü",
    description: "Türkiye ve Suriye, Türkiye'nin Fırat sınırından Suriye'ye aylık ortalama en az 500 m³/sn su bırakmasını taahhüt ettiği, Suriye'nin ise sınır güvenliği konusunda güvence verdiği bir Ekonomik İşbirliği Protokolü imzaladı.",
  },
  "india-bangladesh ganges dispute worsens": {
    title: "Hindistan-Bangladeş Ganj İhtilafı Derinleşti",
    description: "Önceki geçici su paylaşım anlaşmalarının süresi dolduktan sonra müzakereler tıkandı; Bangladeş, kurak mevsimde tarımsal verim kaybı ve tuzlanma gerekçesiyle Hindistan'ı tek taraflı su çekmekle suçladı.",
  },
  "turkey cuts euphrates flow during gulf war": {
    title: "Türkiye Körfez Savaşı Sırasında Fırat Akışını Kesti",
    description: "Türkiye, dev Atatürk Barajı rezervuarını doldurmak amacıyla Fırat akışını bir ay süreyle kesti. Önceden komşu ülkelere duyurulmuş ve ilave su verilmiş olmasına rağmen, yaklaşan Körfez Savaşı gerilimiyle birlikte Irak ve Suriye sert diplomatik tepki gösterdi.",
  },
  "aral sea interstate commission for water coordination": {
    title: "Aral Denizi Devletlerarası Su Koordinasyon Komisyonu (ICWC)",
    description: "Sovyetler Birliği'nin dağılmasının ardından beş Orta Asya cumhuriyeti (Kazakistan, Kırgızistan, Tacikistan, Türkmenistan, Özbekistan), Seyhun ve Ceyhun havzalarındaki su kotalarını ortak yönetmek için Almatı Anlaşması ile ICWC'yi kurdu.",
  },
  "aral sea central asia budget pledge": {
    title: "Aral Denizi Orta Asya Bütçe Taahhüdü (Nukus Deklarasyonu)",
    description: "Beş Orta Asya lideri Nukus'ta toplanarak Aral Denizi'ni Kurtarma Uluslararası Fonu'na (IFAS) ulusal bütçelerinin belirli bir oranını aktarmayı taahhüt etti.",
  },
  "israel-jordan peace treaty water provisions": {
    title: "İsrail-Ürdün Barış Antlaşması Su Hükümleri",
    description: "İsrail ile Ürdün arasında imzalanan Barış Antlaşması'nın II. Eki, Şeria ve Yermuk nehirlerinin sularının paylaşımı ile ortak tuz giderme ve su depolama projelerini düzenleyen kalıcı bir rejim getirdi.",
  },
  "mekong river commission agreement": {
    title: "Mekong Nehri Komisyonu Anlaşması",
    description: "Kamboçya, Laos, Tayland ve Vietnam, Aşağı Mekong Havzası'nın sürdürülebilir kalkınması için Chiang Rai Anlaşması'nı imzalayarak Mekong Nehri Komisyonu'nu (MRC) oluşturdu; ancak yukarı kıyıdaşlar Çin ve Myanmar tam üye olmadı.",
  },
  "china begins manwan dam on mekong (lancang)": {
    title: "Çin Mekong (Lancang) Üzerinde Manwan Barajını İnşa Etti",
    description: "Çin, Yukarı Mekong (Lancang) üzerindeki ilk büyük hidroelektrik barajı olan Manwan'ı işletmeye aldı; bu durum aşağı havza ülkelerinde akış rejiminin bozulacağı ve tortu akışının kesileceği endişelerini başlattı.",
  },
  "india-bangladesh ganges water sharing treaty": {
    title: "Hindistan-Bangladeş Ganj Suları Paylaşım Antlaşması",
    description: "Hindistan ve Bangladeş, Farakka Bendi'nde 30 yıllık bağlayıcı bir su paylaşım formülü belirleyen tarihi Ganj Antlaşması'nı imzalayarak yarım asırlık uyuşmazlığı kurumsal bir çözüme kavuşturdu.",
  },
  "iraq calls for tigris-euphrates sharing agreement": {
    title: "Irak Dicle ve Fırat İçin Nihai Su Paylaşım Anlaşması Çağrısı Yaptı",
    description: "Irak, Türkiye'nin GAP projeleri ve Suriye barajları nedeniyle debilerin azaldığını belirterek üç kıyıdaş devlet arasında bağlayıcı ve nihai bir su tahsis anlaşması imzalanması çağrısında bulundu.",
  },
  "danube river protection convention enters force": {
    title: "Tuna Nehri Koruma Sözleşmesi Yürürlüğe Girdi",
    description: "Tuna Havzası'ndaki 14 ülke ve Avrupa Birliği'nin imzaladığı Sofia Sözleşmesi yürürlüğe girdi ve Tuna Nehri'ni Koruma Uluslararası Komisyonu (ICPDR) resmen çalışmaya başladı.",
  },
  "nile basin initiative established": {
    title: "Nil Havzası Girişimi (NBI) Kuruldu",
    description: "Nil kıyıdaşı 10 ülke, kaynakları adil paylaşmak, teknik işbirliğini artırmak ve sürdürülebilir kalkınmayı sağlamak üzere Darüsselam'da Nil Havzası Girişimi'ni (NBI) başlattı.",
  },
  "cochabamba water war, bolivia": {
    title: "Cochabamba Su Savaşı, Bolivya",
    description: "Bolivya'nın Cochabamba kentinde içme suyu şebekesinin özelleştirilmesi ve faturaların %300'e varan oranlarda artması üzerine kitlesel halk ayaklanması çıktı; olağanüstü hal ilan edildi ve hükümet özelleştirme sözleşmesini feshetmek zorunda kaldı.",
  },
  "india's baglihar dam dispute with pakistan": {
    title: "Hindistan-Pakistan Baglihar Barajı İhtilafı",
    description: "Pakistan, Hindistan'ın Chenab Nehri üzerinde inşa ettiği Baglihar Hidroelektrik Santrali'nin İndus Suları Antlaşması'nın su depolama ve tahliye kriterlerini ihlal ettiğini ileri sürerek uluslararası arabuluculuk sürecini başlattı.",
  },
  "iraq war: water infrastructure destruction": {
    title: "Irak Savaşı: Su Altyapısının Yıkımı ve Hedef Alınması",
    description: "ABD liderliğindeki askeri harekat ve sonrasındaki çatışmalarda Irak'ın su arıtma, dağıtım ve kanalizasyon şebekeleri bombalandı, elektrik kesintileriyle hizmet dışı kaldı; milyonlarca sivil temiz sudan mahrum kaldı.",
  },
  "zambezi watercourse commission agreement (zamcom)": {
    title: "Zambezi Su Yolu Komisyonu Anlaşması (ZAMCOM)",
    description: "Sekiz kıyıdaş ülke (Angola, Botsvana, Malavi, Mozambik, Namibya, Tanzanya, Zambiya, Zimbabve), Kasane'de ZAMCOM Anlaşması'nı imzalayarak ortak havza yönetimi için kurumsal temel attı.",
  },
  "kazakhstan kok-aral dam saves north aral sea": {
    title: "Kazakistan Kök-Aral Barajı ile Kuzey Aral Denizi'ni Kurtardı",
    description: "Dünya Bankası desteğiyle tamamlanan 13 kilometrelik Kök-Aral Bendi, Seyhun Nehri'nin sularını Kuzey Aral'da toplayarak su seviyesini 38 metreden 42 metreye çıkardı, tuzluluğu yarıya indirdi ve balıkçılığı yeniden canlandırdı.",
  },
  "euphrates-tigris initiative for cooperation (etic)": {
    title: "Fırat-Dicle İşbirliği Girişimi (ETIC) Başlatıldı",
    description: "Türkiye, Suriye ve Irak'tan akademisyenler ve su uzmanları, siyasi kutuplaşmayı aşmak ve havzada teknik veri paylaşımı ile ortak projeler üretmek üzere sivil toplum odaklı ETIC platformunu kurdu.",
  },
  "world bank neutral expert rules on baglihar dam": {
    title: "Dünya Bankası Tarafsız Uzmanı Baglihar Kararını Verdi",
    description: "Dünya Bankası tarafından atanan İsviçreli tarafsız uzman Prof. Raymond Lafitte, Hindistan'ın baraj yüksekliğini ve batık savak tasarımını kısmen revize etmesine, ancak projenin ana hatlarıyla devamına onay vererek teknik ihtilafı çözdü.",
  },
  "nile cfa negotiations stall": {
    title: "Nil CFA Müzakereleri Tıkandı",
    description: "Yukarı havza ülkeleri ile aşağı havza ülkeleri (Mısır ve Sudan) arasındaki görüşmeler, 1929 ve 1959 anlaşmalarındaki tarihi su hakları ve ön onay veto hakkı maddesi (Madde 14b) üzerinde uzlaşma sağlanamaması sebebiyle kilitlendi.",
  },
  "niger basin water charter adopted": {
    title: "Nijer Havzası Su Şartı Kabul Edildi",
    description: "Nijer Havzası Otoritesi üyesi 9 ülkenin devlet başkanları, havzada su tahsisi, ortak baraj yönetimi ve çevresel koruma ilkelerini belirleyen bağlayıcı Su Şartı'nı kabul etti.",
  },
  "turkey-iraq and turkey-syria water mous": {
    title: "Türkiye-Irak ve Türkiye-Suriye Su Mutabakat Muhtıraları",
    description: "Türkiye, Irak ve Suriye arasında kurulan Yüksek Düzeyli Stratejik İşbirliği Konseyleri kapsamında su yönetimi, modern sulama teknikleri ve meteorolojik veri paylaşımına ilişkin kapsamlı mutabakat zabıtları imzalandı.",
  },
  "mekong low water levels crisis": {
    title: "Mekong Havzasında Tarihi Düşük Su Seviyesi Krizi",
    description: "Aşağı Mekong'da su seviyeleri 50 yılın en düşük düzeyine geriledi; kıyıdaş topluluklar kuraklık ve Çin'in yukarı havzada inşa ettiği kaskat barajların su tutmasını ana etken olarak suçladı.",
  },
  "nile cooperative framework agreement opened for signature": {
    title: "Nil İşbirliği Çerçeve Anlaşması (CFA) İmzaya Açıldı",
    description: "Etiyopya, Uganda, Ruanda, Tanzanya ve Kenya, Entebbe'de Mısır ve Sudan'ın boykot ettiği Nil CFA'yı imzalayarak eşitlikçi ve makul kullanım ilkesini benimsedi ve sömürge dönemi anlaşmalarını tanımadıklarını ilan etti.",
  },
  "ethiopia announces grand ethiopian renaissance dam": {
    title: "Etiyopya Büyük Rönesans Barajı'nı (GERD) Duyurdu",
    description: "Etiyopya, Mavi Nil üzerinde 5 milyar dolarlık ve 74 milyar m³ rezervuar kapasiteli Afrika'nın en büyük hidroelektrik santrali olacak GERD projesini kamuoyuna ilan etti; bu adım Nil jeopolitiğinde tarihi bir kırılma yarattı.",
  },
  "xayaburi dam controversy, laos": {
    title: "Laos Xayaburi Barajı Tartışması, Mekong",
    description: "Laos, Aşağı Mekong ana kolu üzerindeki ilk hidroelektrik baraj olan 1.285 MW'lık Xayaburi Barajı'nın inşasına başladı; Kamboçya ve Vietnam balık göçü ve alüvyon akışının kesileceğini belirterek sert diplomatik itirazlarda bulundu.",
  },
  "ethiopia ratifies nile cfa": {
    title: "Etiyopya Nil CFA'sını Mecliste Onayladı",
    description: "Etiyopya Parlamentosu, 1929 anlaşmasının hükümsüz olduğunu tescil eden Nil İşbirliği Çerçeve Anlaşması'nı oybirliğiyle onayladı; bu adım Mısır'da televizyondan canlı yayınlanan kriz toplantılarına ve savaş tehditlerine yol açtı.",
  },
  "ukraine blocks north crimean canal": {
    title: "Ukrayna Kuzey Kırım Kanalı'nı Kesti",
    description: "Rusya'nın Kırım'ı ilhakının ardından Ukrayna, yarımadanın tatlı su ihtiyacının %85'ini karşılayan Dinyeper kaynaklı Kuzey Kırım Kanalı'nın akışını bir setle keserek suyu stratejik bir karşı baskı aracı olarak kullandı.",
  },
  "egypt-ethiopia-sudan declaration of principles": {
    title: "Mısır-Etiyopya-Sudan İlkeler Deklarasyonu",
    description: "Üç ülkenin devlet başkanları Hartum'da toplanarak GERD'in ilk dolumu ve işletilmesinde tarafların birbirine 'önemli zarar vermeme' ve 'adil kullanım' ilkelerine bağlı kalacağını belirten 10 maddelik İlkeler Deklarasyonu'nu imzaladı.",
  },
  "pakistan requests arbitration on kishanganga and ratle dams": {
    title: "Pakistan Kishanganga ve Ratle Barajları İçin Tahkim İstedi",
    description: "Pakistan, Hindistan'ın Jhelum kolu Kishanganga ve Chenab üzerindeki Ratle projelerinin İndus Antlaşması tasarım kurallarını aştığını belirterek Lahey Daimi Tahkim Mahkemesi'ne (PCA) başvurdu.",
  },
  "mekong reaches lowest level in 100 years": {
    title: "Mekong Son 100 Yılın En Düşük Seviyesine İndi",
    description: "Aşağı Mekong Nehri'nde eşi görülmemiş kuraklık ve su çekilmesi yaşandı; nehir rengi maviye dönüştü (besin sedimenti yok oldu). Uydu analizleri Çin rezervuarlarının yukarıda milyarlarca metreküp su tuttuğunu ortaya koydu.",
  },
  "cauvery water dispute: india inter-state violence": {
    title: "Cauvery Su İhtilafı: Hindistan Eyaletlerarası Şiddet",
    description: "Karnataka ve Tamil Nadu eyaletleri arasında Cauvery Nehri su tahsisi konusunda çıkan anlaşmazlık kitlesel protestolara, araç kundaklamalarına ve sokağa çıkma yasaklarına dönüştü; Hindistan Yüksek Mahkemesi tahsis kotalarını zorunlu olarak yeniden belirledi.",
  },
  "india threatens to block indus tributaries after pulwama attack": {
    title: "Hindistan Pulwama Saldırısı Sonrası İndus Kollarını Kesme Tehdidinde Bulundu",
    description: "Keşmir'deki Pulwama terör saldırısının ardından Hindistan Su Kaynakları Bakanlığı, Hindistan'a ait doğu nehir sularının Pakistan'a akmasını tamamen durdurup Hint eyaletlerine yönlendirecek projeleri hızlandırdığını açıkladı.",
  },
  "ethiopia second nile cfa ratification fails": {
    title: "Etiyopya Nil CFA İkinci Tur Müzakereleri",
    description: "ABD ve Dünya Bankası arabuluculuğunda Washington'da yürütülen GERD dolum müzakereleri, Etiyopya'nın bağlayıcı bir kuraklık protokolünü ulusal egemenliğe aykırı bulması ve nihai taslak toplantısını terk etmesiyle sonuçsuz kaldı.",
  },
  "egypt brings gerd dispute to un security council": {
    title: "Mısır GERD İhtilafını BM Güvenlik Konseyi'ne Taşıdı",
    description: "Mısır, Etiyopya'nın tek taraflı baraj doldurma hamlelerinin uluslararası barış ve güvenliği tehdit ettiğini ileri sürerek konuyu Birleşmiş Milletler Güvenlik Konseyi'ne (BMGK) taşıdı ve acil müdahale talep etti.",
  },
  "ethiopia begins first gerd filling": {
    title: "Etiyopya İlk GERD Dolumunu Gerçekleştirdi",
    description: "Etiyopya, Mısır ve Sudan ile üçlü bir anlaşmaya varmadan GERD rezervuarının ilk aşama dolumunu (4,9 milyar m³) tamamladığını açıkladı ve bunun yoğun muson yağmurları sayesinde doğal olarak gerçekleştiğini savundu.",
  },
  "mexico-us colorado/rio grande water debt tensions": {
    title: "Meksika-ABD Rio Grande Su Borcu Gerginliği",
    description: "1944 Su Antlaşması kapsamında ABD'ye su teslimatı yapılmasına karşı çıkan Meksikalı çiftçiler, Chihuahua eyaletindeki La Boquilla Barajı'nı işgal etti; Meksika Ulusal Muhafızları ile çiftçiler arasında çıkan çatışmada can kayıpları yaşandı.",
  },
  "kyrgyzstan-tajikistan isfara river armed clash": {
    title: "Kırgızistan-Tacikistan İsfara Nehri Silahlı Çatışması",
    description: "Ortak Golovnoy su dağıtım noktasına güvenlik kameraları takılması üzerine başlayan sınır uyuşmazlığı, iki ülke orduları arasında havan ve zırhlı araçların kullanıldığı 3 günlük çatışmaya dönüştü; 55'ten fazla kişi hayatını kaybetti.",
  },
  "ethiopia second gerd filling proceeds without agreement": {
    title: "Etiyopya Anlaşmasız İkinci GERD Dolumunu Yaptı",
    description: "Etiyopya, aşağı kıyıdaşların itirazlarına rağmen ikinci yıl dolumunu tamamlayarak baraj rezervuarındaki toplam su miktarını 13,5 milyar m³ seviyesine çıkardı.",
  },
  "afghanistan kamal khan dam opens on helmand": {
    title: "Afganistan Helmand Üzerindeki Kemal Han Barajı'nı Açtı",
    description: "Afganistan Devlet Başkanı Eşref Gani, 'Suya karşı petrol' söylemiyle Helmand Nehri üzerindeki Kemal Han Barajı'nı açtı; İran'ın Hamun sulak alanlarına giden suyun kesilmesi Tahran'da büyük tepkiye yol açtı.",
  },
  "kyrgyzstan-tajikistan large-scale clashes": {
    title: "Kırgızistan-Tacikistan Geniş Çaplı Sınır ve Su Çatışmaları",
    description: "Sınır ve su tesisleri üzerindeki kontrol uyuşmazlığı sebebiyle Kırgızistan ve Tacikistan sınırında topyekün çatışmalar patlak verdi; 100'den fazla insan öldü, 140 bin kişi tahliye edildi ve su pompaları zarar gördü.",
  },
  "afghanistan-iran helmand tensions intensify": {
    title: "Afganistan-İran Helmand Gerilimi Tırmandı",
    description: "İran Cumhurbaşkanı İbrahim Reisi, Taliban rejimine Helmand Nehri su haklarını teslim etmesi için açık ültimatom verdi; Taliban yetkilileri ise kuraklık sebebiyle rezervuarlarda su bulunmadığını iddia etti.",
  },
  "ethiopia third gerd filling": {
    title: "Etiyopya Üçüncü GERD Dolumunu Tamamladı",
    description: "Etiyopya, GERD rezervuarına üçüncü aşamada 8 milyar m³ ilave su depolandığını ve ikinci türbinin elektrik üretmeye başladığını duyurdu.",
  },
  "india-pakistan pca rules on indus waters treaty jurisdiction": {
    title: "Lahey Daimi Tahkim Mahkemesi İndus Yetkisini Teyit Etti",
    description: "Lahey Daimi Tahkim Mahkemesi (PCA), Hindistan'ın yargı yetkisi itirazını reddederek Pakistan'ın Kishanganga ve Ratle projelerine ilişkin davasını görmeye tam yetkili olduğuna karar verdi.",
  },
  "israel attacks gaza water infrastructure 250+ times": {
    title: "İsrail Gazze Su Altyapısını ve Dağıtımını Vurdu",
    description: "Ekim 2023'ten itibaren İsrail ordusu Gazze Şeridi'ne giden su boru hatlarını kesti, tuz giderme tesislerini, atık su arıtma ünitelerini ve su kuyularını hedef aldı; BM ve insan hakları örgütleri suyu savaş silahı olarak kullanma suçlamasında bulundu.",
  },
  "iran-afghanistan helmand deadly clashes": {
    title: "İran-Afganistan Helmand Sınırında Ölümcül Çatışma",
    description: "Helmand su hakları geriliminin zirveye ulaştığı Mayıs 2023'te İran sınır muhafızları ile Taliban güçleri arasında sınır karakollarında ağır silahlarla çatışma çıktı; sınır muhafızları hayatını kaybetti.",
  },
  "india nagarjunasagar dam police clash": {
    title: "Hindistan Nagarjunasagar Barajı Polis Çatışması",
    description: "Krishna Nehri üzerindeki kritik Nagarjunasagar Barajı'nın kontrolü ve su boşaltımı sebebiyle komşu Andhra Pradesh ve Telangana eyaletlerinin polis güçleri baraj gövdesinde fiziksel çatışmaya girdi; merkezi hükümet paramiliter birlik sevk etti.",
  },
  "kyrgyzstan-tajikistan final border treaty": {
    title: "Kırgızistan-Tacikistan Nihai Sınır ve Su Anlaşması",
    description: "Kırgızistan ve Tacikistan hükümetleri, Batken'de sınır hattının %98'ini belirleyen ve kanallar ile Golovnoy su tesisinin ortak yönetim rejimini kuran nihai barış protokolünü parafe etti.",
  },
  "gerd inaugurated, egypt protests at un": {
    title: "GERD Resmi Olarak Hizmete Açıldı, Mısır BMGK'ya Başvurdu",
    description: "Etiyopya Başbakanı Abiy Ahmed, GERD'in 4 türbininin faaliyete geçtiğini ve rezervuar dolumunun son aşamaya geldiğini duyurdu. Mısır Dışişleri Bakanlığı BM Güvenlik Konseyi'ne resmi şikayet mektubu yazarak uluslararası hukukun çiğnendiğini belirtti.",
  },
  "india suspends indus waters treaty after pahalgam attack": {
    title: "Hindistan Terör Saldırısı Sonrası İndus Antlaşmasını Askıya Aldı",
    description: "Keşmir Pahalgam'da yaşanan ölümcül terör saldırısının ardından Hindistan hükümeti, Pakistan'a resmi nota vererek 1960 İndus Suları Antlaşması'nı 'terör tehdidi ve köklü koşul değişiklikleri' gerekçesiyle tek taraflı olarak askıya aldığını bildirdi.",
  },
  "us-canada columbia river treaty renegotiation stalls": {
    title: "ABD-Kanada Kolombiya Nehri Antlaşması Revizyonu Tıkandı",
    description: "60 yıllık antlaşmanın modernizasyonu için 2024'te varılan ilke anlaşması, somon balığı göçü ve Kanada'ya ödenecek taşkın koruma bedelleri konusundaki anlaşmazlıklar sebebiyle yürürlüğe girmekte güçlük yaşadı.",
  },
  "kyrgyzstan-tajikistan-uzbekistan summit on water": {
    title: "Orta Asya Su-Enerji Zirvesi ve Konsorsiyum Kararı",
    description: "Kazakistan, Kırgızistan ve Özbekistan devlet başkanları Bişkek'te bir araya gelerek Kambarata-1 HES'in inşasını finanse edecek ve Seyhun akış rejimini güvenceye alacak Devletlerarası Su-Enerji Konsorsiyumu'nu onayladı.",
  },
  "colorado river compact signed": {
    title: "Kolorado Nehri Sözleşmesi İmzalandı",
    description: "ABD'nin yedi havza eyaleti, Santa Fe'de Kolorado Nehri sularını Yukarı ve Aşağı Havza arasında yıllık 7,5 milyon akre-feet (9,25 milyar m³) şeklinde eşit paylaştıran tarihi sözleşmeyi imzaladı.",
  },
  "us-mexico treaty on rio grande and colorado river": {
    title: "ABD-Meksika Rio Grande ve Kolorado Nehri Antlaşması",
    description: "ABD ve Meksika, Rio Grande, Kolorado ve Tijuana nehirlerinin sularını karşılıklı garanti kotalarıyla tahsis eden ve Uluslararası Sınır ve Su Komisyonu'nu (IBWC) kuran kapsamlı sınır su antlaşmasını imzaladı.",
  },
  "israel national water carrier operational": {
    title: "İsrail Ulusal Su Taşıyıcısı İşletmeye Alındı",
    description: "İsrail, Taberiye Gölü sularını boru hatları ve kanallarla kıyı ovalarına ve Necef Çölü'ne taşıyan Ulusal Su Taşıyıcısı'nı tam kapasite devreye aldı; komşu Arap devletleri suyun izinsiz çalındığını ilan etti.",
  },
  "rhine chemical pollution crisis": {
    title: "Ren Nehri Kimyasal Kirlilik Krizi",
    description: "Endosülfan böcek ilacının Ren Nehri'ne karışması sonucu Almanya ve Hollanda boyunca milyonlarca balık öldü; içme suyu alımları durduruldu ve bu facia Avrupa'da nehir koruma hukuku reformunu tetikledi.",
  },
  "sandoz chemical spill poisons rhine": {
    title: "Sandoz Kimyasal Faciası Ren Nehrini Zehirledi",
    description: "Basel yakınlarındaki Sandoz kimya deposunda çıkan yangını söndürmek için sıkılan tonlarca böcek ilaçlı su Ren'e aktı; yüzlerce kilometre boyunca nehir ekosistemi yok oldu ve acil alarm sistemleri kuruldu.",
  },
  "rhine action programme achieves salmon return": {
    title: "Ren Eylem Programı 'Somon 2000' Başarısı",
    description: "Uluslararası Ren Komisyonu'nun su kalitesi ve balık geçitleri restorasyon projeleri sayesinde, kirlilikten nesli tükenen Atlantik somonu yarım asır sonra ilk kez Ren Nehri'nde doğal olarak yumurtladı.",
  },
  "soviet union aral sea diversion decision": {
    title: "Sovyetler Birliği Aral Denizi Su Yönlendirme Kararı",
    description: "Sovyet planlamacılar pamuk monokültürünü beslemek amacıyla Seyhun ve Ceyhun nehirlerinin akışını devasa sulama kanallarına (Karakum Kanalı dahil) yönlendirdi; bu karar Aral Denizi'nin kuruma felaketini başlattı.",
  },
  "aral sea splits into north and south": {
    title: "Aral Denizi Kuzey ve Güney Olarak İkiye Bölündü",
    description: "Suların aşırı çekilmesi neticesinde Aral Denizi yüzölçümünün %50'sinden fazlasını kaybetti ve su hacmi bölünerek Kuzey (Küçük) Aral ve Güney (Büyük) Aral olarak iki ayrı su kütlesine ayrıldı.",
  },
  "india-bangladesh joint rivers commission": {
    title: "Hindistan-Bangladeş Ortak Nehirler Komisyonu (JRC)",
    description: "Bangladeş'in bağımsızlığının ardından iki ülke, 54 sınır aşan nehrin hidrolojik verilerini paylaşmak ve ortak taşkın erken uyarı sistemleri kurmak üzere Ortak Nehirler Komisyonu'nu kurdu.",
  },
  "india-bangladesh farakka barrage declaration": {
    title: "Hindistan-Bangladeş Farakka Deklarasyonu",
    description: "Başbakanlar İndira Gandi ve Şeyh Mucibur Rahman, Farakka Bendi'nin besleme kanalının Bangladeş'e zarar vermeyecek kontrollü deneme debileriyle işletilmesi konusunda geçici bir bildiriye imza attı.",
  },
  "danube cyanide spill from romania gold mine": {
    title: "Tuna Siyanür Faciası (Baia Mare, Romanya)",
    description: "Romanya'daki bir altın madeninin atık barajının patlaması sonucu 100 bin m³ siyanürlü ve ağır metalli su Somes, Tisza ve nihayet Tuna Nehri'ne karıştı; Macaristan ve Sırbistan'da tüm su canlıları zehirlendi.",
  },
  "mauritania-senegal border water conflict": {
    title: "Moritanya-Senegal Sınır Su Çatışması",
    description: "Senegal Nehri taşkın yatağındaki otlatma ve su hakları sebebiyle Moritanyalı çobanlar ile Senegalli çiftçiler arasında başlayan sürtüşme etnik şiddete ve iki ülke arasında savaşa ramak kalan bir krize dönüştü.",
  },
  "zacplan zambezi river system action plan": {
    title: "Zambezi Nehri Havzası Eylem Planı (ZACPLAN)",
    description: "Güney Afrika Kalkınma Topluluğu (SADC) ve UNEP işbirliğiyle Zambezi havzasında çevre odaklı su kaynakları yönetimi ve veri entegrasyonunu amaçlayan ZACPLAN başlatıldı.",
  },
  "anglo-egyptian nile waters agreement": {
    title: "İngiliz-Mısır Nil Suları Anlaşması",
    description: "İngiltere ile Mısır arasında yapılan nota teatisiyle Mısır'a yıllık 48 milyar m³, Sudan'a 4 milyar m³ su hakkı tanındı; Mısır'a yukarı Nil havzasındaki baraj ve sulama projeleri üzerinde mutlak veto yetkisi verildi.",
  },
  "israel declares independence: arab states threaten jordan water": {
    title: "İsrail'in Bağımsızlığı ve Şeria Havzası Tehditleri",
    description: "İsrail'in kurulmasının hemen ardından komşu Arap devletleri Şeria Nehri kollarını yönlendirme ve İsrail'in su alımlarını engelleme stratejilerini ilk kez bölgesel gündeme taşıdı.",
  },
  "israel captures west bank water resources": {
    title: "İsrail Batı Şeria Su Kaynaklarını Kontrol Altına Aldı",
    description: "1967 savaşı sonrası İsrail, Batı Şeria'daki dağ akiferlerini ve yeraltı kuyularını askeri emirlerle doğrudan İsrail Su İdaresi'ne (Mekorot) bağladı; Filistinlilerin kuyu açmasını ve su çekmesini kısıtladı.",
  },
  "oslo ii accords west bank water provisions": {
    title: "Oslo II Anlaşması Batı Şeria Su Hükümleri",
    description: "İsrail ile Filistin Kurtuluş Örgütü arasında imzalanan geçici anlaşmanın 40. maddesiyle Ortak Su Komitesi (JWC) kuruldu; Filistin tarafına belirli su kotaları tahsis edildi ancak nihai su hakları ertelendi.",
  },
  "lauca river diversion: chile-bolivia ongoing dispute": {
    title: "Lauca Nehri İhtilafı: Şili-Bolivya",
    description: "Şili'nin Lauca Nehri sularını Azapa Vadisi'ne aktarması üzerine Bolivya ile yaşanan yarım asırlık diplomatik sürtüşme, And dağları havzasında su egemenliği ve denize çıkış tartışmalarıyla alevlendi.",
  },
  "lake chad basin commission established": {
    title: "Çad Gölü Havzası Komisyonu (LCBC) Kuruldu",
    description: "Kamerun, Çad, Nijer ve Nijerya liderleri, Sahel bölgesinin can damarı olan Çad Gölü'nü korumak ve su kaynaklarını entegre yönetmek üzere Fort Lamy'de LCBC'yi oluşturdu.",
  },
  "lake chad near collapse triggers regional crisis": {
    title: "Çad Gölü'nün Yok Olma Noktasına Gelmesi",
    description: "Aşırı sulama ve şiddetli iklim kuraklığı nedeniyle Çad Gölü orijinal yüzölçümünün %90'ından fazlasını kaybetti; milyonlarca balıkçı ve çiftçi göç etmek zorunda kalarak Boko Haram gibi çatışma dinamiklerine zemin hazırladı.",
  },
  "gulf war: iraqi forces discharge oil into gulf waterways": {
    title: "Körfez Savaşı: Basra Körfezi'ne Petrol Boşaltımı",
    description: "Irak birlikleri Kuveyt'ten çekilirken petrol vanalarını denize açarak su arıtma ve deniz suyu tuz giderme tesislerini hedef aldı; su güvenliği tarihin en büyük çevre terörizmi eylemiyle silah haline getirildi.",
  },
  "lesotho highlands water project: south africa-lesotho": {
    title: "Lesotho Yaylaları Su Projesi (LHWP)",
    description: "Lesotho ve Güney Afrika arasındaki ortak dev baraj ve tünel sistemi devreye girerek Maloti dağlarındaki temiz suyu Gauteng sanayi bölgesine taşırken Lesotho'ya elektrik ve telif geliri sağladı.",
  },
  "india builds farakka barrage permanently operational": {
    title: "Farakka Bendi Kalıcı Olarak Devreye Girdi",
    description: "Hindistan Farakka Bendi'ni tam operasyonel hale getirdi; Bangladeş hükümeti Padma kolundaki kuraklık, nehir içi navigasyonun çökmesi ve güney bölgelerindeki tuzlu su istilası nedeniyle BM'ye resmi şikayette bulundu.",
  },
  "india suspends permanent indus commission talks": {
    title: "Hindistan Daimi İndus Komisyonu Görüşmelerini Askıya Aldı",
    description: "Uri askeri üssüne yapılan saldırının ardından Hindistan Başbakanı Narendra Modi, 'Kan ve su aynı anda akamaz' diyerek Daimi İndus Komisyonu'nun rutin toplantılarını dondurdu.",
  },
  "colorado river reaches sea for first time in decades": {
    title: "Kolorado Nehri On Yıllar Sonra İlk Kez Denize Ulaştı",
    description: "ABD ve Meksika arasındaki IBWC 319 Sayılı Karar kapsamında rezervuarlardan 'darbe akışı' (pulse flow) bırakılarak Kolorado Deltası'ndaki sulak alan ekosistemine tarihi bir can suyu verildi.",
  },
  "mekong committee suspended during vietnam war": {
    title: "Mekong Komitesi Vietnam Savaşı Sırasında Askıya Alındı",
    description: "Saygon'un düşüşü ve Kamboçya ile Laos'taki rejim değişiklikleri sebebiyle dört kıyıdaş arasındaki siyasi bağlar koptu; Mekong Komitesi çalışmaları geçici olarak durduruldu.",
  },
  "bangladesh liberation war: india diverts brahmaputra flows": {
    title: "Bangladeş Kurtuluş Savaşı ve Brahmaputra Suları",
    description: "Doğu Pakistan'daki savaş ve mülteci krizi döneminde su kaynaklarının kontrolü ve sel yönetimi stratejik bir unsur haline geldi; Hindistan ile sınır aşan nehir istişareleri kilitlendi.",
  },
  "guinea joins omvs senegal river basin authority": {
    title: "Gine OMVS Senegal Nehri Örgütü'ne Katıldı",
    description: "Senegal Nehri'nin kaynak ülkesi olan Gine, OMVS'ye tam üye olarak katıldı ve Fouta Djallon yaylalarındaki nehir kaynaklarının ortak koruma rejimine dahil olmasını sağladı.",
  },
  "aswan high dam sediment deprivation dispute": {
    title: "Asvan Barajı Alüvyon Yoksunluğu ve Delta Erozyonu İhtilafı",
    description: "Asvan Barajı'nın tortu tutması sebebiyle Nil Deltası kıyılarının aşınması ve Akdeniz tuzlu suyunun delta akiferlerine sızması, Mısır ile yukarı kıyıdaşlar arasındaki baraj planlama tartışmalarında kritik bir tartışma başlığı oldu.",
  },
  "burundi signs nile cfa": {
    title: "Burundi Nil CFA'sını İmzaladı",
    description: "Burundi, Nil İşbirliği Çerçeve Anlaşması'nı imzalayan altıncı yukarı havza ülkesi olarak anlaşmanın yürürlüğe girmesi için gereken eşiğin aşılmasına kritik bir katkı sağladı.",
  },
  "taliban takeover threatens helmand treaty compliance": {
    title: "Taliban'ın Kabil'i Ele Geçirmesi ve Helmand Antlaşması",
    description: "Taliban'ın yönetimi yeniden ele geçirmesinin ardından Kemal Han Barajı savaklarının açılmaması ve İran'a su verilmemesi Tahran ile Kabil arasında askeri sınır gerginliğini tırmandırdı.",
  },
  "china opens mekong water releases during drought": {
    title: "Çin Aşağı Mekong Kuraklığında Acil Su Salımı Yaptı",
    description: "Aşağı kıyıdaş ülkelerin yoğun diplomatik baskısı ve uydu raporlarının ardından Çin, kuraklığı hafifletmek üzere Lancang barajlarından acil hidrolojik su tahliyesi başlattı.",
  },
  "uzbekistan 2024 water emergency regime": {
    title: "Özbekistan 2024 Acil Su Tasarrufu Rejimi İlan Etti",
    description: "Aral Denizi havzasındaki amansız su kaybı ve kuraklık karşısında Özbekistan Cumhurbaşkanı Şevket Mirziyoyev, tarımda su israfını önlemek için ülke çapında olağanüstü acil tasarruf seferberliği başlattı.",
  },
  "rhine convention for protection enters force": {
    title: "Ren Nehri Atık ve Seyrüsefer Sözleşmesi Yürürlüğe Girdi",
    description: "Ren boyunca seyreden gemilerin yağlı atık, sintine suyu ve çöplerini nehre dökmesini yasaklayan ve kıyı arıtma tesislerine teslimini zorunlu kılan uluslararası sözleşme yürürlüğe girdi.",
  },
  "india-nepal mahakali treaty disputes": {
    title: "Hindistan-Nepal Mahakali Antlaşması Anlaşmazlıkları",
    description: "1996 tarihli Mahakali Antlaşması kapsamında planlanan Pancheshwar Çok Amaçlı Baraj Projesi, elektrik paylaşımı ve su hakları konusundaki fikir ayrılıkları nedeniyle çıkmaza girdi.",
  },
  "china lancang-mekong cooperation mechanism proposed": {
    title: "Çin Lancang-Mekong İşbirliği (LMC) Mekanizmasını Kurdu",
    description: "Çin, Mekong Nehri Komisyonu'nun (MRC) dışındaki bir formatta 6 kıyıdaş ülkeyi bir araya getiren ve Çin finansmanıyla desteklenen alternatif Lancang-Mekong İşbirliği Platformu'nu kurdu.",
  },
  "sudan splits from egypt on gerd negotiations": {
    title: "Sudan GERD Konusunda Mısır'dan Ayrıştı",
    description: "Sudan, GERD'in taşkınları önleme, alüvyonu tutma ve ucuz elektrik sağlama avantajlarını görerek Mısır'ın katı muhalefetinden ayrıştı ve Etiyopya projesine yapıcı destek vermeye başladı.",
  },
  "uganda ratifies nile cfa": {
    title: "Uganda Nil CFA Anlaşmasını Onayladı",
    description: "Uganda Parlamentosu Nil Havzası İşbirliği Çerçeve Anlaşması'nı resmen onaylayarak onay belgesini Afrika Birliği'ne tevdi etti.",
  },
  "israel-palestine west bank water access denied": {
    title: "Batı Şeria'da Filistinlilerin Suya Erişiminin Engellenmesi",
    description: "İsrail askeri yetkililerinin Filistin köylerindeki ruhsatsız su depolarını ve boru hatlarını yıkması, su kotalarını düşürmesi uluslararası insan hakları raporlarında su ayrımcılığı olarak belgelendi.",
  },
  "south sudan accedes to nile cfa": {
    title: "Güney Sudan Nil CFA Anlaşmasına Katıldı",
    description: "Güney Sudan Ulusal Meclisi Nil CFA'sını onayladı; bu adım anlaşmanın yürürlüğe girmesi için zorunlu olan 6 onay şartının tamamlanmasını sağladı.",
  },
  "sudan nile white nile water dispute": {
    title: "Sudan Beyaz Nil Su Paylaşımı Sürtüşmesi",
    description: "Güney Sudan'ın bağımsızlık referandumu öncesinde Beyaz Nil ve Sudd sulak alanlarındaki su kaynaklarının mülkiyeti ve Jonglei Kanalı projesinin geleceği Hartum ile Cuba arasında uyuşmazlık yarattı.",
  },
  "inter-american water rights: us-mexico colorado river salinity": {
    title: "IBWC 242 Sayılı Karar: Kolorado Nehri Tuzluluk Çözümü",
    description: "ABD ve Meksika, ABD'den Meksika'ya teslim edilen Kolorado suyunun tuzluluk oranını sınırlandıran ve Yuma Tuz Giderme Tesisi'nin kurulmasını öngören bağlayıcı 242 Sayılı Kararı kabul etti.",
  },
  "mosul and haditha dams built on tigris-euphrates": {
    title: "Dicle-Fırat Üzerinde Musul ve Hadise Barajları İnşa Edildi",
    description: "Irak, yukarı havzadaki Türk ve Suriye barajlarına karşı su depolama kapasitesini artırmak için Dicle üzerinde Musul (Saddam) ve Fırat üzerinde Hadise Barajlarını tamamladı.",
  },
  "gerd geological survey begins": {
    title: "Etiyopya Mavi Nil Üzerinde Gizli GERD Sondajlarını Başlattı",
    description: "Etiyopya hükümeti ve İtalyan Salini firması, Guba bölgesinde gelecekteki Rönesans Barajı'nın temelini oluşturacak gizli jeolojik ve topoğrafik saha etütlerini yürüttü.",
  },
  "lancang-mekong dam cascade alarms downstream": {
    title: "Lancang Baraj Kaskadı Aşağı Havzada Alarm Yarattı",
    description: "Çin'in Dachaoshan Barajı'nı tamamlayıp Xiaowan Barajı'nın inşasına başlaması, Kamboçya'daki Tonle Sap Gölü'nün taşkın döngüsünün bozulacağı endişelerini uluslararası zirvelere taşıdı.",
  },
  "nile cfa enters into force with 5 ratifications": {
    title: "Nil CFA Anlaşması 5 Onayla Resmen Yürürlüğe Girdi",
    description: "Güney Sudan'ın onay belgesini tevdi etmesiyle Nil İşbirliği Çerçeve Anlaşması (CFA) 13 Ekim 2024'te resmen yürürlüğe girdi ve Mısır ile Sudan'ın veto yetkisi tarihe karışarak Nil Nehri Havzası Komisyonu (NRBC) kuruldu.",
  },
  "uzbekistan expands irrigated land amid aral crisis": {
    title: "Özbekistan Aral Krizi Ortasında Sulanan Alanları Genişletti",
    description: "Aral Denizi'ne dökülen Ceyhun akışının rekor düşüşüne rağmen Özbekistan'ın tarım arazilerini genişletmesi ve Afganistan'ın Kuş Tepe Kanalı inşası, bölgedeki hidrolojik kırılganlığı tehlikeli boyuta ulaştırdı.",
  },
  "kazakhstan-uzbekistan northern aral sea restoration treaty": {
    title: "Kuzey Aral Denizi Restorasyonu Devletlerarası Antlaşması",
    description: "Kazakistan ve Özbekistan, Kuzey Aral Denizi'nin su hacmini büyütmek, Seyhun deltası sulak alanlarını canlandırmak ve Kök-Aral Bendi'ni yükseltmek amacıyla bağlayıcı restorasyon antlaşması imzaladı.",
  },
  "turkey-iraq operational drought protocol signed": {
    title: "Türkiye-Irak Aşırı Kuraklık Operasyonel Su Protokolü",
    description: "Türkiye ve Irak, Fırat ve Dicle havzalarında iklim değişikliği kaynaklı şiddetli kuraklık dönemlerinde baraj kapaklarından bırakılacak asgari garantili akışları belirleyen dinamik protokolü yürürlüğe koydu.",
  },
  "mekong commission enacts mainstream dam cascading rules": {
    title: "Mekong Komisyonu Ana Kol Kaskat Hidroelektrik Kuralları",
    description: "Mekong Nehri Komisyonu (MRC), ana kol üzerindeki tüm kademeli hidroelektrik barajların su tutma ve bırakma operasyonlarını dijital ikiz modellemesiyle anlık koordine eden bağlayıcı kuralları ilan etti.",
  },
};

export function getConflictTranslation(key: string): ConflictTr | undefined {
  if (!key) return undefined;
  if (conflictsTrById[key]) return conflictsTrById[key];
  const normalized = key.toLowerCase().trim();
  return conflictsTrByTitle[normalized];
}
