import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // `server-only` throws when imported outside a React Server Components
      // build. Unit tests exercise the pure logic, so the guard is stubbed.
      "server-only": path.resolve(rootDir, "tests/unit/mocks/server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/unit/setup.ts"],
    css: false,
    clearMocks: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/data/**", "src/config/**", "src/components/**"],
    },
  },
});
