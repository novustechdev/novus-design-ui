/* Loads one of the kit's plain browser scripts into a fresh context, the way a page would,
   and hands back the window it wrote to. No DOM is provided, so an element definition is
   skipped and only the script's pure rules are exercised. */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

export function load(...scripts) {
  const window = { atob, TextDecoder, AbortController };
  const context = vm.createContext({ window, URL, setTimeout, clearTimeout });
  for (const script of scripts) vm.runInContext(readFileSync(join(ROOT, script), "utf8"), context, { filename: script });
  return window;
}

/* A Storage stand-in: a Map, or one that throws on every call (a blocked or private window). */
export function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
  };
}
export const blockedStorage = {
  getItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
};

export function palette() {
  const css = readFileSync(join(ROOT, "tokens.css"), "utf8");
  return Object.fromEntries([...css.matchAll(/(--[a-z]+-\d+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2].toUpperCase()]));
}
