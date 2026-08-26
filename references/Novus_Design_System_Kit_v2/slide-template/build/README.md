# The two deck tools

Zero dependencies. Python 3.8+ (macOS and Windows both ship it). No installs.

## 1. `make_selfcontained.py` — run this before you send ANY deck
```bash
python3 make_selfcontained.py my_deck.html
```
Turns your authored deck into the file you actually send:

- inlines `tokens.css` + `deck.css`
- embeds Carlito and every image as base64
- pins `<html data-theme="light">`
- **strips CSS and HTML comments**, so the design system's internal notes never travel
  inside a deck you hand to a client (`--keep-comments` if you ever need them)

**Why it matters:** while authoring, your deck *links* the stylesheets. Safari refuses to load
a sibling stylesheet from a `file://` page, so a linked deck opens as a **black screen** on the
recipient's machine. This is the single most common way a Novus deck fails in the wild.

## 2. `check_deck.py` — the gate
```bash
python3 check_deck.py my_deck.html              # while authoring
python3 check_deck.py my_deck_SHIP.html --ship  # the file you're about to send
```
Checks what a person reliably misses:

| Check | What it catches |
|---|---|
| SHIP1–4 | external links/assets, missing embedded font, unpinned theme (the black-screen family) |
| LOGO1–2 | a retyped "NOVUS" instead of the placed mark |
| SEC1–3 | invented or non-contiguous section colours; more than ten sections; red used as a section |
| NAV1–3 | nav bars that disagree, wrong segment count, more than one segment lit |
| TYPE1 | reading text below the 17px floor |
| PH1–2 | empty photo slots and leftover "goes here" / TBD placeholders |
| PG1 | page numbers out of order |
| W1–3 | "SaaS" instead of "Service as Software"; a retired client mark |

Exit 0 = clean, 1 = at least one FAIL. **A green gate is not sign-off** — it cannot see layout.
Always finish with the visual pass: open the deck and look at every slide.

> Running the gate on the scaffold itself reports failures (empty photo slots, sample page
> numbers). That is correct — the scaffold is a parts catalogue, not a deck.
