import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TheMirrorQuiz } from "@/components/assessments/the-mirror-quiz/the-mirror-quiz";
import { MIRROR_QUESTIONS } from "@/lib/content/mirror-data";
import { getFlowLabel } from "@/components/assessments/the-mirror-quiz/data/the-mirror.data";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

describe("TheMirrorQuiz", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("goes intro -> 18 questions -> email gate -> results with the score the answers give", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TheMirrorQuiz articleTitles={{}} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How Far Are YouFrom Yourself?");
    await user.click(screen.getByRole("button", { name: /begin the mirror/i }));

    const byDim: Record<string, number[]> = {};
    for (let i = 0; i < MIRROR_QUESTIONS.length; i++) {
      const q = MIRROR_QUESTIONS[i];
      expect(screen.getByRole("heading", { level: 2, name: q.stem })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${i + 1} / ${MIRROR_QUESTIONS.length}`))).toBeInTheDocument();
      const opt = q.options[q.options.length - 1];
      (byDim[q.dimension] ??= []).push(opt.score);
      await user.click(screen.getByRole("button", { name: opt.text }));
      await act(async () => vi.advanceTimersByTime(400));
    }

    await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    expect(await screen.findByRole("heading", { level: 1, name: "Your Distance From Flow" })).toBeInTheDocument();

    const dims = Object.values(byDim).map((v) => Math.round(v.reduce((a, b) => a + b, 0) / v.length));
    const overall = Math.round(dims.reduce((a, b) => a + b, 0) / dims.length);
    expect(screen.getByText("/ 9").previousElementSibling).toHaveTextContent(String(overall));
    expect(screen.getAllByText(getFlowLabel(overall)).length).toBeGreaterThan(0);
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "the-mirror", score: overall, summary: getFlowLabel(overall) }));
  });

  it("Exit returns to the intro and Previous steps back", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TheMirrorQuiz articleTitles={{}} />);
    await user.click(screen.getByRole("button", { name: /take the assessment/i }));
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: MIRROR_QUESTIONS[0].options[0].text }));
    await act(async () => vi.advanceTimersByTime(400));
    expect(screen.getByRole("heading", { level: 2, name: MIRROR_QUESTIONS[1].stem })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByRole("heading", { level: 2, name: MIRROR_QUESTIONS[0].stem })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /exit/i }));
    expect(screen.getByRole("button", { name: /begin the mirror/i })).toBeInTheDocument();
  });
});
