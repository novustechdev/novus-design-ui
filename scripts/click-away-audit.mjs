#!/usr/bin/env node
/* Novus Design Kit: click away to close, in a real browser (the click-away rule).
   Renders every page in site/dist (docs, the Tailwind and Material demos, the app switcher
   demos and the Blazor demo's routes) in headless Chromium, at 1366px with a mouse and at
   390px with touch, and fails when
     MENU      a details[data-dismiss] menu does not open on its summary, does not close on a
               press outside it or on Escape, closes on a press inside its own panel, or stays
               open when a second menu opens,
     UNMARKED  a details element whose panel floats over the page (absolute or fixed) has no
               data-dismiss, so nothing closes it from outside,
     DIALOG    a dialog opened with showModal() does not close on a press on its backdrop or
               on Escape, or closes on a press inside it,
     OPENER    a dialog's own trigger does not leave it open as a modal, on screen (the opening
               click closed it, or it was drawn open in the page flow),
     SPECIMEN  a dialog drawn open on the page as a specimen closes on an outside press, or
     BLAZOR    the Blazor demo's state-rendered dialog does not leave the page on an outside
               press or on Escape, or cannot be opened again afterwards.
   Usage: node scripts/click-away-audit.mjs [--only <path part>]   Env: CHROME_PATH, CI=true
   Exit:  0 clean, 1 findings or CI tooling failure, 2 skipped locally. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, extname, dirname, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "site/dist");
const CI = process.env.CI === "true";
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const bail = (msg) => { console.log(`${CI ? "FAIL" : "SKIP"}  click-away audit: ${msg}`); process.exit(CI ? 1 : 2); };

let chromium;
try { ({ chromium } = await import("playwright-core")); } catch { bail("playwright-core not installed (npm install --no-save --no-package-lock playwright-core@1.55.0)"); }
if (!existsSync(DIST)) bail("site/dist missing (run node site/build.mjs)");

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".wasm": "application/wasm", ".dat": "application/octet-stream" };
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
const BASE = `http://127.0.0.1:${server.address().port}/`;

/* Every built page, except the Blazor demo's own files: its routes are listed by hand. */
const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    const rel = relative(DIST, full).split(/[\\/]/).join("/");
    if (rel.startsWith("demos/blazor")) continue;
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith(".html") && !readFileSync(full, "utf8").includes("<!--redirect-stub-->")) pages.push({ path: rel, blazor: false });
  }
})(DIST);
if (existsSync(join(DIST, "demos/blazor/index.html")))
  for (const r of ["", "transactions", "datagrid", "terminals", "settings", "analytics", "topnav"])
    pages.push({ path: `demos/blazor/${r}`, blazor: true });
const todo = pages.filter((p) => !ONLY || p.path.includes(ONLY)).sort((a, b) => a.path.localeCompare(b.path));

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
let checks = 0;
const expect = (cond, kind, where, detail) => { checks++; if (!cond) findings.push(`${kind} ${where} ${detail}`); };

/* In-page helpers, installed once per page. Points are viewport coordinates. */
const HELPERS = () => {
  const busy = "a, button, summary, input, select, textarea, label, [role=button], [tabindex], novus-app-switcher";
  /* A point on blank page, outside `avoid` and every open menu or dialog, on nothing clickable. */
  window.__outside = (avoid) => {
    const w = innerWidth, h = innerHeight;
    for (let y = h - 8; y > 8; y -= 23) for (let x = w - 8; x > 8; x -= 37) {
      const el = document.elementFromPoint(x, y);
      if (!el || (avoid && avoid.contains(el)) || el.closest(busy) || el.closest("details[open], dialog[open]")) continue;
      return [x, y];
    }
    return null;
  };
  /* A point inside `box` that lands on box itself or plain content in it, never a control. */
  window.__inside = (box, skip) => {
    const r = box.getBoundingClientRect();
    for (let y = r.bottom - 4; y > r.top + 2; y -= 7) for (let x = r.left + 4; x < r.right - 2; x += 11) {
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      const el = document.elementFromPoint(x, y);
      if (!el || !box.contains(el) || el.closest(busy) || (skip && skip.contains(el))) continue;
      return [x, y];
    }
    return null;
  };
  /* Shown and clickable: a thumbnail preview drawn aria-hidden with pointer-events off is neither. */
  window.__visible = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.pointerEvents !== "none" && !el.closest("[aria-hidden=true], [inert]"); };
};

