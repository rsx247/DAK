# Logo toevoegen - Proces

Dit document beschrijft het proces voor het toevoegen van een nieuw logo voor een venue/organisatie.

## Stappen

### 1. Logo downloaden van de opgegeven URL

```bash
# Download het logo naar de logos/ folder
cd /Users/admin/Documents/DAK/scrapy/logos
python3 << 'EOF'
import requests

logo_url = "URL_VAN_HET_LOGO_HIER"
response = requests.get(logo_url)
response.raise_for_status()

# Bepaal bestandsextensie en naam
filename = "venue-naam.png"  # of .jpg, .svg, etc.
with open(filename, 'wb') as f:
    f.write(response.content)
print(f"✅ Logo gedownload: {filename}")
EOF
```

### 2. Thumbnail maken (1:1 aspect ratio, WebP)

```bash
cd /Users/admin/Documents/DAK/scrapy/logos
python3 << 'EOF'
from PIL import Image

input_path = "venue-naam.png"  # of .jpg, .svg, etc.
output_path = "venue-naam.webp"
size = 512

img = Image.open(input_path)

# Resize to fit 512x512 canvas with 1:1 aspect ratio
if img.width > img.height:
    new_height = size
    new_width = int(img.width * (size / img.height))
else:
    new_width = size
    new_height = int(img.height * (size / img.width))

img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

# Create square canvas
canvas = Image.new('RGBA', (size, size), (255, 255, 255, 0))
x_offset = (size - new_width) // 2
y_offset = (size - new_height) // 2
canvas.paste(img_resized, (x_offset, y_offset), img_resized if img.mode == 'RGBA' else None)

# Save as WebP
canvas.save(output_path, 'WebP', quality=85)
print(f"✅ Thumbnail gemaakt: {output_path} ({size}x{size}px)")
EOF
```

### 3. Toevoegen aan de GitHub-repo (assets/logos/ en assets/logos/thumbs/)

```bash
cd /Users/admin/Documents/DAK

# Kopieer origineel logo naar assets/logos/
cp scrapy/logos/venue-naam.png assets/logos/

# Kopieer thumbnail naar assets/logos/thumbs/
cp scrapy/logos/venue-naam.webp assets/logos/thumbs/

# Verifieer
ls -la assets/logos/venue-naam.* assets/logos/thumbs/venue-naam.webp
```

### 4. venue-logos.txt bijwerken

Voeg de venue mapping toe aan `/Users/admin/Documents/DAK/scrapy/venue-logos.txt`:

```
venue-XX | venue-naam.webp
venue-YY | venue-naam.webp  # (als meerdere venues hetzelfde logo gebruiken)
```

**Format:**
- Base URL is al gedefinieerd: `https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/`
- Voeg alleen de regel toe: `venue-ID | bestandsnaam.webp`

### 5. events.ts bijwerken met de thumbnail-URL

Voeg of update het `logoUrl` veld in `/Users/admin/Documents/DAK/scrapy/events.ts`:

```typescript
{
  "id": "venue-XX",
  "name": "Venue Naam",
  // ... andere velden ...
  "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/venue-naam.webp",
  "verificationStatus": "..."
}
```

**Of gebruik het update script:**

```bash
cd /Users/admin/Documents/DAK/scrapy
python3 update_events_ts_logos.py
```

## Git commit en push

```bash
cd /Users/admin/Documents/DAK

# Stage de nieuwe bestanden
git add assets/logos/venue-naam.png assets/logos/thumbs/venue-naam.webp scrapy/events.ts scrapy/venue-logos.txt

# Commit
git commit -m "Add logo for venue-XX (Venue Naam)"

# Push naar GitHub (gebruikt als tijdelijke media server)
git push origin main
```

## Nieuwe Logo's Te Verwerken

### Logo's uit "logos v2"

1. **Zusters Moeder Teresa**
   - URL: `https://scontent-ams2-1.xx.fbcdn.net/v/t39.30808-6/501091819_10024888990932198_24794253744264649_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=POkHOPEs4k4Q7kNvwGOu0yT&_nc_oc=Adkxa55Aq_UaIbm9BBGeBgNRRkoO_nkIgl1D7C__4WIpp9_gABxjiB7TXXd96f3m8UU&_nc_zt=23&_nc_ht=scontent-ams2-1.xx&_nc_gid=6KIhGVUc8WoeLGszI4K4tg&oh=00_AfgqcyDidLf-4ZEmNpH02seP9dn7DIAHEEGl2LWjvWBTYQ&oe=6914E0AF`
   - Bestandsnaam: `zusters-moeder-teresa.jpg`

