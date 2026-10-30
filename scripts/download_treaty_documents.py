"""
Downloads original treaty PDF documents from official sources (UN, UNECE, IBWC, FAOLEX)
and saves them directly into client/public/docs/ for hosting in the GitHub repository.
"""
import os
import urllib.request
import ssl
import sys

# Ensure UTF-8 output
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

DEST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../client/public/docs'))
os.makedirs(DEST_DIR, exist_ok=True)

# List of official original sources
TREATY_SOURCES = [
    # Landmark International Treaties
    ('un-watercourses-1997.pdf',
     'https://legal.un.org/ilc/texts/instruments/english/conventions/8_3_1997.pdf',
     'UN Convention on the Law of the Non-Navigational Uses of International Watercourses (1997)'),

    ('indus-treaty-1960.pdf',
     'https://treaties.un.org/doc/Publication/UNTS/Volume%20419/volume-419-I-6032-English.pdf',
     'Indus Waters Treaty between India and Pakistan (1960)'),

    ('unece-water-1992.pdf',
     'https://treaties.un.org/doc/Treaties/1992/03/19920317%2005-46%20AM/Ch_XXVII_05p.pdf',
     'Convention on Protection and Use of Transboundary Watercourses and International Lakes (1992)'),

    ('us-mexico-1944.pdf',
     'https://www.ibwc.gov/Files/1944Treaty.pdf',
     'Treaty between the United States and Mexico on Utilization of Waters of the Colorado and Rio Grande (1944)'),

    ('nile-agreement-1959.pdf',
     'https://treaties.un.org/doc/Publication/UNTS/Volume%20453/volume-453-I-6519-English.pdf',
     'Nile Waters Agreement between Egypt and Sudan (1959)'),

    ('uruguay-statute-1975.pdf',
     'https://treaties.un.org/doc/Publication/UNTS/Volume%201295/volume-1295-I-21425-English.pdf',
     'Statute of the River Uruguay (1975)'),

    ('danube-convention-1948.pdf',
     'https://treaties.un.org/doc/Publication/UNTS/Volume%2033/volume-33-I-518-English.pdf',
     'Convention Regarding the Regime of Navigation on the Danube (1948)'),

    ('rhine-chlorides-1976.pdf',
     'https://treaties.un.org/doc/Publication/UNTS/Volume%201404/volume-1404-I-23469-English.pdf',
     'Convention on the Protection of the Rhine Against Pollution by Chlorides (1976)'),

    # Official Bilateral Water Treaties (FAOLEX Legal Documents Repository)
    ('bi-165320.pdf', 'https://faolex.fao.org/docs/pdf/bi-165320.pdf', 'MoU Netherlands/Turkey on water management'),
    ('bi-165314.pdf', 'https://faolex.fao.org/docs/pdf/bi-165314.pdf', 'MoU Jordan/Turkey in the field of water'),
    ('bi-151208.pdf', 'https://faolex.fao.org/docs/pdf/bi-151208.pdf', 'Agreement Turkey/Iraq in water resources'),
    ('bi-174068.pdf', 'https://faolex.fao.org/docs/pdf/bi-174068.pdf', 'Agreement Russia/Turkey on fisheries cooperation'),
    ('bi-173274.pdf', 'https://faolex.fao.org/docs/pdf/bi-173274.pdf', 'Agreement Russia/Turkey on agriculture cooperation'),
    ('bi-217079.pdf', 'https://faolex.fao.org/docs/pdf/bi-217079.pdf', 'Agreement Romania/Turkey on protection of waters'),
    ('bi-32264.pdf',  'https://faolex.fao.org/docs/pdf/bi-32264.pdf',  'Agreement USSR/Turkey on cooperation in fisheries'),
    ('bi-32270.pdf',  'https://faolex.fao.org/docs/pdf/bi-32270.pdf',  'Exchange of notes USSR/Turkey on economic zone delimitation'),
    ('bi-172993.pdf', 'https://faolex.fao.org/docs/pdf/bi-172993.pdf', 'Accord Niger/Turkey about water sector'),
    ('bi-103257.pdf', 'https://faolex.fao.org/docs/pdf/bi-103257.pdf', 'Agreement Iran/Turkey on environment protection'),
    ('bi-7174.pdf',   'https://faolex.fao.org/docs/pdf/bi-7174.pdf',   'Agreement Hungary/Turkey on environmental protection'),
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

success_count = 0
skip_count = 0
failed_count = 0

print(f"Target directory: {DEST_DIR}")
print(f"Total targets: {len(TREATY_SOURCES)}\n")

for filename, url, label in TREATY_SOURCES:
    dest_path = os.path.join(DEST_DIR, filename)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        print(f"[SKIP] {filename} already exists ({os.path.getsize(dest_path)} bytes)")
        skip_count += 1
        continue

    print(f"[DOWNLOADING] {label} -> {filename}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as res:
            content = res.read()
            if res.status == 200 and len(content) > 1000:
                with open(dest_path, 'wb') as f:
                    f.write(content)
                print(f"  [OK] Saved {len(content)} bytes to {filename}")
                success_count += 1
            else:
                print(f"  [FAIL] Unexpected response: status {res.status}, length {len(content)}")
                failed_count += 1
    except Exception as e:
        print(f"  [FAIL] Error downloading {url}: {e}")
        failed_count += 1

print("\n-------------------------------------------")
print(f"Download summary: {success_count} downloaded, {skip_count} skipped, {failed_count} failed.")
print(f"Total documents now in client/public/docs: {len(os.listdir(DEST_DIR))}")
