#!/usr/bin/env node
/* Novus Design Kit — reference-site generator. Zero dependencies, Node >= 20.
   Builds site/dist/ from site/src/ fragments + site/components.json, wrapped in
   the shared shell. All styling references tokens.css variables only. */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SITE, "..");
const SRC = join(SITE, "src");
const DIST = join(SITE, "dist");

const read = (p) => readFileSync(p, "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function dedent(s) {
  const lines = s.replace(/^\n+|\s+$/g, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length);
  const min = Math.min(...indents);
  return lines.map((l) => l.slice(min)).join("\n");
}

/* <section class="demo" data-title="X"> live markup </section>
   → rendered example + escaped, copyable snippet (snippet === example by construction). */
function transformDemos(html) {
  return html.replace(
    /<section class="demo"([^>]*)>([\s\S]*?)<\/section>/g,
    (_, attrs, inner) => {
      const title = (attrs.match(/data-title="([^"]*)"/) || [, "Example"])[1];
      const code = dedent(inner);
      return `<figure class="demo">
  <div class="demo__canvas">${inner}</div>
  <div class="demo__bar"><span class="demo__title">${title}</span><button class="demo__copy btn btn--ghost btn--sm" hidden>Copy</button></div>
  <pre class="demo__code"><code>${esc(code)}</code></pre>
</figure>`;
    }
  );
}

