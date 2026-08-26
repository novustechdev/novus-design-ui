# Novus — Brand & Design Context (team edition)

> **Team-safe snapshot for producing on-brand Novus deliverables.**
> This is a curated, shareable subset of the Novus working context: the company facts,
> the products and positioning, the voice, and every locked design-system rule you need.
> Internal operations, folder maps, working instructions and any confidential material
> have been removed. The living master stays with the design-system owner (Rick).
>
> Use this together with `tokens.css` (exact colours/type/rules) and `brand.html`
> (the visual guide). Snapshot: 2026-08-25.
>
> **A note on paths.** This document is the design system's own reference, so it mentions build
> scripts and folders that live with the master system (`build_pptx_template.py`, `site/`,
> `catalogue/`, and similar). Those are not part of this kit and you do not need them — they
> describe how the system is maintained, not how you use it. Everything you need to produce work
> is in this folder; start at `START_HERE.md`. The two tools you *do* get are in
> `slide-template/build/` (`check_deck.py` and `make_selfcontained.py`).

---

## 1. Company snapshot

- **Name:** Novus Technologies Pte Ltd
- **Legal entity (LOCKED — use verbatim in all legal documents):** Novus Technologies Pte. Ltd. (UEN: 201303876N), a company incorporated in the Republic of Singapore, with its registered office at 152 Beach Road, Gateway East 13-05, Singapore 189721 (hereinafter "Novus").
- **Website:** www.novustech.com.sg  *(the only correct domain; do NOT use novustechnologies.net — that is a different, unrelated company)*
- **LinkedIn (the ONLY Novus Technologies page):** https://www.linkedin.com/company/novus-technologies-pte-ltd/  *(use the www. form — the sg. locale subdomain does not resolve reliably for signed-out visitors or visitors outside Singapore). Confirmed by Rick 2026-08-18: **Novus Technologies LLC**, **Novus Technologies (ME)**, **Novus Technology Integration Inc.**, **Novus Global Technologies Inc.**, **Novus International Inc.**, **NOVUS (novus-consult)** and **Novus Ferro Pte Ltd** are DIFFERENT, unrelated companies — never link, cite, or treat any of them as Novus.*
- **Facebook:** https://www.facebook.com/novustech.sg/  *(awaiting confirmation this is the official page — do not cite as canonical until confirmed)*
- **Founded:** 2013, in Singapore, by Ricardos Khoury (~13 years in operation as of 2026).
- **HQ:** Singapore — 152 Beach Road, #13-05 Gateway East, Singapore 189721 · +65 6297 7085 · info@novustech.com.sg
- **CEO & Founder:** Ricardos Khoury (BS Computer Science, Notre Dame University; MBA in AI, University of Cumbria; ex-Wincor Nixdorf APAC).
- **What we do:** Digital transformation for Asia's banking, payments and retail sectors — digital banking & agency banking (financial inclusion), digital payments, and retail/fuel-station automation — delivered as **Service as Software** (we provide the technology *and* run 24/7 managed operations). Core platform: **Novus TRANSACT**.
- **Regulatory standing (Philippines):** Novus Transact Philippines Corporation is a **BSP-registered Operator of Payment Systems (OPS)** and a **BancNet member**. (Broader regional standing — LankaPay service provider, NBC Cambodia processor, Central Bank of Botswana government-collections partner — lives in the portfolio profile.)
- **Regional presence (7 Asian countries):** Singapore (HQ), Malaysia, Indonesia, Cambodia, Philippines, Sri Lanka, Botswana. Local entities: PT Nova Digital Perkasa (Indonesia, Jakarta); Novus Transact Philippines Corporation (Makati); NovusTech Transact Lanka (Pvt) Ltd (Colombo); Novus Technologies (Cambodia) Company Limited (Phnom Penh).
- **Leadership (from April 2026 Extended deck):**
  - **Executive:** Ricardos Khoury (President & CEO · Founder); Thorsten Hellwig (Chief Operating Officer); Armand Wijaya (Chief Investment Officer); Jim Geovedi (Chief Technology Officer).
  - **Country & functional leadership:** Ariel Gumabao (Country Head, Philippines); Lahan G. (Country Head, Sri Lanka); Khairuan A. R. (Country Head, Indonesia); Elie Estephan (Country Head, Malaysia); Sidath Wijeratne (Head – Strategic Initiatives).
  - *Note: Jim Geovedi is CTO per the deck; an earlier website listing of Robert van der Ent (CTO & CISO) is superseded unless reinstated. Team character: ex-payment-regulators, ex-bankers, tech & cyber experts, ex-consultants — governance-oriented; 10+ nationalities.*
- **Strategic priority:** Becoming an **AI-First** organisation (see the NovaAI program); current modernisation toward public cloud + AI (the "Novus 3.0" launch).

> Authoritative source for company facts: the master decks in `02_Slide_Decks/`
> (esp. "Novus Combined Slides…", "Novus slides … April 2026 - Updated") and the
> `03_White_Papers/`. The public website (novustech.com.sg) is partial/older — defer
> to the decks/white papers where they differ.

## 2. Operating scale & opportunity (from April 2026 master deck)

- **Scale:** 1,000,000+ touchpoints served · 120,000,000+ transactions/month ·
  99.8% platform uptime · ~600 experts across 7 countries · ~one-decade regional journey.
- **Opportunity framing:** 490M+ people living across Novus's seven markets (total population — UN 2026; this is **reach, not an addressable market**: 491,905,038 across ID/PH/MY/LK/KH/SG/BW) ·
  $2T+ digital-payments market by 2028 · 290M unbanked adults in SE Asia ·
  40%+ YoY growth in real-time payments.
- **Core platform:** **Novus TRANSACT** — three AI-embedded layers (see §2b).
- **Value chains enabled:** ACCEPT (acceptance & channel enablement) → PROCESS
  (switching, routing, orchestration) → CONTROL (fraud, reporting, reconciliation,
  visibility) → EXPAND (new use cases, partnerships, growth).

## 2a. Products — four pillars + novaboost (Talent & Managed Services)

> **Product naming history (LOCKED, 2026-07-26).** Products were renamed over Novus's life;
> older names are Novus-era (NOT pre-Novus) and must classify under today's vertical:
> - **→ novabank:** YouBank, iTeller, iKiosk, iBank (core), Agency Banking, Bank-in-a-Box, ATM Go, OUTPOST (old name of ATM Go)
> - **→ novapay:** YouPay, novaWallet, novaEDC, novaMPOS, novaTMS, novaTRACK, Project OneCard, SoftPOS/SmartPOS, EDC
> - **→ novastore:** Digistore, novaFuel, Forecourt
> - **Mobile Wallet** spans **both** novabank and novapay.
> - **novaCURE** = a service app on the **novaserve** platform layer (not a product vertical).
> - **novaRADAR** (prospect-scanning) and **novaplan** (revenue planning) are internal TOOLS, not products/verticals. **They still carry the standard lockup** — see the Internal tool lockups decision below.
> These aliases are loaded in `catalogue/build_materials_index.py` (VERTICALS + STRONG) so legacy-named
> material tags to the correct current product on the next catalogue rebuild.

