import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

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

function createAuthContext(): TrpcContext {
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

describe("spam.trackView", () => {
  it("accepts a tracking call with company details and returns tracked: true", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.trackView({
      company: "TestSpamCo",
      domain: "testspam.com",
      email: "spam@testspam.com",
      userAgent: "Mozilla/5.0 Test",
      referer: "https://email-client.com",
    });

    expect(result).toEqual({ tracked: true });
  });

  it("accepts a tracking call without any details (anonymous)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.trackView({});

    expect(result).toEqual({ tracked: true });
  });

  it("accepts partial company info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.trackView({
      domain: "partial-test.com",
    });

    expect(result).toEqual({ tracked: true });
  });
});

describe("spam.processForward", () => {
  it("processes a forwarded spam email and returns generated URL", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.processForward({
      rawSubject: "Amazing Business Opportunity!!!",
      rawFrom: "scammer@badcompany.com",
      extractedCompany: "BadCompany",
      extractedDomain: "badcompany.com",
      extractedEmail: "scammer@badcompany.com",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.generatedUrl).toContain("/youve-been-reported");
    expect(result.generatedUrl).toContain("company=BadCompany");
    expect(result.generatedUrl).toContain("domain=badcompany.com");
    expect(result.company).toBe("BadCompany");
    expect(result.domain).toBe("badcompany.com");
  });

  it("auto-extracts domain from email when domain not provided", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.processForward({
      rawSubject: "You won't believe this deal",
      extractedEmail: "spam@autoextract.io",
    });

    expect(result.success).toBe(true);
    expect(result.domain).toBe("autoextract.io");
    expect(result.company).toBe("Autoextract");
    expect(result.generatedUrl).toContain("domain=autoextract.io");
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.spam.processForward({
        rawSubject: "Test",
        extractedEmail: "test@test.com",
      })
    ).rejects.toThrow();
  });
});

describe("spam.viewStats (admin only)", () => {
  it("allows admin to view tracking stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.viewStats();

    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects non-admin users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.spam.viewStats()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.spam.viewStats()).rejects.toThrow();
  });
});

describe("spam.listForwards (admin only)", () => {
  it("allows admin to list forwarded spam", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.listForwards();

    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects non-admin users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.spam.listForwards()).rejects.toThrow();
  });
});

describe("spam.viewByCompany", () => {
  it("returns null or view data for a company", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spam.viewByCompany({ company: "NonExistentCo" });

    // Should return null for a company that hasn't been tracked
    // or an object if it has been tracked in a previous test
    expect(result === null || typeof result === "object").toBe(true);
  });
});
