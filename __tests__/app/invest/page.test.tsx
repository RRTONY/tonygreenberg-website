import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import InvestPage, { metadata } from "@/app/invest/page";

describe("/invest", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Invest in the Thesis — Portfolio & ABIT Waitlist");
    expect(metadata.description).toMatch(/ImpactSoul ABITs launch Q1 2027/);
    expect(metadata.alternates?.canonical).toBe("/invest");
  });

  it("renders one H1 and the real intro", () => {
    const { container } = render(<InvestPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Invest in the Thesis");
    expect(container).toHaveTextContent("Many more you can't — yet.");
  });

  it("groups the portfolio into its real sectors", () => {
    const { container } = render(<InvestPage />);
    for (const h of ["Psychedelic Medicine", "Impact Venture & Finance", "Web3, DAOs & Governance", "Blockchain Infrastructure", "Identity & Trust", "Health & Wellness Tech"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(container).toHaveTextContent("MycoMedica Life Sciences");
    expect(container).toHaveTextContent("Paul Stamets' patent portfolio company");
  });

  it("counts the companies it shows", () => {
    const { container } = render(<InvestPage />);
    const m = (container.textContent ?? "").match(/(\d+) companies you can see/);
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBeGreaterThan(20);
  });

  it("links to the gate, the ABIT waitlist and Tony's email", () => {
    render(<InvestPage />);
    expect(screen.getByRole("link", { name: /Enter the Gate/ })).toHaveAttribute("href", "/engage");
    expect(screen.getByRole("link", { name: /Join the Waitlist/ })).toHaveAttribute("href", "https://impactsoul.is");
    expect(screen.getByRole("link", { name: "tony@impactsoul.is" })).toHaveAttribute("href", "mailto:tony@impactsoul.is");
  });
});
