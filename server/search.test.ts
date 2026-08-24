import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Search engine tests — verifies the tRPC search procedures work correctly.
 * Uses a public context since search is a public procedure.
 */

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      headers: { origin: "http://localhost:3000" },
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };
}

const caller = appRouter.createCaller(createPublicContext());

describe("search.query", () => {
  it("returns results for a known term", async () => {
    const result = await caller.search.query({
      q: "coffee",
      limit: 10,
      offset: 0,
    });

    expect(result).toHaveProperty("results");
    expect(result).toHaveProperty("total");
    expect(result.total).toBeGreaterThan(0);
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.length).toBeLessThanOrEqual(10);
  });

  it("returns result objects with expected fields", async () => {
    const result = await caller.search.query({
      q: "kava",
      limit: 5,
      offset: 0,
    });

    expect(result.results.length).toBeGreaterThan(0);
    const first = result.results[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("title");
    expect(first).toHaveProperty("path");
    expect(first).toHaveProperty("category");
    expect(first).toHaveProperty("snippet");
    expect(first).toHaveProperty("score");
  });

  it("returns 0 results for gibberish query", async () => {
    const result = await caller.search.query({
      q: "xyzzy999qqq",
      limit: 10,
      offset: 0,
    });

    expect(result.total).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("respects limit", async () => {
    const result = await caller.search.query({
      q: "coffee",
      limit: 3,
      offset: 0,
    });

    expect(result.results.length).toBeLessThanOrEqual(3);
  });

  it("filters by category when provided", async () => {
    const result = await caller.search.query({
      q: "coffee",
      limit: 20,
      offset: 0,
      category: "blog",
    });

    // All results should be in the blog category
    for (const r of result.results) {
      expect(r.category).toBe("blog");
    }
  });

  it("snippets contain the search term (case-insensitive)", async () => {
    const result = await caller.search.query({
      q: "cortisol",
      limit: 5,
      offset: 0,
    });

    expect(result.results.length).toBeGreaterThan(0);
    // At least one result should have the term in snippet, title, or excerpt
    const hasMatch = result.results.some(
      (r) =>
        r.snippet?.toLowerCase().includes("cortisol") ||
        r.title.toLowerCase().includes("cortisol") ||
        r.excerpt?.toLowerCase().includes("cortisol")
    );
    expect(hasMatch).toBe(true);
  });

  it("pagination via offset works correctly", async () => {
    const page1 = await caller.search.query({
      q: "coffee",
      limit: 3,
      offset: 0,
    });

    const page2 = await caller.search.query({
      q: "coffee",
      limit: 3,
      offset: 3,
    });

    // Pages should have different results (assuming enough total results)
    if (page1.total > 3) {
      expect(page2.results.length).toBeGreaterThan(0);
      expect(page1.results[0].id).not.toBe(page2.results[0].id);
    }
  });
});

describe("search.logClick", () => {
  it("logs a search click without error", async () => {
    const result = await caller.search.logClick({
      query: "test search",
      clickedPath: "/brewsoul",
    });
    expect(result).toEqual({ ok: true });
  });
});
