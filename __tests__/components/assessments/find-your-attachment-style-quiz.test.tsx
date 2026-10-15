import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourAttachmentStyleQuiz } from "@/components/assessments/find-your-attachment-style-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 18;

async function walk(user: ReturnType<typeof userEvent.setup>, pick: (qi: number) => number) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let qi = 0; qi < TOTAL; qi++) {
    const opts = screen.getAllByRole("button");
    expect(opts).toHaveLength(4);
    await user.click(opts[pick(qi)]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}

describe("FindYourAttachmentStyleQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  it("shows the question count on the intro and starts on question 1", async () => {
    const user = userEvent.setup();
    render(<FindYourAttachmentStyleQuiz />);
    expect(screen.getByText(String(TOTAL)).nextElementSibling).toHaveTextContent("Questions");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByText("When a partner is distant, my immediate reaction is to...")).toBeInTheDocument();
  });

  // Each option column scores one style 3 points (the fourth also adds 1 anxiety and 1 avoidance).
  it.each([
    [0, "The Anchor", "Security: 54"],
    [1, "The Seeker", "Anxiety: 54"],
    [2, "The Fortress", "Avoidance: 54"],
    [3, "The Shapeshifter", "Disorganization: 54"],
  ])("always option %i gives %s", async (index, name, tile) => {
    const user = userEvent.setup();
    render(<FindYourAttachmentStyleQuiz />);
    await walk(user, () => index);
    expect(await screen.findByRole("heading", { level: 2, name })).toBeInTheDocument();
    expect(screen.getByText(tile)).toBeInTheDocument();
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-attachment-style", summary: name }));
  });

  it("an even split between secure and anxious answers goes to the anxious style", async () => {
    const user = userEvent.setup();
    render(<FindYourAttachmentStyleQuiz />);
    await walk(user, (qi) => (qi % 2 === 0 ? 0 : 1));
    expect(await screen.findByRole("heading", { level: 2, name: "The Seeker" })).toBeInTheDocument();
    expect(screen.getByText("Security: 27")).toBeInTheDocument();
    expect(screen.getByText("Anxiety: 27")).toBeInTheDocument();
  });
});
