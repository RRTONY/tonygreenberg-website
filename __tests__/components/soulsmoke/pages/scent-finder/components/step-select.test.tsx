import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepSelect } from "@/components/soulsmoke/pages/scent-finder/components/step-select";
import { scentFinderData } from "@/components/soulsmoke/pages/scent-finder/data/scent-finder.data";
import type { ScentFinderStepProps } from "@/components/soulsmoke/pages/scent-finder/scent-finder";

function makeFinder(selectedNotes: string[]): ScentFinderStepProps["finder"] {
  return {
    state: { step: 1, selectedNotes, matches: [] },
    copy: scentFinderData.en,
    onNext: vi.fn(),
    toggleNote: vi.fn(),
    findMatches: vi.fn(),
    reset: vi.fn(),
    isSelected: (n: string) => selectedNotes.includes(n),
  };
}

describe("StepSelect", () => {
  it("shows the five categories and disables Find with nothing selected", () => {
    render(<StepSelect finder={makeFinder([])} />);
    for (const c of ["fruit", "earth", "floral", "spice", "smoke"]) {
      expect(screen.getByRole("heading", { level: 3, name: c })).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: /Find My Agave/ })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clear Selection" })).not.toBeInTheDocument();
  });

  it("marks selected notes in their color and wires the buttons", async () => {
    const user = userEvent.setup();
    const finder = makeFinder(["Citrus"]);
    render(<StepSelect finder={finder} />);
    const citrus = screen.getByRole("button", { name: "Citrus" });
    expect(citrus).toHaveAttribute("aria-pressed", "true");
    expect(citrus).toHaveClass("bg-yellow-400");
    await user.click(screen.getByRole("button", { name: "Pine" }));
    expect(finder.toggleNote).toHaveBeenCalledWith("Pine");
    await user.click(screen.getByRole("button", { name: /Find My Agave \(1 notes selected\)/ }));
    expect(finder.findMatches).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Clear Selection" }));
    expect(finder.reset).toHaveBeenCalled();
  });
});
