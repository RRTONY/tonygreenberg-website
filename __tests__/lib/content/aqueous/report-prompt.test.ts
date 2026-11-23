import { describe, expect, it } from "vitest";
import { reportPrompts } from "@/lib/content/aqueous/report-prompt";

describe("reportPrompts", () => {
  it("names the member and uses their QPR weights", () => {
    const { system, user } = reportPrompts("Mia", { quality: 50, purity: 30, resonance: 20 });
    expect(system).toContain('personalized AWI (Aqueous Water Index) report for a user named "Mia"');
    expect(system).toContain("- Quality: 50%\n- Purity: 30%\n- Resonance: 20%");
    for (const heading of [
      "# Your Personalized AWI Report",
      "## Your Water Profile",
      "## Top 5 Waters For You",
      "## Waters to Avoid",
      "## Your Tap Water Analysis",
      "## Filter Recommendations",
      "## The Sacred Geometry of Your Water",
    ]) {
      expect(system).toContain(heading);
    }
    expect(system).toContain("worth $20");
    expect(user).toBe("Generate my personalized AWI report. My name is Mia. My weights: Quality 50%, Purity 30%, Resonance 20%.");
  });

  it("falls back to the app's default weights (40/35/25), keeping a real 0", () => {
    expect(reportPrompts("A", {}).user).toContain("Quality 40%, Purity 35%, Resonance 25%");
    expect(reportPrompts("A", { quality: 0, resonance: 60 }).user).toContain("Quality 0%, Purity 35%, Resonance 60%");
  });
});
