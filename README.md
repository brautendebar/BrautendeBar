# Brautende bar

Nettside for Brautende bar. Rein HTML, ingen byggesteg, gratis hosting på GitHub Pages.
Instagram-postene hentes automatisk hver 6. time av en GitHub Action.

## Filene

    index.html                        Hele siden
    innhold.json                      All tekst: åpningstider, priser, adresse, arrangementer
    bilder/                           Egne bilder (hero.jpg, interior.jpg, selskap.jpg)
    instagram/posts.json              Lages automatisk
    instagram/bilder/                 Lages automatisk
    scripts/hent-instagram.mjs        Henter fra Instagram
    .github/workflows/instagram.yml   Kjører henteskriptet på timeplan

## 1. Legg filene i et repo

Nytt repo på github.com, navn f.eks. `brautendebar`. Last opp alle filene i dette prosjektet.

## 2. Slå på Pages

Settings → Pages → Source: **Deploy from a branch** → branch `main`, mappe `/ (root)` → Save.
Siden ligger på `https://<brukernavn>.github.io/brautendebar/` etter et minutt.

Eget domene: Settings → Pages → Custom domain → `brautendebar.no`.
Hos domeneleverandøren peker du `www` som CNAME til `<brukernavn>.github.io`,
og apex-domenet med A-records til 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.

## 3. Instagram-token

Siden fungerer uten dette — da vises plassholder-ruter. For automatisk feed:

1. Instagram-kontoen må være **profesjonell** og **offentlig**. (Den er det.)
2. Gå til developers.facebook.com → My Apps → Create App → type **Business**.
3. Legg til produktet **Instagram** → *Instagram API setup with Instagram login*.
4. Under **Generate access tokens**: koble til @brautendebar og generer en token.
   Bruk **Generate long-lived token** — den varer i 60 dager.
5. I repoet: Settings → Secrets and variables → Actions → New repository secret.
   Navn: `IG_TOKEN`. Verdi: tokenen.
6. Actions-fanen → *Hent Instagram* → **Run workflow** for å kjøre første gang.

### Tokenen må fornyes
Long-lived tokens varer 60 dager. Sett en påminnelse, eller legg til et steg i workflowen
som kaller `GET https://graph.instagram.com/refresh_access_token` — den må da også kunne
skrive tilbake secreten, som krever en Personal Access Token. Enkleste for en bar:
fornye manuelt to-tre ganger i året.

## Endre tekst

Alt ligger i `innhold.json`. Åpne filen på github.com, trykk blyanten, rediger, commit.
Siden oppdateres i løpet av et minutt.

Åpningstidene har både visningstekst og tall:

    { "dager": "Fredag – lørdag", "tid": "16:00 – 03:00", "fra": 16, "til": 27, "ukedager": [5, 6] }

`fra`/`til` er timer i 24-timersformat; `til` over 24 betyr etter midnatt (27 = 03:00).
`ukedager`: 0 = søndag, 1 = mandag … 6 = lørdag. Disse styrer «Åpent nå»-merket.

## Bilder

Legg tre bilder i `bilder/`: `hero.jpg` (bredt, ca. 2400×1400), `interior.jpg` (portrett,
ca. 1600×2000), `selskap.jpg` (ca. 1800×1200). Mangler de, vises stripete plassholdere.
Hold hvert bilde under 500 kB.

## Hva dette koster

GitHub Pages og Actions: gratis. Domene: ca. 150 kr/år. Ingenting annet.
# BrautendeBar
