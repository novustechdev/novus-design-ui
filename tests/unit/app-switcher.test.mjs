/* The app switcher's rules, without a browser: the host allow-list, reading the catalog and
   the static list, who sees what, the order tiles come in, recents, and the chain the switcher
   falls back through when the catalog fails. The element itself is exercised in a browser by
   scripts/app-switcher-audit.mjs. Run: npm test */
import { test } from "node:test";
import assert from "node:assert/strict";
import { load, memoryStorage, blockedStorage } from "./load.mjs";

const S = load("js/novus-app-switcher.js").NovusAppSwitcher;
/* Values made in the script's own context carry its prototypes; compare them as data. */
const plain = (value) => JSON.parse(JSON.stringify(value));
const b64 = (value) => Buffer.from(JSON.stringify(value), "utf8").toString("base64");

const CATALOG = {
  version: 1,
  categories: [{ id: "core", name: "Core banking" }, { id: "payments", name: "Payments" }, { id: "workplace", name: "Workplace" }],
  apps: [
    { id: "novaplan", name: "NovaPlan", description: "Revenue planning.", category: "workplace", url: "https://novaplan.novustech.dev", mark: { colour: "#B97F00", glyph: "novaplan" }, requiredRoles: ["member"] },
    { id: "novahub", name: "NovaHub", description: "Payment orchestration hub.", category: "payments", url: "https://novahub.novustech.dev", mark: { colour: "#0070C0", glyph: "novahub" }, requiredRoles: ["operations"] },
    { id: "novabank", name: "NovaBank", description: "Core-banking console.", category: "core", url: "https://novabank.novustech.dev", mark: { colour: "#00A04A", glyph: "novabank" }, requiredRoles: ["operator", "checker"] },
    { id: "novasearch", name: "NovaSearch", description: "Search across the apps.", category: "workplace", url: "https://novasearch.novustech.id", mark: { colour: "#8E84E0", glyph: "novasearch" }, requiredRoles: ["member"] },
  ],
};
const ids = (apps) => Array.from(apps, (app) => app.id);

test("allowedUrl links only https addresses on an allowed host suffix", () => {
  const allowed = S.suffixes("");
  assert.deepEqual(plain(allowed), [".novustech.dev", ".novustech.id"]);
  assert.equal(S.allowedUrl("https://novabank.novustech.dev", allowed), "https://novabank.novustech.dev/");
  assert.equal(S.allowedUrl("https://novatrace.novustech.dev/?from=workspace", allowed), "https://novatrace.novustech.dev/?from=workspace");
  assert.equal(S.allowedUrl("https://workspace.novustech.id", allowed), "https://workspace.novustech.id/");
  for (const bad of [
    "http://novabank.novustech.dev",
    "https://novabank.novustech.dev.evil.example",
    "https://evilnovustech.dev",
    "https://novustech.dev",
    "https://user:pass@novabank.novustech.dev",
    "javascript:alert(1)",
    "//novabank.novustech.dev",
    "not a url",
    "",
    42,
    null,
  ]) assert.equal(S.allowedUrl(bad, allowed), null, String(bad));
});

test("a deployment names its own suffixes; one without a leading dot admits the host and its subdomains", () => {
  const allowed = S.suffixes("bank.example, .staff.bank.example");
  assert.equal(S.allowedUrl("https://bank.example", allowed), "https://bank.example/");
  assert.equal(S.allowedUrl("https://ops.bank.example", allowed), "https://ops.bank.example/");
  assert.equal(S.allowedUrl("https://ledger.staff.bank.example", allowed), "https://ledger.staff.bank.example/");
  assert.equal(S.allowedUrl("https://novabank.novustech.dev", allowed), null);
  assert.equal(S.allowedUrl("https://notbank.example", allowed), null);
});

test("parseCatalog reads the contract, and refuses a catalog unreadable as a whole", () => {
  for (const garbage of [null, "text", 42, [], {}, { apps: "x" }, { apps: null }]) assert.equal(S.parseCatalog(garbage), null);
  const parsed = S.parseCatalog(CATALOG);
  assert.deepEqual(ids(parsed.apps), ["novaplan", "novahub", "novabank", "novasearch"]);
  const bank = parsed.apps.find((app) => app.id === "novabank");
  assert.deepEqual(plain(bank), {
    id: "novabank", name: "NovaBank", description: "Core-banking console.", category: "core", categoryName: "Core banking",
    url: "https://novabank.novustech.dev/", colour: "#00A04A", glyph: "novabank", roles: ["operator", "checker"],
  });
});

