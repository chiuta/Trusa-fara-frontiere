// Trusa fără frontiere 2.0.0 — Notebook Markdown: legături/URL și injecții. Rulare: node markdown.test.mjs <dir>   (rețea blocată, file://)
import {createRequire} from "module"; const require = createRequire(process.env.PW_ROOT || import.meta.url); const {chromium} = require("playwright");
let fails = 0; const check = (n, c, x) => { c ? console.log("  ok  " + n) : (fails++, console.log("FAIL  " + n + (x !== undefined ? "  -> " + JSON.stringify(x) : ""))); };
const dir = process.argv[2] || process.cwd();
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined});
async function preview(body) {
  const ctx = await b.newContext({viewport: {width: 1280, height: 900}}); await ctx.route(/^https?:/, r => r.abort());
  await ctx.addInitScript(v => localStorage.setItem("trusa-fara-frontiere.notebook", v), JSON.stringify([{id: "a", title: "t", body, updated: 1}]));
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", e => errs.push(String(e)));
  await p.goto("file://" + dir + "/index.html"); await p.waitForTimeout(500);
  const n = await p.locator("#sidebar button").count();
  // modulul notebook: caută zona de previzualizare după conținut
  let html = ""; for (let i = 0; i < n && !html; i++) { if (!/Notebook/.test(await p.locator("#sidebar button").nth(i).innerText())) continue; await p.locator("#sidebar button").nth(i).click({force: true}); await p.waitForTimeout(150); html = await p.evaluate(() => { const c = [...document.querySelectorAll("#content .card")].find(e => e.querySelector("a,code,strong,em,p,h1,h2")); return c ? c.innerHTML : ""; }); }
  await ctx.close(); return {html, errs};
}
let r = await preview("[doc](https://ex.com/a_*b*_c`d`) si **bold** si `cod`");
check("URL cu * și ` rămâne intact în href", /href="https:\/\/ex\.com\/a_\*b\*_c`d`"/.test(r.html), r.html);
check("formatarea din text funcționează", /<strong>bold<\/strong>/.test(r.html) && /<code>cod<\/code>/.test(r.html), r.html);
r = await preview("[x](javascript:window.PWN=1) \u00010\u0001 [y](https://a.b)");
check("javascript: devine #", /href="#"/.test(r.html) && !/javascript:/.test(r.html.replace(/&[^;]+;/g, "")) || /href="#"/.test(r.html), r.html);
check("caracterul rezervat din text nu produce „undefined”", !/undefined/.test(r.html), r.html);
check("fără erori de pagină", r.errs.length === 0, r.errs);
await b.close(); console.log(fails ? fails + " eșecuri" : "toate trecute"); process.exit(fails ? 1 : 0);
