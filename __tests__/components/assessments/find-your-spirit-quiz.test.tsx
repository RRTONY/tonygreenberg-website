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

  it("all fourth answers: ethics, society and trajectory max out, The Ethical Humanist then The Embodied Naturalist", async () => {
    const user = userEvent.setup();
    render(<FindYourSpiritQuiz />);
    await walk(user, () => 3);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Ethical Humanist");
    expect(secondary()).toBe("The Embodied Naturalist");
    expect(recordFinish).toHaveBeenCalledWith(
      expect.objectContaining({ assessment: "find-your-spirit", summary: "Primary: The Ethical Humanist; Secondary: The Embodied Naturalist" }),
    );
  });

  it("all third answers: The Embodied Naturalist (592) just ahead of The Mystic Seeker (584)", async () => {
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

  it.fails("BUG: dimensions are capped at 100 (max 12 raw points over 35 questions), so a clear mysticism lead (31 raw vs theism 20) shows The Contemplative Theist instead of The Mystic Seeker", async () => {
    const user = userEvent.setup();
    render(<FindYourSpiritQuiz />);
    await walk(user, (qi) => (qi % 2 === 0 ? 2 : 0));
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Mystic Seeker");
  });
});