/* Site-specific chrome — every value is a token reference. */
const SITE_CSS = `
  .appname{font-weight:var(--weight-bold);font-size:var(--text-lg);color:var(--text);}
  .brandlock{text-decoration:none;}
  .themetoggle{min-height:2.75rem;min-width:2.75rem;}
  .themetoggle .ic-sun{display:none;}
  [data-theme="dark"] .themetoggle .ic-moon{display:none;}
  [data-theme="dark"] .themetoggle .ic-sun{display:block;}
  @media (prefers-color-scheme: dark){
    :root:not([data-theme]) .themetoggle .ic-moon{display:none;}
    :root:not([data-theme]) .themetoggle .ic-sun{display:block;}
  }
  .site-main{padding-block:var(--space-6) var(--space-8);}
  .site-main > h1:first-child{margin-top:var(--space-4);}
  .eyebrow{font-size:var(--text-xs);text-transform:uppercase;letter-spacing:var(--tracking-wide);color:var(--text-muted);font-weight:var(--weight-medium);margin:0 0 var(--space-2);}
  .demo{margin:0 0 var(--space-6);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;}
  .demo__canvas{padding:var(--space-5);background:var(--bg);}
  .demo__bar{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);padding:var(--space-2) var(--space-4);background:var(--bg-subtle);border-top:1px solid var(--border);}
  .demo__title{font-size:var(--text-sm);color:var(--text-secondary);font-weight:var(--weight-medium);}
  .demo__code{margin:0;padding:var(--space-4);background:var(--bg-subtle);border-top:1px solid var(--border);overflow-x:auto;font-size:var(--text-sm);line-height:var(--lh-sm);color:var(--text-secondary);}
  .ovgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--space-4);margin-bottom:var(--space-7);}
  .ovcard{position:relative;display:flex;flex-direction:column;padding:0;overflow:hidden;}
  .ovcard__preview{padding:var(--space-4);border-bottom:1px solid var(--border);background:var(--bg);min-height:96px;max-height:150px;overflow:hidden;display:flex;align-items:center;pointer-events:none;}
  .ovcard__preview > *{width:100%;}
  .ovcard__meta{padding:var(--space-4);}
  .ovcard__meta b{display:block;margin-bottom:var(--space-1);}
  .ovcard__meta span{color:var(--text-secondary);font-size:var(--text-sm);}
  .pagenav{display:flex;justify-content:space-between;gap:var(--space-4);margin-top:var(--space-7);}
  .classlist{margin:0 0 var(--space-6);}
  .swatch{height:var(--space-7);border-radius:var(--radius-md);border:1px solid var(--border);}
  .swatchgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--space-3);margin-bottom:var(--space-6);}
  .swatchgrid code{font-size:var(--text-xs);color:var(--text-secondary);}
  .assetgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--space-3);margin-bottom:var(--space-6);}
  .assetgrid .clogo{height:auto;min-height:54px;flex-direction:column;gap:var(--space-2);padding:var(--space-3);}
  .assetgrid img{max-height:44px;}
  .assetgrid code{font-size:var(--text-xs);color:var(--text-secondary);word-break:break-all;text-align:center;}
  .assetgrid .clogo--photo{background:var(--surface);}
  .assetgrid .clogo--photo img{max-height:96px;max-width:100%;border-radius:var(--radius-sm);object-fit:cover;}
  .typerow td:first-child{white-space:nowrap;}
  /* ant.design-style landing structure on Novus bands (locked alternation pattern) */
  .band{margin-inline:calc(-1 * var(--gutter));padding:var(--space-8) var(--gutter);}
  .band--tint{background:var(--bg-subtle);}
  .hero{display:grid;gap:var(--space-7);align-items:center;padding-block:var(--space-7);}
  @media (min-width:1000px){.hero{grid-template-columns:minmax(0,5fr) minmax(0,6fr);}}
  .hero h1{font-size:var(--text-4xl);line-height:var(--lh-4xl);}
  .hero .lead{font-size:var(--text-md);line-height:var(--lh-md);color:var(--text-secondary);}
  .hero__shot img{width:100%;border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-3);display:block;}
  .featgrid{display:grid;gap:var(--space-5);grid-template-columns:repeat(auto-fit,minmax(260px,1fr));}
  .chiprow{display:flex;flex-wrap:wrap;gap:var(--space-3);}
  .chiprow a{display:inline-flex;align-items:center;min-height:2.75rem;padding:var(--space-1) var(--space-4);border:1px solid var(--border-strong);border-radius:var(--radius-pill);color:var(--accent-text);text-decoration:none;font-weight:var(--weight-medium);}
  .chiprow a:hover{border-color:var(--accent);background:var(--accent-subtle);text-decoration:none;}
  .bandhead{margin-bottom:var(--space-5);}
  .bandhead h2{margin-top:0;}
  .sitefoot{margin-top:var(--space-8);}
  .footcols{display:grid;gap:var(--space-6);grid-template-columns:repeat(auto-fit,minmax(180px,1fr));padding-block:var(--space-6);}
  .footcols b{display:block;margin-bottom:var(--space-2);font-size:var(--text-sm);}
  .footcols a{display:block;color:var(--text-secondary);text-decoration:none;font-size:var(--text-sm);padding-block:var(--space-1);}
  .footcols a:hover{color:var(--accent-text);}
  .sitefoot .container{max-width:none;}
  .site-main{font-size:var(--text-sm);line-height:var(--lh-sm);}
  @media (max-width:520px){ .pagenav{flex-direction:column;} }
  /* ant.design-style docs layout: mobile-first collapsible menu, sticky sidebar from 900px */
  .docwrap{display:grid;gap:var(--space-5);align-items:start;}
  .doccontent{min-width:0;}
  .sidenav{border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);}
  .sidenav > summary{cursor:pointer;padding:var(--space-2) var(--space-3);font-weight:var(--weight-medium);color:var(--text-secondary);font-size:var(--text-sm);}
  .sidenav__body{padding:var(--space-2) 0 var(--space-3);}
  .sidenav .eyebrow{padding:var(--space-3) var(--space-3) var(--space-1);margin:0;}
  .sidenav a{display:block;padding:var(--space-1) var(--space-3);color:var(--text-secondary);text-decoration:none;font-size:var(--text-sm);border-left:2px solid transparent;}
  .sidenav a:hover{color:var(--text);background:var(--bg-subtle);text-decoration:none;}
  .sidenav a[aria-current="page"]{color:var(--accent-text);background:var(--accent-subtle);border-left-color:var(--accent);font-weight:var(--weight-medium);}
  @media (min-width:900px){
    .docwrap{gap:var(--space-6);}
    .sidenav{position:sticky;top:var(--space-4);max-height:calc(100vh - var(--space-6));overflow-y:auto;border:0;background:transparent;}
    .sidenav > summary{display:none;}
  }

  /* Full-width fluid layout on desktop: gutters only, no fixed page column */
  .appbar__inner, .appnav__inner, .appmain { max-width: none; }
  @media (min-width: 900px) { .docwrap { grid-template-columns: 240px minmax(0, 1fr); } }
  /* Vertical rhythm: token-scale breathing room between blocks */
  .site-main p, .site-main .bullets, .sitefoot p { max-width: none; }
  .site-main h2 { margin-top: var(--space-7); }
  .site-main h3 { margin-top: var(--space-6); }
  .site-main > pre.demo__code, .doccontent > pre.demo__code { margin: var(--space-4) 0 var(--space-6); border: 1px solid var(--border); border-radius: var(--radius-md); }
  .demo pre.demo__code { margin: 0; border: 0; border-top: 1px solid var(--border); border-radius: 0; }
  .site-main figure { margin: 0 0 var(--space-5); }
  .site-main figcaption { margin-top: var(--space-2); }
  .site-main .doccontent > .table, .site-main .doccontent > .tablewrap { margin-bottom: var(--space-6); }
  .site-main .bullets { margin-bottom: var(--space-6); }
  .site-main p > code, .site-main li > code { padding: 0 var(--space-1); background: var(--bg-subtle); border-radius: var(--radius-sm); }
  /* Feedback round (feature 004) */
  :where(:not(.row):not(.tablist):not(.pvtoggle)) > .btn + .btn { margin-inline-start: var(--space-2); }
  details > summary::marker { font-size: var(--text-lg); }
  .disclosure-ic { font-size: var(--text-lg); line-height: 1; }
  .selectwrap { position: relative; display: block; }
  .selectwrap .select { appearance: none; padding-right: calc(var(--space-4) * 2); }
  .selectwrap::after { content: ""; position: absolute; right: var(--space-4); top: 50%; width: 0.5rem; height: 0.5rem; border-right: 2px solid var(--text-secondary); border-bottom: 2px solid var(--text-secondary); transform: translateY(-70%) rotate(45deg); pointer-events: none; }
  .pvtoggle { display: inline-flex; gap: var(--space-1); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-1); margin-bottom: var(--space-4); }
  .pvtoggle input { position: absolute; opacity: 0; pointer-events: none; }
  .pvtoggle label { cursor: pointer; padding: var(--space-1) var(--space-3); border-radius: var(--radius-sm); color: var(--text-secondary); font-size: var(--text-sm); transition: color 0.15s ease, background-color 0.15s ease; }
  .pvtoggle label:hover { color: var(--text); background: var(--bg-subtle); }
  .pvtoggle input:checked + label { background: var(--accent-subtle); color: var(--accent-text); }
  .pvtoggle input:focus-visible + label { outline: 2px solid var(--accent); outline-offset: -2px; }
  body:has(#pv-mobile:checked) .demo__canvas { max-width: 375px; border-inline-end: 1px dashed var(--border-strong); }
  @media (prefers-reduced-motion: reduce) { .pvtoggle label { transition: none; } }
`;

