#!/usr/bin/env node
/* Novus Design Kit: the app switcher in a real browser (feature 014).
   Renders the switcher demos (site/dist/demos/app-switcher, both shells) in headless Chromium
   at 390, 1366 and 1920px in the light and dark themes, opens the panel, and fails when
     AXE       axe-core reports a WCAG 2.1 A or AA violation,
     LAYOUT    the panel is not where and how wide D2 puts it, the grid does not have five,
               four or three columns, a name wraps, or the page scrolls sideways,
     MARK      a product mark changes colour with the theme,
     MOTION    the panel still animates under prefers-reduced-motion,
     KEYS      the keyboard walk goes anywhere but where D2 says, or
     CATALOG   the catalog is fetched before the panel opens, a failing, slow or garbled
               catalog is not replaced by the last good copy or the static list, a hostile
               name is rendered as markup, or a look-alike host is linked.
   The layout audit holds the same pages to the kit's general rules (WRAP, TARGET, HEADER).
   Usage: node scripts/app-switcher-audit.mjs     Env: CHROME_PATH, CI=true
   Exit:  0 clean, 1 findings or CI tooling failure, 2 skipped locally. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "site/dist");
const CI = process.env.CI === "true";
const bail = (msg) => { console.log(`${CI ? "FAIL" : "SKIP"}  app switcher audit: ${msg}`); process.exit(CI ? 1 : 2); };

let chromium, axeSource;
try { ({ chromium } = await import("playwright-core")); } catch { bail("playwright-core not installed (npm install --no-save --no-package-lock playwright-core@1.55.0 axe-core@4.10.3)"); }
try { axeSource = (await import("axe-core")).default.source; } catch { bail("axe-core not installed (npm install --no-save --no-package-lock axe-core@4.10.3)"); }
if (!existsSync(join(DIST, "demos/app-switcher/index.html"))) bail("site/dist/demos/app-switcher missing (run node site/build.mjs)");

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  let file = normalize(join(DIST, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/demos/app-switcher/`;

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

const findings = [];
const fail = (kind, where, detail) => findings.push(`${kind} ${where} ${detail}`);
let checks = 0;
const expect = (cond, kind, where, detail) => { checks++; if (!cond) fail(kind, where, detail); };

const WIDTHS = [[390, 844], [1366, 768], [1920, 1080]];
const THEMES = ["light", "dark"];
const PAGES = ["index.html", "top-navigation.html"];
const BUTTON = "novus-app-switcher .nv-apps__button";
const loaded = (page) => page.waitForFunction(() => {
  const s = document.querySelector(".nv-apps__panel:not([hidden]) .nv-apps__status");
  return s && s.textContent !== "Loading apps";
}, null, { timeout: 8000 });

async function context(theme, viewport, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width: viewport[0], height: viewport[1] }, ...extra });
  await ctx.addInitScript((t) => { try { localStorage.setItem("novus-theme", t); } catch (e) { /* private mode */ } }, theme);
  return ctx;
}

async function open(page) {
  await page.click(BUTTON);
  await loaded(page);
  /* Measure the panel at rest, not partway through its short entrance. */
  await page.$eval(".nv-apps__panel", (p) => Promise.all(p.getAnimations().map((a) => a.finished)));
}

