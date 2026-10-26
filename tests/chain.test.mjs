// Teste v2.0.0: Lanțuri de transformări (module „chain”). Rulează: node tests/chain.test.mjs
import {launch, check, summary, hOverflow, AXE} from "./_lib.mjs";
import fs from "fs";
const {browser, page, st} = await launch();
await page.addInitScript({content: AXE});
await page.reload(); await page.waitForTimeout(500);
await page.getByRole("button", {name: /Lanțuri de transformări/}).click(); await page.waitForTimeout(300);
const out = async () => { await page.waitForTimeout(450); return page.locator("[data-chain-out]").innerText(); };
const inp = page.locator("textarea").first();
const addStep = async (id) => { await page.locator("select").last().selectOption(id); await page.locator("[data-act=add]").click(); };
const clearSteps = async () => { while (await page.locator("[data-step]").count()) await page.locator("[data-step] [data-act=del]").first().click(); };

// implicit: trim + Base64
check("modul prezent și lanț implicit cu 2 pași", await page.locator("[data-step]").count() === 2);
check("trim + base64 implicit", (await out()) === "VHJ1c2EgZsSDcsSDIGZyb250aWVyZQ==", await out());
// Base64 round trip, URL, hex, html
await clearSteps();
await inp.fill("Șișcă & <ok> \"x\" 100%");
for (const id of ["b64e", "b64d"]) await addStep(id);
check("Base64 codare+decodare = identitate (UTF-8)", (await out()) === "Șișcă & <ok> \"x\" 100%", await out());
await clearSteps(); for (const id of ["urle", "urld"]) await addStep(id);
check("URL codare+decodare = identitate", (await out()) === "Șișcă & <ok> \"x\" 100%");
await clearSteps(); for (const id of ["hexe", "hexd"]) await addStep(id);
check("Hex codare+decodare = identitate", (await out()) === "Șișcă & <ok> \"x\" 100%");
await clearSteps(); await addStep("htmle");
check("HTML escapare", (await out()) === "Șișcă &amp; &lt;ok&gt; &quot;x&quot; 100%", await out());
await addStep("htmld");
check("HTML anulare escapare = identitate", (await out()) === "Șișcă & <ok> \"x\" 100%");
// SHA-256 cunoscut
await clearSteps(); await inp.fill("abc"); await addStep("sha");
check("SHA-256('abc') corect", (await out()) === "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", await out());
await page.locator("[data-step=sha] select").selectOption("SHA-1");
check("SHA-1('abc') corect", (await out()) === "a9993e364706816aba3e25717850c26c9cd0d89d", await out());
// JSON
await clearSteps(); await inp.fill('{"a": [1, 2],\n "b": {"c": null}}'); await addStep("jsonm");
check("JSON compactare", (await out()) === '{"a":[1,2],"b":{"c":null}}');
await addStep("jsonp");
check("JSON formatare", (await out()) === '{\n  "a": [\n    1,\n    2\n  ],\n  "b": {\n    "c": null\n  }\n}');
// linii: sort/uniq/noempty/trim
await clearSteps(); await inp.fill(" b \n\na\n b\n10\n9\na");
for (const id of ["trim", "noempty", "uniq", "sort"]) await addStep(id);
await page.locator("[data-step=trim] input[type=checkbox]").check();
check("curățare listă (trim, goale, duplicate, sortare)", (await out()) === "10\n9\na\nb", await out());
await page.locator("[data-step=sort] input").nth(1).check();
check("sortare numerică (nenumericele la sfârșit)", (await out()) === "9\n10\na\nb", await out());
await page.locator("[data-step=sort] input").nth(0).check();
check("sortare numerică descrescătoare", (await out()) === "b\na\n10\n9", await out());
// reorder
await clearSteps(); await inp.fill("Hello"); await addStep("upper"); await addStep("b64e");
let o1 = await out();
await page.locator("[data-step=b64e] [data-act=up]").click();
check("mutarea pașilor schimbă rezultatul", o1 === "SEVMTE8=" && (await out()) === "SGVSBG8=", [o1, await out()]);
// replace (literal + regex), extract, affix, slug
await clearSteps(); await inp.fill("a.b.c a.b"); await addStep("replace");
let fs_ = page.locator("[data-step=replace] input[type=text]");
await fs_.nth(0).fill("."); await fs_.nth(1).fill("-");
check("înlocuire literală ('.' nu e regex)", (await out()) === "a-b-c a-b", await out());
await page.locator("[data-step=replace] input[type=checkbox]").nth(0).check();
check("înlocuire cu regex ('.' = orice)", (await out()) === "---------", await out());
await clearSteps(); await inp.fill("x1 y22 z333"); await addStep("extract");
await page.locator("[data-step=extract] input[type=text]").fill("\\d+");
check("extragere potriviri regex", (await out()) === "1\n22\n333");
await page.locator("[data-step=extract] input[type=text]").fill("(");
await page.waitForTimeout(400);
check("regex invalid: eroare afișată, fără excepție", /Pasul 1 a eșuat/.test(await page.locator("[role=status]").first().innerText()));
await clearSteps(); await inp.fill("Ana\nBob"); await addStep("affix");
await page.locator("[data-step=affix] input[type=text]").nth(0).fill("<li>"); await page.locator("[data-step=affix] input[type=text]").nth(1).fill("</li>");
check("prefix și sufix pe linii", (await out()) === "<li>Ana</li>\n<li>Bob</li>");
await clearSteps(); await inp.fill("  Școală de Vară — 2026!  "); await addStep("slug");
check("slug cu diacritice", (await out()) === "scoala-de-vara-2026", await out());

