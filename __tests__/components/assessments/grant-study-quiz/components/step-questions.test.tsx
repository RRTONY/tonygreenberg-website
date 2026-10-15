import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepQuestions } from "@/components/assessments/grant-study-quiz/components/step-questions";
import { FACTORS, QUESTIONS } from "@/components/assessments/grant-study-quiz/data/grant-study.data";
import type { StepProps } from "@/components/assessments/grant-study-quiz/grant-study-quiz";

function makeQuiz(current: number, answers: Record<number, number> = {}) {
  const question = QUESTIONS[current];
  return {
    state: { step: 1, current, answers },
    question,
    factor: FACTORS.find((f) => f.key === question.factor)!,
    isLast: current === QUESTIONS.length - 1,
    select: vi.fn(),
    next: vi.fn(),
    prev: vi.fn(),
  } as unknown as StepProps["quiz"];
}

describe("grant-study StepQuestions", () => {
  it("shows the title block on question 1 only", () => {
    const { unmount } = render(<StepQuestions quiz={makeQuiz(0)} />);
    expect(screen.getByText("Based on 85 Years of Harvard Research")).toBeInTheDocument();
    unmount();
    render(<StepQuestions quiz={makeQuiz(3)} />);
    expect(screen.queryByText("Based on 85 Years of Harvard Research")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("sr-only");
  });

  it("shows the factor, the question and all options; Next is disabled until something is chosen", () => {
    render(<StepQuestions quiz={makeQuiz(5)} />);
    expect(screen.getByText("Adaptive Coping")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: QUESTIONS[5].text })).toBeInTheDocument();
    for (const o of QUESTIONS[5].options) expect(screen.getByRole("button", { name: o.text })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^next/i })).toBeDisabled();
  });

  it("calls select with the option's score and enables Next once answered", async () => {
    const quiz = makeQuiz(1);
    const user = userEvent.setup();
    const { rerender } = render(<StepQuestions quiz={quiz} />);
    const opt = QUESTIONS[1].options[3];
    await user.click(screen.getByRole("button", { name: opt.text }));
    expect(quiz.select).toHaveBeenCalledWith(opt.score);
    const answered = makeQuiz(1, { [QUESTIONS[1].id]: opt.score });
    rerender(<StepQuestions quiz={answered} />);
    await user.click(screen.getByRole("button", { name: /^next/i }));
    expect(answered.next).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(answered.prev).toHaveBeenCalled();
  });

  it("labels the last button 'See My Profile'", () => {
    render(<StepQuestions quiz={makeQuiz(QUESTIONS.length - 1)} />);
    expect(screen.getByRole("button", { name: /see my profile/i })).toBeInTheDocument();
  });
});
