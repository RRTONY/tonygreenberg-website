import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import PriEfficacyPage, { metadata, revalidate } from "@/app/pri-efficacy/page";
import { getPriLiveStats } from "@/lib/pri-research";

vi.mock("@/lib/pri-research", () => ({ getPriLiveStats: vi.fn() }));
const liveStats = vi.mocked(getPriLiveStats);

describe("/pri-efficacy", () => {
  it("has its own title, description and canonical, and refreshes every 10 minutes", () => {
    expect(metadata.title).toBe("PRI Efficacy — Research and Evidence");
    expect(metadata.description).toMatch(/Monte Carlo simulation research/);
    expect(metadata.alternates?.canonical).toBe("/pri-efficacy");
    expect(revalidate).toBe(600);
  });

  it("renders one H1 and the simulation findings", async () => {
    liveStats.mockResolvedValue(null);
    await renderServer(PriEfficacyPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("PRI Efficacy Report");
    expect(screen.getAllByText(/Monte Carlo simulation with 10,000 synthetic respondents/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Forced-rank calibration nearly doubles classification accuracy/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Methodology" })).toBeInTheDocument();
  });

  it("keeps the Live tab in the HTML and says when live numbers aren't available", async () => {
    liveStats.mockResolvedValue(null);
    await renderServer(PriEfficacyPage());
    expect(screen.getByText(/Live calibration numbers aren't available just now\./)).toBeInTheDocument();
    expect(screen.getByText("Total Calibrations").nextElementSibling).toHaveTextContent("—");
  });

  it("says there's no data yet when the table is empty", async () => {
    liveStats.mockResolvedValue({ total: 0, optIn: 0, avgScores: {} });
    await renderServer(PriEfficacyPage());
    expect(screen.getByText(/No live calibration data yet\./)).toBeInTheDocument();
  });

  it("shows the real live totals, opt-in rate and average per dimension", async () => {
    liveStats.mockResolvedValue({ total: 1234, optIn: 617, avgScores: { medical: 62.5, integration: 48 } });
    await renderServer(PriEfficacyPage());
    expect(screen.getByText("Total Calibrations").nextElementSibling).toHaveTextContent("1,234");
    expect(screen.getByText("Research Opt-Ins").nextElementSibling).toHaveTextContent("617");
    expect(screen.getByText("Opt-In Rate").nextElementSibling).toHaveTextContent("50%");
    const panel = screen.getByRole("heading", { name: "Live Average Scores by Dimension" }).parentElement!;
    expect(within(panel).getByText("Medical Readiness")).toBeInTheDocument();
    expect(within(panel).getByText("62.5")).toBeInTheDocument();
    expect(within(panel).getByText("Integration Capacity")).toBeInTheDocument();
  });

  it("links to the assessment and the calibration", async () => {
    liveStats.mockResolvedValue(null);
    await renderServer(PriEfficacyPage());
    expect(screen.getByRole("link", { name: /Take the PRI Assessment/ })).toHaveAttribute("href", "/psychedelic-readiness-index");
    for (const a of screen.getAllByRole("link", { name: /Deep Calibration/ })) {
      expect(a).toHaveAttribute("href", "/pri-calibration");
    }
  });
});
