import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepSurvey } from "@/components/post-intervention/components/step-survey";
import { usePostIntervention } from "@/components/post-intervention/hook/use-post-intervention";
import { submitPostIntervention } from "@/app/post-intervention/actions";

vi.mock("@/app/post-intervention/actions", () => ({ submitPostIntervention: vi.fn() }));
const submit = vi.mocked(submitPostIntervention);

let flow: ReturnType<typeof usePostIntervention>;
// Called from render; keeps the assignment out of the component body (react-hooks/globals).
const capture = (value: ReturnType<typeof usePostIntervention>) => {
  flow = value;
};
function Harness() {
  const value = usePostIntervention();
  capture(value);
  return <StepSurvey flow={value} />;
}
function setup() {
  render(<Harness />);
  act(() => flow.updateState({ step: 3, day: 7, interventionType: "ceremony" }));
}
const submitButton = () => screen.getByRole("button", { name: /Submit Anonymously/ });

async function rateAll() {
  const groups = screen.getAllByRole("group");
  // groups[0..2] are the three score fieldsets.
  await userEvent.click(within(groups[0]).getByRole("button", { name: "8, Strong" }));
  await userEvent.click(within(groups[1]).getByRole("button", { name: "10, Exceptional" }));
  await userEvent.click(within(groups[2]).getByRole("button", { name: "6, Slightly above" }));
  await userEvent.click(screen.getByRole("button", { name: "Not sure" }));
}

describe("StepSurvey", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true });
  });

  it("shows the day and type, and blocks submit until everything required is rated", () => {
    setup();
    expect(screen.getByText("Day 7 · Ceremony / Ritual")).toBeInTheDocument();
    expect(screen.getByText(/Please rate integration, safety, trust, and recommendation/)).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it("marks the chosen score and shows its label", async () => {
    setup();
    const first = screen.getAllByRole("group")[0];
    await userEvent.click(within(first).getByRole("button", { name: "3, Below average" }));
    expect(within(first).getByRole("button", { name: "3, Below average" })).toHaveAttribute("aria-pressed", "true");
    expect(within(first).getByText("3 — Below average")).toBeInTheDocument();
  });

  it("sends the ratings with empty open answers allowed, then thanks the person", async () => {
    setup();
    await rateAll();
    expect(submitButton()).toBeEnabled();
    await userEvent.type(screen.getByLabelText("What went well?"), "Good space");
    await userEvent.click(submitButton());
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ dayChoice: 7, interventionType: "ceremony", integrationScore: 8, safetyScore: 10, trustScore: 6, wouldRecommend: "unsure", wentWell: "Good space", couldImprove: "", messageToFacilitator: "" }),
    );
    await vi.waitFor(() => expect(flow.state.step).toBe(4));
  });

  it("shows a spinner while saving and the error if it fails", async () => {
    let finish: (v: { ok: boolean; error?: string }) => void = () => {};
    submit.mockImplementation(() => new Promise((r) => (finish = r)));
    setup();
    await rateAll();
    await userEvent.click(submitButton());
    expect(submitButton()).toBeDisabled();
    expect(submitButton().querySelector(".animate-spin")).not.toBeNull();
    await act(async () => finish({ ok: false, error: "Couldn't save." }));
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't save.");
    expect(flow.state.step).toBe(3);
  });

  it("Back returns to the type step", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(flow.state.step).toBe(2);
  });
});
