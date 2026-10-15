import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JourneyFinder } from "@/components/marketing/journey-finder";
import { saveAssessmentResult } from "@/lib/assessments/result-log";

vi.mock("@/lib/assessments/result-log", () => ({ saveAssessmentResult: vi.fn() }));

// The five options on each question, in on-screen order (index 0 = first option).
const choiceButtons = () => screen.getAllByRole("button").filter((b) => !/^(Back|Next|See My Path)$/.test(b.textContent ?? ""));

async function answer(user: ReturnType<typeof userEvent.setup>, picks: number[]) {
  await user.click(screen.getByRole("button", { name: "Begin" }));
  for (const p of picks) {
    await user.click(choiceButtons()[p]);
    await user.click(screen.getByRole("button", { name: /^(Next|See My Path)$/ }));
  }
}

describe("JourneyFinder", () => {
  it("starts on the intro and moves through five questions with progress", async () => {
    const user = userEvent.setup();
    render(<JourneyFinder />);
    await user.click(screen.getByRole("button", { name: "Begin" }));
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("What keeps you up at 2 a.m.");
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    await user.click(choiceButtons()[0]);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  it("Back returns to the previous question with its answer still picked", async () => {
    const user = userEvent.setup();
    render(<JourneyFinder />);
    await user.click(screen.getByRole("button", { name: "Begin" }));
    await user.click(choiceButtons()[2]);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
    expect(choiceButtons()[2]).toHaveClass("bg-brand-gold/10");
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("all-body answers map to The Body Electric with six essay links, and save the result", async () => {
    const user = userEvent.setup();
    render(<JourneyFinder />);
    await answer(user, [3, 3, 3, 3, 3]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Body Electric");
    const essayLinks = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("/blog/"));
    expect(essayLinks).toHaveLength(6);
    expect(saveAssessmentResult).toHaveBeenCalledWith("find-your-journey", { summary: "The Body Electric" });
    expect(screen.getByRole("link", { name: "Explore All Journeys" })).toHaveAttribute("href", "/journeys");
  });

  it("Retake goes back to the intro", async () => {
    const user = userEvent.setup();
    render(<JourneyFinder />);
    await answer(user, [0, 0, 0, 0, 0]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Thinker's Thread");
    await user.click(screen.getByRole("button", { name: "Retake Assessment" }));
    expect(screen.getByRole("button", { name: "Begin" })).toBeInTheDocument();
  });

  // Answers used to be stored under the 1-based step number but scored as
  // 0-based question indexes: every answer was scored against the NEXT
  // question's options and the fifth answer was dropped. Thinker, thinker,
  // then three relationship answers should give Relationship (9 vs 7); the
  // bug gave a 6-6 tie that Thinker won. Fixed 2026-10-16.
  it("every answer counts toward the result (fixed: scoring was off by one question)", async () => {
    const user = userEvent.setup();
    render(<JourneyFinder />);
    await answer(user, [0, 0, 2, 2, 2]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Relationship Circuit");
  });

  // One answer set (option index per question, 0-based) for every journey, checked against all
  // 3,125 possible answer sets, so none is unreachable again.
  it.each([
    ["The Thinker's Thread", [0, 0, 0, 0, 0]],
    ["The Operator's Playbook", [1, 1, 1, 1, 1]],
    ["The Relationship Circuit", [2, 2, 2, 2, 2]],
    ["The Body Electric", [3, 3, 3, 3, 3]],
    ["The Crusade Files", [4, 4, 4, 4, 4]],
    ["The Impact Trail", [0, 0, 4, 1, 4]],
  ])("%s is reachable", async (name, picks) => {
    const user = userEvent.setup();
    render(<JourneyFinder />);
    await answer(user, picks);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(name);
  });

  it("Back then Next keeps every answer on its own question", async () => {
    const user = userEvent.setup();
    render(<JourneyFinder />);
    await user.click(screen.getByRole("button", { name: "Begin" }));
    for (const p of [2, 2]) {
      await user.click(choiceButtons()[p]);
      await user.click(screen.getByRole("button", { name: "Next" }));
    }
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
    expect(choiceButtons()[2]).toHaveClass("bg-brand-gold/10");
    await user.click(screen.getByRole("button", { name: "Next" }));
    for (const p of [2, 2, 2]) {
      await user.click(choiceButtons()[p]);
      await user.click(screen.getByRole("button", { name: /^(Next|See My Path)$/ }));
    }
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Relationship Circuit");
  });
});