const COPY_JS = `
  document.querySelectorAll("[data-theme-toggle]").forEach(b=>{b.hidden=false;b.addEventListener("click",()=>window.novusTheme&&window.novusTheme.toggle());});
  if(navigator.clipboard)document.querySelectorAll(".demo__copy").forEach(b=>{b.hidden=false;b.addEventListener("click",()=>{navigator.clipboard.writeText(b.closest(".demo").querySelector("code").textContent);b.textContent="Copied";setTimeout(()=>b.textContent="Copy",1200);});});
  var sn=document.querySelector(".sidenav");if(sn&&matchMedia("(min-width:900px)").matches)sn.open=true;
`;

/* Collapsible-on-mobile, sticky-on-desktop section menu (JS-off: opens on tap). */
function sideNav(groups, currentFile) {
  let body = "";
  for (const [label, items] of groups) {
    if (label) body += `<p class="eyebrow">${esc(label)}</p>`;
    for (const [href, text] of items)
      body += `<a href="${href}"${href === currentFile ? ' aria-current="page"' : ""}>${esc(text)}</a>`;
  }
  return `<details class="sidenav"><summary>Menu</summary><div class="sidenav__body">${body}</div></details>`;
}

const KIT_VERSION = JSON.parse(read(join(ROOT, "package.json"))).version;
const header = read(join(SRC, "partials/header.html")).replaceAll("{{VERSION}}", KIT_VERSION);
const footer = read(join(SRC, "partials/footer.html")).replaceAll("{{VERSION}}", KIT_VERSION).replaceAll("{{YEAR}}", String(new Date().getFullYear()));

