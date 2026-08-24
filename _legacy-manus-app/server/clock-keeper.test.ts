import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Clock Keeper Chronicles: Part II", () => {
  it("should have clockKeeper.submit procedure in appRouter", () => {
    expect(appRouter._def.procedures).toHaveProperty("clockKeeper.submit");
  });

  it("should have clockKeeper.count procedure in appRouter", () => {
    expect(appRouter._def.procedures).toHaveProperty("clockKeeper.count");
  });

  it("should have the clock_keeper_responses table in the schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.clockKeeperResponses).toBeDefined();
  });

  it("should have saveClockKeeperResponse helper in db.ts", async () => {
    const db = await import("./db");
    expect(typeof db.saveClockKeeperResponse).toBe("function");
  });

  it("should have getClockKeeperResponseCount helper in db.ts", async () => {
    const db = await import("./db");
    expect(typeof db.getClockKeeperResponseCount).toBe("function");
  });

  it("schema should have all 12 question columns plus reframe", async () => {
    const schema = await import("../drizzle/schema");
    const table = schema.clockKeeperResponses;
    // Check that all expected columns exist
    const expectedColumns = [
      "id", "respondentName", "respondentEmail",
      "q1", "q2", "q3", "q4", "q5", "q6",
      "q7", "q8", "q9", "q10", "q11", "q12",
      "reframe", "userId", "createdAt",
    ];
    for (const col of expectedColumns) {
      expect(table).toHaveProperty(col);
    }
  });
});
