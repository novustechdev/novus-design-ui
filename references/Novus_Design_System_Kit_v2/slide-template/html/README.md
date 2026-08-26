# Novus HTML slide template

## ⚠️ Which file to open

| File | What it's for | Opens in |
|---|---|---|
| **`Novus_slide_template_PREVIEW.html`** | **Just looking at the template** — every layout, fully styled. | **any browser** (double-click it) |
| `novus-slide-template.html` | **Authoring** — the scaffold you copy to build a deck. | **Chrome only** |

**If you double-click `novus-slide-template.html` on a Mac it opens in Safari and looks
broken** — giant overlapping logos and coloured blocks. Nothing is wrong with the file.
Safari refuses to load files from *outside a page's own folder* over `file://`, and the
scaffold deliberately links `../../tokens.css` and `../deck.css` so it always tracks the
live design system. Chrome allows it; Safari does not.

- **To look at the template →** open `Novus_slide_template_PREVIEW.html`.
- **To build a deck →** open `novus-slide-template.html` **in Chrome** (right-click ▸ Open
  With ▸ Chrome), or drag the file onto a Chrome window.

This is the same rule that governs decks you send: a delivered deck must be self-contained.
`build/make_selfcontained.py` is what produces one — the PREVIEW above was made with it.

## About the scaffold
It is a **parts catalogue, not a finished deck** — one of every layout (Title, Agenda,
Content with the section-nav footer, Section Divider, Closing, Two-Column, photo and product
layouts) so you can copy the pieces you need. That is why it contains empty photo slots and
sample page numbers; `check_deck.py` flags those, which is expected *for the scaffold* and
must not be true of your real deck.

- **The title-slide hero-map globe is baked in** — SVG and CSS both, animated payment flows
  included. Nothing to fetch; just replace the headline, kicker and sub-line.
- Product names are placed **lockups** from `../../logos/lockups/`, never typed.
- Photography goes in the empty `<img>` slots — use the graded set in `../../photos/`.

## Workflow
1. **Copy** the scaffold (don't edit it in place). Author in **Chrome**.
2. Build the story: Title → Agenda → per section (Divider + content slides) → Closing.
3. `python3 ../build/check_deck.py my_deck.html`
4. `python3 ../build/make_selfcontained.py my_deck.html` → `my_deck_SHIP.html`
5. `python3 ../build/check_deck.py my_deck_SHIP.html --ship`
6. Open the SHIP file and look at every slide before sending.

**Never send the linked authoring copy** — step 4 is what makes it safe to send anywhere.

Full guide: `../Make_an_HTML_deck.md`.
