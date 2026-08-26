# Make a Novus HTML deck — the default deliverable

**HTML is the master format for Novus presentations.** Build the deck in HTML first; it always
carries the latest design language. Convert to PDF or PowerPoint **later, from the signed-off
HTML**, only if a recipient needs it. Best tool: **Claude** (see `../For_Claude_users.md`).

---

## The five steps

```bash
# 1. copy the scaffold and author your deck in Chrome
cp html/novus-slide-template.html my_deck.html

# 2. gate it while you work
python3 build/check_deck.py my_deck.html

# 3. make the file you actually send
python3 build/make_selfcontained.py my_deck.html      # → my_deck_SHIP.html

# 4. gate the ship file
python3 build/check_deck.py my_deck_SHIP.html --ship

# 5. open my_deck_SHIP.html and look at every slide
```
Step 3 is not optional. A deck that still `<link>`s a stylesheet opens as a **black screen** in
Safari from `file://` — the most common way a Novus deck fails after you send it.

## What's in this folder
- `html/Novus_slide_template_PREVIEW.html` — **open this first** to see every layout, fully
  styled. It works in any browser (it is self-contained).
- `html/novus-slide-template.html` — the authoring **scaffold** you copy (a parts catalogue).
  **Open it in Chrome** — on a Mac, double-clicking opens Safari, which refuses to load the
  linked stylesheets from `file://` and makes it look broken. See `html/README.md`.
  **The title-slide hero-map globe is baked in** — nothing to fetch.
- `deck.css` — the locked slide component library. `../tokens.css` — colour and type.
- `build/` — the two tools above (zero dependencies) and their README.
- `pptx/` — PowerPoint assets for the later conversion path.
- `Migrate_a_deck_to_Novus.md` — rebuilding an existing deck onto Novus.
- `../photos/` — the graded photography set. Use these; never start a parallel photo library.

## Structure
`Title → Agenda → per section (Divider + content slides) → Closing.`

## The locked look
- **Title:** the website hero — dark ground, white master lockup top-left, headline and kicker
  left, the hero-map globe right. It is already in the scaffold: replace the headline, kicker and
  sub-line and you're done. Never a plain dark panel.
- **Sections: 4–10** (ten is the ceiling; more → restructure the story). Colours taken
  **contiguously** from the locked sequence, never invented or reordered:
  1 blue `#0070C0` · 2 amber `#E8A300` · 3 green `#00A04A` · 4 indigo `#534AB7` ·
  5 deep-blue `#00457A` · 6 orange `#E87830` · 7 slate `#51606F` · 8 deep-green `#0A6E38` ·
  9 bronze `#8A5E00` · 10 light-blue `#338ACE`.
  **Red is never a section colour** — it is reserved for status/danger.
- **One scheme per section:** eyebrow text, its dot and the active nav segment all use the same
  bright accent — never the darker −700 steps.
- **Footer.** Content slides carry the nav bar (one segment per section; the current one lit, the
  rest tinted). **Title, Agenda, Section Dividers and Closing carry NO nav bar** — footer line
  only. Every footer: the logo bottom-left as a **placed asset** (colour on light, white on dark
  — never typed), centred `CONFIDENTIAL · <topic> · <year>`, and the page number.
- **Type (the §9 scale):** title 46px · body 24px · bullets 22px (`›` hanging indent) ·
  hero 72px · caption/footer 17px floor. Too much text → shorten it or split the slide.
  **Never shrink below the scale.**
- **Body rhythm:** the content region centres vertically between the title block and the footer.
  Never top-align to force a fit — reduce the content instead.
- **Product and platform names are lockups** placed from `../logos/lockups/`, never typed.
  Platform building blocks use the **architecture block** (novahub · novaware · novaserve with a
  novaai band), never a bullet list.
- **Photography** from `../photos/`, as full-bleed figures or split layouts; the footer sits on a
  scrim over a photo, never directly on the image.
- **Client and partner marks** are never recoloured, inverted or filtered; on a dark ground use
  the original colours on a white holder tile. Client walls use `../logos/clients/_wall/`.
- **Wording:** **"Service as Software"**, never "SaaS". Cite real clients only.

## Pre-ship checklist
- [ ] Title is the hero (globe + white lockup), not a plain panel
- [ ] Every content slide has the nav bar; Title/Agenda/Dividers/Closing do not
- [ ] 4–10 sections, colours contiguous, consistent across the deck
- [ ] Logo is a placed asset everywhere — no retyped "novus"
- [ ] Product names are lockups; platform layers use the architecture block
- [ ] Type follows the §9 scale; nothing below the 17px floor
- [ ] No empty photo slots, no "goes here"/TBD left in
- [ ] `check_deck.py … --ship` is clean
- [ ] You have opened the SHIP file and looked at every slide

## Convert later (only if asked)
- **PDF:** open the ship file in Chrome → Print → **Save as PDF**, landscape, margins none,
  **background graphics ON** — one slide per page.
- **PPTX:** rebuild on `pptx/Novus_Starter_Deck.pptx` (see `Make_a_PPTX_deck.md`).
