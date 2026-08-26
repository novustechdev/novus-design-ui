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
  .sitefoot{margin-top:var(--space-8);}
  @media (max-width:520px){ .pagenav{flex-direction:column;} }
`;

const COPY_JS = `
  document.querySelectorAll("[data-theme-toggle]").forEach(b=>{b.hidden=false;b.addEventListener("click",()=>window.novusTheme&&window.novusTheme.toggle());});
  if(navigator.clipboard)document.querySelectorAll(".demo__copy").forEach(b=>{b.hidden=false;b.addEventListener("click",()=>{navigator.clipboard.writeText(b.closest(".demo").querySelector("code").textContent);b.textContent="Copied";setTimeout(()=>b.textContent="Copy",1200);});});
`;

const header = read(join(SRC, "partials/header.html"));
const footer = read(join(SRC, "partials/footer.html"));

function shell({ title, content, depth, active }) {
  const rel = "../".repeat(depth);
  let hdr = header.replaceAll("{{REL}}", rel);
  for (const k of ["home", "foundations", "components", "install"]) {
    hdr = hdr.replace(`{{CUR_${k}}}`, k === active ? ' aria-current="page"' : "");
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — Novus Design Kit</title>
<link rel="stylesheet" href="${rel}tokens.css">
<script src="${rel}js/novus-theme.js"></script>
<style>${SITE_CSS}</style>
</head>
<body>
${hdr}
<main class="appmain site-main">
${content}
</main>
${footer.replaceAll("{{REL}}", rel)}
<script>${COPY_JS}</script>
</body>
</html>
`;
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

const built = [];

/* Root pages (landing, install) */
for (const name of ["index.html", "install.html"]) {
  const p = join(SRC, name);
  if (!existsSync(p)) continue;
  const raw = read(p);
  const title = (raw.match(/<!--\s*title:\s*(.+?)\s*-->/) || [, basename(name, ".html")])[1];
  writePage(join(DIST, name), shell({ title, content: transformDemos(raw), depth: 0, active: name === "index.html" ? "home" : "install" }));
  built.push(name);
}

/* Foundations */
const foundDir = join(SRC, "foundations");
if (existsSync(foundDir)) {
  for (const f of readdirSync(foundDir).filter((f) => f.endsWith(".html")).sort()) {
    let raw = read(join(foundDir, f));
    if (raw.includes("<!--ASSET-INDEX-->")) raw = raw.replace("<!--ASSET-INDEX-->", assetIndex());
    const title = (raw.match(/<!--\s*title:\s*(.+?)\s*-->/) || [, basename(f, ".html")])[1];
    writePage(join(DIST, "foundations", f), shell({ title, content: transformDemos(raw), depth: 1, active: "foundations" }));
    built.push(`foundations/${f}`);
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

  /* Detail pages, with prev/next inside each category */
  comps.forEach((c, i) => {
    const inCat = comps.filter((x) => x.category === c.category);
    const pos = inCat.indexOf(c);
    const prev = inCat[pos - 1], next = inCat[pos + 1];
    const frag = transformDemos(read(join(SITE, c.fragment)));
    const content = `
<p class="eyebrow">${esc(c.category)}</p>
<h1>${esc(c.name)}</h1>
<p>${esc(c.summary)}</p>
<p class="classlist">${c.classes.map((k) => `<code>${esc(k)}</code>`).join(" · ")}</p>
${frag}
<div class="pagenav">
  <span>${prev ? `<a href="${prev.id}.html">‹ ${esc(prev.name)}</a>` : ""}</span>
  <span>${next ? `<a href="${next.id}.html">${esc(next.name)} ›</a>` : ""}</span>
</div>`;
    writePage(join(DIST, "components", `${c.id}.html`), shell({ title: c.name, content, depth: 1, active: "components" }));
    built.push(`components/${c.id}.html`);
  });

  /* Overview grid — preview auto-derived from each fragment's FIRST demo (no duplication) */
  let ov = `<h1>Components</h1>\n<p>Every component the kit ships, by category. Each page carries live examples, a copyable snippet per example, and usage guidance.</p>`;
  for (const cat of manifest.categories) {
    const inCat = comps.filter((c) => c.category === cat);
    if (!inCat.length) continue;
    ov += `\n<h2>${esc(cat)}</h2>\n<div class="ovgrid">`;
    for (const c of inCat) {
      const first = read(join(SITE, c.fragment)).match(/<section class="demo"[^>]*>([\s\S]*?)<\/section>/);
      ov += `
<div class="card card--interactive ovcard">
  <div class="ovcard__preview" aria-hidden="true">${first ? first[1] : ""}</div>
  <div class="ovcard__meta"><b>${esc(c.name)}</b><span>${esc(c.summary)}</span></div>
  <a class="card-trigger" href="${c.id}.html" aria-label="${esc(c.name)}"></a>
</div>`;
    }
    ov += `\n</div>`;
  }
  writePage(join(DIST, "components", "index.html"), shell({ title: "Components", content: ov, depth: 1, active: "components" }));
  built.push("components/index.html");
}

/* Asset index — enumerated from the package's real asset trees at build time */
function assetIndex() {
  const sets = [
    ["Master logo & wordmark", "logos", (f) => f.endsWith(".png") && f.startsWith("Novus_Logo_")],
    ["Product & platform lockups", "logos/lockups", (f) => f.endsWith(".png")],
    ["Pictographs (SVG)", "logos/icons", (f) => f.endsWith(".svg")],
    ["Pictographs (pre-tinted PNG)", "logos/icons/png", (f) => f.endsWith(".png")],
    ["Client marks", "logos/clients", (f) => /\.(png|jpe?g)$/i.test(f)],
    ["Scheme & rail marks", "logos/schemes", (f) => /\.(png|jpe?g)$/i.test(f)],
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
      html += `\n<div class="clogo${photo ? " clogo--photo" : ""}"><img src="../${dir}/${f}" alt="${esc(f)}" loading="lazy"><code>@novus/design-kit/${dir}/${f}</code></div>`;
    }
    html += `\n</div>`;
  }
  return html;
}

console.log(`Built ${built.length} pages → site/dist/`);
if (!built.length) throw new Error("No pages built — site/src is empty");
