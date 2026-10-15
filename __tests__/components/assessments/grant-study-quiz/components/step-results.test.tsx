import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepResults } from "@/components/assessments/grant-study-quiz/components/step-results";
import { FACTORS, getFactorInsight } from "@/components/assessments/grant-study-quiz/data/grant-study.data";
import type { StepProps } from "@/components/assessments/grant-study-quiz/grant-study-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const SCORES = { relationships: 30, coping: 90, generativity: 50, career: 60, health: 20 };

function quiz() {
  return {
    factorScores: FACTORS.map((f) => ({ ...f, score: SCORES[f.key] })),
    overall: 50,
    retake: vi.fn(),
  } as unknown as StepProps["quiz"];
}

describe("grant-study StepResults", () => {
  it("shows the overall score, each factor's score and its tier insight", () => {
    render(<StepResults quiz={quiz()} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Overall: 50%");
    for (const f of FACTORS) {
      expect(screen.getByText(`${SCORES[f.key]}%`)).toBeInTheDocument();
      expect(screen.getByText(getFactorInsight(f.key, SCORES[f.key]))).toBeInTheDocument();
    }
  });

  it("names the highest factor as the strength and the lowest as the growth edge, and saves that", () => {
    render(<StepResults quiz={quiz()} />);
    expect(screen.getByText("Your Strength").nextElementSibling).toHaveTextContent("Adaptive Coping");
    expect(screen.getByText("Your Growth Edge").nextElementSibling).toHaveTextContent("Physical Vitality");
    expect(recordFinish).toHaveBeenCalledWith({
      assessment: "grant-study",
      summary: "Overall: 50%; Strength: Adaptive Coping; Growth edge: Physical Vitality",
      score: 50,
    });
  });

  it("Retake calls retake", async () => {
    const q = quiz();
    const user = userEvent.setup();
    render(<StepResults quiz={q} />);
    await user.click(screen.getByRole("button", { name: /retake assessment/i }));
    expect(q.retake).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /explore all assessments/i })).toHaveAttribute("href", "/find-your-me");
  });
});
