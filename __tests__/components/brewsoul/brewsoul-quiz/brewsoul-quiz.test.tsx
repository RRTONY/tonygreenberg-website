import { describe, expect, it, vi } from "vitest";
import { configure, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrewSoulQuiz } from "@/components/brewsoul/brewsoul-quiz/brewsoul-quiz";
import { QUESTIONS } from "@/components/brewsoul/brewsoul-quiz/data/brewsoul-quiz.data";
import { saveAssessmentResult } from "@/lib/assessments/result-log";
import { navigation } from "../../../helpers/next";

vi.mock("@/lib/assessments/result-log", () => ({ saveAssessmentResult: vi.fn() }));

const progressWidth = (c: HTMLElement) => (c.querySelector("[style]") as HTMLElement).style.width;

// Each answer fades for ~300ms; give findBy* room when the machine is busy.
configure({ asyncUtilTimeout: 5000 });

describe("BrewSoulQuiz (end to end)", () => {
  it("marks the quiz visited and starts at 0% progress", () => {
    navigation.pathname = "/brewsoul/quiz";
    const { container } = render(<BrewSoulQuiz />);
    expect(localStorage.getItem("brewsoul-visited-quiz")).toBe("1");
    expect(progressWidth(container)).toBe("0%");
    expect(screen.getByRole("link", { name: "Taste Quiz" })).toHaveAttribute("aria-current", "step");
  });

  it("walks all seven questions to the results, then Retake starts over", async () => {
    navigation.pathname = "/brewsoul/quiz";
    const user = userEvent.setup();
    const { container } = render(<BrewSoulQuiz />);
    for (let i = 0; i < QUESTIONS.length; i++) {
      expect(await screen.findByText(`${i + 1} / ${QUESTIONS.length}`)).toBeInTheDocument();
      expect(progressWidth(container)).toBe(`${(i / QUESTIONS.length) * 100}%`);
      await user.click(await screen.findByRole("button", { name: QUESTIONS[i].opts[0].text }));
    }
    expect(await screen.findByRole("heading", { level: 1, name: "We Found Your Coffees" })).toBeInTheDocument();
    expect(progressWidth(container)).toBe("100%");
    expect(saveAssessmentResult).toHaveBeenCalledWith("brewsoul-quiz", expect.objectContaining({ summary: expect.stringMatching(/^Top match: /) }));
    await user.click(screen.getByRole("button", { name: "Retake Quiz" }));
    expect(screen.getByText(`1 / ${QUESTIONS.length}`)).toBeInTheDocument();
  }, 60000);

  it("Back returns to the previous question", async () => {
    const user = userEvent.setup();
    render(<BrewSoulQuiz />);
    await user.click(screen.getByRole("button", { name: QUESTIONS[0].opts[1].text }));
    expect(await screen.findByText(`2 / ${QUESTIONS.length}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(await screen.findByText(`1 / ${QUESTIONS.length}`)).toBeInTheDocument();
  });
});
