import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/gem-spark/short/page";
import { trackGemSparkView } from "@/app/gem-spark/actions";

vi.mock("@/app/gem-spark/actions", () => ({
  getGemSparkCounts: vi.fn(async () => ({ longForm: 1, shortForm: 2 })),
  trackGemSparkView: vi.fn(async () => {}),
}));

describe("/gem-spark/short", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("The GemSpark (Short Version)");
    expect(metadata.description).toBe("A new word for the moment chance and meaning collide.");
    expect(metadata.alternates?.canonical).toBe("/gem-spark/short");
  });

  it("renders one H1, Sanity images with the app's alt text, and counts a short-form read", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The GemSpark");
    for (const alt of ["Los Leones Trail", "Art by David Fenton"]) {
      expect(screen.getByAltText(alt).getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    }
    expect(screen.getByRole("link", { name: "Submit your GemSpark here" })).toHaveAttribute("href", "/gem-spark");
    for (const link of screen.getAllByRole("link", { name: /^Tony\sGreenberg$/ })) expect(link).toHaveAttribute("href", "/");
    expect(document.body.innerHTML).not.toMatch(/manus/i);
    expect(trackGemSparkView).toHaveBeenCalledWith("short-form");
  });
});
