import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Coffee Prescription Router", () => {
  it("should have coffeePrescription.generate procedure defined", () => {
    expect(appRouter._def.procedures).toHaveProperty("coffeePrescription.generate");
  });

  it("coffeePrescription.generate should be a procedure (not undefined)", () => {
    const proc = (appRouter._def.procedures as any)["coffeePrescription.generate"];
    expect(proc).toBeDefined();
    expect(proc._def).toBeDefined();
  });
});
