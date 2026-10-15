import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DharmaFinderPage, { metadata } from "@/app/dharma-finder/page";

describe("/dharma-finder", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Dharma Finder");
    expect(metadata.description).toMatch(/Dharma Inquiry/);
    expect(metadata.alternates?.canonical).toBe("/dharma-finder");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<DharmaFinderPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Dharma Finder/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<DharmaFinderPage />);
    expect(container).toHaveTextContent("Part 1 of 4");
    expect(container).toHaveTextContent("the path of right action");
    expect(container).toHaveTextContent("If your financial needs were already met for the rest of your life");
  });

  it("offers a way to start or move through the questions", () => {
    render(<DharmaFinderPage />);
    expect(screen.getAllByRole("button", { name: "Next" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<DharmaFinderPage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Daniel Schmachtenberger's Dharma Inquiry") })[0]).toHaveAttribute("href", "https://civilizationemerging.com/dharma-inquiry-original-version/");
  });
});
