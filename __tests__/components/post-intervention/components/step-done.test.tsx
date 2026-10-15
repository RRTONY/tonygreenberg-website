import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepDone } from "@/components/post-intervention/components/step-done";
import type { StepProps } from "@/components/post-intervention/post-intervention";

vi.mock("@/app/post-intervention/actions", () => ({ submitPostIntervention: vi.fn() }));

function setup(day: number | null) {
  const flow = { state: { day }, reset: vi.fn() } as unknown as StepProps["flow"];
  render(<StepDone flow={flow} />);
  return flow;
}

describe("StepDone", () => {
  it.each([
    [1, 3],
    [3, 7],
    [7, 30],
  ])("after Day %i suggests coming back at Day %i", (day, next) => {
    setup(day);
    expect(screen.getByText(`Day ${day} complete.`)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Come back at Day ${next} `))).toBeInTheDocument();
  });

  it("thanks the person and links home", () => {
    setup(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Thank You for Your Honesty");
    expect(screen.getByRole("link", { name: "Return Home" })).toHaveAttribute("href", "/");
  });

  it("Take Another Assessment starts over", async () => {
    const flow = setup(3);
    await userEvent.click(screen.getByRole("button", { name: "Take Another Assessment" }));
    expect(flow.reset).toHaveBeenCalled();
  });
});
