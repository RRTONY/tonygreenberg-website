import { describe, expect, it } from "vitest";
import { permanentRedirect } from "next/navigation";
import LifeAssessmentPage, { metadata } from "@/app/life-assessment/page";

describe("/life-assessment", () => {
  it("points its canonical at /the-mirror, the one real copy of this assessment", () => {
    expect(metadata.title).toBe("The Mirror");
    expect(metadata.description).toMatch(/six-dimension life assessment/);
    expect(metadata.alternates?.canonical).toBe("/the-mirror");
  });

  it("permanently redirects to /the-mirror instead of rendering a duplicate page", () => {
    expect(() => LifeAssessmentPage()).toThrow("NEXT_REDIRECT:/the-mirror");
    expect(permanentRedirect).toHaveBeenCalledWith("/the-mirror");
  });
});
