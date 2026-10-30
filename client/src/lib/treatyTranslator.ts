/**
 * Comprehensive Turkish/English Translation Engine for Water Treaties, Basins,
 * Purposes, Signatory Countries, and Conflict Milestones.
 */

import { getConflictTranslation, type ConflictTr } from '@/data/conflictsTr';
import type { Agreement, WaterConflict } from '@/components/MapViewer';

// ══════════════════════════════════════════════════════════════
// 1. Purpose / Topic Dictionary
// ══════════════════════════════════════════════════════════════

const purposeMapTr: Record<string, string> = {

  // Modern & Specific Topics
  'water quantity': 'Su Miktarı ve Tahsisi',
  'water allocation': 'Su Tahsisi',
  'water quantity/allocation': 'Su Miktarı ve Tahsisi',
  'water quality': 'Su Kalitesi ve Arıtma',
  'pollution': 'Kirlilik Kontrolü',
  'border and territorial issues': 'Sınır ve Toprak Düzenlemeleri',
  'territorial and border issues': 'Toprak ve Sınır Meseleleri',
  'border delimitation': 'Sınırın Belirlenmesi',
  'irrigation': 'Tarımsal Sulama',
  'irrigation modernization': 'Modern Basınçlı Sulama',
  'agriculture': 'Tarım ve Sulama',
  'hydropower': 'Hidroelektrik Enerji',
  'hydroelectric': 'Hidroelektrik Enerji',
  'joint hydropower construction': 'Ortak Hidroelektrik Baraj İnşası',
  'flood control': 'Sel ve Taşkın Kontrolü',
  'flood management': 'Taşkın ve Sel Yönetimi',
  'flood risk management': 'Taşkın Riski Yönetimi',
  'flood managements': 'Taşkın ve Sel Yönetimi',
  'drought management': 'Kuraklık Yönetimi',
  'drought contingency': 'Kuraklık Acil Durum Planı',
  'drought resilience': 'Kuraklığa Karşı Dayanıklılık',
  'environment': 'Çevre ve Doğa Koruma',
  'environmental': 'Çevre Koruma ve Ekoloji',
  'envrionmental': 'Çevre ve Doğa Koruma',
  'environmental protection': 'Çevre Koruma',
  'ecology': 'Ekoloji ve Biyoçeşitlilik',
  'ecosystem function': 'Ekosistem Fonksiyonları ve Ekolojik Akış',
  'fisheries': 'Balıkçılık ve Su Ürünleri',
  'fishing': 'Balıkçılık ve Su Ürünleri',
  'navigation': 'Seyrüsefer ve Ulaşım',
  'infrastructure': 'Altyapı ve Tesisler',
  'infrastructure safety': 'Baraj ve Altyapı Güvenliği',
  'infrastrucutre': 'Altyapı ve Tesisler',
  'infrastructure development': 'Altyapı Geliştirme',
  'funding and financing': 'Finansman ve Fonlama',
  'funding anf financing': 'Finansman ve Fonlama',
  'financial': 'Mali İşbirliği ve Fonlama',
  'domestic': 'İçme ve Kullanma Suyu',
  'domestic/municipal water': 'İçme ve Kullanma Suyu',
  'domestic water': 'İçme Suyu',
  'forestry and timber': 'Ormancılık ve Kereste',
  'timber': 'Kereste ve Ormancılık',
  'groundwater': 'Yeraltı Suları',
  'aquifer': 'Akifer Yönetimi',
  'dispute resolution': 'Uyuşmazlık Çözümü',
  'conflict resolution': 'Uyuşmazlık Çözümü',
  'data exchange': 'Veri ve Bilgi Paylaşımı',
  'monitoring': 'Hidrolojik İzleme ve Ölçüm',
  'online telemetry': 'Çevrimiçi Telemetri ve Ölçüm',
  'joint management': 'Ortak Havza Yönetimi',
  'comprehensive basin governance': 'Kapsamlı Havza Yönetimi',
  'equitable and reasonable utilization': 'Hakça ve Makul Kullanım',
  'shortage sharing': 'Kıtlık ve Kuraklık Paylaşımı',
  'water conservation': 'Su Tasarrufu ve Verimlilik',
  'binding seasonal water quotas': 'Bağlayıcı Mevsimsel Su Kotaları',
  'sediment management': 'Sediment ve Tortu Yönetimi',
  'climate change': 'İklim Değişikliği',
  'climate resilience': 'İklim Dayanıklılığı',
  'multilateral treaty accession': 'Çok Taraflı Sözleşmeye Katılım',
  'global water convention accession': 'Küresel Su Sözleşmesi Katılımı',

  'territorial': 'Toprak ve Sınır',
  'border issues': 'Sınır Meseleleri',
  'border': 'Sınır Düzenlemeleri',
  'infrastructure/development': 'Altyapı ve Kalkınma',
  'funding': 'Finansman ve Fonlama',
  'socioeconomic development': 'Sosyoekonomik Kalkınma',
  'economic development': 'Ekonomik Kalkınma',
  'domestic/municipal use': 'İçme ve Kullanma Suyu',
  'flood': 'Taşkın Yönetimi',
  'drought': 'Kuraklık Yönetimi',
  'climate': 'İklim Eylemi',
  'joint commission': 'Ortak Komisyon',
  'general': 'Genel Su Yönetimi',
};
export function translatePurpose(purpose: string | undefined, lang: 'tr' | 'en'): string {
  if (!purpose || !purpose.trim()) {
    return lang === 'tr' ? 'Kapsam Belirtilmemiş' : 'Purpose Not Specified';
  }
  if (lang === 'en') return purpose;

  // Split by comma, semicolon, or slash
  const parts = purpose.split(/[,;\/]+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return purpose;

  const translated = parts.map((p) => {
    const key = p.toLowerCase();
    if (purposeMapTr[key]) return purposeMapTr[key];
    // Check partial contains
    for (const [k, v] of Object.entries(purposeMapTr)) {
      if (key.includes(k)) return v;
    }
    return p;
  });

  // Deduplicate translated tokens
  const unique = Array.from(new Set(translated));
  return unique.join(' · ');
}

// ══════════════════════════════════════════════════════════════
// 2. Basin Name Dictionary
// ══════════════════════════════════════════════════════════════

const basinMapTr: Record<string, string> = {

  // Additional Global Basins
  'amur': 'Amur',
  'alakol': 'Alakol Gölü',
  'alsek': 'Alsek',
  'amazon': 'Amazon',
  'artibonite': 'Artibonite',
  'astara chay': 'Astara Çayı',
  'atrak': 'Atrek',
  'aviles': 'Aviles',
  'aysen': 'Aysen',
  'baker': 'Baker',
  'beilun': 'Beilun',
  'bidasoa': 'Bidasoa',
  'buzi': 'Buzi',
  'candelaria': 'Candelaria',
  'chira': 'Chira',
  'chuy': 'Çu (Şu)',
  'shu/chu': 'Çu (Şu)',
  'talas': 'Talas',
  'colorado': 'Kolorado',
  'columbia': 'Kolombiya',
  'congo': 'Kongo',
  'congo/zaire': 'Kongo (Zaire)',
  'connecticut': 'Connecticut',
  'copper': 'Copper',
  'coruh': 'Çoruh',
  'danube': 'Tuna',
  'daugava': 'Daugava (Batı Dvina)',
  'dnieper': 'Dinyeper',
  'dniester': 'Dinyester',
  'don': 'Don',
  'douro': 'Douro (Duero)',
  'douro/duero': 'Douro (Duero)',
  'drin': 'Drin',
  'elbe': 'Elbe',
  'elbe/labe': 'Elbe (Labe)',
  'ganges-brahmaputra-meghna': 'Ganj-Brahmaputra-Meghna',
  'helmand': 'Hilmend',
  'indus': 'İndus',
  'jordan': 'Şeria (Ürdün)',
  'kura-araks': 'Kura-Aras',
  'lake chad': 'Çad Gölü',
  'lake titicaca-poopo system': 'Titikaka-Poopo Gölü Sistemi',
  'lake titicaca': 'Titikaka Gölü',
  'limpopo': 'Limpopo',
  'mekong': 'Mekong',
  'meuse': 'Meuse (Maas)',
  'rhine-meuse': 'Ren-Meuse',
  'mississippi': 'Misisipi',
  'niger': 'Nijer',
  'nile': 'Nil',
  'oder': 'Oder',
  'oder/odra': 'Oder (Odra)',
  'okavango': 'Okavango',
  'orange': 'Oranj',
  'pungwe': 'Pungwe',
  'rhine': 'Ren',
  'rio grande': 'Rio Grande',
  'sabi': 'Save (Sabi)',
  'save': 'Save',
  'sava': 'Sava',
  'senegal': 'Senegal',
  'syr darya': 'Siriderya (Seyhun)',
  'amu darya': 'Amuderya (Ceyhun)',
  'aral sea': 'Aral Denizi',
  'tigris-euphrates/shatt al arab': 'Dicle-Fırat / Şattülarap',
  'tisza': 'Tisza (Tisa)',
  'tumen': 'Tumen (Tuman)',
  'uruguay': 'Uruguay',
  'volta': 'Volta',
  'vuoksa': 'Vuoksi',
  'zambezi': 'Zambezi',
  'zhu jiang/hsi': 'İnci Nehri (Zhu Jiang / Xi)',
  'groundwater': 'Yeraltı Suları / Akifer',

  // Turkish / Regional
  'tigris-euphrates': 'Fırat-Dicle',
  'asi/orontes': 'Asi Nehri',
  'orontes': 'Asi Nehri',
  'asi': 'Asi Nehri',
  'maritsa': 'Meriç',
  'meric': 'Meriç',

  // Major Global Basins
  'ganges': 'Ganj',
  'ganges-brahmaputra': 'Ganj-Brahmaputra',
  'brahmaputra': 'Brahmaputra',
  'la plata': 'La Plata',
  'incomati': 'İnkomati',
  'maputo': 'Maputo',
  'chad': 'Çad Gölü',
  'aral': 'Aral Denizi',
  'salween': 'Salven',
  'irrawaddy': 'İravadi',
  'rhone': 'Ron',
  'vistula': 'Vistül',
  'volga': 'Volga',
  'ob': 'Ob',
  'yenisey': 'Yenisey',
  'titicaca': 'Titikaka Gölü',
  'lake turkana': 'Turkana Gölü',
  'lake prespa': 'Prespa Gölü',
  'lake victoria': 'Viktorya Gölü',
  'lake geneva': 'Cenevre Gölü',
  'lake constance': 'Konstanz Gölü',
  'st. lawrence': 'St. Lawrence',
  'tagus': 'Tejo (Tagus)',
  'guadiana': 'Guadiana',
  'ebro': 'Ebro',
  'po': 'Po',
  'vardar': 'Vardar',
  'struma': 'Usturma (Struma)',
  'nestos': 'Mesta (Nestos)',
  'scheldt': 'Scheldt (Escaut)',
  'tarim': 'Tarım Havzası',
  'amudarya': 'Amuderya (Ceyhun)',
  'syrdarya': 'Siriderya (Seyhun)',
  'cauvery': 'Cauvery (Kaveri)',
  'krishna': 'Krishna',
  'narmada': 'Narmada',
  'godavari': 'Godavari',
};
export function translateBasin(basin: string | undefined, lang: 'tr' | 'en'): string {
  if (!basin || !basin.trim()) {
    return lang === 'tr' ? 'Havza Belirtilmemiş' : 'Basin Not Specified';
  }
  if (lang === 'en') return basin;

  const key = basin.toLowerCase().trim();
  if (basinMapTr[key]) return basinMapTr[key];

  // Try matching words
  for (const [k, v] of Object.entries(basinMapTr)) {
    if (key === k || key === `${k} river` || key === `river ${k}` || key === `${k} basin`) {
      return v;
    }
  }

  // Remove trailing "River" or "Basin"
  return basin
    .replace(/\s+River$/i, ' Nehri')
    .replace(/\s+Basin$/i, ' Havzası')
    .replace(/\s+Lake$/i, ' Gölü');
}

// ══════════════════════════════════════════════════════════════
// 3. Country Name Dictionary
// ══════════════════════════════════════════════════════════════

const countryMapTr: Record<string, string> = {

  // Extended & Historical Entities
  'mauritania': 'Moritanya',
  'dahomey': 'Benin (Dahomey)',
  'southern rhodesia': 'Zimbabve (Güney Rodezya)',
  'yuoslavia': 'Yugoslavya',
  'francence': 'Fransa',
  'union of south africa': 'Güney Afrika Birliği',
  'grand duchy of baden': 'Baden Büyük Dükalığı',
  'grand duchy of hessen': 'Hessen Büyük Dükalığı',
  'cote d’ivoire': 'Fildişi Sahili',
  'kyrghiz republic': 'Kırgızistan',
  'eswatini': 'Esvatini',
  'swaziland': 'Esvatini',
  'lesotho': 'Lesotho',
  'upper volta': 'Burkina Faso (Yukarı Volta)',
  'united nations': 'Birleşmiş Milletler (BM)',
  'european union': 'Avrupa Birliği (AB)',
  'european economic community': 'Avrupa Ekonomik Topluluğu',
  'austria-hungary': 'Avusturya-Macaristan',
  'czechoslovakia': 'Çekoslovakya',
  'czechoslovakian socialist republic': 'Çekoslovakya',
  'romanian socialist republic': 'Romanya',
  'soviet union': 'Sovyetler Birliği (SSCB)',
  'union of soviet socialist republics': 'Sovyetler Birliği (SSCB)',
  'ussr': 'SSCB',
  'dprk': 'Kuzey Kore',
  'rok': 'Güney Kore',
  'lao pdr': 'Laos',
  'viet nam': 'Vietnam',
  'syrian arab republic': 'Suriye',
  'flemish region': 'Flaman Bölgesi (Belçika)',
  'brussels-capital region': 'Brüksel Bölgesi (Belçika)',
  'walloon region': 'Valon Bölgesi (Belçika)',
  'the gambia': 'Gambiya',
  'gambia': 'Gambiya',

  'turkey': 'Türkiye',
  'turkiye': 'Türkiye',
  'syria': 'Suriye',
  'iraq': 'Irak',
  'iran': 'İran',
  'egypt': 'Mısır',
  'sudan': 'Sudan',
  'south sudan': 'Güney Sudan',
  'ethiopia': 'Etiyopya',
  'israel': 'İsrail',
  'jordan': 'Ürdün',
  'lebanon': 'Lübnan',
  'saudi arabia': 'Suudi Arabistan',
  'yemen': 'Yemen',
  'oman': 'Umman',
  'qatar': 'Katar',
  'kuwait': 'Kuveyt',
  'bahrain': 'Bahreyn',
  'uae': 'Birleşik Arap Emirlikleri (BAE)',
  'united arab emirates': 'Birleşik Arap Emirlikleri (BAE)',
  'palestine': 'Filistin',
  'cyprus': 'Kıbrıs',

  'india': 'Hindistan',
  'pakistan': 'Pakistan',
  'bangladesh': 'Bangladeş',
  'nepal': 'Nepal',
  'sri lanka': 'Sri Lanka',
  'bhutan': 'Butan',
  'afghanistan': 'Afganistan',

  'china': 'Çin',
  'japan': 'Japonya',
  'south korea': 'Güney Kore',
  'north korea': 'Kuzey Kore',
  'mongolia': 'Moğolistan',
  'cambodia': 'Kamboçya',
  'vietnam': 'Vietnam',
  'thailand': 'Tayland',
  'laos': 'Laos',
  'myanmar': 'Myanmar',
  'indonesia': 'Endonezya',
  'malaysia': 'Malezya',
  'philippines': 'Filipinler',
  'singapore': 'Singapur',

  'kazakhstan': 'Kazakistan',
  'uzbekistan': 'Özbekistan',
  'turkmenistan': 'Türkmenistan',
  'kyrgyzstan': 'Kırgızistan',
  'tajikistan': 'Tacikistan',

  'georgia': 'Gürcistan',
  'armenia': 'Ermenistan',
  'azerbaijan': 'Azerbaycan',

  'germany': 'Almanya',
  'france': 'Fransa',
  'netherlands': 'Hollanda',
  'belgium': 'Belçika',
  'luxembourg': 'Lüksemburg',
  'switzerland': 'İsviçre',
  'austria': 'Avusturya',
  'united kingdom': 'Birleşik Krallık',
  'uk': 'Birleşik Krallık',
  'great britain': 'Büyük Britanya',
  'ireland': 'İrlanda',
  'united states': 'Amerika Birleşik Devletleri (ABD)',
  'united states of america': 'Amerika Birleşik Devletleri (ABD)',
  'usa': 'ABD',
  'canada': 'Kanada',
  'spain': 'İspanya',
  'portugal': 'Portekiz',
  'italy': 'İtalya',
  'greece': 'Yunanistan',

  'russia': 'Rusya',
  'russian federation': 'Rusya Federasyonu',
  'ukraine': 'Ukrayna',
  'belarus': 'Belarus',
  'poland': 'Polonya',
  'czech republic': 'Çek Cumhuriyeti',
  'czechia': 'Çekya',
  'slovakia': 'Slovakya',
  'hungary': 'Macaristan',
  'romania': 'Romanya',
  'bulgaria': 'Bulgaristan',
  'serbia': 'Sırbistan',
  'croatia': 'Hırvatistan',
  'bosnia': 'Bosna-Hersek',
  'bosnia and herzegovina': 'Bosna-Hersek',
  'montenegro': 'Karadağ',
  'north macedonia': 'Kuzey Makedonya',
  'macedonia': 'Kuzey Makedonya',
  'albania': 'Arnavutluk',
  'slovenia': 'Slovenya',
  'kosovo': 'Kosova',
  'moldova': 'Moldova',
  'lithuania': 'Litvanya',
  'latvia': 'Letonya',
  'estonia': 'Estonya',
  'finland': 'Finlandiya',
  'sweden': 'İsveç',
  'norway': 'Norveç',
  'denmark': 'Danimarka',
  'iceland': 'İzlanda',

  'south africa': 'Güney Afrika',
  'nigeria': 'Nijerya',
  'kenya': 'Kenya',
  'tanzania': 'Tanzanya',
  'ghana': 'Gana',
  'uganda': 'Uganda',
  'rwanda': 'Ruanda',
  'burundi': 'Burundi',
  'mozambique': 'Mozambik',
  'zimbabwe': 'Zimbabve',
  'botswana': 'Botsvana',
  'namibia': 'Namibya',
  'zambia': 'Zambiya',
  'malawi': 'Malavi',
  'angola': 'Angola',
  'congo': 'Kongo',
  'democratic republic of the congo': 'Kongo Demokratik Cumhuriyeti',
  'drc': 'Kongo DC',
  'cameroon': 'Kamerun',
  'senegal': 'Senegal',
  'mali': 'Mali',
  'niger': 'Nijer',
  'chad': 'Çad',
  'ivory coast': 'Fildişi Sahili',
  'guinea': 'Gine',
  'burkina faso': 'Burkina Faso',
  'benin': 'Benin',
  'togo': 'Togo',
  'sierra leone': 'Sierra Leone',
  'liberia': 'Liberya',
  'somalia': 'Somali',
  'djibouti': 'Cibuti',
  'eritrea': 'Eritre',
  'morocco': 'Fas',
  'algeria': 'Cezayir',
  'tunisia': 'Tunus',
  'libya': 'Libya',

  'mexico': 'Meksika',
  'united mexican states': 'Meksika Birleşik Devletleri',
  'brazil': 'Brezilya',
  'argentina': 'Arjantin',
  'chile': 'Şili',
  'colombia': 'Kolombiya',
  'peru': 'Peru',
  'venezuela': 'Venezuela',
  'ecuador': 'Ekvador',
  'bolivia': 'Bolivya',
  'paraguay': 'Paraguay',
  'uruguay': 'Uruguay',
  'guatemala': 'Guatemala',
  'honduras': 'Honduras',
  'el salvador': 'El Salvador',
  'nicaragua': 'Nikaragua',
  'costa rica': 'Kosta Rika',
  'panama': 'Panama',
  'cuba': 'Küba',
  'guyana': 'Guyana',
  'suriname': 'Surinam',

  'australia': 'Avustralya',
  'new zealand': 'Yeni Zelanda',
  'yugoslavia': 'Yugoslavya',
};
export function translateCountry(country: string | undefined, lang: 'tr' | 'en'): string {
  if (!country || !country.trim()) {
    return lang === 'tr' ? 'Ülke Belirtilmemiş' : 'Country Not Specified';
  }
  if (lang === 'en') return country;

  // Split multi-country strings by comma, semicolon, slash, or ' and '
  const rawParts = country.split(/[,;\/]+|\s+and\s+|\s+ile\s+/i).map((s) => s.trim()).filter(Boolean);
  if (rawParts.length === 0) return country;

  const translated = rawParts.map((c) => {
    const rawLower = c.toLowerCase().trim();
    if (!rawLower || ['n.a.', 'n/a', 'unknown', 'none', 'n.a'].includes(rawLower)) {
      return 'Belirtilmemiş';
    }
    if (countryMapTr[rawLower]) return countryMapTr[rawLower];

    // Strip common leading diplomatic qualifiers
    const stripped = rawLower
      .replace(/^(the\s+|government\s+of\s+(the\s+)?|cabinet\s+of\s+ministers\s+of\s+|executive\s+council\s+of\s+(the\s+)?|republic\s+(of|fo)\s+(the\s+)?|republi\s+of\s+|people'?s\s+republic\s+of\s+(the\s+)?|kingdom\s+of\s+(the\s+)?|hashemite\s+kingdom\s+of\s+|federation\s+of\s+(the\s+)?|federative\s+republic\s+of\s+|federal\s+republic\s+of\s+|federal\s+military\s+government\s+of\s+|islamic\s+republic\s+of\s+|democratic\s+people'?s\s+republic\s+of\s+|democratic\s+republic\s+of\s+(the\s+)?|socialist\s+republic\s+of\s+|united\s+republic\s+of\s+|united\s+states\s+of\s+|state\s+of\s+)/i, '')
      .replace(/\s+(government|republic|kingdom|federation)$/i, '')
      .trim();

    if (countryMapTr[stripped]) return countryMapTr[stripped];

    // Check partial containment in countryMapTr keys
    for (const [k, v] of Object.entries(countryMapTr)) {
      if (k.length > 3 && (rawLower.includes(k) || stripped.includes(k))) {
        return v;
      }
    }

    return c;
  });

  // Deduplicate results
  const unique = Array.from(new Set(translated));
  return unique.join(', ');
}

// ══════════════════════════════════════════════════════════════
// 4. Water Conflict Translator (121 records)
// ══════════════════════════════════════════════════════════════

export function translateConflict(
  c: WaterConflict,
  lang: 'tr' | 'en'
): { title: string; description: string; basin: string; countries: string } {
  if (lang === 'en') {
    return {
      title: c.title,
      description: c.description,
      basin: c.basin,
      countries: c.countries,
    };
  }

  // Look up Turkish translation by id or title
  const tr = getConflictTranslation(c.id || c.title);
  return {
    title: tr ? tr.title : c.title,
    description: tr ? tr.description : c.description,
    basin: translateBasin(c.basin, 'tr'),
    countries: translateCountry(c.countries, 'tr'),
  };
}

// ══════════════════════════════════════════════════════════════
// 5. Treaty Title Systematic Diplomatic Translator
// ══════════════════════════════════════════════════════════════

const landmarkTreatiesTr: Record<string, string> = {

  'framework agreement on cooperation in the field of water between the republic of turkey and the republic of iraq': 'Türkiye Cumhuriyeti ile Irak Cumhuriyeti Arasında Su Alanında İş Birliği Çerçeve Anlaşması',
  'agreement on the nile river basin cooperative framework': 'Nil Nehri Havzası İşbirliği Çerçeve Anlaşması (CFA / Entebbe Anlaşması)',
  'united states and canada agreement-in-principle on the modernization of the columbia river treaty': 'ABD ve Kanada Kolombiya Nehri Antlaşması Modernizasyonu İlke Anlaşması',
  'treaty between the united states and canada relating to the modernization of the columbia river basin water regime': 'ABD ve Kanada Arasında Kolombiya Nehri Havzası Su Rejimi Modernizasyon Antlaşması',
  'ibwc minute no. 330': 'IBWC 330 Sayılı Karar: Kolorado Nehri Geçici Önlemlerinin Genişletilmesi',
  'ibwc minute no. 331': 'IBWC 331 Sayılı Karar: Rio Grande Su Teslimatının Güvenilirliği ve Öngörülebilirliği',
  'ibwc minute no. 332': 'IBWC 332 Sayılı Karar: Amistad Uluslararası Barajı Geçirimsizlik Duvarı İnşası',
  'trilateral ministerial agreement on joint development and operation of kambarata-1 hpp': 'Kambarata-1 HES Ortak İnşası ve İşletilmesine İlişkin Üçlü Bakanlar Anlaşması (Kırgızistan-Kazakistan-Özbekistan)',
  'joint interstate protocol on digital automation of transboundary water accounting stations': 'Sınır Aşan Su Ölçüm İstasyonlarının Dijital Otomasyonuna İlişkin Devletlerarası Ortak Protokol (Kazakistan-Özbekistan)',
  'interstate agreement on the delimitation of state border and shared water facilities on the isfara river': 'İsfara Nehri Üzerindeki Devlet Sınırının Belirlenmesi ve Ortak Su Tesislerine İlişkin Devletlerarası Anlaşma (Kırgızistan-Tacikistan)',
  'intergovernmental agreement on the establishment of the central asian water-energy consortium': 'Orta Asya Su-Enerji Konsorsiyumu Kurulmasına Dair Hükümetlerarası Anlaşma',
  'nile river basin commission (nrbc) inaugural ministerial convention and headquarters agreement': 'Nil Nehri Havzası Komisyonu (NRBC) Açılış Bakanlar Sözleşmesi ve Merkez Anlaşması',
  'treaty on transboundary water cooperation and ecological restoration of the northern aral sea': 'Kuzey Aral Denizi\'nin Ekolojik Restorasyonu ve Sınır Aşan Su İşbirliği Antlaşması (Kazakistan-Özbekistan)',
  'operational annexes to the turkey-iraq framework water agreement for severe drought periods': 'Türkiye-Irak Çerçeve Su Anlaşması Aşırı Kuraklık Dönemleri Operasyonel Ekleri',
  'icpdr ministerial declaration on climate-adaptive danube basin management and water scarcity': 'İklim Uyumlu Tuna Havzası Yönetimi ve Su Kıtlığına İlişkin ICPDR Bakanlar Deklarasyonu',
  'mekong river commission (mrc) joint operational protocol on mainstream cascading hydropower and flow regulations': 'Mekong Ana Kol Kademeli Hidroelektrik ve Akış Düzenlemelerine İlişkin MRC Ortak Operasyonel Protokolü',
  'multilateral treaty on the joint environmental management of the guarani aquifer system': 'Guarani Akifer Sistemi Ortak Çevresel Yönetimine İlişkin Çok Taraflı Antlaşma',

  'act of santiago': 'Santiago Senedi (Arjantin - Şili Sınır Suları)',
  'statute of the river uruguay': 'Uruguay Nehri Statüsü',
  'indus waters treaty': 'İndus Suları Antlaşması',
  'columbia river treaty': 'Kolombiya Nehri Antlaşması',
  'colorado river compact': 'Kolorado Nehri Sözleşmesi',
  'helsinki rules': 'Helsinki Kuralları',
  'berlin rules': 'Berlin Kuralları',
  'ramsar convention': 'Ramsar Sulak Alanlar Sözleşmesi',
};
// Common diplomatic phrases to translate
const diplomaticGlossary: Array<[RegExp, string]> = [
  [/boundary waters and boundary questions/gi, 'sınır suları ve sınır meseleleri'],
  [/boundary waters/gi, 'sınır suları'],
  [/border waters/gi, 'sınır suları'],
  [/boundary regime/gi, 'sınır rejimi'],
  [/delimitation of the boundary/gi, 'sınırın belirlenmesi'],
  [/delimitation of the frontier/gi, 'hududun belirlenmesi'],
  [/delimitation of the border/gi, 'sınır tespiti'],
  [/establishment of a joint water commission/gi, 'ortak su komisyonu kurulması'],
  [/establishment of the joint water commission/gi, 'ortak su komisyonunun kurulması'],
  [/establishment of a joint/gi, 'ortak kurulması'],
  [/establishment of the/gi, 'kurulması'],
  [/establishment of/gi, 'kurulması'],
  [/regulation of the flow of water/gi, 'su akışının düzenlenmesi'],
  [/regulation of the flow/gi, 'akışın düzenlenmesi'],
  [/water economy commission/gi, 'su ekonomisi komisyonu'],
  [/water economy/gi, 'su ekonomisi'],
  [/water resources/gi, 'su kaynakları'],
  [/use of waters of border rivers, creeks, and streams/gi, 'sınır nehirleri, çayları ve dereleri sularının kullanımı'],
  [/use of waters/gi, 'suların kullanımı'],
  [/utilization of waters/gi, 'suların kullanımı'],
  [/utilization of the waters/gi, 'suların kullanımı'],
  [/protection and sustainable use of the waters/gi, 'suların korunması ve sürdürülebilir kullanımı'],
  [/protection and sustainable use/gi, 'korunması ve sürdürülebilir kullanımı'],
  [/protection of the waters/gi, 'suların korunması'],
  [/protection of waters/gi, 'suların korunması'],
  [/protection of/gi, 'korunması'],
  [/construction and operation/gi, 'inşası ve işletilmesi'],
  [/water power and navigation system/gi, 'hidroelektrik enerji ve seyrüsefer sistemi'],
  [/water power and navigation/gi, 'hidroelektrik ve seyrüsefer'],
  [/water power/gi, 'hidroelektrik enerji'],
  [/hydropower/gi, 'hidroelektrik'],
  [/hydroelectric power/gi, 'hidroelektrik enerji'],
  [/pacific salmon/gi, 'Büyük Okyanus somonu'],
  [/cooperation in the field of environment/gi, 'çevre alanında işbirliği'],
  [/border sanitation problems/gi, 'sınır sağlığı ve sanitasyon meseleleri'],
  [/environmental protection/gi, 'çevre koruma'],
  [/flood control/gi, 'sel ve taşkın kontrolü'],
  [/flood management/gi, 'taşkın yönetimi'],
  [/irrigation/gi, 'tarımsal sulama'],
  [/navigation/gi, 'seyrüsefer ve ulaşım'],
  [/fisheries/gi, 'balıkçılık'],
  [/fishing/gi, 'balıkçılık'],
  [/water quality/gi, 'su kalitesi'],
  [/water quantity/gi, 'su miktarı'],
  [/river basin/gi, 'nehir havzası'],
  [/watercourses/gi, 'akarsular'],
  [/international lakes/gi, 'uluslararası göller'],
  [/riparian states/gi, 'kıyıdaş devletler'],
  [/peace, friendship, limits, and settlement/gi, 'barış, dostluk, sınırlar ve mutabakat'],
  [/peace and friendship/gi, 'barış ve dostluk'],
];

function cleanDiplomaticParty(raw: string): string {
  let s = raw.trim().replace(/^the\s+/i, '');
  const lower = s.toLowerCase();
  if (countryMapTr[lower]) return countryMapTr[lower];

  const govRep = lower.match(/^government of the republic of (.+)$/i);
  if (govRep) {
    const c = govRep[1].trim();
    return (countryMapTr[c] || c) + ' Cumhuriyeti Hükümeti';
  }
  const govPeople = lower.match(/^government of the people'?s republic of (.+)$/i);
  if (govPeople) {
    const c = govPeople[1].trim();
    return (countryMapTr[c] || c) + ' Halk Cumhuriyeti Hükümeti';
  }
  const gov = lower.match(/^government of (.+)$/i);
  if (gov) {
    const c = gov[1].trim();
    return (countryMapTr[c] || c) + ' Hükümeti';
  }
  const rep = lower.match(/^republic of (.+)$/i);
  if (rep) {
    const c = rep[1].trim();
    return (countryMapTr[c] || c) + ' Cumhuriyeti';
  }
  const fed = lower.match(/^federation of (.+)$/i);
  if (fed) {
    const c = fed[1].trim();
    return (countryMapTr[c] || c) + ' Federasyonu';
  }
  const kng = lower.match(/^kingdom of (.+)$/i);
  if (kng) {
    const c = kng[1].trim();
    return (countryMapTr[c] || c) + ' Krallığı';
  }

  return countryMapTr[lower] || s;
}

function translateTopicPhrases(text: string): string {
  let res = text;
  for (const [re, rep] of diplomaticGlossary) {
    res = res.replace(re, rep);
  }
  return res;
}

export function translateTreatyTitle(name: string | undefined, lang: 'tr' | 'en'): string {
  if (!name || !name.trim()) return '';
  if (lang === 'en') return name;

  const raw = name.trim();
  const lower = raw.toLowerCase();

  // 1. Direct landmark match
  for (const [k, v] of Object.entries(landmarkTreatiesTr)) {
    if (lower.startsWith(k)) {
      return raw.replace(new RegExp(`^${k}`, 'i'), v);
    }
  }

  // 2. Extract "concluded at [Place]" or "signed at [Place]"
  let placeSuffix = '';
  let cleaned = raw;
  const concMatch = cleaned.match(/[\s,\.]+concluded\s+at\s+([^,]+)(?:,\s*(.+))?$/i) ||
                    cleaned.match(/[\s,\.]+signed\s+at\s+([^,]+)(?:,\s*(.+))?$/i);
  if (concMatch) {
    const loc = concMatch[1].trim();
    const dt = concMatch[2] ? `, ${concMatch[2].trim()}` : '';
    placeSuffix = ` (${loc}${dt}'de imzalandı)`;
    cleaned = cleaned.slice(0, concMatch.index).trim();
  }

  // 3. Pattern: Treaty of limits between A and B
  const limitsMatch = cleaned.match(/^(?:Treaty|Convention)\s+of\s+limits\s+between\s+(.+?)\s+and\s+(.+)$/i);
  if (limitsMatch) {
    const p1 = cleanDiplomaticParty(limitsMatch[1]);
    const p2 = cleanDiplomaticParty(limitsMatch[2]);
    return `${p1} ile ${p2} Arasında Sınır Antlaşması${placeSuffix}`;
  }

  // 4. Pattern: Treaty of peace, friendship... between A and B
  const peaceMatch = cleaned.match(/^(?:Treaty)\s+of\s+peace(?:,\s*friendship(?:,\s*limits)?(?:,\s*and\s*settlement)?)?\s+between\s+(.+?)\s+and\s+(.+)$/i);
  if (peaceMatch) {
    const p1 = cleanDiplomaticParty(peaceMatch[1]);
    const p2 = cleanDiplomaticParty(peaceMatch[2]);
    return `${p1} ile ${p2} Arasında Barış, Dostluk ve Sınır Antlaşması${placeSuffix}`;
  }

  // 5. Pattern: Agreement/Treaty/Convention/Protocol between A and B (on/concerning/regarding/relating to Topic)?
  const docTypeMatch = cleaned.match(/^(Agreement|Treaty|Convention|Protocol|Exchange of notes|Exchange of letters|Memorandum of understanding)\s+between\s+(.+?)\s+and\s+(.+?)(?:\s+(?:concerning|regarding|relating to|on|with respect to|for the)\s+(.+))?$/i);
  if (docTypeMatch) {
    const docTypeEn = docTypeMatch[1].toLowerCase();
    const p1 = cleanDiplomaticParty(docTypeMatch[2]);
    const p2 = cleanDiplomaticParty(docTypeMatch[3]);
    const topicRaw = docTypeMatch[4];

    let docTypeTr = 'Anlaşması';
    if (docTypeEn === 'treaty') docTypeTr = 'Antlaşması';
    else if (docTypeEn === 'convention') docTypeTr = 'Sözleşmesi';
    else if (docTypeEn === 'protocol') docTypeTr = 'Protokolü';
    else if (docTypeEn.includes('exchange of note') || docTypeEn.includes('exchange of letter')) docTypeTr = 'Nota Teatisi';
    else if (docTypeEn.includes('memorandum')) docTypeTr = 'Mutabakat Zaptı (MoU)';

    if (topicRaw) {
      const topicTr = translateTopicPhrases(topicRaw.trim());
      return `${p1} ile ${p2} Arasında ${topicTr} Dair ${docTypeTr}${placeSuffix}`;
    }
    return `${p1} ile ${p2} Arasındaki Su ${docTypeTr}${placeSuffix}`;
  }

  // 6. Pattern: Agreement/Treaty/Convention on/concerning Topic (between Parties)?
  const onTopicMatch = cleaned.match(/^(Agreement|Treaty|Convention|Protocol)\s+(?:on|concerning|regarding|relating to|for the)\s+(.+)$/i);
  if (onTopicMatch) {
    const docTypeEn = onTopicMatch[1].toLowerCase();
    const topicRaw = onTopicMatch[2].trim();

    let docTypeTr = 'Anlaşması';
    if (docTypeEn === 'treaty') docTypeTr = 'Antlaşması';
    else if (docTypeEn === 'convention') docTypeTr = 'Sözleşmesi';
    else if (docTypeEn === 'protocol') docTypeTr = 'Protokolü';

    const topicTr = translateTopicPhrases(topicRaw);
    return `${topicTr} Konusunda ${docTypeTr}${placeSuffix}`;
  }

  // 7. General phrase substitution fallback
  let translated = translateTopicPhrases(cleaned);
  translated = translated
    .replace(/^Agreement\s+/i, 'Anlaşma: ')
    .replace(/^Treaty\s+/i, 'Antlaşma: ')
    .replace(/^Convention\s+/i, 'Sözleşme: ')
    .replace(/^Protocol\s+/i, 'Protokol: ')
    .replace(/^Statute of the\s+/i, '')
    .replace(/^Statute of\s+/i, '');

  if (cleaned.toLowerCase().startsWith('statute of')) {
    translated = `${translated} Statüsü`;
  }

  return `${translated}${placeSuffix}`;
}

// ══════════════════════════════════════════════════════════════
// 6. Unified Helper for Any Item (Agreement or WaterConflict)
// ══════════════════════════════════════════════════════════════

export function isWaterConflictItem(item: Agreement | WaterConflict): item is WaterConflict {
  return 'intensity' in item || 'type' in item && (item.type === 'conflict' || item.type === 'cooperation' || item.type === 'mixed');
}

export function getItemDisplayName(item: Agreement | WaterConflict, lang: 'tr' | 'en'): string {
  if (isWaterConflictItem(item)) {
    return translateConflict(item, lang).title;
  }
  return translateTreatyTitle(item.name, lang);
}
