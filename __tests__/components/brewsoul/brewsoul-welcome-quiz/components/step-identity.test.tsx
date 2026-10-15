import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepIdentity } from "@/components/brewsoul/brewsoul-welcome-quiz/components/step-identity";
import type { useBrewSoulWelcomeQuiz } from "@/components/brewsoul/brewsoul-welcome-quiz/hook/use-brewsoul-welcome-quiz";
import { IDENTITIES } from "@/components/brewsoul/brewsoul-welcome-quiz/data/brewsoul-welcome-quiz.data";
import { saveAssessmentResult } from "@/lib/assessments/result-log";
import { navigation } from "../../../../helpers/next";

vi.mock("@/lib/assessments/result-log", () => ({ saveAssessmentResult: vi.fn() }));

function fakeQuiz(identity: (typeof IDENTITIES)[number] | null) {
  return {
    state: { step: 2, screen: 7, answers: {}, palate: {}, multi: [], weirdness: 5, identity, visible: true },
    palateComplete: false,
    choose: vi.fn(),
    toggleMulti: vi.fn(),
    continueMulti: vi.fn(),
    setPalate: vi.fn(),
    continuePalate: vi.fn(),
    setWeirdness: vi.fn(),
    continueSlider: vi.fn(),
    retake: vi.fn(),
    progress: 100,
  } satisfies ReturnType<typeof useBrewSoulWelcomeQuiz>;
}

const impact = IDENTITIES.find((i) => i.id === "impact-alchemist")!;

describe("StepIdentity", () => {
  it("renders nothing until an identity exists", () => {
    const { container } = render(<StepIdentity quiz={fakeQuiz(null)} />);
    expect(container).toBeEmptyDOMElement();
    expect(saveAssessmentResult).not.toHaveBeenCalled();
  });

  it("shows the identity as the H1 with its path and starter gear", () => {
    render(<StepIdentity quiz={fakeQuiz(impact)} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Impact Alchemist");
    expect(screen.getByText(impact.desc)).toBeInTheDocument();
    for (const p of impact.path) expect(screen.getByText(p)).toBeInTheDocument();
    for (const g of impact.gear) expect(screen.getByText(g.name).nextElementSibling).toHaveTextContent(g.price);
  });

  it("saves the finish with the identity name", () => {
    render(<StepIdentity quiz={fakeQuiz(impact)} />);
    expect(saveAssessmentResult).toHaveBeenCalledWith("brewsoul", { summary: "The Impact Alchemist" });
  });

  it("sends the visitor on to BrewSoul or the taste quiz, or lets them retake", async () => {
    const quiz = fakeQuiz(impact);
    const user = userEvent.setup();
    render(<StepIdentity quiz={quiz} />);
    await user.click(screen.getByRole("button", { name: "Enter BrewSoul" }));
    expect(navigation.router.push).toHaveBeenCalledWith("/brewsoul/home");
    await user.click(screen.getByRole("button", { name: "Or: Take the Taste Quiz" }));
    expect(navigation.router.push).toHaveBeenCalledWith("/brewsoul/quiz");
    await user.click(screen.getByRole("button", { name: "Retake assessment" }));
    expect(quiz.retake).toHaveBeenCalled();
  });
});
