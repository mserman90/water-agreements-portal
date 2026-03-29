/**
 * Client-side NLP-powered smart search engine for treaty agreements.
 * No API keys needed — runs entirely in the browser.
 *
 * Supports queries like:
 *   - "Nil havzasındaki 1960 sonrası anlaşmalar"
 *   - "agreements about navigation in Europe after 1950"
 *   - "Türkiye su anlaşmaları"
 *   - "hydropower treaties between 1970 and 2000"
 *   - "Afrika'daki sınır anlaşmaları"
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
}

// ── Region synonyms ──
const regionMap: Record<string, string[]> = {
  'europe': ['europe', 'avrupa', 'european', 'western europe', 'eastern europe'],
  'africa': ['africa', 'afrika', 'african'],
  'asia': ['asia', 'asya', 'asian'],
  'north america': ['north america', 'kuzey amerika', 'americas'],
  'south america': ['south america', 'güney amerika', 'latin america', 'latin amerika'],
  'middle east': ['middle east', 'orta doğu', 'ortadoğu'],
};

// ── Topic / Issue synonyms (TR + EN) ──
const topicMap: Record<string, string[]> = {
  'navigation': ['navigation', 'seyrüsefer', 'navigasyon', 'gemi'],
  'fishing': ['fishing', 'fish', 'balık', 'balıkçılık'],
  'hydropower': ['hydropower', 'hidro', 'hidroelektrik', 'energy', 'enerji', 'baraj', 'dam'],
  'irrigation': ['irrigation', 'sulama', 'tarım', 'agriculture'],
  'border': ['border', 'sınır', 'territorial', 'toprak', 'hudut'],
  'water quality': ['water quality', 'su kalitesi', 'pollution', 'kirlilik', 'kirlenme'],
  'flood': ['flood', 'sel', 'taşkın'],
  'groundwater': ['groundwater', 'yeraltı', 'aquifer', 'akifer'],
  'environment': ['environment', 'çevre', 'environmental', 'ekoloji', 'ecology', 'wetland'],
  'water quantity': ['water quantity', 'su miktarı', 'allocation', 'paylaşım', 'tahsis'],
  'monitoring': ['monitoring', 'izleme', 'gözlem'],
  'cooperation': ['cooperation', 'işbirliği', 'commission', 'komisyon'],
};

// ── Country name synonyms (TR + EN) ──
const countryAliases: Record<string, string[]> = {
  'turkey': ['turkey', 'türkiye', 'turkiye', 'turkish', 'türk'],
  'syria': ['syria', 'suriye', 'syrian'],
  'iraq': ['iraq', 'irak', 'iraqi'],
  'iran': ['iran', 'iranian', 'persia'],
  'egypt': ['egypt', 'mısır', 'misir', 'egyptian'],
  'sudan': ['sudan', 'sudanese'],
  'ethiopia': ['ethiopia', 'etiyopya'],
  'israel': ['israel', 'israil'],
  'jordan': ['jordan', 'ürdün', 'urdun'],
  'india': ['india', 'hindistan'],
  'pakistan': ['pakistan'],
  'china': ['china', 'çin', 'cin', 'chinese'],
  'russia': ['russia', 'rusya', 'russian', 'soviet', 'ussr', 'sovyet'],
  'germany': ['germany', 'almanya', 'german'],
  'france': ['france', 'fransa', 'french'],
  'netherlands': ['netherlands', 'hollanda', 'dutch'],
  'usa': ['usa', 'abd', 'united states', 'america', 'american', 'amerikan'],
  'mexico': ['mexico', 'meksika'],
  'canada': ['canada', 'kanada'],
  'brazil': ['brazil', 'brezilya'],
  'argentina': ['argentina', 'arjantin'],
  'south africa': ['south africa', 'güney afrika'],
  'afghanistan': ['afghanistan', 'afganistan'],
  'bangladesh': ['bangladesh', 'bangladeş'],
  'nepal': ['nepal'],
  'cambodia': ['cambodia', 'kamboçya'],
  'vietnam': ['vietnam'],
  'thailand': ['thailand', 'tayland'],
  'laos': ['laos'],
  'myanmar': ['myanmar', 'burma'],
  'kazakhstan': ['kazakhstan', 'kazakistan'],
  'uzbekistan': ['uzbekistan', 'özbekistan'],
};

// ── Basin name aliases ──
const basinAliases: Record<string, string[]> = {
  'nile': ['nile', 'nil'],
  'tigris-euphrates': ['tigris', 'euphrates', 'fırat', 'firat', 'dicle', 'shatt'],
  'danube': ['danube', 'tuna'],
  'rhine': ['rhine', 'ren'],
  'mekong': ['mekong'],
  'indus': ['indus', 'indüs'],
  'ganges': ['ganges', 'ganj', 'brahmaputra'],
  'amazon': ['amazon', 'amazonas'],
  'congo': ['congo', 'kongo', 'zaire'],
  'niger': ['niger', 'nijer'],
  'zambezi': ['zambezi', 'zambesi'],
  'colorado': ['colorado'],
  'columbia': ['columbia', 'kolombiya nehri'],
  'jordan': ['jordan', 'ürdün nehri'],
  'la plata': ['la plata', 'plata'],
  'volta': ['volta'],
  'senegal': ['senegal'],
  'orange': ['orange', 'oranj'],
  'okavango': ['okavango'],
  'lake chad': ['lake chad', 'çad gölü', 'chad'],
  'aral': ['aral'],
  'helmand': ['helmand'],
  'salween': ['salween'],
  'irrawaddy': ['irrawaddy'],
};

// ── Year extraction patterns ──
const yearPatterns = [
  // "1960 sonrası" / "after 1960" / "post-1960" / "1960'dan sonra"
  { regex: /(?:sonrası|sonra|after|post[- ]?|since|from)\s*(\d{4})/i, type: 'after' as const },
  { regex: /(\d{4})\s*(?:sonrası|sonra|'dan sonra|'den sonra)/i, type: 'after' as const },
  // "1960 öncesi" / "before 1960" / "pre-1960"
  { regex: /(?:öncesi|önce|before|pre[- ]?|until)\s*(\d{4})/i, type: 'before' as const },
  { regex: /(\d{4})\s*(?:öncesi|önce|'dan önce|'den önce)/i, type: 'before' as const },
  // "1960-2000 arası" / "between 1960 and 2000"
  { regex: /(\d{4})\s*[-–]\s*(\d{4})/i, type: 'range' as const },
  { regex: /(?:between|arası|arasında|arasındaki)\s*(\d{4})\s*(?:and|ile|ve|-)\s*(\d{4})/i, type: 'range' as const },
  { regex: /(\d{4})\s*(?:arası|arasında|arasındaki)\s*/i, type: 'after' as const },
  // Exact year: just "1960" standing alone
  { regex: /\b(\d{4})\b/, type: 'exact' as const },
];

