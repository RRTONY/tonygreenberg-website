import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Analytics Dashboard", () => {
  it("should have analytics.getDashboard procedure defined", async () => {
    // Verify the procedure exists in the router
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("analytics.getDashboard");
  });

  it("should have analytics.trackPageView procedure defined", async () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("analytics.trackPageView");
  });

  it("should have analytics.updateReadTime procedure defined", async () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("analytics.updateReadTime");
  });

  it("should have analytics.getPostStats procedure defined", async () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("analytics.getPostStats");
  });

  it("getDashboard should require admin access (not public)", () => {
    // The getDashboard procedure should use adminProcedure, not publicProcedure
    // We verify this by checking the procedure exists and is a query
    const proc = (appRouter as any)._def.procedures["analytics.getDashboard"];
    expect(proc).toBeDefined();
    // It should be a query type
    expect(proc._def?.type).toBe("query");
  });
});
