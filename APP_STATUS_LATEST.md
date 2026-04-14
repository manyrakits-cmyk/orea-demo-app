# Orea v kapse — stav aplikace (handoff pro nový chat)

Tento soubor doplňuje [APP_CURRENT_STATE.md](APP_CURRENT_STATE.md) a shrnuje **aktuální funkce a strukturu kódu** po posledních úpravách. Slouží jako rychlý kontext při otevření nového vlákna.

## Kde je co v kódu

- Hlavní logika a UI: [src/App.jsx](src/App.jsx)
- Styly: [src/App.css](src/App.css)
- Kontext produktu (neměnit bez domluvy): [Orea_app_context.md](Orea_app_context.md)
- Obecný architektonický popis: [APP_CURRENT_STATE.md](APP_CURRENT_STATE.md)

## Architektura (beze změny základu)

- React + Vite, jedna velká komponenta `App`, data v paměti, bez backendu.
- Přepínač demo profilu **Recepce / Housekeeping** je mimo mobilní „telefon“ (desktop-only blok nahoře, viz CSS `@media (min-width: 768px)`).

## Vizuální styl (latest)

- Proběhl **kompletní reskin UI** do čistého `slate/white` stylu (zaoblené karty, jemné stíny, vyšší kontrast CTA).
- Paleta je nyní sjednocená na **slate + amber** bez fialových akcentů (slate pro primární prvky, amber pro upozornění).
- Header je nově sticky s „glass“ efektem; přibyla ikona notifikací.
- Spodní navigace je translucent / blur „glass bar“ s ikonami a aktivním indikátorem.
- Ikony jsou sjednocené přes `lucide-react` (header, bottom nav, CTA/FAB, šipky v seznamech).
- Funkční logika obrazovek a flow se tímto krokem **neměnila**.

## Domů (Home)

- **Další směna** + simulace **Clock in / out**: stav `shiftAttendanceStatus` (`off_site` | `on_shift` | `paused` | `ended`), tlačítko „Jsem na místě“, automatický sheet pro Clock in při příchodu, Clock-out s volbou přerušení vs. ukončení směny.
- **Vyžaduje pozornost** — odvozeno z `DEMO_PROFILES[*].updates` (urgentní / fallback); stejný obsah jako **Hromadná sdělení** ve Zprávách. U položek se zobrazuje demo **časové razítko** (`postedAt`).
- **TO DO** — checklist z `pendingActions` (`todoItems`), vizuálně odlišná karta `home-todo-card`; u recepce navíc úkoly o záchodu 327 a výtahu.
- **Guest Satisfaction Score (GSS)** — karta mezi TO DO a nejbližšími směnami (`gss-card`), mock skóre 0–5 (`score`) proti cíli (`target`), indikace „cíl splněn / těsně pod cílem“ a personalizovaná hostovská pochvala podle aktivního demo profilu.
- **Nejbližší směny** + sheet detailu směny.

## Zprávy

- Panely Rychlé zprávy / E-maily / Hromadná sdělení.
- **Hromadná sdělení** — stejný feed jako **Vyžaduje pozornost** na Domů; krátký textový hint pod nadpisem to vysvětluje. U každého sdělení je zvlášť **Potvrdit přečtení**; stav drží množina `readAnnouncementIds` (klíče `id` u položek v `updates`). Reset při `switchDemoProfile`. Časové razítko jako na Domů (`postedAt`).

## Více (More)

- **Další systémy** — Vema, LutherONE, BI a DWH Orea (`EXTERNAL_SYSTEMS`, fiktivní URL `https://intranet.orea.cz/...`). Před `window.open` proběhne **simulovaná biometrie** (společný sheet s dokumenty).
- **Dokumenty** — Pracovní smlouva + **Roční hodnocení za 2025**; obojí jen **Stáhnout**; před akcí stejný biometric sheet jako u systémů. Výplatní pásky z této karty jsou pryč (zůstávají v profilu z avataru).
- **Orea Knowledge** — nový AI chatbot mock (`knowledge-card`) s polem pro dotaz a tlačítkem „Zeptat se“. Po odeslání se v demu zobrazí statická odpověď „Orea je nejlepší hotelový řetězec v Česku.“. Layout je připravený pro budoucí rozšíření na plný chat/RAG.
- **Rozvoj a feedback** — karta se zaměstnaneckou spokojeností (NPS) (`nps-card`), škála 0–10, jedno kliknutí = odeslání v demu; stav `npsScore`, `npsSubmitted`; reset při `switchDemoProfile`.
- Dovolená, Pomoc.

## Hlavička a profil (avatar)

- Vpravo nahoře **avatar** (iniciály) otevírá **samostatnou obrazovku profilu** (`showProfileScreen`).
- Profil: osobní údaje, e-mail (odvozený), HR kontakt; sekce **Výplatní pásky**, **Kurzy** (statusy), **Pozice v Orea** s proklikem do detailu pozice (`selectedPositionId`, data v `PROFILE_DETAILS`).
- Šipka **Zpět** na profilu i v detailu pozice.

## 2FA / biometrie (demo)

- Stav `showBiometricGate` + `pendingBiometricAction`:
  - `{ kind: 'external', system }` → po potvrzení `window.open(system.url)`.
  - `{ kind: 'document', label }` → po potvrzení `setDocumentStatus('Staženo: …')`.
- Reset při `switchDemoProfile`.

## Důležité konstanty v App.jsx

- `DEMO_PROFILES` — profily recepce / housekeeping (směny, úkoly, `updates` s `id` / `postedAt`, `gss`, alert).
- `PROFILE_DETAILS` — payrolls, courses, positions per profil.
- `EXTERNAL_SYSTEMS` — externí systémy pro Více.

## Co záměrně není

- Žádné reálné API, SSO, WebAuthn, push notifikace ani synchronizace s LutherONE.
- Desktop „požadavek do mobilní aplikace“ je jen textově popsán u externích systémů a u dokumentů.

## Rychlá kontrola po úpravách

- `npm run build` v kořeni projektu.

---
*Vygenerováno jako stavový handoff; při větších změnách aktualizujte tento soubor nebo APP_CURRENT_STATE.md podle potřeby.*