/* Layout, theme, axe: every page, width and theme. */
for (const theme of THEMES) for (const vp of WIDTHS) for (const file of PAGES) {
  const where = `${vp[0]} ${theme} ${file}`;
  const ctx = await context(theme, vp);
  const page = await ctx.newPage();
  let catalogRequests = 0;
  page.on("request", (r) => { if (r.url().endsWith("sample-catalog.json")) catalogRequests++; });
  try {
    await page.goto(BASE + file, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => customElements.get("novus-app-switcher"));
    expect(catalogRequests === 0, "CATALOG", where, "the catalog was fetched before the panel opened");
    const button = await page.$eval(BUTTON, (b) => ({ w: b.offsetWidth, h: b.offsetHeight, name: b.getAttribute("aria-label"), popup: b.getAttribute("aria-haspopup"), expanded: b.getAttribute("aria-expanded") }));
    expect(button.w === 40 && button.h === 40, "LAYOUT", where, `button is ${button.w}x${button.h}, not 40x40`);
    expect(button.name === "Novus apps" && button.popup === "dialog" && button.expanded === "false", "AXE", where, `button semantics ${JSON.stringify(button)}`);
    await open(page);
    const g = await page.evaluate(() => {
      const panel = document.querySelector(".nv-apps__panel");
      const p = panel.getBoundingClientRect();
      const b = document.querySelector(".nv-apps__button").getBoundingClientRect();
      const header = document.querySelector("header.appbar").getBoundingClientRect();
      const tiles = [...panel.querySelectorAll(".nv-apps__tile")];
      const top = tiles[0].getBoundingClientRect().top;
      const names = [...panel.querySelectorAll(".nv-apps__name")].map((n) => ({ text: n.textContent, h: n.getBoundingClientRect().height, lh: parseFloat(getComputedStyle(n).lineHeight) }));
      const bank = panel.querySelector('[data-app="novabank"] .nv-apps__mark');
      return {
        left: p.left, width: p.width, top: p.top, buttonLeft: b.left, headerBottom: header.bottom,
        columns: tiles.filter((t) => Math.abs(t.getBoundingClientRect().top - top) < 1).length,
        tiles: tiles.length, current: panel.querySelector('[aria-current="page"]')?.getAttribute("data-app"),
        focused: document.activeElement?.classList.contains("nv-apps__input"),
        placeholder: panel.querySelector(".nv-apps__input").placeholder,
        wrapped: names.filter((n) => n.h > n.lh * 1.5).map((n) => n.text),
        clipped: names.filter((n) => n.text && n.h < 1).map((n) => n.text),
        bankColour: bank ? getComputedStyle(bank).backgroundColor : "",
        animation: getComputedStyle(panel).animationName,
        scroll: document.documentElement.scrollWidth, inner: window.innerWidth,
      };
    });
    const phone = vp[0] < 600;
    expect(g.tiles === 18, "LAYOUT", where, `${g.tiles} tiles for a viewer holding every role (want 17 apps and All apps)`);
    expect(g.current === "novabank", "LAYOUT", where, `current tile is ${g.current}`);
    expect(g.columns === (vp[0] >= 900 ? 5 : phone ? 3 : 4), "LAYOUT", where, `${g.columns} columns`);
    expect(g.focused && g.placeholder === "Find Novus apps", "KEYS", where, "search is not focused on open, or its placeholder is wrong");
    expect(!g.wrapped.length, "LAYOUT", where, `names on two lines: ${g.wrapped.join(", ")}`);
    expect(g.scroll <= g.inner + 1, "LAYOUT", where, `page scrolls sideways (${g.scroll} > ${g.inner})`);
    if (phone) {
      expect(Math.abs(g.left) <= 1 && Math.abs(g.width - vp[0]) <= 1, "LAYOUT", where, `phone sheet spans ${g.left}..${g.left + g.width}, not the full width`);
      expect(Math.abs(g.top - g.headerBottom) <= 1, "LAYOUT", where, `phone sheet top ${g.top} is not the header's lower edge ${g.headerBottom}`);
    } else {
      expect(Math.abs(g.width - 640) <= 1, "LAYOUT", where, `panel is ${g.width}px wide, not 640`);
      expect(Math.abs(g.left - g.buttonLeft) <= 1, "LAYOUT", where, `panel left ${g.left} is not under the button at ${g.buttonLeft}`);
    }
    expect(g.bankColour === "rgb(0, 160, 74)", "MARK", where, `NovaBank's mark is ${g.bankColour} in the ${theme} theme`);
    expect(g.animation === "nvappsin", "MOTION", where, `panel animation is ${g.animation} with motion allowed`);
    await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } })).violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target?.join(" ")}`));
    for (const v of violations) fail("AXE", where, v);
    checks++;
  } catch (e) {
    fail("ERROR", where, e.message.split("\n")[0]);
  } finally {
    await ctx.close();
  }
}

/* Reduced motion: no animation at all. */
{
  const ctx = await context("light", [1366, 768], { reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "index.html", { waitUntil: "load" });
  await open(page);
  const animation = await page.$eval(".nv-apps__panel", (p) => getComputedStyle(p).animationName);
  expect(animation === "none", "MOTION", "1366 reduced-motion", `panel animation is ${animation}`);
  await ctx.close();
}

/* The keyboard walk, at a desktop width and on a phone. */
for (const vp of [[1366, 768], [390, 844]]) {
  const where = `${vp[0]} keys`;
  const cols = vp[0] >= 900 ? 5 : 3;
  const ctx = await context("light", vp);
  const page = await ctx.newPage();
  const focused = () => page.evaluate(() => {
    const a = document.activeElement;
    return a?.getAttribute("data-app") || (a?.classList.contains("nv-apps__tile--all") ? "all" : a?.classList.contains("nv-apps__input") ? "search" : a?.classList.contains("nv-apps__button") ? "button" : a?.tagName);
  });
  try {
    await page.goto(BASE + "index.html", { waitUntil: "load" });
    await page.waitForFunction(() => customElements.get("novus-app-switcher"));
    await page.focus(BUTTON);
    await page.keyboard.press("Enter");
    await loaded(page);
    expect(await focused() === "search", "KEYS", where, "Enter on the button does not land in the search field");
    const order = await page.$$eval(".nv-apps__tile", (t) => t.map((x) => x.getAttribute("data-app") || "all"));
    const walk = async (key, want, why) => { await page.keyboard.press(key); const got = await focused(); expect(got === want, "KEYS", where, `${why}: ${key} went to ${got}, not ${want}`); };
    await walk("ArrowDown", order[1], "from search into the grid, past the current tile");
    await walk("ArrowRight", order[2], "right");
    await walk("ArrowLeft", order[1], "left");
    await walk("ArrowLeft", order[1], "left onto the current tile stays put");
    await walk("ArrowDown", order[1 + cols], "down one row");
    await walk("ArrowUp", order[1], "up one row");
    await walk("ArrowUp", "search", "up from the first row");
    await walk("ArrowDown", order[1], "back into the grid");
    await walk("End", "all", "End");
    await walk("Home", order[1], "Home");
    await walk("Tab", order[2], "Tab moves on");
    await page.keyboard.press("End");
    await walk("Tab", "search", "Tab from the last tile wraps to search");
    await walk("Shift+Tab", "all", "Shift+Tab from search wraps to the last tile");
    await page.keyboard.press("Home");
    await page.keyboard.type("trace");
    expect(await focused() === "search", "KEYS", where, "typing on a tile does not go to the search field");
    const filtered = await page.$$eval(".nv-apps__tile", (t) => t.map((x) => x.getAttribute("data-app") || "all"));
    expect(JSON.stringify(filtered) === JSON.stringify(["novatrace", "all"]), "KEYS", where, `"trace" finds ${filtered}`);
    await page.fill(".nv-apps__input", "zzz");
    const said = await page.$eval(".nv-apps__status", (s) => ({ text: s.textContent, shown: !s.classList.contains("sr-only") }));
    expect(said.text === "No app matches" && said.shown, "KEYS", where, `no match says ${JSON.stringify(said)}`);
    await page.fill(".nv-apps__input", "");
    await page.keyboard.press("Escape");
    const after = await page.evaluate(() => ({ hidden: document.querySelector(".nv-apps__panel").hidden, expanded: document.querySelector(".nv-apps__button").getAttribute("aria-expanded") }));
    expect(after.hidden && after.expanded === "false" && (await focused()) === "button", "KEYS", where, "Escape does not close and return focus to the button");
    await open(page);
    await page.mouse.click(vp[0] - 5, vp[1] - 5);
    expect(await page.$eval(".nv-apps__panel", (p) => p.hidden), "KEYS", where, "a press outside does not close the panel");
    await open(page);
    await page.keyboard.press("ArrowDown");
    const first = await focused();
    await page.keyboard.press("Enter");
    const opened = await page.$eval("#opened", (s) => s.textContent);
    expect(opened.includes(first), "KEYS", where, `Enter on ${first} did not fire novus-app-open (${opened})`);
    const recent = await page.evaluate(() => localStorage.getItem("novus-apps.recent"));
    expect(recent === JSON.stringify([first]), "KEYS", where, `recents hold ${recent}`);
    await page.click(BUTTON, { force: true }).catch(() => {});
    if (await page.$eval(".nv-apps__panel", (p) => p.hidden)) await open(page);
    const lead = await page.$$eval(".nv-apps__tile", (t) => t[0].getAttribute("data-app"));
    expect(lead === first, "KEYS", where, `after opening ${first} the grid leads with ${lead}`);
  } catch (e) {
    fail("ERROR", where, e.message.split("\n")[0]);
  } finally {
    await ctx.close();
  }
}

/* The catalog failing in each way D3 names, at a desktop width. */
const GOOD = JSON.parse(readFileSync(join(DIST, "demos/app-switcher/sample-catalog.json"), "utf8"));
const STATIC = Buffer.from(JSON.stringify([{ key: "novabank", name: "NovaBank", url: "https://novabank.novustech.dev" }, { key: "novahub", name: "NovaHub", url: "https://novahub.novustech.dev" }])).toString("base64");
async function scenario(name, handler, { prime = false, fallback = false } = {}) {
  const ctx = await context("light", [1366, 768]);
  const page = await ctx.newPage();
  try {
    if (prime) {
      await page.goto(BASE + "index.html", { waitUntil: "load" });
      await open(page);
      await page.keyboard.press("Escape");
    }
    await page.route("**/sample-catalog.json", handler);
    await page.goto(BASE + "index.html", { waitUntil: "load" });
    await page.waitForFunction(() => customElements.get("novus-app-switcher"));
    if (fallback) await page.$eval("novus-app-switcher", (s, v) => s.setAttribute("fallback", v), STATIC);
    const started = Date.now();
    await page.click(BUTTON);
    await loaded(page);
    const tiles = await page.$$eval(".nv-apps__tile", (t) => t.map((x) => x.getAttribute("data-app") || "all"));
    return { page, ctx, tiles, ms: Date.now() - started };
  } catch (e) {
    await ctx.close();
    throw e;
  }
}
const all = ["novabank", "nova-lending", "novahub", "novamerchant-ops", "novamerchant", "novamerchant-pos", "novamerchant-biller", "novacard", "novatrace", "novus-id", "novaedge", "ibanking", "mbanking", "novaplan", "novaticket", "novasearch", "design-kit", "all"];
const cases = [
  ["error, with a good copy kept", (r) => r.fulfill({ status: 500, body: "" }), { prime: true }, (x) => JSON.stringify(x.tiles) === JSON.stringify(all)],
  ["garbage, with a good copy kept", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{\"oops\": true}" }), { prime: true }, (x) => JSON.stringify(x.tiles) === JSON.stringify(all)],
  ["no answer in 3 s, with a good copy kept", () => {}, { prime: true }, (x) => JSON.stringify(x.tiles) === JSON.stringify(all) && x.ms >= 2900 && x.ms < 4500],
  ["error, no copy, the static list", (r) => r.fulfill({ status: 503, body: "" }), { fallback: true }, (x) => JSON.stringify(x.tiles) === JSON.stringify(["novabank", "novahub", "all"])],
  ["error, no copy, no static list", (r) => r.abort(), {}, (x) => JSON.stringify(x.tiles) === JSON.stringify(["all"])],
];
for (const [name, handler, opts, ok] of cases) {
  try {
    const x = await scenario(name, handler, opts);
    expect(ok(x), "CATALOG", "1366", `${name}: tiles ${x.tiles.join(",")} after ${x.ms}ms`);
    await x.ctx.close();
  } catch (e) { fail("ERROR", "1366", `${name}: ${e.message.split("\n")[0]}`); }
}
try {
  // Each hostile entry starts from a real one, picked by id so the catalog's order can change.
  const real = (id) => GOOD.apps.find((app) => app.id === id);
  const hostile = {
    ...GOOD,
    apps: [
      { ...real("novahub"), name: '<img src=x onerror="window.__pwned=1">NovaHub', description: '<b onmouseover="window.__pwned=1">x</b>' },
      { ...real("novacard"), id: "lookalike", url: "https://novacard.novustech.dev.evil.example" },
      { ...real("novatrace"), id: "plainhttp", url: "http://novatrace.novustech.dev" },
    ],
  };
  const x = await scenario("hostile", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(hostile) }));
  const probe = await x.page.evaluate(() => ({ pwned: window.__pwned, img: !!document.querySelector(".nv-apps__panel img, .nv-apps__panel b"), name: document.querySelector('[data-app="novahub"] .nv-apps__name')?.textContent }));
  expect(!probe.pwned && !probe.img && probe.name?.startsWith("<img"), "CATALOG", "1366", `hostile text became markup: ${JSON.stringify(probe)}`);
  expect(JSON.stringify(x.tiles) === JSON.stringify(["novahub", "all"]), "CATALOG", "1366", `look-alike or plain-http entries linked: ${x.tiles}`);
  await x.ctx.close();
} catch (e) { fail("ERROR", "1366", `hostile: ${e.message.split("\n")[0]}`); }

try {
  // A console in Sinhala passes its own words; the header and the panel show no English it did
  // not choose, and the words arrive as text, never as markup.
  const ctx = await context("light", [1366, 768]);
  const page = await ctx.newPage();
  await page.goto(BASE + "index.html", { waitUntil: "load" });
  await page.waitForFunction(() => customElements.get("novus-app-switcher"));
  await page.$eval("novus-app-switcher", (s) => s.setAttribute("labels", JSON.stringify({ apps: "Novus යෙදුම්", find: "Novus යෙදුම් සොයන්න", all: "සියලු යෙදුම්", countOther: "යෙදුම් {n}" })));
  await page.click(BUTTON);
  await loaded(page);
  const words = await page.evaluate(() => {
    const s = document.querySelector("novus-app-switcher");
    return {
      button: s.querySelector(".nv-apps__button").getAttribute("aria-label"),
      panel: s.querySelector(".nv-apps__panel").getAttribute("aria-label"),
      find: s.querySelector(".nv-apps__input").getAttribute("placeholder"),
      all: s.querySelector(".nv-apps__tile--all .nv-apps__name")?.textContent,
      status: s.querySelector(".nv-apps__status").textContent,
    };
  });
  expect(words.button === "Novus යෙදුම්" && words.panel === "Novus යෙදුම්", "CATALOG", "1366", `labels not on the button and panel: ${JSON.stringify(words)}`);
  expect(words.find === "Novus යෙදුම් සොයන්න" && words.all === "සියලු යෙදුම්", "CATALOG", "1366", `labels not in the panel: ${JSON.stringify(words)}`);
  expect(/^යෙදුම් \d+$/.test(words.status), "CATALOG", "1366", `count not in the console's words: ${words.status}`);
  await ctx.close();
} catch (e) { fail("ERROR", "1366", `labels: ${e.message.split("\n")[0]}`); }

await browser.close();
server.close();
for (const f of findings) console.log(f);
console.log(`app switcher audit: ${WIDTHS.length} widths x ${THEMES.length} themes x ${PAGES.length} shells, keyboard walk at 2 widths, ${cases.length + 2} catalog cases; ${checks} checks, ${findings.length} finding(s)`);
process.exit(findings.length ? 1 : 0);
