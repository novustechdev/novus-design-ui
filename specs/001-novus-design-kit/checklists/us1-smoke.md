# US1 Install Smoke Test — record

**Date**: 2026-08-26 · **Tarball**: novus-design-kit-0.1.0.tgz (121 files, 5.8 MB unpacked)

## Automated (verified this run)

- [x] `npm install <tgz>` succeeds in a fresh empty project
- [x] Tarball top-level matches the `files` allowlist exactly (no site/, specs/, references/)
- [x] `tokens.css`, theme helper, both woff2 fonts, master logos (colour + white), product lockup, photo all resolve from `node_modules/@novus/design-kit/`
- [x] Both `@font-face` relative URLs in tokens.css resolve against the installed package layout
- [x] `js/novus-theme.js` parses and installs `window.novusTheme`
- [x] Sample page authored with Button + Card + App shell patterns and the light/dark logo pair (scratchpad `kit-smoke/index.html`)

## Requires a browser (human step — see quickstart.md §3)

- [ ] Carlito renders (no fallback flash) when served statically
- [ ] Novus Blue accent / white ground in light; correct re-tuned dark via OS pref AND toggle
- [ ] Zero 404s in the network panel

## US4 asset-resolution check (T026)

- [x] Master logo (`logos/Novus_Logo_Colour_transparent.png`), product lockup (`logos/lockups/novapay.png`), and photo (`photos/novapay.jpg`) resolve from the installed package by documented path
