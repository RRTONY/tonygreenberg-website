import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepInterstitial } from "@/components/assessments/dharma-finder-quiz/components/step-interstitial";
import { INTERSTITIAL_QUOTES } from "@/components/assessments/dharma-finder-quiz/data/dharma-finder.data";
import type { StepProps } from "@/components/assessments/dharma-finder-quiz/dharma-finder-quiz";

const quizAt = (interstitial: number) => ({ state: { step: 2, current: 0, answers: {}, interstitial } }) as unknown as StepProps["quiz"];

describe("dharma StepInterstitial", () => {
  it("shows the quote for the part just finished", () => {
    render(<StepInterstitial quiz={quizAt(1)} />);
    expect(screen.getByText(new RegExp(INTERSTITIAL_QUOTES[1].text.slice(0, 30)))).toBeInTheDocument();
    expect(screen.getByText(`— ${INTERSTITIAL_QUOTES[1].author}`)).toBeInTheDocument();
  });

  it("wraps around when there are more parts than quotes", () => {
    render(<StepInterstitial quiz={quizAt(INTERSTITIAL_QUOTES.length)} />);
    expect(screen.getByText(`— ${INTERSTITIAL_QUOTES[0].author}`)).toBeInTheDocument();
  });
});
