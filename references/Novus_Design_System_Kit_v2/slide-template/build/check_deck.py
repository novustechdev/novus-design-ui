#!/usr/bin/env python3
"""
check_deck.py — the Novus HTML deck gate. Run it BEFORE you send a deck.

A rule without a check is a suggestion. This catches the defects that actually
ship: a deck that opens as a black screen on someone else's machine, a retyped
"NOVUS" instead of the real logo mark, an invented section colour, type below the
floor, an unfilled placeholder left in.

USAGE
    python3 check_deck.py my_deck.html            # authoring copy: skips the ship checks
    python3 check_deck.py my_deck_SHIP.html --ship   # the file you are about to send

    (Python 3.8+. No installs, no dependencies.)

Exit code 0 = clean. 1 = at least one FAIL. WARNs are judgement calls — read them.

This is a static check. It cannot see layout. After it passes, still do the visual
pass: open the deck, look at every slide, light and dark.
"""
import argparse
import os
import re
import sys

# The locked section sequence (tokens.css §D0, updated 2026-08-18: 4–10 sections).
SECTION_HEX = ["#0070C0", "#E8A300", "#00A04A", "#534AB7", "#00457A",
               "#E87830", "#51606F", "#0A6E38", "#8A5E00", "#338ACE"]
TYPE_FLOOR = 17          # §9 / §11.O1 absolute floor for any reading text, in px
TITLE_PX = (40, 60)      # sane range for a slide title

FAILS, WARNS, PASSES = [], [], []


def fail(code, msg, detail=""):
    FAILS.append((code, msg, detail))


def warn(code, msg, detail=""):
    WARNS.append((code, msg, detail))


def ok(code, msg):
    PASSES.append((code, msg))


def strip_comments(html):
    return re.sub(r"<!--[\s\S]*?-->", "", html)


def slides_of(html):
    """Return the inner HTML of every <section class="slide…">."""
    out, i = [], 0
    for m in re.finditer(r'<section\b[^>]*class="[^"]*\bslide\b[^"]*"[^>]*>', html):
        start = m.end()
        depth, j = 1, start
        for t in re.finditer(r"</?section\b", html[start:]):
            depth += 1 if t.group(0) == "<section" else -1
            if depth == 0:
                j = start + t.start()
                break
        out.append((m.group(0), html[start:j]))
        i += 1
    return out


