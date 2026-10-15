import { afterEach, describe, expect, it, vi } from "vitest";

vi.unmock("@/lib/sanity/client");
const fetchMock = vi.fn();
vi.mock("next-sanity", () => ({
  createClient: vi.fn((config: object) => ({ config, fetch: (...a: unknown[]) => fetchMock(...a) })),
}));

async function load() {
  vi.resetModules();
  return import("@/lib/sanity/client");
}

describe("sanity read client", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the CDN, no token and no stega", async () => {
    const { client } = await load();
    const config = (client as unknown as { config: Record<string, unknown> }).config;
    expect(config).toMatchObject({ projectId: "test-project", dataset: "test", useCdn: true, stega: false });
    expect(config).not.toHaveProperty("token");
  });

  it("refuses to load without a project id", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    await expect(load()).rejects.toThrow("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
  });

  it("sanityFetch always tags with 'sanity' plus the caller's tags", async () => {
    fetchMock.mockResolvedValue([{ _id: "a" }]);
    const { sanityFetch } = await load();
    await expect(sanityFetch({ query: "*[_type == $t]", params: { t: "post" }, tags: ["post"] })).resolves.toEqual([{ _id: "a" }]);
    expect(fetchMock).toHaveBeenCalledWith("*[_type == $t]", { t: "post" }, { next: { revalidate: 60, tags: ["sanity", "post"] } });
  });

  it("sanityFetch defaults params and passes a custom revalidate", async () => {
    fetchMock.mockResolvedValue(null);
    const { sanityFetch } = await load();
    await sanityFetch({ query: "q", revalidate: false });
    expect(fetchMock).toHaveBeenCalledWith("q", {}, { next: { revalidate: false, tags: ["sanity"] } });
  });
});
