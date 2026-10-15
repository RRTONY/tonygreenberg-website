import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalibrationAssessment } from "@/components/pri/calibration-assessment";
import { saveCalibration } from "@/app/pri-calibration/actions";
import { DIMS, DIM_LABELS } from "@/lib/content/pri-data";
import efficacyData from "@/lib/content/pri-efficacy-data.json";

vi.mock("@/app/pri-calibration/actions", () => ({ saveCalibration: vi.fn() }));
const save = vi.mocked(saveCalibration);

type User = ReturnType<typeof userEvent.setup>;

// The pairs come in random order, so always prefer the dimension that comes
// first in DIMS. Wins are then 5, 4, 3, 2, 1, 0, and Bradley-Terry gives
// strengths 6/7 ... 1/7, i.e. these scores after scaling the top one to 100.
const EXPECTED = { medical: 100, pharmacological: 84, psychological: 67, intention: 50, setting: 33, integration: 17 };

async function choosePairs(user: User) {
  await user.click(screen.getByRole("button", { name: /begin calibration/i }));
  for (let i = 1; i <= 15; i++) {
    expect(screen.getByText(`Comparison ${i} of 15`)).toBeInTheDocument();
    const [a, b] = screen.getAllByRole("button").filter((el) => DIMS.some((d) => el.textContent === DIM_LABELS[d]));
    const ia = DIMS.findIndex((d) => DIM_LABELS[d] === a.textContent);
    const ib = DIMS.findIndex((d) => DIM_LABELS[d] === b.textContent);
    await user.click(ia < ib ? a : b);
  }
  expect(screen.getByRole("heading", { name: "Rank All Dimensions" })).toBeInTheDocument();
}

describe("CalibrationAssessment", () => {
  beforeEach(() => {
    save.mockResolvedValue({ ok: true });
  });

  it("starts on the intro", () => {
    render(<CalibrationAssessment />);
    expect(screen.getByRole("heading", { level: 1, name: "Deep Calibration" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why Calibrate?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to pri/i })).toHaveAttribute("href", "/psychedelic-readiness-index");
  });

  it("asks all 15 pairs, each pair of dimensions exactly once", async () => {
    const user = userEvent.setup();
    render(<CalibrationAssessment />);
    await user.click(screen.getByRole("button", { name: /begin calibration/i }));
    const seen = new Set<string>();
    for (let i = 0; i < 15; i++) {
      const pair = screen.getAllByRole("button").filter((el) => DIMS.some((d) => el.textContent === DIM_LABELS[d]));
      expect(pair).toHaveLength(2);
      seen.add(pair.map((p) => p.textContent).sort().join("|"));
      await user.click(pair[0]);
    }
    expect(seen.size).toBe(15);
  });

  it("scores with Bradley-Terry, saves the calibration and shows the results", async () => {
    const user = userEvent.setup();
    render(<CalibrationAssessment />);
    await choosePairs(user);
    // Swap the first two in the ranking with the arrow.
    await user.click(screen.getAllByRole("button", { name: /move .* down/i })[0]);
    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByRole("heading", { name: "Contribute to Research?" })).toBeInTheDocument();
    expect(screen.getByText("No thanks")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByText("Yes, include my data")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /submit calibration/i }));

    expect(await screen.findByRole("heading", { name: "Calibrated Profile" })).toBeInTheDocument();
    const sent = save.mock.calls[0][0];
    expect(sent.rankings).toEqual(["pharmacological", "medical", ...DIMS.slice(2)]);
    expect(sent.dimScores).toEqual(EXPECTED);
    expect(sent.pairwiseChoices).toHaveLength(15);
    expect(sent.researchOptIn).toBe(true);
    for (const d of DIMS) {
      const row = screen.getByText(DIM_LABELS[d]).closest(".mb-3")!;
      expect(row).toHaveTextContent(String(EXPECTED[d]));
    }
    expect(screen.getByText(`${efficacyData.classification_accuracy.forced_rank}%`)).toBeInTheDocument();
  });

  it("shows a spinner while saving, still shows results if saving fails, and resets", async () => {
    let release!: () => void;
    save.mockImplementation(
      () =>
        new Promise((_, reject) => {
          release = () => reject(new Error("down"));
        }),
    );
    const user = userEvent.setup();
    render(<CalibrationAssessment />);
    await choosePairs(user);
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /submit calibration/i }));
    const button = screen.getByRole("button", { name: /submit calibration/i });
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    release();
    expect(await screen.findByRole("heading", { name: "Calibrated Profile" })).toBeInTheDocument();
    expect(save.mock.calls[0][0].researchOptIn).toBe(false);
    await user.click(screen.getByRole("button", { name: /retake calibration/i }));
    expect(screen.getByRole("heading", { name: "Why Calibrate?" })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Calibrated Profile")).not.toBeInTheDocument());
  });

  const rankedLabels = () =>
    [...document.querySelectorAll<HTMLElement>("[draggable=true]")].map((row) => row.querySelector(".flex-1")!.textContent);

  it("reorders the ranking by dragging a dimension onto another's place", async () => {
    const user = userEvent.setup();
    render(<CalibrationAssessment />);
    await choosePairs(user);
    const rows = () => [...document.querySelectorAll<HTMLElement>("[draggable=true]")];
    expect(rankedLabels()).toEqual(DIMS.map((d) => DIM_LABELS[d]));
    // Drag the third dimension up to the top.
    fireEvent.dragStart(rows()[2]);
    expect(rows()[2]).toHaveClass("opacity-50");
    fireEvent.dragOver(rows()[0]);
    expect(rankedLabels()).toEqual([DIMS[2], DIMS[0], DIMS[1], ...DIMS.slice(3)].map((d) => DIM_LABELS[d]));
    // The dragged item is now at the top; hovering over itself changes nothing.
    fireEvent.dragOver(rows()[0]);
    expect(rankedLabels()[0]).toBe(DIM_LABELS[DIMS[2]]);
    fireEvent.dragEnd(rows()[0]);
    expect(rows().some((r) => r.classList.contains("opacity-50"))).toBe(false);
    // Dragging over a row with nothing picked up does nothing.
    fireEvent.dragOver(rows()[4]);
    expect(rankedLabels()[0]).toBe(DIM_LABELS[DIMS[2]]);

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /submit calibration/i }));
    await screen.findByRole("heading", { name: "Calibrated Profile" });
    expect(save.mock.calls[0][0].rankings).toEqual([DIMS[2], DIMS[0], DIMS[1], ...DIMS.slice(3)]);
  });

  it("the up arrow moves a dimension up, and the ends of the list can't move further", async () => {
    const user = userEvent.setup();
    render(<CalibrationAssessment />);
    await choosePairs(user);
    const ups = screen.getAllByRole("button", { name: /move .* up/i });
    const downs = screen.getAllByRole("button", { name: /move .* down/i });
    expect(ups[0]).toBeDisabled();
    expect(downs.at(-1)).toBeDisabled();
    await user.click(ups.at(-1)!);
    expect(rankedLabels()).toEqual([...DIMS.slice(0, 4), DIMS[5], DIMS[4]].map((d) => DIM_LABELS[d]));
  });

  it("each ranking move button is named after its dimension (icons, not typed arrows)", async () => {
    const user = userEvent.setup();
    render(<CalibrationAssessment />);
    await choosePairs(user);
    expect(screen.getAllByRole("button", { name: /move .* up/i })).toHaveLength(DIMS.length);
    expect(screen.getByRole("button", { name: `Move ${DIM_LABELS[DIMS[1]]} up` })).toBeEnabled();
    expect(document.body.textContent).not.toMatch(/[↑↓]/);
  });
});