- **novabank** — Digital Banking: Financial Inclusion, Bank-in-a-Box core (accounts,
  ledger, KYC), Agency Banking (last-mile agents/kiosks), ATM as a Service, digital
  wallet & mobile, card issuance, micro-lending & gov't disbursements, open/BaaS APIs,
  AML/CFT & regulatory reporting. Flagship: **RCBC** agency-banking (Philippines);
  **People's Bank** self-banking units (Sri Lanka).
- **novapay** — Digital Payments (full stack, omnichannel "pay as you wish"): switching
  & routing, card issuing & acquiring, QR/NFC, internet payment gateway (3DS2,
  tokenisation), mobile/USSD wallets, POS as a Service (Smart/SoftPOS), reconciliation
  & settlement.
- **novastore** — Digital Retailing (last-mile): Smart & Soft POS (retail, F&B, fuel),
  fuel/forecourt automation, store & F&B management, omnichannel loyalty, eCommerce
  (O2O), data intelligence & AI, embedded novapay, merchant banking bridge.
- **novatrust** — Digital Security (Security as a Service): HSM as a Service
  (FIPS 140-2 L3), key management & RKL (PQ-ready), encryption & tokenisation (PCI-DSS),
  digital signature & compliance (ISO 27001, SWIFT CSP), fraud prevention & AML/CFT,
  SOC as a Service (24/7 SIEM), pen-testing/VA/zero-trust, post-quantum resilience.
- **novaboost** — Talent & Managed Services (the fifth vertical brand; the "Service as Software" delivery muscle). Accent = **Logo Orange `#E87830`**. Two halves:
  (1) **Talent solutions** — Resource-as-a-Service (certified experts on demand),
  end-to-end recruitment (sourcing→onboarding), contract talent, executive/specialist
  search, Talent Process Outsourcing (TPO); (2) **Managed services** — Application &
  Infrastructure Managed Services (AMS/IMS), outcome-based operations (SLA-governed,
  24/7 NOC), quality engineering & continuous improvement. **Commercial tiers** scale
  by accountability: one-time recruitment fees → Resource-as-a-Service → outcome-based
  operations → strategic transformation partnerships (risk-reward / gain-share).
  **Delivery frameworks:** BOT (Build-Operate-Transfer), CoE (Centre of Excellence),
  ODC (nearshore/offshore delivery centre).

## 2c. Positioning, vision & mission (April 2026 deck)

- **Mission:** deliver innovative digital infrastructure, technology and managed services
  that help institutions modernise faster, operate securely, and focus on core growth.
- **Vision:** be the trusted payment ecosystem partner enabling frictionless omni-channel
  digital experiences across banking, retail, fintech and PayTech.
- **Positioning line:** "We carry the infrastructure, technology and operations — so our
  partners can carry the market and care for their end customers."
- **Scheme stance (LOCKED framing):** Novus is a **scheme accelerator, not a competitor** —
  it builds the infrastructure, merchant base and digital experiences that drive *more*
  transactions for the card schemes/national rails (describe generically; keep partner/
  scheme brands buffered per the partner-branding rule).

## 2b. Platform layers + intelligence core

- **novahub** — Experience, Intelligence & Services layer (UI/UX, business logic,
  value-added services, integration, portals/dashboards, data visualisation & intelligence, APIs).
- **novaware** — Deployment & Orchestration layer (switching & routing, device driving
  ATM/POS/kiosk, card management, crypto & key management, channels).
- **novaserve** — Operations / Operational Continuity layer (24/7 local support across
  7 countries, NOC, 99.8% uptime, vendor & device management, managed regulatory compliance).
- **novaai** — the intelligence core woven through every layer; the "Novus Data Flywheel"
  (every transaction generates data → trains AI → creates new value): credit scoring,
  fraud detection, personalisation, loyalty optimisation, cross-vertical product intelligence.

## 3. White Paper Series (April 2026) — "Reimagined"

Each title ships as docx + pdf + a one-page teaser + a deck. Located in `03_White_Papers/`.

- **The Last Mile Reimagined** — financial inclusion via agent banking (290M unbanked in SE Asia).
- **The Delivery Channel Reimagined** — channel outsourcing.
- **The Neobank Reimagined** — neobank launch.
- **The Payment Card Reimagined** — card management & tokenization.

## 6. Voice & tone (from CEO communications)

- Direct, candid, and honest — names problems plainly, then points to the redesign.
- Vision-led and decisive; "AI-First", "first principles", "Second Brain".
- Respectful of the team's history while pushing hard for change.
- Concrete over abstract: real numbers, real cases, specific expectations.
- Avoid: vague corporate filler, hype without evidence, hedging.

## Novus App Interface Conventions (Design System — added 2026-06-25)

Rules for every Novus app / web UI. Enforced in `00_Design_System/tokens.css`; documented in `brand.html`.

