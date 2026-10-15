import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import UnderNdaPage, { metadata } from "@/app/under-nda/page";

describe("/under-nda", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Under NDA");
    expect(metadata.description).toMatch(/^The deals, partnerships, and projects Tony Greenberg can't talk about yet\./);
    expect(metadata.alternates?.canonical).toBe("/under-nda");
  });

  it("renders one H1 and the corridor description", () => {
    render(<UnderNdaPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Corridor");
    expect(screen.getByText(/Four payment processing companies through what we call "the corridor"/)).toBeInTheDocument();
    expect(screen.getByText(/Details under NDA\. The opportunity is measured in billions\./)).toBeInTheDocument();
  });

  it("lists what is being built and Tony's plumbers line", () => {
    const { container } = render(<UnderNdaPage />);
    expect(screen.getByRole("heading", { level: 2, name: "What We're Building" })).toBeInTheDocument();
    expect(screen.getByText(/Stablecoin settlement infrastructure for enterprise-scale transactions/)).toBeInTheDocument();
    expect(container.textContent).toContain("We're plumbers. Very well-connected plumbers.");
  });

  it("links to the related pages and the next door", () => {
    render(<UnderNdaPage />);
    expect(screen.getByRole("link", { name: /^The Engine Room/ })).toHaveAttribute("href", "/engine-room");
    expect(screen.getByRole("link", { name: /^The Seven Doors/ })).toHaveAttribute("href", "/walk-through");
    expect(screen.getByRole("link", { name: /Continue to The Body/ })).toHaveAttribute("href", "/the-body");
  });
});
