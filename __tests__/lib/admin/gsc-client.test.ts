import { describe, expect, it, vi } from "vitest";
import { getGoogleAccessToken } from "@/lib/admin/google-auth";
import {
  getSearchPerformance,
  inspectUrls,
  listSitemaps,
  listSites,
  mergeComparison,
  performanceDateRange,
  resolveSiteUrl,
  type PerformanceRow,
} from "@/lib/admin/gsc-client";

vi.mock("@/lib/admin/google-auth", () => ({
  getGoogleAccessToken: vi.fn(async () => "tok"),
  getServiceAccountEmail: vi.fn(() => "bot@x.iam.gserviceaccount.com"),
}));

const SITES = { siteEntry: [{ siteUrl: "sc-domain:tonygreenberg.com", permissionLevel: "siteRestrictedUser" }] };
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });

function stub(handler: (url: string, init: RequestInit) => Response) {
  const fetchMock = vi.fn(async (url: string, init: RequestInit) => (url.endsWith("/webmasters/v3/sites") ? json(SITES) : handler(url, init)));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("resolveSiteUrl", () => {
  const sites = [
    { siteUrl: "sc-domain:tonygreenberg.com", permissionLevel: "x" },
    { siteUrl: "https://ramprate.com/", permissionLevel: "x" },
  ];

  it("keeps an exact property and defaults to tonygreenberg.com", () => {
    expect(resolveSiteUrl("https://ramprate.com/", sites)).toBe("https://ramprate.com/");
    expect(resolveSiteUrl(undefined, sites)).toBe("sc-domain:tonygreenberg.com");
    expect(resolveSiteUrl("  ", sites)).toBe("sc-domain:tonygreenberg.com");
  });

  it("maps bare domains and URLs onto the visible property, preferring the Domain one", () => {
    expect(resolveSiteUrl("https://www.TonyGreenberg.com/blog/x", sites)).toBe("sc-domain:tonygreenberg.com");
    expect(resolveSiteUrl("ramprate.com", sites)).toBe("https://ramprate.com/");
  });

  it("throws naming the visible properties and the service account", () => {
    expect(() => resolveSiteUrl("example.com", sites)).toThrow(/No Search Console property for "example.com".*sc-domain:tonygreenberg.com.*bot@x/);
    expect(() => resolveSiteUrl("x.com", [])).toThrow(/Visible properties: none/);
  });
});

describe("performanceDateRange", () => {
  const today = new Date("2026-10-16T12:00:00Z");

  it("defaults to 28 days ending 3 days ago, with an equal previous period", () => {
    expect(performanceDateRange({}, today)).toEqual({
      startDate: "2026-09-16",
      endDate: "2026-10-13",
      previous: { startDate: "2026-08-19", endDate: "2026-09-15" },
    });
  });

  it("uses explicit dates and day counts", () => {
    expect(performanceDateRange({ days: 7 }, today)).toMatchObject({ startDate: "2026-10-07", endDate: "2026-10-13" });
    expect(performanceDateRange({ startDate: "2026-01-01", endDate: "2026-01-10" }, today)).toEqual({
      startDate: "2026-01-01",
      endDate: "2026-01-10",
      previous: { startDate: "2025-12-22", endDate: "2025-12-31" },
    });
  });

  it("ignores zero or negative days", () => {
    expect(performanceDateRange({ days: -5 }, today).startDate).toBe("2026-09-16");
  });
});

describe("mergeComparison", () => {
  const row = (q: string, clicks: number, position: number): PerformanceRow => ({ keys: { query: q }, clicks, impressions: clicks * 10, ctr: 10, position });

  it("adds changes, with a positive position change meaning moved up", () => {
    const [a, b] = mergeComparison([row("trust", 10, 3), row("new", 5, 8)], [row("trust", 4, 5.5)]);
    expect(a.change).toEqual({ clicks: 6, impressions: 60, ctr: 0, position: 2.5 });
    expect(b.change).toEqual({ clicks: 5, impressions: 50, ctr: 10, position: 0 });
  });
});

describe("getSearchPerformance", () => {
  it("queries rows and totals, rounding CTR to percent and position to one place", async () => {
    const fetchMock = stub((_url, init) => {
      const body = JSON.parse(init.body as string);
      return json(body.dimensions.length ? { rows: [{ keys: ["trust"], clicks: 3, impressions: 40, ctr: 0.0753, position: 4.26 }] } : { rows: [{ clicks: 3, impressions: 40, ctr: 0.075, position: 4.2 }] });
    });
    const r = await getSearchPerformance({ dimensions: ["query", "bogus"], rowLimit: 5000, searchType: "nope", filters: [{ dimension: "page", operator: "weird", expression: "/blog" }, { dimension: "", expression: "x" }] });
    expect(r.siteUrl).toBe("sc-domain:tonygreenberg.com");
    expect(r.dimensions).toEqual(["query"]);
    expect(r.searchType).toBe("web");
    expect(r.filters).toEqual([{ dimension: "page", operator: "contains", expression: "/blog" }]);
    expect(r.rows).toEqual([{ keys: { query: "trust" }, clicks: 3, impressions: 40, ctr: 7.53, position: 4.3 }]);
    expect(r.totals).toMatchObject({ clicks: 3, ctr: 7.5 });
    const q = fetchMock.mock.calls.find((c) => String(c[0]).includes("searchAnalytics"))!;
    expect(q[0]).toBe("https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Atonygreenberg.com/searchAnalytics/query");
    expect(JSON.parse(q[1].body as string)).toMatchObject({ rowLimit: 1000, type: "web", dataState: "all", dimensionFilterGroups: [{ filters: r.filters }] });
    expect(getGoogleAccessToken).toHaveBeenCalledWith("https://www.googleapis.com/auth/webmasters.readonly");
  });

  it("compares against the previous period when asked", async () => {
    stub(() => json({ rows: [{ keys: ["trust"], clicks: 2, impressions: 10, ctr: 0.2, position: 5 }] }));
    const r = await getSearchPerformance({ compare: true });
    expect(r.previousPeriod).toBeDefined();
    expect(r.rows[0].change).toEqual({ clicks: 0, impressions: 0, ctr: 0, position: 0 });
  });

  it("explains a 403 by naming the service account to add", async () => {
    stub(() => json({ error: { message: "User does not have sufficient permission" } }, 403));
    await expect(getSearchPerformance({})).rejects.toThrow(/sufficient permission - add bot@x.iam.gserviceaccount.com as a user/);
  });

  it("only ever reads: every request is a GET or a read-only POST", async () => {
    const fetchMock = stub(() => json({}));
    await getSearchPerformance({});
    await listSitemaps(undefined);
    await inspectUrls(undefined, ["https://tonygreenberg.com/"]);
    for (const [url, init] of fetchMock.mock.calls) {
      expect(["GET", "POST", undefined]).toContain(init?.method);
      if (init?.method === "POST") expect(String(url)).toMatch(/searchAnalytics\/query|urlInspection\/index:inspect/);
    }
  });
});

describe("inspectUrls", () => {
  it("summarises each URL, flags canonical mismatches and keeps per-URL errors", async () => {
    stub((_url, init) => {
      const { inspectionUrl } = JSON.parse(init.body as string);
      if (inspectionUrl.endsWith("/bad")) return json({ error: { message: "quota" } }, 429);
      return json({
        inspectionResult: {
          inspectionResultLink: "https://search.google.com/x",
          indexStatusResult: { verdict: "PASS", googleCanonical: "https://tonygreenberg.com/a", userCanonical: "https://tonygreenberg.com/b", referringUrls: ["1", "2", "3", "4", "5", "6"] },
          richResultsResult: { verdict: "FAIL", detectedItems: [{ richResultType: "FAQ", items: [{ issues: [{ severity: "ERROR", issueMessage: "Missing field" }] }] }] },
        },
      });
    });
    const r = await inspectUrls(undefined, [" https://tonygreenberg.com/a ", "", "https://tonygreenberg.com/bad"]);
    expect(r.inspected).toBe(2);
    expect(r.results[0]).toMatchObject({ url: "https://tonygreenberg.com/a", verdict: "PASS", canonicalMismatch: true, richResults: { verdict: "FAIL", types: [{ type: "FAQ", issues: ["ERROR: Missing field"] }] } });
    expect((r.results[0] as { referringUrls: string[] }).referringUrls).toHaveLength(5);
    expect(r.results[1]).toEqual({ url: "https://tonygreenberg.com/bad", error: "quota" });
  });

  it("caps at 20 URLs and says so", async () => {
    const fetchMock = stub(() => json({}));
    const r = await inspectUrls(undefined, Array.from({ length: 25 }, (_, i) => `https://tonygreenberg.com/${i}`));
    expect(r.inspected).toBe(20);
    expect(r.note).toMatch(/first 20 URLs/);
    expect(fetchMock.mock.calls.filter((c) => String(c[0]).includes("urlInspection"))).toHaveLength(20);
  });
});

describe("listSites / listSitemaps", () => {
  it("lists properties, or [] when there are none", async () => {
    stub(() => json({}));
    await expect(listSites()).resolves.toEqual(SITES.siteEntry);
  });

  it("maps sitemap counts to numbers", async () => {
    stub(() => json({ sitemap: [{ path: "https://tonygreenberg.com/sitemap.xml", errors: "1", warnings: "0", contents: [{ type: "web", submitted: "120" }] }] }));
    await expect(listSitemaps(undefined)).resolves.toEqual({
      siteUrl: "sc-domain:tonygreenberg.com",
      sitemaps: [{ path: "https://tonygreenberg.com/sitemap.xml", lastSubmitted: undefined, lastDownloaded: undefined, isPending: false, isIndex: false, errors: 1, warnings: 0, contents: [{ type: "web", submitted: 120 }] }],
    });
  });
});
