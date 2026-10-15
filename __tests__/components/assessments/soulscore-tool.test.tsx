import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoulScoreTool } from "@/components/assessments/soulscore-tool";
import { DIMENSIONS, PALETTE, SUPPLY_TIERS, calcCNPV, calcSoulScore, formatCurrency } from "@/lib/content/soulscore";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

async function launch() {
  const user = userEvent.setup();
  render(<SoulScoreTool />);
  await user.click(screen.getByRole("button", { name: /launch soulscore/i }));
  return user;
}
// The 12 dimension sliders on the Measure tab.
const sliders = () => (screen.getByText(`${DIMENSIONS.length} Dimensions`).parentElement as HTMLElement).querySelectorAll<HTMLInputElement>('input[type="range"]');
const gradeLetter = () => screen.getByText("SoulScore", { selector: "div" }).parentElement!.nextElementSibling!.textContent;
// The number animates over ~400ms, so wait for it to settle.
const scoreNumber = () => screen.getByText("SoulScore", { selector: "div" }).nextElementSibling;
const zone = () => screen.getByText("Consciousness Zone").nextElementSibling!.textContent;

describe("SoulScoreTool", () => {
  it("the landing counts dimensions from the data and launches the tool", async () => {
    render(<SoulScoreTool />);
    expect(screen.getByText(`${DIMENSIONS.length} Dimensions`)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: /launch soulscore/i }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("SoulScore™");
    expect(sliders()).toHaveLength(DIMENSIONS.length);
  });

  it("starts at 46.4, grade C: consciousness 200/1000 (20) weighted 12, everything else 50", async () => {
    await launch();
    await waitFor(() => expect(scoreNumber()).toHaveTextContent("46.4"), { timeout: 5000 });
    expect(gradeLetter()).toBe("C");
    expect(zone()).toBe("POWER");
  });

  it("all sliders at the top gives grade S and the LOVE zone; at zero gives F", async () => {
    await launch();
    sliders().forEach((s, i) => fireEvent.change(s, { target: { value: String(DIMENSIONS[i].max) } }));
    expect(gradeLetter()).toBe("S");
    expect(zone()).toBe("LOVE");
    sliders().forEach((s) => fireEvent.change(s, { target: { value: "0" } }));
    expect(gradeLetter()).toBe("F");
    expect(screen.getByText("BELOW THRESHOLD")).toBeInTheDocument();
  });

  it("switches between the six tabs", async () => {
    const user = await launch();
    await user.click(screen.getByRole("button", { name: "BENCHMARK" }));
    expect(screen.getByRole("heading", { level: 2, name: "Benchmark Comparison" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "FAILURES" }));
    expect(screen.getByRole("heading", { level: 2, name: "Why Every Impact System Failed" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "C-NPV" }));
    expect(screen.getByRole("heading", { level: 2, name: "Consciousness-Adjusted NPV" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "GIG ECONOMY" }));
    expect(screen.getByRole("heading", { level: 2, name: "The Gig Economy Problem" })).toBeInTheDocument();
  });

  it("logs the visit for /self-portrait but never saves to the database (it's an open calculator)", async () => {
    await launch();
    expect(recordFinish).not.toHaveBeenCalled();
    expect(document.cookie).toContain("tg_assessment_results");
  });

  it("the score animates to the new value after a slider moves", async () => {
    await launch();
    await waitFor(() => expect(scoreNumber()).toHaveTextContent("46.4"), { timeout: 5000 });
    fireEvent.change(sliders()[1], { target: { value: "100" } });
    const expected = DIMENSIONS.map((d, i) => (i === 0 ? 200 : i === 1 ? 100 : 50));
    await waitFor(() => expect(scoreNumber()).toHaveTextContent(calcSoulScore(expected).toFixed(1)), { timeout: 5000 });
  });

  it("picking an entity type highlights it, and the entity name shows as YOU in the benchmark table", async () => {
    const user = await launch();
    const fund = screen.getByRole("button", { name: "Fund" });
    expect(fund.className).not.toContain(PALETTE.gold.bgSoft);
    await user.click(fund);
    expect(fund.className).toContain(PALETTE.gold.bgSoft);
    expect(screen.getByRole("button", { name: "Company" }).className).not.toContain(PALETTE.gold.bgSoft);
    await user.type(screen.getByPlaceholderText("Entity name (optional)"), "Acme Co");
    await user.click(screen.getByRole("button", { name: "BENCHMARK" }));
    const row = screen.getByText("Acme Co").closest("tr")!;
    expect(row).toHaveTextContent("YOU");
    expect(row).toHaveTextContent("46.4");
  });

  it("the benchmark row is called 'Your Entity' when no name is typed", async () => {
    const user = await launch();
    await user.click(screen.getByRole("button", { name: "BENCHMARK" }));
    expect(screen.getByText("Your Entity").closest("tr")).toHaveTextContent("YOU");
  });

  it("supply chain tiers expand, score their factors, show the average and collapse again", async () => {
    const user = await launch();
    await user.click(screen.getByRole("button", { name: "SUPPLY CHAIN" }));
    expect(screen.getByRole("heading", { level: 2, name: "Supply Chain Deep Dive" })).toBeInTheDocument();
    const tier = SUPPLY_TIERS[0];
    const tierButton = screen.getByRole("button", { name: new RegExp(tier.name) });
    expect(tierButton).toHaveTextContent("Avg: 50");
    expect(screen.queryByText(tier.factors[0])).not.toBeInTheDocument();
    await user.click(tierButton);
    const factorSliders = tierButton.parentElement!.querySelectorAll<HTMLInputElement>('input[type="range"]');
    expect(factorSliders).toHaveLength(tier.factors.length);
    factorSliders.forEach((s) => fireEvent.change(s, { target: { value: "100" } }));
    expect(tierButton).toHaveTextContent("Avg: 100");
    factorSliders.forEach((s) => fireEvent.change(s, { target: { value: "10" } }));
    expect(tierButton).toHaveTextContent("Avg: 10");
    // Other tiers keep their own scores.
    expect(screen.getByRole("button", { name: new RegExp(SUPPLY_TIERS[1].name) })).toHaveTextContent("Avg: 50");
    await user.click(tierButton);
    expect(screen.queryByText(tier.factors[0])).not.toBeInTheDocument();
    // Collapsing doesn't lose the scores.
    expect(tierButton).toHaveTextContent("Avg: 10");
  });

  it("the C-NPV calculator recomputes from cash flow, years and discount rate", async () => {
    const user = await launch();
    await user.click(screen.getByRole("button", { name: "C-NPV" }));
    const standard = () => screen.getByText("Standard NPV").nextElementSibling!.textContent;
    const adjusted = () => screen.getByText("Consciousness-Adjusted NPV", { selector: "div" }).nextElementSibling!.textContent;
    expect(standard()).toBe(formatCurrency(calcCNPV(10000000, 200, 10, 10).standard));
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "500000" } });
    const [yearsSlider, discountSlider] = screen.getAllByRole("slider");
    fireEvent.change(yearsSlider, { target: { value: "5" } });
    fireEvent.change(discountSlider, { target: { value: "8" } });
    const r = calcCNPV(500000, 200, 5, 8);
    expect(standard()).toBe(formatCurrency(r.standard));
    expect(adjusted()).toBe(formatCurrency(r.adjusted));
    expect(screen.getByText("Projection Years (5)")).toBeInTheDocument();
    expect(screen.getByText("Discount Rate (8%)")).toBeInTheDocument();
  });

  it("each of the 12 dimension sliders is named after its dimension", async () => {
    await launch();
    expect(screen.getByRole("slider", { name: /consciousness/i })).toBeInTheDocument();
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(12);
    for (const s of sliders) expect(s).toHaveAccessibleName();
  });
});
