// Pilot basins for the Climate-Hydrology Dashboard
// Coordinates represent the approximate basin centroid (ERA5-Land query point)

export interface BasinClimateInfo {
  key: string;           // matches basin name patterns in agreements data
  nameEn: string;
  nameTr: string;
  lat: number;
  lng: number;
  area_km2: number;      // approximate basin area
  countries: string[];   // riparian countries
  descEn: string;
  descTr: string;
  aliases: string[];     // variant spellings found in TFDD data
}

export const PILOT_BASINS: BasinClimateInfo[] = [
  {
    key: 'Nile',
    nameEn: 'Nile',
    nameTr: 'Nil',
    lat: 15.5,
    lng: 32.5,
    area_km2: 3_400_000,
    countries: ['Egypt', 'Sudan', 'Ethiopia', 'Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Burundi', 'DR Congo', 'Eritrea'],
    descEn: 'The world\'s longest river, flowing through 11 countries. Critically water-stressed basin with ongoing diplomatic tensions over the Grand Ethiopian Renaissance Dam.',
    descTr: 'Dünyanın en uzun nehri; 11 ülkeden geçmektedir. Büyük Etiyopya Rönesans Barajı nedeniyle diplomatik gerilimin sürdüğü, kritik ölçüde su stresi altındaki havza.',
    aliases: ['Nile', 'Nil', 'Blue Nile', 'White Nile', 'Eastern Nile'],
  },
  {
    key: 'Tigris-Euphrates',
    nameEn: 'Tigris-Euphrates',
    nameTr: 'Fırat-Dicle',
    lat: 35.0,
    lng: 40.0,
    area_km2: 879_790,
    countries: ['Turkey', 'Syria', 'Iraq', 'Iran'],
    descEn: 'Cradle-of-civilization basin shared by Turkey, Syria, Iraq and Iran. Severe water stress amplified by upstream dams (GAP, Ilisu) and accelerating climate warming.',
    descTr: 'Uygarlığın beşiği; Türkiye, Suriye, Irak ve İran arasında paylaşılan havza. Yukarı havzadaki barajlar (GAP, Ilısu) ve iklim ısınmasının şiddetlendirdiği yoğun su stresi.',
    aliases: ['Tigris', 'Euphrates', 'Tigris-Euphrates', 'Shatt al Arab', 'Karun'],
  },
  {
    key: 'Colorado',
    nameEn: 'Colorado',
    nameTr: 'Colorado',
    lat: 36.5,
    lng: -111.5,
    area_km2: 637_000,
    countries: ['United States', 'Mexico'],
    descEn: 'Highly contested North American river reaching the Gulf of California — or often no longer reaching it. Governed by the 1922 Colorado River Compact and multiple subsequent agreements.',
    descTr: 'Kuzey Amerika\'nın en çok tartışmalı nehri; California Körfezi\'ne ulaşıyor — ya da artık çoğunlukla ulaşamıyor. 1922 Colorado Nehri Kompaktosu ve birçok sonraki anlaşmayla yönetilmektedir.',
    aliases: ['Colorado', 'Colorado River'],
  },
  {
    key: 'Mekong',
    nameEn: 'Mekong',
    nameTr: 'Mekong',
    lat: 18.0,
    lng: 103.5,
    area_km2: 795_000,
    countries: ['China', 'Myanmar', 'Laos', 'Thailand', 'Cambodia', 'Vietnam'],
    descEn: 'Southeast Asia\'s largest river, sustaining 70 million people. Rapid upstream dam construction by China and Laos has transformed flow regimes and endangered fisheries.',
    descTr: 'Güneydoğu Asya\'nın en büyük nehri; 70 milyon insanı beslemektedir. Çin ve Laos tarafından hızla inşa edilen yukarı havza barajları akış rejimini dönüştürmekte ve balıkçılığı tehdit etmektedir.',
    aliases: ['Mekong', 'Lancang', 'Mekong River'],
  },
  {
    key: 'Indus',
    nameEn: 'Indus',
    nameTr: 'İndus',
    lat: 31.0,
    lng: 71.0,
    area_km2: 1_165_000,
    countries: ['Pakistan', 'India', 'China', 'Afghanistan'],
    descEn: 'Governed by the 1960 Indus Waters Treaty — one of the most durable water-sharing agreements in the world, now under renewed stress from climate change and geopolitical tensions.',
    descTr: '1960 İndus Suları Antlaşması ile yönetilen havza; dünyada en uzun süre geçerliliğini koruyan su paylaşım anlaşmalarından biri, ancak iklim değişikliği ve jeopolitik gerilimler altında yeniden baskıya girmektedir.',
    aliases: ['Indus', 'Indus River', 'Indus Waters'],
  },
  {
    key: 'Danube',
    nameEn: 'Danube',
    nameTr: 'Tuna',
    lat: 47.5,
    lng: 19.0,
    area_km2: 801_463,
    countries: ['Germany', 'Austria', 'Slovakia', 'Hungary', 'Croatia', 'Serbia', 'Romania', 'Bulgaria', 'Moldova', 'Ukraine'],
    descEn: 'Europe\'s most international river basin, touching 19 countries. The 1994 Danube River Protection Convention is a landmark multilateral agreement.',
    descTr: 'Avrupa\'nın en uluslararası nehir havzası; 19 ülkeye dokunmaktadır. 1994 Tuna Nehri Koruma Sözleşmesi önemli bir çok taraflı anlaşmadır.',
    aliases: ['Danube', 'Tuna', 'Donau'],
  },
  {
    key: 'Amazon',
    nameEn: 'Amazon',
    nameTr: 'Amazon',
    lat: -5.0,
    lng: -62.0,
    area_km2: 7_000_000,
    countries: ['Brazil', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia', 'Guyana', 'Suriname', 'French Guiana'],
    descEn: 'The world\'s largest river by discharge, carrying ~20% of global freshwater runoff. Rapid deforestation is altering regional hydrology and precipitation patterns.',
    descTr: 'Debi bakımından dünyanın en büyük nehri; küresel tatlı su akışının yaklaşık %20\'sini taşımaktadır. Hızlı ormansızlaşma bölgesel hidroloji ve yağış düzenini dönüştürmektedir.',
    aliases: ['Amazon', 'Amazonas'],
  },
  {
    key: 'Aral Sea',
    nameEn: 'Aral Sea / Amu Darya & Syr Darya',
    nameTr: 'Aral Gölü / Amu Derya & Sir Derya',
    lat: 44.0,
    lng: 59.0,
    area_km2: 1_549_000,
    countries: ['Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Kyrgyzstan', 'Afghanistan'],
    descEn: 'Once one of the world\'s four largest lakes, now largely desiccated due to Soviet-era irrigation diversions. The most dramatic human-caused hydrological catastrophe of the 20th century.',
    descTr: 'Bir zamanlar dünyanın dört büyük gölünden biri; Sovyet döneminde sulama amaçlı yapılan su transferleri nedeniyle büyük ölçüde kurudu. 20. yüzyılın insan kaynaklı en dramatik hidrolojik felaketi.',
    aliases: ['Aral Sea', 'Amu Darya', 'Syr Darya', 'Amu-Darya', 'Syr-Darya'],
  },
];

// Helper: find basin info by basin name string from agreements data
export function findBasinClimate(basinName: string): BasinClimateInfo | null {
  if (!basinName) return null;
  const lower = basinName.toLowerCase().trim();
  return (
    PILOT_BASINS.find((b) =>
      b.aliases.some((alias) => lower.includes(alias.toLowerCase()))
    ) ?? null
  );
}
