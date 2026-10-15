import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EcosystemMap } from "@/components/assessments/ecosystem-map";
import { ECOSYSTEM_PHASES } from "@/lib/content/ecosystem-map";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const ALL = ECOSYSTEM_PHASES.flatMap((p) => p.experiences);
const KEY = "findyour_journey_progress";

describe("EcosystemMap", () => {
  it("lists every experience, starting expanded, and recommends the first one", () => {
    render(<EcosystemMap />);
    expect(screen.getByText(`0 of ${ALL.length} completed`)).toBeInTheDocument();
    for (const exp of ALL) expect(screen.getByText(exp.description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(`Continue: ${ALL[0].name}`) })).toHaveAttribute("href", "/find-your-me");
    for (const b of screen.getAllByRole("button", { expanded: true })) expect(b).toHaveAttribute("aria-controls");
  });

  it("collapsing a phase hides its panel but keeps it in the page", async () => {
    const user = userEvent.setup();
    render(<EcosystemMap />);
    const toggle = screen.getByRole("button", { name: new RegExp(ECOSYSTEM_PHASES[0].title) });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById(`phase-${ECOSYSTEM_PHASES[0].number}`)!;
    expect(panel).toHaveClass("hidden");
    expect(within(panel).getByText(ECOSYSTEM_PHASES[0].experiences[0].description)).toBeInTheDocument();
    await user.click(toggle);
    expect(panel).not.toHaveClass("hidden");
  });

  it("uses saved progress: counts, Complete badge and the next unfinished experience", () => {
    const phase1 = ECOSYSTEM_PHASES[0].experiences.map((e) => e.id);
    localStorage.setItem(KEY, JSON.stringify(phase1));
    render(<EcosystemMap />);
    expect(screen.getByText(`${phase1.length} of ${ALL.length} completed`)).toBeInTheDocument();
    expect(screen.getAllByText("Complete")).toHaveLength(1);
    const nextExp = ALL.find((e) => !phase1.includes(e.id))!;
    expect(screen.getByRole("link", { name: new RegExp(`Continue: ${nextExp.name}`) })).toBeInTheDocument();
  });

  it("shows Journey Complete when every experience is done", () => {
    localStorage.setItem(KEY, JSON.stringify(ALL.map((e) => e.id)));
    render(<EcosystemMap />);
    expect(screen.getByText(/Journey Complete/)).toBeInTheDocument();
    expect(screen.queryByText(/Recommended Next/)).not.toBeInTheDocument();
  });

  it("an experience with no page in the journey map is not a link", () => {
    render(<EcosystemMap />);
    const chem = screen.getByText("Find Your Chemistry");
    expect(chem.closest("a")).toBeNull();
  });
});
