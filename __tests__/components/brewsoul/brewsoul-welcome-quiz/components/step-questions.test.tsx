import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepQuestions } from "@/components/brewsoul/brewsoul-welcome-quiz/components/step-questions";
import { IDENTITY_KEY, type useBrewSoulWelcomeQuiz, type WelcomeQuizState } from "@/components/brewsoul/brewsoul-welcome-quiz/hook/use-brewsoul-welcome-quiz";
import { PALATE_QUESTIONS, SCREENS, WEIRDNESS_LINES, welcomeQuizData } from "@/components/brewsoul/brewsoul-welcome-quiz/data/brewsoul-welcome-quiz.data";
import { navigation } from "../../../../helpers/next";

function fakeQuiz(state: Partial<WelcomeQuizState> = {}, palateComplete = false) {
  return {
    state: { step: 1, screen: 0, answers: {}, palate: {}, multi: [], weirdness: 5, identity: null, visible: true, ...state },
    palateComplete,
    choose: vi.fn(),
    toggleMulti: vi.fn(),
    continueMulti: vi.fn(),
    setPalate: vi.fn(),
    continuePalate: vi.fn(),
    setWeirdness: vi.fn(),
    continueSlider: vi.fn(),
    retake: vi.fn(),
    progress: 0,
  } satisfies ReturnType<typeof useBrewSoulWelcomeQuiz>;
}

describe("Welcome StepQuestions", () => {
  it("shows the intro H1 and the first question's options on screen 1", async () => {
    const quiz = fakeQuiz();
    const user = userEvent.setup();
    render(<StepQuestions quiz={quiz} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(welcomeQuizData.intro.titleLine1);
    expect(screen.getByText(`1 / ${SCREENS.length}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: SCREENS[0].opts[1].text }));
    expect(quiz.choose).toHaveBeenCalledWith(SCREENS[0].opts[1].tag);
  });

  it("the palate screen sets each answer and only enables Continue when complete", async () => {
    const user = userEvent.setup();
    const quiz = fakeQuiz({ screen: 4, palate: { acid: "Love it" } });
    const { unmount } = render(<StepQuestions quiz={quiz} />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Love it" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: PALATE_QUESTIONS[1].options[2] }));
    expect(quiz.setPalate).toHaveBeenCalledWith(PALATE_QUESTIONS[1].dim, PALATE_QUESTIONS[1].options[2]);
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    unmount();
    const done = fakeQuiz({ screen: 4 }, true);
    render(<StepQuestions quiz={done} />);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(done.continuePalate).toHaveBeenCalled();
  });

  it("the multi-select screen toggles options and needs at least one", async () => {
    const user = userEvent.setup();
    const quiz = fakeQuiz({ screen: 5, multi: ["rare"] });
    render(<StepQuestions quiz={quiz} />);
    const rare = SCREENS[5].opts.find((o) => o.tag === "rare")!;
    expect(screen.getByRole("button", { name: rare.text })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: SCREENS[5].opts[0].text }));
    expect(quiz.toggleMulti).toHaveBeenCalledWith(SCREENS[5].opts[0].tag);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(quiz.continueMulti).toHaveBeenCalled();
  });

  it("the weirdness slider shows the matching line and reports changes", async () => {
    const user = userEvent.setup();
    const quiz = fakeQuiz({ screen: 6, weirdness: 9 });
    render(<StepQuestions quiz={quiz} />);
    expect(screen.getByText(WEIRDNESS_LINES[9])).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(welcomeQuizData.sliderLabel), { target: { value: "3" } });
    expect(quiz.setWeirdness).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(quiz.continueSlider).toHaveBeenCalled();
  });

  it("Skip saves the beginner identity and goes straight to BrewSoul home", async () => {
    const user = userEvent.setup();
    render(<StepQuestions quiz={fakeQuiz()} />);
    await user.click(screen.getByRole("button", { name: welcomeQuizData.skip }));
    expect(localStorage.getItem(IDENTITY_KEY)).toBe("the-awakening");
    expect(navigation.router.push).toHaveBeenCalledWith("/brewsoul/home");
  });
});