function shell({ title, content, depth, active, sidebar }) {
  const rel = "../".repeat(depth);
  let hdr = header.replaceAll("{{REL}}", rel);
  for (const k of ["home", "foundations", "components", "frameworks", "themes", "admin", "install"]) {
    hdr = hdr.replace(`{{CUR_${k}}}`, k === active ? ' aria-current="page"' : "");
  }
  const main = sidebar
    ? `<div class="docwrap">\n${sidebar}\n<div class="doccontent">\n${content}\n</div>\n</div>`
    : content;
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Novus Design Kit</title>
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFFFFF">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0B1620">
<link rel="icon" type="image/png" sizes="512x512" href="${rel}assets/novus-favicon.png">
<link rel="apple-touch-icon" href="${rel}assets/novus-favicon.png">
<link rel="manifest" href="${rel}manifest.webmanifest">
<link rel="stylesheet" href="${rel}tokens.css">
<script src="${rel}js/novus-theme.js"></script>
<style>${SITE_CSS}</style>
</head>
<body>
${hdr}
<main class="appmain site-main">
${main}
</main>
${footer.replaceAll("{{REL}}", rel)}
<script>${COPY_JS}</script>
</body>
</html>
`;
  /* Nav/link placeholders resolve to the FIRST PUBLISHED guide of each section,
     so an unshipped guide (FR-017) never leaves a dead nav entry. */
  return page
    .replaceAll("{{NAV_FW}}", `${rel}frameworks/${FW_FIRST}`)
    .replaceAll("{{NAV_TH}}", `${rel}themes/${TH_FIRST}`);
}

function writePage(outPath, page) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, page);
}

/* ---- build ---------------------------------------------------------------- */
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

/* Runtime assets: the site consumes the SAME files the package publishes. */
cpSync(join(ROOT, "tokens.css"), join(DIST, "tokens.css"));
for (const dir of ["fonts", "logos", "photos", "js"]) cpSync(join(ROOT, dir), join(DIST, dir), { recursive: true });
/* Site-only assets (verified-sample screenshots); not part of the npm package */
if (existsSync(join(SRC, "assets"))) cpSync(join(SRC, "assets"), join(DIST, "assets"), { recursive: true });
if (existsSync(join(SRC, "manifest.webmanifest"))) cpSync(join(SRC, "manifest.webmanifest"), join(DIST, "manifest.webmanifest"));
/* Live demos (feature 003): copy when their build output exists; CI always builds them */
const DEMOS = [
  [join(ROOT, "admin-kits/tailwind/dist"), join(DIST, "demos/tailwind")],
  [join(ROOT, "admin-kits/blazor-demo/bin/Release/net10.0/publish/wwwroot"), join(DIST, "demos/blazor")],
];
for (const [from, to] of DEMOS) if (existsSync(from)) { cpSync(from, to, { recursive: true }); console.log("demo copied:", to.slice(DIST.length + 1)); }
/* .NET publish sometimes leaves references unfingerprinted while shipping
   fingerprinted files (environment-dependent). Repair any reference in the demo
   host page whose target is missing but has a fingerprinted sibling. */
{
  const bIndex = join(DIST, "demos/blazor/index.html");
  if (existsSync(bIndex)) {
    let html = read(bIndex);
    let changed = false;
    for (const m of [...html.matchAll(/(?:href|src)="([^"]+)"/g)]) {
      const u = m[1];
      if (/^(https?:|data:|#)/.test(u)) continue;
      const target = join(DIST, "demos/blazor", u);
      if (existsSync(target)) continue;
      const dir = dirname(target);
      const base = basename(u);
      const dot = base.lastIndexOf(".");
      if (dot < 1 || !existsSync(dir)) continue;
      const stem = base.slice(0, dot), ext = base.slice(dot);
      const real = readdirSync(dir).find((f) => f !== base && f.startsWith(stem + ".") && f.endsWith(ext) && !f.endsWith(".br") && !f.endsWith(".gz"));
      if (real) {
        html = html.replaceAll(u, u.slice(0, u.length - base.length) + real);
        changed = true;
        console.log("demo ref repaired:", base, "->", real);
      }
    }
    if (changed) writeFileSync(bIndex, html);
  }
}

const built = [];

/* FR-017: a guide that has not passed verification does not ship.
   Publication is driven by the verification record. */
const VERIFY_REC = join(ROOT, "specs/001-novus-design-kit/checklists/guide-verification.md");
const verifiedGuides = new Set();
if (existsSync(VERIFY_REC)) {
  for (const m of read(VERIFY_REC).matchAll(/^\| *([a-z0-9-]+) *\|.*\| *pass *\|$/gm)) verifiedGuides.add(m[1]);
}
const GUIDE_SECTIONS = [
  ["frameworks", "Frameworks", [
    ["blazor.html", "Blazor"],
    ["react.html", "React"],
    ["vite.html", "Vite"],
    ["vue.html", "Vue.js"],
  ]],
  ["themes", "Themes", [
    ["tailwind.html", "Tailwind CSS"],
    ["fluent2.html", "Fluent 2"],
    ["material.html", "Material"],
    ["antd.html", "Ant Design"],
  ]],
];
const publishedGuides = {};
for (const [dir, , pages] of GUIDE_SECTIONS) {
  publishedGuides[dir] = pages.filter(
    ([f]) => existsSync(join(SRC, dir, f)) && verifiedGuides.has(basename(f, ".html"))
  );
  for (const [f] of pages.filter(([f]) => existsSync(join(SRC, dir, f)) && !verifiedGuides.has(basename(f, ".html"))))
    console.log(`SKIPPED (unverified per FR-017): ${dir}/${f}`);
}
const FW_FIRST = publishedGuides.frameworks?.[0]?.[0] ?? "blazor.html";
const TH_FIRST = publishedGuides.themes?.[0]?.[0] ?? "tailwind.html";

/* Root pages (landing, install) */
for (const name of ["index.html", "install.html", "admin-kit.html"]) {
  const p = join(SRC, name);
  if (!existsSync(p)) continue;
  const raw = read(p);
  const title = (raw.match(/<!--\s*title:\s*(.+?)\s*-->/) || [, basename(name, ".html")])[1];
  writePage(join(DIST, name), shell({ title, content: transformDemos(raw), depth: 0, active: name === "index.html" ? "home" : name === "admin-kit.html" ? "admin" : "install" }));
  built.push(name);
}

/* Foundations — fixed reading order drives the section subnav */
const FOUNDATIONS = [
  ["principles.html", "Principles"],
  ["color.html", "Color"],
  ["typography.html", "Typography"],
  ["layout.html", "Spacing & layout"],
  ["actions.html", "Actions & placement"],
  ["logos.html", "Logos"],
  ["photography.html", "Photography"],
  ["dark-mode.html", "Dark mode"],
  ["assets.html", "Asset index"],
];
const foundDir = join(SRC, "foundations");
if (existsSync(foundDir)) {
  const present = FOUNDATIONS.filter(([f]) => existsSync(join(foundDir, f)));
  for (const extra of readdirSync(foundDir).filter((f) => f.endsWith(".html") && !FOUNDATIONS.some(([k]) => k === f)))
    present.push([extra, basename(extra, ".html")]);
  for (const [f, label] of present) {
    let raw = read(join(foundDir, f));
    if (raw.includes("<!--ASSET-INDEX-->")) raw = raw.replace("<!--ASSET-INDEX-->", assetIndex());
    const title = (raw.match(/<!--\s*title:\s*(.+?)\s*-->/) || [, label])[1];
    const sidebar = sideNav([["Foundations", present.map(([g, l]) => [g, l])]], f);
    writePage(join(DIST, "foundations", f), shell({ title, content: transformDemos(raw), depth: 1, active: "foundations", sidebar }));
    built.push(`foundations/${f}`);
  }
}

/* Integration guides — framework stacks and UI-library themes (constitution VI);
   only guides the verification record marks "pass" are published (FR-017). */
for (const [dir, label] of GUIDE_SECTIONS) {
  const present = publishedGuides[dir];
  for (const [f, name] of present) {
    const raw = read(join(SRC, dir, f));
    const title = (raw.match(/<!--\s*title:\s*(.+?)\s*-->/) || [, name])[1];
    const sidebar = sideNav([[label, present.map(([g, l]) => [g, l])]], f);
    writePage(join(DIST, dir, f), shell({ title, content: transformDemos(raw), depth: 1, active: dir, sidebar }));
    built.push(`${dir}/${f}`);
  }
}

/* Components: manifest-driven overview + detail pages */
const manifestPath = join(SITE, "components.json");
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(read(manifestPath));
  const comps = manifest.components;

  for (const c of comps) {
    if (!existsSync(join(SITE, c.fragment)))
      throw new Error(`components.json: fragment missing for "${c.id}": site/${c.fragment}`);
  }

  /* Section menu: Overview + every component, grouped by category (ant.design style) */
  const compGroups = [["", [["overview.html", "Overview"]]]].concat(
    manifest.categories
      .map((cat) => [cat, comps.filter((c) => c.category === cat).map((c) => [`${c.id}.html`, c.name])])
      .filter(([, items]) => items.length)
  );

  /* Detail pages, with prev/next inside each category */
  comps.forEach((c) => {
    const inCat = comps.filter((x) => x.category === c.category);
    const pos = inCat.indexOf(c);
    const prev = inCat[pos - 1], next = inCat[pos + 1];
    const frag = transformDemos(read(join(SITE, c.fragment)));
    const content = `
<p class="eyebrow">${esc(c.category)}</p>
<h1>${esc(c.name)}</h1>
<p>${esc(c.summary)}</p>
<p class="classlist">${c.classes.map((k) => `<code>${esc(k)}</code>`).join(" · ")}</p>
<div class="pvtoggle" role="group" aria-label="Preview width">
  <input type="radio" name="pv" id="pv-web" checked><label for="pv-web">Web</label>
  <input type="radio" name="pv" id="pv-mobile"><label for="pv-mobile">Mobile 375px</label>
</div>
${frag}
<div class="pagenav">
  <span>${prev ? `<a href="${prev.id}.html">‹ ${esc(prev.name)}</a>` : ""}</span>
  <span>${next ? `<a href="${next.id}.html">${esc(next.name)} ›</a>` : ""}</span>
</div>`;
    writePage(join(DIST, "components", `${c.id}.html`), shell({ title: c.name, content, depth: 1, active: "components", sidebar: sideNav(compGroups, `${c.id}.html`) }));
    built.push(`components/${c.id}.html`);
  });

  /* Overview grid — preview auto-derived from each fragment's FIRST demo (no duplication).
     Lives at overview.html, NEVER index.html: clean-URL servers serve a subdirectory
     index.html at "/components" (no trailing slash), which breaks every relative link
     on the page (root cause of the detail-page 404s). */
  let ov = `<h1>Components</h1>\n<p>All ${comps.length} components the kit ships, by category. Each page carries live examples, a copyable snippet per example, and usage guidance.</p>`;

  /* Search (progressive: with JS off the input stays inert and the full catalog shows) */
  ov += `
<div class="field" style="max-width:28rem">
  <label for="compsearch">Search components</label>
  <input class="input" id="compsearch" type="search" placeholder="button, table, date" autocomplete="off">
</div>
<p class="muted" id="compempty" hidden>No components match. Clear the search to see the full catalog.</p>`;

  /* Choose by function: suggested component sets per job */
  const FUNCTIONS = [
    ["Dashboards", "KPI rows, signal cards, and dense tables over one accent.", ["stats", "card", "table", "badge", "grid-row", "app-shell"]],
    ["Forms", "Labelled fields with native pickers and one primary action.", ["field-input", "dropdown", "date-picker", "button", "alert"]],
    ["Data display", "Tables, month views, and progressive disclosure for dense records.", ["table", "calendar", "stats", "bullets", "collapse"]],
    ["Navigation", "Shells, section menus, and staged flows.", ["nav", "stepper", "app-shell", "button"]],
    ["Feedback and status", "Judgement colors only where a judgement exists.", ["alert", "modal", "badge"]],
  ];
  const byId = Object.fromEntries(comps.map((c) => [c.id, c]));
  for (const [, , ids] of FUNCTIONS) for (const id of ids)
    if (!byId[id]) throw new Error(`overview functions: unknown component id "${id}"`);
  ov += `\n<h2>Choose by function</h2>\n<p>Start from the job; each set links the components that do it.</p>\n<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-bottom:var(--space-6)">`;
  for (const [job, blurb, ids] of FUNCTIONS) {
    ov += `
<div class="card">
  <h3>${esc(job)}</h3>
  <p class="muted">${esc(blurb)}</p>
  <div class="chiprow">${ids.map((id) => `<a href="${id}.html">${esc(byId[id].name)}</a>`).join("")}</div>
</div>`;
  }
  ov += `\n</div>`;

  for (const cat of manifest.categories) {
    const inCat = comps.filter((c) => c.category === cat);
    if (!inCat.length) continue;
    ov += `\n<h2 class="ovhead" id="${cat.toLowerCase().replace(/[^a-z]+/g, "-")}">${esc(cat)}</h2>\n<div class="ovgrid">`;
    for (const c of inCat) {
      const first = read(join(SITE, c.fragment)).match(/<section class="demo"[^>]*>([\s\S]*?)<\/section>/);
      const hay = esc(`${c.name} ${c.summary} ${c.classes.join(" ")}`.toLowerCase());
      ov += `
<div class="card card--interactive ovcard" data-search="${hay}">
  <div class="ovcard__preview" aria-hidden="true">${first ? first[1] : ""}</div>
  <div class="ovcard__meta"><b>${esc(c.name)}</b><span>${esc(c.summary)}</span></div>
  <a class="card-trigger" href="${c.id}.html" aria-label="${esc(c.name)}"></a>
</div>`;
    }
    ov += `\n</div>`;
  }
  ov += `
<script>
(function () {
  var q = document.getElementById("compsearch");
  if (!q) return;
  var cards = [].slice.call(document.querySelectorAll(".ovcard"));
  var heads = [].slice.call(document.querySelectorAll(".ovhead"));
  var empty = document.getElementById("compempty");
  q.addEventListener("input", function () {
    var v = q.value.trim().toLowerCase();
    cards.forEach(function (c) { c.hidden = !!v && c.getAttribute("data-search").indexOf(v) === -1; });
    heads.forEach(function (h) {
      var grid = h.nextElementSibling;
      var any = [].slice.call(grid.children).some(function (c) { return !c.hidden; });
      h.hidden = !any; grid.hidden = !any;
    });
    empty.hidden = cards.some(function (c) { return !c.hidden; });
  });
})();
</script>`;
  writePage(join(DIST, "components", "overview.html"), shell({ title: "Components", content: ov, depth: 1, active: "components", sidebar: sideNav(compGroups, "overview.html") }));
  built.push("components/overview.html");

  /* Redirect stub for anyone landing on /components or /components/ — never a content page. */
  writeFileSync(join(DIST, "components", "index.html"), `<!DOCTYPE html><!--redirect-stub-->
<html lang="en"><head><meta charset="utf-8"><title>Components · Novus Design Kit</title>
<script>location.replace(location.pathname.replace(/\\/?(index(\\.html)?)?$/, "/overview.html"));</script>
</head><body><p><a href="overview.html">Component overview</a></p></body></html>
`);
}