// ── "has document" detection ──
const docPatterns = /\b(belge|document|download|indir|pdf|dosya|file)\b/i;

/**
 * Parse a natural language query into structured filters.
 */
function parseQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase().trim();
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

  // Match regions
  for (const [region, aliases] of Object.entries(regionMap)) {
    if (aliases.some(a => lower.includes(a))) {
      result.regions.push(region);
    }
  }

  // Match topics
  for (const [topic, aliases] of Object.entries(topicMap)) {
    if (aliases.some(a => lower.includes(a))) {
      result.topics.push(topic);
    }
  }

  // Match countries
  for (const [country, aliases] of Object.entries(countryAliases)) {
    if (aliases.some(a => lower.includes(a))) {
      result.countries.push(country);
    }
  }

  // Match basins
  for (const [basin, aliases] of Object.entries(basinAliases)) {
    if (aliases.some(a => lower.includes(a))) {
      result.basins.push(basin);
    }
  }

  // Remaining words as keyword fallback
  const stopWords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'of', 'and', 'or', 'for', 'to', 'with', 'from',
    'between', 'about', 'after', 'before', 'since', 'until', 'all', 'any',
    'bir', 've', 'ile', 'için', 'den', 'dan', 'da', 'de', 'daki', 'deki',
    'olan', 'olan', 'hakkında', 'ilgili', 'tüm', 'bütün', 'arası', 'arasındaki',
    'sonrası', 'sonra', 'öncesi', 'önce', 'anlaşma', 'anlaşmalar', 'anlaşmaları',
    'treaty', 'treaties', 'agreement', 'agreements', 'convention', 'protocol',
    'su', 'water', 'river', 'nehir', 'havza', 'basin',
  ]);

  const words = lower.replace(/[^\w\sğüşçöıİĞÜŞÇÖ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  result.keywords = words;

  return result;
}

/**
 * Score how well an agreement matches the parsed query.
 * Higher score = better match. 0 = no match.
 */
function scoreAgreement(agreement: Agreement, parsed: ParsedQuery): number {
  let score = 0;
  let mustMatch = 0;
  let mustHit = 0;

  // Year filters (must-match)
  if (parsed.yearAfter) {
    mustMatch++;
    if (agreement.year >= parsed.yearAfter) mustHit++;
    else return 0;
  }
  if (parsed.yearBefore) {
    mustMatch++;
    if (agreement.year <= parsed.yearBefore) mustHit++;
    else return 0;
  }
  if (parsed.yearExact) {
    mustMatch++;
    if (agreement.year === parsed.yearExact) { mustHit++; score += 10; }
    else if (Math.abs(agreement.year - parsed.yearExact) <= 5) { mustHit++; score += 3; }
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

  // Region matching
  if (parsed.regions.length > 0) {
    const regionHit = parsed.regions.some(region => {
      const aliases = regionMap[region] || [];
      return aliases.some(a => allText.includes(a));
    });
    if (regionHit) score += 15;
  }

  // Topic matching
  for (const topic of parsed.topics) {
    const aliases = topicMap[topic] || [];
    if (aliases.some(a => allText.includes(a))) {
      score += 20;
    }
  }

  // Country matching
  for (const country of parsed.countries) {
    const aliases = countryAliases[country] || [];
    if (aliases.some(a => aCountry.includes(a) || aName.includes(a))) {
      score += 25;
    }
  }

  // Basin matching
  for (const basin of parsed.basins) {
    const aliases = basinAliases[basin] || [];
    if (aliases.some(a => aBasin.includes(a) || aName.includes(a))) {
      score += 25;
    }
  }

  // Keyword matching (fuzzy fallback)
  for (const kw of parsed.keywords) {
    if (allText.includes(kw)) {
      score += 5;
    }
  }

  return score;
}

/**
 * Detect if the query is a "smart" (NLP) query vs simple text search.
 */
export function isSmartQuery(query: string): boolean {
  const lower = query.toLowerCase().trim();
  if (lower.length < 5) return false;
  // Contains year patterns, topic words, region words, or multi-word phrases
  if (/\d{4}/.test(lower)) return true;
  if (/\b(sonrası|öncesi|arası|after|before|between|since|about|hakkında|ilgili)\b/i.test(lower)) return true;
  if (lower.split(/\s+/).length >= 3) return true;
  // Contains known topic/region words
  for (const aliases of Object.values(topicMap)) {
    if (aliases.some(a => lower.includes(a) && a.length > 3)) return true;
  }
  for (const aliases of Object.values(regionMap)) {
    if (aliases.some(a => lower.includes(a) && a.length > 3)) return true;
  }
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
    if (parsed.yearAfter) {
      parts.push(lang === 'tr' ? `${parsed.yearAfter} sonrası` : `After ${parsed.yearAfter}`);
    }
    if (parsed.yearBefore) {
      parts.push(lang === 'tr' ? `${parsed.yearBefore} öncesi` : `Before ${parsed.yearBefore}`);
    }
  }
  if (parsed.hasDocument) {
    parts.push(lang === 'tr' ? 'Belgesi olanlar' : 'With documents');
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
    .sort((a, b) => b.score - a.score);

  return scored.map(s => s.agreement);
}
