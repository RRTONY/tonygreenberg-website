import path from "node:path";
import { defineConfig } from "vitest/config";

// Unit and component tests. Tests live in __tests__/, mirroring src/
// (src/lib/utils.ts → __tests__/lib/utils.test.ts). Shared fakes for Next.js,
// Sanity, Supabase and email are in __tests__/setup.ts, so no test ever reads
// real data, sends an email or touches the network.
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: {
      "@/": `${path.resolve(import.meta.dirname, "src")}/`,
      "@tests/": `${path.resolve(import.meta.dirname, "__tests__")}/`,
      // `import "server-only"` throws outside Next's bundler.
      "server-only": path.resolve(import.meta.dirname, "__tests__/helpers/empty-module.ts"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["__tests__/**/*.test.{ts,tsx}"],
    setupFiles: ["__tests__/setup.ts"],
    css: false,
    // Before each test every vi.fn() goes back to the behaviour it was created
    // with (and spies are undone), so set per-test behaviour in beforeEach.
    mockReset: true,
    restoreMocks: true,
    // Form tests type key by key; under load (a full run) they need headroom.
    testTimeout: 60000,
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "test-project",
      NEXT_PUBLIC_SANITY_DATASET: "test",
      NEXT_PUBLIC_SUPABASE_URL: "https://supabase.test",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
      NEXT_PUBLIC_SITE_URL: "https://tonygreenberg.com",
    },
  },
});
