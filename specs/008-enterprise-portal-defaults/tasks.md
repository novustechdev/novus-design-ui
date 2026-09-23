---

description: "Task list for feature 008: enterprise portal defaults"
---

# Tasks: Enterprise portal defaults (feature 008)

**Input**: Design documents in `specs/008-enterprise-portal-defaults/`

**Tests**: No unit suite. Verification is the gate suite (with each new gate
negative-tested), the recorded verified runs required by Principle VII, and a
packaged-install check for the release.

## Phase 1: Setup

- [X] T001 Add D3 7 to `admin-kits/{tailwind,material}/package.json` and the `wwwroot/lib` copy targets in `admin-kits/{blazor,blazor-demo}/*.csproj`, removing `chart.js` from both
- [X] T002 [P] Install the new dependencies in all four flavors so the builds run offline later

## Phase 2: Foundational (governance, packaging, gates)

- [X] T003 Amend `.specify/memory/constitution.md` to 1.12.0: D3 charting standard, light default theme, ambient authentication motion exception, account menu placement, typography parity ratios, content width rule, packaged console layer, gates 12 to 14
- [X] T004 Emit packaged artifacts from `admin-kits/data/generate.mjs`: `console.css`, `js/novus-console.js`, `icons/novus-icons.svg` at the repository root, all generated from `admin-kits/shared/`
- [X] T005 Update `package.json` to 0.4.0 with `console.css` and `icons/` in `files[]`, and add the version agreement gate to `scripts/gates.sh`
- [X] T006 Add the three checks to `scripts/layout-audit.mjs`: account menu last and flush in console headers, header/navigation/body type parity with heading ratios, and text blocks that wrap beside an unused quarter of their row
- [X] T007 [P] Light default in `js/novus-theme.js` (apply light when nothing is stored, `window.novusThemeFollowOS` opt-out) and in every pre-paint snippet in the four deliverables and the docs shell

**Checkpoint**: gates run with the three new checks reporting the current baseline.

---

## Phase 3: User Story 1 - Consumers inherit by upgrading (P1)

- [X] T008 [US1] Document the console layer in `site/src/install.html` and `README.md`: import order, what it carries, the follow-the-system opt-out
- [X] T009 [US1] Verify by packing the kit and installing the tarball into a scratch project, importing only `tokens.css` and `console.css`, and rendering a sign-in plus a console shell

---

## Phase 4: User Story 2 - One typographic voice (P1)

- [X] T010 [US2] Set header, navigation and body to `--text-sm` and cap heading steps (page title `--text-xl`, section headings `--text-lg`) in `admin-kits/shared/novus-admin.css`
- [X] T011 [P] [US2] Update `site/src/foundations/typography.html` with the parity rule, the ratios, and right and wrong examples
- [X] T012 [US2] Re-run the layout audit and fix any content-fit fallout from the new sizes

---

## Phase 5: User Story 3 - Content uses its width (P2)

- [X] T013 [US3] Add the `.measure` opt-in and remove any remaining width caps on portal text in `admin-kits/shared/novus-admin.css`
- [X] T014 [P] [US3] Update `site/src/foundations/alignment.html` with the width rule beside the single-line rule
- [X] T015 [US3] Fix any page the new audit check flags across docs and deliverables

---

## Phase 6: User Story 4 - Sign-in and theme (P2)

- [X] T016 [US4] Rebuild the sign-in pattern in `admin-kits/shared/novus-admin.css`: 50/50 split, ambient line art with reduced-motion stop, single sign-on divider and action
- [X] T017 [US4] Generate the art and the single sign-on markup in `admin-kits/data/generate.mjs` so all four deliverables carry the same sign-in
- [X] T018 [P] [US4] Update `site/src/components/sign-in-page.html` with the new split, art and single sign-on, plus usage rules

---

## Phase 7: User Story 5 - D3 statistics (P2)

- [X] T019 [US5] Write `admin-kits/shared/novus-chart.js` on D3: composition bars, trajectory line, donut, token reads, dark rounded tooltip, hover and keyboard interaction, theme redraw
- [X] T020 [US5] Wire it into the four deliverables, delete the four Chart.js `novus-chart.js` copies, and drop the Chart.js script tags
- [X] T021 [US5] Give the landing page interactive statistics plus a table of the same numbers in all four deliverables
- [X] T022 [P] [US5] Update the Analytics screen copy and `site/src/admin-kit.html` for D3; remove Chart.js references from the docs

---

## Phase 8: User Story 6 - Settings layout (P3)

- [X] T023 [US6] Add the settings layout to `admin-kits/shared/novus-admin.css`: section menu, grouped sections, setting rows, phone behaviour, JS-off section switching
- [X] T024 [US6] Rebuild the Settings screen on it in all four deliverables
- [X] T025 [P] [US6] Create `site/src/components/settings-layout.html` and its manifest entry

---

## Phase 9: Polish

- [X] T026 Add the date-range category to the filter sheet (generator and the Blazor pages) so audit-style screens have their sub-filter
- [X] T027 Negative-test the three new gates and the version agreement gate; record the results
- [X] T028 Build every deliverable, run `node site/build.mjs` and `scripts/gates.sh` to a clean pass
- [X] T029 Verified runs across the four deliverables (flows, JS-off, dark, 375px) appended to `specs/002-novus-admin-kit/checklists/verification.md`
- [X] T030 Refresh Admin Kit screenshots and update `site/src/admin-kit.html`, `site/src/index.html` counts, and the component overview sets
- [X] T031 Release 0.4.0: `CHANGELOG.md`, `README.md`, `package.json`, install page, with the npm publish recorded as pending for the owner
- [X] T032 Update `memory/project_state.md`, write the session handover, and open the pull request

## Dependencies

Phase 2 blocks everything. US2 and US3 change sizes and widths, so they run
before the screenshot refresh. US4, US5 and US6 are independent of each other
once Phase 2 lands. Phase 9 closes.
