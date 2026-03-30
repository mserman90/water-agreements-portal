/**
 * Client-side NLP-powered smart search engine for treaty agreements.
 * No API keys needed — runs entirely in the browser.
 *
 * Enhanced Turkish language support with:
 *   - Turkish suffix stripping (stemming)
 *   - 200+ country TR/EN aliases
 *   - 50+ basin TR/EN aliases
 *   - Comprehensive topic/issue TR/EN mapping
 *   - Region + subregion TR/EN mapping
 *   - Natural Turkish query patterns
 *   - Typo-tolerant matching (ı/i, ö/o, ü/u, ş/s, ç/c, ğ/g)
 *
 * Supports queries like:
 *   - "Nil havzasındaki 1960 sonrası anlaşmalar"
 *   - "Türkiye'nin su anlaşmaları"
 *   - "Fırat ve Dicle havzasındaki hidroelektrik"
 *   - "Afrika'da 2000 sonrası çevre anlaşmaları"
 *   - "belgesi olan Orta Doğu anlaşmaları"
 *   - "Kafkasya bölgesindeki sınır uyuşmazlıkları"
 *   - "agreements about navigation in Europe after 1950"
 */

interface Agreement {
  id: string;
  name: string;
  country: string;
  basin: string;
  latitude: number;
  longitude: number;
  purpose: string;
  year: number;
  pdfUrl?: string;
}

interface ParsedQuery {
  keywords: string[];
  yearAfter?: number;
  yearBefore?: number;
  yearExact?: number;
  regions: string[];
  topics: string[];
  countries: string[];
  basins: string[];
  hasDocument?: boolean;
  sortByNewest?: boolean;
  sortByOldest?: boolean;
}

// ══════════════════════════════════════════════════════════
// ── Turkish Suffix Stripping (lightweight stemmer) ──
// ══════════════════════════════════════════════════════════

