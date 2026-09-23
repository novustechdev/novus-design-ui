# Quickstart: validating feature 011

## 1. Reproduce the overflow, then fix it

```bash
# the preserved screen from feature 010, served over http
node scripts/layout-audit.mjs --target <path-to-converted-screen>
```

Expected before the fix: an OVERFLOW finding at 375px, scrollWidth 692.
Expected after: no findings.

## 2. Confirm the target floor

```bash
node site/build.mjs
node scripts/layout-audit.mjs
```

Expected: zero TARGET findings at 375px across every demo page, where the same
run reports 103 before the fix.

## 3. Negative-test both new behaviours

```bash
# remove .tablewrap's position, rebuild, audit  -> OVERFLOW returns
# remove the target floor block, rebuild, audit -> 103 TARGET findings return
scripts/gates.sh
```

Expected: each removal fails the suite by name, and passes again once restored.

## 4. Confirm the rule now says one thing

Read Principle IV, gate 3, the console layer's floor, and the generated agent
files. Expected: one statement of the target rule, with the 375px baseline, and
no rule whose text contradicts its own enforcement note.

## 5. Confirm a consumer can run the check

From a directory that is not this repository, run the audit against a built
screen and get the same findings the kit gets on itself.
