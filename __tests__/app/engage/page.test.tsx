import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import EngagePage, { metadata } from "@/app/engage/page";

describe("/engage", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Gate — Engagement Audit");
    expect(metadata.description).toMatch(/Seven out of ten inquiries don't qualify/);
    expect(metadata.alternates?.canonical).toBe("/engage");
  });

  it("renders one H1 and the real hero copy", () => {
    const { container } = render(<EngagePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Not everyone gets a meeting.");
    expect(container).toHaveTextContent("This isn't gatekeeping — it's respect for your time and mine.");
  });

  it("includes the engagement audit with its process and start button", () => {
    const { container } = render(<EngagePage />);
    expect(screen.getByRole("heading", { level: 2, name: "The Engagement Audit" })).toBeInTheDocument();
    expect(container).toHaveTextContent("Pass the audit → Calendly link unlocks");
    expect(screen.getByRole("button", { name: "Begin the Audit" })).toBeInTheDocument();
  });

  it("links to the related advisory pages", () => {
    render(<EngagePage />);
    expect(screen.getByRole("link", { name: /How I'd Approach Your Problem/ })).toHaveAttribute("href", "/framework");
    expect(screen.getByRole("link", { name: /The Amplifier/ })).toHaveAttribute("href", "/amplifier");
    expect(screen.getByRole("link", { name: /The Diamond Cut/ })).toHaveAttribute("href", "/diamond-cut");
  });
});
