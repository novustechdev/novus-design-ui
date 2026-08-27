# Quickstart: validating the Novus Admin Kit

## Tailwind flavor

```bash
cd admin-kits/tailwind
npm install            # pulls novus-design-kit from public npm, tokenless
npm run dev            # or: npm run build && npm run preview
```

Expected: four pages at /, /transactions.html, /terminals.html, /settings.html;
kit identity everywhere; JS-off navigation works; filter + dialog work with JS on.

## Blazor flavor

```bash
cd admin-kits/blazor
npm install            # kit into node_modules (copied to wwwroot/lib on build)
dotnet run
```

Expected: same four screens server-rendered; transactions filter and theme toggle
interactive; kit served from wwwroot/lib/novus-design-kit.

## Parity + gates

```bash
node admin-kits/data/generate.mjs && git diff --exit-code admin-kits   # parity
scripts/gates.sh                                                       # incl. admin-kit sources
```

## Verification evidence (constitution VII)

Build + run each flavor, capture: dashboard light + dark, transactions light,
dashboard at 375px. Record stack versions + date + result in
`checklists/verification.md`; screenshots go to `site/src/assets/admin-kit/` and the
docs page embeds them.