// erori și pas care eșuează
await clearSteps(); await inp.fill("nu e json"); await addStep("jsonp");
await page.waitForTimeout(400);
check("eroare de pas afișată (JSON invalid)", /Pasul 1 a eșuat/.test(await page.locator("[role=status]").first().innerText()) && (await out()) === "");
await clearSteps(); await inp.fill("%%%"); await addStep("b64d"); await page.waitForTimeout(400);
check("Base64 invalid raportat", /Pasul 1 a eșuat/.test(await page.locator("[role=status]").first().innerText()));

// lot
await clearSteps(); await inp.fill("Primul Titlu\n\nAl Doilea!"); await addStep("slug");
await page.getByLabel("Lot: aplică lanțul separat pe fiecare linie").check();
check("lot: fiecare linie prin lanț, liniile goale păstrate", (await out()) === "primul-titlu\n\nal-doilea", await out());
await clearSteps(); await addStep("sha"); await inp.fill("abc\nabc");
const h = (await out()).split("\n"); check("lot cu pas asincron (SHA) pe fiecare linie", h.length === 2 && h[0] === h[1] && h[0].length === 64, h);
await page.getByLabel("Lot: aplică lanțul separat pe fiecare linie").uncheck();

// salvare, șabloane, export/import
await clearSteps(); await inp.fill("  Salut  "); await addStep("trim"); await addStep("upper");
await page.getByLabel("Nume lanț").fill("Curat și mare");
await page.locator("[data-act=save]").click(); await page.waitForTimeout(150);
let stg = await page.evaluate(() => JSON.parse(localStorage.getItem("trusa-fara-frontiere.chains")));
check("lanț salvat în localStorage (prefix aplicației)", stg.length === 1 && stg[0].name === "Curat și mare" && stg[0].steps.map(s => s.t).join() === "trim,upper", stg);
await clearSteps(); await page.locator("[data-saved] button").first().click(); await page.waitForTimeout(500);
check("încărcarea lanțului salvat reface pașii", await page.locator("[data-step]").count() === 2 && (await out()) === "SALUT");
await page.locator("[data-preset='0']").click(); await page.waitForTimeout(400);
check("șablon încărcat (Curățare listă: 4 pași)", await page.locator("[data-step]").count() === 4);
await page.locator("[data-act=jcopy]").click();
const exported = await page.locator("textarea").last().inputValue();
const ej = JSON.parse(exported); check("export lanț JSON valid", ej.trusaChain === 1 && ej.steps.length === 4);
await clearSteps();
await page.locator("textarea").last().fill(exported); await page.locator("[data-act=jimp]").click(); await page.waitForTimeout(300);
check("import lanț restabilește pașii", await page.locator("[data-step]").count() === 4);
await page.locator("textarea").last().fill('{"trusaChain":1,"steps":[{"t":"__proto__","p":{}}]}'); await page.locator("[data-act=jimp]").click();
check("import respinge pași necunoscuți", /Lanț invalid/.test(await page.locator("[role=status]").last().innerText()) && await page.locator("[data-step]").count() === 4);
// ștergere
await page.locator("[data-saved] button.danger").click(); await page.waitForTimeout(100);
check("lanț salvat șters", (await page.evaluate(() => JSON.parse(localStorage.getItem("trusa-fara-frontiere.chains")))).length === 0);
// exportul general include cheia chains
await page.evaluate(() => localStorage.setItem("trusa-fara-frontiere.chains", JSON.stringify([{id:"z", name:"z", steps:[{t:"upper", p:{}}]}])));
const dl = page.waitForEvent("download"); await page.click("#export-btn");
const J = JSON.parse(fs.readFileSync(await (await dl).path(), "utf8"));
check("export general conține lanțurile", Array.isArray(J.data.chains) && J.data.chains[0].id === "z", Object.keys(J.data));

// limbi
await page.selectOption("#lang-sel", "en"); await page.waitForTimeout(300);
check("EN: nume modul tradus", await page.getByRole("button", {name: /Transformation chains/}).count() === 1);
for (const l of ["fr", "it", "es", "pt", "de", "hu"]) { await page.selectOption("#lang-sel", l); await page.waitForTimeout(150); check(`${l}: titlu modul tradus`, !/Lanțuri de transformări/.test(await page.locator("h1").innerText())); }
await page.selectOption("#lang-sel", "ro"); await page.waitForTimeout(200);
// a11y, layout
const ax = await page.evaluate(async () => (await axe.run(document, {resultTypes: ["violations"]})).violations.map(v => v.id + ":" + v.nodes.map(n => n.target).join("|").slice(0, 120)));
check("axe fără încălcări", ax.length === 0, ax);
await page.setViewportSize({width: 375, height: 700}); await page.waitForTimeout(200);
check("fără depășire orizontală pe mobil", (await hOverflow(page)) <= 0);
check("fără erori JS/CSP", st.errs.length === 0 && (await page.evaluate(() => window.__csp.length)) === 0, [st.errs, await page.evaluate(() => window.__csp)]);
check("0 cereri de rețea", st.net.length === 0, st.net);
await browser.close(); summary();
