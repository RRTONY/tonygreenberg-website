import { describe, expect, it } from "vitest";
import PostInterventionPage, { metadata } from "@/app/post-intervention/page";
import { PostIntervention } from "@/components/post-intervention/post-intervention";

describe("/post-intervention", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("How Are You, Really? Post-Intervention Assessment");
    expect(metadata.description).toMatch(/anonymous check-in/);
    expect(metadata.alternates?.canonical).toBe("/post-intervention");
  });

  it("renders the check-in flow", () => {
    expect(PostInterventionPage().type).toBe(PostIntervention);
  });
});
