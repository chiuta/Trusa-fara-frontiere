// 2.1.0: lista celor 16 module din dialogul „despre” în fiecare limbă (fr/it/es/pt/de/hu: traducere automată) folosește exact numele din meniul limbii respective.
import {launch, check, summary} from "./_lib.mjs";
const {browser, page, st} = await launch({w: 1280, h: 800});
await page.waitForTimeout(600);
const sel = await page.evaluate(() => { const s = document.getElementById("lang") || document.querySelector("select[id*=lang]"); return s ? s.id : null; });
check("selectorul de limbă există", !!sel, sel);
const texts = {};
for (const l of ["ro", "en", "fr", "it", "es", "pt", "de", "hu"]) {
  await page.selectOption("#" + sel, l); await page.waitForTimeout(200);
  const menu = (await page.locator("#sidebar .mod-btn").allTextContents()).map(s => s.replace(/^[^\p{L}\p{N}]+/u, "").trim());
  const p = await page.evaluate(() => document.querySelector('[data-t="about.p3b"]').textContent);
  texts[l] = p;
  check(l + ": 16 module în meniu și în text", menu.length === 16 && /16/.test(p), {n: menu.length, p: p.slice(0, 40)});
  if (l === "en") continue; /* textul EN existent folosește litere mici/„Ledger”; nu face parte din această modificare */
  const missing = menu.filter(n => !p.includes(n));
  check(l + ": toate cele 16 nume din meniu apar în text", missing.length === 0, missing);
}
for (const l of ["fr", "it", "es", "pt", "de", "hu"]) check(l + ": textul diferă de engleză", texts[l] !== texts.en);
check("nicio cerere de rețea", st.net.length === 0, st.net);
check("fără erori", st.errs.length === 0, st.errs);
await browser.close(); summary();
