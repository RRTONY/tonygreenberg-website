import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FrameworkPage, { metadata } from "@/app/framework/page";

const STEPS = ["Name the Real Problem", "Map the Stakeholders", "Find the Leverage Point", "Design the First Move", "Build the Feedback Loop"];

describe("/framework", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("How I'd Approach Your Problem");
    expect(metadata.description).toMatch(/A 5-step framework for diagnosing complex business problems/);
    expect(metadata.alternates?.canonical).toBe("/framework");
  });

  it("renders one H1 and all five steps in order", () => {
    const { container } = render(<FrameworkPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How I'd Approach Your Problem");
    const text = container.textContent ?? "";
    const positions = STEPS.map((s) => text.indexOf(s));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(container).toHaveTextContent("You can't fix a leak by mopping the floor.");
  });

  it("keeps every collapsed real-world example in the server HTML", () => {
    const { container } = render(<FrameworkPage />);
    expect(container).toHaveTextContent("A Fortune 500 company came to me saying their cloud costs were 40% over budget.");
    expect(container).toHaveTextContent("That metric dropped from 14 weeks to 3 weeks.");
    expect(screen.getAllByRole("button", { name: "See Real-World Example" })).toHaveLength(5);
  });

  it("opens an example when its button is clicked", async () => {
    const user = userEvent.setup();
    render(<FrameworkPage />);
    const example = screen.getByText(/Saved \$4\.8M/);
    const before = example.closest("[data-state]")?.getAttribute("data-state");
    expect(before).toBe("closed");
    await user.click(screen.getAllByRole("button", { name: "See Real-World Example" })[2]);
    expect(example.closest("[data-state]")?.getAttribute("data-state")).toBe("open");
  });

  it("ends with the call to talk it through", () => {
    const { container } = render(<FrameworkPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Want to Apply This to Your Situation?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Pick Up the Phone/ })).toHaveAttribute("href", "/pick-up-the-phone");
    expect(container).toHaveTextContent("The problem is never the problem.");
  });
});
