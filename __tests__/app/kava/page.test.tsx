import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/kava/page";

const MODULE_PATHS = ["/kava/origins", "/kava/interactions", "/kava/science", "/kava/assessment", "/kava/hawaii", "/kava/myths", "/kava/caffeine", "/kava/products", "/kava/certification"];

describe("/kava", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Kava — The Complete Guide");
    expect(metadata.description).toMatch(/origins, science, safety, and sourcing/);
    expect(metadata.alternates?.canonical).toBe("/kava");
  });

  it("has exactly one H1 and the Sacred Masculine Triad section", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Kava: The Threshold Essence");
    expect(screen.getByRole("heading", { level: 2, name: "The Sacred Masculine Triad" })).toBeInTheDocument();
  });

  it("links to all nine modules", () => {
    render(<Page />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    MODULE_PATHS.forEach((p) => expect(hrefs).toContain(p));
  });

  it("links on to the full PRI, the Find My hub and the essays", () => {
    render(<Page />);
    expect(screen.getByRole("link", { name: "Full PRI Assessment" })).toHaveAttribute("href", "/psychedelic-readiness-index");
    expect(screen.getByRole("link", { name: /Find My/ })).toHaveAttribute("href", "/find-my");
    expect(screen.getByRole("link", { name: "Essays" })).toHaveAttribute("href", "/blog");
  });
});
