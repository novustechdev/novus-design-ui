# Research: Adopting the kit with an AI coding agent (feature 010)

Sources: each provider's own documentation, fetched 2026-09-23 (URLs below); the
existing console layer and its parity gate; `scripts/gates.sh`; `site/build.mjs`.

## R1. What each agent actually reads

Confirmed from the vendors' documentation rather than from memory, because these
files are the deliverable and a wrong path ships a file nobody reads.

| Agent | Path in the consumer's repository | Format |
|---|---|---|
| Claude Code | `./CLAUDE.md` (or `./.claude/CLAUDE.md`) | Markdown, no frontmatter. Supports `@path` imports, max four hops; a path inside backticks is not imported. Modular rules live in `.claude/rules/*.md` and can be path-scoped. |
| GitHub Copilot | `.github/copilot-instructions.md` repository-wide; `.github/instructions/NAME.instructions.md` path-scoped | Markdown. Path-scoped files require `applyTo` frontmatter with a glob; `excludeAgent` is optional. |
| Cursor | `.cursor/rules/NAME.mdc` | Markdown with frontmatter `description`, `globs`, `alwaysApply`. A plain `.md` file in that directory is ignored. |
| Any of 25+ tools | `AGENTS.md` at the repository root | Plain Markdown, no required fields or frontmatter. Nearest file wins in a monorepo. |

**Decision**: ship one file per agent, named and shaped for that agent, and let
the consumer copy the one they use.

**Consequence worth designing around**: Claude Code reads `AGENTS.md` as project
instructions when no `CLAUDE.md` is present, and Cursor is also on the AGENTS.md
reader list. A consumer can therefore end up with two of our files loaded at
once, so the outputs must never contradict each other. Generating them all from
one source is what makes that safe.

- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/skills
- https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
- https://cursor.com/docs/context/rules
- https://agents.md/

## R2. One source, five outputs

**Decision**: `agents/rules.mjs` is the only place a rule is written.
`agents/generate.mjs` renders the four provider files plus the rule list the
documentation page shows, reusing the console generator's `emit` and `--check`
shape.

**Rationale**: feature 007 shipped patterns that could not reach consumers, and
feature 008 had to package them. The same failure in prose form would be four
copies of the rules drifting apart. A parity gate makes drift a build failure
instead of a discovery.

**Alternatives**: writing each file by hand (drifts); generating at publish time
only (the repository copy would be stale and the gate would have nothing to
check).

## R3. Scope: not every rule applies to every file

**Decision**: each rule is tagged `always` or `console`. The `always` rules
(token-first values, no gradients, light default, 44px targets, reduced motion,
short content on one line) go in every output. The `console` rules (the shell,
the icon rail on collapse, sign-in on the near-white ground, the filter bar and
paged list patterns) go into the path-scoped outputs where a format supports
scoping, and into a clearly labelled section elsewhere.

**Rationale**: Copilot's `applyTo` and Cursor's `globs` exist precisely for this,
and an agent told to apply console rules to a landing page will produce nonsense.

## R4. Where the guidance lives on the site

**Decision**: a root page, `site/src/agents.html`, reached from a new top
navigation entry. Root pages are built by the loop in `site/build.mjs` alongside
`index.html`, `install.html` and `admin-kit.html`; the entry is added to
`site/src/partials/header.html` and to the navigation key list in `shell()`.

**Rationale**: the owner asked for a top navigation entry. The page sits beside
Install because it answers the same question for a different kind of reader.

## R5. Gate design

**Decision**: gate 18 runs `node agents/generate.mjs --check`, matching gate 10's
wording and behaviour. Separately, `agents/` joins the audited path list in
`scripts/gates.sh`, because the copy gates currently scan `site/src`, `js`,
README, CHANGELOG, `site/dist` and the admin-kit sources, and would not see a new
top-level directory.

**Risk caught during planning**: without that second change, an em dash or the
banned product-category word could ship inside a generated file untouched by any
gate.

## R6. What the prompts must name

**Decision**: the artifact list lives in `rules.mjs` and is rendered into every
prompt, so a prompt cannot name a file the release does not ship: the package on
public npm, `tokens.css`, `console.css`, `js/novus-theme.js`,
`js/novus-console.js` and `icons/novus-icons.svg`.

**Rationale**: the fastest way to make an agent hallucinate is to hand it a
half-remembered path. Generating the list from the package removes the chance.

## R7. The kit does not write into a consumer's repository

**Decision**: no install hook copies anything. The consumer copies the file they
want, and the page tells them where it goes.

**Rationale**: a package that edits its host's configuration during install is a
bad neighbour, and agent instruction files are exactly the kind of file a team
wants to review before adopting.
