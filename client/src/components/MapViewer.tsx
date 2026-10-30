import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useLanguage } from '@/i18n/LanguageContext';
import type { LayerConfig } from './LayerControl';
import {
  translateTreatyTitle,
  translateBasin,
  translateCountry,
  translatePurpose,
  translateConflict,
} from '@/lib/treatyTranslator';
import { PACIFIC_CATEGORIES, type PacificCategoryType } from '@/data/conflictsTr';

export type { PacificCategoryType };

export interface Agreement {
  id: string;
  name: string;
  country: string;
  basin: string;
  latitude: number;
  longitude: number;
  purpose: string;
  year: number;
  pdfUrl?: string;
  faolexUrl?: string;
  githubDocUrl?: string;
  signatories?: string;
  locationSigned?: string;
  bcode?: string;
  commName?: string;
  rbo?: number;
  alloc?: number;
  allocText?: string;
  hydro?: number;
  groundwater?: number;
  enviro?: number;
  monitoring?: number;
  conflictRes?: number;
}

export interface WaterConflict {
  id: string;
  year: number;
  dateStr?: string;
  region?: string;
  conflictType?: string;
  title: string;
  description: string;
  countries: string;
  basin: string;
  latitude: number;
  longitude: number;
  intensity: number; // -7 to +7 BAR Scale
  type: 'conflict' | 'cooperation' | 'mixed';
  pacificCategory?: PacificCategoryType;
  pacificRefId?: string;
  pacificRefUrl?: string;
  source?: string;
}

interface Props {
  agreements: Agreement[];
  conflicts?: WaterConflict[];
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
  currentYear?: number;
  layers?: LayerConfig[];
}

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function deriveAgreementColor(purpose: string, isSelected: boolean): string {
  const p = purpose.toLowerCase();
  const isConflict =
    p.includes('conflict') ||
    p.includes('dispute') ||
    p.includes('war') ||
    p.includes('protest');
  const isCoop =
    p.includes('cooper') ||
    p.includes('alloc') ||
    p.includes('joint') ||
    p.includes('agreement') ||
    p.includes('treaty');
  if (isSelected) return '#facc15';
  if (isConflict && isCoop) return '#eab308';
  if (isConflict) return '#ef4444';
  return '#22c55e';
}

function buildMarkerIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 14 : 10;
  const border = isSelected ? '2px solid #fff' : '1.5px solid rgba(255,255,255,0.7)';
  const shadow = isSelected
    ? '0 0 6px 2px rgba(250,204,21,0.8)'
    : '0 1px 3px rgba(0,0,0,0.4)';
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border};box-shadow:${shadow};"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function buildConflictIcon(conflict: WaterConflict, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 24 : 20;
  
  // Custom symbol and color according to Pacific Institute taxonomy
  let symbol = '⚡';
  let bg = '#ea580c';
  if (conflict.pacificCategory === 'weapon') {
    symbol = '⚔️';
    bg = '#dc2626';
  } else if (conflict.pacificCategory === 'casualty') {
    symbol = '💥';
    bg = '#9333ea';
  } else if (conflict.pacificCategory === 'cooperation' || conflict.intensity > 0) {
    symbol = '🤝';
    bg = '#16a34a';
  } else if (conflict.intensity <= -4) {
    symbol = '⚡';
    bg = '#dc2626';
  } else {
    symbol = '🎯';
    bg = '#ea580c';
  }

  const shadow = isSelected ? '0 0 10px 3px rgba(220,38,38,0.75)' : '0 2px 6px rgba(0,0,0,0.4)';
  const border = isSelected ? '2px solid #facc15' : '1.5px solid #ffffff';

  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${bg};
      border: ${border};
      box-shadow: ${shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${size * 0.55}px;
      cursor: pointer;
      line-height: 1;
      user-select: none;
    ">${symbol}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function buildPopupLinks(a: Agreement, lang: 'tr' | 'en' = 'tr'): string {
  const links: string[] = [];
  const repoDocText = lang === 'tr' ? '📥 Depo PDF' : '📥 Archive PDF';
  const pdfDownloadText = lang === 'tr' ? '📄 Resmi Belge' : '📄 Source Link';
  const faolexRecordText = lang === 'tr' ? '🌐 FAOLEX' : '🌐 FAOLEX';
  const searchFaolexText = lang === 'tr' ? '🔍 FAOLEX Ara ↗' : '🔍 Search FAOLEX ↗';

  if (a.githubDocUrl) {
    links.push(`<a href="${a.githubDocUrl}" target="_blank" style="color:#0369a1;font-weight:700;text-decoration:none;">${repoDocText}</a>`);
  }
  if (a.pdfUrl && a.pdfUrl !== a.githubDocUrl) {
    links.push(`<a href="${a.pdfUrl}" target="_blank" style="color:#0284c7;font-weight:600;text-decoration:none;">${pdfDownloadText}</a>`);
  }
  if (a.faolexUrl) {
    links.push(`<a href="${a.faolexUrl}" target="_blank" style="color:#475569;font-weight:600;text-decoration:none;">${faolexRecordText}</a>`);
  }
  const q = encodeURIComponent(a.name.slice(0, 80));
  links.push(`<a href="https://www.fao.org/faolex/results/en/?query=${q}" target="_blank" style="color:#64748b;text-decoration:none;">${searchFaolexText}</a>`);
  links.push(`<a href="${import.meta.env.BASE_URL}data/WebsiteTreatiesDB_20181124.xlsx" download="WebsiteTreatiesDB_20181124.xlsx" style="color:#059669;font-weight:700;text-decoration:none;" title="Oregon State University TFDD Treaties Master Database (115 columns)">📊 OSU Excel</a>`);
  links.push(`<a href="${import.meta.env.BASE_URL}docs/WebsiteTreatyCodeBook_20180312.pdf" target="_blank" style="color:#0284c7;font-weight:700;text-decoration:none;" title="Oregon State University TFDD 115-Variable Official CodeBook PDF">📖 CodeBook</a>`);
  links.push(`<a href="https://transboundarywaters.science.oregonstate.edu/sites/transboundarywaters.ceoas.oregonstate.edu/files/2023-08/AtlasFreshwaterAgreements.pdf" target="_blank" style="color:#b45309;font-weight:700;text-decoration:none;" title="UNEP / FAO / OSU Atlas of International Freshwater Agreements (192 Pages)">🗺️ UNEP Atlas ↗</a>`);
  return links.join(' &nbsp;|&nbsp; ');
}

