import { describe, expect, it, vi } from "vitest";
import { configure, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrewSoulWelcomeQuiz } from "@/components/brewsoul/brewsoul-welcome-quiz/brewsoul-welcome-quiz";
import { IDENTITY_KEY } from "@/components/brewsoul/brewsoul-welcome-quiz/hook/use-brewsoul-welcome-quiz";
import { PALATE_QUESTIONS, SCREENS } from "@/components/brewsoul/brewsoul-welcome-quiz/data/brewsoul-welcome-quiz.data";
import { saveAssessmentResult } from "@/lib/assessments/result-log";
import { navigation } from "../../../helpers/next";

vi.mock("@/lib/assessments/result-log", () => ({ saveAssessmentResult: vi.fn() }));

const opt = (screenIdx: number, tag: string) => SCREENS[screenIdx].opts.find((o) => o.tag === tag)!.text;

// Each answer fades for ~300ms; give findBy* room when the machine is busy.
configure({ asyncUtilTimeout: 5000 });

describe("BrewSoulWelcomeQuiz (end to end)", () => {
  it("sends a returning visitor who already has an identity straight to BrewSoul home", () => {
    localStorage.setItem(IDENTITY_KEY, "terroir-purist");
    render(<BrewSoulWelcomeQuiz />);
    expect(navigation.router.push).toHaveBeenCalledWith("/brewsoul/home");
  });

  it("stays on the quiz for a first-time visitor", () => {
    render(<BrewSoulWelcomeQuiz />);
    expect(navigation.router.push).not.toHaveBeenCalled();
    expect(screen.getByText(`1 / ${SCREENS.length}`)).toBeInTheDocument();
  });

  it("walks all eight screens to the Impact Alchemist identity", async () => {
    const user = userEvent.setup();
    const { container } = render(<BrewSoulWelcomeQuiz />);
    const bar = () => (container.querySelector("[style]") as HTMLElement).style.width;
    expect(bar()).toBe("0%");

    await user.click(screen.getByRole("button", { name: opt(0, "impact") }));
    await user.click(await screen.findByRole("button", { name: opt(1, "activist") }));
    await user.click(await screen.findByRole("button", { name: opt(2, "human") }));
    await user.click(await screen.findByRole("button", { name: opt(3, "longevity") }));
    expect(await screen.findByText(`5 / ${SCREENS.length}`)).toBeInTheDocument();
    for (const pq of PALATE_QUESTIONS) await user.click(screen.getByRole("button", { name: pq.options[0] }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(await screen.findByRole("button", { name: opt(5, "transparency") }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.change(await screen.findByRole("slider"), { target: { value: "5" } });
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(await screen.findByRole("button", { name: opt(7, "purist") }));

    expect(await screen.findByRole("heading", { level: 1, name: "The Impact Alchemist" })).toBeInTheDocument();
    expect(bar()).toBe("100%");
    expect(localStorage.getItem(IDENTITY_KEY)).toBe("impact-alchemist");
    expect(saveAssessmentResult).toHaveBeenCalledWith("brewsoul", { summary: "The Impact Alchemist" });

    await user.click(screen.getByRole("button", { name: "Retake assessment" }));
    expect(screen.getByText(`1 / ${SCREENS.length}`)).toBeInTheDocument();
    expect(localStorage.getItem(IDENTITY_KEY)).toBeNull();
  }, 60000);
});
