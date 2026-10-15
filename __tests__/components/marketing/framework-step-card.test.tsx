import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FrameworkStepCard, type FrameworkStep } from "@/components/marketing/framework-step-card";

const STEP: FrameworkStep = {
  num: "01",
  title: "Name the Gap",
  subtitle: "Where it hurts",
  icon: <span>i</span>,
  description: "Find what's missing.",
  prompt: "What would change if this worked?",
  example: "A client once found $2M in a single invoice.",
};

describe("FrameworkStepCard", () => {
  it("shows the step number, title, description and question", () => {
    render(<FrameworkStepCard step={STEP} />);
    expect(screen.getByText("Step 01")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Name the Gap");
    expect(screen.getByText("Find what's missing.")).toBeInTheDocument();
    expect(screen.getByText("What would change if this worked?")).toBeInTheDocument();
  });

  it("keeps the example in the HTML while closed (forceMount)", () => {
    render(<FrameworkStepCard step={STEP} />);
    expect(screen.getByText(STEP.example)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /See Real-World Example/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles the example open and closed", async () => {
    const user = userEvent.setup();
    render(<FrameworkStepCard step={STEP} />);
    await user.click(screen.getByRole("button", { name: /See Real-World Example/ }));
    expect(screen.getByRole("button", { name: /Hide Real-World Example/ })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: /Hide Real-World Example/ }));
    expect(screen.getByRole("button", { name: /See Real-World Example/ })).toBeInTheDocument();
  });
});
