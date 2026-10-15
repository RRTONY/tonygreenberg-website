import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourReligionQuiz } from "@/components/assessments/find-your-religion-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 20;
type User = ReturnType<typeof userEvent.setup>;
const choices = () => screen.getAllByRole("button").filter((b) => !/exit|previous/i.test(b.textContent ?? ""));

async function walk(user: User, index: number) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`${i + 1} / ${TOTAL}`)).toBeInTheDocument();
    await user.click(choices()[index]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}

describe("FindYourReligionQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });
  it("shows the category and subtext; Previous keeps the earlier choice and Exit goes back to the intro", async () => {
    const user = userEvent.setup();
    render(<FindYourReligionQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getByText("TRANSCENDENCE")).toBeInTheDocument();
    expect(screen.getByText("Not what you were taught. What you actually feel.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument();
    await user.click(choices()[2]);
    expect(screen.getByText(`2 / ${TOTAL}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(choices()[2].className).toContain("bg-brand-gold-light/15");
    await user.click(screen.getByRole("button", { name: /exit/i }));
    expect(screen.getByRole("button", { name: /begin assessment/i })).toBeInTheDocument();
  });

  it("all first answers: transcendence, structure and mysticism hit 100; The Devotee, then The Traditionalist", async () => {
    const user = userEvent.setup();
    render(<FindYourReligionQuiz />);
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Devotee");
    expect(screen.getByText("Your Secondary Archetype").nextElementSibling).toHaveTextContent("The Traditionalist");
  });

  it("all second answers: The Communitarian, then The Mystic", async () => {
    const user = userEvent.setup();
    render(<FindYourReligionQuiz />);
    await walk(user, 1);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Communitarian");
    expect(screen.getByText("Your Secondary Archetype").nextElementSibling).toHaveTextContent("The Mystic");
  });

  it("saves only that the quiz was finished, never the archetype", async () => {
    const user = userEvent.setup();
    render(<FindYourReligionQuiz />);
    await walk(user, 0);
    await screen.findByRole("heading", { level: 1, name: "The Devotee" });
    expect(recordFinish).toHaveBeenCalled();
    for (const [call] of vi.mocked(recordFinish).mock.calls) {
      expect(call.assessment).toBe("find-your-religion");
      expect(call.summary).toBeUndefined();
      expect(call.score).toBeUndefined();
    }
  });

  it("Retake goes back to the intro", async () => {
    const user = userEvent.setup();
    render(<FindYourReligionQuiz />);
    await walk(user, 1);
    await user.click(await screen.findByRole("button", { name: /retake assessment/i }));
    expect(screen.getByRole("button", { name: /begin assessment/i })).toBeInTheDocument();
  });

  it.fails("BUG: each dimension is capped at 100 (max 10 raw points over 20 questions), so a clear embodiment lead (28 raw vs 17) ties others at 100 and shows The Mystic instead of The Grounded", async () => {
    const user = userEvent.setup();
    render(<FindYourReligionQuiz />);
    await walk(user, 3);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Grounded");
  });
});
