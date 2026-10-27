# Jurnal de modificări

## 2.1.0 — 2026-10-27

### Adăugat
- **Lista celor 16 module din dialogul „Ce e asta, mai exact” tradusă în fr, it, es, pt, de, hu** (traducere automată, neverificată de vorbitori nativi; înainte textul era în engleză). Numele modulelor sunt exact cele din meniul fiecărei limbi.
- Test nou `tests/modules-list-i18n.test.mjs` (24 de verificări): în fiecare limbă, textul numără 16 module, toate cele 16 nume din meniul limbii apar în text, textul diferă de engleză, 0 cereri de rețea.

### Neimplementat
- README-urile traduse (FR, IT, ES, PT, DE, HU): doar linia de versiune.
- Textul englez existent folosește „Ledger” pentru „Financial Ledger” din meniu; neschimbat (nu face parte din această modificare).

## 2.0.1 — 2026-10-27

Recenzie 2026-10-27. Doar text.

### Adăugat
- Lista celor 16 module, citită din cod, în dialogul „Ce e asta, mai exact” (RO complet; celelalte 7 limbi folosesc textul în engleză) și în README (EN, RO), cu categoria fiecăruia. Recenzia pomenea 15 module; codul înregistrează 16 (Lanțuri de transformări a apărut în 2.0.0).
- Linii „Stare” și „Offline” în README și metadate.
- `tests/modules-list.test.mjs`: lista din text coincide cu modulele din meniu.

### Neschimbat
- Nimic șters; fără dependențe noi; `connect-src 'none'` neschimbat. Hash-urile CSP recalculate.

Istoricul anterior (până la 2.0.0, 2026-10-26) este în secțiunea „Istoric / Changelog” din README.md.
