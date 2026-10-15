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

  it.each([
    [700, "Enlightenment"],
    [600, "Peace"],
    [540, "Joy"],
    [500, "Love"],
    [400, "Reason"],
    [350, "Acceptance"],
    [310, "Willingness"],
    [250, "Neutrality"],
    [200, "Courage"],
    [199, "Below Integrity"],
  ])("a Hawkins score of %i reads as %s", (score, label) => {
    render(<IntelPortfolio portfolio={[co("ImpactSoul", { hawkinsScore: score })]} />);
    expect(screen.getByText(String(score))).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("shows each compass score as a bar of the right width, gold from 9, bronze from 7, grey below", () => {
    const { container } = render(<IntelPortfolio portfolio={[co("ImpactSoul", { compassScores: [9, 7, 6, 10, 3, 8, 5] })]} />);
    const bars = [...container.querySelectorAll<HTMLElement>("div.h-full.rounded-full")];
    expect(bars.map((b) => b.style.width)).toEqual(["90%", "70%", "60%", "100%", "30%", "80%", "50%"]);
    const colors = bars.map((b) => b.style.background);
    expect(colors[0]).toBe(colors[3]); // 9 and 10: gold
    expect(colors[1]).toBe(colors[5]); // 7 and 8: bronze
    expect(colors[2]).toBe(colors[4]); // 6 and 3: grey
    expect(new Set([colors[0], colors[1], colors[2]]).size).toBe(3);
  });

  it("styles Exited companies as muted and hides an empty role", () => {
    render(<IntelPortfolio portfolio={[co("OldCo", { status: "Exited", role: "" })]} />);
    expect(screen.getByText("Exited")).toHaveClass("bg-muted", "text-muted-foreground");
    expect(screen.queryByText("Advisor")).toBeNull();
  });

  it("labels partners, adjacent players and competitors with their own colours", () => {
    render(
      <IntelPortfolio
        portfolio={[
          co("ImpactSoul", {
            competitors: [
              { name: "Friend", description: "Helps", type: "partner" },
              { name: "Neighbour", description: "Nearby", type: "adjacent" },
              { name: "Rival", description: "Fights", type: "competitor" },
            ],
          }),
        ]}
      />,
    );
    expect(screen.getByText("partner")).toHaveClass("text-[#267449]");
    expect(screen.getByText("adjacent")).toHaveClass("text-[#3C6F9A]");
    expect(screen.getByText("competitor")).toHaveClass("text-[#8B0000]");
    expect(screen.getByText("— Nearby")).toBeInTheDocument();
  });
});
