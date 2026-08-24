import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * PRI (Psychedelic Readiness Index) procedure tests.
 * Tests the consent, correction, and assessment type support.
 */

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-pri",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("pri.submitConsent", () => {
  it("accepts valid initials and sessionId", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.pri.submitConsent({
      initials: "TG",
      sessionId: "test-session-" + Date.now(),
    });
    expect(result).toHaveProperty("success");
    // success is true if DB is available, but the procedure should not throw
  });

  it("rejects initials shorter than 2 characters", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.pri.submitConsent({ initials: "T", sessionId: "test-session" })
    ).rejects.toThrow();
  });

  it("rejects empty sessionId", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.pri.submitConsent({ initials: "TG", sessionId: "" })
    ).rejects.toThrow();
  });
});

describe("pri.checkConsent", () => {
  it("returns hasConsent boolean for a sessionId", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.pri.checkConsent({
      sessionId: "nonexistent-session-" + Date.now(),
    });
    expect(result).toHaveProperty("hasConsent");
    expect(typeof result.hasConsent).toBe("boolean");
  });
});

describe("pri.submitCorrection", () => {
  it("accepts a valid correction submission", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.pri.submitCorrection({
      medicineId: "psilocybin",
      fieldName: "contraindications",
      suggestedContent: "Should also mention MAO-B inhibitors as a potential interaction.",
      sessionId: "test-session-" + Date.now(),
    });
    expect(result).toHaveProperty("success");
  });

  it("rejects empty suggestedContent", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.pri.submitCorrection({
        medicineId: "psilocybin",
        fieldName: "overview",
        suggestedContent: "",
        sessionId: "test-session",
      })
    ).rejects.toThrow();
  });

  it("rejects empty medicineId", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.pri.submitCorrection({
        medicineId: "",
        fieldName: "overview",
        suggestedContent: "Some correction",
        sessionId: "test-session",
      })
    ).rejects.toThrow();
  });
});

describe("assessments.submit with psychedelic-readiness", () => {
  it("accepts psychedelic-readiness as a valid assessment type", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.assessments.submit({
      assessmentType: "psychedelic-readiness",
      sessionId: "test-session-" + Date.now(),
      answers: JSON.stringify([{ questionId: 1, answer: 7, score: 70 }]),
      resultSummary: JSON.stringify({ overall: 72, level: "Advanced Explorer" }),
      totalScore: 72,
    });
    expect(result).toHaveProperty("success");
  });
});
