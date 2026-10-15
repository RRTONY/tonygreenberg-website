import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepIntro } from "@/components/assessments/the-mirror-quiz/components/step-intro";
import { MIRROR_DIMENSIONS } from "@/lib/content/mirror-data";
import type { StepProps } from "@/components/assessments/the-mirror-quiz/the-mirror-quiz";

describe("mirror StepIntro", () => {
  it("lists all six dimensions with their flow and friction lines", () => {
    render(<StepIntro quiz={{ begin: vi.fn() } as unknown as StepProps["quiz"]} articleTitles={{}} />);
    for (const d of MIRROR_DIMENSIONS) {
      expect(screen.getByRole("heading", { level: 3, name: d.name })).toBeInTheDocument();
      expect(screen.getByText(`Flow: ${d.flowState}`)).toBeInTheDocument();
      expect(screen.getByText(`Friction: ${d.frictionState}`)).toBeInTheDocument();
    }
  });

  it("renders pill links (external opens a new tab) and plain labels", () => {
    render(<StepIntro quiz={{ begin: vi.fn() } as unknown as StepProps["quiz"]} articleTitles={{}} />);
    expect(screen.getByRole("link", { name: "Human OS" })).toHaveAttribute("href", "/humanos");
    expect(screen.getByRole("link", { name: "Flow Circuit" })).toHaveAttribute("target", "_blank");
    expect(screen.getByText("Sacred Waters").tagName).toBe("SPAN");
  });

  it("both buttons start the questions", async () => {
    const quiz = { begin: vi.fn() } as unknown as StepProps["quiz"];
    const user = userEvent.setup();
    render(<StepIntro quiz={quiz} articleTitles={{}} />);
    await user.click(screen.getByRole("button", { name: /begin the mirror/i }));
    await user.click(screen.getByRole("button", { name: /take the assessment/i }));
    expect(quiz.begin).toHaveBeenCalledTimes(2);
  });
});
