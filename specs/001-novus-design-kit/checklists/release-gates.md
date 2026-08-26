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

## Browser pass (human step before first publish — quickstart.md §4)

- [ ] Dark parity by eye: toggle AND OS-dark + JS off — no dark-on-dark text, logo swaps white, lockups go light-blue
- [ ] 375px: no horizontal scroll on any page, ≥44px touch targets
- [ ] Contrast spot check ≥4.5:1 both themes; visible focus on all interactive elements
- [ ] Carlito renders with no fallback flash

## Ops handoff (before first real publish)

- [ ] Replace `publishConfig.registry` placeholder in package.json with the real private feed URL (DevOps)
- [ ] Publish from a state where all boxes above are checked
