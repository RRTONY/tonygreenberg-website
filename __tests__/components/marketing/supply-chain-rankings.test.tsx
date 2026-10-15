import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SupplyChainRankings } from "@/components/marketing/supply-chain-rankings";
import type { Provider } from "@/lib/content/supply-chain-providers";

const prov = (name: string, monthlyPrice: number, credibilityScore: number, marketing: number, manufacturing: number): Provider => ({
  name,
  url: `https://${name.toLowerCase()}.example`,
  monthlyPrice,
  breakdown: { manufacturing, marketing, compliance: 10, physician: 10, rnd: 5, shipping: 5, profit: 70 - marketing - manufacturing },
  credibilityScore,
  model: "Telehealth",
  transparency: "medium",
  flags: ["Upsells"],
  notes: `${name} notes.`,
});
const PROVIDERS = [prov("Alpha", 300, 72, 10, 30), prov("Bravo", 100, 20, 40, 8), prov("Charlie", 500, 55, 20, 15)];
const order = () => screen.getAllByText(/^(Alpha|Bravo|Charlie)$/).map((n) => n.textContent);

describe("SupplyChainRankings", () => {
  it("ranks by credibility with labels", () => {
    render(<SupplyChainRankings providers={PROVIDERS} />);
    expect(order()).toEqual(["Alpha", "Charlie", "Bravo"]);
    expect(screen.getByText("72/100 · Credible")).toBeInTheDocument();
    expect(screen.getByText("20/100 · Low Credibility")).toBeInTheDocument();
    expect(screen.getByText("Telehealth · $100/mo")).toBeInTheDocument();
  });

  it("re-sorts by price, marketing share and manufacturing share", async () => {
    const user = userEvent.setup();
    render(<SupplyChainRankings providers={PROVIDERS} />);
    await user.click(screen.getByRole("button", { name: "By Price" }));
    expect(order()).toEqual(["Bravo", "Alpha", "Charlie"]);
    await user.click(screen.getByRole("button", { name: "By Marketing %" }));
    expect(order()).toEqual(["Bravo", "Charlie", "Alpha"]);
    await user.click(screen.getByRole("button", { name: "By Manufacturing %" }));
    expect(order()).toEqual(["Alpha", "Charlie", "Bravo"]);
  });

  it("expands a provider into its dollar breakdown, flags and site link", async () => {
    render(<SupplyChainRankings providers={PROVIDERS} />);
    await userEvent.setup().click(screen.getByRole("button", { name: /Alpha/ }));
    expect(screen.getByText("Your Dollar Breakdown")).toBeInTheDocument();
    // 30% of $300 goes to manufacturing
    expect(screen.getByText("Manufacturing", { selector: "div" }).nextElementSibling).toHaveTextContent("$90");
    expect(screen.getByText("Upsells")).toBeInTheDocument();
    expect(screen.getByText("Alpha notes.")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Visit Alpha/ });
    expect(link).toHaveAttribute("href", "https://alpha.example");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
