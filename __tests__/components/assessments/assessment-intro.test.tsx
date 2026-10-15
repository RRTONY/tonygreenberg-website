import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";

const props = {
  title: "Find Your Coffee",
  subtitle: "Your palate, mapped.",
  description: "Fifteen questions about how you taste.",
  stats: { questions: 15, dimensions: 6, minutes: 8 },
  whatYouGet: ["Your flavor profile", "Three origins to try"],
  accentColor: "#8B4513",
};

describe("AssessmentIntro", () => {
  it("shows the title as the H1, the copy, the stats and what you'll discover", () => {
    render(<AssessmentIntro {...props} onBegin={vi.fn()} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Coffee");
    expect(screen.getByText("Your palate, mapped.")).toBeInTheDocument();
    expect(screen.getByText("Fifteen questions about how you taste.")).toBeInTheDocument();
    expect(screen.getByText("15").nextElementSibling).toHaveTextContent("Questions");
    expect(screen.getByText("6").nextElementSibling).toHaveTextContent("Dimensions");
    expect(screen.getByText("~8").nextElementSibling).toHaveTextContent("Minutes");
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["◆Your flavor profile", "◆Three origins to try"]);
  });

  it("calls onBegin when Begin Assessment is clicked", async () => {
    const onBegin = vi.fn();
    const user = userEvent.setup();
    render(<AssessmentIntro {...props} onBegin={onBegin} />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(onBegin).toHaveBeenCalledTimes(1);
  });

  it("only renders a hero image when one is passed", () => {
    const { container, rerender } = render(<AssessmentIntro {...props} onBegin={vi.fn()} />);
    expect(container.querySelector("img")).toBeNull();
    rerender(<AssessmentIntro {...props} onBegin={vi.fn()} heroImage="/hero.jpg" />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/hero.jpg");
  });
});
