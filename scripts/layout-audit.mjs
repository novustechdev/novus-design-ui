#!/usr/bin/env node
/* Novus Design Kit: automated layout audit (constitution 1.11.0, Quality Gate 11).
   Renders the built docs site and hosted Admin Kit demos in headless Chromium at
   1440px and 375px and fails when
     WRAP      short content (40 characters or fewer, or any table cell not marked
               .cell--wrap) renders on more than one line, or
     OVERFLOW  a page scrolls horizontally at 375px.
   Scope: .demo__canvas on docs pages, the whole document on demos; each page is
   audited closed, then with its dismissable menus, sheets, and drawer open.
   Skipped: paragraphs, headings, prose lists, pre, .cell--wrap, [data-audit="skip"].
   Usage: node scripts/layout-audit.mjs [--only <substring>]
   Env:   CHROME_PATH (Chromium executable), CI=true (missing tooling fails).
   Exit:  0 clean, 1 findings or CI tooling failure, 2 skipped locally. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "site/dist");
const CI = process.env.CI === "true";
const ONLY = (() => { const i = process.argv.indexOf("--only"); return i > 0 ? process.argv[i + 1] : ""; })();

const bail = (msg) => { console.log(`${CI ? "FAIL" : "SKIP"}  layout audit: ${msg}`); process.exit(CI ? 1 : 2); };

let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { bail("playwright-core not installed (npm install --no-save --no-package-lock playwright-core@1.55.0)"); }
if (!existsSync(DIST)) bail("site/dist missing (run node site/build.mjs)");

/* ---- static server with the Blazor demo's SPA fallback ---- */
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".wasm": "application/wasm",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ico": "image/x-icon",
  ".dat": "application/octet-stream", ".dll": "application/octet-stream", ".pdb": "application/octet-stream",
};
const server = createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = normalize(join(DIST, url));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && url.startsWith("/demos/blazor/")) file = join(DIST, "demos/blazor/index.html");
  if (!existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

/* ---- page list ---- */
const list = (dir) => existsSync(join(DIST, dir)) ? readdirSync(join(DIST, dir)).filter((f) => f.endsWith(".html")).sort() : [];
const pages = [];
for (const f of list("components")) if (f !== "index.html") pages.push({ path: `components/${f}`, kind: "docs" });
for (const f of list("foundations")) pages.push({ path: `foundations/${f}`, kind: "docs" });
if (existsSync(join(DIST, "admin-kit.html"))) pages.push({ path: "admin-kit.html", kind: "docs" });
for (const flavor of ["tailwind", "material"]) for (const f of list(`demos/${flavor}`)) pages.push({ path: `demos/${flavor}/${f}`, kind: "demo" });
if (existsSync(join(DIST, "demos/blazor/index.html")))
  for (const r of ["", "login", "signed-out", "analytics", "transactions", "datagrid", "terminals", "settings"])
    pages.push({ path: `demos/blazor/${r}`, kind: "blazor" });
const todo = pages.filter((p) => !ONLY || p.path.includes(ONLY));

/* ---- browser ---- */
function localChromium() {
  const cache = join(homedir(), ".cache/ms-playwright");
  if (!existsSync(cache)) return undefined;
  for (const d of readdirSync(cache).filter((x) => /^chromium-\d+$/.test(x)).sort().reverse()) {
    const exe = join(cache, d, "chrome-linux64/chrome");
    if (existsSync(exe)) return exe;
  }
  return undefined;
}
let browser;
try {
  const exe = process.env.CHROME_PATH || (CI ? undefined : localChromium());
  browser = await chromium.launch(exe ? { executablePath: exe } : { channel: "chrome" });
} catch (e) { server.close(); bail(`no Chromium available (${e.message.split("\n")[0]})`); }

/* ---- in-page audit ---- */
function audit({ scopes, kind }) {
  const SKIP = "p, h1, h2, h3, h4, h5, h6, pre, figcaption, blockquote, .bullets, .cell--wrap, [data-audit='skip'], script, style, svg, textarea, option";
  const roots = scopes.flatMap((s) => [...document.querySelectorAll(s)]);
  const found = new Map();
  const describe = (el) => {
    const bit = (n) => n.tagName.toLowerCase() + [...n.classList].slice(0, 2).map((c) => "." + c).join("");
    return el.parentElement ? `${bit(el.parentElement)} > ${bit(el)}` : bit(el);
  };
  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (!text) continue;
      const el = node.parentElement;
      if (!el || el.closest(SKIP)) continue;
      const cell = el.closest("td, th");
      const unit = cell || el;
      const full = unit.textContent.replace(/\s+/g, " ").trim();
      if (!cell && full.length > 40) continue;
      const box = el.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const tops = [];
      for (const r of range.getClientRects()) {
        if (r.width < 1) continue;
        const mid = r.top + r.height / 2;
        if (!tops.some((t) => Math.abs(t - mid) < r.height * 0.5)) tops.push(mid);
      }
      if (tops.length > 1 && !found.has(unit)) found.set(unit, { sel: describe(unit), text: full.slice(0, 60), lines: tops.length });
    }
  }
  return {
    wraps: [...found.values()],
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  };
}

const findings = [];
const widths = [[1440, 900], [375, 812]];
async function run(ctx, width, p) {
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}/${p.path}`, { waitUntil: "load", timeout: 90000 });
    if (p.kind === "blazor") await page.waitForSelector(".adminwrap, .authpage, .signedout", { timeout: 90000 });
    if (p.path.includes("demos/material")) await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(p.kind === "blazor" ? 600 : 150);
    const scopes = p.kind === "docs" ? [".demo__canvas"] : ["body"];
    const closed = await page.evaluate(audit, { scopes, kind: p.kind });
    if (width === 375 && closed.scrollWidth > closed.innerWidth + 1)
      findings.push(`OVERFLOW 375 ${p.path || "/"} scrollWidth=${closed.scrollWidth}`);
    /* second pass: open dismissable menus and sheets, and at phone width the drawer */
    const opened = await page.evaluate((w) => {
      let n = 0;
      document.querySelectorAll("details[data-dismiss]").forEach((d) => { d.setAttribute("open", ""); n++; });
      const t = document.getElementById("navtoggle");
      if (t && w < 900) { t.checked = true; n++; }
      return n;
    }, width);
    let open = { wraps: [] };
    if (opened) {
      await page.waitForTimeout(260);
      const openScopes = p.kind === "docs" ? [".demo__canvas details[data-dismiss]"] : ["details[data-dismiss]", ".adminnav"];
      open = await page.evaluate(audit, { scopes: openScopes, kind: p.kind });
    }
    const seen = new Set();
    for (const w of [...closed.wraps, ...open.wraps]) {
      const key = w.sel + w.text;
      if (seen.has(key)) continue;
      seen.add(key);
      findings.push(`WRAP ${width} ${p.path || "/"} ${w.sel} "${w.text}" lines=${w.lines}`);
    }
  } catch (e) {
    findings.push(`ERROR ${width} ${p.path}: ${e.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

for (const [w, h] of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const queue = [...todo];
  await Promise.all(Array.from({ length: 4 }, async () => { for (let p = queue.shift(); p; p = queue.shift()) await run(ctx, w, p); }));
  await ctx.close();
}
await browser.close();
server.close();

for (const f of findings) console.log(f);
console.log(`layout audit: ${todo.length} pages x ${widths.length} widths, ${findings.length} finding(s)`);
process.exit(findings.length ? 1 : 0);
