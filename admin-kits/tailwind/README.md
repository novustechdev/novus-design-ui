# Novus Admin Kit (Tailwind flavor)

A realistic novapay operations console built on `novus-design-kit` with Tailwind
utilities mapped to the Novus tokens. Four screens: Dashboard, Transactions,
Terminals, Settings. Multi-page, so navigation works with JavaScript disabled.

## Run

```bash
npm install
npm run dev        # or: npm run build && npm run preview
```

## Customize

- Screens are the four HTML pages; shared shell markup is repeated per page by
  design (copy, rename, add your page to each sidebar).
- Layout CSS lives in `src/admin.css` (tokens only). Tailwind utilities are for
  layout; identity always comes from the kit classes.
- Mock data comes from `../data/dataset.json`; run `node ../data/generate.mjs`
  after editing it (rows are injected between the DATA markers).
- Wire real services by replacing the injected rows and `src/data.js`.

Conventions demonstrated: traffic-light status only on judgement chips, risk
messages red, self-describing chips, one accent per view, dual-trigger dark
mode with the persisted toggle.
