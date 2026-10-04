/* The product mark registry: the four marks the consoles drew, moved unchanged; the eight new
   ones in the same style; every colour a palette token that passes contrast with white and
   stays distinguishable from the other eleven; and the placed SVG assets agreeing with it. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load, palette, ROOT } from "./load.mjs";

const M = load("js/novus-app-marks.js").NovusAppMarks;
const P = palette();
const hex = (id) => P[M.get(id).token];

/* The four marks exactly as novabank, novahub and novatrace drew them before this registry. */
const MOVED = {
  novabank: ["#00A04A", '<path d="M3 9.5 12 4l9 5.5"/><path d="M5.5 10.5v7M10 10.5v7M14 10.5v7M18.5 10.5v7"/><path d="M3 20h18"/>'],
  novahub: ["#0070C0", '<circle cx="12" cy="12" r="2.6"/><circle cx="5" cy="5" r="1.8"/><circle cx="19" cy="5" r="1.8"/><circle cx="5" cy="19" r="1.8"/><circle cx="19" cy="19" r="1.8"/><path d="M6.4 6.4 10 10M17.6 6.4 14 10M6.4 17.6 10 14M17.6 17.6 14 14"/>'],
  novacard: ["#534AB7", '<rect x="3" y="6" width="18" height="12" rx="2.2"/><path d="M3 10.2h18M7 14.6h4"/>'],
  novatrace: ["#D46420", '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>'],
};
const NEW = ["novaplan", "novasearch", "novaticket", "novaedge", "novus-id", "design-kit", "ibanking", "mbanking", "nova-lending"];

function channel(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function rgb(h) { return [1, 3, 5].map((i) => channel(parseInt(h.slice(i, i + 2), 16))); }
function luminance(h) { const [r, g, b] = rgb(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function lab(h) {
  const [r, g, b] = rgb(h);
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
  const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

test("the registry holds the four moved marks and the eight new ones, in that order", () => {
  assert.deepEqual(Array.from(M.ids()), [...Object.keys(MOVED), ...NEW]);
});

test("the four moved marks keep their colours and glyphs to the letter", () => {
  for (const [id, [colour, glyph]] of Object.entries(MOVED)) {
    assert.equal(hex(id), colour, id);
    assert.equal(M.get(id).glyph, glyph, id);
  }
});

test("every colour is a palette token, named by reference and never as a literal", () => {
  for (const id of M.ids()) {
    const mark = M.get(id);
    assert.match(mark.token, /^--(blue|green|amber|red|indigo|orange)-\d+$/, id);
    assert.ok(P[mark.token], `${id}: ${mark.token} is not in tokens.css`);
    assert.equal(mark.colour, `var(${mark.token})`);
  }
  assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(readFileSync(join(ROOT, "js/novus-app-marks.js"), "utf8")));
});

test("white passes contrast on every mark, and every pair of marks stays distinguishable", () => {
  const all = Array.from(M.ids());
  for (const id of all) {
    const ratio = 1.05 / (luminance(hex(id)) + 0.05);
    assert.ok(ratio >= 3, `${id} ${hex(id)} gives white ${ratio.toFixed(2)}:1, under 3:1`);
  }
  assert.equal(new Set(all.map(hex)).size, all.length);
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = lab(hex(all[i])), b = lab(hex(all[j]));
    const distance = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    assert.ok(distance >= 20, `${all[i]} and ${all[j]} are ${distance.toFixed(1)} apart in Lab, under 20`);
  }
  const grey = M.unknown.token;
  assert.ok(1.05 / (luminance(P[grey]) + 0.05) >= 4.5, "an initial on the unknown grey must read as text");
});

test("every glyph is plain line geometry in the 24-unit style", () => {
  for (const id of M.ids()) {
    const glyph = M.get(id).glyph;
    assert.match(glyph, /^(<(path|circle|rect) [^<>]*\/>)+$/, id);
    assert.ok(!/fill=|stroke=|style=|on[a-z]+=/i.test(glyph), `${id} carries its own paint or behaviour`);
    const svg = M.svg(id, 26);
    assert.match(svg, /viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1\.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"/);
  }
  assert.equal(M.svg("nothing-here"), "");
  assert.equal(M.has("constructor"), false);
  assert.equal(M.get("__proto__"), undefined);
});

test("logos/marks carries each mark as a placed asset that agrees with the registry", () => {
  for (const id of M.ids()) {
    const path = join(ROOT, "logos/marks", `${id}.svg`);
    assert.ok(existsSync(path), `${path} is missing; run node admin-kits/data/generate.mjs`);
    const svg = readFileSync(path, "utf8");
    assert.ok(svg.includes(`fill="${hex(id)}"`), `${id}.svg ground`);
    assert.ok(svg.includes(`stroke="${P["--neutral-0"]}" stroke-width="1.8"`), `${id}.svg glyph paint`);
    assert.ok(svg.includes(M.get(id).glyph), `${id}.svg glyph`);
  }
});
