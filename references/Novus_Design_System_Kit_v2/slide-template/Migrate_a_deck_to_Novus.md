# Migrate an old deck to Novus

The reliable path is **rebuild onto the Novus structure — never "reskin" the old file.** A
reskin keeps the old grid, the old type sizes and the old diagrams, and it always reads as a
foreign deck wearing Novus colours.

Target format is **HTML** (see `Make_an_HTML_deck.md`); produce PPTX/PDF afterwards only if a
recipient needs one.

## 1. Audit the old deck first
List every slide and what job it does. Most old decks carry 30–40% slides that exist only
because someone added them once. Decide *before* you build: keep · merge · drop.

## 2. Propose the mapping, then get it agreed
Map the survivors onto the Novus flow:

`Title → Agenda → per section (Divider + content slides) → Closing`

- **Sections: 4–10** (ten is the ceiling — more means the story needs restructuring, not more
  sections). Colours are taken **contiguously** from the locked sequence — never reordered,
  never invented.
- One idea per slide. If a slide has three ideas, it is three slides or one tighter slide.
- Show the mapping to the deck owner before building. Rework at outline stage is cheap; rework
  after building is not.

## 3. Rebuild on the scaffold
Author on `html/novus-slide-template.html`. Copy the layout you need for each slide and pour
the content in. **Do not re-derive the CSS from the written rules** — that is exactly how a
migration ends up "not the Novus template".

## 4. The rules that catch migrations out
- **Diagrams, charts and tables must be redrawn natively** — as tiles, chevrons, bullet blocks,
  KPI bands or the architecture block. **Never paste a raster screenshot of an old slide:** it
  carries the old template inside the frame and defeats the whole migration. (If a diagram
  genuinely cannot be redrawn, get the owner's approval for that specific element.)
- **Photographs** may ship as full-bleed figures, with the footer on a scrim. Use the graded
  set in `../photos/` — never start a parallel photo library.
- **Client and partner marks** are never recoloured, inverted or filtered. On a dark ground,
  place the original colours on a white holder tile. Use `../logos/clients/_wall/` for walls.
- **Product names become lockups** placed from `../logos/lockups/` — never typed text.
- **Hidden slides** in the source become clearly-labelled appendices, or they are dropped.
  Never leak migration notes ("hidden in source deck") into the deliverable.
- **"Service as Software"**, never "SaaS". Cite real clients only.

## 5. Gate and ship
```bash
python3 build/check_deck.py my_deck.html
python3 build/make_selfcontained.py my_deck.html
python3 build/check_deck.py my_deck_SHIP.html --ship
```
Then the visual pass — open it and look at every slide, against the scaffold and a known-good
deck, before sign-off.

## When to ask rather than guess
Ask the deck owner when: a slide has no Novus layout that fits · the story seems to need more
than ten sections · a diagram can't be redrawn natively · you're unsure whether a client is
current. Guessing on any of these is what produces a deck that gets rejected.
