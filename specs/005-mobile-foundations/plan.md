# Implementation Plan: Mobile foundations (feature 005)

**Spec**: specs/005-mobile-foundations/spec.md · **Date**: 2026-08-27

## Technical Context

- Two new authored pages: `site/src/foundations/mobile-android.html` and
  `site/src/foundations/mobile-ios.html`, registered in the FOUNDATIONS list in
  site/build.mjs (sidebar + build). No new build machinery needed.
- Token values sourced from tokens.css (light + dark blocks). rem→dp/pt at 16.
  Key stops: accent #0070C0 (blue-500), accent-text #00457A (blue-700, light),
  text #0E2336 / dark #E7EDF3, bg #FFFFFF / dark #0B1620, surface dark #122131,
  border #DCE3EB / dark #2A3B4D, success #00A04A, warning #E8A300, danger
  #C0473F, radius 6/8/12/16, spacing 4..96, type 12..30.
- Gates: mobile pages carry hex by necessity (Kotlin Color(0xFF...), Swift
  Color hex init). scripts/gates.sh: exclude `foundations/mobile-*.html` from
  the ad-hoc hex gate; add "mobile token parity" gate extracting every
  6-digit hex from those source pages and requiring it verbatim (case-
  insensitive) in tokens.css.
- Kotlin uses 0xFF RRGGBB form: gate must extract from both `#RRGGBB` and
  `0xFF RRGGBB` forms; normalize to #RRGGBB before lookup.
- Pages are design mappings per constitution VIII: label at top, versions
  named, TTF sourcing note (Google Fonts / design-system master).

## Structure

1. Android page: intro + mapping label; Material 3 ColorScheme (light+dark)
   Kotlin block; Typography (Carlito 400/700 via bundled font resource);
   Shapes (RoundedCornerShape 6/8/12/16); spacing object (dp); NovusTheme
   wrapper (isSystemInDarkTheme + DataStore-persisted override); component
   correspondence table; carried-over rules; logo assets note.
2. iOS page: intro + label; Color extension with light/dark dynamic providers
   (UIColor trait initializer) Swift block; Carlito registration (UIAppFonts)
   + Font extension mapped to the type scale with Dynamic Type relative
   sizing; spacing/radius CGFloat scales; appearance override
   (@AppStorage + preferredColorScheme, nil = follow system); correspondence
   table; rules; TTF note.
3. build.mjs FOUNDATIONS: two entries after "Dark mode".
4. gates.sh: hex-gate exclusion + new parity gate.
5. Landing chips (Android, iOS) in the stack band; README line.
6. CHANGELOG Unreleased bullet; speckit records; converge sweep; deploy;
   live verify.

## Constitution Check (v1.8.0)

- VIII: values all traced (gate-enforced), mapping label present, versions
  named, Carlito only, dual-trigger analog, judgement rules carried. PASS
- I: tokens.css untouched. PASS
- V (copy): no em-dash, no restricted strings, sourced tone. PASS by gates.
- VI: these are NOT run-verified guides and are labelled accordingly;
  they live under foundations, not frameworks/themes (which the guide
  verification gate scans). PASS
