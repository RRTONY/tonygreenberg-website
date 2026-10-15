import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepQuestions } from "@/components/assessments/dharma-finder-quiz/components/step-questions";
import { ALL_QUESTIONS, SECTIONS, TOTAL } from "@/components/assessments/dharma-finder-quiz/data/dharma-finder.data";
import type { StepProps } from "@/components/assessments/dharma-finder-quiz/dharma-finder-quiz";

function makeQuiz(over: Partial<StepProps["quiz"]> & { current?: number; answers?: Record<number, string> } = {}) {
  const current = over.current ?? 0;
  return {
    state: { step: 1, current, answers: over.answers ?? {}, interstitial: 0 },
    question: ALL_QUESTIONS[current],
    section: 0,
    isFirstInSection: true,
    isLast: false,
    progress: 4,
    profile: { archetypes: [], coreValues: [], completionDepth: 0, totalAnswered: 0 },
    answer: vi.fn(),
    next: vi.fn(),
    prev: vi.fn(),
    unlock: vi.fn(),
    retake: vi.fn(),
    ...over,
  } as StepProps["quiz"];
}

describe("dharma StepQuestions", () => {
  it("shows the part header on a part's first question and the question count", () => {
    render(<StepQuestions quiz={makeQuiz()} />);
    expect(screen.getByText(`Part 1 of ${SECTIONS.length} · ${SECTIONS[0].title}`)).toBeInTheDocument();
    expect(screen.getByText(`Question 1 of ${TOTAL}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dharma Finder");
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("hides the part header mid-part and shows the saved answer", () => {
    render(<StepQuestions quiz={makeQuiz({ current: 3, isFirstInSection: false, answers: { 4: "draw" } })} />);
    expect(screen.queryByText(/Part 1 of/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(ALL_QUESTIONS[3].text)).toHaveValue("draw");
  });

  it("calls answer, next and prev", async () => {
    const quiz = makeQuiz({ current: 2, isFirstInSection: false });
    const user = userEvent.setup();
    render(<StepQuestions quiz={quiz} />);
    await user.type(screen.getByRole("textbox"), "x");
    expect(quiz.answer).toHaveBeenCalledWith("x");
    await user.click(screen.getByRole("button", { name: /^next/i }));
    expect(quiz.next).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(quiz.prev).toHaveBeenCalled();
  });

  it("labels the last button 'See My Dharma Profile'", () => {
    render(<StepQuestions quiz={makeQuiz({ current: 24, isLast: true })} />);
    expect(screen.getByRole("button", { name: /see my dharma profile/i })).toBeInTheDocument();
  });
});
