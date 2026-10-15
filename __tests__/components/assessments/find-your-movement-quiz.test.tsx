import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourMovementQuiz } from "@/components/assessments/find-your-movement-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

async function walk(user: ReturnType<typeof userEvent.setup>, index: number) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < 15; i++) {
    const opts = screen.getAllByRole("button");
    expect(opts).toHaveLength(4);
    await user.click(opts[index]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}

describe("FindYourMovementQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });
  it("starts on the intro, then shows the first question", async () => {
    const user = userEvent.setup();
    render(<FindYourMovementQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Movement");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByText("What kind of physical challenge excites you most?")).toBeInTheDocument();
  });

  // Totals per answer column, from the question data:
  // first: Strength 31 / second: Flexibility 22 / third: Endurance 22 / fourth: Mindfulness 13 = Community 13.
  it.each([
    [0, "Strength", "Strength: 31"],
    [1, "Flexibility", "Flexibility: 22"],
    [2, "Endurance", "Endurance: 22"],
  ])("always answer %i: the top dimension is %s", async (index, top, tile) => {
    const user = userEvent.setup();
    render(<FindYourMovementQuiz />);
    await walk(user, index);
    expect(await screen.findByRole("heading", { level: 2, name: `The ${top} Path` })).toBeInTheDocument();
    expect(screen.getByText(tile)).toBeInTheDocument();
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-movement", summary: `The ${top} Path` }));
  });

  it("a tie goes to the dimension listed first (Mindfulness before Community)", async () => {
    const user = userEvent.setup();
    render(<FindYourMovementQuiz />);
    await walk(user, 3);
    expect(await screen.findByRole("heading", { level: 2, name: "The Mindfulness Path" })).toBeInTheDocument();
    expect(screen.getByText("Community: 13")).toBeInTheDocument();
  });
});
