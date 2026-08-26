# Instructions for **Microsoft 365 Copilot** users

You're on **Copilot in Microsoft Office** (PowerPoint, Word). This is your one place.

> ## 🎯 HEADS-UP: HTML is the primary deck format
> Novus presentations are built as **self-contained HTML first** (they always carry the latest
> design language), and converted to PowerPoint/PDF **later**. Use Copilot for that conversion —
> and for Word documents and for drafting deck **content/outlines**. For a bespoke website/app or
> the HTML deck itself, use Claude (**`For_Claude_users.md`**).

> ## ⚠️ FIRST — INSTALL CARLITO (one time, 30 seconds)
> Open **`Install_the_Novus_font.md`** and install the two `.ttf` files from `fonts/ttf/`.
> On macOS especially, Office silently swaps in the wrong font until it's installed.

## 1. Turn an approved HTML deck into PowerPoint
1. Open **`slide-template/pptx/Novus_Starter_Deck.pptx`** → **File ▸ Save a Copy**, rename.
   Starting from the starter keeps the Novus layouts, theme, logo and the section **colour
   tracker** (the footer nav bar). Building "from a blank deck" loses the tracker.
2. Recreate each HTML slide's content on the matching Novus layout (Title, Agenda, Section
   Divider, Content list / Cards / KPI, Closing). Use **Copilot ▸ "Rewrite / fill this slide"**
   or type directly — Copilot keeps the layout and only swaps your text.
3. **Product/platform names** must be **lockups**, not typed text. Open
   **`slide-template/pptx/Novus_Brand_Lockups.pptx`**, copy the lockup you need onto your slide,
   delete the helper slide before sending.
4. More detail: **`slide-template/Make_a_PPTX_deck.md`**.

## 2. Make a Word document on-brand
- Set the font to **Carlito**. Use the brand colours (headings Novus Blue `#0070C0`, body black);
  one accent per document.
- Or attach **`tokens.css` + `Novus_Context.md`** to Copilot, ask it to draft the content in the
  Novus voice, then apply Carlito + the colours in Word.

## The locked look (what "on-brand" means)
- **Carlito** everywhere. Section colours taken contiguously from the locked sequence: 1 blue
  `#0070C0` · 2 amber `#E8A300` · 3 green `#00A04A` · 4 indigo `#534AB7` · 5 deep-blue `#00457A`
  · 6 orange `#E87830` · 7 slate `#51606F` … up to **10** (ten is the ceiling).
- Footer **nav bar = one segment per section** (active full-colour + thicker) — on **content
  slides only**; Title, Agenda, Dividers and Closing have **no** nav bar.
- Product/platform names are **lockups**; platform building blocks use the **architecture block**,
  never a bullet list. Title slide = the **globe hero**. **"Service as Software"**, never "SaaS".
  Cite real clients only.

## Two ground rules
- **Colours and fonts come from the kit** — no ad-hoc hex, always Carlito.
- **Logos:** always place the supplied files from `logos/` (or the Brand Lockups slides). A
  typed-out "NOVUS" is not the logo.
