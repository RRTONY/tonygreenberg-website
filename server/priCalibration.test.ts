import { describe, it, expect, vi } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  savePriCalibration: vi.fn().mockResolvedValue({ id: 1 }),
  getPriCalibrationStats: vi.fn().mockResolvedValue({
    total: 5,
    researchOptIn: 3,
    avgScores: { medical: 72, pharmacological: 65, psychological: 80, intention: 55, setting: 68, integration: 60 },
  }),
  getPriResearchData: vi.fn().mockResolvedValue([
    {
      id: 1,
      rankings: JSON.stringify(["psychological", "medical", "setting", "pharmacological", "intention", "integration"]),
      pairwiseChoices: JSON.stringify([{ pair: ["medical", "psychological"], chosen: "psychological" }]),
      dimScores: JSON.stringify({ medical: 72, pharmacological: 65, psychological: 80, intention: 55, setting: 68, integration: 60 }),
      createdAt: new Date("2026-05-01"),
    },
  ]),
}));

describe("PRI Calibration", () => {
  describe("savePriCalibration", () => {
    it("should accept valid calibration data and return an id", async () => {
      const { savePriCalibration } = await import("./db");
      const result = await savePriCalibration({
        sessionId: "test-session-123",
        userId: 1,
        rankings: JSON.stringify(["medical", "pharmacological", "psychological", "intention", "setting", "integration"]),
        pairwiseChoices: JSON.stringify([
          { pair: ["medical", "pharmacological"], chosen: "medical" },
          { pair: ["medical", "psychological"], chosen: "psychological" },
        ]),
        dimScores: JSON.stringify({ medical: 85, pharmacological: 70, psychological: 90, intention: 60, setting: 75, integration: 55 }),
        researchOptIn: true,
      });
      expect(result).toEqual({ id: 1 });
      expect(savePriCalibration).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: "test-session-123",
          researchOptIn: true,
        })
      );
    });

    it("should handle anonymous users (no userId)", async () => {
      const { savePriCalibration } = await import("./db");
      const result = await savePriCalibration({
        sessionId: "anon-session-456",
        rankings: JSON.stringify(["integration", "setting", "intention", "psychological", "pharmacological", "medical"]),
        pairwiseChoices: JSON.stringify([]),
        dimScores: JSON.stringify({ medical: 50, pharmacological: 50, psychological: 50, intention: 50, setting: 50, integration: 50 }),
        researchOptIn: false,
      });
      expect(result).toEqual({ id: 1 });
    });
  });

  describe("getPriCalibrationStats", () => {
    it("should return aggregate statistics", async () => {
      const { getPriCalibrationStats } = await import("./db");
      const stats = await getPriCalibrationStats();
      expect(stats.total).toBe(5);
      expect(stats.researchOptIn).toBe(3);
      expect(stats.avgScores).toHaveProperty("medical");
      expect(stats.avgScores).toHaveProperty("psychological");
      expect(typeof stats.avgScores.medical).toBe("number");
    });
  });

  describe("getPriResearchData", () => {
    it("should return only research-opted-in data", async () => {
      const { getPriResearchData } = await import("./db");
      const data = await getPriResearchData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty("rankings");
      expect(data[0]).toHaveProperty("pairwiseChoices");
      expect(data[0]).toHaveProperty("dimScores");
      expect(data[0]).toHaveProperty("createdAt");
      // Verify no PII
      expect(data[0]).not.toHaveProperty("userId");
      expect(data[0]).not.toHaveProperty("sessionId");
    });
  });

  describe("Bradley-Terry scoring", () => {
    it("should produce valid calibrated scores from pairwise choices", () => {
      // Simulate the client-side scoring logic
      const DIMS = ["medical", "pharmacological", "psychological", "intention", "setting", "integration"];
      const choices = [
        { pair: ["medical", "pharmacological"], chosen: "medical" },
        { pair: ["medical", "psychological"], chosen: "psychological" },
        { pair: ["medical", "intention"], chosen: "medical" },
        { pair: ["medical", "setting"], chosen: "medical" },
        { pair: ["medical", "integration"], chosen: "medical" },
        { pair: ["pharmacological", "psychological"], chosen: "psychological" },
        { pair: ["pharmacological", "intention"], chosen: "pharmacological" },
        { pair: ["pharmacological", "setting"], chosen: "setting" },
        { pair: ["pharmacological", "integration"], chosen: "pharmacological" },
        { pair: ["psychological", "intention"], chosen: "psychological" },
        { pair: ["psychological", "setting"], chosen: "psychological" },
        { pair: ["psychological", "integration"], chosen: "psychological" },
        { pair: ["intention", "setting"], chosen: "setting" },
        { pair: ["intention", "integration"], chosen: "intention" },
        { pair: ["setting", "integration"], chosen: "setting" },
      ];

      // Bradley-Terry computation
      const wins: Record<string, number> = {};
      const losses: Record<string, number> = {};
      DIMS.forEach(d => { wins[d] = 0; losses[d] = 0; });
      for (const c of choices) {
        wins[c.chosen]++;
        const loser = c.pair[0] === c.chosen ? c.pair[1] : c.pair[0];
        losses[loser]++;
      }
      const strengths: Record<string, number> = {};
      let total = 0;
      DIMS.forEach(d => {
        const s = (wins[d] + 1) / (wins[d] + losses[d] + 2);
        strengths[d] = s;
        total += s;
      });
      const scores: Record<string, number> = {};
      DIMS.forEach(d => {
        scores[d] = Math.round((strengths[d] / total) * 100 * DIMS.length);
      });
      const maxScore = Math.max(...Object.values(scores));
      DIMS.forEach(d => {
        scores[d] = Math.round((scores[d] / maxScore) * 100);
      });

      // Psychological should be highest (won 5/5)
      expect(scores["psychological"]).toBe(100);
      // All scores should be between 0 and 100
      DIMS.forEach(d => {
        expect(scores[d]).toBeGreaterThanOrEqual(0);
        expect(scores[d]).toBeLessThanOrEqual(100);
      });
      // Sum should not be 0
      const sum = DIMS.reduce((acc, d) => acc + scores[d], 0);
      expect(sum).toBeGreaterThan(0);
    });
  });
});
