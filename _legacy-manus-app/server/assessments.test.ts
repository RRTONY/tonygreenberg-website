import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("assessments.listShared", () => {
  it("returns an array when called by admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.assessments.listShared();
    expect(Array.isArray(results)).toBe(true);
  });

  it("returns results with expected shape", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.assessments.listShared();
    if (results.length > 0) {
      const first = results[0];
      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("assessmentType");
      expect(first).toHaveProperty("resultSummary");
      expect(first).toHaveProperty("createdAt");
    }
  });

  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.assessments.listShared()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.assessments.listShared()).rejects.toThrow();
  });
});

describe("assessments.submit", () => {
  it("saves an assessment result", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.assessments.submit({
      assessmentType: "therapy",
      sessionId: `test-session-${Date.now()}`,
      answers: JSON.stringify({ q1: "a", q2: "b" }),
      resultSummary: JSON.stringify({ archetype: "The Architect", scores: { cognitive: 10 } }),
      totalScore: 25.3,
      sharedWithTony: false,
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("saves with sharedWithTony flag and user info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.assessments.submit({
      assessmentType: "therapy",
      sessionId: `test-shared-${Date.now()}`,
      answers: JSON.stringify({ q1: "c" }),
      resultSummary: JSON.stringify({ archetype: "The Explorer" }),
      totalScore: 18.5,
      sharedWithTony: true,
      userName: "Test Sharer",
      userEmail: "sharer@test.com",
    });

    expect(result).toHaveProperty("success", true);
    expect(result.id).toBeTruthy();
  });
});
