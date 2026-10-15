import { describe, expect, it } from "vitest";
import { DAY_OPTIONS, INTERVENTION_TYPES, OPEN_QUESTIONS, RECOMMEND_LABELS, SCALE_LABELS, SCORES, postInterventionData } from "@/components/post-intervention/data/post-intervention.data";

describe("post-intervention data", () => {
  it("offers Day 1, 3 and 7 with a subtitle each", () => {
    expect(DAY_OPTIONS.map((d) => d.value)).toEqual([1, 3, 7]);
    DAY_OPTIONS.forEach((d) => {
      expect(d.label).toBe(`Day ${d.value}`);
      expect(d.subtitle.length).toBeGreaterThan(0);
    });
  });

  it("has unique intervention types with labels", () => {
    const values = INTERVENTION_TYPES.map((t) => t.value);
    expect(new Set(values).size).toBe(values.length);
    expect(values).toContain("psychedelic");
    INTERVENTION_TYPES.forEach((t) => expect(t.label).not.toBe(""));
  });

  it("labels every point on the 1-10 scale", () => {
    for (let n = 1; n <= 10; n++) expect(SCALE_LABELS[n]).toBeTruthy();
    expect(SCALE_LABELS[1]).toBe("Very low");
    expect(SCALE_LABELS[10]).toBe("Exceptional");
  });

  it("has three scores, three open questions and three recommend options", () => {
    expect(SCORES.map((s) => s.key)).toEqual(["integrationScore", "safetyScore", "trustScore"]);
    expect(OPEN_QUESTIONS.map((q) => q.key)).toEqual(["wentWell", "couldImprove", "messageToFacilitator"]);
    expect(RECOMMEND_LABELS).toEqual({ yes: "Yes", no: "No", unsure: "Not sure" });
  });

  it("sends results to Tony and has no Manus links", () => {
    expect(postInterventionData.footer).toContain("tony@tonygreenberg.com");
    expect(JSON.stringify(postInterventionData)).not.toMatch(/manuscdn|manus-storage|\/api\/img\//);
  });
});
