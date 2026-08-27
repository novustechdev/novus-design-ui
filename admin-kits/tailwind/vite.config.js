import { defineConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        transactions: resolve(import.meta.dirname, "transactions.html"),
        terminals: resolve(import.meta.dirname, "terminals.html"),
        settings: resolve(import.meta.dirname, "settings.html"),
      },
    },
  },
});