def check(path, ship_mode):
    raw = open(path, encoding="utf-8", errors="replace").read()
    html = strip_comments(raw)
    slides = slides_of(html)

    # ── structure ────────────────────────────────────────────────────────────
    if not slides:
        fail("S1", "No <section class=\"slide\"> found — is this a Novus deck?")
        return
    ok("S1", "%d slides found" % len(slides))

    # ── SHIPPING RULES (tokens.css §10) — the black-screen class of bug ──────
    links = re.findall(r'<link\b[^>]*rel\s*=\s*["\']?stylesheet["\']?[^>]*>', html, re.I)
    ext_src = [s for s in re.findall(r'\b(?:src|href)\s*=\s*["\']([^"\']+)["\']', html)
               if not s.startswith(("data:", "#", "mailto:"))]
    ext_url = [u for u in re.findall(r'url\(\s*["\']?([^)"\']+)', html)
               if not u.startswith(("data:", "#"))]
    if ship_mode:
        if links:
            fail("SHIP1", "%d <link rel=stylesheet> still present — Safari will show a BLACK "
                          "SCREEN from file://" % len(links),
                 "Run: python3 make_selfcontained.py %s" % os.path.basename(path))
        else:
            ok("SHIP1", "no external stylesheet links")
        if ext_src or ext_url:
            fail("SHIP2", "%d external asset reference(s) — will break on another machine"
                 % (len(ext_src) + len(ext_url)),
                 ", ".join(sorted(set(ext_src + ext_url))[:6]))
        else:
            ok("SHIP2", "all assets embedded")
        if "data:font" not in html and "@font-face" in html:
            fail("SHIP3", "@font-face present but no embedded font — Carlito will substitute")
        elif "data:font" in html:
            ok("SHIP3", "Carlito embedded")
        theme = re.search(r'<html\b[^>]*\bdata-theme\s*=\s*["\']([^"\']+)', html, re.I)
        if not theme:
            fail("SHIP4", 'no data-theme pinned on <html> — set <html data-theme="light">')
        else:
            ok("SHIP4", 'theme pinned: data-theme="%s"' % theme.group(1))
    else:
        if links:
            ok("SHIP0", "authoring copy (links tokens.css) — remember to run "
                        "make_selfcontained.py before sending")

    # ── LOGO: placed asset, never retyped (the non-negotiable) ───────────────
    typed = re.findall(r">\s*(NOVUS|novus|Novus)\s*<", html)
    logo_imgs = re.findall(r'<img\b[^>]*(?:src="[^"]*Novus_Logo|class="[^"]*\blk\b)', html)
    logo_bg = re.findall(r"--logo-(?:master|wordmark)", html)
    if typed:
        warn("LOGO1", "%d place(s) where 'Novus' appears as a bare text node — the LOGO must be "
                      "a placed asset, never typed" % len(typed),
             "check these are prose, not a logo: " + ", ".join(sorted(set(typed))[:4]))
    if logo_imgs or logo_bg:
        ok("LOGO2", "logo placed as an asset (%d reference(s))" % (len(logo_imgs) + len(logo_bg)))
    else:
        fail("LOGO2", "no Novus logo asset found — every slide footer carries the placed mark")

    # ── SECTION COLOURS: contiguous from the locked sequence, never invented ──
    hexes = [h.upper() for h in re.findall(r"#([0-9a-fA-F]{6})\b", html)]
    hexes = ["#" + h for h in hexes]
    known = set(SECTION_HEX)
    used_seq = [h for h in dict.fromkeys(hexes) if h in known]
    if used_seq:
        idx = sorted(SECTION_HEX.index(h) for h in used_seq)
        if idx and idx[0] != 0:
            warn("SEC1", "section colours do not start at 1 blue #0070C0",
                 "found positions %s" % [i + 1 for i in idx])
        if idx != list(range(idx[0], idx[0] + len(idx))):
            fail("SEC1", "section colours are NOT contiguous in the locked sequence",
                 "positions %s" % [i + 1 for i in idx])
        else:
            ok("SEC1", "section colours contiguous (positions %s)" % [i + 1 for i in idx])
        if len(idx) > 10:
            fail("SEC2", "%d sections — TEN is the ceiling; restructure the story" % len(idx))
    if "#FF0000" in hexes or "#E00000" in hexes:
        warn("SEC3", "a red appears — red is reserved for status/danger and must never read "
                     "as a section colour")

    # ── NAV BAR: content slides only; exactly one active segment ─────────────
    navbars = re.findall(r'<div class="navbar">([\s\S]*?)</div>', html)
    if navbars:
        seg_counts = {len(re.findall(r"<i\b", n)) for n in navbars}
        actives = [len(re.findall(r'<i class="on"', n)) for n in navbars]
        if len(seg_counts) > 1:
            fail("NAV1", "nav bars disagree on segment count %s — every bar shows the whole "
                         "story" % sorted(seg_counts))
        else:
            n = seg_counts.pop()
            if not (4 <= n <= 10):
                fail("NAV2", "%d nav segments — the locked range is 4–10 sections" % n)
            else:
                ok("NAV2", "%d nav segments, consistent across %d bars" % (n, len(navbars)))
        multi = [a for a in actives if a > 1]
        if multi:
            fail("NAV3", "%d nav bar(s) light MORE THAN ONE segment — exactly one 'you are "
                         "here'" % len(multi))
        else:
            ok("NAV3", "each nav bar lights at most one segment")
    else:
        warn("NAV1", "no nav bar found — content slides carry the section tracker")

    # ── TYPE FLOOR (§11.O1) ─────────────────────────────────────────────────
    # SVG map/chart labels are graphic annotation, not reading text — exempt them.
    graphic = re.sub(r"<svg[\s\S]*?</svg>", "", html)
    graphic = re.sub(r"\.(?:hero-map|lbl|globe|tick|axis)[^{]*\{[^}]*\}", "", graphic)
    small = []
    for m in re.finditer(r"font-size\s*:\s*(\d+(?:\.\d+)?)px", graphic):
        px = float(m.group(1))
        if px < TYPE_FLOOR:
            small.append(px)
    if small:
        warn("TYPE1", "%d rule(s) set text below the %dpx floor (smallest %.0fpx) — shorten the "
                      "copy or split the slide, never shrink" % (len(small), TYPE_FLOOR, min(small)))
    else:
        ok("TYPE1", "no inline type below the %dpx floor" % TYPE_FLOOR)

    # ── UNFILLED PLACEHOLDERS ───────────────────────────────────────────────
    empty_img = len(re.findall(r'<img\b[^>]*\bsrc\s*=\s*["\']\s*["\']', html))
    lorem = re.findall(r"(?i)\b(lorem ipsum|goes here|placeholder|TBD|XXX|Lorem)\b", html)
    if empty_img:
        fail("PH1", "%d <img> with an empty src — an unfilled photo slot will ship as a broken "
                    "image" % empty_img)
    else:
        ok("PH1", "no empty image slots")
    if lorem:
        warn("PH2", "%d placeholder phrase(s) left in the deck" % len(lorem),
             ", ".join(sorted(set(x.lower() for x in lorem))[:5]))

    # ── PAGE NUMBERS in document order (§11.R3) ─────────────────────────────
    pages = [int(x) for x in re.findall(r'<span class="pg">\s*(\d+)\s*/', html)]
    if pages:
        if pages != sorted(pages):
            fail("PG1", "page numbers are out of order", str(pages[:12]))
        else:
            ok("PG1", "page numbers ascend (%d numbered)" % len(pages))

    # ── HOUSE WORDING ───────────────────────────────────────────────────────
    if re.search(r"\bSaaS\b|Software as a Service", html):
        fail("W1", 'the deck says "SaaS" — Novus is "Service as Software"')
    else:
        ok("W1", 'wording: no "SaaS"')
    if re.search(r"(?i)\bseylan\b", html):
        fail("W2", "a RETIRED client mark/name appears (Seylan) — it must not appear on any "
                   "outward-facing artefact")
    if re.search(r"(?i)seven building blocks", html):
        warn("W3", 'says "seven building blocks" — it is four verticals on four platform assets')


def main():
    ap = argparse.ArgumentParser(description="Gate a Novus HTML deck before sending it.")
    ap.add_argument("deck")
    ap.add_argument("--ship", action="store_true",
                    help="also enforce the self-contained shipping rules (use on the file you send)")
    a = ap.parse_args()
    if not os.path.isfile(a.deck):
        sys.exit("ERROR: no such file: %s" % a.deck)

    print("Novus deck gate — %s%s\n" % (os.path.basename(a.deck),
                                        "  [ship mode]" if a.ship else "  [authoring]"))
    check(a.deck, a.ship)

    for c, m in PASSES:
        print("  PASS  %-6s %s" % (c, m))
    for c, m, d in WARNS:
        print("  WARN  %-6s %s" % (c, m))
        if d:
            print("        %s" % d)
    for c, m, d in FAILS:
        print("  FAIL  %-6s %s" % (c, m))
        if d:
            print("        %s" % d)

    print("\n  %d passed · %d warning(s) · %d failure(s)" % (len(PASSES), len(WARNS), len(FAILS)))
    if FAILS:
        print("  DO NOT SEND until the failures are fixed.")
        return 1
    print("  Gate clean. Now do the visual pass: open it and look at every slide.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
