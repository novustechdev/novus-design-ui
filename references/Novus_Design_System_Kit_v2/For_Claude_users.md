# Instructions for **Claude** users

You're using **Claude (claude.ai)** — including the **free** version — to produce HTML decks,
apps, web assets, copy and outlines. This is your one place. (Using Microsoft Copilot in Office
for the later PPTX/PDF conversion? See **`For_Copilot_users.md`**.)

> ## ⚠️ FIRST — for previews, install Carlito
> Finished HTML output **embeds** the font, so your end users need nothing. But install the two
> `.ttf` files from `fonts/ttf/` (**`Install_the_Novus_font.md`**) so your own previews look right.

## 🎯 Default deliverable: a self-contained HTML presentation
Build every deck as **HTML first** — it is the master format and carries the latest design
language. Convert to PDF/PPTX only later, from the signed-off HTML. Full recipe:
**`slide-template/Make_an_HTML_deck.md`**.

## The one move that makes everything on-brand
**Attach the design system to your chat**, then tell Claude to derive everything from it:
- **`tokens.css`** — every colour, type size, spacing, radius, shadow + the rules (required)
- **`Novus_Context.md`** — who Novus is, the voice, the locked decisions (required)
- **`brand.html`** — optional, so Claude can *see* the components
- For decks, also attach **`slide-template/html/novus-slide-template.html`** (the scaffold) and
  **`slide-template/deck.css`**; for logos in output, attach the files from `logos/`.

> Standing instruction to paste in: *"Use the attached Novus tokens.css as the single source of
> truth. Reference the CSS variables only — var(--surface), var(--text), var(--blue-500),
> var(--space-4), var(--radius-md), var(--font-sans) — never invent hex or px for anything the
> tokens define. Follow Novus_Context.md for voice and the locked rules."*

## What Claude is great for
**Self-contained HTML decks**, websites, **apps**, components, emails, copy, and outlines.

### 1. Make an HTML deck (the default)
Attach the scaffold + `deck.css` + `tokens.css` + `Novus_Context.md` and ask for one 1280×720
`<section class="slide">` per slide, with the footer nav bar (content slides only), product
**lockups**, and the platform **architecture block**. Ask Claude to **inline tokens.css and embed
Carlito + images as base64** so the file opens anywhere. Steps + prompt in
**`slide-template/Make_an_HTML_deck.md`**.

### 2. Convert an HTML deck to PDF or PPTX (later)
- **PDF:** open the HTML deck in Chrome → Print → Save as PDF (A4/landscape, margins none,
  background graphics on). One slide per page.
- **PPTX:** hand the content/outline to Copilot and rebuild on `Novus_Starter_Deck.pptx`
  (`For_Copilot_users.md`), or ask a colleague with Cowork to assemble it. PPTX is the
  editable-Office fallback, not the primary format.

### 3. Point an app / web page at the design system
Attach `tokens.css` + `Novus_Context.md` and ask Claude to build the component/page referencing
`var(--…)` only, with dark mode via `data-theme` + `prefers-color-scheme`. Full detail in
**`Use_tokens_in_your_app.md`**.

## Important limit of free Claude (read this)
Free claude.ai returns **text and artifacts (HTML / React / Markdown)** — it does **not** hand you
a finished **`.pptx`/`.docx`**. That's fine: our default *is* HTML. Use Claude for the HTML deck
(and the copy); do the PPTX/PDF conversion afterwards.

## The locked look (what "on-brand" means)
- **Carlito** everywhere (`--font-sans`). Prefer semantic tokens (`--bg`, `--surface`, `--text`,
  `--accent`, `--border`) so dark mode just works.
- Deck footer **nav bar = one segment per section** (active full-colour + thicker), **content
  slides only**; Title/Agenda/Dividers/Closing have none.
- **Sections: 4–10** (ten is the ceiling; more → restructure), colours taken contiguously from the
  locked sequence — never invented or reordered.
- Product/platform names are **lockups** (icon tight to the two-tone name), placed from `logos/`
  — never typed. Platform building blocks use the **architecture block**, not a bullet list.
- **"Service as Software"**, never "SaaS". Cite real clients only. No ad-hoc hex — if the token
  defines it, use `var(--…)`.
