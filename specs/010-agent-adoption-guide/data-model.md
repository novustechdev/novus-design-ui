# Data model: Adopting the kit with an AI coding agent (feature 010)

The "data" here is the rule set and its renderings. All of it lives in
`agents/rules.mjs` and is consumed by `agents/generate.mjs` and `site/build.mjs`.

## Rule

One instruction an agent must follow.

| Field | Meaning |
|---|---|
| `id` | Stable kebab-case identifier, used in outputs and in gate messages |
| `text` | The rule, in one or two sentences, written as an instruction |
| `scope` | `always` (any file in a consuming project) or `console` (console and portal screens only) |
| `why` | One clause naming what breaks without it, so an agent can weigh it |
| `enforcedBy` | Where the kit checks it: a gate number, or the catalog page that documents it |

Validation: `id` unique; `scope` one of the two values; `text` free of em dashes
and of the banned product-category word; every rule carries `enforcedBy`.

## Agent profile

One supported agent and the file it reads.

| Field | Meaning |
|---|---|
| `id` | `claude-code`, `copilot`, `cursor`, `agents-md` |
| `label` | Display name on the documentation page |
| `consumerPath` | Where the file belongs in the consumer's repository |
| `packagePath` | Where the file sits inside the published package |
| `format` | `markdown`, `markdown+frontmatter` |
| `frontmatter` | Keys that format requires, such as `applyTo`, or `description`/`globs`/`alwaysApply` |
| `scoping` | Whether the format can limit console rules to matching paths |

## Prompt recipe

One copyable prompt.

| Field | Meaning |
|---|---|
| `id` | `adopt`, `convert-screen`, `audit-screen` |
| `title` | What the reader is trying to do |
| `body` | The prompt text, with the artifact list and the rules rendered in |
| `checks` | What the reader should confirm in the result |

## Artifact list

The files a consumer installs, read from `package.json` so it cannot go stale:
package name, `tokens.css`, `console.css`, `js/novus-theme.js`,
`js/novus-console.js`, `icons/novus-icons.svg`.

## Generated outputs

| Output | Built from |
|---|---|
| `agents/AGENTS.md` | all rules, both scopes, labelled sections |
| `agents/claude/CLAUDE.md` | all rules, both scopes, labelled sections |
| `agents/copilot/copilot-instructions.md` | `always` rules |
| `agents/copilot/novus-design-kit.instructions.md` | `console` rules, with `applyTo` |
| `agents/cursor/novus-design-kit.mdc` | all rules, with `description`, `globs`, `alwaysApply` |
| The rules shown on `site/src/agents.html` | the same list, rendered at build time |
