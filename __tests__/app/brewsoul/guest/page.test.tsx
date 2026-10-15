import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/guest/page";

describe("/brewsoul/guest", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Guest Series — BrewSoul");
    expect(metadata.description).toMatch(/Expert voices/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/guest");
  });

  it("renders exactly one H1 and its onward links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/\w/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/guest/shanita-nicholas"]) expect(hrefs).toContain(href);
  });

  it("introduces the Shanita Nicholas interview", () => {
    render(<Page />);
    expect(screen.getAllByText("Shanita Nicholas").length).toBeGreaterThan(0);
    expect(screen.getByText(/10-question interrogation/)).toBeInTheDocument();
  });
});
