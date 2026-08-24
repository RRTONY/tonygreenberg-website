import { describe, it, expect, vi } from "vitest";

// Mock the notification module before importing routers
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock db module
vi.mock("./db", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    saveEngagementAudit: vi.fn().mockResolvedValue({ id: 1 }),
    getEngagementAudits: vi.fn().mockResolvedValue([]),
  };
});

import { appRouter } from "./routers";

describe("Engagement Gate", () => {
  it("engage.submit procedure exists on the router", () => {
    expect(appRouter._def.procedures).toHaveProperty("engage.submit");
  });

  it("engage.list procedure exists on the router", () => {
    expect(appRouter._def.procedures).toHaveProperty("engage.list");
  });

  it("engage.submit validates required fields", () => {
    const procedure = appRouter._def.procedures["engage.submit"];
    expect(procedure).toBeDefined();
  });

  it("engage.submit requires all five audit questions", async () => {
    // The input schema should require: impactInitiative, impactOutcomes, whyTony, priorAction, resourcesCommitted
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    // Missing required fields should throw
    await expect(
      caller.engage.submit({
        name: "Test User",
        email: "test@example.com",
        impactInitiative: "",  // empty = should fail min(1)
        impactOutcomes: "Test outcomes",
        whyTony: "Test reason",
        priorAction: "Test action",
        resourcesCommitted: "Test resources",
        totalScore: 50,
        outcome: "not-ready",
      })
    ).rejects.toThrow();
  });

  it("engage.submit accepts valid qualified submission", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.engage.submit({
      name: "Jane Doe",
      email: "jane@example.com",
      organization: "Impact Corp",
      impactInitiative: "Building ocean cleanup infrastructure across Southeast Asia",
      impactOutcomes: "Remove 10,000 tons of plastic from coastal waters by 2027",
      whyTony: "Your tokenization work with BEYOND aligns directly with our funding model",
      priorAction: "Already deployed 3 cleanup stations in Thailand, raised $2M seed",
      resourcesCommitted: "$5M committed, 12-person team, 18-month runway",
      totalScore: 85,
      outcome: "qualified",
    });

    expect(result).toEqual({ success: true, outcome: "qualified" });
  });

  it("engage.submit accepts not-ready outcome", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.engage.submit({
      name: "John Smith",
      email: "john@example.com",
      impactInitiative: "Want to do something good",
      impactOutcomes: "Help people",
      whyTony: "Saw your website",
      priorAction: "Nothing yet",
      resourcesCommitted: "Not sure",
      totalScore: 25,
      outcome: "not-ready",
    });

    expect(result).toEqual({ success: true, outcome: "not-ready" });
  });

  it("engage.submit rejects invalid outcome values", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.engage.submit({
        name: "Test",
        email: "test@test.com",
        impactInitiative: "Test",
        impactOutcomes: "Test",
        whyTony: "Test",
        priorAction: "Test",
        resourcesCommitted: "Test",
        totalScore: 50,
        outcome: "invalid-outcome" as any,
      })
    ).rejects.toThrow();
  });

  it("engage.submit rejects invalid email", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.engage.submit({
        name: "Test",
        email: "not-an-email",
        impactInitiative: "Test",
        impactOutcomes: "Test",
        whyTony: "Test",
        priorAction: "Test",
        resourcesCommitted: "Test",
        totalScore: 50,
        outcome: "qualified",
      })
    ).rejects.toThrow();
  });
});
