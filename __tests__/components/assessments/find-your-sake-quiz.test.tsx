import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourSakeQuiz } from "@/components/assessments/find-your-sake-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 20;
type User = ReturnType<typeof userEvent.setup>;

async function walk(user: User, index: number | number[]) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`${i + 1} / ${TOTAL}`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button")[typeof index === "number" ? index : index[i]]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}
const score = (label: string) => screen.getByText(label, { selector: "div" }).nextElementSibling?.textContent;

describe("FindYourSakeQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  it("shows 20 questions with their subtext after Begin", async () => {
    const user = userEvent.setup();
    render(<FindYourSakeQuiz />);
    expect(screen.getByText(String(TOTAL)).nextElementSibling).toHaveTextContent("Questions");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Close your eyes. What does comfort taste like?");
    expect(screen.getByText("Not the food. The feeling in your mouth.")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("shows each dimension out of 10 (raw points / 43, the most one dimension can get) and saves the profile name", async () => {
    // Always the first choice: raw palate 17, ritual 11, terroir 14, philosophy 25, season 13.
    // (Before the 2026-10-16 fix this was raw / 16 capped at 10: 6.9, 8.8, 8.1, 10.)
    const user = userEvent.setup();
    render(<FindYourSakeQuiz />);
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(score("Palate")).toBe("4");
    expect(score("Ritual")).toBe("2.6");
    expect(score("Terroir")).toBe("3.3");
    expect(score("Season")).toBe("3");
    expect(score("Philosophy")).toBe("5.8");
    const name = screen.getByRole("heading", { level: 1 }).textContent;
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-sake", summary: name }));
  });

  it("Retake the Tasting starts over", async () => {
    const user = userEvent.setup();
    render(<FindYourSakeQuiz />);
    await walk(user, 1);
    await user.click(await screen.findByRole("button", { name: /retake the tasting/i }));
    expect(screen.getByRole("button", { name: /begin assessment/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByText(`1 / ${TOTAL}`)).toBeInTheDocument();
  });

  it("a clear philosophy lead (25 vs 17) shows The Koji Contemplative (fixed: no cap at 10 that tied it with palate)", async () => {
    const user = userEvent.setup();
    render(<FindYourSakeQuiz />);
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Koji Contemplative");
  });

  // One answer set (choice index per question, 0-based) for every profile, found with a
  // random-answer search over the scoring, so none is unreachable again.
  it.each([
    ["The Daiginjo Devotee", [1, 1, 2, 0, 0, 2, 1, 0, 0, 3, 1, 3, 2, 0, 1, 0, 2, 1, 2, 3]],
    ["The Ochoko Ceremonialist", [1, 3, 2, 0, 3, 2, 2, 2, 2, 3, 2, 0, 3, 0, 3, 3, 1, 2, 1, 2]],
    ["The Terroir Pilgrim", [1, 0, 1, 1, 3, 3, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 0]],
    ["The Koji Contemplative", [0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0]],
    ["The Seasonal Drinker", [1, 3, 2, 2, 3, 0, 1, 0, 2, 3, 3, 0, 3, 0, 1, 1, 0, 0, 3, 2]],
  ])("%s is reachable", async (name, answers) => {
    const user = userEvent.setup();
    render(<FindYourSakeQuiz />);
    await walk(user, answers);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(name);
  });
});
