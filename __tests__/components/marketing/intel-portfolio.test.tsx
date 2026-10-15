import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { COMPASS_DIMENSIONS, IntelPortfolio, type PortCo } from "@/components/marketing/intel-portfolio";

const co = (name: string, over: Partial<PortCo> = {}): PortCo => ({
  name,
  category: "Impact Finance",
  description: `${name} does things.`,
  investmentThesis: `${name} thesis.`,
  hawkinsScore: 540,
  compassScores: [9, 8, 7, 6, 5, 4, 10],
  compositeScore: 7.04,
  irr: { keyImpactIndicator: "Lives", futureImpact: "Big", impactMultiplier: 3, impactEfficiency: "High", timeHorizon: "10y", estimatedIRR: "22%" },
  gates: [true, false, true],
  competitors: [{ name: "RivalCo", description: "Does similar", type: "competitor" }],
  status: "Active",
  role: "Advisor",
  ...over,
});

describe("IntelPortfolio", () => {
  it("shows each company's header, Hawkins level and composite score", () => {
    render(<IntelPortfolio portfolio={[co("ImpactSoul"), co("Menagerie", { status: "Stealth", hawkinsScore: 150 })]} />);
    expect(screen.getByRole("heading", { level: 3, name: "ImpactSoul" })).toBeInTheDocument();
    expect(screen.getByText("Joy")).toBeInTheDocument();
    expect(screen.getByText("Below Integrity")).toBeInTheDocument();
    expect(screen.getAllByText("7.0")).toHaveLength(2);
    expect(screen.getByText("Stealth")).toBeInTheDocument();
  });

  it("keeps the full analysis in the HTML while collapsed (forceMount)", () => {
    const { container } = render(<IntelPortfolio portfolio={[co("ImpactSoul")]} />);
    expect(screen.getByRole("button", { name: "Full Analysis" })).toHaveAttribute("aria-expanded", "false");
    expect(container).toHaveTextContent("ImpactSoul thesis.");
    expect(container).toHaveTextContent("RivalCo");
    expect(container).toHaveTextContent("22%");
    for (const d of COMPASS_DIMENSIONS) expect(container).toHaveTextContent(d);
  });

  it("marks passed and failed gates and opens on click", async () => {
    render(<IntelPortfolio portfolio={[co("ImpactSoul")]} />);
    expect(screen.getByText("Phone Call Test")).toHaveClass("text-[#267449]");
    expect(screen.getByText("Dinner Table Test")).toHaveClass("text-[#8B0000]");
    await userEvent.setup().click(screen.getByRole("button", { name: "Full Analysis" }));
    expect(screen.getByRole("button", { name: "Full Analysis" })).toHaveAttribute("aria-expanded", "true");
  });
});
