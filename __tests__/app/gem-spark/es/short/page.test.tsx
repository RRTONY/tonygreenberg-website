import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/gem-spark/es/short/page";
import { trackGemSparkView } from "@/app/gem-spark/actions";

vi.mock("@/app/gem-spark/actions", () => ({
  getGemSparkCounts: vi.fn(async () => ({ longForm: 1, shortForm: 2 })),
  trackGemSparkView: vi.fn(async () => {}),
}));

describe("/gem-spark/es/short", () => {
  it("uses the page's own heading and intro, with a canonical", () => {
    expect(metadata.title).toBe("El GemSpark");
    expect(metadata.description).toBe("Una nueva palabra para el momento en que el azar y el significado colisionan.");
    expect(metadata.alternates?.canonical).toBe("/gem-spark/es/short");
  });

  it("renders one H1, Sanity images with the app's alt text, and counts a short-form read", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("El GemSpark");
    for (const alt of ["Sendero Los Leones", "Arte de David Fenton"]) {
      expect(screen.getByAltText(alt).getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    }
    expect(screen.getByRole("link", { name: "Envía tu GemSpark aquí" })).toHaveAttribute("href", "/gem-spark");
    for (const link of screen.getAllByRole("link", { name: /^Tony\sGreenberg$/ })) expect(link).toHaveAttribute("href", "/");
    expect(document.body.innerHTML).not.toMatch(/manus/i);
    expect(trackGemSparkView).toHaveBeenCalledWith("short-form");
    expect(document.querySelector('[lang="es"]')).not.toBeNull();
    // Like the app, the Spanish version has no newsletter popup.
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