1. **White ground.** The page background is always `--bg` (white in light mode); never `--bg-subtle` / `#F4F7FA` (neutral-50) — it reads as a faint green tint beside white cards.
2. **Dark mode + toggle.** Ship an explicit `[data-theme]` light/dark layer plus a persisted moon/sun toggle (e.g. Settings → Appearance); default follows the OS (`prefers-color-scheme`); apply the saved choice before paint to avoid a flash.
3. **Logo swap.** Colour master lockup in light, **white** lockup in dark, via `.brandlogo--light` / `.brandlogo--dark`. Never put inline `display` on the logo `<img>`s — inline style defeats the swap.
4. **Dark-mode text.** Never pair a hardcoded dark hex text colour with a token surface (dark-on-dark); use `--accent-text` / `--success-text` / `--danger-text`. Fixed light-tint chips (fixed light bg + fixed dark text) are fine in both modes.
5. **Elevation on white.** Overlaid cards rest on `--shadow-2` and rise to `--shadow-3` on hover; resting shadow on all cards, hover-lift only on clickable cards.
6. **Colour discipline.** Blue (`--accent`) is the default accent; green is success/status only, never a page or panel ground; one accent per view.
7. **Portable build.** Single-file / offline apps inline `tokens.css`, embed Carlito (woff2), and adopt the component classes (`.btn` / `.card` / `.badge` / `.table`).
8. **App shell (header / nav / logo).** The top bar and nav are full-bleed (background + bottom hairline span the viewport) but their **inner content aligns to the same centered content column as the main area** — every app shares one content width, `--container` = **1200px** (side padding `--gutter`) — the logo and menu must never float to the window edge. Use `.appbar/.appbar__inner` + `.appnav/.appnav__inner` (or the `--pad` fallback). The **Novus master lockup is the same official asset in every app at `--logo-height` = 26px** — one step smaller than the app name, which is the primary identifier; colour→white swap via `.brandlogo--*`, never inline `display`, no per-app responsive shrink. The header lockup is always the official asset — a per-app uploaded/custom logo must never override it (nPLAN's logo-upload feature was removed for this reason).
9. **Traffic-light status.** Metric boxes carry status colour to convey health: **neutral** for descriptive / actual data (targets, booked actuals, raw counts); **green** (`--success`) for a positive / on-track trend or forecast; **amber** (`--warning`) for at-risk / watch; **red** (`--danger`) for alert / breach. Apply as a 4px left accent on metric cards and a top accent + low-alpha tinted header on grouped / quarter cards, always paired with a one-line legend. Never colour a pure-data box — colour signals a judgement (trend / forecast / risk), not a number. First applied in nPLAN's Leadership review (2026-06-27).
10. **Weighted categorical pickers.** When a dropdown / picker’s options carry an inherent weight, probability or score (sales stages, confidence tiers, etc.), order the options by that weight in progression order (low→high / funnel order) — never alphabetical or object-key order — and show the weight inline as a **%** next to each label (e.g. “Proposal (60%)”). Keep the `<option value>` as the bare key so saving and calculation are unaffected; the % is display guidance. Mirror the same order + % anywhere that category is shown (chips / badges). First applied to nPLAN sales stages (2026-06-27).
11. **CW labels.** A calendar-week label always shows the week-**start date** for orientation — format "CWnn (D Mon)", e.g. CW27 (29 Jun) — everywhere a CW is displayed (badges, tables, pickers, history). Derive the Monday of the ISO week.
12. **Risk / alert messages.** Any textual risk, alert or warning message is shown in **red** (`--danger`) — red text or a red-tinted / red-left-border box — so risks read instantly. Distinct from the traffic-light metric-health colouring (where amber can flag an at-risk metric); an explicit risk / alert *message* is always red.
13. **Self-describing chips & Intelligence Score.** Metric chips / badges prefix the field name so each reads standalone — e.g. “Stage · Lead · 30%”, “Intelligence Score · 15% · Upside”. For opportunity / pipeline apps the confidence metric is the transparent stage-based **Intelligence Score** (stage weight; −5%/week without an update; −10% if no action items; +5% per action closed; Won/Contracted = 100%), never a subjective probability.
14. **Token-driven styling.** Every design value — colour, spacing, radius, type, shadow — references a `tokens.css` variable or a component class; never ad-hoc literals. Apps inline the **full** token set (incl. `--radius-*`) so the same variables are available throughout, and every new element (e.g. the nav Back button → `.navback`) is built from tokens.
15. **Dashboard charts (anti-Excel).** Charts are styled, not stock. Set Chart.js global defaults once: token font, **rounded bars** (`borderRadius` on the top stack segment only), thin **soft dashed gridlines** (~13% alpha), **no axis border / tick marks**, dark rounded tooltips with point-style swatches, and constrained bar thickness (`maxBarThickness`, `categoryPercentage`≈0.62). Two reads must always be present on a primary time-series: **composition** (the stacked bars) **and trajectory** (a thin line across the period totals). **Charts must reflect real data, never a flat proxy** — bucket revenue by its actual billing/close month (`dealBM`/`leadQ`), never smear an annual figure evenly across periods. Surface anomalies with a **hollow-stick marker**: a dashed average reference line plus, on any period that deviates beyond a threshold (±18% of the mean), an outlined (hollow, white-filled) point + capped stick + outlined pill labelling the signed % vs average (▲ green for an up-spike, ▼ red for a drop); non-flagged periods show a quiet total label. First applied to nPLAN "Revenue by quarter" (2026-06-30).
16. **Insight / signal cards (verdict over chart).** For leadership / executive views, when the goal is a *judgement* ("are we too concentrated?", "is new business drying up?"), lead with plain-language **signal cards**, not a chart the reader must decode. Each card = an uppercase **eyebrow** (the signal type, e.g. "Market concentration"), a **headline finding** with the key number emphasised (e.g. "Sri Lanka = **52%** of pipeline"), a **sub-line** stating the risk / implication, a **traffic-light left accent** (rule 9: red/amber/green by severity), and an optional *small* support visual (mini bars, chips) — the visual supports, it is not the main event. Most-severe first, and open the panel with a **one-line verdict** summarising the red signals ("2 structural risks this cycle — …"). Reach for this instead of a chart whenever a chart would only be re-read into a sentence. First applied to nPLAN "Portfolio signals" (2026-06-30), replacing the mix-trend line + category×country matrix.
17. **Stat / KPI no-overlap (LOCKED).** Big numbers must never collide. Give the `.stat__value` `white-space:nowrap` (a figure like "120M+" must not wrap mid-token) and the `.stat` cell `min-width:0` (so it shrinks inside a flex/grid parent instead of spilling into its neighbour). Lay stats out with the canonical **`.statrow`** — an `auto-fit` grid whose min column width is ≥ the widest number — so they **reflow to fewer columns/rows rather than overlap**, with an explicit `column-gap`; use `.statrow--wide` for large proof figures and shrink the value font on compact cards (`.pcard .stat__value` = `--text-2xl`). Never a fixed multi-column row that forces figures to touch. Defined in `tokens.css` (`.stat` / `.stat__value` / `.statrow`). First applied to the product catalogue cards (2026-07-01).
18. **Responsive / multi-device (LOCKED — applies to EVERY app produced).** Every app, page and deliverable must be built mobile-first and remain fully usable on phones, tablets and desktop — no horizontal scroll, no clipped or overlapping content, tap targets ≥ 44px, and readable type at any width. Always ship `<meta name="viewport" content="width=device-width, initial-scale=1">`; use fluid grids (`auto-fit/auto-fill minmax()`), `clamp()` type/spacing, and breakpoints that **stack** multi-column layouts (collapse to 1 column on phones), wrap toolbars, and make dialogs near-full-width on small screens. Verify at ~390px (phone), ~768px (tablet) and desktop before shipping. This is a universal requirement, not a per-app option.
19. **Source-file integrity (LOCKED).** Any app that surfaces files stored under **Novus 2nd Brain** exposes them **read-only** — a document is *opened/viewed*, never edited in place — to protect the master copies. Always offer a separate **Download** action (`download` attribute) so the user works on a *copy*; never wire an app control that writes back to the original. State the policy in the UI ("Files open read-only … Download for an editable copy"). First applied in novaCATALOGUE (2026-07-01). On `file://`, open links same-tab (browsers block `target=_blank` to local files); use `_blank` only when served over http(s).
20. **Back navigation (LOCKED — all apps).** A single global ◀ Back must reliably return to the previous state from **any** screen and never dead-end. Don't rely on raw `history.back()` — it ignores modals and shuffles the page underneath them. Drive an explicit in-app **view stack**: a `VIEWSTACK` of `{page, …sub-state}` snapshots + a `CURVIEW`; every navigation flows through one `_go(view)` (push current snapshot, close any open modal, apply the new view, push a history buffer) and deep-links like `openProject`→`_go`; `goBack()` = **close an open modal first, else pop the stack** (fallback to home). Mirror browser/hardware back (`popstate`) into `goBack()` and re-push a buffer so it never exits the page. First applied in nPLAN (2026-07-02) after the deal-freshness modal couldn't be dismissed with Back.

## Presentation / slide type scale (LOCKED — Design System, added 2026-06-26)

Slides are read across a room, so they carry a **larger type scale than web/document materials** — this rule is **slides only**, never web pages or printed documents. It lives in `00_Design_System/tokens.css` **§9** as an *additive, scope-gated* block: it re-maps the semantic `--text-*` / `--lh-*` ramp larger and adds explicit `--slide-*` heading tokens, **only** under the scope selectors `.novus-slides, [data-surface="slide"]`. The base web/document ramp in §5 is unchanged, so the website and Word/printed materials render exactly as before.

- **To make a deck use it:** put `class="novus-slides"` (or `data-surface="slide"`) on the deck root (e.g. `<body>`). Token-driven components then scale automatically; bespoke slide elements point font-size/line-height at the slide tokens (title → `--slide-h1` ≈46px, hero/section → `--slide-hero` ≈72px, body/sub → `--slide-body` ≈24px, bullets → `--slide-bullet` ≈22px, KPI numbers → `--slide-kpi` ≈54px, eyebrow → `--slide-eyebrow` ≈17px). Sizes are in the 1280×720 design-canvas space.
- **Source of truth vs. self-contained output — two stages that coexist (LOCKED).** These are *not* contradictory; they apply at different times:
  1. **Design & build time:** `tokens.css` is the authority — every colour, type token, component and lockup rule in a deck is *derived from it* (leverage it while building).
  2. **Shipped file:** the output is a self-contained **snapshot** of it — read `tokens.css` at build time and **inline** it, embed Carlito (woff2) and all images as base64, and **never `<link>` an external stylesheet** at runtime. Pin the theme with `<html data-theme="light">`.

  Think of it as compiling source into a standalone binary: a *build-time dependency* that yields a *runtime-independent* artifact. **Rebuild to re-snapshot whenever `tokens.css` changes.** Runtime linking is forbidden because Safari blocks a `file://` page from loading a parent/sibling-directory (`../`) stylesheet — a linked deck opens as a **black screen** in Safari (Chrome is lenient); a self-contained file opens identically in every browser. Reference implementation: `02_Slide_Decks/Novus_Maldives_Resort_Loyalty_v1.html` (built by `outputs/build_maldives_deck.py`).
- **Because slide text is large, prefer fewer words per slide** — shorten sentences and split a dense slide into two rather than shrinking type below the scale.

## Slide-deck layout & footer safe-area (LOCKED — added 2026-06-29)

Rules for the HTML presentation system, codified in `tokens.css` **§10** (canonical safe-area classes `.nslide` / `.nslide__body` / `.nslide__foot` under `.novus-slides` — deliberately named so they never clobber a deck's own local `.slide` classes). Decks author on a fixed **1280×720** canvas.

- **Footer safe-area (stops text/box bleeding over the footer):** every content slide reserves a bottom **footer band** (the slide's `padding-bottom`). Nothing in the body may enter it. The slide **body is hard-clipped** (`overflow:hidden`) at the safe line, so an over-full slide clips cleanly *above* the footer instead of bleeding over it.
- **A page-count check does NOT catch footer overlap** — content fits inside the 720px slide without spilling a new page, so it can bleed over the footer undetected. **Every slide must be checked VISUALLY** (render to images and review; a second QC sub-agent is recommended — it caught overlaps the build's page-count check missed).
- **Page numbers are baked at build time**, never set by runtime JS — a static export / PDF (WeasyPrint) runs no scripts, so JS-set numbers vanish.
- **Authoring:** one idea per slide; with the large §9 type, **shorten or split** — never shrink type below the scale. Keep card/KPI captions and subtitles to **one line** on dense multi-card slides.
- **Print-engine quirks (WeasyPrint, used for the PDF export):** CSS grid/flex items **stretch** to the tallest sibling (inflating cards with whitespace; `align-items:start` is unreliable) and **nested flex can render blank**. For height-sensitive blocks use **block flow (margins) or the `.bullets` component, not grid/flex**, and always verify the exported PDF, not just the browser.

## Last-mile polish — author-time guardrails + QC rubric (LOCKED — added 2026-06-29)

Codified in `tokens.css` **§11**. Added because footer-bleed QC passed but trivial UX defects still shipped — punchlines wrapping to orphan a single word ("…flywheel."), number badges sitting on top of app UI, and a legend clipped by a **baked-in** PNG footer. They escaped *because* the QC rubric only checked bounds/footer (not typography or occlusion), composed PNGs bypass the CSS safe-area entirely, and review was done on full-page thumbnails too small to see the defects. **Principle: prevent at author time (make the bad state unrepresentable) beats detecting it later.**

- **Typography:** a closing / highlighted line must fit **one line** at the bold slide-body size — **hard cap ~58 chars**; if longer, cut it, never let it orphan 1–3 words on a 2nd line. Card titles plain block; numbers `white-space:nowrap`; abbreviate long KPIs (1M+, 120M+) so columns don't collide.
- **Annotation markers** (on any screenshot/mockup) are **subtle by default** — ~20px, translucent fill, coloured ring + numeral, placed in the **margin/whitespace** beside the feature, **never centred on text, a price, total or button**.
- **Composed images** (device showcase, charts) that bake their own footer/labels **must reuse the deck's footer safe-area + type scale** — don't invent separate geometry; check their internal content clears the footer band like any slide.
- **Verification — automated gate (`slide-template/build/qc_check.py`):** renders the slide HTML through WeasyPrint and inspects the real layout box tree; the build scripts call it and **fail loudly (non-zero exit)** on any defect, so a bad layout can't ship on a tired visual pass. Checks: **C1** `.lead-line` punchline is one line · **C2** nothing crosses into the footer band · **C3** pages == `.slide` sections · **C4** `.s-title` >2 lines (warn) · **C5** a KPI number wider than its cell/row · **C6** `.lead-line`/`.callout` orphan tail (<40% of widest). Runs on the composed-image *source* (app preview) too; `python3 qc_check.py --self-test` proves the checks still fire. **A check only guards the element classes you scope it to** — the novaai callout slipped C1 because it was `.lead`, not `.lead-line` (hence C6 covers `.callout`); any new statement element must carry a class the checker watches. Still **review at 2× / zoom** for what code can't see — badge occlusion over a baked screenshot, colour, meaning.

## Slide template — the single source for PPTX + HTML (LOCKED — added 2026-06-29)

> **⚠️ TEMPLATE IS HAND-MAINTAINED (LOCKED, 2026-06-30).** `00_Design_System/slide-template/pptx/Novus_Template.potx` is now edited directly by Rick in PowerPoint and is the **source of truth**. **Do NOT regenerate it** with `build_pptx_template.py` — that script is guarded (`REGEN_POTX=False`) and only kept as build history. To change the live template, edit the `.potx` (or ask Rick first). Note: the generator's `Novus_Template_base.pptx` (used by `build_agenda_deck.py`) and the HTML scaffold are NOT auto-synced to the hand-edited `.potx`, so they may drift — reconcile deliberately if generated decks must match the latest hand edits.

**There is ONE Novus slide template, for BOTH PowerPoint and HTML, and it lives in `00_Design_System/slide-template/`:** `pptx/` (the `.potx`, base, starter deck, README), `html/` (the HTML slide scaffold + README), `build/` (the generators: `novus_pptx_theme.py`, `build_pptx_template.py`, `build_agenda_deck.py`, `gen_pictograms.py`, `qc_check.py`). `tokens.css` (§9–§12) is the design anchor both renderers derive from. **The earlier `00_Design_System/presentation/` template is DEPRECATED and quarantined in `00_Design_System/_archive/presentation_DEPRECATED_2026-06-29/` — do not use it.** Reference decks (e.g. the Maldives deck in `02_Slide_Decks/`, built by `outputs/build_*.py`) are produced FROM this system, not part of the template. Details below.

## PowerPoint theme & template (LOCKED — Design System, added 2026-06-29)

Codified in `tokens.css` **§12**. tokens.css is the design anchor; the Office theme is a **snapshot** of it (same build-time-vs-shipped model as §10). **`slide-template/build/novus_pptx_theme.py` PARSES `00_Design_System/tokens.css` LIVE** (reads the `--*-NNN` hexes — no hard-coded brand colours), so the PPTX is literally derived from the design system, not a different/copied tokens file. Reusable template: **`00_Design_System/slide-template/pptx/Novus_Template.potx`** — hand-authored OOXML (built by **`slide-template/build/build_pptx_template.py`**) with a slide master + **17 real PowerPoint LAYOUTS** (LOCKED order): **Title** (dark) → **Section Divider** (dark) → **Agenda** (light) → content types → **Closing** (dark) → **Blank** (light). The **Title** layout adopts the corp deck's title design — a full-bleed branded background (the **white** Novus logo, orbit/markets diagram and the 7-market flags; `logos/title_bg_white.png`, with the deck-specific headline removed and the logo recoloured white) under an **editable headline placeholder**. **The two brand palettes ship as real, COPYABLE SLIDES in the `.potx`** (not layouts) so employees copy logos straight off them in Normal view — **no Slide-Master view needed** (delete before sending): **Brand Lockups** (grid of the 8 product/platform lockups + master Novus logo) and **Brand Logos** (master lockup + sub-brand wordmark in all 6 treatments, white on dark tiles). They sit on the **Blank** layout; the generator base/probe stay slide-free so generated decks don't inherit them. The content types: **per section the user picks `Content · N` (LIST/bullets) or `Cards · N` (BOXES/highlights)** (both light that section's nav-bar segment), plus **Content — KPI / Stats** and **Content — Two Column**. Background, logo, footer, the **section-nav bar** and page-number field are baked as **static shapes** (not placeholders) so only content placeholders are editable. **Content style is a deliberate choice (LOCKED):** any idea can be a list or boxes/highlights — Cards reproduce the HTML deck's white rounded `.tile`; the KPI band is the stat callouts. Cards/lists are per-section (tracked); KPI + Two-Column are **section-aware too** (LOCKED 2026-07-07 — see the "one scheme" bullet below; previously "section-neutral"). **Verticals & sub-brands always branded (LOCKED build rule):** any mention of a product vertical (novapay/novabank/novastore/novatrust) or platform sub-brand (novahub/novaware/novaserve/novaai) MUST inherit its tokens.css lockup — lowercase, 'nova' = blue-400, suffix = that product's `--accent-text` — plus its pictograph wherever it stands alone (card title / logo slot); never plain typed text. The deck generator (`set_branded_text` in build_agenda_deck.py) auto-applies this to every placeholder; the HTML renderer uses `vlogo`/`wlogo`. Applies to every build — programmatic or hand-authored (in manual PowerPoint/Copilot, apply the lockup yourself; it won't auto-format). **Manual/Copilot aid:** `slide-template/pptx/Novus_Brand_Lockups.pptx` holds the 8 ready-made lockups (icon + two-tone wordmark) as a **visible, labelled grid** (helper slide — delete before sending) to copy onto any slide; the images live at `logos/lockups/*.png` (tokens `--logo-lockup-*`, built by `slide-template/build/gen_lockups.py`).

- **Section colour — one scheme (LOCKED, 2026-07-07):** every content-type slide (list, cards, **KPI, two-column**) is **section-aware** — the eyebrow, its dot and the lit footer nav segment all use the **same bright section accent** (e.g. Platform = Signal Green `#00A04A`), never the darker −700 step — so title and navigation match in **both** the PPTX and HTML renderers. Non-content slides (Title, Agenda, Divider, Closing) show no active segment. (KPI/Two-Column were previously "section-neutral"; changed so in-section slides never drop the tracker.)
- **Colour-coded section navigator — SECTION COLOUR SEQUENCE (LOCKED, updated 2026-07-09 — variable count):** a deck has as many sections as its story needs (**4 to 10 — ten is the ceiling as of 2026-08-18 (owner decision, supersedes the seven-section cap); more → restructure**). Colours are taken **contiguously** from the locked ordered sequence, never reordered or invented: **1 blue** `#0070C0` · **2 amber** `#E8A300` · **3 green** `#00A04A` · **4 indigo** `#534AB7` · **5 deep-blue** `#00457A` · **6 orange** `#E87830` (the logo-ink orange) · **7 slate** `#51606F` · **8 deep-green** `#0A6E38` · **9 bronze** `#8A5E00` · **10 light-blue** `#338ACE`. Positions 8–10 are further steps of the logo families already in the sequence (green, gold, blue), so no new colour enters the brand; **red is excluded at every position** — it is reserved for status/danger and must never read as a section. Faded (inactive) tints = 30% of the accent on white: `#B2D4EC` · `#F8E3B2` · `#B2E2C9` · `#CBC9E9` · `#B2C7D7` · `#F8D7C1` · `#CBCFD4` · `#B6D4C3` · `#DCCFB3` · `#C2DCF0`. **Dark-ground fade (LOCKED 2026-07-09):** those white-mix tints are for light grounds only — on dark/photo grounds (full-bleed scrims, any dark content ground) inactive segments are the same bright accent at ~32% alpha, and the bar stays clear of artwork baked into the background. **NAV BAR = CONTENT SLIDES ONLY (LOCKED 2026-07-09 — owner decision, supersedes the 2026-07-07 shaded-bar-on-non-content rule):** the tracker appears on in-section content slides only (full-bleeds included, on the scrim); **Title, Agenda, Section Dividers, Closing and appendices carry NO nav bar** — just the footer line. (The hand-maintained `.potx` and starter deck ship 5 content sections — never regenerate the `.potx`. For **6–10 sections the generator draws the footer and nav bar itself on a blank layout** from the locked sequence, so section count is data, not template geometry — that is the sanctioned route above five.) The **Agenda** sets the legend (colour-numbered rows); every **Content · N** layout repeats it as a **footer nav bar** of pill segments with its own segment lit full-colour and the rest tinted — a "you are here" tracker. Footer redesigned: **nav bar on top**, then colour logo + centred `CONFIDENTIAL · INSERT TOPIC` + auto page-number **beneath** it. Dark layouts ground on `#0E2336` (white logo, blue-300 eyebrow); light layouts white + colour logo; bullets `›`. Edit `SECTIONS` in build_pptx_template.py to change count/colours (Content layouts regenerate per section). Carlito + Novus theme embedded.
- **Agenda-driven generation + Copilot (`slide-template/build/build_agenda_deck.py`, `slide-template/pptx/README.md`):** edit the `DECK` agenda (up to 7 sections + slides, per the locked colour sequence) → it builds the whole deck on these layouts (Title → Agenda → per section a Divider + Content·N slides with the footer nav bar auto-set to that section's colour → Closing). The output is a standard `.pptx` that **Microsoft 365 Copilot / Copilot Cowork** can rewrite in place — Cowork preserves named layouts/theme/logo/geometry and only swaps text, so the colour tracker survives. Ship **`slide-template/pptx/Novus_Starter_Deck.pptx`** (empty, pre-laid-out) as the Copilot starting point; publish `Novus_Template.potx` to the SharePoint **org assets library** so Copilot offers it as the org template. Copilot building *from scratch* applies the theme but won't auto-assign the per-section tracker — use the starter deck or the generator for exact trackers. (Grounded in MS Learn: Copilot "create using your organization's templates", and Copilot Cowork brand-templates docs.) **`outputs/build_pptx.py`** = the layout library + the Maldives deck → `02_Slide_Decks/Novus_Maldives_Resort_Loyalty_v1.pptx`. Native **editable** python-pptx output; bespoke visuals (island map, ROI chart, 3-app showcase) drop in as the same PNGs as the HTML deck.

- **Colour scheme → Office 12 slots:** dk1=`#0E2336`, lt1=`#FFFFFF`, dk2=`#00457A`, lt2=`#F4F7FA`; accent1 Blue `#0070C0` (novapay) · accent2 Amber `#E8A300` (novastore) · accent3 Green `#00A04A` (novabank/success) · accent4 deep blue `#00457A` · accent5 Indigo `#534AB7` (novaai) · accent6 slate `#51606F`; hlink `#0070C0`, folHlink `#00457A`. Card border `#DCE3EB`, tint `#F4F7FA`, muted `#6B7886`.
- **Fonts:** major+minor = **Carlito** — Office users must install it (free, metric-compatible with Calibri) so PPTX matches web/PDF.
- **Canvas:** 16:9 **13.333in × 7.5in** (= 1280×720 at px/96); side margin 0.667in; footer hairline + baked "N / total" page numbers.
- **Layout library (reusable "layouts"):** cover (dark), content-cards (1/3/4/6-up), kpi/proof, flow (numbered steps + chevrons), quote, image+legend, full-bleed image, closing (dark). Cards = rounded rects, white fill, 0.75pt `#DCE3EB` border, **no shadow, no accent stripes**; **all card paragraphs LEFT-aligned** (PowerPoint autoshapes default to centre — must set left explicitly).
- **Product lockups (LOCKED):** pictograph + all-lowercase two-tone name — `nova` = blue-400 `#338ACE`, suffix **and** pictograph = the product's `--accent-text` (novapay `#00457A`, novastore amber-700 `#8A5E00`, novaai indigo-600 `#3C3489`), **not** the bright 400/500 accent. PowerPoint can't render the `currentColor` SVGs, so the lockups use **pre-tinted PNG pictographs** in `logos/icons/png/` — registered as `--logo-product-*-png` / `--logo-platform-*-png` tokens, generated by `slide-template/build/gen_pictograms.py` from the source SVGs. tokens.css now registers every asset: master + wordmark logos (6 colours each), product/platform SVG icons, the tinted PNG pictographs, and the `.potx` template.
- **Rebuild to re-snapshot** whenever tokens change: `python3 build_pptx.py`. The theme is injected by replacing `ppt/theme/theme1.xml`; the `.potx` flips the content-type to template.

## Poster set & framing (LOCKED — Design System, added 2026-07-14 · mirror of tokens.css §14)

A set of **nine A1 wall posters** — the **platform poster** + eight product posters — built from `tokens.css` as a source→generated kit in `00_Design_System/posters/`: `build_posters.py` → `out/` (`poster_<name>_A1` `.svg` + `_200dpi.png` + `.pdf`). Drop-in photography in `posters/photos/` (brief in `photos/README.md`); framing in `posters/FRAMING_GUIDELINES.md`. **Never hand-edit `out/` — rebuild from `build_posters.py`.**

- **4 verticals + 4 platform assets (never "seven"):** the four solution **verticals** (novabank · novapay · novastore · novatrust) sit **on top of** the four modular, reusable **platform assets** (novahub · novaware · novaserve · novaai), shown on the platform poster as a foundation panel ("Four verticals on a reusable platform."). Never say "seven building blocks"; **never use the word "core" in poster copy** (say "platform").
- **Format:** A1 portrait **594×841 mm, 200 dpi** (4677×6622 px). Ships **SVG** (Carlito **embedded**, self-contained), 200 dpi PNG and a true-A1 print **PDF**. All styling derives from `tokens.css`; the master lockup is the **placed** asset from `logos/`.
- **Left-centered layout:** master lockup top-left + hairline; left content column (margin **43 mm**) — sector eyebrow → **one-logo lockup** (icon-left, tight, two-tone: 'nova' blue-400 + suffix product accent) → punchy headline → one support line → "What &lt;product&gt; includes" capabilities → "Who it's for" market-segment chips → product brand line → essence footer. Brand slogan **"Scalable · Modular · Secure"** runs on the platform poster.
- **Photography:** right zone (~49% width) holds an image that **fades into the page** on top, left and bottom (eased — never a hard edge); bottom fades toward the blue bar. Images are **predominantly-Asian / mixed**, candid, natural-light, subject slightly right of centre; **no third-party or client branding**; watermarks / hallucinated text removed before use.
- **Blue baseline bar (LOCKED):** full-bleed `--blue-500`, **8.3 mm at A1**, hard against the bottom edge — part of the poster, **always fully visible**, never cropped/covered; never add a second rule below it.
- **Framing / negative space (LOCKED):** reveal the whole poster (blue bar included) inside a **uniform white mount border = ~8.5% of the print's short edge** (min 20 mm) so the frame rebate lands on the mount, not the artwork; scales uniform across sizes — **A1 → 50 mm · A2 → 36 mm · A3 → 25 mm** (frame opening ≥ art + 2×border). Or face-mount / snap-frame with a zero rebate.
- **Frame profile (LOCKED):** **slim / very narrow (≈8–15 mm face), silver / brushed-aluminium only** — never thick, ornate, wooden, black or coloured; the frame must recede. Portrait only; matte / anti-reflective glazing; 3 mm bleed; text ≥ 43 mm from edge.

## Design & Builds Audit — locked amendments from DEL-01, the BOB deck migration audit (LOCKED, 2026-07-09)

The Design & Builds Audit program (framework + running log in `00_Design_System/audit/`) audits every deliverable against the three canonical sources; canon defects it surfaces are amended in all three files together. The BOB HTML-deck audit (report: `audit/AUDIT_2026-07-09_BOB_Executive_Update_HTML.md`) produced these locked amendments, all codified in `tokens.css` §11.E–G / §D0 / template block:

- **Variable section count + locked colour sequence** — see the section-navigator bullet above (4–7 sections, contiguous colours, orange #E87830 is 6, slate #51606F is 7).
- **Scaffold lockstep:** `slide-template/html/novus-slide-template.html` is a **derived artifact of tokens.css §9–§D3** and must be resynced **in the same change** as any amendment to those sections — the same lockstep as brand.html. (Root cause of the BOB divergence: a stale scaffold taught −700 eyebrows, a retyped footer wordmark, no title background and no footers on non-content slides.)
- **HTML deck recipe + conformance gate:** HTML decks are built/migrated per `slide-template/How_to_build_a_Novus_HTML_deck.md`; before delivery run `qc_check.py --conformance` (new checks: Agenda present, nav bar on every slide, footer logo is a placed asset — never retyped text, eyebrow colours ∈ the locked bright set, §9 title size) **plus** the 2× visual pass. The plain layout gate had PASSED the non-conformant BOB deck — layout checks alone don't gate conformance.
- **Migrated / source-deck content (§11.E):** in a migration, diagrams/charts/tables are **always natively redrawn on-brand** (or explicitly approved as-is per element); never pasted as raster renders of the old design. Photographic imagery may ship as full-bleed figures.
- **Full-bleed footer legibility (§11.F):** on image-bleed slides the footer band sits on a bottom **scrim**; white logo on the scrim; never footer text/nav directly on a photo.
- **Client marks never recoloured (§11.G):** never recolour/invert/CSS-filter a client or partner mark; on dark grounds use original colours on a white holder tile or the client's official reverse asset.
- **No internal notes in deliverables** (reaffirmed): migration metadata like "hidden in source deck" must never appear in a client-facing file.
- **TITLE = THE WEBSITE HERO (LOCKED 2026-07-09 — owner decision, supersedes the corp-plate title bg):** the canonical presentation title design is the website hero — dark ground, white master lockup top-left, headline + kicker left, and the **hero-map globe** right (7 Novus markets, payment flows converging on Singapore·HQ). Source of truth: the `hero-map` SVG in `site/pages/home.html` + the `.hero-map` rules in `site/assets/site.css` — HTML decks **embed it live at build time** (animated flows/pulses, reduced-motion-safe; freezes static in PDF); PPTX uses a **static bake of the same hero**. `logos/title_bg_white.png` (the corp plate) is **superseded** as a title background; the PPTX title image is to be re-baked from the hero — **HOW (LOCKED 2026-08-18): crop the frozen frame out of page 1 of the WeasyPrint PDF at 3 px per css px, at the hero's own box (right:40px; top:96px; 520×520), and key the flat dark ground to transparency so it composites with no seam. Never redraw it, never substitute another plate.** Trap: poppler silently drops the globe's landmass fill above ~144 dpi — render the crop with PyMuPDF and eyeball the landmasses before shipping. No nav bar on the title.
- **RENDERING PARITY — THE HTML DECK IS THE SOURCE OF TRUTH (LOCKED 2026-08-18, owner decision; full text in `tokens.css` §D4):** a deck is ONE design in three renderings — **HTML (master)**, **PDF** (WeasyPrint print of that HTML) and **PPTX** (for people who must type into it). PDF and PPTX **mimic** the HTML — same plate, same geometry, same type scale, same chrome — and may only be **static where the HTML animates**. A PPTX showing a different title plate, hero, type scale or footer is **non-conformant**, however good it looks alone; where the `.potx` and the HTML disagree, **the HTML wins**. **Geometry mapping (the only sanctioned conversion):** the HTML slide box is 1280×720 css px on a 13.333×7.5in (960×540pt) page, so **1 css px = 1/96 in = 0.75 pt** — every PPTX coordinate and font size derives from the HTML's css value through that constant (46px title = 34.5pt, 24px body = 18pt, 22px bullet = 16.5pt, 17px eyebrow/caption = 12.75pt), with line-height set as **exact point leading** (css px × line-height × 0.75), never a multiple — PowerPoint and LibreOffice resolve multiples differently and the block drifts. **Chrome is generated, not inherited:** eyebrow + leading dot, title, footer rule, bottom-left logo, centred strap, `n / N` page number and the §D0 nav bar are drawn by the generator on a blank layout at the HTML's own geometry (nav bar 630–642, rule 652, strap 671 in css px) — which is what lets the section count be data (4–10) and why `Novus_Template.potx` is hand-maintained and **never regenerated**. **Density may adapt, the type scale may not:** a slide carrying more rows than the HTML frame holds may shrink row height and step copy down toward the §9 17px caption floor, but may never change colours, spacing rules or chrome, and never let content cross the footer rule. **Pre-delivery gate:** open PDF page 1 and PPTX slide 1 side by side (same plate, same hero, same wording), then spot-check one divider, one content slide, one chart slide and the densest table slide in both.
- **Nav bar = content slides only** — see the section-navigator bullet above (LOCKED 2026-07-09).

*Last updated: 2026-07-09*

---

## LOCKED amendment — Client wall = ALL 13 (2026-07-21)

The client / "Trusted by" / Proven wall features **ALL 13** canonical client logos in
`00_Design_System/logos/clients/` — on the website Proven wall **and** in every deck/
proposal going forward — until Rick explicitly asks to remove one. This supersedes the
earlier curated 8-logo subset.

The 13: rcbc, peoples-bank, hnb, bank-of-botswana, bca, pertamina, lanka-ioc, dfcc, sdb-bank, rdb, sarvodaya, ccu-bank, bp-akr.
(HNB added 2026-08-20; Seylan removed 2026-08-21 — no longer a customer, see §11.T23.)

Apply: uniform equal-size white tiles, full colour, `object-fit:contain`, wrap to rows as
needed; partners (NearPay, AFVG) stay OUT (they live in 01_Brand_Assets/Partners). Website
source = `site/build_site_v2.py` `CLIENT_STRIP` (rebuild dist-v2). Respect the fuel proof-
point framing (Lanka IOC / BP-AKR shown as clients, never singled out as deployments).

### §11.T — The PPTX twin (LOCKED 2026-08-21)

A Novus deck ships in HTML **and** PowerPoint. The .pptx is a **native rebuild** — real,
editable shapes and text — never an image export and never the starter's plain bullets.

- **One library.** Every PPTX builder imports `slide-template/build/novus_pptx.py` and
  carries no primitives, no chrome and no brand hexes of its own. Colours resolve from
  `tokens.css`; the nav-bar tints are parsed out of `deck.css` rather than recomputed.
- **One authoring space.** The PPTX is authored in the same 1280×720 px space as
  `deck.css`; `pt = px × 0.75` is the only conversion. There is no separate PPTX scale.
- **Line height is not the CSS number.** CSS `line-height:1.34` is 1.34 × font-size;
  PowerPoint's multiple is 1.34 × the font's *natural* line height (Carlito = 1.23 em).
  Passing the CSS value through renders every paragraph 23% too tall.
- **Measure, then place.** PowerPoint has no auto-layout. Text is measured with the real
  Carlito metrics; letter-spacing counts toward width, and measurement uses 97% of the
  box so a renderer disagreement can never add an unbudgeted line.
- **§11.O2/O3 come from the measurement, not the author's flag.** A body that does not
  fill the band is centred; if a large band remains the grid is grown to the roomy scale.
  `fill=True` never by itself top-aligns a short body.
- **Content parity is gated.** `pptx_parity.py` fails on any phrase present in one format
  and missing from the other. This caught the first build shipping a hand-written
  "Opportunity" slide with all eight sourced figures missing.
- **An accent edge is a rounded shape, never a straight bar.** A CSS `border-left`/
  `border-top` follows the corner radius; a straight bar drawn over a rounded card
  overhangs the curve and visibly fails to merge. Draw the accent as a rounded rect of the
  same size and radius and inset the card over it. Applies to `.pstat`, `.tile--model`,
  `.vc`, `.cprod` and the product-sheet proof stats.
- **Novus cards are flat.** An empty `<a:effectLst/>` is not enough — python-pptx also
  writes `<a:effectRef idx="2"/>`, and *that* is what renders a shadow. Both are cleared
  in one sweep over every shape at write().
- **The title is the website hero in both formats.** The PPTX title carries the same
  money-flow globe, rasterised from the same SVG `novus_deck` extracts from the site —
  never a redrawn or screenshot stand-in.
- **Align to a lockup's ink, not its box.** Novus lockups are optically centred, so a
  `.pline` pill set beside one must be centred on the measured ink centre.
- **The divider scrim is a contrast instrument.** Dividers set `--blue-300` sub copy over
  a photograph; the ramp is set from MEASURED contrast (AA 4.5:1 at the *worst* point in
  the text column, not the average), now `.96 / .93 @52% / .58`. Never fix this with a text
  shadow — Novus type is flat; deepen the scrim.
- **If both formats agree, the fault is the design, not the port.** Measure the HTML before
  changing the PPTX. The faint divider sub measured 4.39:1 in PPTX and 4.33:1 in HTML — the
  port was faithful, the treatment was weak. Both were strengthened together.
- **If it must look a certain way, bake it into pixels.** A vector effect is only as
  reliable as the renderer. The divider scrim was a real DrawingML gradient: LibreOffice
  drew it, **PowerPoint dropped it entirely**, and the deck opened at full photographic
  brightness. Scrim and duotone are now composited into the image before placement.
- **A proxy renderer is not verification.** LibreOffice is lenient and accepts XML that
  PowerPoint ignores. Verify load-bearing appearance by unzipping the .pptx and measuring
  the embedded pixels — no renderer gets a vote on that.
- **Shared slides are held as data.** Blocks appearing in both formats live as data in
  `novus_deck` and each format renders them. Markup is not a source.

**Shipped:** `Slide_Decks_Migrated_V3_Imagery/PPTX/Novus_Overview_and_Talent_Managed_Services_2026-08-20.pptx`
(34 slides) — the pilot for migrating the remaining decks.

**Open finding:** the HTML deck emits `lwall--xs` twice (slide 25) and **no stylesheet
defines it**, so those walls silently fall back to the base `.ltile`, which is *larger*
than the `--sm` scheme tiles elsewhere — the opposite of the intent. Flagged, not changed:
the affected deck is already approved as rendered.

**Deck structure change (2026-08-21).** Leadership moved OUT of the case-study section and
into Proof & Trust, where it belongs as evidence. Section 4 is now **Proof, Trust &
Leadership**; section 5 is **Case Studies**. Applied to the HTML and PPTX together, with the
agenda, dividers, eyebrows and nav bar all updated.

**Divider imagery — ACCEPTED AS IS (owner, 2026-08-21).** The Part 01 divider
(`outputs/v3_assets/ops-floor.jpg`) is a five-panel composite spelling N·O·V·U·S whose N and
S are cut off in the source file. The owner has accepted the truncation; the deck ships with
it. The brief at `outputs/v3_assets/DIVIDER_SOURCE_BRIEF.md` is retained should the asset
ever be regenerated.

### §11.T16/T17 — divider legibility and the data flywheel (LOCKED 2026-08-21)

**Dark dividers.** The TYPE is the lever, not the scrim. Measured on all six full-bleed
images: `--blue-500` caps at **3.11:1** on pure navy (never passes AA), `--blue-300` at
6.58:1, `--blue-100` at 12.39:1. Holding blue-300 readable forced a scrim hiding **85%** of
the photograph. Sub is now `--blue-100`, each dark kicker is the lightest-needed step of its
own section accent, and the scrim is `.75/.75@60%/.06` — hiding **61%**. Narrow exception to
§D0 ONE SCHEME, scoped to `.slide[data-theme="dark"] .kicker`, enforced by CF5.

**The data flywheel.** A flywheel is a loop; a column of cards cannot show one, and both
decks had drifted into doing exactly that — differently from each other. `flywheel.py` owns
the wheel (novaai at the hub as a placed lockup, four verticals on the rim with what each
feeds and gets, and INGEST → MODEL → SCORE → LEARN on the ring, LEARN feeding INGEST);
`novus_deck` owns the copy and the hand-off band naming the three plays. Wired into the
Talent deck (slide 16), the Overview deck (slide 19) and the PPTX from one source.

### §11.T18 — the Overview is the BASE deck (LOCKED 2026-08-21)

A slide-by-slide comparison of the two V3 decks found that **every slide already promoted to
a single source was byte-identical, and every slide still authored twice had drifted** — six
clauses (including three closing punchlines) present in one deck and missing from the other,
plus fifteen capability bullets.

So every recurring slide now lives in `novus_deck` as **data + renderer**, with a matching
`novus_pptx` Deck method: vision/mission, Service as Software, the three plays, Why Novus,
leadership, the scheme accelerator and the three case studies. A builder calls them; it does
not author them. **15 of 15 shared slides are now byte-identical across both decks.**

**The model:** Overview = base (29 slides). A variant is the base **plus a section**.
- Talent & Managed Services deck = base + the Talent section (34 slides).
- Anything market-specific is a variant payload — the Malaysia slide is the reference example
  of what does **not** belong in the base.

**Case studies are capability, not delivery.** Two of the three are live opportunities and
carry an explicit status line; those lines are part of the slide and must survive future edits.

### §11.T19–T21 — three formats, one design (LOCKED 2026-08-21)

Both decks now ship as **HTML + PDF + PPTX**, and PPTX-vs-HTML likeness is **measured**, not
argued: `visual_parity.py` renders both at the same size and scores each slide. Current state:
**Overview 0.876 mean, Talent 0.882**, with only the title slide below 0.80 (a vector globe vs
its raster — the metric penalises that by construction; the layout is right).

Three root causes were found and fixed:
- **T19 — declare the width of every flex child.** WeasyPrint shrink-wraps them, so the sub
  came out 655px wide in the PDF, one line in a browser, and pushed the header ~100px down.
  `min-width:100%` (plain `width:100%` was not enough on a `<p>`).
- **T20 — the HTML is the design of record.** The PPTX must not improve on it: §11.O3
  auto-grow OFF, `fill` honoured literally, and all chrome geometry MEASURED from the rendered
  HTML. Where the box tree and the render disagree, trust the render.
- **T22 — a rounded picture is CUT, not framed.** PowerPoint has no border-radius for a
  placed picture, so a rounded outline over a square photo looks right on the edges and spills
  at all four corners. The corners are cut into the image with an alpha mask at the placed
  size; the hairline goes on top.
- **T21 — smooth the profiles before correlating.** Raw row profiles are combs of text
  baselines; the unsmoothed first version of the tool failed every slide, which was a report
  about the tool, not the deck.

### §11.T23 — retired clients (LOCKED 2026-08-21)

**Seylan Bank is no longer a customer.** Its mark and name are removed from everything
outward-facing — decks (HTML/PDF/PPTX), the V1 and V2 websites, brand assets, logo indexes
and the proposal fact sheet. The client wall is now **13**.

Enforced, not just written down:
- `novus_deck.RETIRED_CLIENTS` + `_assert_no_retired()` raise at build time if a retired mark
  is put back into a client wall.
- `slide-template/build/check_retired_clients.py` sweeps every outward-facing artefact
  (HTML, PDF, and the XML inside PPTX) and exits non-zero on a hit.
- The mark moved to `logos/_retired_clients/` — **not deleted**, because a relationship can
  resume and the official asset is hard to re-source.
