import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { basinCoords } from '../client/src/data/basinCoords';
import { findTreatyLink, findGithubDoc } from '../client/src/data/treatyLinks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findBasinCoords(basinName: string): [number, number] | null {
  if (!basinName) return null;
  const coordsMap = basinCoords as Record<string, [number, number]>;
  if (coordsMap[basinName]) return coordsMap[basinName];
  const primary = basinName.split(',')[0].trim();
  if (coordsMap[primary]) return coordsMap[primary];
  const lower = basinName.toLowerCase();
  for (const [key, val] of Object.entries(coordsMap)) {
    if (key.toLowerCase() === lower) return val;
  }
  return null;
}

function extractYear(val: unknown): number {
  const m = String(val ?? '').match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
}

const masterPath = path.resolve(__dirname, '../client/public/data/MASTER.json');
const outputPath = path.resolve(__dirname, '../client/public/data/agreements.min.json');

console.log('Reading MASTER.json...');
const rawText = fs.readFileSync(masterPath, 'utf8').replace(/[\x00-\x1f\x7f]/g, ' ');
const raw = JSON.parse(rawText);
const rows: Record<string, unknown>[] =
  raw['Full Treaty Database'] || raw.agreements || raw.data || [];

console.log(`Processing ${rows.length} treaty records...`);

const parsed = rows
  .map((row, index) => {
    let lat = Number(row.latitude ?? row.lat ?? row.Latitude ?? 0);
    let lng = Number(row.longitude ?? row.lng ?? row.lon ?? row.Longitude ?? 0);
    const basin = String(
      row.basin ?? row.Basin ?? row['Basin Name'] ?? row['TFDD Basin(s)'] ?? row.river ?? ''
    );
    if ((!lat || !lng) && basin) {
      const coords = findBasinCoords(basin);
      if (coords) {
        lat = coords[0] + (Math.random() - 0.5) * 2;
        lng = coords[1] + (Math.random() - 0.5) * 2;
      }
    }
    const yr = extractYear(row.year ?? row.Year ?? row.DateSigned ?? row.date);
    const docName = String(row.DocumentName ?? row.name ?? row.Name ?? row.title ?? '');
    const link = findTreatyLink(docName);
    const ghDoc = link ? findGithubDoc(link.faolex, docName) : undefined;
    return {
      id: String(row.id ?? row.ID ?? row['Entry ID'] ?? `agreement-${index}`),
      name: String(row.name ?? row.Name ?? row.title ?? row.DocumentName ?? 'Unnamed'),
      country: String(row.country ?? row.Country ?? row.Signatories ?? 'Unknown'),
      basin,
      latitude: Number(lat.toFixed(4)),
      longitude: Number(lng.toFixed(4)),
      purpose: String(row.purpose ?? row.Purpose ?? row['Issue Area'] ?? ''),
      year: yr || 2024,
      pdfUrl: String(row.pdfUrl ?? link?.download ?? ''),
      faolexUrl: link?.faolex,
      githubDocUrl: ghDoc ? `docs/${ghDoc}` : undefined,
    };
  })
  .filter((a) => a.latitude !== 0 && a.longitude !== 0);

console.log(`Saving ${parsed.length} parsed agreements to agreements.min.json...`);
fs.writeFileSync(outputPath, JSON.stringify(parsed));

const origSize = (fs.statSync(masterPath).size / (1024 * 1024)).toFixed(2);
const newSize = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);

console.log(`Optimization complete! Size reduced from ${origSize} MB to ${newSize} MB! (Saved ~${(((1 - parseFloat(newSize) / parseFloat(origSize)) * 100)).toFixed(0)}%)`);
