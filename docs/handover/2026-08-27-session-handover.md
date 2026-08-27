# Handover — Novus Design Kit — 2026-08-27

## Where we are

Docs live at https://ui-kit.novustech.dev (GitHub Pages + Cloudflare, HTTPS), package
public on npm as `novus-design-kit` v0.2.0, all 15 gates green. The Admin Kit ships in
two flavors (Blazor Server + Vite/Tailwind) with a WASM demo twin hosted at
/demos/blazor/ and the Tailwind build at /demos/tailwind/. Constitution is at 1.6.0
(functional motion allowed); active speckit feature is specs/003-adminkit-charts-demos.

## Done this session

- Icon theme toggle (moon/sun swap under both dark triggers) replaced the text
  "Theme" button in all flavors and the demo; novapay lockup header everywhere.
- Login page brandmark made visible (`.logincard .brandmark { display: block }`);
  login redirect hardened to `Nav.NavigateTo(Nav.BaseUri)`; live-verified landing on
  /demos/blazor/ after admin/admin.
- Mobile header rules (suffix hides, endorsement steps to 20px below 520px) fixed a
  375px overflow (scrollWidth was 496, now 375 in both flavors).
- Constitution 1.5.1 → 1.6.0: Principle II motion rule expanded to functional
  state-change motion (0.2s or less, reduced-motion aware), owner request.
- Animated nav links + native radio-based tabs component in shared `admin.css`
  (all three copies: tailwind/src, blazor/wwwroot, blazor-demo/wwwroot).
- Settings rebuilt as a tabbed screen (Profile, Appearance, Notifications, API
  access) with parity: `admin-kits/tailwind/settings.html`,
  `admin-kits/blazor/Components/Pages/Settings.razor`,
  `admin-kits/blazor-demo/Pages/Settings.razor`. Tabs work with JS off (radio +
  `:has`; stacked fallback).
- Admin Kit docs page: new Getting started section (Path A clone/ZIP + copy a
  flavor folder; Path B npm install into an existing app), settings screenshots
  added to both flavor grids, screens list updated.
- Speckit: tasks T027–T033 recorded in specs/003 tasks.md; verification record
  appended in specs/002-novus-admin-kit/checklists/verification.md.

## Verify

- [ ] Live site after this session's deploy: Getting started section renders on
  /admin-kit.html, settings screenshots load, live demo settings pages switch tabs.
- [ ] User confirms login redirect fixed in their browser (hard refresh clears the
  previously cached WASM bundle).

## Open items

- None blocking. Optional: retake the full 12-screenshot set if header/tab styling
  changes again (scripts in scratchpad/tools: admin-shots.mjs, new-shots.mjs — ports
  5850/5851; scratchpad is session-specific, so recreate from memory/project_operations.md
  in a new session).

## Next session: start here

1. Read memory/MEMORY.md + linked topic notes, then this file.
2. If the user reported anything about the live site, check
   https://ui-kit.novustech.dev with cache-busting (?cb=) before changing code:
   Pages CDN caches around 10 minutes and browsers cache the WASM bundle.
3. Commits are authored as sgultom99 with NO assistant trailers; deploy via
   `gh workflow run pages.yml --repo novustechdev/novus-design-ui --ref main` and watch
   the run selected by headSha.

## Addendum, same day: v0.3.0 release + favicons

- Favicons shipped from official assets (docs: master-logo N-glyph crop at
  assets/novus-favicon.png, also the manifest icon; demos: novapay pictograph).
- CHANGELOG.md brought current; Changelog link in the site footer.
- Constitution 1.7.0: Governance release rule (changelog + all version references
  updated with every tagged release; tarball attached; npm publish recorded as
  pending until the owner runs it).
- v0.3.0 tagged and released with the tarball attached; package.json at 0.3.0.
- OPEN: npm publish of 0.3.0 needs the owner (passkey): `npm publish` from the
  repo root. npm currently serves 0.2.0 (kit files identical, README/CHANGELOG
  only differences).
