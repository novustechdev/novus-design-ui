# Feature Specification: Material admin flavor, catalog growth, prototype polish

**Feature Branch**: `feature/006-material-flavor-catalog` (feature 006)

**Created**: 2026-08-27

**Status**: Shipped via PR

**Input**: Owner requests: remove every Compose mention from Android references
(the Android team's stack is m3.material.io via Material Components for
Android); give the mobile prototypes the same provenance top bar as the admin
kit demos; add a third Admin Kit flavor built with Material (Material Web under
the Novus tokens); grow the component catalog with staples from Ant Design and
Tailwind ecosystems, adjusted to Novus foundations.

## Requirements

- **FR-001**: No Compose mention remains in living docs (landing chip, README,
  Android foundations); Android references say Material 3 / Material
  Components for Android only.
- **FR-002**: Both mobile prototypes carry the demo provenance bar ("Built with
  the Novus Design Kit, back to the docs") like the admin kit demos.
- **FR-003**: A third Admin Kit flavor `admin-kits/material` MUST ship: Vite
  MPA on @material/web 2.x under the Novus tokens (the verified Material Web
  guide mapping), same seven pages and shared dataset (generator emits to it),
  Material Web components for buttons, text fields, and checkboxes, kit layout
  and judgement chips, dual-trigger dark mode. Material Web components require
  JavaScript and the docs say so (constitution 1.10.0, Principle VII).
- **FR-004**: The material flavor MUST be hosted at /demos/material/, built by
  both workflows, linked from the landing band and the Admin Kit page with six
  verified screenshots (dashboard light/dark, analytics, data grid, login,
  375px mobile).
- **FR-005**: Eight new catalog components MUST ship as token compositions:
  Tabs, Breadcrumb, Pagination (Navigation); Progress, Skeleton, Empty state
  (Feedback); Timeline, Descriptions (Data Display). Catalog count 26 to 34;
  all hardcoded counts updated. Skeleton is static (no shimmer) per the calm
  loading rule; Tabs reuse the native radio + :has pattern.
- **FR-006**: Speckit updated: constitution 1.10.0, this spec, tasks; CHANGELOG
  Unreleased records all of it; shipped via feature branch + PR per the
  branch-and-PR rule.

## Success Criteria

- **SC-001**: grep for Compose in living docs returns nothing.
- **SC-002**: /demos/material/ serves live; login (admin/admin) lands on the
  dashboard; grid search and chart verified; 375px scrollWidth is 375.
- **SC-003**: Overview lists 34 components; all gates green including manifest
  completeness both directions.
