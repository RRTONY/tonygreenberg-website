import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepResults } from "@/components/soulsmoke/pages/scent-finder/components/step-results";
import { agaveDatabase, scentFinderData } from "@/components/soulsmoke/pages/scent-finder/data/scent-finder.data";
import type { ScentFinderStepProps } from "@/components/soulsmoke/pages/scent-finder/scent-finder";

function makeFinder(selectedNotes: string[], matches = agaveDatabase.slice(0, 2)): ScentFinderStepProps["finder"] {
  return {
    state: { step: 2, selectedNotes, matches },
    copy: scentFinderData.en,
    onNext: vi.fn(),
    toggleNote: vi.fn(),
    findMatches: vi.fn(),
    reset: vi.fn(),
    isSelected: (n: string) => selectedNotes.includes(n),
  };
}

describe("StepResults", () => {
  it("shows each match with its image, rank and highlighted notes", () => {
    render(<StepResults finder={makeFinder(["Citrus"])} />);
    expect(screen.getByRole("heading", { level: 3, name: "Espadín" })).toBeInTheDocument();
    expect(screen.getByText("MATCH #2")).toBeInTheDocument();
    expect(screen.getByAltText(agaveDatabase[0].image.alt)).toBeInTheDocument();
    expect(screen.getAllByText("Citrus")[1]).toHaveClass("bg-lime-500");
    expect(screen.getAllByText("Green Apple")[0]).toHaveClass("bg-muted");
  });

  it("says so when nothing matched", () => {
    render(<StepResults finder={makeFinder(["Pineapple"], [])} />);
    expect(screen.getByText("No matches found. Try selecting different notes!")).toBeInTheDocument();
  });
});
