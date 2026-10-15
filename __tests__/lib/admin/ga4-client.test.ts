import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGoogleAccessToken } from "@/lib/admin/google-auth";
import { getAnalyticsSummary, getTopEssayPaths } from "@/lib/admin/ga4-client";

vi.mock("@/lib/admin/google-auth", () => ({ getGoogleAccessToken: vi.fn(async () => "tok") }));

const report = (rows: { d?: string[]; m: string[] }[]) => ({
  rows: rows.map((r) => ({ dimensionValues: r.d?.map((value) => ({ value })), metricValues: r.m.map((value) => ({ value })) })),
});

beforeEach(() => {
  vi.stubEnv("GA4_PROPERTY_ID_TONYGREENBERG", "123456");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getAnalyticsSummary", () => {
  it("refuses without a property id and makes no request", async () => {
    vi.stubEnv("GA4_PROPERTY_ID_TONYGREENBERG", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(getAnalyticsSummary()).rejects.toThrow("GA4_PROPERTY_ID_TONYGREENBERG is not configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns totals and top pages from two reports", async () => {
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string);
      return new Response(JSON.stringify(body.dimensions ? report([{ d: ["/"], m: ["50"] }, { d: ["/blog/x"], m: ["20"] }]) : report([{ m: ["10", "8", "70"] }])));
    });
    vi.stubGlobal("fetch", fetchMock);
    await expect(getAnalyticsSummary(30)).resolves.toEqual({
      propertyId: "123456",
      days: 30,
      totals: { sessions: 10, activeUsers: 8, screenPageViews: 70 },
      topPages: [
        { path: "/", views: 50 },
        { path: "/blog/x", views: 20 },
      ],
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://analyticsdata.googleapis.com/v1beta/properties/123456:runReport");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
    expect(JSON.parse(init.body as string).dateRanges).toEqual([{ startDate: "30daysAgo", endDate: "today" }]);
    expect(getGoogleAccessToken).toHaveBeenCalledWith("https://www.googleapis.com/auth/analytics.readonly");
  });

  it("is all zeros for an empty report", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
    await expect(getAnalyticsSummary()).resolves.toMatchObject({ days: 7, totals: { sessions: 0, activeUsers: 0, screenPageViews: 0 }, topPages: [] });
  });

  it("surfaces the API's error message, or the status", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { message: "User does not have sufficient permissions" } }), { status: 403 })));
    await expect(getAnalyticsSummary()).rejects.toThrow("User does not have sufficient permissions");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("oops", { status: 500 })));
    await expect(getAnalyticsSummary()).rejects.toThrow("GA4 Data API error (500)");
  });
});

describe("getTopEssayPaths", () => {
  it("asks only for /blog/ pages, minus category pages, with the limit", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(report([{ d: ["/blog/five-cups"], m: ["99"] }]))));
    vi.stubGlobal("fetch", fetchMock);
    await expect(getTopEssayPaths(28, 5)).resolves.toEqual([{ path: "/blog/five-cups", views: 99 }]);
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.limit).toBe("5");
    expect(body.dateRanges[0].startDate).toBe("28daysAgo");
    expect(JSON.stringify(body.dimensionFilter)).toContain('"value":"/blog/"');
    expect(body.dimensionFilter.andGroup.expressions[1].notExpression.filter.stringFilter.value).toBe("/blog/category/");
  });

  it("refuses without a property id", async () => {
    vi.stubEnv("GA4_PROPERTY_ID_TONYGREENBERG", "");
    await expect(getTopEssayPaths(7, 3)).rejects.toThrow(/not configured/);
  });
});
