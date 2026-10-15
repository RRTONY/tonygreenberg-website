import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoulScoreTool } from "@/components/assessments/soulscore-tool";
import { DIMENSIONS } from "@/lib/content/soulscore";
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

  it.fails("BUG: the 12 dimension sliders have no accessible name (no label or aria-label)", async () => {
    await launch();
    expect(screen.getByRole("slider", { name: /consciousness/i })).toBeInTheDocument();
  });
});
