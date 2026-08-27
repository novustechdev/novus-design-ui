# Feature Specification: Mobile foundations for native Android and iOS

**Feature Branch**: `main` (feature 005)

**Created**: 2026-08-27

**Status**: Draft

**Input**: Owner request: add the foundation design kit for native Android and
iOS using the popular framework/theme/libraries of each platform, matched to
the Novus web kit foundations, so the kit is the enterprise guidance for both
web and mobile development. Governed by constitution Principle VIII (v1.8.0).

## User Scenarios & Testing

### User Story 1 - Android team themes a View-system app on Novus (Priority: P1)

An Android developer opens the Android foundations page and gets a complete
Material 3 mapping for the team's stack (m3.material.io via Material
Components for Android, the View system): light and night colour resources
whose every value comes from tokens.css, Theme.Material3 colour roles, shape
appearances from the radius scale, Carlito font resources and text
appearances, a dp dimens scale, dual-trigger dark mode (DayNight + persisted
AppCompatDelegate override), and a kit-to-MDC-widget correspondence table.

**Independent Test**: Every hex on the page exists verbatim in tokens.css
(gate); the page names the Material Components / AppCompat versions targeted;
copyable XML blocks cover colors, themes, shapes, fonts, and dimens.

### User Story 2 - iOS team themes a SwiftUI app on Novus (Priority: P1)

An iOS developer opens the iOS foundations page and gets a SwiftUI/HIG
mapping: Color definitions with light and dark variants from tokens.css,
Carlito font registration and a type-scale extension honoring Dynamic Type,
pt spacing and radius scales, dual-trigger dark mode (system appearance +
persisted override), and a kit-to-SwiftUI component correspondence table.

**Independent Test**: Same token-parity gate; the page names the
Swift/SwiftUI targets; copyable Swift blocks cover Color, Font, and the
appearance override.

### User Story 3 - The rules survive the platform jump (Priority: P2)

Both pages restate the kit judgements in platform terms: one accent per view,
traffic-light colour only on judgements, lowercase solid-set product names,
placed logo assets (no redrawn marks), no gradients, near-flat elevation, and
are labelled as design mappings (not run-verified guides), naming where the
Carlito TTF comes from (the design system master or Google Fonts; this
package ships woff2 only).

**Independent Test**: Each page carries the design-mapping label, the rules
section, and the TTF sourcing note.

### Edge Cases

- The site-wide ad-hoc hex gate would reject these pages: mobile foundation
  pages are excluded from that gate and covered instead by a stricter one
  (every hex MUST exist in tokens.css), so values are mapped, never invented.
- rem-based tokens convert at 16px per rem to dp (Android) and pt (iOS);
  conversion is stated on the page so future token changes stay mappable.
- iOS cannot be compiled in this environment and Android emulation is not part
  of the docs build: pages are design mappings per Principle VIII, labelled
  as such, with the verification standard being the token-parity gate.

## Requirements

- **FR-001** (revised 2026-08-27): A foundations page "Android foundations"
  MUST map tokens.css to Material 3 as published at m3.material.io through
  Material Components for Android (View system): colors.xml with a
  values-night twin, Theme.Material3 colour roles, shape appearance styles
  from the radius scale, Carlito font-family resources with text appearances
  (400/700), a dimens dp scale, and dual-trigger dark mode (DayNight +
  persisted AppCompatDelegate override).
- **FR-002**: A foundations page "iOS foundations" MUST map tokens.css to
  SwiftUI: Color set (light/dark), Carlito registration and Font extension
  with Dynamic Type, pt spacing/radius scales, and preferredColorScheme
  override persisted with AppStorage.
- **FR-003**: Both pages MUST carry a kit-to-platform component
  correspondence table covering at least button, card, badge/chip, table/list,
  alert, modal/sheet, field/input, and stepper.
- **FR-004**: Both pages MUST restate the carried-over judgement rules and the
  design-mapping label with targeted library versions and TTF sourcing.
- **FR-005**: scripts/gates.sh MUST exclude mobile foundation pages from the
  ad-hoc hex gate and add a mobile token-parity gate: every #RRGGBB on those
  pages exists in tokens.css (case-insensitive).
- **FR-006**: The pages MUST be reachable: foundations sidebar entries, landing
  page stack band gains Android and iOS chips, README mentions mobile
  foundations.
- **FR-007**: CHANGELOG Unreleased records the addition.
- **FR-008** (added 2026-08-27): A verified web theme guide "Novus Design with
  Material Web" MUST ship for @material/web (the official m3.material.io web
  components), mapping MD3 system tokens to Novus variables in CSS; verified
  per Principle VI in a real sample project with the rendered result and a
  verification record row, like every other theme guide.

## Success Criteria

- **SC-001**: Both pages build, appear in the foundations sidebar, and pass
  the link gate; landing chips resolve.
- **SC-002**: Token-parity gate passes and demonstrably fails on an invented
  hex (spot-checked during implementation).
- **SC-003**: All other gates stay green; deployed and verified live.

## Assumptions

- Platform choices per owner and the Android tech lead: Android = Material 3
  per m3.material.io via Material Components for Android (View system); iOS =
  SwiftUI + HIG (the platform default). No cross-platform frameworks in scope.
- Carlito TTF is obtainable from Google Fonts or the design system master;
  the npm package continues to ship woff2 only.
- Version targets documented: material-components-android 1.14.x / AppCompat
  1.7.x, iOS 18+ / Swift 6 SwiftUI; stated on-page as mapping targets, not
  verified runs. The Material Web guide (FR-008) IS run-verified:
  @material/web 2.5.0.

## Clarifications

### Session 2026-08-27

- Q: Android mapping stack? → A: Not Compose: the Android team uses Material 3
  as published at m3.material.io through Material Components for Android (View
  system, XML themes/resources). FR-001 is revised accordingly.
- Q: Material for web development? → A: Add a verified web theme guide for
  Material Web (@material/web), the official m3.material.io web components
  (FR-008), verified per Principle VI like the other theme guides.
