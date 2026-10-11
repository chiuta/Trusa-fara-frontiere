# Trusa fără frontiere

Trusă de 15 unelte mici într-un singur fișier HTML: regex, JSON, diff, hash, parole, subnet, notițe, foaie de calcul, Kanban și altele. Rulează local în browser, fără cont.

**Live:** https://chiuta.github.io/Trusa-fara-frontiere/

Ultima actualizare: 11 octombrie 2026

![Captura de ecran](screenshot.png)

## Ce este

Un set de module mici, scrise de la zero, inspirate de funcționalitatea de bază a unor categorii de aplicații din catalogul YunoHost (dev, birou, utilitare, instrumente de sistem, productivitate, lectură). Nu este o reconstrucție a acelor aplicații și nu este afiliat YunoHost; aplicațiile care depind de server (chat, sincronizare, social) nu au echivalent într-un fișier local.

## Funcții

Verificate în cod și testate în Chromium headless:
- **Regex Lab**: potriviri evidențiate, grupuri, steaguri g/i/m/s; rulează într-un Worker cu limită de 1,5 s, ca un pattern cu backtracking catastrofal să nu blocheze pagina.
- **JSON Lab**: validare, formatare (2/4 spații/tab), minificare, sortare recursivă a cheilor.
- **Diff Viewer**: diferență pe linii (LCS), cu limită de dimensiune.
- **Hash & Encoding Lab**: SHA-1/256/384/512 (Web Crypto), Base64 (UTF-8), URL-encode, hex.
- **Inspector de fișiere**: metadate, previzualizare imagine, statistici text, SHA-256, totul local.
- **Generator parole**: parolă pe caractere și pasfrază din 150 de cuvinte, cu `crypto.getRandomValues` (fără rezervă pe `Math.random`) și estimare de entropie.
- **Calculator subnet** IPv4/CIDR, **Convertor de unități** (lungime, masă, volum, date, temperatură).
- **Notebook Markdown** (subset: titluri, liste cu buline și numerotate, citate, linie orizontală, tabele cu `|`, cod, link-uri http/https/mailto; „Export .md” descarcă nota selectată), **Mini foaie de calcul** (8×20, SUM/AVG/MIN/MAX/COUNT; „Export CSV” cu valorile calculate și „Import CSV” cu separator virgulă, punct și virgulă sau tab), **Hartă mentală** (mouse, atingere, tastatură), **Panou Kanban**, **Jurnal financiar**, **Vault de fragmente**.
- **Cititor RSS/Atom** pentru fișiere XML încărcate sau lipite (nu descarcă feed-uri).
- Export/import JSON al tuturor datelor locale; temă zi/noapte.

## Manual de utilizare

1. Alege un modul din meniul din stânga (pe telefon, butonul ☰).
2. Introdu datele în câmpurile modulului; rezultatele se actualizează imediat (la Diff și Parole apeși butonul).
3. Notițele, foaia, harta, Kanban-ul, jurnalul și fragmentele se salvează automat în browser.
4. Pentru copie de rezervă apasă „export date” (descarcă un fișier JSON); „import date” îl reîncarcă și înlocuiește datele modulelor găsite în fișier, după confirmare.
5. „despre & surse” explică proiectul și limitele lui.

## Confidențialitate și rețea

- Aplicația nu face cereri de rețea: CSP din pagină are `connect-src 'none'` și `script-src` pe hash SHA-256 (fără `'unsafe-inline'`), fără scripturi, fonturi sau imagini externe. Nu există telemetrie, cont sau cookie-uri.
- Stocare: `localStorage`, chei cu prefix `tff:` (`notebook`, `spreadsheet`, `mindmap`, `kanban`, `ledger`, `paste`), **necriptat**. Dacă stocarea e blocată (mod privat), aplicația merge, dar afișează un avertisment că datele nu se păstrează.
- Gazde externe: niciuna, în afara linkului către github.com/YunoHost/apps din dialogul „despre” (se deschide doar dacă îl apeși, cu `noopener noreferrer`) și a link-urilor din notițe/feed-uri pe care le apeși tu.
- Permisiuni de browser: niciuna. Fișierele alese rămân în browser. Se folosesc Worker din Blob (Regex Lab) și clipboard (butoanele „Copiază”).

## Limite și avertismente

- Datele din `localStorage` se pierd dacă ștergi datele site-ului sau schimbi browserul/dispozitivul; fă export periodic. Două file deschise simultan se pot suprascrie reciproc.
- Nu păstra parole, chei sau date sensibile în Notebook, foaie sau Vault: sunt stocate în clar în browser.
- Parolele sunt generate local, dar nu garantează prezența fiecărui tip de caractere. Pasfraza folosește o listă mică (150 de cuvinte, ≈7,2 biți/cuvânt): folosește 10–12 cuvinte pentru ceva important. Hash-urile SHA rapide nu sunt potrivite pentru stocarea parolelor; SHA-1 este depășit.
- Foaia de calcul și Markdown sunt subseturi simple, nu înlocuiesc programe complete. Jurnalul financiar este evidență personală simplă, nu software contabil, și nu specifică moneda.
- Numerele întregi peste 2^53 își pierd precizia în JSON Lab (limită JavaScript). Diff-ul refuză texte foarte mari.
- Hărțile și modulele au fost testate în Chromium; alte browsere nu au fost testate.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; nu are dependențe. Pentru server local: `python3 -m http.server`.

## Istoric / Changelog

### 11.10.2026 (a doua actualizare) — 11 octombrie 2026
- Securitate: `script-src` în CSP folosește hash SHA-256 în loc de `'unsafe-inline'`.
- Notebook: tabele Markdown, liste numerotate, linie orizontală și „Export .md”. Foaie de calcul: „Export CSV” (cu protecție împotriva formulelor în alte programe: valorile text care încep cu `=`, `+`, `-`, `@` primesc un apostrof) și „Import CSV” (max. 8 coloane × 20 rânduri, cu confirmare).
- Stil de tipărire: se tipărește doar modulul curent, pe fundal alb.

### 11.10.2026 — 11 octombrie 2026
- Verificare de rutină la 11.10.2026: axe fără încălcări la 1280 și 360 px, fără erori de consolă; fără modificări de cod.

## Licență

Licența nu este încă declarată.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf. Construit cu Claude (Anthropic) la cererea autorului.

## English summary

Trusa fără frontiere ("Toolkit without borders") is a single-file, Romanian-language toolkit of 15 small offline tools: regex tester (Worker with timeout), JSON, diff, hash/encoding, file inspector, CSPRNG password and passphrase generator, subnet calculator, unit converter, Markdown notebook, mini spreadsheet, mind map, Kanban, ledger, snippet vault and an RSS/Atom file reader. No network requests (CSP `connect-src 'none'`), no telemetry; data stays unencrypted in `localStorage` with JSON export/import. No licence is declared yet.