2. **De Erker**
   - URL: `https://www.wijkcentrumdeerker.nl/wp-content/uploads/2024/08/logo-de-erker.png`
   - Bestandsnaam: `de-erker.png`

3. **Huizen van de Wijk / WMO Radar**
   - URL: `https://www.wmoradar.nl/wp-content/themes/intracto/build/img/logo-wmoradar.svg`
   - Bestandsnaam: `logo-wmoradar.svg`

4. **Audarya Tempel**
   - URL: `https://scontent-ams2-1.xx.fbcdn.net/v/t39.30808-6/276134426_333646842122338_5389660050828382773_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=CdMwUlGNVnwQ7kNvwHO-J3p&_nc_oc=AdkQswUahtVo3Q73F9-h6OY3GL9V_cfu9NaQcwbQp41d700DpqTtlMF6TuSB9uOB5Ss&_nc_zt=23&_nc_ht=scontent-ams2-1.xx&_nc_gid=cZpf7Pha5d0-OuJn-rcMrA&oh=00_AfjH059MmmumKC0op1Py00S0bKyW1ei1zTznpJjMC6zMuA&oe=6914FB19`
   - Bestandsnaam: `audarya-tempel.jpg`

5. **Perlas Vriend**
   - URL: `https://scontent-ams2-1.xx.fbcdn.net/v/t39.30808-6/327214420_553944729790716_8475587447953367501_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=UzFmJjDb_4kQ7kNvwE1penN&_nc_oc=AdnqKF35qnghaVFqNcHCW-Qn2VU_BnJOlGFNiYhyDYoTmC5xjE8iNNrgtEmWn6r8_b0&_nc_zt=23&_nc_ht=scontent-ams2-1.xx&_nc_gid=sdo2wgDGiAQJl_JOs8ibjQ&oh=00_Afhk5AGkN5cDgkPLxLpfkaurdBNhmEamObd6B82KO4B7cA&oe=6914EED7`
   - Bestandsnaam: `perlas-vriend.jpg`

6. **Wijkgebouw De Bron**
   - URL: `https://scontent-ams2-1.xx.fbcdn.net/v/t39.30808-6/306233437_469412468562781_7338805947825910482_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=cjPA7RrhjLUQ7kNvwFPzxfH&_nc_oc=AdmFqoWYc8han7GTcLtJTvEtoGzxidm7NoLKW7dRQSYQCh2oGPbtC4SQ2WN8IE7mwlY&_nc_zt=23&_nc_ht=scontent-ams2-1.xx&_nc_gid=VojTZlCxEkYqaE6EQ3bxdw&oh=00_Afj9ngmmUJI8aqjfdTdpSR7tKDWNp-H_6Tkxjv0jD_boIQ&oe=691512FC`
   - Bestandsnaam: `wijkgebouw-de-bron.jpg`

7. **Gaarkeuken** (parent of all wijkrestaurants)
   - URL: `https://gaarkeuken.nl/wp-content/uploads/2024/04/Logo-Gaarkeuken-Groen-01.png`
   - Bestandsnaam: `gaarkeuken.png`

### Logo's uit "v2" folder

8. **Voedselcentrum Isaak de Schittering (v2)**
   - Bestand: `logos/v2/voedselcentrum-isaak-de-schittering2.png`
   - Bestandsnaam: `voedselcentrum-isaak-de-schittering2.png`
   - Opmerking: Dit is een nieuwe versie van het bestaande logo

## Notities

- **GitHub wordt gebruikt als tijdelijke media server** voor assets en logo's
- Alle logo URL's wijzen naar: `https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/[filename].webp`
- Thumbnails zijn altijd 512x512px WebP formaat (1:1 aspect ratio, gecentreerd op canvas)
- Als meerdere venues hetzelfde logo gebruiken, voeg ze allemaal toe aan `venue-logos.txt` met dezelfde bestandsnaam