test("parseCatalog drops an entry on an unsafe address, a bad id or a repeated id", () => {
  const parsed = S.parseCatalog({
    apps: [
      { ...CATALOG.apps[2] },
      { ...CATALOG.apps[2], name: "Second NovaBank" },
      { ...CATALOG.apps[1], url: "https://novahub.novustech.dev.evil.example" },
      { ...CATALOG.apps[1], id: "novahub2", url: "http://novahub.novustech.dev" },
      { ...CATALOG.apps[0], id: "Bad Id" },
      { ...CATALOG.apps[0], id: "<img src=x>" },
    ],
  });
  assert.deepEqual(ids(parsed.apps), ["novabank"]);
  assert.equal(parsed.apps[0].name, "NovaBank");
});

test("a malformed entry is kept but shown to nobody, whatever the viewer holds", () => {
  const every = ["member", "operations", "operator", "checker", "x"];
  for (const requiredRoles of [undefined, null, [], "member", { 0: "member" }, [""], [42]]) {
    const parsed = S.parseCatalog({ apps: [{ ...CATALOG.apps[0], requiredRoles }] });
    assert.equal(parsed.apps.length, 1);
    assert.equal(S.isVisible(parsed.apps[0], every), false, JSON.stringify(requiredRoles));
  }
  const nameless = S.parseCatalog({ apps: [{ ...CATALOG.apps[0], name: "  " }] });
  assert.equal(S.isVisible(nameless.apps[0], every), false);
  const badColour = S.parseCatalog({ apps: [{ ...CATALOG.apps[0], mark: { colour: "red;background:url(x)", glyph: "novaplan" } }] });
  assert.equal(badColour.apps[0].colour, "");
});

test("an app shows when one of its roles is among the claims, and a viewer with no claims sees nothing", () => {
  const apps = S.parseCatalog(CATALOG).apps;
  const seen = (claims) => ids(apps.filter((app) => S.isVisible(app, claims)));
  assert.deepEqual(seen(["checker"]), ["novabank"]);
  assert.deepEqual(seen(["operations", "member"]), ["novaplan", "novahub", "novasearch"]);
  assert.deepEqual(seen([]), []);
  assert.deepEqual(seen(undefined), []);
  assert.deepEqual(seen(["Operator"]), []);
});

test("tiles come recent first, then by the catalog's category order, then in catalog order", () => {
  const parsed = S.parseCatalog(CATALOG);
  assert.deepEqual(ids(S.ordered(parsed.apps, parsed.categories, [])), ["novabank", "novahub", "novaplan", "novasearch"]);
  assert.deepEqual(ids(S.ordered(parsed.apps, parsed.categories, ["novasearch", "novahub"])), ["novasearch", "novahub", "novabank", "novaplan"]);
  /* A recent app the viewer may no longer open holds no place. */
  const visible = parsed.apps.filter((app) => app.id !== "novahub");
  assert.deepEqual(ids(S.ordered(visible, parsed.categories, ["novahub", "novaplan"])), ["novaplan", "novabank", "novasearch"]);
  /* An app in a category the catalog does not list comes after every listed one. */
  const stray = S.parseCatalog({ ...CATALOG, apps: [{ ...CATALOG.apps[0], id: "stray", category: "unknown" }, ...CATALOG.apps] });
  assert.deepEqual(ids(S.ordered(stray.apps, stray.categories, [])), ["novabank", "novahub", "novaplan", "novasearch", "stray"]);
});

test("search matches name, description and category, ignoring case", () => {
  const apps = S.parseCatalog(CATALOG).apps;
  const found = (q) => ids(apps.filter((app) => S.matches(app, q)));
  assert.deepEqual(found("hub"), ["novahub"]);
  assert.deepEqual(found("REVENUE"), ["novaplan"]);
  assert.deepEqual(found("workplace"), ["novaplan", "novasearch"]);
  assert.deepEqual(found("  "), ["novaplan", "novahub", "novabank", "novasearch"]);
  assert.deepEqual(found("zzz"), []);
});

test("the static list is read as the consoles publish it today, and shown to every viewer", () => {
  const list = [
    { key: "novabank", name: "NovaBank", url: "https://novabank.novustech.dev" },
    { key: "novahub", name: "NovaHub", url: "https://novahub.novustech.dev/" },
    { key: "ledger", name: "Ledger ünïcode", url: "https://ledger.novustech.dev" },
    { key: "novabank", name: "Repeat", url: "https://other.novustech.dev" },
    { key: "evil", name: "Evil", url: "https://evil.example" },
    { key: "plain", name: "Plain", url: "http://plain.novustech.dev" },
    { key: "BAD KEY", name: "Bad", url: "https://bad.novustech.dev" },
    { key: "noname", name: "", url: "https://noname.novustech.dev" },
  ];
  const apps = S.parseStatic(b64(list), S.suffixes(""));
  assert.deepEqual(ids(apps), ["novabank", "novahub", "ledger"]);
  assert.equal(apps[2].name, "Ledger ünïcode");
  assert.ok(apps.every((app) => S.isVisible(app, [])));
  for (const garbage of ["", "%%%", b64({ not: "a list" }), Buffer.from("not json").toString("base64"), undefined]) {
    assert.deepEqual(plain(S.parseStatic(garbage, S.suffixes(""))), []);
  }
});

