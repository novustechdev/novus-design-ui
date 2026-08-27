# Tasks: Product-team feedback round (feature 004)

**Input**: spec.md, plan.md (this directory)

## Phase 1: Copy and interaction polish (US1/US3)

- [X] T001 [US3] Relabel grid-row demo placeholders (remove middle-dot pattern) in site/src/components/grid-row.html per FR-001
- [X] T002 [US3] Tab hover tint + color for light and dark themes in admin.css (3 copies) per FR-002
- [X] T003 [US3] Button gap fallback rule and documented standard in SITE_CSS + admin.css + button.html usage notes per FR-003
- [X] T004 [US3] Enlarged disclosure chevron (summary marker + .disclosure-ic) in SITE_CSS + admin.css per FR-008
- [X] T005 [US3] .selectwrap border-drawn inset chevron in SITE_CSS + admin.css; wrap selects in docs fragments, tailwind pages, and both razor trees per FR-009

## Phase 2: Catalog growth (US1)

- [X] T006 [US1] Dropdown fragment (native select + details menu pattern) site/src/components/dropdown.html per FR-005
- [X] T007 [US1] Date picker fragment (native input type="date") site/src/components/date-picker.html per FR-005
- [X] T008 [US1] Calendar fragment (month grid from .table) site/src/components/calendar.html per FR-005
- [X] T009 [US1] Stepper fragment (badge/flex composition) site/src/components/stepper.html per FR-005
- [X] T010 [US1] Four manifest entries in site/components.json; counts updated on landing (x2) and README per FR-005/FR-011

## Phase 3: Discovery (US2)

- [X] T011 [US2] Search bar + progressive filter script on the components overview in site/build.mjs per FR-006
- [X] T012 [US2] "Choose by function" module (dashboards, forms, data display, navigation, feedback) on the overview per FR-007

## Phase 4: Guidance and preview (US4/US5)

- [X] T013 [US4] Foundations page "Actions and placement" + sidebar entry per FR-004
- [X] T014 [US5] Web/Mobile preview toggle (radio + :has, 375px frame) on component detail pages in site/build.mjs per FR-010

## Phase 5: Verification

- [X] T015 Rebuild flavors + demo + site; all gates green; headless visual pass (tab hover, chevrons, select inset, search filter, mobile preview); deploy and live verify

## Phase 6: Repository migration (owner request, 2026-08-27)

- [X] T016 Repository migrated to github.com/novustechdev/novus-design-ui: remote, package.json, footer, Getting started, memory updated (historical speckit artifacts unchanged); branch protection recreated; releases v0.1.0 through v0.3.0 recreated with original tarball assets and URL-corrected notes; CONTRIBUTING.md added for outside contributors
