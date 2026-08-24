import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-journey",
    email: "journey@example.com",
    name: "Journey Tester",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createAnonContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("journey procedures", () => {
  it("journey.getProgress returns an array for authenticated users", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.journey.getProgress();
    expect(Array.isArray(result)).toBe(true);
  });

  it("journey.markComplete accepts a valid experienceId", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.journey.markComplete({ experienceId: "find-your-me" });
    expect(result).toHaveProperty("success", true);
  });

  it("journey.sync accepts an array of completed IDs", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.journey.sync({
      completedIds: ["find-your-me", "find-your-purpose"],
    });
    expect(result).toHaveProperty("completedIds");
    expect(Array.isArray(result.completedIds)).toBe(true);
  });

  it("journey.getProgress rejects unauthenticated users", async () => {
    const { ctx } = createAnonContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.journey.getProgress()).rejects.toThrow();
  });
});
