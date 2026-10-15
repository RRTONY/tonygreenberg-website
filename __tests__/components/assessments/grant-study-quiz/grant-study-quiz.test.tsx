import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GrantStudyQuiz } from "@/components/assessments/grant-study-quiz/grant-study-quiz";
import { FACTORS, QUESTIONS, getFactorScore } from "@/components/assessments/grant-study-quiz/data/grant-study.data";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

// Highest option for relationships, lowest for coping, first-but-one elsewhere.
function pick(q: (typeof QUESTIONS)[number]) {
  const sorted = [...q.options].sort((a, b) => a.score - b.score);
  if (q.factor === "relationships") return sorted[sorted.length - 1];
  if (q.factor === "coping") return sorted[0];
  return sorted[2];
}

describe("GrantStudyQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  it("answers all 25 questions and shows the overall score, strength and growth edge", async () => {
    const user = userEvent.setup();
    render(<GrantStudyQuiz />);
    const answers: Record<number, number> = {};
    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i];
      expect(screen.getByText(`Question ${i + 1} of ${QUESTIONS.length}`)).toBeInTheDocument();
      const next = screen.getByRole("button", { name: i === QUESTIONS.length - 1 ? /see my profile/i : /^next/i });
      expect(next).toBeDisabled();
      const opt = pick(q);
      answers[q.id] = opt.score;
      await user.click(screen.getByRole("button", { name: opt.text }));
      expect(screen.getByRole("button", { name: opt.text })).toHaveAttribute("aria-pressed", "true");
      await user.click(next);
    }
    await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
    await user.click(screen.getByRole("button", { name: /get my results/i }));

    const scores = FACTORS.map((f) => getFactorScore(answers, f.key));
    const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    expect(await screen.findByRole("heading", { level: 1, name: `Overall: ${overall}%` })).toBeInTheDocument();
    expect(screen.getByText("Your Strength").nextElementSibling).toHaveTextContent("Warm Relationships");
    expect(screen.getByText("Your Growth Edge").nextElementSibling).toHaveTextContent("Adaptive Coping");
    expect(recordFinish).toHaveBeenCalledWith(
      expect.objectContaining({ assessment: "grant-study", score: overall, summary: `Overall: ${overall}%; Strength: Warm Relationships; Growth edge: Adaptive Coping` }),
    );
  });

  it("Previous keeps the earlier choice selected", async () => {
    const user = userEvent.setup();
    render(<GrantStudyQuiz />);
    const opt = QUESTIONS[0].options[1];
    await user.click(screen.getByRole("button", { name: opt.text }));
    await user.click(screen.getByRole("button", { name: /^next/i }));
    expect(screen.getByText(`Question 2 of ${QUESTIONS.length}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByRole("button", { name: opt.text })).toHaveAttribute("aria-pressed", "true");
  });
});
