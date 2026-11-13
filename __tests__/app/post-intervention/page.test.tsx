import { describe, expect, it } from "vitest";
import PostInterventionPage, { metadata } from "@/app/post-intervention/page";
import { PostIntervention } from "@/components/post-intervention/post-intervention";

describe("/post-intervention", () => {
  it("has its own title, description and canonical", () => {
    // Over 60 with " | Tony Greenberg", so seoTitle drops the ending (2026-11-14).
    expect(metadata.title).toEqual({ absolute: "How Are You, Really? Post-Intervention Assessment" });
    expect(metadata.description).toMatch(/anonymous check-in/);
    expect(metadata.alternates?.canonical).toBe("/post-intervention");
  });

  it("renders the check-in flow", () => {
    expect(PostInterventionPage().type).toBe(PostIntervention);
  });
});
