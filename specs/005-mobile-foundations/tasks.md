# Tasks: Mobile foundations (feature 005)

**Input**: spec.md, plan.md (this directory)

## Phase 1: Gate groundwork

- [X] T001 Exclude foundations/mobile-*.html from the ad-hoc hex gate and add the mobile token-parity gate (hex and 0xFF forms, normalized, must exist in tokens.css) in scripts/gates.sh per FR-005

## Phase 2: Pages (US1/US2/US3)

- [X] T002 [US1] Android foundations page (Material 3 / Compose mapping: ColorScheme light+dark, Carlito Typography, Shapes, dp spacing, dual-trigger theme wrapper, correspondence table, rules, mapping label) in site/src/foundations/mobile-android.html per FR-001/003/004
- [X] T003 [US2] iOS foundations page (SwiftUI / HIG mapping: dynamic Colors, Carlito Font extension with Dynamic Type, pt scales, persisted appearance override, correspondence table, rules, mapping label) in site/src/foundations/mobile-ios.html per FR-002/003/004
- [X] T004 Register both pages in the FOUNDATIONS list in site/build.mjs per FR-006

## Phase 3: Reachability and record

- [X] T005 Landing stack band gains Android and iOS chips; README mentions mobile foundations per FR-006
- [X] T006 CHANGELOG Unreleased bullet per FR-007

## Phase 4: Verification

- [X] T007 Negative test: an invented hex on a mobile page fails the parity gate; then all gates green, deploy, live verify both pages and landing chips

## Phase 5: Owner revision (Android stack + Material Web guide)

- [X] T008 Rework mobile-android.html from Compose to Material Components for Android (colors.xml light/night, Theme.Material3 roles, shape appearances, Carlito font-family XML, dimens, AppCompatDelegate dual trigger, MDC correspondence table) per revised FR-001
- [X] T009 Verified Material Web theme guide: real sample (@material/web 2.5.0 + kit 0.3.0 from npm, Vite build, rendered light and dark, headless-verified), themes/material-web.html, verification record row, sample screenshot per FR-008
- [X] T010 Registration and reachability: GUIDE_SECTIONS entry, landing themes chip, README section, CHANGELOG updated; constitution 1.8.1 records the Android stack correction
- [X] T011 Gates green (mobile token parity covers the XML hex values), deploy, live verify
