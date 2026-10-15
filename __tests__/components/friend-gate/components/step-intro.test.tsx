import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepIntro } from "@/components/friend-gate/components/step-intro";
import { BETTER_SAFE_QUOTE } from "@/lib/content/friend-gate";

function renderIntro() {
  const gate = { step: 1, onNext: vi.fn() };
  render(<StepIntro gate={gate} />);
  return gate;
}

describe("StepIntro", () => {
  it("shows the heading, the three-friends explanation and the quote", () => {
    renderIntro();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Before you see your results.");
    expect(screen.getByText(/Three people who know you well/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(BETTER_SAFE_QUOTE.slice(0, 30)))).toBeInTheDocument();
  });

  it("moves on to nominating when the button is pressed", async () => {
    const gate = renderIntro();
    await userEvent.click(screen.getByRole("button", { name: /nominate my three friends/i }));
    expect(gate.onNext).toHaveBeenCalledWith();
  });
});
