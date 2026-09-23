# Implementation Plan: Adopting the kit with an AI coding agent

**Branch**: `feature/010-agent-adoption-guide` | **Date**: 2026-09-23 | **Spec**: [spec.md](spec.md)

## Summary

Teams meet this kit through a coding agent, and the kit currently says nothing
about that. This feature adds a documented route (a new top navigation entry and
page) with prompts a reader copies as they are, and four agent instruction files
shipped inside the package so the rules keep applying after the first
conversation. All five outputs are generated from one rule source, checked by a
release gate, exactly as the console layer is.

## Technical Context

**Language/Version**: Node 20 (ES modules), HTML, Markdown, CSS (token-only)

**Primary Dependencies**: none added. Generation uses the Node standard library;
the docs page is built by the existing `site/build.mjs`.

**Storage**: files in the repository and in the published npm artifact

**Testing**: `scripts/gates.sh` (new parity gate, negative-tested),
`scripts/layout-audit.mjs` on the built page, and a packed-tarball install into a
blank project

**Target Platform**: the published npm package and the documentation site

**Project Type**: design kit package plus static documentation site

**Constraints**: `tokens.css` frozen; no console pattern changes; no em dashes in
audited output; the banned product-category word from Principle V must not appear
literally on the page, so rules that mention it are phrased around it; every
internal link resolves; no layout audit findings at 1440px or 375px

**Scale/Scope**: 1 rule source, 1 generator, 5 generated outputs, 1 new page, 1
new navigation entry, 1 new gate, 1 constitution amendment

## Constitution Check

| Principle | Status | Note |
|---|---|---|
| I. Token-first | PASS | No new values. The page documents tokens; the rules tell agents to use them. |
| II. Monochrome near-flat | PASS | The page reuses catalog components. Gate 1 greps for the word this rule bans, so the rules state it as "no gradients", the phrase the gate excludes. |
| III. Component library | PASS | The page is built from existing components, and the rules point agents at the catalog rather than at new markup. |
| IV. Accessibility and responsive | PASS | The new page obeys the content-fit, content-width and 375px rules; long prompts scroll inside their own container. |
| V. Brand and copy | PASS | No em dashes. The audited-path list grows to cover the generated files. |
| VI. Framework-agnostic | PASS | Markdown and plain text. Nothing is tied to a framework. |
| VII. Reference applications | PASS | No console pattern changes. The rules describe the patterns already shipped. |
| VIII. Mobile parity | N/A | No mobile foundation change. |
| Governance | AMEND | A new gate (18) joins the enumerated list, so the constitution goes to 1.14.0. |

## Project Structure

### Documentation (this feature)

```text
specs/010-agent-adoption-guide/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── agent-files.md
└── checklists/
    └── requirements.md
```

### Source (repository root)

```text
agents/
├── rules.mjs              # THE source: every rule, with its scope and provenance
├── generate.mjs           # emits the five outputs; --check is the parity gate
├── AGENTS.md              # generated: cross-tool convention
├── claude/
│   └── CLAUDE.md          # generated: Claude Code project instructions
├── copilot/
│   ├── copilot-instructions.md        # generated: repository-wide
│   └── novus-design-kit.instructions.md  # generated: path-scoped, applyTo
└── cursor/
    └── novus-design-kit.mdc           # generated: Cursor project rule

site/src/
├── partials/header.html   # gains the navigation entry
└── agents.html            # the new page; rules rendered from agents/rules.mjs

site/build.mjs             # root-page loop and navigation key list gain "agents"
scripts/gates.sh           # gate 18, and the generated files join audited paths
package.json               # "files" and "exports" ship agents/
```

**Structure Decision**: a new top-level `agents/` directory holds the source and
the generated files, mirroring how `admin-kits/shared/` holds the console layer
and `admin-kits/data/generate.mjs` proves parity. The directory name is free at
the repository root. The site imports `agents/rules.mjs` directly, the way
`site/build.mjs` already imports `admin-kits/shared/icons.mjs`, so the page and
the files cannot disagree.

## Approach

1. **Rule source**: `agents/rules.mjs` exports an ordered list of rules. Each
   carries an id, the rule text in one or two sentences, a scope (`always` or
   `console`), and a pointer to where the kit documents or enforces it. It also
   exports the artifact list (package name, stylesheet, console layer, scripts,
   icon sprite) and the prompt recipes, so prompts name real paths.
2. **Generator**: `agents/generate.mjs` renders the five outputs from that
   source, using the same `emit` and `--check` discipline as the console
   generator: `--check` writes nothing and exits 1 listing every file that
   drifted. Each output states the kit release it was generated from, read from
   `package.json`.
3. **Formats**, each confirmed against its own documentation in research.md:
   Claude Code reads `./CLAUDE.md`; Copilot reads `.github/copilot-instructions.md`
   repository-wide and `.github/instructions/NAME.instructions.md` with a required
   `applyTo` glob; Cursor reads `.cursor/rules/*.mdc` with `description`, `globs`
   and `alwaysApply`; AGENTS.md is plain Markdown at the repository root with no
   frontmatter. Console-scoped rules go in the path-scoped outputs where the
   format supports it, so a marketing page is not told to grow a side navigation.
4. **Page**: `site/src/agents.html` joins the root-page loop, the header partial
   gains the entry, and `build.mjs` gains the matching navigation key. The page
   carries the order of work, the three prompts, and a table of which file goes
   where for each agent.
5. **Gate**: gate 18 runs `node agents/generate.mjs --check`, and the audited
   path list grows so the copy gates cover the generated files. Negative-tested
   by hand editing a generated file.
6. **Verification**: build, gates, layout audit on the new page, and an install
   of the packed artifact into a blank project to confirm the files arrive.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Five generated outputs from one source | Four agents read four different formats, and the page shows the same rules | Hand-maintaining five copies is what the console layer already proved unsustainable; they drift within a release |
| A new top-level directory | The rules describe the whole kit, not the admin kits | Putting them under `admin-kits/` would imply console-only scope and bury a package-level deliverable |
