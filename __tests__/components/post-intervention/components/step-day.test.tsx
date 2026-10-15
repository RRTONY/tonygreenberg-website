import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepDay } from "@/components/post-intervention/components/step-day";
import type { StepProps } from "@/components/post-intervention/post-intervention";

vi.mock("@/app/post-intervention/actions", () => ({ submitPostIntervention: vi.fn() }));

function setup() {
  const flow = { updateState: vi.fn(), onNext: vi.fn() } as unknown as StepProps["flow"];
  render(<StepDay flow={flow} />);
  return flow;
}

describe("StepDay", () => {
  it("shows the title, the three day choices and the footer", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How Are You, Really?");
    expect(screen.getByRole("button", { name: /Day 1/ })).toHaveTextContent("Still in the glow");
    expect(screen.getByRole("button", { name: /Day 3/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Day 7/ })).toBeInTheDocument();
    expect(screen.getByText(/Results go to tony@tonygreenberg.com/)).toBeInTheDocument();
  });

  it("saves the chosen day and moves on", async () => {
    const flow = setup();
    await userEvent.click(screen.getByRole("button", { name: /Day 7/ }));
    expect(flow.updateState).toHaveBeenCalledWith({ day: 7 });
    expect(flow.onNext).toHaveBeenCalledTimes(1);
  });
});
