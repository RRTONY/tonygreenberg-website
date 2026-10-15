import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepQuestions } from "@/components/brewsoul/brewsoul-quiz/components/step-questions";
import { QUESTIONS, quizData } from "@/components/brewsoul/brewsoul-quiz/data/brewsoul-quiz.data";
import type { useBrewSoulQuiz } from "@/components/brewsoul/brewsoul-quiz/hook/use-brewsoul-quiz";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";

function fakeQuiz(questionIndex: number, visible = true) {
  return {
    state: { step: 1, questionIndex, answers: {}, visible },
    updateState: vi.fn(),
    onNext: vi.fn(),
    answer: vi.fn(),
    back: vi.fn(),
    reset: vi.fn(),
    progress: 0,
  } satisfies ReturnType<typeof useBrewSoulQuiz>;
}

describe("StepQuestions", () => {
  it("shows the intro, the H1 and question 1 with no Back button", () => {
    render(<StepQuestions quiz={fakeQuiz(0)} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Seven questions.Your perfect cup, decoded.");
    expect(screen.getByText(quizData.intro.body(BREWSOUL_COFFEES.length))).toBeInTheDocument();
    expect(screen.getByText(`1 / ${QUESTIONS.length}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(QUESTIONS[0].q);
    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
  });

  it("sends the chosen option's dimension and score to the hook", async () => {
    const quiz = fakeQuiz(1);
    const user = userEvent.setup();
    render(<StepQuestions quiz={quiz} />);
    const opt = QUESTIONS[1].opts[2];
    await user.click(screen.getByRole("button", { name: opt.text }));
    expect(quiz.answer).toHaveBeenCalledWith(QUESTIONS[1].dim, opt.score);
  });

  it("offers Back after the first question and a skip link to the catalog", async () => {
    const quiz = fakeQuiz(3);
    const user = userEvent.setup();
    render(<StepQuestions quiz={quiz} />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(quiz.back).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: quizData.skip })).toHaveAttribute("href", "/brewsoul/browse");
  });

  it("hides the question while it fades", () => {
    const { container } = render(<StepQuestions quiz={fakeQuiz(2, false)} />);
    expect(container.querySelector(".opacity-0")).not.toBeNull();
  });
});
