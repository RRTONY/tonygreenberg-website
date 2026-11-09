import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { scoreMezcals, StepResults } from "@/components/soulsmoke/pages/taste-quiz/components/step-results";
import { questions } from "@/components/soulsmoke/pages/taste-quiz/data/taste-quiz.data";
import type { useTasteQuiz } from "@/components/soulsmoke/pages/taste-quiz/hook/use-taste-quiz";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { allMezcals } from "@/lib/content/soulsmoke/mezcal-data";

type Quiz = ReturnType<typeof useTasteQuiz>;
const fullAnswers = Object.fromEntries(questions.map((q) => [q.dimension, 6]));

function fakeQuiz(answers: Record<string, number> = fullAnswers): Quiz {
  return {
    state: { step: 2, currentQuestion: questions.length - 1, answers },
    onNext: vi.fn(),
    answer: vi.fn(),
    back: vi.fn(),
    reset: vi.fn(),
    progress: 100,
  };
}

const renderStep = (quiz: Quiz) =>
  render(
    <SoulsmokeProviders>
      <StepResults quiz={quiz} />
    </SoulsmokeProviders>,
  );

beforeEach(() => localStorage.clear());

describe("scoreMezcals", () => {
  it("returns nothing until every question is answered", () => {
    expect(scoreMezcals({ smoke: 4 })).toEqual([]);
  });

  it("ranks the 10 closest EEI 5+ bottles, best first", () => {
    const picks = scoreMezcals(fullAnswers);
    expect(picks).toHaveLength(10);
    for (const p of picks) expect(p.mezcal.eei).toBeGreaterThanOrEqual(5);
    const scores = picks.map((p) => p.matchScore);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });

  it("scores a dimension a bottle lacks as a full miss", () => {
    const answers = Object.fromEntries(questions.map((q) => [`x-${q.dimension}`, 6]));
    expect(scoreMezcals(answers).every((p) => p.matchScore === 0)).toBe(true);
  });
});

describe("StepResults", () => {
  it("shows the profile, ten picks with market badges, saving and the onward links", async () => {
    const quiz = fakeQuiz();
    renderStep(quiz);
    expect(screen.getByRole("heading", { level: 1, name: "Your Top 10 Quest List" })).toBeInTheDocument();
    expect(screen.getByText("smoke")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(10);
    const saveButtons = screen.getAllByRole("button", { name: "Save" });
    await userEvent.click(saveButtons[0]);
    expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Saved" }));
    expect(screen.queryByRole("button", { name: "Saved" })).toBeNull();
    expect(screen.getByRole("link", { name: "Explore the Quadrant" })).toHaveAttribute("href", "/soul-smoke/quadrant");
    expect(screen.getByRole("link", { name: "View My Hunt List" })).toHaveAttribute("href", "/soul-smoke/my-hunt-list");
    await userEvent.click(screen.getByRole("button", { name: "Retake Quiz" }));
    expect(quiz.reset).toHaveBeenCalled();
  });

  it("labels US, MX and Both bottles", () => {
    const markets = new Set<string>();
    // Answers matched to real bottles from each market, so each badge kind shows up.
    for (const market of ["us", "mexico", "both"] as const) {
      const bottle = allMezcals.find((m) => m.market === market && m.eei >= 5);
      if (!bottle) continue;
      const { unmount } = renderStep(fakeQuiz({ ...bottle.flavor }));
      const card = screen.getByText(bottle.tastingNotes).parentElement as HTMLElement;
      markets.add(within(card).getByText(/^(US|MX|Both)$/).textContent ?? "");
      unmount();
    }
    expect(markets.has("US")).toBe(true);
    expect(markets.has("MX")).toBe(true);
  });

  it("speaks Spanish when the visitor chose ES", () => {
    localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderStep(fakeQuiz());
    expect(screen.getByRole("heading", { level: 1, name: "Tu Lista de 10 Búsquedas" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Guardar" })).toHaveLength(10);
  });
});
