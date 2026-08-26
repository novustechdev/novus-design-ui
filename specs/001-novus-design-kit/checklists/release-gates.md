# Release Gates — 0.1.0 record

**Date**: 2026-08-26 · **Site**: 33 pages (landing, install, 8 foundations, overview + 22 component pages)

## Automated (scripts/gates.sh — exit 0, verified this run)

- [x] Gradient grep — zero in authored output
- [x] Ad-hoc hex audit — zero in site/src and js/
- [x] Radius audit — every border-radius is `var(--radius-*)`
- [x] Font-size audit — every font-size is `var(--text-*)`
- [x] SaaS-string grep — zero (incl. negations); model stated as Service as Software
- [x] CJK leak grep — zero
- [x] Manifest ↔ fragment ↔ built page — complete both directions (22/22)
- [x] Orphan-class check — every web block in tokens.css owned by one catalog entry

## Structural (verified by construction / inspection this run)

- [x] Dark parity structure: all site-authored dark rules mirrored under `[data-theme="dark"]` AND `prefers-color-scheme` (toggle icons, logo swap); tokens.css carries the component layer
- [x] JS-off: nav is plain links; disclosure uses `<details>`; theme toggle button is `hidden` until JS reveals it (no dead control); OS dark preference styles everything without JS
- [x] Hover audit: every hover-lifting card carries a `.card-trigger`; static tiles (stats, logo walls, value chain) have no hover treatment
- [x] Snippet fidelity (SC-005): snippets are generated from the live example markup — identical by construction
- [x] Drift check: tokens.css, woff2 fonts, logos/, photos/ byte-identical to the reference snapshot (ttf/ deliberately not shipped)
- [x] `npm publish --dry-run`: 121 files, 5.8 MB unpacked, allowlist only

## Browser pass (T027 — executed 2026-08-26 against the LIVE site via Chromium/CDP)

- [x] Dark parity, toggle: `data-theme=dark` applies, body ground `#0B1620`, master logo swaps colour→white, choice persists across reload
- [x] Dark parity, OS-dark + JS off: dark ground + light text `#E7EDF3` (AA per token spec), white logo, and the toggle button stays hidden (no dead control)
- [x] 375px: zero horizontal overflow on landing, overview, table page, color page, antd theme page, install; mobile section menu opens
- [x] Touch targets: theme toggle measured 42×31px (under the 44px floor) → fixed with a 44px min size on the toggle; all other controls are links/buttons at ≥44px rows
- [x] Carlito confirmed as the computed body font (live pages and all sample apps)
- [ ] Human spot check on real devices remains worthwhile before wide announcement (colour perception, hover feel); no blocking findings from the automated pass

## Ops handoff (before first real publish)

- [x] Registry finalized: GitHub Packages (npm.pkg.github.com), publishConfig set; v0.1.0 published 2026-08-26
- [x] Published: novus-design-kit@0.1.0 (private visibility), install verified from a fresh project
