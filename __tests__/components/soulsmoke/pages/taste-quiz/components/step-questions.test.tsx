import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepQuestions } from "@/components/soulsmoke/pages/taste-quiz/components/step-questions";
import { questions } from "@/components/soulsmoke/pages/taste-quiz/data/taste-quiz.data";
import type { useTasteQuiz } from "@/components/soulsmoke/pages/taste-quiz/hook/use-taste-quiz";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

type Quiz = ReturnType<typeof useTasteQuiz>;

function fakeQuiz(state: Partial<Quiz["state"]> = {}): Quiz {
  return {
    state: { step: 1, currentQuestion: 0, answers: {}, ...state },
    onNext: vi.fn(),
    answer: vi.fn(),
    back: vi.fn(),
    reset: vi.fn(),
    progress: 12.5,
  };
}

const renderStep = (quiz: Quiz) =>
  render(
    <SoulsmokeProviders>
      <StepQuestions quiz={quiz} />
    </SoulsmokeProviders>,
  );

beforeEach(() => localStorage.clear());

describe("StepQuestions", () => {
  it("shows the first question with Back disabled, links to the quadrant, and answers on click", async () => {
    const quiz = fakeQuiz();
    const { container } = renderStep(quiz);
    expect(screen.getByRole("heading", { level: 1, name: questions[0].question })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skip to Quadrant" })).toHaveAttribute("href", "/soul-smoke/quadrant");
    expect(screen.getByRole("link", { name: "MEZCAL" })).toHaveAttribute("href", "/soul-smoke");
    expect((container.querySelector("[style]") as HTMLElement).style.width).toBe("12.5%");
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /Burn it down/ }));
    expect(quiz.answer).toHaveBeenCalledWith("smoke", 10);
  });

  it("marks the chosen option, enables Back, and offers results once every answer is in", async () => {
    const answers = Object.fromEntries(questions.map((q) => [q.dimension, 4]));
    const quiz = fakeQuiz({ currentQuestion: questions.length - 1, answers });
    renderStep(quiz);
    expect(screen.getByRole("button", { name: /Straightforward/ })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(quiz.back).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "See My Recommendations" }));
    expect(quiz.onNext).toHaveBeenCalledWith(2);
  });

  it("speaks Spanish when the visitor chose ES", () => {
    localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderStep(fakeQuiz());
    expect(screen.getByRole("heading", { level: 1, name: questions[0].questionEs })).toBeInTheDocument();
    expect(screen.getByText(questions[0].subtextEs)).toBeInTheDocument();
    expect(screen.getByText(questions[0].options[0].descriptionEs)).toBeInTheDocument();
    expect(screen.getByText("Pregunta 1 de 8")).toBeInTheDocument();
  });
});
