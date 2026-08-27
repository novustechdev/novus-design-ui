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
