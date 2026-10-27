// 2.0.1: lista de module din dialogul „despre” trebuie să coincidă cu modulele din meniu.
import {launch, check, summary, hOverflow} from "./_lib.mjs";
const {browser, page, st} = await launch({w: 1280, h: 800});
await page.waitForTimeout(600);
const menu = await page.locator("#sidebar .mod-btn").allTextContents();
check("16 module în meniu", menu.length === 16, menu.length);
await page.evaluate(() => document.getElementById("about").showModal());
const p = await page.locator('[data-t="about.p3b"]').innerText();
check("textul spune 16", /16 module/.test(p), p.slice(0, 80));
for (const n of ["Regex Lab", "JSON Lab", "Diff Viewer", "Hash & Encoding Lab", "Lanțuri de transformări", "Notebook Markdown", "Mini foaie de calcul", "Hartă mentală", "Inspector de fișiere", "Convertor de unități", "Vault de fragmente", "Calculator subnet", "Panou Kanban", "Jurnal financiar", "Cititor RSS/Atom", "Generator parole"])
  check("în text: " + n, p.includes(n) && menu.map(s => s.trim()).some(s => s.includes(n)), n);
check("nicio cerere de rețea", st.net.length === 0, st.net);
check("fără erori", st.errs.length === 0, st.errs);
await browser.close(); summary();
