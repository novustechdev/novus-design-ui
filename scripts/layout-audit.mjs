#!/usr/bin/env node
/* Novus Design Kit: automated layout audit (constitution 1.11.0, Quality Gate 11).
   Renders the built docs site and hosted Admin Kit demos in headless Chromium at
   1440px and 375px and fails when
     WRAP      short content (40 characters or fewer, or any table cell not marked
               .cell--wrap) renders on more than one line,
     OVERFLOW  a page scrolls horizontally at 375px,
     HEADER    something sits to the right of the account menu (gate 12),
     TYPE      header, navigation and body sizes diverge, or a heading breaks its
               ratio to body text (gate 13), or
     WIDTH     a text block wraps while a quarter of its row stays unused (gate 14),
     RAIL      a collapsed side navigation shows no icons, or still shows labels
               (gate 16), or
     GROUND    a sign-in page is not on the near-white ground (gate 17).
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
/* Every root page, not just the Admin Kit one: the landing, install and agent
   guidance pages were never audited before, so a regression there was invisible. */
for (const f of readdirSync(DIST).filter((x) => x.endsWith(".html")).sort()) pages.push({ path: f, kind: "docs" });
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
  const shellExtra = [];
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
  /* Gate 14: text that wraps while the space beside it goes unused. */
  const widths = [];
  for (const root of roots) {
    for (const el of root.querySelectorAll("p, .pagehead__desc, .setting__desc, figcaption, .muted")) {
      if (el.closest(".measure, .bullets, [data-audit='skip'], pre, table")) continue;
      const text = el.textContent.replace(/\s+/g, " ").trim();
      if (text.length < 60) continue;
      const box = el.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) continue;
      const style = getComputedStyle(el);
      const lines = Math.round(box.height / (parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4));
      if (lines < 3) continue;
      const parent = el.parentElement;
      if (!parent) continue;
      const pStyle = getComputedStyle(parent);
      const pBox = parent.getBoundingClientRect();
      const avail = pBox.width - parseFloat(pStyle.paddingLeft) - parseFloat(pStyle.paddingRight);
      const unused = avail - box.width;
      if (unused / avail < 0.25) continue;
      /* only a finding when nothing occupies the space beside it */
      const beside = [...parent.children].some((sib) => {
        if (sib === el) return false;
        const r = sib.getBoundingClientRect();
        return r.width > 8 && r.left >= box.right - 1 && r.top < box.bottom && r.bottom > box.top;
      });
      if (!beside) widths.push({ sel: describe(el), text: text.slice(0, 60), lines, unused: Math.round((unused / avail) * 100) });
    }
  }

  /* Gate 17: authentication sits on the near-white ground (feature 009). */
  const auth = document.querySelector(".authpage");
  if (auth && document.documentElement.getAttribute("data-theme") !== "dark") {
    const bg = getComputedStyle(auth).backgroundColor;
    const rgb = (bg.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
    if (rgb.length === 3) {
      const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
      if (lum < 0.95) shellExtra.push({ kind: "GROUND", detail: `sign-in ground ${bg} is ${(lum * 100).toFixed(0)}% of white (needs 95%)` });
    }
  }

  /* Gates 12 and 13: console header order and typographic parity. These judge a
     real console shell, not a header example sitting inside documentation prose. */
  const console_ = document.querySelector(".adminwrap");
  /* Gate 16: a collapsed navigation is a rail of icons, never nothing. */
  const toggle = document.getElementById("navtoggle");
  if (console_ && toggle && toggle.checked && window.innerWidth >= 900) {
    const nav = console_.querySelector(".adminnav");
    const visible = nav && nav.getBoundingClientRect().width > 8;
    const all = nav ? [...nav.querySelectorAll(".navlink")] : [];
    /* Judged by what actually paints, not by what measures: a closed details group
       still reports a box for its children while the browser never renders them, so
       a box check would call a hidden destination present. Rows below the fold are
       left unjudged rather than blamed. */
    const paints = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return false;
      const cy = r.y + r.height / 2;
      if (cy < 0 || cy > window.innerHeight - 1) return true;
      const hit = document.elementFromPoint(Math.round(r.x + r.width / 2), Math.round(cy));
      return !!hit && (hit === el || el.contains(hit));
    };
    const painted = all.filter(paints);
    const icons = painted.filter((a) => { const i = a.querySelector(".icon"); return i && i.getBoundingClientRect().width > 4; }).length;
    const labelled = nav ? [...nav.querySelectorAll(".navlink > span")].filter((l) => l.getBoundingClientRect().width > 4).length : 0;
    if (!visible) shellExtra.push({ kind: "RAIL", detail: "collapsed navigation is hidden instead of showing icons" });
    else if (painted.length < all.length) shellExtra.push({ kind: "RAIL", detail: `${all.length - painted.length} of ${all.length} destination(s) do not render in the collapsed rail` });
    else if (icons < all.length) shellExtra.push({ kind: "RAIL", detail: `${icons} icons for ${all.length} destinations in the collapsed rail` });
    else if (labelled > 0) shellExtra.push({ kind: "RAIL", detail: `${labelled} label(s) still visible in the collapsed rail` });
  }
  const header = console_ ? console_.querySelector(".appheader") : null;
  const shell = shellExtra;
  if (header && document.querySelector(".adminmain")) {
    const menu = header.querySelector(".userdd");
    if (menu) {
      const menuRight = menu.getBoundingClientRect().right;
      for (const el of header.querySelectorAll("*")) {
        if (menu.contains(el) || el.contains(menu)) continue;
        const r = el.getBoundingClientRect();
        if (r.width > 4 && r.right > menuRight + 1) { shell.push({ kind: "HEADER", detail: `${describe(el)} sits right of the account menu` }); break; }
      }
      const gutter = window.innerWidth - menuRight;
      if (gutter > 40) shell.push({ kind: "HEADER", detail: `account menu is ${Math.round(gutter)}px from the edge` });
    }
    const size = (el) => (el ? parseFloat(getComputedStyle(el).fontSize) : null);
    const body = size(document.querySelector(".adminmain"));
    const bar = size(header);
    const nav = size(document.querySelector(".navlink"));
    if (body && bar && Math.abs(bar - body) > 0.5) shell.push({ kind: "TYPE", detail: `header ${bar}px vs body ${body}px` });
    if (body && nav && Math.abs(nav - body) > 0.5) shell.push({ kind: "TYPE", detail: `navigation ${nav}px vs body ${body}px` });
    for (const [sel, ratio] of [["h1", 1.75], ["h2", 1.45], ["h3", 1.45]]) {
      for (const h of document.querySelectorAll(`.adminmain ${sel}`)) {
        const hs = size(h);
        if (body && hs && hs / body > ratio + 0.01) { shell.push({ kind: "TYPE", detail: `${sel} ${hs}px is ${(hs / body).toFixed(2)}x body ${body}px (max ${ratio})` }); break; }
      }
    }
  }

  return {
    wraps: [...found.values()],
    widths,
    shell,
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
      if (t) { t.checked = true; n++; }
      return n;
    }, width);
    let open = { wraps: [] };
    if (opened) {
      await page.waitForTimeout(260);
      const openScopes = p.kind === "docs" ? [".demo__canvas details[data-dismiss]"] : ["details[data-dismiss]", ".adminnav"];
      open = await page.evaluate(audit, { scopes: openScopes, kind: p.kind });
      for (const sh of open.shell || []) findings.push(`${sh.kind} ${width} ${p.path || "/"} ${sh.detail}`);
    }
    for (const w of closed.widths) findings.push(`WIDTH ${width} ${p.path || "/"} ${w.sel} "${w.text}" lines=${w.lines} unused=${w.unused}%`);
    for (const sh of closed.shell) findings.push(`${sh.kind} ${width} ${p.path || "/"} ${sh.detail}`);
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
