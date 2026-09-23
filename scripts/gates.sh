#!/usr/bin/env bash
# Novus Design Kit — constitution quality gates (release blocking).
# Audits AUTHORED output (site/src, site/dist, js/, README, CHANGELOG).
# tokens.css and references/ are the upstream authority and are not audited here.
set -u
cd "$(dirname "$0")/.."

FAIL=0
gate() { # gate <name> <exit-code> [detail]
  if [ "$2" -eq 0 ]; then echo "PASS  $1"; else echo "FAIL  $1${3:+ — $3}"; FAIL=1; fi
}

AUTHORED="site/src js README.md CHANGELOG.md"
[ -d site/dist ] && AUTHORED="$AUTHORED site/dist"
[ -d agents ] && AUTHORED="$AUTHORED agents"

# Admin-kit authored sources (constitution VII): Razor/HTML/CSS/JS we wrote,
# excluding dependencies, build output, and the copied kit itself.
ADMIN_SRC=$(find admin-kits -type f \( -name '*.razor' -o -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.mjs' \) \
  ! -path '*/node_modules/*' ! -path '*/bin/*' ! -path '*/obj/*' ! -path '*/dist/*' ! -path '*/wwwroot/lib/*' 2>/dev/null)

# 1. No gradients anywhere in authored output (dist/tokens.css is the upstream copy).
# Vendored demo bundle JS (Material Web ripple internals, framework runtimes) is
# third-party library code, not authored styling: excluded like Chart.js would be.
HITS=$( { grep -rn --exclude=tokens.css "gradient" $AUTHORED 2>/dev/null; [ -n "$ADMIN_SRC" ] && grep -n "gradient" $ADMIN_SRC 2>/dev/null; } | grep -v "no gradients" | grep -vE 'site/dist/demos/[^:]*/assets/[^:]*\.js:')
gate "gradient grep" $([ -z "$HITS" ]; echo $?) "$(echo "$HITS" | head -3)"

# 2. No ad-hoc hex colours (tokens define every colour)
# Mobile foundation pages are excluded here and covered by the stricter parity gate below.
HITS=$( { grep -rnE '#[0-9a-fA-F]{3,8}\b' --exclude=manifest.webmanifest --exclude='mobile-*.html' site/src js 2>/dev/null; [ -n "$ADMIN_SRC" ] && grep -nE '#[0-9a-fA-F]{3,8}\b' $ADMIN_SRC 2>/dev/null; } | grep -vE 'href="#|url\(#|&#')
gate "ad-hoc hex audit" $([ -z "$HITS" ]; echo $?) "$(echo "$HITS" | head -3)"

# 2b. Mobile token parity (constitution VIII): every colour literal on a mobile
# foundation page must exist verbatim in tokens.css (hex or Kotlin 0xFF form).
MOBILE_PAGES=$(ls site/src/foundations/mobile-*.html 2>/dev/null)
if [ -n "$MOBILE_PAGES" ]; then
  MISSING=""
  for h in $(grep -ohE '#[0-9a-fA-F]{6}\b|0xFF[0-9a-fA-F]{6}\b|0x[0-9a-fA-F]{6}\b' $MOBILE_PAGES | sed -E 's/^0xFF([0-9a-fA-F]{6})$/#\1/; s/^0x/#/' | tr 'a-f' 'A-F' | sort -u); do
    grep -qi -- "$h" tokens.css || MISSING="$MISSING $h"
  done
  gate "mobile token parity" $([ -z "$MISSING" ]; echo $?) "$MISSING"
fi

# 3. No radius outside the token scale (border-radius must use var(--radius-*))
HITS=$( { grep -rnE 'border-radius:[^;}]*(px|rem|em|%)' site/src js 2>/dev/null; [ -n "$ADMIN_SRC" ] && grep -nE 'border-radius:[^;}]*(px|rem|em|%)' $ADMIN_SRC 2>/dev/null; } | grep -v 'var(--radius')
gate "radius-outside-token-scale" $([ -z "$HITS" ]; echo $?) "$(echo "$HITS" | head -3)"

# 4. No ad-hoc font sizes (type scale is tokenised)
HITS=$( { grep -rnE 'font-size:\s*[0-9]' site/src js 2>/dev/null; [ -n "$ADMIN_SRC" ] && grep -nE 'font-size:\s*[0-9]' $ADMIN_SRC 2>/dev/null; } | grep -v 'var(--text')
gate "ad-hoc font-size audit" $([ -z "$HITS" ]; echo $?) "$(echo "$HITS" | head -3)"

# 5. Prohibited positioning strings (negations count; "Service as Software" is the model)
HITS=$( { grep -rniE '\bsaas\b|software as a service' $AUTHORED 2>/dev/null; [ -n "$ADMIN_SRC" ] && grep -niE '\bsaas\b|software as a service' $ADMIN_SRC 2>/dev/null; } )
gate "SaaS-string grep" $([ -z "$HITS" ]; echo $?) "$(echo "$HITS" | head -3)"

# 6. No CJK template leaks
HITS=$(grep -rnP '[\x{4E00}-\x{9FFF}]' site/src site/dist 2>/dev/null)
gate "CJK leak grep" $([ -z "$HITS" ]; echo $?) "$(echo "$HITS" | head -3)"

# 6b. Copy style: no em dashes in AUTHORED copy (upstream kit docs in logos/ are excluded authority)
HITS=$(grep -rn "—" site/src agents README.md CHANGELOG.md 2>/dev/null; grep -rn --include="*.html" "—" site/dist 2>/dev/null; [ -n "$ADMIN_SRC" ] && grep -n "—" $ADMIN_SRC 2>/dev/null)
gate "em-dash copy-style" $([ -z "$HITS" ]; echo $?) "$(echo "$HITS" | head -3)"

# 7. Manifest ↔ detail-page completeness + orphan-class check
if [ -f site/components.json ]; then
  MISSING_FRAG=""
  for f in $(grep -oE '"fragment"\s*:\s*"[^"]+"' site/components.json | sed -E 's/.*"([^"]+)"$/\1/'); do
    [ -f "site/$f" ] || MISSING_FRAG="$MISSING_FRAG site/$f"
  done
  gate "manifest → fragment exists" $([ -z "$MISSING_FRAG" ]; echo $?) "$MISSING_FRAG"

  if [ -d site/dist/components ]; then
    MISSING_PAGE=""
    for id in $(grep -oE '"id"\s*:\s*"[^"]+"' site/components.json | sed -E 's/.*"([^"]+)"$/\1/'); do
      [ -f "site/dist/components/$id.html" ] || MISSING_PAGE="$MISSING_PAGE $id"
    done
    gate "manifest → built page exists" $([ -z "$MISSING_PAGE" ]; echo $?) "$MISSING_PAGE"

    EXTRA=""
    for p in site/dist/components/*.html; do
      id=$(basename "$p" .html)
      { [ "$id" = "index" ] || [ "$id" = "overview" ]; } && continue
      grep -q "\"id\"[[:space:]]*:[[:space:]]*\"$id\"" site/components.json || EXTRA="$EXTRA $id"
    done
    gate "built page → manifest entry" $([ -z "$EXTRA" ]; echo $?) "$EXTRA"
  fi

  # Orphan classes: every web-component root block in tokens.css owned by EXACTLY ONE
  # manifest entry (data-model.md: no orphans, no double-ownership).
  # Deck/poster/doc systems (tokens.css §9–14) are documented in slide-template/, not here.
  DECK_BLOCKS="novus-slides|nslide|novus-poster|novus-doc"
  ORPHANS=""; DUPS=""
  for block in $(grep -oE '^\.[a-z][a-z0-9-]*' tokens.css | sed -E 's/^\.//; s/(__|--).*$//' | sort -u | grep -vE "^($DECK_BLOCKS)$"); do
    n=$(grep -c "\"\.$block\b" site/components.json)
    [ "$n" -eq 0 ] && ORPHANS="$ORPHANS $block"
    [ "$n" -gt 1 ] && DUPS="$DUPS $block(x$n)"
  done
  gate "orphan-class check" $([ -z "$ORPHANS" ]; echo $?) "$ORPHANS"
  gate "double-ownership check" $([ -z "$DUPS" ]; echo $?) "$DUPS"
else
  echo "WARN  site/components.json not present — manifest gates skipped"
fi

# 8. Guide verification (FR-017/SC-007): every published guide has a passing record row
REC="specs/001-novus-design-kit/checklists/guide-verification.md"
if [ -d site/dist/frameworks ] || [ -d site/dist/themes ]; then
  UNVERIFIED=""
  for p in site/dist/frameworks/*.html site/dist/themes/*.html; do
    [ -f "$p" ] || continue
    id=$(basename "$p" .html)
    grep -qE "^\| *$id *\|.*\| *pass *\|$" "$REC" 2>/dev/null || UNVERIFIED="$UNVERIFIED $id"
  done
  gate "guide verification record" $([ -z "$UNVERIFIED" ]; echo $?) "unverified:$UNVERIFIED"
fi

# 10. Admin pattern parity (constitution 1.11.0, Quality Gate 10): every generated copy of the
# shared console layer, shell, icons, WASM mirrors, and data matches its source.
OUT=$(node admin-kits/data/generate.mjs --check 2>&1); RC=$?
gate "admin pattern parity" $RC "$(echo "$OUT" | sed -n 2,4p | tr '\n' ' ')"

# 18. Agent rule parity (constitution 1.14.0, Quality Gate 18): every generated agent
# instruction file matches the single rule source in agents/rules.mjs.
OUT=$(node agents/generate.mjs --check 2>&1); RC=$?
gate "agent rule parity" $RC "$(echo "$OUT" | sed -n 1,3p | tr '\n' ' ')"

# 15. Version agreement (constitution 1.12.0): package, README and CHANGELOG name one release.
PKG_VER=$(node -p "require('./package.json').version")
CHG_VER=$(grep -oE '^## \[[0-9]+\.[0-9]+\.[0-9]+\]' CHANGELOG.md | head -1 | tr -d '#[] ')
README_VER=$(grep -oE 'novus-design-kit@[0-9]+\.[0-9]+\.[0-9]+' README.md | head -1 | cut -d@ -f2)
BAD=""
[ -n "$CHG_VER" ] && [ "$PKG_VER" != "$CHG_VER" ] && BAD="package $PKG_VER vs changelog $CHG_VER"
[ -n "$README_VER" ] && [ "$PKG_VER" != "$README_VER" ] && BAD="$BAD package $PKG_VER vs README $README_VER"
gate "version agreement" $([ -z "$BAD" ]; echo $?) "$BAD"

# 11. Layout audit (Quality Gate 11): short content stays on one line and no page scrolls
# horizontally at 375px, rendered in headless Chromium over site/dist (docs and demos).
# Gates 12 to 14 and 16, 17 and 19 ride inside this run and are reported by kind:
# HEADER (account menu placement), TYPE (typography parity), WIDTH (content width),
# RAIL (collapsed navigation), GROUND (sign-in ground), TARGET (44px floor at 375px).
if [ -d site/dist ]; then
  OUT=$(node scripts/layout-audit.mjs 2>&1); RC=$?
  if [ $RC -eq 2 ]; then
    echo "SKIP  layout audit: $(echo "$OUT" | tail -1)"
  else
    gate "layout audit" $RC "$(echo "$OUT" | grep -E '^(WRAP|OVERFLOW|ERROR|FAIL)' | head -3 | tr '\n' ' ')"
  fi
fi

echo
[ $FAIL -eq 0 ] && echo "ALL GATES PASS" || echo "GATE FAILURES — release blocked"
exit $FAIL
