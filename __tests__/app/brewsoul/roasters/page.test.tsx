import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/roasters/page";
import { ROASTERS } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/roasters", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Roaster Directory — BrewSoul");
    expect(metadata.description).toMatch(/paying farmers fairly/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/roasters");
  });

  it("renders exactly one H1 and the Continue Your Journey links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Roaster Directory");
    expect(screen.getByText("Continue Your Journey")).toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/browse", "/brewsoul/compare", "/brewsoul/drops"]) expect(hrefs).toContain(href);
  });

  it("lists the real roasters", () => {
    render(<Page />);
    expect(screen.getAllByText(ROASTERS[0].name).length).toBeGreaterThan(0);
  });
});
