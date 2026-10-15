import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/brewsoul/glossary/page";
import { GLOSSARY } from "@/lib/content/brewsoul-encyclopedia";

describe("/brewsoul/glossary", () => {
  it("has its title, description and canonical", () => {
    expect(metadata.title).toBe("Glossary — BrewSoul");
    expect(metadata.description).toMatch(/crema to channeling/);
    expect(metadata.alternates?.canonical).toBe("/brewsoul/glossary");
  });

  it("renders exactly one H1 and the Continue Your Journey links", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Glossary");
    expect(screen.getByText("Continue Your Journey")).toBeInTheDocument();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const href of ["/brewsoul/varieties", "/brewsoul/processing", "/brewsoul/browse"]) expect(hrefs).toContain(href);
  });

  it("lists the real glossary terms", () => {
    render(<Page />);
    expect(screen.getByText(GLOSSARY[0].term)).toBeInTheDocument();
  });
});
