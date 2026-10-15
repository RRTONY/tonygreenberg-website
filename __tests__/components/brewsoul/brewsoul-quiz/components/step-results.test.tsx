import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepResults } from "@/components/brewsoul/brewsoul-quiz/components/step-results";
import type { useBrewSoulQuiz } from "@/components/brewsoul/brewsoul-quiz/hook/use-brewsoul-quiz";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { saveAssessmentResult } from "@/lib/assessments/result-log";
import type { CatalogItem } from "@/lib/intelligence-engine/types";

vi.mock("@/lib/assessments/result-log", () => ({ saveAssessmentResult: vi.fn() }));

function fakeQuiz(answers: Record<string, number>) {
  return {
    state: { step: 2, questionIndex: 6, answers, visible: true },
    updateState: vi.fn(),
    onNext: vi.fn(),
    answer: vi.fn(),
    back: vi.fn(),
    reset: vi.fn(),
    progress: 100,
  } satisfies ReturnType<typeof useBrewSoulQuiz>;
}

// Same scoring as the step, written out independently.
function expectedMatch(c: CatalogItem, p: Record<string, number>) {
  let s = 0;
  for (const d of ["acidity", "body", "sweetness", "complexity", "fruitiness"]) {
    if (p[d] != null && c.flavorProfile[d] != null) s += Math.max(0, 10 - Math.abs(p[d] - c.flavorProfile[d]));
  }
  if (p.budget && c.priceUsd <= p.budget) s += 5;
  return s;
}

const brightFruity = { acidity: 9, body: 3, sweetness: 8, complexity: 10, fruitiness: 9, brew: 0, budget: 200 };

describe("StepResults", () => {
  it("ranks the top 8 coffees for the answers given", () => {
    render(<StepResults quiz={fakeQuiz(brightFruity)} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("We Found Your Coffees");
    const expected = [...BREWSOUL_COFFEES].sort((a, b) => expectedMatch(b, brightFruity) - expectedMatch(a, brightFruity)).slice(0, 8);
    const links = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("/brewsoul/coffee/"));
    expect(links).toHaveLength(8);
    expect(links.map((a) => a.getAttribute("href"))).toEqual(expected.map((c) => `/brewsoul/coffee/${c.id}`));
    const top = expected[0];
    expect(links[0]).toHaveTextContent(`${Math.round((expectedMatch(top, brightFruity) / 55) * 100)}% match`);
  });

  it("a perfect palate match with the budget met scores 100%", () => {
    const c = BREWSOUL_COFFEES[0];
    const fp = c.flavorProfile;
    const perfect = { acidity: fp.acidity, body: fp.body, sweetness: fp.sweetness, complexity: fp.complexity, fruitiness: fp.fruitiness, budget: 200 };
    render(<StepResults quiz={fakeQuiz(perfect)} />);
    expect(screen.getAllByText("100% match").length).toBeGreaterThan(0);
  });

  it("saves the finish with the top match", () => {
    render(<StepResults quiz={fakeQuiz(brightFruity)} />);
    const top = [...BREWSOUL_COFFEES].sort((a, b) => expectedMatch(b, brightFruity) - expectedMatch(a, brightFruity))[0];
    expect(saveAssessmentResult).toHaveBeenCalledWith("brewsoul-quiz", { summary: `Top match: ${top.name}` });
  });

  it("Retake calls reset, and Browse links to the catalog", async () => {
    const quiz = fakeQuiz(brightFruity);
    const user = userEvent.setup();
    render(<StepResults quiz={quiz} />);
    await user.click(screen.getByRole("button", { name: "Retake Quiz" }));
    expect(quiz.reset).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Browse All Coffees" })).toHaveAttribute("href", "/brewsoul/browse");
  });
});
