# Data Model: Novus Design Kit

A static kit has no runtime data store. The "data model" is the set of authored
artifacts that drive the build and the gates. One file is machine-read:
`site/components.json` (the component manifest). Everything else is convention.

## Component Manifest (`site/components.json`)

The single machine-readable registry. Drives the overview grid, detail-page
generation, and the completeness gate (FR-008, SC-002).

```json
{
  "categories": ["General", "Layout", "Data Display", "Feedback", "Forms", "Navigation", "Theming"],
  "components": [
    {
      "id": "button",
      "name": "Button",
      "category": "General",
      "classes": [".btn", ".btn--primary", ".btn--secondary", ".btn--ghost", ".btn--danger", ".btn--sm", ".btn--lg"],
      "fragment": "src/components/button.html",
      "summary": "Primary action trigger in five variants and three sizes."
    }
  ]
}
```

### Fields & validation

| Field | Rules |
|-------|-------|
| `id` | kebab-case, unique, becomes the route `/components/<id>.html` |
| `name` | Display name shown on overview and detail page |
| `category` | Must be one of `categories`; overview groups by it |
| `classes` | Non-empty; every root component class in tokens.css must appear in exactly one component's `classes` (gate: no orphan classes, no double-ownership). Sub-element (`__`) classes belong to their block's entry |
| `fragment` | Path must exist at build time (gate: manifest ↔ page completeness, both directions) |
| `summary` | One sentence, used on the overview card |

### Relationships

- **Component 1—1 Fragment** (detail page source): build fails if either side missing.
- **Component 1—N Classes**: the CSS API surface documented on the detail page.
- **Category 1—N Components**: overview grouping.

## Other entities (convention, not machine-read)

| Spec entity | Realization |
|-------------|-------------|
| Design Token | CSS custom properties in `tokens.css` (verbatim upstream copy; never edited locally) |
| Brand Asset | Files under `logos/` and `photos/`; referenced by path from the package, documented on the assets/foundation pages |
| Documentation Page | `site/src/foundations/*.html` (fixed list: principles, color, typography, layout, logos, photography, dark-mode) + generated `components/*.html` + overview + install page |
| Release | Git tag + CHANGELOG.md entry + published package version (semver); a release exists only if `scripts/gates.sh` exits 0 |

## State transitions

Only Release has a lifecycle:

```
edited → gates pass → version bumped + CHANGELOG entry → published (immutable)
```

A published version is never mutated; fixes ship as a new version. Breaking
changes require a MAJOR bump and a migration note in the CHANGELOG entry.
