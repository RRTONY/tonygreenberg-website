import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepQuestions } from "@/components/assessments/the-mirror-quiz/components/step-questions";
import { MIRROR_DIMENSIONS, MIRROR_QUESTIONS } from "@/lib/content/mirror-data";
import type { StepProps } from "@/components/assessments/the-mirror-quiz/the-mirror-quiz";

function quiz(current: number, selected: number | null = null) {
  return {
    state: { step: 2, current, answers: {}, selected },
    answer: vi.fn(),
    back: vi.fn(),
    exit: vi.fn(),
  } as unknown as StepProps["quiz"];
}

describe("mirror StepQuestions", () => {
  it("shows the dimension, position within it and overall count", () => {
    render(<StepQuestions quiz={quiz(1)} articleTitles={{}} />);
    const q = MIRROR_QUESTIONS[1];
    const dim = MIRROR_DIMENSIONS.find((d) => d.id === q.dimension)!;
    const within = MIRROR_QUESTIONS.slice(0, 2).filter((x) => x.dimension === q.dimension).length;
    expect(screen.getByText(`${dim.name} · Question ${within} of 3 · 2 / ${MIRROR_QUESTIONS.length}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: q.stem })).toBeInTheDocument();
  });

  it("calls answer with the option index, back and exit", async () => {
    const q = quiz(2);
    const user = userEvent.setup();
    render(<StepQuestions quiz={q} articleTitles={{}} />);
    await user.click(screen.getByRole("button", { name: MIRROR_QUESTIONS[2].options[1].text }));
    expect(q.answer).toHaveBeenCalledWith(1);
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(q.back).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /exit/i }));
    expect(q.exit).toHaveBeenCalled();
  });

  it("hides Previous on question 1 and disables options while one is highlighted", () => {
    render(<StepQuestions quiz={quiz(0, 2)} articleTitles={{}} />);
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument();
    for (const o of MIRROR_QUESTIONS[0].options) expect(screen.getByRole("button", { name: o.text })).toBeDisabled();
  });
});
