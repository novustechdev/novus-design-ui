# Data Model: Novus Admin Kit

Single source: `admin-kits/data/dataset.json`, committed; `generate.mjs` emits the
per-flavor modules (also committed). Regenerate + diff = the parity check.

## dataset.json

```json
{
  "kpis": { "transactionsToday": "4.2M", "uptime": "99.8%", "activeTerminals": 312, "settlementValue": "USD 18.4M" },
  "signals": [
    { "tone": "danger",  "eyebrow": "Settlement risk", "headline": "...", "detail": "..." },
    { "tone": "warning", "eyebrow": "Certificate",     "headline": "...", "detail": "..." }
  ],
  "transactions": [
    { "id": "TXN-240817", "ts": "2026-08-27T09:14:00+08:00", "terminal": "TRM-0112",
      "product": "novapay", "amount": 148.5, "currency": "USD", "status": "settled" }
  ],
  "terminals": [
    { "id": "TRM-0112", "location": "Makati flagship", "product": "novapay",
      "uptime": 99.9, "health": "healthy", "lastSeen": "2026-08-27T09:12:00+08:00" }
  ]
}
```

## Validation rules

| Field | Rule |
|---|---|
| `transactions[].status` | `settled` \| `pending` \| `failed`; chip tone: settled=success, pending=warning, failed=danger; chip text self-describing ("Status · Settled") |
| `transactions[].amount` | pure data: neutral presentation, right-aligned tabular numerals, never colour-coded |
| `terminals[].health` | `healthy` \| `degraded` \| `offline`; traffic-light judgement colour allowed |
| `signals[].tone` | `danger` renders red (risk rule); `warning` amber; never used for pure data |
| `product` | lowercase solid-set product names only |
| counts | 24 transactions, 12 terminals: enough for realistic tables, small enough to read in review |

## Generated outputs (committed)

- `admin-kits/blazor/Data/SeedData.cs`: records `Transaction`, `Terminal`, `Signal`,
  static lists.
- `admin-kits/tailwind/src/data.js`: ES module exporting the same objects.

Parity check: `node admin-kits/data/generate.mjs && git diff --exit-code admin-kits`.
