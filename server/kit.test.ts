import { describe, it, expect } from "vitest";

describe("Kit (ConvertKit) integration", () => {
  it("should have KIT_API_KEY configured", () => {
    const apiKey = process.env.KIT_API_KEY;
    expect(apiKey).toBeTruthy();
    expect(typeof apiKey).toBe("string");
    expect(apiKey!.length).toBeGreaterThan(5);
  });

  it("should have KIT_API_SECRET configured", () => {
    const apiSecret = process.env.KIT_API_SECRET;
    expect(apiSecret).toBeTruthy();
    expect(typeof apiSecret).toBe("string");
    expect(apiSecret!.length).toBeGreaterThan(10);
  });

  it("should have kitApiSecret in ENV config", async () => {
    const { ENV } = await import("./_core/env");
    expect(ENV.kitApiKey).toBeTruthy();
    expect(ENV.kitApiSecret).toBeTruthy();
  });

  it("should have subscribe.add procedure in appRouter", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
    expect(appRouter._def.procedures).toHaveProperty("subscribe.add");
    expect(appRouter._def.procedures).toHaveProperty("subscribe.count");
  });
});
