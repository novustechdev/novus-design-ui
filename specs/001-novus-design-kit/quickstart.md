# Quickstart: validating the Novus Design Kit

Runnable checks that prove the feature works end-to-end. Contracts:
[package-exports.md](contracts/package-exports.md),
[component-classes.md](contracts/component-classes.md).

## Prerequisites

- Node.js ≥ 20 (build script + npm pack only; no dependencies to install)
- A browser for the manual gates

## 1. Build the reference site

```bash
node site/build.mjs
```

**Expected**: `site/dist/` contains the landing page, install page, 7 foundation
pages, `components/index.html`, and one detail page per `site/components.json`
entry. Exit code 0; build fails loudly if a manifest fragment is missing.

## 2. Run the automated constitution gates

```bash
scripts/gates.sh
```

**Expected**: exit 0, with each gate reported PASS:
gradient grep · ad-hoc hex/px audit · radius-outside-token-scale ·
SaaS-string grep (incl. negations) · CJK leak grep · manifest↔page completeness
(both directions) · orphan-class check.

## 3. Package install smoke test (US1 / SC-005)

```bash
npm pack                                   # produces novus-design-kit-<v>.tgz
mkdir -p /tmp/kit-smoke && cd /tmp/kit-smoke
npm init -y && npm install <path-to-tgz>
```

Create `index.html` that links
`node_modules/@sgultom99/novus-design-kit/tokens.css`, includes the theme helper script,
and pastes — unmodified — the Button, Card, and App shell snippets from the
built site. Serve statically (`npx serve` or any static server) and open it.

**Expected**:
- Carlito renders (no fallback font flash on reload), Novus Blue accent, white ground
- Each pasted component is visually indistinguishable from its reference-site example: same font, accent color, radius, border, spacing, and hover behavior
- No 404s for fonts or assets in the network panel

## 4. Manual release gates (constitution IV — human checklist)

Using the built site AND the smoke-test page:

- [ ] **Dark parity — toggle**: moon/sun toggle flips theme, choice survives reload, no dark-on-dark text, master logo swaps to white, lockups go light-blue
- [ ] **Dark parity — OS + JS off**: disable JS, set OS dark → same correct dark rendering; `<details>`/`<dialog>` components still open/close
- [ ] **375px pass**: no horizontal scroll on any page; touch targets ≥ 44px; nav usable
- [ ] **Hover audit**: every hover-elevated card is clickable (`.card-trigger`); static tiles (stats, logo wall) don't react
- [ ] **Contrast spot check**: body text ≥ 4.5:1 in both themes; visible focus state on links, buttons, inputs, toggle

## 5. Content completeness (SC-002, FR-008/009)

- [ ] Overview grid lists every manifest component with preview + working link
- [ ] Each detail page: ≥ 1 live example per documented variant, a copyable snippet per example, do/don't guidance
- [ ] Foundation pages exist for: principles, color, typography, layout, logos, photography, dark mode
- [ ] Install page carries the "Novus developers only" registry note and zero credential material

## 6. Release (when publishing)

```bash
scripts/gates.sh                           # must exit 0
# drift check on shipped files — must be identical or a deliberate versioned refresh
# (ttf/ is deliberately not shipped, so fonts are compared excluding it)
diff tokens.css references/Novus_Design_System_Kit_v2/tokens.css
diff -r -x ttf fonts references/Novus_Design_System_Kit_v2/fonts
diff -r logos  references/Novus_Design_System_Kit_v2/logos
diff -r photos references/Novus_Design_System_Kit_v2/photos
# bump version in package.json + CHANGELOG.md entry (migration note if MAJOR)
npm publish                                # to the private @novus feed
```

**Expected**: publish succeeds only from a state where steps 1–5 all pass.
