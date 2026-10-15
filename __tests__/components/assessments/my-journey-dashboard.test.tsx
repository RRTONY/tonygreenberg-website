import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyJourneyDashboard } from "@/components/assessments/my-journey-dashboard";
import { JOURNEY_MAP } from "@/components/assessments/journey-tracker";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const KEY = "findyour_journey_progress";
const cards = () => screen.getAllByRole("heading", { level: 3 }).filter((h) => h.closest(".rounded-2xl.p-6"));

describe("MyJourneyDashboard", () => {
  it("starts at 0% with every experience as a Begin card and recommends Find Your Me", () => {
    render(<MyJourneyDashboard />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("My Journey");
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(cards()).toHaveLength(JOURNEY_MAP.length);
    expect(screen.getAllByText("Not Started")).toHaveLength(JOURNEY_MAP.length);
    expect(screen.getByText("Recommended Next").nextElementSibling).toHaveTextContent("Find Your Me");
  });

  it("counts completed experiences and time invested from saved progress", () => {
    localStorage.setItem(KEY, JSON.stringify(["find-your-me", "find-your-diet"]));
    render(<MyJourneyDashboard />);
    const minutes = JOURNEY_MAP.filter((e) => ["find-your-me", "find-your-diet"].includes(e.id)).reduce((s, e) => s + e.estimatedMinutes, 0);
    expect(screen.getByText("Completed").previousElementSibling).toHaveTextContent("2");
    expect(screen.getByText("Time Invested").previousElementSibling).toHaveTextContent(String(minutes));
    expect(screen.getAllByText("Completed. Retake to see detailed results here.")).toHaveLength(2);
    expect(screen.getByText("Recommended Next").nextElementSibling).toHaveTextContent("Find Your Mirror");
  });

  it("filters by category and by status, with an empty-state message in grid view only", async () => {
    localStorage.setItem(KEY, JSON.stringify(["find-your-diet"]));
    const user = userEvent.setup();
    render(<MyJourneyDashboard />);
    await user.click(screen.getByRole("button", { name: "Body & Temple" }));
    expect(cards()).toHaveLength(JOURNEY_MAP.filter((e) => e.category === "body").length);
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(cards().map((h) => h.textContent)).toEqual(["Find Your Diet"]);
    await user.click(screen.getByRole("button", { name: "Taste & Ritual" }));
    expect(screen.getByText("No experiences match your filters.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /timeline/i }));
    expect(screen.queryByText("No experiences match your filters.")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "The Reckoning" })).toBeInTheDocument();
  });

  it("the timeline covers every experience in the journey map", async () => {
    localStorage.setItem(KEY, JSON.stringify(JOURNEY_MAP.map((e) => e.id)));
    const user = userEvent.setup();
    render(<MyJourneyDashboard />);
    await user.click(screen.getByRole("button", { name: /timeline/i }));
    const totals = screen.getAllByText(/^\d+\/\d+$/).map((el) => Number(el.textContent!.split("/")[1]));
    expect(totals.reduce((a, b) => a + b, 0)).toBe(JOURNEY_MAP.length);
  });

  it("shows the completion message and no recommendation at 100%", () => {
    localStorage.setItem(KEY, JSON.stringify(JOURNEY_MAP.map((e) => e.id)));
    render(<MyJourneyDashboard />);
    expect(screen.getByRole("heading", { level: 2, name: "You Found Yourself" })).toBeInTheDocument();
    expect(screen.queryByText("Recommended Next")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /self-portrait/i })).toHaveAttribute("href", "/self-portrait");
  });
});
