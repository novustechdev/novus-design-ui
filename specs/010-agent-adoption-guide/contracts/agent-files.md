# Contract: the packaged agent files (feature 010)

What a consumer receives, and what may not change without a version bump.

## Published paths

Inside the installed package, under `node_modules/novus-design-kit/`:

| Agent | Package path | Consumer copies it to |
|---|---|---|
| Claude Code | `agents/claude/CLAUDE.md` | `./CLAUDE.md` (or `./.claude/CLAUDE.md`) |
| GitHub Copilot, repository-wide | `agents/copilot/copilot-instructions.md` | `.github/copilot-instructions.md` |
| GitHub Copilot, console screens | `agents/copilot/novus-design-kit.instructions.md` | `.github/instructions/novus-design-kit.instructions.md` |
| Cursor | `agents/cursor/novus-design-kit.mdc` | `.cursor/rules/novus-design-kit.mdc` |
| Any AGENTS.md reader | `agents/AGENTS.md` | `./AGENTS.md` |

`package.json` MUST list the four generated paths in `files`
(`agents/AGENTS.md`, `agents/claude/`, `agents/copilot/`, `agents/cursor/`) and
MUST expose `"./agents/*": "./agents/*"` in `exports`, so the paths above
resolve for consumers who import rather than copy.

The rule source (`agents/rules.mjs`) and the generator (`agents/generate.mjs`)
are deliberately NOT shipped. They are build machinery for this repository, and
a package that hands consumers a generator which writes into their working tree
invites someone to run it by accident.

## Format guarantees

- Every file is UTF-8 Markdown and states the kit release it was generated from.
- `novus-design-kit.instructions.md` carries `applyTo` frontmatter.
- `novus-design-kit.mdc` carries `description`, `globs` and `alwaysApply`.
- `AGENTS.md` and `CLAUDE.md` carry no frontmatter.
- No file contains an em dash, the banned product-category word, credentials,
  private hostnames or client names.

## Stability

- Adding a rule is a MINOR change. Removing one, or moving a published path, is
  MAJOR.
- The files are generated. A hand edit is a defect and fails gate 18.
