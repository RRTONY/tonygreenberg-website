import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepDone } from "@/components/friend-survey/components/step-done";
import { TRUST_QUOTE } from "@/lib/content/friend-gate";
import type { SurveyStepProps } from "@/components/friend-survey/friend-survey";

const survey = { state: { step: 4, email: "", answers: {}, pending: false, error: null } } as unknown as SurveyStepProps["survey"];

describe("StepDone", () => {
  it("thanks the friend by name and promises the seeker only sees a summary", () => {
    render(<StepDone survey={survey} seekerName="Sam" friendName="Alex" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Thank you, Alex.");
    expect(screen.getByText(/Sam will see a summary — not your name/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(TRUST_QUOTE.slice(0, 25)))).toBeInTheDocument();
  });

  it("has nothing left to press", () => {
    render(<StepDone survey={survey} seekerName="Sam" friendName="Alex" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
