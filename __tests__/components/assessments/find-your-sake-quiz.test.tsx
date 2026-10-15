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

async function walk(user: User, index: number) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`${i + 1} / ${TOTAL}`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button")[index]);
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

  it("shows each dimension out of 10 (raw points / 16, capped) and saves the profile name", async () => {
    // Always the first choice: raw palate 17, ritual 11, terroir 14, philosophy 25, season 13.
    const user = userEvent.setup();
    render(<FindYourSakeQuiz />);
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(score("Ritual")).toBe("6.9");
    expect(score("Terroir")).toBe("8.8");
    expect(score("Season")).toBe("8.1");
    expect(score("Philosophy")).toBe("10");
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

  it.fails("BUG: scores are capped at 10 with a max of 16 raw points, so a clear philosophy lead (25 vs 17) ties palate at 10 and shows The Daiginjo Devotee", async () => {
    const user = userEvent.setup();
    render(<FindYourSakeQuiz />);
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Koji Contemplative");
  });
});
