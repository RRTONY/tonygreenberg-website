import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepType } from "@/components/post-intervention/components/step-type";
import { usePostIntervention } from "@/components/post-intervention/hook/use-post-intervention";

vi.mock("@/app/post-intervention/actions", () => ({ submitPostIntervention: vi.fn() }));

let flow: ReturnType<typeof usePostIntervention>;
// Called from render; keeps the assignment out of the component body (react-hooks/globals).
const capture = (value: ReturnType<typeof usePostIntervention>) => {
  flow = value;
};
function Harness() {
  const value = usePostIntervention();
  capture(value);
  return <StepType flow={{ ...value, state: { ...value.state, day: value.state.day ?? 3 } }} />;
}

describe("StepType", () => {
  it("shows the day and defaults to psychedelic medicine", () => {
    render(<Harness />);
    expect(screen.getByText("Day 3 Assessment")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Psychedelic Medicine" })).toHaveAttribute("aria-checked", "true");
  });

  it("picks one type at a time", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("radio", { name: "Breathwork" }));
    expect(screen.getByRole("radio", { name: "Breathwork" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Psychedelic Medicine" })).toHaveAttribute("aria-checked", "false");
    expect(flow.state.interventionType).toBe("breathwork");
  });

  it("stores the optional facilitator name", async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText(/Facilitator name or code/), "JB");
    expect(flow.state.facilitatorRef).toBe("JB");
  });

  it("Continue goes forward, Back returns to step 1 (facilitator can be empty)", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: /Continue/ }));
    expect(flow.state.step).toBe(2);
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(flow.state.step).toBe(1);
  });
});
