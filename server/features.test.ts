import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Blog Data Integrity", () => {
  it("should have 121 blog posts with required fields or production-safe fallbacks", async () => {
    const blogData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/blogData.json"),
        "utf-8"
      )
    );
    expect(blogData.length).toBe(121);

    for (const post of blogData) {
      expect(post.slug).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.category).toBeDefined();
      expect(post.image === undefined || typeof post.image === "string").toBe(true);
    }
  });

  it("should have a valid read count or use the production default", async () => {
    const blogData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/blogData.json"),
        "utf-8"
      )
    );

    for (const post of blogData) {
      const displayedReads = post.reads ?? 500;
      expect(typeof displayedReads).toBe("number");
      expect(displayedReads).toBeGreaterThanOrEqual(0);
      expect(displayedReads).toBeLessThanOrEqual(25000);
    }
  });

  it("should have unique slugs for all posts", async () => {
    const blogData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/blogData.json"),
        "utf-8"
      )
    );
    const slugs = blogData.map((p: any) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });
});

describe("Thought Leaders Data", () => {
  it("should export thoughtLeadersBySlug mapping", async () => {
    // Dynamic import of the TS file
    const mod = await import(
      "../client/src/data/thoughtLeaders"
    );
    expect(mod.thoughtLeadersBySlug).toBeDefined();
    expect(typeof mod.thoughtLeadersBySlug).toBe("object");
  });

  it("should have entries for blog post slugs with valid structure", async () => {
    const mod = await import(
      "../client/src/data/thoughtLeaders"
    );
    const entries = Object.entries(mod.thoughtLeadersBySlug);
    expect(entries.length).toBeGreaterThan(0);

    for (const [slug, leaders] of entries) {
      expect(typeof slug).toBe("string");
      expect(Array.isArray(leaders)).toBe(true);
      for (const leader of leaders as any[]) {
        expect(leader.name).toBeDefined();
        expect(typeof leader.name).toBe("string");
        expect(leader.title).toBeDefined();
        expect(typeof leader.title).toBe("string");
        expect(leader.relevance).toBeDefined();
        expect(typeof leader.relevance).toBe("string");
      }
    }
  });

  it("should have 1-6 thought leaders per post entry", async () => {
    const mod = await import(
      "../client/src/data/thoughtLeaders"
    );
    for (const [, leaders] of Object.entries(mod.thoughtLeadersBySlug)) {
      const arr = leaders as any[];
      expect(arr.length).toBeGreaterThanOrEqual(1);
      expect(arr.length).toBeLessThanOrEqual(6);
    }
  });
});

describe("Router Procedures", () => {
  it("should have analytics.getPostStats procedure for read counts", async () => {
    const routerModule = await import("./routers");
    const router = routerModule.appRouter;
    const procedures = router._def.procedures;
    expect(procedures["analytics.getPostStats"]).toBeDefined();
  });
});