test("recents keep the last four apps opened, most recent first, without repeats", () => {
  const storage = memoryStorage();
  for (const id of ["a", "b", "c", "a", "d", "e"]) S.remember(storage, id);
  assert.deepEqual(plain(S.readRecents(storage)), ["e", "d", "a", "c"]);
  assert.equal(S.recentMax, 4);
  assert.deepEqual(plain(S.readRecents(memoryStorage({ "novus-apps.recent": "{not json" }))), []);
  assert.deepEqual(plain(S.readRecents(memoryStorage({ "novus-apps.recent": '["ok", 7, "", "ok", "Bad Id"]' }))), ["ok"]);
});

test("recents survive a browser that refuses storage", () => {
  assert.deepEqual(plain(S.readRecents(blockedStorage)), []);
  assert.deepEqual(plain(S.remember(blockedStorage, "novabank")), ["novabank"]);
});

/* ---- the fallback chain ---- */

const URL_ = "https://workspace.novustech.dev/api/catalog";
const ok = (body) => async () => ({ ok: true, status: 200, json: async () => body });
const fails = async () => { throw new TypeError("network down"); };
const status = (code) => async () => ({ ok: false, status: code, json: async () => ({}) });
const never = (calls) => (url, init) => { calls.push(init); return new Promise(() => {}); };
const STATIC = b64([{ key: "novabank", name: "NovaBank", url: "https://novabank.novustech.dev" }]);

test("a catalog that answers is used and kept as this browser's last good copy", async () => {
  const storage = memoryStorage();
  const calls = [];
  const result = await S.resolve({ url: URL_, fetch: async (url, init) => { calls.push({ url, init }); return ok(CATALOG)(); }, storage, fallback: STATIC });
  assert.equal(result.source, "catalog");
  assert.deepEqual(ids(result.apps), ids(CATALOG.apps));
  assert.equal(calls[0].url, URL_);
  assert.equal(calls[0].init.credentials, "omit");
  assert.equal(JSON.parse(storage.getItem("novus-apps.catalog")).url, URL_);
});

test("a catalog that fails, answers an error, or answers garbage falls back to the last good copy", async () => {
  for (const fetch of [fails, status(500), status(404), ok({ nonsense: true }), ok([1, 2, 3])]) {
    const storage = memoryStorage({ "novus-apps.catalog": JSON.stringify({ url: URL_, catalog: CATALOG }) });
    const result = await S.resolve({ url: URL_, fetch, storage, fallback: STATIC });
    assert.equal(result.source, "cache");
    assert.deepEqual(ids(result.apps), ids(CATALOG.apps));
  }
});

test("a catalog that does not answer in time is abandoned for the last good copy", async () => {
  const storage = memoryStorage({ "novus-apps.catalog": JSON.stringify({ url: URL_, catalog: CATALOG }) });
  const calls = [];
  const started = Date.now();
  const result = await S.resolve({ url: URL_, fetch: never(calls), storage, fallback: STATIC, timeoutMs: 60 });
  assert.equal(result.source, "cache");
  assert.ok(Date.now() - started < 1000);
  assert.equal(calls[0].signal.aborted, true);
  assert.equal(S.timeoutMs, 3000);
});

test("with no good copy kept, the deployment's static list is used; with neither, nothing but All apps", async () => {
  const otherSite = memoryStorage({ "novus-apps.catalog": JSON.stringify({ url: "https://elsewhere.novustech.dev/api/catalog", catalog: CATALOG }) });
  const fromStatic = await S.resolve({ url: URL_, fetch: fails, storage: otherSite, fallback: STATIC });
  assert.equal(fromStatic.source, "static");
  assert.deepEqual(ids(fromStatic.apps), ["novabank"]);
  const corrupt = memoryStorage({ "novus-apps.catalog": "{not json" });
  assert.equal((await S.resolve({ url: URL_, fetch: fails, storage: corrupt, fallback: STATIC })).source, "static");
  const none = await S.resolve({ url: URL_, fetch: fails, storage: memoryStorage(), fallback: "" });
  assert.equal(none.source, "none");
  assert.deepEqual(plain(none.apps), []);
  const blocked = await S.resolve({ url: URL_, fetch: fails, storage: blockedStorage, fallback: STATIC });
  assert.equal(blocked.source, "static");
});

test("a deployment without a launcher never fetches, and shows its static list", async () => {
  let fetched = false;
  const result = await S.resolve({ url: "", fetch: async () => { fetched = true; return ok(CATALOG)(); }, storage: memoryStorage(), fallback: STATIC });
  assert.equal(fetched, false);
  assert.equal(result.source, "static");
});
