import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        transactions: resolve(import.meta.dirname, "transactions.html"),
        terminals: resolve(import.meta.dirname, "terminals.html"),
        settings: resolve(import.meta.dirname, "settings.html"),
        analytics: resolve(import.meta.dirname, "analytics.html"),
        datagrid: resolve(import.meta.dirname, "datagrid.html"),
        login: resolve(import.meta.dirname, "login.html"),
      },
    },
  },
});
