# Tasks: One Novus App Switcher, Top Left

- [x] T001 Spec (D1–D6), with the owner's choices: the apps the workspace adds, run-time sync, and
      the destination menu folded into search
- [x] T002 `js/novus-app-marks.js` and `logos/marks/*.svg`: the four product marks, then the eight new
      marks in the same style
- [x] T003 `js/novus-app-switcher.js`: the element, the catalog fetch with its 3 s bound, the cache,
      the static fallback, the claims filter, the host allow-list, recents, keyboard and focus
- [ ] T004 `console.css` `.nv-apps*`: button, panel, search, grid, tiles, "All apps", phone sheet, both
      themes, reduced motion; the header rule "nothing to the left of the app switcher"
- [ ] T005 Both shells' reference markup and `site/` demo with a sample catalog; `files` and `exports`
      in `package.json`
- [ ] T006 Tests: unit (filter, allow-list, fallback order, recents), layout audit and axe at 390,
      1366 and 1920 px in both themes, keyboard walk
- [ ] T007 CHANGELOG, a minor version, and the npm publish
- [ ] T008 Adoption, in each console's own repository (D6): novabank, novahub, novatrace, novacard