async function press(page, touch, [x, y]) {
  if (touch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
  await page.waitForTimeout(40);
}

async function audit(p, mode) {
  const touch = mode === 390;
  const where = `${mode} ${p.path || "/"}`;
  const ctx = await browser.newContext({ viewport: touch ? { width: 390, height: 844 } : { width: 1366, height: 768 }, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage();
  const errors = [];
  let stage = "load";
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await page.goto(BASE + p.path, { waitUntil: "load" });
    if (p.blazor) await page.waitForSelector(".adminwrap, .authpage, .signedout", { timeout: 90000 });
    await page.waitForTimeout(100);
    await page.evaluate(HELPERS);

    /* UNMARKED: a floating panel under a details element with no data-dismiss. */
    const unmarked = await page.evaluate(() => [...document.querySelectorAll("details:not([data-dismiss])")].filter((d) =>
      [...d.children].some((c) => c.tagName !== "SUMMARY" && /absolute|fixed/.test(getComputedStyle(c).position))
    ).map((d) => d.querySelector("summary")?.textContent.trim().slice(0, 30) || d.className));
    expect(unmarked.length === 0, "UNMARKED", where, `floating menu without data-dismiss: ${unmarked.join(", ")}`);

    stage = "menus";
    /* MENU: each visible menu, one at a time. */
    const menus = await page.$$("details[data-dismiss]");
    let tested = [];
    for (const [i, menu] of menus.entries()) {
      const summary = await menu.$(":scope > summary");
      if (!summary || !(await summary.evaluate((s) => window.__visible(s)))) continue;
      const isOpen = () => menu.evaluate((d) => d.open);
      const name = (await summary.evaluate((s) => s.textContent.trim() || s.getAttribute("aria-label") || "")).replace(/\s+/g, " ").slice(0, 24);
      if (await isOpen()) { await page.keyboard.press("Escape"); }
      await summary.click();
      expect(await isOpen(), "MENU", where, `"${name}" did not open on its summary`);
      if (!(await isOpen())) continue;

      const inside = await menu.evaluate((d) => window.__inside(d, d.querySelector(":scope > summary")));
      if (inside) {
        await press(page, touch, inside);
        expect(await isOpen(), "MENU", where, `"${name}" closed on a press inside its own panel`);
      }

      const out = await menu.evaluate((d) => window.__outside(d));
      expect(!!out, "MENU", where, `"${name}": no blank point outside it to press`);
      if (out) {
        await press(page, touch, out);
        expect(!(await isOpen()), "MENU", where, `"${name}" stayed open after a press outside it`);
      }

      await summary.click();
      await page.keyboard.press("Escape");
      expect(!(await isOpen()), "MENU", where, `"${name}" stayed open after Escape`);
      tested.push([menu, summary, name]);
    }

    stage = "second menu";
    /* Opening a second menu closes the first. */
    /* Takes the first pair where the second summary is still reachable with the first open,
       since a panel may cover a neighbour's button, as it would for a person too. */
    pairs: for (const [a, sa, na] of tested) for (const [b, sb, nb] of tested) {
      if (a === b) continue;
      await sa.click();
      const hit = await sb.evaluate((s) => {
        const r = s.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
        return s.contains(document.elementFromPoint(x, y)) ? [x, y] : null;
      });
      if (!hit) { await page.keyboard.press("Escape"); continue; }
      await page.mouse.click(hit[0], hit[1]);
      expect(!(await a.evaluate((d) => d.open)) && (await b.evaluate((d) => d.open)), "MENU", where, `opening "${nb}" left "${na}" open`);
      await page.keyboard.press("Escape");
      if (await a.evaluate((d) => d.open)) await page.keyboard.press("Escape");
      break pairs;
    }

    stage = "specimens";
    /* SPECIMEN: dialogs drawn open stay open through an outside press. */
    const specimens = await page.$$("dialog[open]");
    if (specimens.length) {
      const out = await page.evaluate(() => window.__outside(null));
      if (out) {
        await press(page, touch, out);
        for (const s of specimens) expect(await s.evaluate((d) => d.open), "SPECIMEN", where, "a dialog drawn open closed on an outside press");
      }
    }

    stage = "openers";
    /* OPENER: the page's own dialog triggers leave their dialog open. */
    /* Blazor renders its dialog only once a row is picked, so on Transactions, the one screen
       with a dialog, its triggers count before it exists. */
    const openers = ((p.blazor && p.path.endsWith("transactions")) || (await page.$("dialog"))) ? await page.$$("[onclick*='showModal'], [data-detail], [data-tx], .cell--actions button:text-is('Detail')") : [];
    for (const o of openers.slice(0, 2)) {
      if (!(await o.evaluate((el) => window.__visible(el)))) continue;
      await o.scrollIntoViewIfNeeded();
      await o.click();
      if (p.blazor) await page.waitForSelector("dialog:modal", { timeout: 5000 }).catch(() => {});
      else await page.waitForTimeout(60);
      /* Open as a modal and on screen: a dialog drawn open sits in the page flow, often below
         the fold with no backdrop, where a finger scrolling to it presses outside it. */
      const shown = await page.evaluate(() => {
        const d = document.querySelector("dialog:modal");
        if (!d) return document.querySelector("dialog[open]") ? "open, but not as a modal" : "not open";
        const r = d.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= innerHeight + 1 ? "ok" : `off screen (top ${Math.round(r.top)}, viewport ${innerHeight})`;
      });
      expect(shown === "ok", "OPENER", where, `a dialog trigger left its dialog ${shown}`);
      if (shown !== "ok") { await page.keyboard.press("Escape"); continue; }

      if (p.blazor) {
        /* BLAZOR: the press closes it, the close event clears state, the dialog leaves the DOM. */
        const out = await page.evaluate(() => {
          const r = document.querySelector("dialog:modal").getBoundingClientRect();
          return [[4, 4], [innerWidth - 20, innerHeight - 4], [4, innerHeight - 4]].find(([x, y]) => x < r.left || x > r.right || y < r.top || y > r.bottom);
        });
        await press(page, touch, out);
        const gone = await page.waitForFunction(() => !document.querySelector("dialog"), null, { timeout: 5000 }).then(() => true, () => false);
        expect(gone, "BLAZOR", where, "the dialog stayed on the page after a press outside it");
        await o.click();
        const again = await page.waitForSelector("dialog[open]", { timeout: 5000 }).then(() => true, () => false);
        expect(again, "BLAZOR", where, "the dialog would not open again after closing on an outside press");
        if (again) {
          await page.keyboard.press("Escape");
          const esc = await page.waitForFunction(() => !document.querySelector("dialog"), null, { timeout: 5000 }).then(() => true, () => false);
          expect(esc, "BLAZOR", where, "the dialog stayed on the page after Escape");
          if (!esc) await page.locator("dialog[open] .modal-close").click();
        }
      } else {
        await page.keyboard.press("Escape");
      }
    }

    stage = "dialogs";
    /* DIALOG: every modal-capable dialog on the page, opened with showModal(). */
    const dialogs = await page.$$("dialog:not([open])");
    for (const [i, dlg] of dialogs.entries()) {
      const open = () => dlg.evaluate((d) => d.open);
      await dlg.evaluate((d) => d.showModal());
      const inside = await dlg.evaluate((d) => window.__inside(d));
      if (inside) {
        await press(page, touch, inside);
        expect(await open(), "DIALOG", where, `dialog ${i + 1} closed on a press inside it`);
      }
      const out = await dlg.evaluate((d) => {
        const r = d.getBoundingClientRect();
        const pts = [[4, 4], [innerWidth - 4, innerHeight - 4], [4, innerHeight - 4], [innerWidth - 4, 4]];
        return pts.find(([x, y]) => x < r.left || x > r.right || y < r.top || y > r.bottom) || null;
      });
      expect(!!out, "DIALOG", where, `dialog ${i + 1} covers the whole viewport, no backdrop to press`);
      if (out) {
        if (!(await open())) await dlg.evaluate((d) => d.showModal());
        await press(page, touch, out);
        expect(!(await open()), "DIALOG", where, `dialog ${i + 1} stayed open after a press on its backdrop`);
      }
      await dlg.evaluate((d) => d.showModal());
      await page.keyboard.press("Escape");
      expect(!(await open()), "DIALOG", where, `dialog ${i + 1} stayed open after Escape`);
    }

    expect(errors.length === 0, "ERROR", where, `page error: ${errors[0]}`);
  } catch (e) {
    findings.push(`ERROR ${where} (${stage}) ${e.message.split("\n")[0]}`);
  }
  await ctx.close();
}

for (const p of todo) for (const mode of [1366, 390]) await audit(p, mode);

await browser.close();
server.close();
for (const f of findings) console.log(f);
console.log(`click-away audit: ${todo.length} pages x 2 (1366 mouse, 390 touch); ${checks} checks, ${findings.length} finding(s)`);
process.exit(findings.length ? 1 : 0);
