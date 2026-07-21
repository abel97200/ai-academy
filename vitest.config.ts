// Configuration minimale de Vitest : on lui apprend juste à comprendre
// l'alias "@/..." utilisé partout dans le projet (le même que dans
// tsconfig.json), pour que les tests puissent importer le code exactement
// comme le fait l'application.

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
  },
});
