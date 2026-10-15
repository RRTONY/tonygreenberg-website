import { describe, expect, it } from "vitest";
import MyJourneyPage, { metadata } from "@/app/my-journey/page";
import { MyJourneyDashboard } from "@/components/assessments/my-journey-dashboard";

describe("/my-journey", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("My Journey");
    expect(metadata.description).toMatch(/Find Your ___ assessment/);
    expect(metadata.alternates?.canonical).toBe("/my-journey");
  });

  it("renders the journey dashboard", () => {
    expect(MyJourneyPage().type).toBe(MyJourneyDashboard);
  });
});
