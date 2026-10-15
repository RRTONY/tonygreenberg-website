import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourSpiritQuiz } from "@/components/assessments/find-your-spirit-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 35;
type User = ReturnType<typeof userEvent.setup>;
const choices = () => screen.getAllByRole("button").filter((b) => !/exit|previous/i.test(b.textContent ?? ""));

async function walk(user: User, pick: (qi: number) => number) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`${i + 1} / ${TOTAL}`)).toBeInTheDocument();
    await user.click(choices()[pick(i)]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}
const secondary = () => screen.getByText("Your Secondary Tradition").nextElementSibling?.textContent;

describe("FindYourSpiritQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  it("shows the category, Previous and Exit", async () => {
    const user = userEvent.setup();
    render(<FindYourSpiritQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByText("BACKGROUND & HERITAGE")).toBeInTheDocument();
    await user.click(choices()[1]);
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText(`1 / ${TOTAL}`)).toBeInTheDocument();
    expect(choices()[1].className).toContain("bg-brand-gold-light/15");
    await user.click(screen.getByRole("button", { name: /exit/i }));
    expect(screen.getByRole("button", { name: /begin assessment/i })).toBeInTheDocument();
  });

  it("all fourth answers: ethics, society and trajectory lead, The Ethical Humanist then The Embodied Naturalist", async () => {
    const user = userEvent.setup();
    render(<FindYourSpiritQuiz />);
    await walk(user, () => 3);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Ethical Humanist");
    expect(secondary()).toBe("The Embodied Naturalist");
    expect(recordFinish).toHaveBeenCalledWith(
      expect.objectContaining({ assessment: "find-your-spirit", summary: "Primary: The Ethical Humanist; Secondary: The Embodied Naturalist" }),
    );
  });

  it("all third answers: The Embodied Naturalist just ahead of The Mystic Seeker", async () => {
    const user = userEvent.setup();
    render(<FindYourSpiritQuiz />);
    await walk(user, () => 2);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Embodied Naturalist");
    expect(secondary()).toBe("The Mystic Seeker");
  });

  it("Retake resets to the intro", async () => {
    const user = userEvent.setup();
    render(<FindYourSpiritQuiz />);
    await walk(user, () => 0);
    await user.click(await screen.findByRole("button", { name: /retake assessment/i }));
    expect(screen.getByRole("button", { name: /begin assessment/i })).toBeInTheDocument();
  });

  it("a clear mysticism lead (31 raw vs theism 20) shows The Mystic Seeker (fixed: no cap at 100 that hid the lead)", async () => {
    const user = userEvent.setup();
    render(<FindYourSpiritQuiz />);
    await walk(user, (qi) => (qi % 2 === 0 ? 2 : 0));
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Mystic Seeker");
  });

  // One answer set (choice index per question, 0-based) for every tradition, found with a
  // random-answer search over the scoring, so none is unreachable again.
  it.each([
    ["The Contemplative Theist", "0,0,0,0,0,3,0,0,1,2,0,3,0,0,0,2,0,0,0,1,0,0,0,1,0,0,2,0,0,0,0,0,0,0,3"],
    ["The Mystic Seeker", "2,2,1,1,2,2,2,2,1,2,2,0,2,2,2,2,2,0,2,2,2,2,2,2,2,3,2,2,2,3,2,2,0,2,2"],
    ["The Ethical Humanist", "2,2,2,3,1,2,3,3,1,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,3,2"],
    ["The Rooted Reformer", "1,0,2,0,0,2,3,0,1,1,1,0,1,0,1,1,3,1,2,1,3,1,1,1,0,3,0,3,2,0,1,0,3,1,1"],
    ["The Embodied Naturalist", "2,2,1,2,3,2,2,1,3,0,0,2,0,2,0,2,2,2,0,0,2,1,2,2,2,0,2,2,3,2,3,1,0,0,2"],
    ["The Disciplined Practitioner", "3,0,1,3,0,0,0,1,0,0,3,0,1,0,2,3,0,0,0,3,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0"],
  ])("%s is reachable", async (name, answers) => {
    const picks = answers.split(",").map(Number);
    const user = userEvent.setup();
    render(<FindYourSpiritQuiz />);
    await walk(user, (qi) => picks[qi]);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(name);
  });
});
