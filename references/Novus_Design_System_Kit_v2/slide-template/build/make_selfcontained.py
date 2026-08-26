#!/usr/bin/env python3
"""
make_selfcontained.py — turn an authored Novus HTML deck into the SHIPPABLE file.

WHY THIS EXISTS (tokens.css §10 — the self-contained rule)
    While you author, your deck <link>s tokens.css and deck.css. That is correct for
    authoring — and WRONG to send. Safari refuses to load a sibling stylesheet from a
    file:// page, so a linked deck opens as a BLACK SCREEN on the recipient's machine.
    This script produces the version you actually send:

      • every <link rel="stylesheet"> inlined into a <style> block
      • Carlito (woff2) embedded as base64 inside the CSS
      • every <img src> and CSS url(...) image embedded as base64
      • <html data-theme="light"> pinned
      • no external references left at all
      • CSS *and* HTML comments stripped, so internal design-system notes never
        travel inside a deck you send to a client (--keep-comments to disable)

USAGE
    python3 make_selfcontained.py my_deck.html
    python3 make_selfcontained.py my_deck.html -o Client_Deck_2026-08-25.html

    (Python 3.8+. No installs, no dependencies.)

Then ALWAYS open the produced file and check it renders before sending it.
"""
import argparse
import base64
import mimetypes
import os
import re
import sys

KEEP_COMMENTS = False

MIME = {
    ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml", ".gif": "image/gif", ".webp": "image/webp",
}


def mime_for(path):
    ext = os.path.splitext(path)[1].lower()
    return MIME.get(ext) or mimetypes.guess_type(path)[0] or "application/octet-stream"


def to_data_uri(path, stats):
    with open(path, "rb") as fh:
        raw = fh.read()
    stats["files"] += 1
    stats["bytes"] += len(raw)
    return "data:%s;base64,%s" % (mime_for(path), base64.b64encode(raw).decode("ascii"))


def embed_css_urls(css, css_dir, stats, missing):
    """Replace url(...) inside a stylesheet with base64, resolved against the CSS file."""
    def repl(m):
        quote, ref = m.group(1) or "", m.group(2).strip()
        if ref.startswith(("data:", "http://", "https://", "#")):
            return m.group(0)
        target = os.path.normpath(os.path.join(css_dir, ref.split("?")[0].split("#")[0]))
        if not os.path.isfile(target):
            missing.append(ref)
            return m.group(0)
        return "url(%s%s%s)" % (quote, to_data_uri(target, stats), quote)

    return re.sub(r"""url\(\s*(['"]?)([^)'"]+)\1\s*\)""", repl, css)


def strip_css_comments(css):
    """Drop /* … */ comments from CSS before it is inlined into a deck.

    tokens.css and deck.css carry ~2,000 lines of internal design-system commentary
    (build-script names, locked-decision history, retired-client notes). None of that
    belongs inside a file you send to a client, and it roughly halves the deck size.
    Values are untouched — only comments are removed.
    """
    out, i, n = [], 0, len(css)
    while i < n:
        # don't strip inside a string literal
        ch = css[i]
        if ch in "\"'":
            j = i + 1
            while j < n and css[j] != ch:
                j += 2 if css[j] == "\\" else 1
            out.append(css[i:j + 1])
            i = j + 1
        elif css.startswith("/*", i):
            end = css.find("*/", i + 2)
            i = n if end == -1 else end + 2
            out.append(" ")
        else:
            out.append(ch)
            i += 1
    css = "".join(out)
    return re.sub(r"\n{3,}", "\n\n", css)


