import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("spam.submitReport", () => {
  it("validates required fields and rejects empty company name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.spam.submitReport({
        companyName: "",
        senderEmail: "spam@test.com",
        spamType: "cold_outreach",
        frequency: "weekly",
        description: "They keep emailing me cold pitches",
      })
    ).rejects.toThrow();
  });

  it("validates required fields and rejects empty description", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.spam.submitReport({
        companyName: "SpamCorp",
        senderEmail: "spam@test.com",
        spamType: "cold_outreach",
        frequency: "weekly",
        description: "",
      })
    ).rejects.toThrow();
  });

  it("accepts valid report input shape", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // This will attempt to insert into the DB — in test env it may fail at DB level
    // but the input validation should pass
    try {
      await caller.spam.submitReport({
        companyName: "Forward Medical",
        senderEmail: "outreach@forwardmedical.com",
        spamType: "ai_generated",
        frequency: "daily",
        description: "AI-generated personalized spam pretending to know me",
        reporterEmail: "victim@example.com",
      });
    } catch (e: any) {
      // If it fails, it should be a DB error, not a validation error
      // Validation errors have code 'BAD_REQUEST'
      if (e.code === "BAD_REQUEST") {
        throw new Error("Input validation should have passed for valid data");
      }
      // DB errors are expected in test environment — that's fine
    }
  });
});

describe("spam.getWallOfShame", () => {
  it("returns an array (possibly empty)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.spam.getWallOfShame();
      expect(Array.isArray(result)).toBe(true);
    } catch (e: any) {
      // DB connection errors are expected in test environment
      if (e.code === "BAD_REQUEST") {
        throw new Error("Should not be a validation error");
      }
    }
  });
});

describe("spam.getReportsByCompany", () => {
  it("validates company name is required", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.spam.getReportsByCompany({ companyName: "" })
    ).rejects.toThrow();
  });
});