const trSuffixes = [
  // Possessive + case combinations (longest first)
  /(?:ları|leri)(?:n(?:ın|in|un|ün))?(?:da|de|ta|te)?(?:ki|n)?$/,
  // Case suffixes with buffer consonants
  /(?:s?[ıiuü]n[ıiuü]n|s?[ıiuü]na|s?[ıiuü]nda|s?[ıiuü]ndan)$/,
  // -daki/-deki/-taki/-teki (locative + ki)
  /(?:daki|deki|taki|teki|ndaki|ndeki)$/,
  // -dığı/-diği etc (relative participle)
  /(?:d[ıiuü][ğg][ıiuü])$/,
  // Ablative
  /(?:'?dan|'?den|'?tan|'?ten|ndan|nden)$/,
  // Locative
  /(?:'?da|'?de|'?ta|'?te|nda|nde)$/,
  // Dative
  /(?:'?[yn]?[aeiıoöuü]|'?[yn]a|'?[yn]e)$/,
  // Genitive
  /(?:'?n[ıiuü]n|'?[ıiuü]n)$/,
  // Accusative
  /(?:'?[yn]?[ıiuü])$/,
  // Plural
  /(?:lar|ler)$/,
  // Possessive
  /(?:s[ıiuü]|[ıiuü]m[ıiuü]z|lar[ıiuü]|leri)$/,
];

function turkishStem(word: string): string {
  if (word.length < 4) return word;
  let stem = word;
  // Remove apostrophe-attached suffixes first (Türkiye'nin → Türkiye)
  stem = stem.replace(/[''][a-zğüşçöı]+$/i, '');
  // Strip suffixes (one pass, longest match)
  for (const re of trSuffixes) {
    const stripped = stem.replace(re, '');
    if (stripped.length >= 3 && stripped !== stem) {
      stem = stripped;
      break;
    }
  }
  return stem;
}

// ══════════════════════════════════════════════════════════
// ── Typo-tolerant normalization (Turkish chars → ASCII) ──
// ══════════════════════════════════════════════════════════

const trCharMap: Record<string, string> = {
  'ı': 'i', 'İ': 'i', 'ğ': 'g', 'Ğ': 'g',
  'ü': 'u', 'Ü': 'u', 'ş': 's', 'Ş': 's',
  'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c',
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/[ıİğĞüÜşŞöÖçÇ]/g, ch => trCharMap[ch] || ch);
}

// ══════════════════════════════════════════════════════════
// ── Region synonyms (expanded with subregions) ──
// ══════════════════════════════════════════════════════════

const regionMap: Record<string, string[]> = {
  'europe': ['europe', 'avrupa', 'european', 'avrupa kıtası'],
  'western europe': ['western europe', 'batı avrupa', 'bati avrupa', 'west europe'],
  'eastern europe': ['eastern europe', 'doğu avrupa', 'dogu avrupa'],
  'northern europe': ['northern europe', 'kuzey avrupa', 'scandinavian', 'iskandinav', 'nordic', 'nordik'],
  'southeastern europe': ['southeastern europe', 'güneydoğu avrupa', 'guneydogu avrupa', 'balkans', 'balkan', 'balkanlar'],
  'central europe': ['central europe', 'orta avrupa', 'merkezi avrupa'],
  'africa': ['africa', 'afrika', 'african'],
  'north africa': ['north africa', 'kuzey afrika'],
  'east africa': ['east africa', 'eastern africa', 'doğu afrika', 'dogu afrika'],
  'west africa': ['west africa', 'western africa', 'batı afrika', 'bati afrika'],
  'southern africa': ['southern africa', 'güney afrika', 'guney afrika', 'güneyli afrika'],
  'sub-saharan africa': ['sub-saharan', 'sahra altı', 'sahra alti'],
  'asia': ['asia', 'asya', 'asian'],
  'central asia': ['central asia', 'orta asya', 'merkezi asya'],
  'south asia': ['south asia', 'southern asia', 'güney asya', 'guney asya'],
  'southeast asia': ['southeast asia', 'güneydoğu asya', 'guneydogu asya'],
  'east asia': ['east asia', 'eastern asia', 'doğu asya', 'dogu asya', 'uzak doğu', 'uzak dogu'],
  'north america': ['north america', 'kuzey amerika', 'northern america'],
  'south america': ['south america', 'güney amerika', 'guney amerika', 'latin america', 'latin amerika'],
  'central america': ['central america', 'orta amerika'],
  'caribbean': ['caribbean', 'karayip', 'karayipler'],
  'middle east': ['middle east', 'orta doğu', 'ortadoğu', 'orta dogu', 'ortadogu', 'western asia', 'batı asya'],
  'caucasus': ['caucasus', 'kafkasya', 'kafkas', 'south caucasus', 'güney kafkasya'],
  'mediterranean': ['mediterranean', 'akdeniz', 'akdeniz bölgesi'],
  'pacific northwest': ['pacific northwest', 'pasifik kuzeybatı'],
  'former soviet union': ['former soviet', 'eski sovyet', 'sovyet sonrası', 'sovyet', 'soviet'],
  'eu': ['european union', 'avrupa birliği', 'avrupa birligi', 'ab'],
};

// ══════════════════════════════════════════════════════════
// ── Topic / Issue synonyms (comprehensive TR + EN) ──
// ══════════════════════════════════════════════════════════

const topicMap: Record<string, string[]> = {
  'navigation': ['navigation', 'seyrüsefer', 'navigasyon', 'gemi', 'gemicilik', 'denizcilik', 'navgiation'],
  'fishing': ['fishing', 'fisheries', 'fish', 'balık', 'balıkçılık', 'balıkçı', 'balık avı', 'balık avcılığı'],
  'hydropower': ['hydropower', 'hidro', 'hidroelektrik', 'energy', 'enerji', 'baraj', 'dam', 'elektrik üretimi', 'hes'],
  'irrigation': ['irrigation', 'sulama', 'tarım', 'agriculture', 'ziraat', 'tarımsal', 'çiftçilik'],
  'border': ['border', 'sınır', 'territorial', 'toprak', 'hudut', 'border issues', 'sınır sorunu', 'sınır uyuşmazlığı', 'sınır anlaşmazlığı', 'toprak bütünlüğü'],
  'water quality': ['water quality', 'su kalitesi', 'pollution', 'kirlilik', 'kirlenme', 'su kirliliği', 'arıtma', 'kalite'],
  'water quantity': ['water quantity', 'su miktarı', 'allocation', 'paylaşım', 'tahsis', 'su tahsisi', 'su paylaşımı', 'miktar', 'su dağıtımı'],
  'flood': ['flood', 'sel', 'taşkın', 'flood control', 'flood management', 'sel kontrolü', 'taşkın yönetimi', 'sel yönetimi'],
  'groundwater': ['groundwater', 'yeraltı', 'aquifer', 'akifer', 'yeraltı suyu', 'yeraltı suları', 'kuyu'],
  'environment': ['environment', 'çevre', 'environmental', 'ekoloji', 'ecology', 'wetland', 'sulak alan', 'çevresel', 'doğa koruma', 'ekosistem', 'biyoçeşitlilik'],
  'monitoring': ['monitoring', 'izleme', 'gözlem', 'ölçüm', 'takip', 'kontrol'],
  'cooperation': ['cooperation', 'işbirliği', 'commission', 'komisyon', 'ortak', 'ortaklık'],
  'infrastructure': ['infrastructure', 'altyapı', 'tesis', 'yapı', 'inşaat', 'construction'],
  'drought': ['drought', 'kuraklık', 'kurak', 'drought management', 'kuraklık yönetimi'],
  'climate change': ['climate change', 'iklim değişikliği', 'iklim', 'climate'],
  'domestic water': ['domestic water', 'municipal water', 'içme suyu', 'şebeke', 'kentsel su', 'evsel su'],
  'funding': ['funding', 'financing', 'finansman', 'fonlama', 'yatırım', 'bütçe'],
  'socioeconomic': ['socioeconomic', 'sosyoekonomik', 'kalkınma', 'development', 'ekonomik kalkınma'],
  'forestry': ['forestry', 'timber', 'ormancılık', 'orman', 'ağaç'],
};

// ══════════════════════════════════════════════════════════
// ── Country name synonyms (200+ countries, TR + EN) ──
// ══════════════════════════════════════════════════════════

const countryAliases: Record<string, string[]> = {
  // Middle East & neighbors
  'turkey': ['turkey', 'türkiye', 'turkiye', 'turkish', 'türk', 'turk', 'turkei'],
  'syria': ['syria', 'suriye', 'syrian', 'suriyeli'],
  'iraq': ['iraq', 'irak', 'iraqi', 'iraklı'],
  'iran': ['iran', 'iranian', 'persia', 'pers', 'persya'],
  'egypt': ['egypt', 'mısır', 'misir', 'egyptian', 'mısırlı'],
  'sudan': ['sudan', 'sudanese', 'sudanlı'],
  'south sudan': ['south sudan', 'güney sudan', 'guney sudan'],
  'ethiopia': ['ethiopia', 'etiyopya', 'ethiopian'],
  'israel': ['israel', 'israil', 'israeli'],
  'jordan': ['jordan', 'ürdün', 'urdun', 'jordanian'],
  'lebanon': ['lebanon', 'lübnan', 'lubnan', 'lebanese'],
  'saudi arabia': ['saudi arabia', 'suudi arabistan', 'saudi', 'suudi'],
  'yemen': ['yemen', 'yemenli'],
  'oman': ['oman', 'umman'],
  'qatar': ['qatar', 'katar'],
  'kuwait': ['kuwait', 'kuveyt'],
  'bahrain': ['bahrain', 'bahreyn'],
  'uae': ['united arab emirates', 'uae', 'bae', 'birleşik arap emirlikleri'],
  'palestine': ['palestine', 'filistin', 'palestinian'],
  'cyprus': ['cyprus', 'kıbrıs', 'kibris', 'cypriot'],

  // South Asia
  'india': ['india', 'hindistan', 'indian', 'hintli', 'bharatiya'],
  'pakistan': ['pakistan', 'pakistanlı'],
  'bangladesh': ['bangladesh', 'bangladeş', 'banglades'],
  'nepal': ['nepal', 'nepalli'],
  'sri lanka': ['sri lanka', 'srilanka'],
  'bhutan': ['bhutan', 'butan'],
  'afghanistan': ['afghanistan', 'afganistan'],

  // East & Southeast Asia
  'china': ['china', 'çin', 'cin', 'chinese', 'prc'],
  'japan': ['japan', 'japonya', 'japanese', 'japon'],
  'south korea': ['south korea', 'güney kore', 'guney kore', 'korea'],
  'north korea': ['north korea', 'kuzey kore'],
  'mongolia': ['mongolia', 'moğolistan', 'mogolistan'],
  'cambodia': ['cambodia', 'kamboçya', 'kambocya'],
  'vietnam': ['vietnam'],
  'thailand': ['thailand', 'tayland'],
  'laos': ['laos'],
  'myanmar': ['myanmar', 'burma', 'birmanya'],
  'indonesia': ['indonesia', 'endonezya'],
  'malaysia': ['malaysia', 'malezya'],
  'philippines': ['philippines', 'filipinler', 'filipin'],
  'singapore': ['singapore', 'singapur'],

  // Central Asia
  'kazakhstan': ['kazakhstan', 'kazakistan'],
  'uzbekistan': ['uzbekistan', 'özbekistan', 'ozbekistan'],
  'turkmenistan': ['turkmenistan', 'türkmenistan'],
  'kyrgyzstan': ['kyrgyzstan', 'kırgızistan', 'kirgizistan'],
  'tajikistan': ['tajikistan', 'tacikistan'],

  // Caucasus
  'georgia': ['georgia', 'gürcistan', 'gurcistan'],
  'armenia': ['armenia', 'ermenistan'],
  'azerbaijan': ['azerbaijan', 'azerbaycan', 'azerbeycan'],

  // Europe - Western
  'germany': ['germany', 'almanya', 'german', 'alman'],
  'france': ['france', 'fransa', 'french', 'fransız'],
  'netherlands': ['netherlands', 'hollanda', 'dutch', 'felemenk'],
  'belgium': ['belgium', 'belçika', 'belcika'],
  'luxembourg': ['luxembourg', 'lüksemburg', 'luksemburg'],
  'switzerland': ['switzerland', 'isviçre', 'isvicre', 'swiss'],
  'austria': ['austria', 'avusturya', 'austrian'],
  'uk': ['united kingdom', 'uk', 'britain', 'british', 'ingiltere', 'birleşik krallık', 'büyük britanya'],
  'ireland': ['ireland', 'irlanda'],
  'usa': ['usa', 'abd', 'united states', 'america', 'american', 'amerikan', 'amerika birleşik devletleri'],
  'spain': ['spain', 'ispanya', 'spanish', 'ispanyol'],
  'portugal': ['portugal', 'portekiz'],
  'italy': ['italy', 'italya', 'italian', 'italyan'],
  'greece': ['greece', 'yunanistan', 'greek', 'yunan'],

  // Europe - Eastern
  'russia': ['russia', 'rusya', 'russian', 'soviet', 'ussr', 'sovyet', 'sscb'],
  'ukraine': ['ukraine', 'ukrayna'],
  'belarus': ['belarus', 'beyaz rusya', 'belarusya'],
  'poland': ['poland', 'polonya', 'polish'],
  'czech': ['czech', 'çek', 'cek', 'çek cumhuriyeti', 'czechia'],
  'slovakia': ['slovakia', 'slovakya'],
  'hungary': ['hungary', 'macaristan', 'hungarian', 'macar'],
  'romania': ['romania', 'romanya'],
  'bulgaria': ['bulgaria', 'bulgaristan', 'bulgarian'],
  'serbia': ['serbia', 'sırbistan', 'sirbistan'],
  'croatia': ['croatia', 'hırvatistan', 'hirvatistan'],
  'bosnia': ['bosnia', 'bosna', 'bosna hersek', 'bosnia and herzegovina'],
  'montenegro': ['montenegro', 'karadağ', 'karadag'],
  'north macedonia': ['north macedonia', 'macedonia', 'makedonya', 'kuzey makedonya'],
  'albania': ['albania', 'arnavutluk'],
  'slovenia': ['slovenia', 'slovenya'],
  'kosovo': ['kosovo', 'kosova'],
  'moldova': ['moldova'],
  'lithuania': ['lithuania', 'litvanya'],
  'latvia': ['latvia', 'letonya'],
  'estonia': ['estonia', 'estonya'],
  'finland': ['finland', 'finlandiya', 'finnish', 'fin'],
  'sweden': ['sweden', 'isveç', 'isvec', 'swedish'],
  'norway': ['norway', 'norveç', 'norvec', 'norwegian'],
  'denmark': ['denmark', 'danimarka', 'danish'],
  'iceland': ['iceland', 'izlanda'],

  // Africa
  'south africa': ['south africa', 'güney afrika', 'guney afrika'],
  'nigeria': ['nigeria', 'nijerya'],
  'kenya': ['kenya'],
  'tanzania': ['tanzania', 'tanzanya'],
  'ghana': ['ghana', 'gana'],
  'uganda': ['uganda'],
  'rwanda': ['rwanda', 'ruanda'],
  'mozambique': ['mozambique', 'mozambik'],
  'zimbabwe': ['zimbabwe', 'zimbabve'],
  'botswana': ['botswana'],
  'namibia': ['namibia', 'namibya'],
  'zambia': ['zambia', 'zambiya'],
  'malawi': ['malawi', 'malavi'],
  'angola': ['angola'],
  'congo': ['congo', 'kongo', 'democratic republic of the congo', 'drc', 'kongo demokratik cumhuriyeti'],
  'cameroon': ['cameroon', 'kamerun'],
  'senegal': ['senegal'],
  'mali': ['mali'],
  'niger': ['niger', 'nijer'],
  'chad': ['chad', 'çad', 'cad'],
  'ivory coast': ['ivory coast', 'côte d\'ivoire', 'fildişi sahili', 'fildisi sahili'],
  'guinea': ['guinea', 'gine'],
  'burkina faso': ['burkina faso', 'burkina'],
  'benin': ['benin'],
  'togo': ['togo'],
  'madagascar': ['madagascar', 'madagaskar'],
  'djibouti': ['djibouti', 'cibuti'],
  'eritrea': ['eritrea', 'eritre'],
  'somalia': ['somalia', 'somali'],
  'libya': ['libya'],
  'tunisia': ['tunisia', 'tunus'],
  'algeria': ['algeria', 'cezayir'],
  'morocco': ['morocco', 'fas'],
  'mauritania': ['mauritania', 'moritanya'],
  'sierra leone': ['sierra leone', 'sierra leone'],
  'liberia': ['liberia', 'liberya'],
  'gambia': ['gambia', 'gambiya'],
  'guinea-bissau': ['guinea-bissau', 'gine-bissau'],
  'swaziland': ['swaziland', 'eswatini', 'esvatini'],
  'lesotho': ['lesotho'],

  // Americas
  'mexico': ['mexico', 'meksika', 'mexican'],
  'canada': ['canada', 'kanada', 'canadian'],
  'brazil': ['brazil', 'brezilya', 'brazilian'],
  'argentina': ['argentina', 'arjantin'],
  'chile': ['chile', 'şili', 'sili'],
  'colombia': ['colombia', 'kolombiya'],
  'peru': ['peru'],
  'venezuela': ['venezuela'],
  'ecuador': ['ecuador', 'ekvador'],
  'bolivia': ['bolivia', 'bolivya'],
  'paraguay': ['paraguay'],
  'uruguay': ['uruguay'],
  'guatemala': ['guatemala'],
  'honduras': ['honduras'],
  'el salvador': ['el salvador'],
  'nicaragua': ['nicaragua', 'nikaragua'],
  'costa rica': ['costa rica', 'kosta rika'],
  'panama': ['panama'],
  'cuba': ['cuba', 'küba', 'kuba'],
  'haiti': ['haiti'],
  'dominican republic': ['dominican republic', 'dominik cumhuriyeti'],
  'belize': ['belize'],
  'guyana': ['guyana'],
  'suriname': ['suriname', 'surinam'],

  // Oceania
  'australia': ['australia', 'avustralya'],
  'new zealand': ['new zealand', 'yeni zelanda'],
  'papua new guinea': ['papua new guinea', 'papua yeni gine'],
};

// ══════════════════════════════════════════════════════════
// ── Basin name aliases (comprehensive TR + EN) ──
// ══════════════════════════════════════════════════════════

const basinAliases: Record<string, string[]> = {
  // Turkish rivers/basins
  'tigris-euphrates': ['tigris', 'euphrates', 'fırat', 'firat', 'dicle', 'shatt', 'shatt al arab',
    'fırat-dicle', 'fırat dicle', 'firat dicle', 'fırat nehri', 'dicle nehri',
    'tigris-euphrates/shatt al arab'],
  'asi/orontes': ['asi', 'orontes', 'asi nehri', 'an nahr al kabir', 'nahr al kabir', 'nahr el kebir'],
  'coruh': ['coruh', 'çoruh', 'coruh nehri', 'çoruh nehri'],
  'kura-araks': ['kura', 'araks', 'aras', 'kura-araks', 'aras nehri', 'kura nehri'],

  // Major world basins
  'nile': ['nile', 'nil', 'nil nehri'],
  'danube': ['danube', 'tuna', 'tuna nehri'],
  'rhine': ['rhine', 'ren', 'ren nehri', 'rhein', 'rhine-meuse'],
  'mekong': ['mekong', 'mekong nehri'],
  'indus': ['indus', 'indüs', 'indus nehri'],
  'ganges': ['ganges', 'ganj', 'brahmaputra', 'ganges-brahmaputra', 'ganj nehri', 'meghna'],
  'amazon': ['amazon', 'amazonas', 'amazon nehri'],
  'congo': ['congo', 'kongo', 'zaire', 'kongo nehri'],
  'niger': ['niger', 'nijer', 'niger nehri', 'nijer nehri'],
  'zambezi': ['zambezi', 'zambesi', 'zambezi nehri'],
  'colorado': ['colorado', 'colorado nehri'],
  'columbia': ['columbia', 'kolombiya nehri'],
  'jordan': ['jordan nehri', 'ürdün nehri', 'urdun nehri'],
  'la plata': ['la plata', 'plata', 'rio de la plata'],
  'volta': ['volta', 'volta nehri'],
  'senegal': ['senegal nehri', 'senegal river'],
  'orange': ['orange nehri', 'orange river', 'oranj'],
  'okavango': ['okavango'],
  'lake chad': ['lake chad', 'çad gölü', 'chad gölü', 'chad'],
  'aral': ['aral', 'aral gölü', 'aral sea', 'aral denizi'],
  'helmand': ['helmand'],
  'salween': ['salween'],
  'irrawaddy': ['irrawaddy', 'irrawady'],
  'mississippi': ['mississippi', 'mississipi', 'misisipi'],
  'rhone': ['rhone', 'rhône', 'ron nehri'],
  'elbe': ['elbe'],
  'oder': ['oder', 'odra'],
  'vistula': ['vistula', 'wistula', 'wisła', 'visla'],
  'dnieper': ['dnieper', 'dinyeper', 'özi', 'ozi'],
  'dniester': ['dniester', 'dinyester'],
  'don': ['don', 'don nehri'],
  'volga': ['volga', 'volga nehri'],
  'ob': ['ob', 'ob nehri'],
  'yenisey': ['yenisey', 'yenisei', 'jenisej'],
  'amur': ['amur', 'amur nehri'],
  'limpopo': ['limpopo'],
  'incomati': ['incomati'],
  'maputo': ['maputo'],
  'lake titicaca': ['lake titicaca', 'titicaca', 'titicaca gölü'],
  'lake turkana': ['lake turkana', 'turkana', 'turkana gölü'],
  'lake prespa': ['lake prespa', 'prespa', 'prespa gölü'],
  'rio grande': ['rio grande'],
  'st. lawrence': ['st. lawrence', 'st lawrence', 'aziz laurent', 'saint lawrence'],
  'douro': ['douro', 'duero'],
  'tagus': ['tagus', 'tajo', 'tejo'],
  'ebro': ['ebro'],
  'garonne': ['garonne'],
  'po': ['po', 'po nehri'],
  'maritsa': ['maritsa', 'meriç', 'meric', 'evros'],
  'vardar': ['vardar'],
  'drin': ['drin'],
  'struma': ['struma', 'strymon'],
  'nestos': ['nestos', 'mesta'],
  'nelson': ['nelson', 'saskatchewan', 'nelson-saskatchewan'],
  'yukon': ['yukon'],
  'fraser': ['fraser'],
  'fly': ['fly'],
  'sepik': ['sepik'],
  'murgab': ['murgab', 'murgap'],
  'hari': ['hari', 'harirud', 'hari/harirud'],
  'tarim': ['tarim', 'tarım'],
  'ili': ['ili', 'yili', 'ili/yili', 'kunes'],
  'talas': ['talas'],
  'shu': ['shu', 'chu'],
  'tumen': ['tumen', 'tuman'],
  'yalu': ['yalu'],
  'gambia': ['gambia nehri', 'gambia river'],
  'juba': ['juba', 'shibeli', 'juba-shibeli'],
  'tana': ['tana'],
  'pangani': ['pangani'],
  'ruvuma': ['ruvuma', 'rovuma'],
  'sabi': ['sabi', 'save'],
  'buzi': ['buzi'],
  'pungwe': ['pungwe'],
  'kunene': ['kunene', 'kuene', 'cunene'],
  'cuvelai': ['cuvelai', 'etosha'],
  'grijalva': ['grijalva'],
  'lempa': ['lempa'],
  'san juan': ['san juan'],
  'sixaola': ['sixaola'],
  'artibonite': ['artibonite'],
  'massacre': ['massacre'],
  'pedernales': ['pedernales'],
  'maroni': ['maroni'],
  'chira': ['chira'],
  'tumbes': ['tumbes'],
  'zarumilla': ['zarumilla'],
};

// ══════════════════════════════════════════════════════════
// ── Year extraction patterns (expanded) ──
// ══════════════════════════════════════════════════════════

const yearPatterns = [
  // "1960 sonrası" / "after 1960" / "post-1960" / "1960'dan sonra" / "1960 yılından sonra"
  { regex: /(?:sonrası|sonra|after|post[- ]?|since|from)\s*(\d{4})/i, type: 'after' as const },
  { regex: /(\d{4})\s*(?:sonrası|sonra|'dan sonra|'den sonra|yılından sonra|yilından sonra|'dan beri|'den beri)/i, type: 'after' as const },
  // "1960 öncesi" / "before 1960" / "pre-1960" / "1960'dan önce"
  { regex: /(?:öncesi|önce|before|pre[- ]?|until)\s*(\d{4})/i, type: 'before' as const },
  { regex: /(\d{4})\s*(?:öncesi|önce|'dan önce|'den önce|yılından önce|yilından önce)/i, type: 'before' as const },
  // "1960-2000 arası" / "between 1960 and 2000" / "1960 ile 2000"
  { regex: /(\d{4})\s*[-–—]\s*(\d{4})/i, type: 'range' as const },
  { regex: /(?:between|arası|arasında|arasındaki)\s*(\d{4})\s*(?:and|ile|ve|-)\s*(\d{4})/i, type: 'range' as const },
  { regex: /(\d{4})\s*(?:ile|ve|and)\s*(\d{4})\s*(?:arası|arasında|arasındaki|between)/i, type: 'range' as const },
  // "XX. yüzyıl" / "XXth century"
  { regex: /(\d{1,2})\.\s*(?:yüzyıl|yuzyil|yy)/i, type: 'century_tr' as const },
  { regex: /(\d{1,2})(?:st|nd|rd|th)\s*century/i, type: 'century_en' as const },
  // Exact year: just "1960" standing alone
  { regex: /\b(\d{4})\b/, type: 'exact' as const },
];

// ══════════════════════════════════════════════════════════
// ── "has document" detection ──
// ══════════════════════════════════════════════════════════

const docPatterns = /\b(belge|belgesi|document|download|indir|indirilebilir|pdf|dosya|file|metin|text|tam metin|full text)\b/i;

// ══════════════════════════════════════════════════════════
// ── Natural Turkish query patterns ──
// ══════════════════════════════════════════════════════════

const sortNewestPatterns = /\b(en yeni|en son|en güncel|most recent|newest|latest|yeni)\b/i;
const sortOldestPatterns = /\b(en eski|oldest|earliest|ilk|eski)\b/i;
// Superlative patterns for future expansion
const countPatterns = /\b(kaç tane|kaç adet|how many|ne kadar|toplam)\b/i;

// ══════════════════════════════════════════════════════════
// ── Multi-word phrase detection ──
// ══════════════════════════════════════════════════════════

/** Extract multi-word entity names from the query before tokenizing */
function extractPhrases(text: string): string[] {
  const phrases: string[] = [];
  // Collect all multi-word aliases to check
  const allMultiWordAliases: { phrase: string; map: string }[] = [];

  for (const [key, aliases] of Object.entries(countryAliases)) {
    for (const a of aliases) {
      if (a.includes(' ') && a.length > 5) allMultiWordAliases.push({ phrase: a, map: key });
    }
  }
  for (const [key, aliases] of Object.entries(basinAliases)) {
    for (const a of aliases) {
      if (a.includes(' ') && a.length > 5) allMultiWordAliases.push({ phrase: a, map: key });
    }
  }
  for (const [key, aliases] of Object.entries(regionMap)) {
    for (const a of aliases) {
      if (a.includes(' ') && a.length > 5) allMultiWordAliases.push({ phrase: a, map: key });
    }
  }
  for (const [key, aliases] of Object.entries(topicMap)) {
    for (const a of aliases) {
      if (a.includes(' ') && a.length > 5) allMultiWordAliases.push({ phrase: a, map: key });
    }
  }

  const lower = text.toLowerCase();
  const normalized = normalize(text);
  for (const { phrase } of allMultiWordAliases) {
    if (lower.includes(phrase) || normalized.includes(normalize(phrase))) {
      phrases.push(phrase);
    }
  }
  return phrases;
}

// ══════════════════════════════════════════════════════════
// ── Parse query ──
// ══════════════════════════════════════════════════════════

function parseQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase().trim();
  const norm = normalize(lower);
  const result: ParsedQuery = {
    keywords: [],
    regions: [],
    topics: [],
    countries: [],
    basins: [],
  };

  // Extract year constraints
  let yearHandled = false;
  for (const pat of yearPatterns) {
    const m = lower.match(pat.regex);
    if (m && !yearHandled) {
      if (pat.type === 'after') {
        result.yearAfter = parseInt(m[1]);
        yearHandled = true;
      } else if (pat.type === 'before') {
        result.yearBefore = parseInt(m[1]);
        yearHandled = true;
      } else if (pat.type === 'range') {
        result.yearAfter = parseInt(m[1]);
        result.yearBefore = parseInt(m[2]);
        yearHandled = true;
      } else if (pat.type === 'century_tr' || pat.type === 'century_en') {
        const century = parseInt(m[1]);
        result.yearAfter = (century - 1) * 100;
        result.yearBefore = century * 100;
        yearHandled = true;
      } else if (pat.type === 'exact') {
        result.yearExact = parseInt(m[1]);
        yearHandled = true;
      }
    }
  }

  // Detect document filter
  if (docPatterns.test(lower)) {
    result.hasDocument = true;
  }

  // Detect sort preference
  if (sortNewestPatterns.test(lower)) result.sortByNewest = true;
  if (sortOldestPatterns.test(lower)) result.sortByOldest = true;

  // Match regions (check both original and normalized)
  for (const [region, aliases] of Object.entries(regionMap)) {
    if (aliases.some(a => lower.includes(a) || norm.includes(normalize(a)))) {
      result.regions.push(region);
    }
  }

  // Match topics
  for (const [topic, aliases] of Object.entries(topicMap)) {
    if (aliases.some(a => {
      if (a.length <= 3) return lower.split(/\s+/).includes(a);
      return lower.includes(a) || norm.includes(normalize(a));
    })) {
      result.topics.push(topic);
    }
  }

  // Match countries (check stemmed forms too)
  const queryWords = lower.replace(/[^\w\sğüşçöıİĞÜŞÇÖ']/g, ' ').split(/\s+/);
  const stemmedWords = queryWords.map(w => turkishStem(w));

  for (const [country, aliases] of Object.entries(countryAliases)) {
    if (aliases.some(a => {
      // Direct substring match
      if (lower.includes(a) || norm.includes(normalize(a))) return true;
      // Stemmed word match (for suffixed Turkish country names like "Türkiye'nin")
      if (a.length >= 3 && stemmedWords.some(sw => sw === a || normalize(sw) === normalize(a))) return true;
      return false;
    })) {
      result.countries.push(country);
    }
  }

  // Match basins (check stemmed forms too)
  for (const [basin, aliases] of Object.entries(basinAliases)) {
    if (aliases.some(a => {
      if (lower.includes(a) || norm.includes(normalize(a))) return true;
      if (a.length >= 3 && stemmedWords.some(sw => sw === a || normalize(sw) === normalize(a))) return true;
      return false;
    })) {
      result.basins.push(basin);
    }
  }

  // Remaining words as keyword fallback
  const stopWords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'of', 'and', 'or', 'for', 'to', 'with', 'from',
    'between', 'about', 'after', 'before', 'since', 'until', 'all', 'any', 'are', 'is',
    'was', 'were', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'their', 'there',
    'these', 'those', 'that', 'this', 'which', 'what', 'who', 'whom', 'whose', 'how',
    'bir', 've', 'ile', 'için', 'den', 'dan', 'da', 'de', 'daki', 'deki',
    'olan', 'hakkında', 'ilgili', 'tüm', 'bütün', 'arası', 'arasında', 'arasındaki',
    'sonrası', 'sonra', 'öncesi', 'önce', 'yılında', 'yilinda',
    'anlaşma', 'anlaşmalar', 'anlaşmaları', 'antlaşma', 'antlaşmalar', 'antlaşmaları',
    'treaty', 'treaties', 'agreement', 'agreements', 'convention', 'protocol', 'accord',
    'su', 'water', 'river', 'nehir', 'havza', 'basin', 'nehri', 'gölü',
    'nedir', 'neler', 'hangi', 'kaç', 'tane', 'adet', 'var', 'olan', 'olan',
    'bul', 'bulmak', 'ara', 'aramak', 'göster', 'listele', 'sırala',
    'find', 'show', 'list', 'search', 'display',
    'en', 'çok', 'cok', 'daha', 'fazla', 'yeni', 'eski', 'son',
    'imzalanan', 'imzalanmış', 'yapılan', 'yapılmış',
  ]);

  const words = lower.replace(/[^\w\sğüşçöıİĞÜŞÇÖ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  // Also add stemmed versions for keyword matching
  const kwSet = new Set<string>();
  for (const w of words) {
    kwSet.add(w);
    const stemmed = turkishStem(w);
    if (stemmed !== w && stemmed.length >= 3) kwSet.add(stemmed);
    // Add normalized version
    const normed = normalize(w);
    if (normed !== w) kwSet.add(normed);
  }
  result.keywords = Array.from(kwSet);

  return result;
}

// ══════════════════════════════════════════════════════════
// ── Scoring ──
// ══════════════════════════════════════════════════════════

function scoreAgreement(agreement: Agreement, parsed: ParsedQuery): number {
  let score = 0;

  // Year filters (must-match)
  if (parsed.yearAfter) {
    if (agreement.year >= parsed.yearAfter) { /* ok */ }
    else return 0;
  }
  if (parsed.yearBefore) {
    if (agreement.year <= parsed.yearBefore) { /* ok */ }
    else return 0;
  }
  if (parsed.yearExact) {
    if (agreement.year === parsed.yearExact) { score += 10; }
    else if (Math.abs(agreement.year - parsed.yearExact) <= 5) { score += 3; }
    else return 0;
  }

  // Document filter
  if (parsed.hasDocument) {
    if (!agreement.pdfUrl) return 0;
    score += 5;
  }

  const aName = agreement.name.toLowerCase();
  const aCountry = agreement.country.toLowerCase();
  const aBasin = agreement.basin.toLowerCase();
  const aPurpose = agreement.purpose.toLowerCase();
  const allText = `${aName} ${aCountry} ${aBasin} ${aPurpose}`;
  const allTextNorm = normalize(allText);

  // Region matching (check both direct text and Region_Continent which may be in purpose/name)
  if (parsed.regions.length > 0) {
    let regionScore = 0;
    for (const region of parsed.regions) {
      const aliases = regionMap[region] || [];
      const isMatch = aliases.some(a =>
        allText.includes(a) || allTextNorm.includes(normalize(a))
      );
      if (isMatch) regionScore += 15;
    }
    // If region was explicitly requested but found no match in text,
    // don't immediately return 0 — it might still match via country/basin
    if (regionScore > 0) score += regionScore;
  }

  // Topic matching
  for (const topic of parsed.topics) {
    const aliases = topicMap[topic] || [];
    if (aliases.some(a => allText.includes(a) || allTextNorm.includes(normalize(a)))) {
      score += 20;
    }
  }

  // Country matching
  for (const country of parsed.countries) {
    const aliases = countryAliases[country] || [];
    if (aliases.some(a =>
      aCountry.includes(a) || aName.includes(a) ||
      normalize(aCountry).includes(normalize(a)) || normalize(aName).includes(normalize(a))
    )) {
      score += 25;
    }
  }

  // Basin matching
  for (const basin of parsed.basins) {
    const aliases = basinAliases[basin] || [];
    if (aliases.some(a =>
      aBasin.includes(a) || aName.includes(a) ||
      normalize(aBasin).includes(normalize(a)) || normalize(aName).includes(normalize(a))
    )) {
      score += 25;
    }
  }

  // Keyword matching (fuzzy fallback — includes stemmed and normalized forms)
  for (const kw of parsed.keywords) {
    if (allText.includes(kw) || allTextNorm.includes(kw) || allTextNorm.includes(normalize(kw))) {
      score += 5;
    }
  }

  return score;
}

// ══════════════════════════════════════════════════════════
// ── Public API ──
// ══════════════════════════════════════════════════════════

/**
 * Detect if the query is a "smart" (NLP) query vs simple text search.
 */
export function isSmartQuery(query: string): boolean {
  const lower = query.toLowerCase().trim();
  if (lower.length < 5) return false;
  // Contains year patterns, topic words, region words, or multi-word phrases
  if (/\d{4}/.test(lower)) return true;
  if (/\b(sonrası|öncesi|arası|arasında|after|before|between|since|about|hakkında|ilgili|yüzyıl|century)\b/i.test(lower)) return true;
  if (lower.split(/\s+/).length >= 3) return true;
  // Contains known topic/region words
  for (const aliases of Object.values(topicMap)) {
    if (aliases.some(a => lower.includes(a) && a.length > 3)) return true;
  }
  for (const aliases of Object.values(regionMap)) {
    if (aliases.some(a => lower.includes(a) && a.length > 3)) return true;
  }
  // Contains known country aliases
  for (const aliases of Object.values(countryAliases)) {
    if (aliases.some(a => lower.includes(a) && a.length > 4)) return true;
  }
  // Contains known basin aliases
  for (const aliases of Object.values(basinAliases)) {
    if (aliases.some(a => lower.includes(a) && a.length > 3)) return true;
  }
  // Turkish natural query words
  if (/\b(hangi|kaç|neler|bul|göster|listele|sırala)\b/i.test(lower)) return true;
  return false;
}

/**
 * Generate a human-readable description of what was understood from the query.
 */
export function describeQuery(query: string, lang: 'tr' | 'en'): string {
  const parsed = parseQuery(query);
  const parts: string[] = [];

  if (parsed.countries.length > 0) {
    parts.push(lang === 'tr'
      ? `Ülke: ${parsed.countries.join(', ')}`
      : `Country: ${parsed.countries.join(', ')}`);
  }
  if (parsed.basins.length > 0) {
    parts.push(lang === 'tr'
      ? `Havza: ${parsed.basins.join(', ')}`
      : `Basin: ${parsed.basins.join(', ')}`);
  }
  if (parsed.regions.length > 0) {
    parts.push(lang === 'tr'
      ? `Bölge: ${parsed.regions.join(', ')}`
      : `Region: ${parsed.regions.join(', ')}`);
  }
  if (parsed.topics.length > 0) {
    parts.push(lang === 'tr'
      ? `Konu: ${parsed.topics.join(', ')}`
      : `Topic: ${parsed.topics.join(', ')}`);
  }
  if (parsed.yearExact) {
    parts.push(lang === 'tr' ? `Yıl: ${parsed.yearExact}` : `Year: ${parsed.yearExact}`);
  } else {
    if (parsed.yearAfter && parsed.yearBefore) {
      parts.push(lang === 'tr'
        ? `${parsed.yearAfter}–${parsed.yearBefore} arası`
        : `${parsed.yearAfter}–${parsed.yearBefore}`);
    } else if (parsed.yearAfter) {
      parts.push(lang === 'tr' ? `${parsed.yearAfter} sonrası` : `After ${parsed.yearAfter}`);
    } else if (parsed.yearBefore) {
      parts.push(lang === 'tr' ? `${parsed.yearBefore} öncesi` : `Before ${parsed.yearBefore}`);
    }
  }
  if (parsed.hasDocument) {
    parts.push(lang === 'tr' ? 'Belgesi olanlar' : 'With documents');
  }
  if (parsed.sortByNewest) {
    parts.push(lang === 'tr' ? '↓ En yeniden' : '↓ Newest first');
  }
  if (parsed.sortByOldest) {
    parts.push(lang === 'tr' ? '↑ En eskiden' : '↑ Oldest first');
  }

  return parts.length > 0 ? parts.join(' · ') : '';
}

/**
 * Main smart search function. Returns agreements sorted by relevance score.
 */
export function smartSearch(query: string, agreements: Agreement[]): Agreement[] {
  const parsed = parseQuery(query);

  const scored = agreements
    .map(a => ({ agreement: a, score: scoreAgreement(a, parsed) }))
    .filter(s => s.score > 0)
    .sort((a, b) => {
      // Primary sort by score
      if (b.score !== a.score) return b.score - a.score;
      // Secondary sort by user preference
      if (parsed.sortByNewest) return b.agreement.year - a.agreement.year;
      if (parsed.sortByOldest) return a.agreement.year - b.agreement.year;
      return 0;
    });

  // If sort preference specified, apply it after filtering
  if (parsed.sortByNewest || parsed.sortByOldest) {
    const filtered = scored.filter(s => s.score > 0);
    if (parsed.sortByNewest) {
      filtered.sort((a, b) => b.agreement.year - a.agreement.year);
    } else {
      filtered.sort((a, b) => a.agreement.year - b.agreement.year);
    }
    return filtered.map(s => s.agreement);
  }

  return scored.map(s => s.agreement);
}
