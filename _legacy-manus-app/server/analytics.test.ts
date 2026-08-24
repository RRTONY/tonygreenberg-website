import { describe, it, expect } from "vitest";

// Test the analytics and email capture router procedures exist
describe("Analytics & Email Capture Router", () => {
  it("should have analytics, subscribe, and blogRating routers defined", async () => {
    const routerModule = await import("./routers");
    const router = routerModule.appRouter;
    
    // Check that the router has the expected procedures
    expect(router).toBeDefined();
    expect(router._def).toBeDefined();
    expect(router._def.procedures).toBeDefined();
    
    const procedures = router._def.procedures;
    
    // Check analytics procedures exist
    expect(procedures["analytics.trackPageView"]).toBeDefined();
    
    // Check subscribe procedure exists
    expect(procedures["subscribe.add"]).toBeDefined();
    
    // Check blog rating procedure exists
    expect(procedures["blogRating.rate"]).toBeDefined();
  });

  it("should have auth procedures still intact", async () => {
    const routerModule = await import("./routers");
    const router = routerModule.appRouter;
    const procedures = router._def.procedures;
    
    expect(procedures["auth.me"]).toBeDefined();
    expect(procedures["auth.logout"]).toBeDefined();
  });
});
