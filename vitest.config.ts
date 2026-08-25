// Configuration minimale de Vitest : on lui apprend juste à comprendre
// l'alias "@/..." utilisé partout dans le projet (le même que dans
// tsconfig.json), pour que les tests puissent importer le code exactement
// comme le fait l'application.

import { configDefaults, defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    // tests/e2e/*.spec.ts sont des specs Playwright (npm run test:e2e), pas
    // des tests Vitest : les exclure évite tout conflit entre les deux
    // frameworks (chacun définit son propre "test"/"expect").
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