function buildAgreementPopup(a: Agreement, lang: 'tr' | 'en' = 'tr'): string {
  const nameTr = translateTreatyTitle(a.name, lang);
  const countryTr = translateCountry(a.country, lang);
  const basinTr = translateBasin(a.basin, lang);
  const purposeTr = translatePurpose(a.purpose, lang);
  const dateLabel = a.year > 0 ? a.year : (lang === 'tr' ? 'Tarih Belirsiz' : 'Date Unknown');
  const linkHtml = buildPopupLinks(a, lang);

  const pLower = (a.purpose || '').toLowerCase();
  const isConflict = pLower.includes('conflict') || pLower.includes('dispute') || pLower.includes('war');
  const isCoop = pLower.includes('cooper') || pLower.includes('alloc') || pLower.includes('joint');

  let typeBadgeBg = '#0284c7';
  let typeLabel = lang === 'tr' ? 'ULUSLARARASI ANLAŞMA' : 'INTERNATIONAL TREATY';
  if (isConflict && !isCoop) {
    typeBadgeBg = '#dc2626';
    typeLabel = lang === 'tr' ? 'UYUŞMAZLIK / KRİZ ÇÖZÜMÜ' : 'DISPUTE / CRISIS RESOLUTION';
  } else if (isCoop && !isConflict) {
    typeBadgeBg = '#16a34a';
    typeLabel = lang === 'tr' ? 'İŞBİRLİĞİ & TAHSİS ANLAŞMASI' : 'COOPERATION & ALLOCATION';
  } else if (isCoop && isConflict) {
    typeBadgeBg = '#ca8a04';
    typeLabel = lang === 'tr' ? 'MÜZAKERE & ORTAK YÖNETİM' : 'NEGOTIATION & JOINT REGIME';
  }

  const countriesLabel = lang === 'tr' ? 'İmza Sahibi Ülkeler' : 'Signatory States';
  const basinLabel = lang === 'tr' ? 'Nehir / Göl Havzası' : 'River / Lake Basin';
  const focusLabel = lang === 'tr' ? 'Düzenleme Konusu' : 'Primary Scope';

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;line-height:1.45;max-width:280px;color:#1e293b;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:6px;">
        <span style="background:${typeBadgeBg};color:#ffffff;padding:2px 7px;border-radius:4px;font-size:9.5px;font-weight:700;letter-spacing:0.3px;">
          ${typeLabel}
        </span>
        <span style="font-size:11px;font-weight:700;color:#0369a1;background:#f0f9ff;padding:1px 6px;border-radius:4px;border:1px solid #bae6fd;white-space:nowrap;">
          📅 ${dateLabel}
        </span>
      </div>

      <div style="font-weight:700;font-size:13px;color:#0f172a;margin-bottom:6px;line-height:1.35;">
        ${nameTr}
      </div>

      <div style="background:#f8fafc;padding:6px 8px;border-radius:6px;border:1px solid #e2e8f0;display:flex;flex-direction:column;gap:3px;font-size:11.5px;margin-bottom:6px;">
        <div>
          <span style="color:#64748b;font-weight:600;">📍 ${countriesLabel}:</span>
          <span style="color:#1e293b;font-weight:600;margin-left:4px;">${countryTr}</span>
        </div>
        <div>
          <span style="color:#64748b;font-weight:600;">🌊 ${basinLabel}:</span>
          <span style="color:#0284c7;font-weight:600;margin-left:4px;">${basinTr}</span>
        </div>
        <div>
          <span style="color:#64748b;font-weight:600;">📋 ${focusLabel}:</span>
          <span style="color:#475569;margin-left:4px;">${purposeTr}</span>
        </div>
        ${a.locationSigned ? `<div><span style="color:#64748b;font-weight:600;">🏛️ ${lang === 'tr' ? 'İmza Yeri' : 'Signed at'}:</span><span style="color:#334155;margin-left:4px;">${a.locationSigned}</span></div>` : ''}
        ${a.commName ? `<div><span style="color:#64748b;font-weight:600;">🤝 ${lang === 'tr' ? 'Havza Komisyonu' : 'Commission'}:</span><span style="color:#0284c7;font-weight:700;margin-left:4px;">${a.commName}</span></div>` : ''}
      </div>

      ${(a.alloc || a.hydro || a.groundwater || a.monitoring || a.conflictRes) ? `
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;">
          ${a.alloc ? `<span style="background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;font-size:9.5px;padding:1px 5px;border-radius:3px;font-weight:600;">💧 ${lang === 'tr' ? 'Su Tahsisi' : 'Allocation'}</span>` : ''}
          ${a.hydro ? `<span style="background:#fef3c7;color:#b45309;border:1px solid #fde68a;font-size:9.5px;padding:1px 5px;border-radius:3px;font-weight:600;">⚡ ${lang === 'tr' ? 'HES / Enerji' : 'Hydropower'}</span>` : ''}
          ${a.groundwater ? `<span style="background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;font-size:9.5px;padding:1px 5px;border-radius:3px;font-weight:600;">🌿 ${lang === 'tr' ? 'Yeraltı Suyu' : 'Aquifer'}</span>` : ''}
          ${a.monitoring ? `<span style="background:#f3e8ff;color:#7e22ce;border:1px solid #e9d5ff;font-size:9.5px;padding:1px 5px;border-radius:3px;font-weight:600;">📡 ${lang === 'tr' ? 'İzleme' : 'Monitoring'}</span>` : ''}
          ${a.conflictRes ? `<span style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;font-size:9.5px;padding:1px 5px;border-radius:3px;font-weight:600;">⚖️ ${lang === 'tr' ? 'Çözüm Mekanizması' : 'Dispute Mech'}</span>` : ''}
        </div>
      ` : ''}

      <div style="border-top:1px solid #e2e8f0;padding-top:6px;font-size:11px;">
        ${linkHtml}
      </div>
    </div>
  `;
}

function buildConflictPopup(c: WaterConflict, lang: 'tr' | 'en' = 'tr'): string {
  const cTr = translateConflict(c, lang);
  const intensityColor = c.intensity < 0 ? '#dc2626' : c.intensity > 0 ? '#16a34a' : '#ea580c';
  const intensityLabel =
    c.intensity <= -4
      ? lang === 'tr' ? 'Ağır Uyuşmazlık / Su Krizi' : 'Severe Water Dispute / Crisis'
      : c.intensity < 0
      ? lang === 'tr' ? 'Diplomatik / Bölgesel Gerginlik' : 'Diplomatic / Regional Tension'
      : c.intensity > 3
      ? lang === 'tr' ? 'Büyük İşbirliği / Kurum Kuruluşu' : 'Major Cooperation / Treaty'
      : lang === 'tr' ? 'Müzakere / Ortak Girişim' : 'Negotiation / Joint Action';

  const badgeCategory = lang === 'tr' ? '⚡ TARİHİ SU OLAYI' : '⚡ HISTORIC WATER EVENT';
  const countriesLabel = lang === 'tr' ? 'Taraf Ülkeler' : 'Riparian States';
  const basinLabel = lang === 'tr' ? 'Havza' : 'Basin';

  const pacificInfo = c.pacificCategory ? PACIFIC_CATEGORIES[c.pacificCategory] : undefined;
  const pacificBadgeHtml = pacificInfo ? `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;background:${pacificInfo.bg};border:1px solid ${pacificInfo.border};padding:4px 8px;border-radius:5px;">
      <span style="font-size:12px;">${pacificInfo.icon}</span>
      <div style="display:flex;flex-direction:column;">
        <div style="font-size:10.5px;font-weight:700;color:${pacificInfo.color};line-height:1.2;">
          ${lang === 'tr' ? pacificInfo.badgeTr : pacificInfo.badgeEn}
        </div>
        <div style="font-size:9.5px;color:#64748b;line-height:1.25;">
          ${lang === 'tr' ? pacificInfo.descriptionTr : pacificInfo.descriptionEn}
        </div>
      </div>
    </div>
  ` : '';

  const refUrl = c.pacificRefUrl || 'https://worldwater.org/conflict/refs.html';
  const refLinkText = lang === 'tr' ? 'Pacific Institute Kaynakça & Literatür ↗' : 'Pacific Institute Chronology Reference ↗';
  const sourceLabel = lang === 'tr' ? 'Akademik Kaynakça' : 'Academic Reference';

  const sourceHtml = `
    <div style="margin-top:6px;font-size:10px;color:#475569;border-top:1px dashed #cbd5e1;padding-top:5px;background:#f8fafc;padding:6px;border-radius:5px;border:1px solid #e2e8f0;">
      <div style="font-weight:700;color:#334155;margin-bottom:2px;">📚 ${sourceLabel}:</div>
      <div style="color:#64748b;line-height:1.35;margin-bottom:4px;">
        ${c.source || 'Pacific Institute Water Conflict Chronology'}
      </div>
      <a href="${refUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;color:#0284c7;font-weight:700;text-decoration:underline;">
        🏛️ ${refLinkText}
      </a>
    </div>
  `;

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;line-height:1.45;max-width:290px;color:#1e293b;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:6px;">
        <span style="background:${intensityColor};color:#fff;padding:2px 7px;border-radius:4px;font-weight:700;font-size:9.5px;letter-spacing:0.3px;">
          ${badgeCategory}
        </span>
        <span style="background:${intensityColor}20;color:${intensityColor};border:1px solid ${intensityColor}50;padding:1px 6px;border-radius:4px;font-weight:700;font-size:10.5px;">
          BAR: ${c.intensity > 0 ? '+' + c.intensity : c.intensity}
        </span>
      </div>

      <div style="font-weight:700;font-size:13px;color:#0f172a;margin-bottom:4px;line-height:1.3;">
        ${cTr.title}
      </div>

      <div style="font-weight:700;font-size:11px;color:${intensityColor};margin-bottom:6px;">
        ● ${intensityLabel}
      </div>

      ${pacificBadgeHtml}

      <div style="background:#f8fafc;padding:6px 8px;border-radius:6px;border:1px solid #e2e8f0;display:flex;flex-direction:column;gap:3px;font-size:11.5px;margin-bottom:6px;">
        <div>
          <span style="color:#64748b;font-weight:600;">📅 ${lang === 'tr' ? 'Tarih' : 'Date'}:</span>
          <span style="color:#0f172a;font-weight:700;margin-left:4px;">${c.dateStr || (c.year < 0 ? Math.abs(c.year) + (lang === 'tr' ? ' M.Ö.' : ' BC') : c.year)}</span>
        </div>
        <div>
          <span style="color:#64748b;font-weight:600;">📍 ${countriesLabel}:</span>
          <span style="color:#1e293b;font-weight:600;margin-left:4px;">${cTr.countries}</span>
        </div>
        <div>
          <span style="color:#64748b;font-weight:600;">🌊 ${basinLabel}:</span>
          <span style="color:#0284c7;font-weight:600;margin-left:4px;">${cTr.basin}</span>
        </div>
        ${c.region ? `<div><span style="color:#64748b;font-weight:600;">🌍 ${lang === 'tr' ? 'Bölge' : 'Region'}:</span><span style="color:#475569;font-weight:600;margin-left:4px;">${c.region}</span></div>` : ''}
      </div>

      <div style="color:#1e293b;background:#ffffff;padding:8px;border-radius:6px;border:1px solid #e2e8f0;font-size:11.5px;line-height:1.45;margin-bottom:4px;">
        ${cTr.description}
      </div>

      ${sourceHtml}
    </div>
  `;
}

export default function MapViewer({ agreements, conflicts = [], selectedId, onMarkerClick, layers }: Props) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const agreementClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const conflictClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const basinsLayerRef = useRef<L.GeoJSON | null>(null);
  const basinsGeoJsonCache = useRef<any>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Global bridge for Leaflet popup click actions
  useEffect(() => {
    (window as any).selectAgreement = (id: string) => {
      onMarkerClick?.(id);
    };
    return () => {
      delete (window as any).selectAgreement;
    };
  }, [onMarkerClick]);

  // Map init
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [25, 20],
      zoom: 3,
      zoomControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | TFDD Oregon State Univ.',
      maxZoom: 18,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Agreement markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (agreementClusterRef.current) {
      map.removeLayer(agreementClusterRef.current);
    }

    const agreementsLayer = layers?.find((l) => l.id === 'agreements');
    if (agreementsLayer && !agreementsLayer.enabled) {
      return;
    }

    const cluster = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 40 });
    agreements.forEach((a) => {
      const isSelected = a.id === selectedId;
      const color = deriveAgreementColor(a.purpose, isSelected);
      const icon = buildMarkerIcon(color, isSelected);
      const marker = L.marker([a.latitude, a.longitude], { icon, title: a.name });
      marker.bindPopup(buildAgreementPopup(a, lang));
      marker.on('click', () => onMarkerClick?.(a.id));
      cluster.addLayer(marker);
      markersRef.current.set(a.id, marker);
    });
    map.addLayer(cluster);
    agreementClusterRef.current = cluster;
  }, [agreements, selectedId, onMarkerClick, layers, lang]);

  // Update Conflict markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (conflictClusterRef.current) {
      map.removeLayer(conflictClusterRef.current);
    }

    const conflictsLayer = layers?.find((l) => l.id === 'conflicts');
    if (conflictsLayer && !conflictsLayer.enabled) {
      return;
    }

    const cluster = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 35 });
    conflicts.forEach((c) => {
      if (!c.latitude || !c.longitude) return;
      const isSelected = c.id === selectedId;
      const icon = buildConflictIcon(c, isSelected);
      const marker = L.marker([c.latitude, c.longitude], { icon, title: c.title, zIndexOffset: 500 });
      marker.bindPopup(buildConflictPopup(c, lang));
      marker.on('click', () => onMarkerClick?.(c.id));
      cluster.addLayer(marker);
      markersRef.current.set(c.id, marker);
    });
    map.addLayer(cluster);
    conflictClusterRef.current = cluster;
  }, [conflicts, selectedId, onMarkerClick, layers, lang]);

  // Update Basins polygon layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const basinsLayer = layers?.find((l) => l.id === 'basins');
    const isEnabled = basinsLayer ? basinsLayer.enabled : false;

    if (!isEnabled) {
      if (basinsLayerRef.current) {
        map.removeLayer(basinsLayerRef.current);
        basinsLayerRef.current = null;
      }
      return;
    }

    const renderGeoJson = (geoJsonData: any) => {
      if (basinsLayerRef.current) {
        map.removeLayer(basinsLayerRef.current);
      }
      const geoLayer = L.geoJSON(geoJsonData, {
        style: () => ({
          fillColor: '#0284c7',
          weight: 1.2,
          opacity: 0.8,
          color: '#0369a1',
          fillOpacity: 0.12,
        }),
        onEachFeature: (feature, layer) => {
          const p = feature.properties || {};
          const bName = p.Basin_Name || 'Unknown Basin';
          const area = p.Area_km2 ? Number(p.Area_km2).toLocaleString() : 'N/A';
          const pop = p.Pop_2020 ? Number(p.Pop_2020).toLocaleString() : 'N/A';
          const dams = p.Dams_Exist ?? 0;
          const tension = p.HydroPolTe && p.HydroPolTe !== 'N/A' ? `${p.HydroPolTe} / 5` : 'Normal';

          const popupContent = `
            <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;min-width:200px;line-height:1.4;">
              <div style="font-weight:700;font-size:13px;color:#0284c7;margin-bottom:4px;border-bottom:1px solid #e2e8f0;padding-bottom:3px;">
                🌊 ${bName} (${p.BCODE || ''})
              </div>
              <div style="color:#475569;display:flex;flex-direction:column;gap:2px;">
                <div>🌍 <b>${lang === 'tr' ? 'Kıta' : 'Continent'}:</b> ${p.Continent_ || 'N/A'}</div>
                <div>📐 <b>${lang === 'tr' ? 'Yüzölçümü' : 'Area'}:</b> ${area} km²</div>
                <div>👥 <b>${lang === 'tr' ? 'Nüfus (2020)' : 'Population (2020)'}:</b> ${pop}</div>
                <div>🏗️ <b>${lang === 'tr' ? 'Mevcut Barajlar' : 'Existing Dams'}:</b> ${dams}</div>
                ${p.Dam_Plnd ? `<div>🚧 <b>${lang === 'tr' ? 'Planlanan Barajlar' : 'Planned Dams'}:</b> ${p.Dam_Plnd}</div>` : ''}
                <div>⚠️ <b>${lang === 'tr' ? 'Hidropolitik Gerilim' : 'Hydro-Political Tension'}:</b> <span style="font-weight:700;color:#dc2626;">${tension}</span></div>
              </div>
            </div>
          `;
          layer.bindPopup(popupContent);

          layer.on({
            mouseover: (e) => {
              const target = e.target;
              target.setStyle({
                fillColor: '#38bdf8',
                fillOpacity: 0.35,
                weight: 2,
                color: '#0284c7',
              });
            },
            mouseout: (e) => {
              geoLayer.resetStyle(e.target);
            },
          });
        },
      });

      geoLayer.addTo(map);
      basinsLayerRef.current = geoLayer;
    };

    if (basinsGeoJsonCache.current) {
      renderGeoJson(basinsGeoJsonCache.current);
    } else {
      fetch(`${import.meta.env.BASE_URL}data/Basin310_Master_20180511.geojson`)
        .then((res) => res.json())
        .then((data) => {
          basinsGeoJsonCache.current = data;
          renderGeoJson(data);
        })
        .catch((err) => console.error('Error loading basin polygons:', err));
    }
  }, [layers, lang]);

  // Pan to selected marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (marker) {
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 5), { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
