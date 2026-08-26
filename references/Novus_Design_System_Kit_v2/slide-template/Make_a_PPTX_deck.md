# Make / convert a Novus PowerPoint deck (secondary format)

PowerPoint is **not** the primary Novus deck format — **HTML is** (see `Make_an_HTML_deck.md`).
Use this when a recipient specifically needs an editable `.pptx`, usually by converting an
approved HTML deck.

## Start from the template (never a blank deck)
1. Open **`pptx/Novus_Starter_Deck.pptx`** → **File ▸ Save a Copy**, rename. This keeps the Novus
   layouts, theme, embedded Carlito, logo and the section **colour tracker** (footer nav bar).
   Building from blank loses the tracker. `pptx/Novus_Template.potx` is the org template
   (hand-maintained — never regenerate it).
2. Recreate each slide's content on the matching layout: Title (globe hero), Agenda, Section
   Divider, Content (list / cards / KPI / two-column), Closing. With Copilot, use "Rewrite / fill
   this slide" — it keeps the layout and swaps only your text.
3. **Lockups:** product/platform names are two-tone lockups, not typed. Open
   **`pptx/Novus_Brand_Lockups.pptx`**, copy the one you need onto your slide, delete the helper
   slide before sending.

## Migrating an old deck
Rebuild onto the template — don't "reskin" the old file. Go slide by slide, paste the text into the
matching Novus layout, tighten each to one idea, redraw pasted screenshots as native content, apply
lockups, keep the colour tracker. More detail: `Migrate_a_deck_to_Novus.md`.

## The locked look
Same as HTML: Carlito everywhere; sections 4–10 with contiguous locked colours; nav bar on content
slides only; globe-hero title; architecture block for platform layers; "Service as Software"; real
clients only; no ad-hoc hex. See `Make_an_HTML_deck.md` for the full colour sequence and rules, and
`Make_an_HTML_deck.md` for the full rule set (it is the same design in both formats).
