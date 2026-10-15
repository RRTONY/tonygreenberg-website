import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient } from "next-sanity";

vi.unmock("@/lib/sanity/write-client");
vi.mock("next-sanity", () => ({ createClient: vi.fn((config: object) => ({ config })) }));

async function load() {
  vi.resetModules();
  return import("@/lib/sanity/write-client");
}

describe("writeClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is a non-CDN, raw-perspective client carrying the API token", async () => {
    vi.stubEnv("SANITY_API_TOKEN", "secret-token");
    const { writeClient } = await load();
    expect(writeClient).toEqual({
      config: expect.objectContaining({
        projectId: "test-project",
        dataset: "test",
        token: "secret-token",
        useCdn: false,
        perspective: "raw",
        apiVersion: "2024-01-01",
      }),
    });
    expect(createClient).toHaveBeenCalled();
  });

  it("assertWriteClientConfigured throws when the token is missing", async () => {
    vi.stubEnv("SANITY_API_TOKEN", "");
    const { assertWriteClientConfigured } = await load();
    expect(() => assertWriteClientConfigured()).toThrow(/SANITY_API_TOKEN is not set/);
  });

  it("assertWriteClientConfigured passes when the token is set", async () => {
    vi.stubEnv("SANITY_API_TOKEN", "secret-token");
    const { assertWriteClientConfigured } = await load();
    expect(() => assertWriteClientConfigured()).not.toThrow();
  });
});
