# Novus Design System — Starter Kit

> ## ⚠️ STEP 1 — INSTALL CARLITO FIRST (30 seconds)
> Open **`Install_the_Novus_font.md`** and install the two Carlito `.ttf` files. **Nothing renders
> correctly until you do this.** Carlito is the Novus typeface; on macOS especially, Word/PowerPoint
> and your own previews won't use a font that's only embedded in a file — it must be installed.

This is a **self-contained, read-only copy** of the Novus design system so you can produce
on-brand content on your own machine. Everything you need is inside this folder — the design
rules, the fonts, the logos, and the deck templates.

> ## 🎯 THE DEFAULT DELIVERABLE IS AN HTML PRESENTATION
> Build every presentation as a **self-contained HTML deck first** — it is the master format and
> always carries the latest Novus design language. **Convert to PDF or PowerPoint later, from the
> HTML**, only when a specific recipient needs those. Start at
> **`slide-template/Make_an_HTML_deck.md`** with the template in **`slide-template/html/`**.

> ## 👉 PICK YOUR TOOL
> - **Claude** (claude.ai, incl. free — HTML decks, apps, web, copy) → **`For_Claude_users.md`**
> - **Microsoft 365 Copilot** (PowerPoint / Word, for the later PPTX/PDF conversion) → **`For_Copilot_users.md`**
>
> This is a **shared reference snapshot**, not the master. The living source of truth stays with
> the design-system owner (Rick). Point your AI tools at these files and copy from them — don't
> treat this folder as the place to edit the system itself.

---

## The 3 sources of truth (the whole system lives in three files)

1. **`tokens.css`** — the machine-readable design tokens (every colour, type size, spacing,
   radius, shadow) plus the locked design rules. All styling derives from here.
2. **`brand.html`** — the human-readable visual guide. Open it in any browser to *see* the
   colours, type, components, logo rules and presentation/deck rules. (`Novus_Brand_Guide_STANDALONE.html`
   is the same guide with fonts + images embedded, so it renders correctly opened on its own.)
3. **`Novus_Context.md`** — the team-edition working context: who Novus is, the products, the
   voice, and every locked brand decision in plain language.

Supporting assets (already referenced by the three files above):

- **`fonts/`** — Carlito, the Novus typeface. `*.woff2` for web/HTML; `ttf/` for Office & Word.
- **`logos/`** — the complete brand asset set (see `logos/README.md`): the Novus master logo +
  wordmark in 6 treatments; **all 10 product & platform sub-brands** (novapay · novabank ·
  novastore · novatrust · novahub · novaware · novaserve · novaai · novaboost · novaplan) each as
  icon SVG + icon PNG + two-tone **lockup**; the **13 client marks** and **13 payment-scheme marks**
  (plus `_wall/` size-normalised versions); the title-slide background and footprint map.
  **Never retype or redraw a Novus mark — always place these files.**
- **`slide-template/`** — the deck kit. Primary guide: **`Make_an_HTML_deck.md`** (HTML — the
  default); also `Migrate_a_deck_to_Novus.md` and `Make_a_PPTX_deck.md` (the later conversion).
  Assets: `html/` (the authoring scaffold — **the title hero-map globe is baked in**),
  `deck.css` (the locked components), `pptx/` (`Novus_Template.potx`, `Novus_Starter_Deck.pptx`,
  `Novus_Brand_Lockups.pptx`).
- **`slide-template/build/`** — **two tools, zero installs** (see its README):
  `make_selfcontained.py` (turns your deck into the file you actually send — run it every time)
  and `check_deck.py` (the gate: catches black-screen decks, retyped logos, invented section
  colours, type below the floor, leftover placeholders).
- **`photos/`** — the graded Novus photography set. Use these; never start a parallel library.

---

## How to use it

### Make a presentation (the main job) — HTML first
To **see** the template, open **`slide-template/html/Novus_slide_template_PREVIEW.html`** —
it works in any browser. To **build**, read **`slide-template/Make_an_HTML_deck.md`** and copy
**`slide-template/html/novus-slide-template.html`**, opening it **in Chrome** (on a Mac,
double-clicking opens Safari, which cannot load the linked stylesheets and shows a broken page). It carries the latest design language —
Carlito, the section-nav footer, product **lockups**, the platform **architecture block**, and
the globe hero title (already baked in).

Then, every time, before you send it:
```bash
python3 slide-template/build/check_deck.py my_deck.html
python3 slide-template/build/make_selfcontained.py my_deck.html
python3 slide-template/build/check_deck.py my_deck_SHIP.html --ship
```
The middle step is what stops a deck opening as a **black screen** on someone else's machine —
the most common way a Novus deck fails after you send it. **Only after** the HTML is signed off
do you convert to PDF (print-to-PDF from Chrome) or PowerPoint (`Make_a_PPTX_deck.md`).

### Build an app, web page or component
Point it at **`tokens.css`** and derive everything from the CSS variables — see
**`Use_tokens_in_your_app.md`**. No ad-hoc hex or spacing: if the token defines it, use `var(--…)`.

### Draft an on-brand document or copy with AI
Attach the 3 sources (or just `Novus_Context.md` + `tokens.css`) to Claude or Copilot and ask it
to derive colours from the tokens and follow the Novus voice.

---

## A few locked rules worth knowing

- **Deliverable format:** HTML presentation is the master; PDF/PPTX are conversions made later.
- **Type:** Carlito everywhere (the free, metric-identical twin of Calibri).
- **Colour:** blue `#0070C0` is the default accent; green is success/status only, never a page
  ground; one accent per view.
- **Logos:** always place the supplied asset files — a typed-out "NOVUS" is not the logo.
- **Model wording:** Novus is **"Service as Software"** — never "SaaS" / "Software as a Service".
- **One system, three files, kept in lockstep** — if you spot the three disagreeing, flag it to
  the design-system owner rather than fixing one in isolation.

*Snapshot generated 2026-08-25 — this replaces the previous shared folder in full. For the current
master, check with Rick before relying on an old copy.*
