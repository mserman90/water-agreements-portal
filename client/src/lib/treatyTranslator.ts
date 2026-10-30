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
  'territorial and border issues': 'Toprak ve Sınır Meseleleri',
  'territorial': 'Toprak ve Sınır',
  'border issues': 'Sınır Meseleleri',
  'border': 'Sınır Düzenlemeleri',
  'navigation': 'Seyrüsefer ve Ulaşım',
  'fishing': 'Balıkçılık ve Su Ürünleri',
  'fisheries': 'Balıkçılık ve Su Ürünleri',
  'infrastructure': 'Altyapı ve Tesisler',
  'infrastructure/development': 'Altyapı ve Kalkınma',
  'funding and financing': 'Finansman ve Fonlama',
  'funding': 'Finansman ve Fonlama',
  'financial': 'Mali İşbirliği',
  'water quantity': 'Su Miktarı ve Tahsisi',
  'water quantity/allocation': 'Su Miktarı ve Tahsisi',
  'water quality': 'Su Kalitesi ve Arıtma',
  'pollution': 'Kirlilik Kontrolü',
  'agriculture': 'Tarım ve Sulama',
  'irrigation': 'Tarımsal Sulama',
  'environment': 'Çevre ve Ekoloji',
  'environmental': 'Çevre ve Doğa Koruma',
  'environmental protection': 'Çevre Koruma',
  'ecology': 'Ekoloji ve Biyoçeşitlilik',
  'socioeconomic development': 'Sosyoekonomik Kalkınma',
  'economic development': 'Ekonomik Kalkınma',
  'domestic/municipal water': 'İçme ve Kullanma Suyu',
  'domestic/municipal use': 'İçme ve Kullanma Suyu',
  'domestic water': 'İçme Suyu',
  'hydropower': 'Hidroelektrik Enerji',
  'hydroelectric': 'Hidroelektrik Enerji',
  'flood management': 'Taşkın ve Sel Yönetimi',
  'flood control': 'Sel ve Taşkın Kontrolü',
  'flood': 'Taşkın Yönetimi',
  'drought management': 'Kuraklık Yönetimi',
  'drought': 'Kuraklık Yönetimi',
  'forestry and timber': 'Ormancılık ve Kereste',
  'timber': 'Kereste ve Ormancılık',
  'climate change': 'İklim Değişikliği',
  'climate': 'İklim Eylemi',
  'joint management': 'Ortak Yönetim',
  'joint commission': 'Ortak Komisyon',
  'monitoring': 'İzleme ve Veri Paylaşımı',
  'data exchange': 'Veri ve Bilgi Paylaşımı',
  'dispute resolution': 'Uyuşmazlık Çözümü',
  'conflict resolution': 'Uyuşmazlık Çözümü',
  'groundwater': 'Yeraltı Suları',
  'aquifer': 'Akifer Yönetimi',
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
  // Turkish / Regional
  'tigris-euphrates': 'Fırat-Dicle',
  'tigris-euphrates/shatt al arab': 'Fırat-Dicle / Şattülarap',
  'asi/orontes': 'Asi Nehri',
  'orontes': 'Asi Nehri',
  'asi': 'Asi Nehri',
  'coruh': 'Çoruh',
  'kura-araks': 'Kura-Aras',
  'maritsa': 'Meriç',
  'meric': 'Meriç',

  // Major Global Basins
  'danube': 'Tuna',
  'rhine': 'Ren',
  'nile': 'Nil',
  'indus': 'İndus',
  'ganges': 'Ganj',
  'ganges-brahmaputra': 'Ganj-Brahmaputra',
  'ganges-brahmaputra-meghna': 'Ganj-Brahmaputra-Meghna',
  'brahmaputra': 'Brahmaputra',
  'mekong': 'Mekong',
  'amazon': 'Amazon',
  'congo': 'Kongo',
  'niger': 'Nijer',
  'zambezi': 'Zambezi',
  'colorado': 'Kolorado',
  'columbia': 'Kolombiya',
  'jordan': 'Şeria (Ürdün)',
  'la plata': 'La Plata',
  'volta': 'Volta',
  'senegal': 'Senegal',
  'orange': 'Oranj',
  'okavango': 'Okavango',
  'limpopo': 'Limpopo',
  'incomati': 'İnkomati',
  'maputo': 'Maputo',
  'lake chad': 'Çad Gölü',
  'chad': 'Çad Gölü',
  'aral': 'Aral Denizi',
  'aral sea': 'Aral Denizi',
  'helmand': 'Hilmend',
  'salween': 'Salven',
  'irrawaddy': 'İravadi',
  'mississippi': 'Misisipi',
  'rhone': 'Ron',
  'elbe': 'Elbe',
  'oder': 'Oder',
  'vistula': 'Vistül',
  'dnieper': 'Dinyeper',
  'dniester': 'Dinyester',
  'don': 'Don',
  'volga': 'Volga',
  'ob': 'Ob',
  'yenisey': 'Yenisey',
  'amur': 'Amur',
  'lake titicaca': 'Titikaka Gölü',
  'titicaca': 'Titikaka Gölü',
  'lake turkana': 'Turkana Gölü',
  'lake prespa': 'Prespa Gölü',
  'lake victoria': 'Viktorya Gölü',
  'lake geneva': 'Cenevre Gölü',
  'lake constance': 'Konstanz Gölü',
  'rio grande': 'Rio Grande',
  'st. lawrence': 'St. Lawrence',
  'douro': 'Douro (Duero)',
  'tagus': 'Tejo (Tagus)',
  'guadiana': 'Guadiana',
  'ebro': 'Ebro',
  'po': 'Po',
  'vardar': 'Vardar',
  'drin': 'Drin',
  'struma': 'Usturma (Struma)',
  'nestos': 'Mesta (Nestos)',
  'scheldt': 'Scheldt (Escaut)',
  'meuse': 'Meuse (Maas)',
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
  'ussr': 'SSCB',
  'soviet union': 'Sovyetler Birliği',
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

  // Split multi-country strings by comma, semicolon, or slash
  const parts = country.split(/[,;\/]+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return country;

  const translated = parts.map((c) => {
    const key = c.toLowerCase().trim();
    if (countryMapTr[key]) return countryMapTr[key];
    return c;
  });

  return translated.join(', ');
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