/* Post-build gates: every internal link resolves, and no subdirectory carries a
   content index.html (clean-URL servers break relative links on those pages). */
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  );
}
const broken = [];
for (const p of walk(DIST).filter((p) => p.endsWith(".html") && !p.includes("/demos/"))) {
  const html = read(p).replace(/<pre[\s\S]*?<\/pre>/g, ""); // code samples aren't links
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m.group?.(1) ?? m[1];
    if (/^(https?:|#|mailto:|data:)/.test(u)) continue;
    const target = join(dirname(p), u.split("#")[0]);
    if (!existsSync(target)) broken.push(`${p.slice(DIST.length + 1)} → ${u}`);
  }
  if (basename(p) === "index.html" && dirname(p) !== DIST && !read(p).includes("<!--redirect-stub-->"))
    broken.push(`${p.slice(DIST.length + 1)}: content page named index.html in a subdirectory`);
}
if (broken.length) throw new Error(`Link gate failed:\n  ${broken.join("\n  ")}`);
console.log("Link gate: all internal links resolve; no subdirectory content index pages.");

/* Asset index — enumerated from the package's real asset trees at build time */
function assetIndex() {
  const sets = [
    ["Master logo & wordmark", "logos", (f) => f.endsWith(".png") && f.startsWith("Novus_Logo_")],
    ["Product & platform lockups", "logos/lockups", (f) => f.endsWith(".png")],
    ["Pictographs (SVG)", "logos/icons", (f) => f.endsWith(".svg")],
    ["Pictographs (pre-tinted PNG)", "logos/icons/png", (f) => f.endsWith(".png")],
    ["Client marks (repository-only: not in the npm package)", "logos/clients", (f) => /\.(png|jpe?g)$/i.test(f)],
    ["Scheme & rail marks (repository-only: not in the npm package)", "logos/schemes", (f) => /\.(png|jpe?g)$/i.test(f)],
    ["Photography", "photos", (f) => /\.(png|jpe?g)$/i.test(f)],
  ];
  let html = "";
  for (const [label, dir, keep] of sets) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    const files = readdirSync(abs).filter((f) => keep(f)).sort();
    if (!files.length) continue;
    const photo = dir === "photos";
    html += `\n<h3>${label}</h3>\n<div class="assetgrid">`;
    for (const f of files) {
      html += `\n<div class="clogo${photo ? " clogo--photo" : ""}"><img src="../${dir}/${f}" alt="${esc(f)}" loading="lazy"><code>novus-design-kit/${dir}/${f}</code></div>`;
    }
    html += `\n</div>`;
  }
  return html;
}

console.log(`Built ${built.length} pages → site/dist/`);
if (!built.length) throw new Error("No pages built — site/src is empty");
