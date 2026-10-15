import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AssessmentPage, { metadata } from "@/app/assessment/page";

describe("/assessment", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Assessment");
    expect(metadata.description).toMatch(/find your next move/);
    expect(metadata.alternates?.canonical).toBe("/assessment");
  });

  it("opens on the first of five questions with its real answer choices", () => {
    const { container } = render(<AssessmentPage />);
    expect(container).toHaveTextContent("Question 1 of 5");
    expect(container).toHaveTextContent("When you see a broken system, your first instinct is to:");
    expect(screen.getByRole("button", { name: "Design something better to replace it" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fund the people who are already fixing it" })).toBeInTheDocument();
  });

  it("moves on to question 2 when an answer is picked", async () => {
    const user = userEvent.setup();
    const { container } = render(<AssessmentPage />);
    await user.click(screen.getByRole("button", { name: "Design something better to replace it" }));
    expect(await screen.findByText(/Question 2 of 5/)).toBeInTheDocument();
    expect(container).not.toHaveTextContent("Question 1 of 5");
  });

  // Each question is the page's H1 while the quiz runs; the archetype name is the H1 on the results screen.
  it("has exactly one H1 at every step, before and after the quiz is finished", async () => {
    const user = userEvent.setup();
    const { container } = render(<AssessmentPage />);
    for (let i = 0; i < 5; i++) {
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(container).toHaveTextContent(`Question ${i + 1} of 5`);
      await user.click(screen.getAllByRole("button")[0]);
    }
    expect(container).not.toHaveTextContent(/Question \d of 5/);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
