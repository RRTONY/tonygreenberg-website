import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TapWater } from "@/components/aqueous/pages/tap-water/tap-water";
import { surveyQuestions } from "@/components/aqueous/pages/tap-water/data/tap-water.data";

vi.mock("@/components/aqueous/share-button", () => ({ FloatingShare: () => null }));

describe("StepSurvey", () => {
  it("walks the ten questions with a slider, progress bar and card swap", async () => {
    vi.useFakeTimers();
    try {
      render(<TapWater />);
      fireEvent.click(screen.getByRole("button", { name: /Take the Water Profile Survey/ }));
      expect(screen.getByText("Help us understand your water needs")).toBeInTheDocument();
      expect(screen.getByText("Question 1 of 10")).toBeInTheDocument();
      expect(screen.getByText("10%")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

      const slider = screen.getByRole("slider", { name: surveyQuestions[0].question });
      fireEvent.change(slider, { target: { value: "10" } });
      expect(slider).toHaveValue("10");
      expect(slider.style.getPropertyValue("--fill")).toBe("100%");

      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByText("Question 2 of 10")).toBeInTheDocument();
      // The old card slides out before the next question shows.
      expect(screen.getByText(surveyQuestions[0].question).closest(".glass-card")).toHaveClass("animate-out");
      act(() => vi.advanceTimersByTime(300));
      expect(screen.getByText(surveyQuestions[1].question)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();

      for (let i = 1; i < surveyQuestions.length - 1; i++) {
        fireEvent.click(screen.getByRole("button", { name: "Next" }));
        act(() => vi.advanceTimersByTime(300));
      }
      expect(screen.getByText("100%")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "See My Results" }));
      expect(screen.getByRole("heading", { name: "Your Water Profile" })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("cancel and the back link return to the search", async () => {
    const user = userEvent.setup();
    render(<TapWater />);
    await user.click(screen.getByRole("button", { name: /Take the Water Profile Survey/ }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Take the Water Profile Survey/ }));
    await user.click(screen.getByRole("button", { name: "Back to search" }));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
