import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { resetFakeSupabase } from "./helpers/supabase";
import { navigation, resetNavigation } from "./helpers/next";

// findBy*/waitFor wait up to 5s (default 1s): lazy panels load slowly when a
// full run shares the machine.
configure({ asyncUtilTimeout: 5000 });

// Shared fakes for every test. A test file can replace any of these with its
// own vi.mock(...) of the same module.

// ---- Next.js ---------------------------------------------------------------

vi.mock("next/navigation", async () => (await import("./helpers/next")).navigationModule);
vi.mock("next/headers", async () => (await import("./helpers/next")).headersModule);
vi.mock("next/cache", async () => (await import("./helpers/next")).cacheModule);
vi.mock("next/image", async () => (await import("./helpers/next")).imageModule);
vi.mock("next/link", async () => (await import("./helpers/next")).linkModule);
vi.mock("next/script", async () => (await import("./helpers/next")).scriptModule);
vi.mock("next/dynamic", async () => (await import("./helpers/next")).dynamicModule);
vi.mock("next/font/google", async () => (await import("./helpers/next")).fontModule);
vi.mock("next/font/local", async () => (await import("./helpers/next")).localFontModule);
vi.mock("next-themes", async () => (await import("./helpers/next")).themesModule);

// ---- Data and outside services: never the real thing ----------------------

vi.mock("@/lib/sanity/client", () => ({
  client: { fetch: vi.fn(async () => []) },
  sanityFetch: vi.fn(async () => []),
}));
vi.mock("@/lib/sanity/write-client", () => ({
  writeClient: {
    fetch: vi.fn(async () => []),
    create: vi.fn(async (doc: unknown) => doc),
    createOrReplace: vi.fn(async (doc: unknown) => doc),
    patch: vi.fn(() => ({ set: vi.fn().mockReturnThis(), unset: vi.fn().mockReturnThis(), commit: vi.fn(async () => ({})) })),
    delete: vi.fn(async () => ({})),
    assets: { upload: vi.fn(async () => ({ _id: "image-test" })) },
  },
  assertWriteClientConfigured: vi.fn(),
}));
vi.mock("@/lib/supabase/server", async () => {
  const { getFakeSupabase } = await import("./helpers/supabase");
  return { createClient: vi.fn(async () => getFakeSupabase()) };
});
vi.mock("@/lib/supabase/client", async () => {
  const { getFakeSupabase } = await import("./helpers/supabase");
  return { createClient: vi.fn(() => getFakeSupabase()) };
});
vi.mock("@/lib/supabase/service-role", async () => {
  const { getFakeSupabase } = await import("./helpers/supabase");
  return {
    isServiceRoleConfigured: vi.fn(() => true),
    createServiceRoleClient: vi.fn(() => getFakeSupabase()),
  };
});
vi.mock("@/lib/email", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/email")>();
  return { ...real, sendEmail: vi.fn(async () => true) };
});

// ---- Browser bits jsdom doesn't have --------------------------------------

class MemoryObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
Object.assign(globalThis, {
  IntersectionObserver: MemoryObserver,
  ResizeObserver: MemoryObserver,
  MutationObserver: globalThis.MutationObserver ?? MemoryObserver,
});
if (typeof window !== "undefined") {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.hasPointerCapture ??= vi.fn(() => false);
  Element.prototype.releasePointerCapture ??= vi.fn();
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

// ---- No real network ------------------------------------------------------
// Any fetch a test didn't stub fails loudly instead of reaching the internet.
const blockedFetch = vi.fn(async (input: unknown) => {
  throw new Error(`Unstubbed fetch in a test: ${String(input instanceof Request ? input.url : input)}`);
});

beforeEach(() => {
  resetFakeSupabase();
  resetNavigation();
  vi.stubGlobal("fetch", blockedFetch);
  void navigation;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = `${c.split("=")[0].trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  } catch {
    // not in a browser environment
  }
});
