import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PriCalibrationPage, { metadata } from "@/app/pri-calibration/page";
import { saveCalibration } from "@/app/pri-calibration/actions";
import { DIMS } from "@/lib/content/pri-data";

// The server action is replaced: this checks the page's flow, not the database.
vi.mock("@/app/pri-calibration/actions", () => ({ saveCalibration: vi.fn() }));
const save = vi.mocked(saveCalibration);

describe("/pri-calibration", () => {
  beforeEach(() => {
    save.mockResolvedValue({ ok: true });
  });
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("PRI Calibration — Psychedelic Readiness Index");
    expect(metadata.description).toMatch(/forced-rank psychometric self-assessment/);
    expect(metadata.alternates?.canonical).toBe("/pri-calibration");
  });

  it("renders one H1 and the intro copy", () => {
    render(<PriCalibrationPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Deep Calibration");
    expect(document.body.textContent).toContain("suffer from acquiescence bias");
    expect(screen.getByText("Takes ~3 minutes. 15 forced choices + 1 full ranking.")).toBeInTheDocument();
  });

  it("links back to the PRI and the related research pages", () => {
    render(<PriCalibrationPage />);
    expect(screen.getByRole("link", { name: /Back to PRI/ })).toHaveAttribute("href", "/psychedelic-readiness-index");
    expect(screen.getByRole("link", { name: /^PRI Efficacy Report/ })).toHaveAttribute("href", "/pri-efficacy");
    expect(screen.getByRole("link", { name: /^The Facilitator Index/ })).toHaveAttribute("href", "/facilitator-index");
  });

  it("walks through all 15 comparisons, the ranking and the opt-in, then saves and shows the profile", async () => {
    const user = userEvent.setup();
    render(<PriCalibrationPage />);
    await user.click(screen.getByRole("button", { name: /Begin Calibration/ }));

    for (let i = 1; i <= 15; i++) {
      expect(screen.getByText(`Comparison ${i} of 15`)).toBeInTheDocument();
      const options = screen.getByText(/more ready/).closest("div")!.querySelectorAll("button");
      expect(options).toHaveLength(2);
      await user.click(options[0]);
    }

    expect(screen.getByRole("heading", { name: "Rank All Dimensions" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    expect(screen.getByRole("heading", { name: "Contribute to Research?" })).toBeInTheDocument();
    expect(screen.getByText("No thanks")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByText("Yes, include my data")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Submit Calibration/ }));

    expect(await screen.findByRole("heading", { name: "Calibrated Profile" })).toBeInTheDocument();
    expect(save).toHaveBeenCalledTimes(1);
    const sent = save.mock.calls[0][0];
    expect(sent.researchOptIn).toBe(true);
    expect([...sent.rankings].sort()).toEqual([...DIMS].sort());
    expect(sent.pairwiseChoices).toHaveLength(15);
    for (const c of sent.pairwiseChoices) expect(c.pair).toContain(c.chosen);
  });

  it("still shows the results when saving fails", async () => {
    save.mockResolvedValue({ ok: false });
    const user = userEvent.setup();
    render(<PriCalibrationPage />);
    await user.click(screen.getByRole("button", { name: /Begin Calibration/ }));
    for (let i = 0; i < 15; i++) {
      await user.click(screen.getByText(/more ready/).closest("div")!.querySelectorAll("button")[1]);
    }
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await user.click(screen.getByRole("button", { name: /Submit Calibration/ }));
    expect(await screen.findByRole("heading", { name: "Calibrated Profile" })).toBeInTheDocument();
    expect(save.mock.calls[0][0].researchOptIn).toBe(false);
  });
});