def main():
    ap = argparse.ArgumentParser(description="Make a Novus HTML deck self-contained (shippable).")
    ap.add_argument("deck", help="the authored .html deck")
    ap.add_argument("-o", "--out", help="output file (default: <name>_SHIP.html)")
    ap.add_argument("--theme", default="light", choices=["light", "dark"],
                    help="value pinned on <html data-theme=…> (default: light)")
    ap.add_argument("--keep-comments", action="store_true",
                    help="keep CSS comments (default: strip them, so internal design-system "
                         "notes never travel inside a client deck)")
    args = ap.parse_args()
    global KEEP_COMMENTS
    KEEP_COMMENTS = args.keep_comments

    src = os.path.abspath(args.deck)
    if not os.path.isfile(src):
        sys.exit("ERROR: no such file: %s" % src)
    base = os.path.dirname(src)
    out = args.out or os.path.splitext(src)[0] + "_SHIP.html"

    html = open(src, encoding="utf-8").read()
    stats = {"files": 0, "bytes": 0}
    missing = []

    # 1 ── inline every local <link rel="stylesheet">
    def inline_link(m):
        tag = m.group(0)
        href = re.search(r"""href\s*=\s*['"]([^'"]+)['"]""", tag)
        if not href:
            return tag
        ref = href.group(1)
        if ref.startswith(("data:", "http://", "https://")):
            return tag
        css_path = os.path.normpath(os.path.join(base, ref.split("?")[0]))
        if not os.path.isfile(css_path):
            missing.append(ref)
            return tag
        css = open(css_path, encoding="utf-8").read()
        if not KEEP_COMMENTS:
            css = strip_css_comments(css)
        css = embed_css_urls(css, os.path.dirname(css_path), stats, missing)
        return "<style>\n/* inlined from %s */\n%s\n</style>" % (os.path.basename(css_path), css)

    html = re.sub(r"""<link\b[^>]*rel\s*=\s*['"]?stylesheet['"]?[^>]*>""", inline_link, html,
                  flags=re.IGNORECASE)

    # 2 ── embed url(...) inside any remaining inline <style> blocks
    def inline_style_block(m):
        css = m.group(2)
        if not KEEP_COMMENTS:
            css = strip_css_comments(css)
        return m.group(1) + embed_css_urls(css, base, stats, missing) + m.group(3)

    html = re.sub(r"(<style[^>]*>)([\s\S]*?)(</style>)", inline_style_block, html, flags=re.IGNORECASE)

    # 3 ── embed <img src="...">
    def repl_img(m):
        attr, quote, ref = m.group(1), m.group(2), m.group(3)
        if ref.startswith(("data:", "http://", "https://")):
            return m.group(0)
        target = os.path.normpath(os.path.join(base, ref.split("?")[0]))
        if not os.path.isfile(target):
            missing.append(ref)
            return m.group(0)
        return "%s=%s%s%s" % (attr, quote, to_data_uri(target, stats), quote)

    html = re.sub(r"""\b(src)\s*=\s*(['"])([^'"]+)\2""", repl_img, html)

    # 4 ── embed url(...) used in style="" attributes
    html = embed_css_urls(html, base, stats, missing)

    # 5 ── pin the theme on <html>
    if re.search(r"<html\b[^>]*\bdata-theme\s*=", html, flags=re.IGNORECASE):
        html = re.sub(r"""(<html\b[^>]*\bdata-theme\s*=\s*['"])[^'"]*(['"])""",
                      r"\g<1>%s\g<2>" % args.theme, html, count=1, flags=re.IGNORECASE)
    elif re.search(r"<html\b", html, flags=re.IGNORECASE):
        html = re.sub(r"<html\b", '<html data-theme="%s"' % args.theme, html, count=1,
                      flags=re.IGNORECASE)
    else:
        html = '<html data-theme="%s">\n' % args.theme + html

    # 6 ── strip HTML comments too: the scaffold's authoring notes (LOCKED §… rules,
    #      build-script names) must not travel inside a deck sent to a client.
    if not KEEP_COMMENTS:
        html = re.sub(r"<!--(?!\[if)[\s\S]*?-->", "", html)
        html = re.sub(r"\n{3,}", "\n\n", html)

    open(out, "w", encoding="utf-8").write(html)

    # ── report ──────────────────────────────────────────────────────────────
    leftover = [r for r in re.findall(r"""(?:src|href)\s*=\s*['"]([^'"]+)['"]""", html)
                if not r.startswith(("data:", "#", "mailto:"))]
    leftover += [r for r in re.findall(r"""url\(\s*['"]?([^)'"]+)""", html)
                 if not r.startswith(("data:", "#"))]

    print("Self-contained deck written:")
    print("   %s" % out)
    print("   embedded %d asset(s), %.0f KB  ·  final size %.0f KB"
          % (stats["files"], stats["bytes"] / 1024, os.path.getsize(out) / 1024))
    if missing:
        print("\n!! COULD NOT FIND %d reference(s) — they are still external:" % len(missing))
        for r in sorted(set(missing)):
            print("     %s" % r)
        print("   Fix the paths and re-run, or the deck will break on another machine.")
    if leftover:
        print("\n!! %d EXTERNAL reference(s) remain — NOT safe to send yet:" % len(leftover))
        for r in sorted(set(leftover))[:12]:
            print("     %s" % r)
    if not missing and not leftover:
        print("\n   No external references remain — safe to send. ✅")
    print("\n   Now OPEN the file and check it renders before sending it.")
    return 1 if (missing or leftover) else 0


if __name__ == "__main__":
    sys.exit(main())
