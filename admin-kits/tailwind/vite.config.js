import { defineConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        transactions: resolve(import.meta.dirname, "transactions.html"),
        terminals: resolve(import.meta.dirname, "terminals.html"),
        settings: resolve(import.meta.dirname, "settings.html"),
        analytics: resolve(import.meta.dirname, "analytics.html"),
        datagrid: resolve(import.meta.dirname, "datagrid.html"),
      },
    },
  },
});
