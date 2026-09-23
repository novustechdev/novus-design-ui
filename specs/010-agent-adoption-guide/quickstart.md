# Quickstart: validating feature 010

Prerequisites: Node 20, the repository checked out, `playwright-core` at the root
and a Chromium for the layout audit.

## 1. Generate and check parity

```bash
node agents/generate.mjs          # writes the five outputs
node agents/generate.mjs --check  # writes nothing, exits 0 when in step
```

Expected: the second command prints nothing and exits 0.

## 2. Negative-test the gate

```bash
printf '\nhand edited\n' >> agents/AGENTS.md
scripts/gates.sh | grep -E "agent (file|rule) parity"
node agents/generate.mjs          # restore
```

Expected: the gate fails and names `AGENTS.md`, then passes after regeneration.

## 3. Build the site and audit the page

```bash
node site/build.mjs
node scripts/layout-audit.mjs --only agents.html
scripts/gates.sh
```

Expected: the page builds, the audit reports 0 findings at 1440px and 375px, the
top navigation entry resolves and is marked current, and all gates pass.

## 4. Confirm the files reach a consumer

```bash
npm pack
mkdir -p /tmp/agent-check && cd /tmp/agent-check && npm init -y
npm install /path/to/novus-design-kit-<version>.tgz
ls node_modules/novus-design-kit/agents
```

Expected: all five files are present at the contract's paths, each naming the
release it came from.

## 5. Confirm the rules are one set

Change one rule's text in `agents/rules.mjs`, run the generator, and confirm the
same wording appears in all five outputs and on the built page.
