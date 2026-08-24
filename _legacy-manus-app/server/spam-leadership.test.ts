import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { "x-forwarded-for": "1.2.3.4" },
      socket: { remoteAddress: "1.2.3.4" },
    } as unknown as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("spam.lookupLeadership", () => {
  it("returns empty array when company is empty", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.lookupLeadership({
      company: "",
      domain: "",
    });

    expect(result).toEqual({ executives: [], source: "none" });
  });

  it("returns empty array when company is too short", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.lookupLeadership({
      company: "A",
      domain: "",
    });

    expect(result).toEqual({ executives: [], source: "none" });
  });

  it("returns empty array when both inputs are undefined", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.lookupLeadership({});

    expect(result).toEqual({ executives: [], source: "none" });
  });

  it("accepts a valid company name and returns executives array", { timeout: 30000 }, async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // This calls the real LLM, so we check the shape of the response
    const result = await caller.spam.lookupLeadership({
      company: "Microsoft",
      domain: "microsoft.com",
    });

    expect(result).toHaveProperty("executives");
    expect(result).toHaveProperty("source");
    expect(Array.isArray(result.executives)).toBe(true);

    // If LLM returned results, verify each executive has name and title
    if (result.executives.length > 0) {
      for (const exec of result.executives) {
        expect(exec).toHaveProperty("name");
        expect(exec).toHaveProperty("title");
        expect(typeof exec.name).toBe("string");
        expect(typeof exec.title).toBe("string");
        expect(exec.name.length).toBeGreaterThan(0);
        expect(exec.title.length).toBeGreaterThan(0);
      }
      // Should return 4-8 executives
      expect(result.executives.length).toBeGreaterThanOrEqual(4);
      expect(result.executives.length).toBeLessThanOrEqual(8);
    }
  });

  it("handles domain-only input", { timeout: 30000 }, async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.lookupLeadership({
      domain: "google.com",
    });

    expect(result).toHaveProperty("executives");
    expect(result).toHaveProperty("source");
    expect(Array.isArray(result.executives)).toBe(true);
  });
});
